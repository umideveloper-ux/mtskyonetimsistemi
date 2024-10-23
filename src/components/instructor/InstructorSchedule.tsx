import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get, push, remove } from 'firebase/database';
import { toast } from 'react-toastify';
import ScheduleHeader from './schedule/ScheduleHeader';
import ScheduleList from './schedule/ScheduleList';
import NewLessonModal from './schedule/NewLessonModal';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface Student {
  id: string;
  name: string;
  licenseType: string;
  registrationMonth: string;
  instructorId: string;
}

interface LessonSchedule {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  licenseType: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const InstructorSchedule: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [schedule, setSchedule] = useState<LessonSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('tr-TR', { month: 'long' })
  );
  const [formData, setFormData] = useState({
    studentId: '',
    startTime: '',
    endTime: '',
    date: selectedDate
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
    loadSchedule();
  }, [instructor.id, selectedDate, selectedMonth]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const schoolsRef = ref(db, 'schools');
      const schoolsSnapshot = await get(schoolsRef);
      
      if (schoolsSnapshot.exists()) {
        const schools = schoolsSnapshot.val();
        const schoolId = Object.keys(schools).find(
          id => schools[id].name === instructor.school
        );

        if (schoolId) {
          const candidatesRef = ref(db, `schools/${schoolId}/candidates`);
          const snapshot = await get(candidatesRef);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            const studentsList = Object.entries(data)
              .map(([id, student]: [string, any]) => ({
                id,
                name: student.name,
                licenseType: student.licenseType,
                registrationMonth: student.registrationMonth,
                instructorId: student.instructorId
              }))
              .filter(student => student.instructorId === instructor.id);
            
            setStudents(studentsList);
          } else {
            setStudents([]);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Öğrenciler yüklenirken bir hata oluştu');
      setIsLoading(false);
    }
  };

  const loadSchedule = async () => {
    try {
      const scheduleRef = ref(db, `schedule/${instructor.id}/${selectedDate}`);
      const snapshot = await get(scheduleRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scheduleList = Object.entries(data).map(([id, lesson]: [string, any]) => ({
          id,
          ...lesson
        }));
        setSchedule(scheduleList.sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        ));
      } else {
        setSchedule([]);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast.error('Program yüklenirken bir hata oluştu');
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.startTime || !formData.endTime) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const student = students.find(s => s.id === formData.studentId);
      if (!student) {
        toast.error('Seçilen öğrenci bulunamadı');
        return;
      }

      const newLesson = {
        studentId: formData.studentId,
        studentName: student.name,
        licenseType: student.licenseType,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'pending',
        createdAt: Date.now()
      };

      const scheduleRef = ref(db, `schedule/${instructor.id}/${formData.date}`);
      await push(scheduleRef, newLesson);
      
      setShowNewLessonForm(false);
      setFormData({
        studentId: '',
        startTime: '',
        endTime: '',
        date: selectedDate
      });
      
      loadSchedule();
      toast.success('Ders programı eklendi');
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Ders eklenirken bir hata oluştu');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) return;

    try {
      await remove(ref(db, `schedule/${instructor.id}/${selectedDate}/${lessonId}`));
      loadSchedule();
      toast.success('Ders silindi');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Ders silinirken bir hata oluştu');
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <ScheduleHeader
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        onMonthChange={setSelectedMonth}
        onDateChange={setSelectedDate}
        onAddLesson={() => setShowNewLessonForm(true)}
      />

      <div className="bg-white rounded-lg shadow-md">
        <ScheduleList
          schedule={schedule}
          onDeleteLesson={handleDeleteLesson}
        />
      </div>

      {showNewLessonForm && (
        <NewLessonModal
          students={students}
          formData={formData}
          onClose={() => setShowNewLessonForm(false)}
          onSubmit={handleAddLesson}
          onChange={handleFormChange}
        />
      )}
    </div>
  );
};

export default InstructorSchedule;