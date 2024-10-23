import React from 'react';
import { Clock, X } from 'lucide-react';

interface Lesson {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  licenseType: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface ScheduleListProps {
  schedule: Lesson[];
  onDeleteLesson: (lessonId: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedule, onDeleteLesson }) => {
  if (schedule.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Bu tarih için ders programı bulunmuyor
      </div>
    );
  }

  return (
    <div className="divide-y">
      {schedule.map((lesson) => (
        <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">{lesson.studentName}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {lesson.licenseType}
              </span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.startTime} - {lesson.endTime}
            </div>
          </div>
          <button
            onClick={() => onDeleteLesson(lesson.id)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;