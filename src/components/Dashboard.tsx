import React, { useState, useEffect } from 'react';
import { School } from '../types';
import AnnouncementsList from './AnnouncementsList';
import DetailedReport from './DetailedReport';
import { auth, db } from '../firebase';
import Footer from './Footer';
import { toast } from 'react-toastify';
import useWindowSize from '../hooks/useWindowSize';
import { ref, onValue } from 'firebase/database';
import DashboardManagement from './management/DashboardManagement';
import AdminPanel from './AdminPanel';
import Navigation from './dashboard/Navigation';
import CandidateManager from './dashboard/CandidateManager';
import { useAppStore } from '../store';
import MobileDashboard from './dashboard/MobileDashboard';

interface DashboardProps {
  school: School;
  onLogout: () => void;
  schools: School[];
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ school, onLogout, schools, updateCandidates }) => {
  const [showManagement, setShowManagement] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [hasManagementAccess, setHasManagementAccess] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const isAdmin = useAppStore((state) => state.currentUser?.role === 'admin');

  useEffect(() => {
    if (!auth.currentUser) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      onLogout();
      return;
    }

    setCurrentUser({
      id: auth.currentUser.uid,
      email: auth.currentUser.email || '',
      role: auth.currentUser.email === 'admin@surucukursu.com' ? 'admin' : 'instructor',
      name: auth.currentUser.displayName || '',
      createdAt: new Date(auth.currentUser.metadata.creationTime || '')
    });

    const managementRef = ref(db, `schools/${school.id}/hasManagementAccess`);
    const unsubscribeManagement = onValue(managementRef, (snapshot) => {
      if (snapshot.exists()) {
        setHasManagementAccess(snapshot.val() || false);
      }
    });

    return () => {
      unsubscribeManagement();
      setCurrentUser(null);
    };
  }, [school.id, onLogout, setCurrentUser]);

  if (isMobile) {
    return <MobileDashboard school={school} updateCandidates={updateCandidates} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        onLogout={onLogout}
        hasManagementAccess={hasManagementAccess}
        onManagementClick={() => setShowManagement(true)}
        onAdminPanelClick={() => setShowAdminPanel(!showAdminPanel)}
        isMobile={isMobile}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AnnouncementsList isAdmin={isAdmin} />
        
        <CandidateManager
          school={school}
          updateCandidates={updateCandidates}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <DetailedReport schools={schools} />
        </div>

        {showManagement && (
          <DashboardManagement
            school={school}
            onClose={() => setShowManagement(false)}
          />
        )}

        {showAdminPanel && (
          <AdminPanel
            isAdmin={isAdmin}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;