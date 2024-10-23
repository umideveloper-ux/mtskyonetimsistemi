import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';

interface ExamStudentActionsProps {
  index: number;
  totalStudents: number;
  selectedDay: 'saturday' | 'sunday';
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangeDay: () => void;
  onRemove: () => void;
}

const ExamStudentActions: React.FC<ExamStudentActionsProps> = ({
  index,
  totalStudents,
  selectedDay,
  onMoveUp,
  onMoveDown,
  onChangeDay,
  onRemove,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onMoveUp}
        disabled={index === 0}
        className={`p-1 rounded-full ${
          index === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'
        }`}
        title="Yukarı Taşı"
      >
        <ArrowUp size={20} />
      </button>
      <button
        onClick={onMoveDown}
        disabled={index === totalStudents - 1}
        className={`p-1 rounded-full ${
          index === totalStudents - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'
        }`}
        title="Aşağı Taşı"
      >
        <ArrowDown size={20} />
      </button>
      <button
        onClick={onChangeDay}
        className="p-1 rounded-full text-purple-600 hover:bg-purple-50"
        title={`${selectedDay === 'saturday' ? 'Pazar' : 'Cumartesi'} Gününe Taşı`}
      >
        {selectedDay === 'saturday' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
      </button>
      <button
        onClick={onRemove}
        className="p-1 rounded-full text-red-600 hover:bg-red-50"
        title="Listeden Çıkar"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ExamStudentActions;