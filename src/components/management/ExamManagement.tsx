import React, { useState } from 'react';
import { Calendar, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExamManagementProps {
  school: {
    id: string;
    name: string;
  };
}

const ExamManagement: React.FC<ExamManagementProps> = ({ school }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sınav Yönetimi</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">
            {selectedDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sınav takvimi ve detayları burada olacak */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">Sınav yönetimi yakında eklenecek...</p>
      </div>
    </div>
  );
};

export default ExamManagement;