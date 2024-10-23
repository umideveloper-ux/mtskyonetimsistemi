import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import { School } from './types';
import { updateCandidates, getSchoolsData, listenToSchoolsData, onAuthStateChange, signOutUser } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

const App: React.FC = () => {
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
          } else if (user.email === 'admin@surucukursu.com') {
            setLoggedInSchool({
              id: 'admin',
              name: 'Admin',
              email: 'admin@surucukursu.com',
              candidates: {}
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
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
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

  return (
    <div className="App">
      {loggedInSchool ? (
        <DashboardLayout
          school={loggedInSchool}
          onLogout={handleLogout}
          schools={schools}
          updateCandidates={updateCandidates}
        />
      ) : loggedInInstructor ? (
        <InstructorDashboard
          instructor={loggedInInstructor}
          onLogout={handleLogout}
        />
      ) : (
        <Login 
          onLogin={handleLogin}
          onInstructorLogin={handleInstructorLogin}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;