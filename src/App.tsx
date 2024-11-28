import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import AdminPanel from './components/AdminPanel';
import { School } from './types';
import { updateCandidates, getSchoolsData, onAuthStateChange, signOutUser, ref, onValue } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase';
import { useDevice } from './hooks/useDevice';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface Candidates {
  B: number;
  A1: number;
  A2: number;
  C: number;
  D: number;
  FARK_A1: number;
  FARK_A2: number;
  BAKANLIK_A1: number;
}

const defaultCandidates: Candidates = {
  B: 0,
  A1: 0,
  A2: 0,
  C: 0,
  D: 0,
  FARK_A1: 0,
  FARK_A2: 0,
  BAKANLIK_A1: 0
};

const App: React.FC = () => {
  const { isMobile, isTablet } = useDevice();
  const [loggedInSchool, setLoggedInSchool] = useState<School | null>(null);
  const [loggedInInstructor, setLoggedInInstructor] = useState<Instructor | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChange(async (user) => {
      if (user) {
        try {
          setIsLoading(true);
          const fetchedSchools = await getSchoolsData();
          setSchools(fetchedSchools);
          const userSchool = fetchedSchools.find(school => school.email === user.email);
          if (userSchool) {
            setLoggedInSchool(userSchool);
            
            // Okulun verilerini realtime olarak dinle
            const schoolRef = ref(db, `schools/${userSchool.id}`);
            const unsubscribeSchool = onValue(schoolRef, (snapshot) => {
              if (snapshot.exists()) {
                const schoolData = snapshot.val();
                setLoggedInSchool(prevState => ({
                  ...prevState!,
                  candidates: schoolData.candidates || defaultCandidates
                }));
              }
            });

            return () => {
              unsubscribeSchool();
            };
          } else if (user.email === 'admin@surucukursu.com') {
            setLoggedInSchool({
              id: 'admin',
              name: 'Admin',
              email: 'admin@surucukursu.com',
              candidates: defaultCandidates
            });
          } else {
            setError('Kullanıcı okulu bulunamadı. Lütfen yönetici ile iletişime geçin.');
            await signOutUser();
          }
        } catch (error: any) {
          console.error('Error fetching schools data:', error);
          setError(`Veri yüklenirken bir hata oluştu: ${error.message}`);
          toast.error(`Veri yüklenirken bir hata oluştu: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLoggedInSchool(null);
        setLoggedInInstructor(null);
        setSchools([]);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleLogin = (school: School) => {
    setLoggedInSchool(school);
  };

  const handleInstructorLogin = (instructor: Instructor) => {
    setLoggedInInstructor(instructor);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setLoggedInSchool(null);
      setLoggedInInstructor(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Yeniden Dene
        </button>
        <ToastContainer />
      </div>
    );
  }

  if (loggedInSchool?.id === 'admin') {
    return (
      <div className={`
        ${isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-6'}
        ${isMobile ? 'text-sm' : 'text-base'}
      `}>
        <AdminPanel />
      </div>
    );
  }

  if (loggedInInstructor) {
    return (
      <div className={`
        ${isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-6'}
        ${isMobile ? 'text-sm' : 'text-base'}
      `}>
        <InstructorDashboard
          instructor={loggedInInstructor}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  if (loggedInSchool) {
    return (
      <div className={`
        ${isMobile ? 'p-2' : isTablet ? 'p-4' : 'p-6'}
        ${isMobile ? 'text-sm' : 'text-base'}
      `}>
        <DashboardLayout
          school={loggedInSchool}
          onLogout={handleLogout}
          schools={schools}
          updateCandidates={updateCandidates}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <ToastContainer />
      <Login onLogin={handleLogin} onInstructorLogin={handleInstructorLogin} />
    </div>
  );
};

export default App;