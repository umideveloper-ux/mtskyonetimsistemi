import React from 'react';
import { Calendar } from 'lucide-react';

interface ExamMonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const months = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const ExamMonthSelector: React.FC<ExamMonthSelectorProps> = ({
  selectedMonth,
  onMonthChange,
}) => {
  return (
    <div className="relative">
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month} Dönemi
          </option>
        ))}
      </select>
      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default ExamMonthSelector;