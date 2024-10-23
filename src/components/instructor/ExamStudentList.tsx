import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, update, remove } from 'firebase/database';
import { toast } from 'react-toastify';
import ExamStudentActions from './ExamStudentActions';
import ExamTimeDisplay from './ExamTimeDisplay';
import { Clock, AlertCircle } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface ExamStudent {
  id: string;
  name: string;
  licenseType: string;
  examTime?: string;
  examEndTime?: string;
  order: number;
}

interface ExamStudentListProps {
  instructor: Instructor;
  selectedDay: 'saturday' | 'sunday';
  selectedMonth: string;
}

const EXAM_TIMES = [
  { start: '08:20', end: '08:55' },
  { start: '09:00', end: '09:35' },
  { start: '09:40', end: '10:15' },
  { start: '10:20', end: '10:55' },
  { start: '11:00', end: '11:35' },
  { start: '11:40', end: '12:15' },
  { start: '13:15', end: '13:50' },
  { start: '13:55', end: '14:30' },
  { start: '14:35', end: '15:10' },
  { start: '15:15', end: '15:50' },
  { start: '15:55', end: '16:30' },
  { start: '16:35', end: '17:10' }
];

const ExamStudentList: React.FC<ExamStudentListProps> = ({
  instructor,
  selectedDay,
  selectedMonth,
}) => {
  const [students, setStudents] = useState<ExamStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExamList();
  }, [instructor.id, selectedDay, selectedMonth]);

  const loadExamList = async () => {
    try {
      const examListRef = ref(
        db,
        `examLists/${instructor.id}/${selectedMonth}/${selectedDay}`
      );
      const snapshot = await get(examListRef);
      
      if (snapshot.exists()) {
        const examData = snapshot.val();
        const studentsList = Object.entries(examData).map(([id, student]: [string, any]) => ({
          id,
          ...student,
          examTime: EXAM_TIMES[student.order - 1]?.start,
          examEndTime: EXAM_TIMES[student.order - 1]?.end
        }));
        setStudents(studentsList.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error loading exam list:', error);
      toast.error('Sınav listesi yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveStudent = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === students.length - 1)
    ) {
      return;
    }

    try {
      const newStudents = [...students];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newStudents[index], newStudents[newIndex]] = [
        newStudents[newIndex],
        newStudents[index]
      ];

      // Update order numbers
      newStudents.forEach((student, i) => {
        student.order = i + 1;
        student.examTime = EXAM_TIMES[i]?.start;
        student.examEndTime = EXAM_TIMES[i]?.end;
      });

      const updates: { [key: string]: any } = {};
      newStudents.forEach((student) => {
        updates[`examLists/${instructor.id}/${selectedMonth}/${selectedDay}/${student.id}`] = {
          ...student,
          order: student.order
        };
      });

      await update(ref(db), updates);
      setStudents(newStudents);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Error updating student order:', error);
      toast.error('Sıralama güncellenirken bir hata oluştu');
    }
  };

  const handleChangeDay = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const newDay = selectedDay === 'saturday' ? 'sunday' : 'saturday';
      
      // Remove from current day
      await remove(
        ref(db, `examLists/${instructor.id}/${selectedMonth}/${selectedDay}/${studentId}`)
      );

      // Add to new day
      await update(
        ref(db, `examLists/${instructor.id}/${selectedMonth}/${newDay}/${studentId}`),
        student
      );

      setStudents(students.filter(s => s.id !== studentId));
      toast.success(`Öğrenci ${newDay === 'sunday' ? 'Pazar' : 'Cumartesi'} gününe taşındı`);
    } catch (error) {
      console.error('Error changing student day:', error);
      toast.error('Öğrenci taşınırken bir hata oluştu');
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!window.confirm('Bu öğrenciyi listeden çıkarmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await remove(
        ref(db, `examLists/${instructor.id}/${selectedMonth}/${selectedDay}/${studentId}`)
      );
      setStudents(students.filter(s => s.id !== studentId));
      toast.success('Öğrenci listeden çıkarıldı');
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Öğrenci çıkarılırken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Create array of all slots with assigned students or empty slots
  const examSlots = EXAM_TIMES.map((time, index) => {
    const student = students.find(s => s.order === index + 1);
    return {
      time,
      student,
      index: index + 1
    };
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow divide-y">
        {examSlots.map(({ time, student, index }) => (
          <div
            key={index}
            className="p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                {index}
              </div>
              <div>
                {student ? (
                  <>
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <ExamTimeDisplay
                      startTime={time.start}
                      endTime={time.end}
                      licenseType={student.licenseType}
                    />
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Henüz öğrenci eklenmedi</span>
                    <div className="text-sm text-gray-400">
                      ({time.start} - {time.end})
                    </div>
                  </div>
                )}
              </div>
            </div>
            {student && (
              <ExamStudentActions
                index={students.indexOf(student)}
                totalStudents={students.length}
                selectedDay={selectedDay}
                onMoveUp={() => handleMoveStudent(students.indexOf(student), 'up')}
                onMoveDown={() => handleMoveStudent(students.indexOf(student), 'down')}
                onChangeDay={() => handleChangeDay(student.id)}
                onRemove={() => handleRemoveStudent(student.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamStudentList;