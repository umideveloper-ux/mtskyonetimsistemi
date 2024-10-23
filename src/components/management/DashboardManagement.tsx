import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  School,
  BookOpen,
  Car,
  X,
  Lock
} from 'lucide-react';
import InstructorManagement from './InstructorManagement';
import CandidateManagement from './CandidateManagement';
import ExamManagement from './ExamManagement';
import ProgramManagement from './ProgramManagement';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { toast } from 'react-toastify';

interface DashboardManagementProps {
  school: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

type ManagementView = 'instructors' | 'candidates' | 'exams' | 'program';

const DashboardManagement: React.FC<DashboardManagementProps> = ({ school, onClose }) => {
  const [activeView, setActiveView] = useState<ManagementView>('instructors');
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const schoolRef = ref(db, `schools/${school.id}`);
        const snapshot = await get(schoolRef);
        if (snapshot.exists()) {
          const schoolData = snapshot.val();
          setHasAccess(schoolData.hasManagementAccess || false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking access:', error);
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [school.id]);

  const menuItems = [
    { id: 'instructors', label: 'Eğitmen Yönetimi', icon: Users },
    { id: 'candidates', label: 'Aday Yönetimi', icon: UserPlus },
    { id: 'exams', label: 'Sınav Yönetimi', icon: BookOpen },
    { id: 'program', label: 'Program Yönetimi', icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'instructors':
        return <InstructorManagement school={school} />;
      case 'candidates':
        return <CandidateManagement school={school} />;
      case 'exams':
        return <ExamManagement school={school} />;
      case 'program':
        return <ProgramManagement school={school} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h2>
            <p className="text-gray-600 mb-6">
              Bu sayfaya erişim izniniz yok. Lütfen yapımcı (Haşim Doğan Işık) ile irtibata geçin.
            </p>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-t-lg">
          <div className="flex items-center">
            <Car className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Yönetim Paneli</h2>
              <p className="text-sm opacity-90">{school.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
            >
              {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
              title="Kapat"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ManagementView)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              {renderContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardManagement;