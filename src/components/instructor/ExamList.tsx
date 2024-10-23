import React from 'react';
import { ArrowUp, ArrowDown, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

interface ExamListProps {
  students: any[];
  day: 'saturday' | 'sunday';
  onMoveStudent: (index: number, direction: 'up' | 'down') => void;
  onSwitchDay: (studentId: string) => void;
  onRemoveStudent: (studentId: string) => void;
}

const examTimes = [
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
  { start: '16:35', end: '17:10' },
];

const ExamList: React.FC<ExamListProps> = ({
  students,
  day,
  onMoveStudent,
  onSwitchDay,
  onRemoveStudent,
}) => {
  return (
    <div className="space-y-2">
      {examTimes.map((time, index) => {
        const student = students[index];
        const isPlaceholder = !student;

        return (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg ${
              isPlaceholder ? 'bg-gray-100' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">
                {time.start}
              </div>
              <div className="flex-1">
                {isPlaceholder ? (
                  <span className="text-gray-400">Henüz öğrenci eklenmedi</span>
                ) : (
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.licenseType}</p>
                  </div>
                )}
              </div>
            </div>
            
            {!isPlaceholder && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onMoveStudent(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded-full ${
                    index === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ArrowUp size={20} />
                </button>
                <button
                  onClick={() => onMoveStudent(index, 'down')}
                  disabled={index === students.length - 1}
                  className={`p-1 rounded-full ${
                    index === students.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ArrowDown size={20} />
                </button>
                <button
                  onClick={() => onSwitchDay(student.id)}
                  className="p-1 rounded-full text-green-600 hover:bg-green-50"
                >
                  {day === 'saturday' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                  onClick={() => onRemoveStudent(student.id)}
                  className="p-1 rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExamList;