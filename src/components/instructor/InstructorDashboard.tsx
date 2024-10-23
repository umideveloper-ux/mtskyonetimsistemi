import React, { useState } from 'react';
import { 
  Calendar, 
  LogOut,
  Car,
  Users,
  ClipboardList
} from 'lucide-react';
import InstructorSchedule from './InstructorSchedule';
import InstructorStudents from './InstructorStudents';
import InstructorExams from './InstructorExams';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface InstructorDashboardProps {
  instructor: Instructor;
  onLogout: () => void;
}

type ActiveView = 'students' | 'schedule' | 'exams';

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ instructor, onLogout }) => {
  const [activeView, setActiveView] = useState<ActiveView>('students');

  const menuItems = [
    { id: 'students', label: 'Öğrenciler', icon: Users },
    { id: 'schedule', label: 'Program', icon: Calendar },
    { id: 'exams', label: 'Sınav Listeleri', icon: ClipboardList },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'students':
        return <InstructorStudents instructor={instructor} />;
      case 'schedule':
        return <InstructorSchedule instructor={instructor} />;
      case 'exams':
        return <InstructorExams instructor={instructor} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-lg font-bold text-gray-800">
                {instructor.name}
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full flex items-center text-sm"
              >
                <LogOut className="mr-1" size={16} />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-20 px-4">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`flex flex-col items-center py-2 px-3 ${
                activeView === item.id 
                  ? 'text-indigo-600 border-t-2 border-indigo-600' 
                  : 'text-gray-600'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;