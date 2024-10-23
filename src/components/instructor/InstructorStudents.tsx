import React, { useState, useEffect } from 'react';
import { UserCircle2, UserCircle, Phone, Save, Calendar, Download, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { ref, onValue, get, set } from 'firebase/database';

interface InstructorStudentsProps {
  instructor: {
    id: string;
    name: string;
    school: string;
  };
}

interface Student {
  id: string;
  name: string;
  phone: string;
  licenseType: string;
  registrationMonth: string;
  gender: 'male' | 'female';
  instructorId: string;
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const InstructorStudents: React.FC<InstructorStudentsProps> = ({ instructor }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedExamMonth, setSelectedExamMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const schoolsRef = ref(db, 'schools');
        const schoolsSnapshot = await get(schoolsRef);

        if (!schoolsSnapshot.exists()) {
          console.error('No schools found');
          setIsLoading(false);
          return;
        }

        const schools = schoolsSnapshot.val();
        const schoolId = Object.keys(schools).find(
          id => schools[id].name === instructor.school
        );

        if (!schoolId) {
          console.error('School not found:', instructor.school);
          setIsLoading(false);
          return;
        }

        const studentsRef = ref(db, `schools/${schoolId}/candidates`);
        
        const unsubscribe = onValue(studentsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const studentsList = Object.entries(data)
              .map(([id, student]: [string, any]) => ({
                id,
                ...student
              }))
              .filter(student => student.instructorId === instructor.id);
            
            setStudents(studentsList);
            updateStats(studentsList);
          } else {
            setStudents([]);
            updateStats([]);
          }
          setIsLoading(false);
        }, (error) => {
          console.error('Error loading students:', error);
          toast.error('Öğrenci listesi yüklenirken bir hata oluştu');
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Öğrenci listesi yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    if (instructor.id && instructor.school) {
      loadStudents();
    }
  }, [instructor.id, instructor.school]);

  const updateStats = (studentsList: Student[]) => {
    // ... (stats update code remains the same)
  };

  const handleAddToExamList = async () => {
    try {
      const selectedStudentsList = students.filter(s => selectedStudents.includes(s.id));
      const examListRef = ref(db, `examLists/${instructor.school}/${instructor.id}/${selectedExamMonth}`);
      
      // Get existing exam list
      const snapshot = await get(examListRef);
      const existingList = snapshot.exists() ? snapshot.val() : { saturday: [], sunday: [] };
      
      // Add selected students to Saturday list (default)
      const updatedSaturdayList = [
        ...existingList.saturday,
        ...selectedStudentsList.map((student, index) => ({
          id: student.id,
          name: student.name,
          licenseType: student.licenseType,
          order: existingList.saturday.length + index + 1,
          day: 'saturday'
        }))
      ];

      // Update exam list
      await set(examListRef, {
        ...existingList,
        saturday: updatedSaturdayList,
        updatedAt: Date.now()
      });

      toast.success('Seçili öğrenciler sınav listesine eklendi');
      setShowExamModal(false);
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error adding students to exam list:', error);
      toast.error('Öğrenciler sınav listesine eklenirken bir hata oluştu');
    }
  };

  const filteredStudents = students.filter(student => 
    student.registrationMonth === selectedMonth
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats section remains the same */}

      {/* Month Selection and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowExamModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
            disabled={selectedStudents.length === 0}
          >
            <Plus className="h-5 w-5 mr-2" />
            Sınav Listesine Aktar
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.map((student, index) => (
          <div
            key={student.id}
            className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudents([...selectedStudents, student.id]);
                  } else {
                    setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                  }
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">{index + 1}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{student.name}</h3>
                  {student.gender === 'male' ? (
                    <UserCircle2 className="h-5 w-5 text-blue-500" />
                  ) : (
                    <UserCircle className="h-5 w-5 text-pink-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {student.licenseType}
                  </span>
                  <span className="text-sm text-gray-500">{student.phone}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const phoneNumber = student.phone.replace(/\D/g, '');
                window.location.href = `tel:${phoneNumber}`;
                toast.success('Rehbere yönlendiriliyorsunuz...');
              }}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center hover:bg-indigo-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">Ara</span>
            </button>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Bu ay için öğrenci bulunmuyor</p>
          </div>
        )}
      </div>

      {/* Exam Month Selection Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sınav Ayı Seçin
            </h3>
            <select
              value={selectedExamMonth}
              onChange={(e) => setSelectedExamMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-4"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddToExamList}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;