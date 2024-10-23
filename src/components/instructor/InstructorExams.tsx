import React, { useState, useEffect } from 'react';
import { Send, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { ref, get, set, remove } from 'firebase/database';
import ExamList from './ExamList';
import ExamMonthSelector from './ExamMonthSelector';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface InstructorExamsProps {
  instructor: Instructor;
}

interface Student {
  id: string;
  name: string;
  licenseType: string;
  order: number;
}

const InstructorExams: React.FC<InstructorExamsProps> = ({ instructor }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('tr-TR', { month: 'long' })
  );
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday');
  const [saturdayStudents, setSaturdayStudents] = useState<Student[]>([]);
  const [sundayStudents, setSundayStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExamList();
  }, [selectedMonth, instructor.id]);

  const loadExamList = async () => {
    try {
      const examListRef = ref(db, `examLists/${instructor.school}/${instructor.id}/${selectedMonth}`);
      const snapshot = await get(examListRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSaturdayStudents(data.saturday || []);
        setSundayStudents(data.sunday || []);
      } else {
        setSaturdayStudents([]);
        setSundayStudents([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading exam list:', error);
      toast.error('Sınav listesi yüklenirken bir hata oluştu');
      setIsLoading(false);
    }
  };

  const handleMoveStudent = (index: number, direction: 'up' | 'down') => {
    const currentList = selectedDay === 'saturday' ? saturdayStudents : sundayStudents;
    const setCurrentList = selectedDay === 'saturday' ? setSaturdayStudents : setSundayStudents;
    
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentList.length - 1)
    ) {
      return;
    }

    const newList = [...currentList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    
    setCurrentList(newList);
  };

  const handleSwitchDay = (studentId: string) => {
    const sourceList = selectedDay === 'saturday' ? saturdayStudents : sundayStudents;
    const targetList = selectedDay === 'saturday' ? sundayStudents : saturdayStudents;
    
    const studentIndex = sourceList.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;
    
    const student = sourceList[studentIndex];
    const newSourceList = sourceList.filter(s => s.id !== studentId);
    const newTargetList = [...targetList, student];
    
    if (selectedDay === 'saturday') {
      setSaturdayStudents(newSourceList);
      setSundayStudents(newTargetList);
    } else {
      setSundayStudents(newSourceList);
      setSaturdayStudents(newTargetList);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    if (selectedDay === 'saturday') {
      setSaturdayStudents(prev => prev.filter(s => s.id !== studentId));
    } else {
      setSundayStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  const handleSendList = async () => {
    try {
      const examListRef = ref(db, `examLists/${instructor.school}/${instructor.id}/${selectedMonth}`);
      await set(examListRef, {
        saturday: saturdayStudents,
        sunday: sundayStudents,
        updatedAt: Date.now()
      });
      toast.success('Sınav listesi başarıyla gönderildi!');
    } catch (error) {
      console.error('Error sending exam list:', error);
      toast.error('Sınav listesi gönderilirken bir hata oluştu');
    }
  };

  const handleClearList = async () => {
    if (window.confirm('Sınav listesini temizlemek istediğinizden emin misiniz?')) {
      try {
        const examListRef = ref(db, `examLists/${instructor.school}/${instructor.id}/${selectedMonth}`);
        await remove(examListRef);
        setSaturdayStudents([]);
        setSundayStudents([]);
        toast.success('Sınav listesi temizlendi');
      } catch (error) {
        console.error('Error clearing exam list:', error);
        toast.error('Sınav listesi temizlenirken bir hata oluştu');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <ExamMonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <div className="flex space-x-2">
          <button
            onClick={handleClearList}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Listeyi Temizle
          </button>
          <button
            onClick={handleSendList}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
          >
            <Send className="mr-2 h-5 w-5" />
            Listeyi Gönder
          </button>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedDay('saturday')}
          className={`flex-1 py-2 px-4 rounded-lg ${
            selectedDay === 'saturday'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          Cumartesi ({saturdayStudents.length}/12)
        </button>
        <button
          onClick={() => setSelectedDay('sunday')}
          className={`flex-1 py-2 px-4 rounded-lg ${
            selectedDay === 'sunday'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          Pazar ({sundayStudents.length}/12)
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <ExamList
          students={selectedDay === 'saturday' ? saturdayStudents : sundayStudents}
          day={selectedDay}
          onMoveStudent={handleMoveStudent}
          onSwitchDay={handleSwitchDay}
          onRemoveStudent={handleRemoveStudent}
        />
      </div>
    </div>
  );
};

export default InstructorExams;