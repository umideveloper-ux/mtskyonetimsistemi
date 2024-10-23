import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import ExamStudentList from './ExamStudentList';

interface ExamListViewProps {
  instructor: {
    id: string;
    name: string;
    school: string;
  };
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const ExamListView: React.FC<ExamListViewProps> = ({ instructor }) => {
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
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
          Cumartesi
        </button>
        <button
          onClick={() => setSelectedDay('sunday')}
          className={`flex-1 py-2 px-4 rounded-lg ${
            selectedDay === 'sunday'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          Pazar
        </button>
      </div>

      <ExamStudentList
        instructor={instructor}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default ExamListView;