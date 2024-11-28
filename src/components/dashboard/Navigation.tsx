import React from 'react';
import { Car, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '../../store';

interface NavigationProps {
  onLogout: () => void;
  hasManagementAccess: boolean;
  onManagementClick: () => void;
  onAdminPanelClick: () => void;
  isMobile: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  onLogout,
  hasManagementAccess,
  onManagementClick,
  onAdminPanelClick,
  isMobile,
}) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const isAdmin = currentUser?.email === 'admin@surucukursu.com';

  return (
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
                onClick={onManagementClick}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <Settings className="mr-2" size={18} />
                <span className="hidden sm:inline">Yönetim Paneli</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={onAdminPanelClick}
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
  );
};

export default Navigation;
