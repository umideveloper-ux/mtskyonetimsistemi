import React from 'react';
import { Plus } from 'lucide-react';

interface ScheduleHeaderProps {
  selectedMonth: string;
  selectedDate: string;
  onMonthChange: (month: string) => void;
  onDateChange: (date: string) => void;
  onAddLesson: () => void;
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  selectedMonth,
  selectedDate,
  onMonthChange,
  onDateChange,
  onAddLesson
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>{month} Dönemi</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        onClick={onAddLesson}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
      >
        <Plus className="h-5 w-5 mr-2" />
        Yeni Ders Ekle
      </button>
    </div>
  );
};

export default ScheduleHeader;