import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import AdminPanel from './components/AdminPanel';
import { School, InstructorWithoutCredentials, LicenseClass, DifferenceClass } from './types';
import { auth } from './firebase/firebase.config';
import { signOutUser } from './firebase/auth';
import { getSchoolsData, getSchoolByEmail, updateCandidates, subscribeToSchool } from './firebase/firebaseUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDevice } from './hooks/useDevice';
import { predefinedSchools } from './config/schools';

interface Candidates {
  [key: string]: {
    id: string;
    name: string;
    courseType: LicenseClass | DifferenceClass;
    status: 'active' | 'completed' | 'pending';
    createdAt: string;
    updatedAt: string;
  };
}

const defaultCandidates: Candidates = {};

const App: React.FC = () => {
  const { isMobile, isTablet } = useDevice();
  const [loggedInSchool, setLoggedInSchool] = useState<School | null>(null);
  const [loggedInInstructor, setLoggedInInstructor] = useState<InstructorWithoutCredentials | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setIsLoading(true);
          setError(null);

          if (user.email === 'admin@surucukursu.com') {
            setLoggedInSchool({
              id: 'admin',
              name: 'Admin',
              email: 'admin@surucukursu.com',
              candidates: defaultCandidates
            });

            // Admin için tüm okulların verilerini al
            const allSchools = await Promise.all(
              predefinedSchools.map(async (school) => {
                const schoolData = await getSchoolsData(school.id);
                return schoolData || school;
              })
            );
            setSchools(allSchools.filter(Boolean));
          } else {
            const userSchool = await getSchoolByEmail(user.email || '');
            
            if (userSchool) {
              setLoggedInSchool(userSchool);
              
              // Okulun verilerini realtime olarak dinle
              const unsubscribeSchool = subscribeToSchool(userSchool.id, (schoolData) => {
                setLoggedInSchool(prevState => {
                  if (!prevState) return null;
                  return {
                    ...prevState,
                    ...schoolData,
                    id: prevState.id,
                    candidates: {
                      ...prevState.candidates,
                      ...(schoolData.candidates || {})
                    }
                  };
                });
              });

              return () => {
                unsubscribeSchool();
              };
            } else {
              setError('Kullanıcı okulu bulunamadı. Lütfen yönetici ile iletişime geçin.');
              await signOutUser();
            }
          }
        } catch (error: any) {
          console.error('Error in auth state change:', error);
          setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
          await signOutUser();
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

    return () => unsubscribeAuth();
  }, []);

  const handleLogin = (school: School) => {
    setLoggedInSchool(school);
  };

  const handleInstructorLogin = (instructor: InstructorWithoutCredentials) => {
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
        <AdminPanel isAdmin={true} onClose={handleLogout} />
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