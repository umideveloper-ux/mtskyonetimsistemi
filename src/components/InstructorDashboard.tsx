// Previous imports remain the same, but we'll replace Male/Female with correct icons
import { 
  Calendar, 
  Clock, 
  Users, 
  LogOut, 
  CheckCircle, 
  XCircle,
  Car,
  User,
  FileText,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCircle2, // Replace Male
  UserCircle // Replace Female
} from 'lucide-react';

// ... rest of the imports remain the same

// Update the icon usage in the component
const renderStudentStats = () => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    {/* ... other stats remain the same */}
    <div className="bg-indigo-50 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-indigo-700">Erkek</span>
        <UserCircle2 className="h-5 w-5 text-indigo-500" />
      </div>
      <p className="text-2xl font-bold text-indigo-700">{maleStudents}</p>
    </div>
    <div className="bg-purple-50 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-purple-700">Kadın</span>
        <UserCircle className="h-5 w-5 text-purple-500" />
      </div>
      <p className="text-2xl font-bold text-purple-700">{femaleStudents}</p>
    </div>
    {/* ... rest of the stats remain the same */}
  </div>
);

// Update student list rendering
const renderStudentsList = () => (
  <div className="space-y-4">
    {renderStudentStats()}
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-lg mb-4">Aktif Öğrenciler</h3>
      <div className="space-y-4">
        {mockStudents.map((student) => (
          <div key={student.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  {student.gender === 'male' ? (
                    <UserCircle2 className="h-5 w-5 ml-2 text-blue-500" />
                  ) : (
                    <UserCircle className="h-5 w-5 ml-2 text-pink-500" />
                  )}
                </div>
                {/* ... rest of the student card remains the same */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ... rest of the component remains the same