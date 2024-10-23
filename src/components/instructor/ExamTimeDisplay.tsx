import React from 'react';
import { Clock } from 'lucide-react';

interface ExamTimeDisplayProps {
  startTime: string;
  endTime: string;
  licenseType?: string;
}

const ExamTimeDisplay: React.FC<ExamTimeDisplayProps> = ({ startTime, endTime, licenseType }) => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <Clock className="h-4 w-4" />
      <span>{startTime} - {endTime}</span>
      {licenseType && (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {licenseType}
        </span>
      )}
    </div>
  );
};

export default ExamTimeDisplay;