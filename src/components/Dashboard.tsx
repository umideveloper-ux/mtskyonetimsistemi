import React, { useState, useEffect } from 'react';
import { School, LicenseClass, DifferenceClass } from '../types';
import Chat from './Chat';
import AnnouncementsList from './AnnouncementsList';
import { LogOut, Car, Plus, Users, Calculator, MessageSquare, BarChart2, Settings, Info, Minus } from 'lucide-react';
import DetailedReport from './DetailedReport';
import AnalyticsChart from './AnalyticsChart';
import { auth, db } from '../firebase';
import Footer from './Footer';
import { toast } from 'react-toastify';
import useWindowSize from '../hooks/useWindowSize';
import { ref, onValue } from 'firebase/database';
import DashboardManagement from './management/DashboardManagement';
import AdminPanel from './AdminPanel';

interface DashboardProps {
  school: School;
  onLogout: () => void;
  schools: School[];
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ school, onLogout, schools, updateCandidates }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showQuota, setShowQuota] = useState(false);
  const { width } = useWindowSize();
  const [hasManagementAccess, setHasManagementAccess] = useState(false);

  const isMobile = width < 768;
  const isAdmin = auth.currentUser?.email === 'admin@surucukursu.com';

  useEffect(() => {
    if (!auth.currentUser) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      onLogout();
      return;
    }

    // Check management access
    const managementAccessRef = ref(db, `schools/${school.id}`);
    const unsubscribeAccess = onValue(managementAccessRef, (snapshot) => {
      if (snapshot.exists()) {
        const schoolData = snapshot.val();
        setHasManagementAccess(schoolData.hasManagementAccess || false);
      }
    });

    const licenseFeesRef = ref(db, 'licenseFees');
    const schoolsRef = ref(db, 'schools');

    const updateData = () => {
      const licenseFeesListener = onValue(licenseFeesRef, (snapshot) => {
        if (snapshot.exists()) {
          setLicenseFees(snapshot.val());
        }
      });

      const schoolsListener = onValue(schoolsRef, (snapshot) => {
        if (snapshot.exists()) {
          const schoolsData = snapshot.val();
          const updatedSchoolsList = Object.entries(schoolsData).map(([id, schoolData]: [string, any]) => ({
            id,
            name: schoolData.name,
            email: schoolData.email,
            candidates: schoolData.candidates || {},
          }));
          setUpdatedSchools(updatedSchoolsList);
        }
      });

      return () => {
        licenseFeesListener();
        schoolsListener();
      };
    };

    const initialUnsubscribe = updateData();
    const intervalId = setInterval(updateData, 10000);

    return () => {
      unsubscribeAccess();
      initialUnsubscribe();
      clearInterval(intervalId);
    };
  }, [onLogout, school.id]);

  const handleCandidateChange = async (licenseClass: LicenseClass | DifferenceClass, change: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCandidates = {
        ...school.candidates,
        [licenseClass]: Math.max(0, (school.candidates[licenseClass] || 0) + change)
      };
      await updateCandidates(school.id, updatedCandidates);
      toast.success('Aday sayısı başarıyla güncellendi.');
    } catch (error: any) {
      console.error('Error updating candidates:', error);
      setError('Aday sayısı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Aday sayısı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setShowChat(!showChat);
  const toggleAdminPanel = () => setShowAdminPanel(!showAdminPanel);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Car className="h-8 w-8 text-indigo-600" />
                <span className={`ml-2 text-xl font-bold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                  Aday Takip Sistemi
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {(hasManagementAccess || isAdmin) && (
                <button
                  onClick={() => setShowManagement(true)}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <Settings className="mr-2" size={18} />
                  <span className="hidden sm:inline">Yönetim Paneli</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={toggleAdminPanel}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <Settings className="mr-2" size={18} />
                  <span className="hidden sm:inline">Admin Paneli</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <LogOut className="mr-2" size={18} />
                <span className="hidden sm:inline">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AnnouncementsList isAdmin={isAdmin} />

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Aday Sayıları</h2>
            <button
              onClick={() => setShowCandidates(!showCandidates)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              {showCandidates ? <Minus size={20} /> : <Plus size={20} />}
              <span className="ml-2">{showCandidates ? 'Gizle' : 'Göster'}</span>
            </button>
          </div>
          {!showCandidates && (
            <div className="text-gray-600 italic flex items-center">
              <Info size={18} className="mr-2" />
              <span>Aday sayılarını görüntülemek ve düzenlemek için "Göster" butonuna tıklayın.</span>
            </div>
          )}
          {showCandidates && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(school.candidates).map(([classType, count]) => (
                <div key={classType} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">{classType}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{count || 0}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, -1)}
                        className="bg-red-500 text-white p-2 rounded-full"
                        disabled={isLoading}
                      >
                        <Minus size={20} />
                      </button>
                      <button
                        onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, 1)}
                        className="bg-green-500 text-white p-2 rounded-full"
                        disabled={isLoading}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DetailedReport schools={schools} />

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sohbet</h2>
            <button
              onClick={toggleChat}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <MessageSquare className="mr-2" size={18} />
              {showChat ? 'Gizle' : 'Göster'}
            </button>
          </div>
          {showChat && <Chat currentSchool={school} schools={schools} />}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analitik</h2>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <BarChart2 className="mr-2" size={18} />
              {showAnalytics ? 'Gizle' : 'Göster'}
            </button>
          </div>
          {showAnalytics && <AnalyticsChart school={school} />}
        </div>

        {showManagement && (
          <DashboardManagement
            school={school}
            onClose={() => setShowManagement(false)}
          />
        )}

        {showAdminPanel && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] mx-4 overflow-y-auto">
              <AdminPanel />
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;