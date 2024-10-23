import React from 'react';
import { Calendar } from 'lucide-react';

interface ExamListHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const ExamListHeader: React.FC<ExamListHeaderProps> = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="relative">
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default ExamListHeader;