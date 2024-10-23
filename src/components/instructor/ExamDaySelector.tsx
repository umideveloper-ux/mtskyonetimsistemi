import React from 'react';

interface ExamDaySelectorProps {
  selectedDay: 'saturday' | 'sunday';
  onDayChange: (day: 'saturday' | 'sunday') => void;
  saturdayCount: number;
  sundayCount: number;
}

const ExamDaySelector: React.FC<ExamDaySelectorProps> = ({
  selectedDay,
  onDayChange,
  saturdayCount,
  sundayCount,
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onDayChange('saturday')}
        className={`flex-1 py-2 px-4 rounded-lg ${
          selectedDay === 'saturday'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600'
        }`}
      >
        Cumartesi ({saturdayCount} Aday)
      </button>
      <button
        onClick={() => onDayChange('sunday')}
        className={`flex-1 py-2 px-4 rounded-lg ${
          selectedDay === 'sunday'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600'
        }`}
      >
        Pazar ({sundayCount} Aday)
      </button>
    </div>
  );
};

export default ExamDaySelector;