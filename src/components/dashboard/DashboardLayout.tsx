import React, { useState } from 'react';
import { LogOut, Car, Settings, MessageSquare, X } from 'lucide-react';
import { School } from '../../types';
import DashboardStats from './DashboardStats';
import DashboardCandidates from './DashboardCandidates';
import DashboardQuota from './DashboardQuota';
import Chat from '../Chat';
import AnnouncementsList from '../AnnouncementsList';
import DetailedReport from '../DetailedReport';
import AnalyticsChart from '../AnalyticsChart';
import Footer from '../Footer';
import DashboardManagement from '../management/DashboardManagement';
import AdminPanel from '../AdminPanel';
import useWindowSize from '../../hooks/useWindowSize';
import { auth } from '../../firebase';

interface DashboardLayoutProps {
  school: School;
  schools: School[];
  onLogout: () => void;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  school, 
  schools, 
  onLogout,
  updateCandidates 
}) => {
  const [showManagement, setShowManagement] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isAdmin = auth.currentUser?.email === 'admin@surucukursu.com';

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
              <button
                onClick={() => setShowManagement(true)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <Settings className="mr-2" size={18} />
                <span className="hidden sm:inline">Yönetim Paneli</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
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
        
        <DashboardCandidates 
          school={school}
          updateCandidates={updateCandidates}
        />

        <DashboardStats 
          school={school}
          schools={schools}
        />

        <DashboardQuota schools={schools} />

        <DetailedReport schools={schools} />

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Sohbet</h2>
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <MessageSquare className="mr-2" size={18} />
              {showChat ? 'Gizle' : 'Göster'}
            </button>
          </div>
          {showChat && <Chat currentSchool={school} schools={schools} />}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <AnalyticsChart school={school} />
        </div>

        {showManagement && (
          <DashboardManagement
            school={school}
            onClose={() => setShowManagement(false)}
          />
        )}

        {/* Admin Panel Modal */}
        {showAdminPanel && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] mx-4 overflow-hidden flex flex-col">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Admin Paneli</h2>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <AdminPanel />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;