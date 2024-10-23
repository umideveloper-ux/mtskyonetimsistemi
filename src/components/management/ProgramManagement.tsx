import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';

interface ProgramManagementProps {
  school: {
    id: string;
    name: string;
  };
}

interface ScheduleEvent {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
}

const ProgramManagement: React.FC<ProgramManagementProps> = ({ school }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Program Yönetimi</h2>
        <button
          onClick={() => setShowAddEventForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Program
        </button>
      </div>

      {/* Program takvimi ve detayları burada olacak */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Günlük Program</h3>
          </div>
          <div className="flex space-x-2">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium">Henüz program eklenmedi</p>
                <p className="text-sm text-gray-500">Bu güne ait program bulunmuyor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Haftalık Program Görünümü */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Haftalık Program</h3>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-50 rounded-lg p-2 text-center"
            >
              <span className="text-sm text-gray-600">
                {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', {
                  weekday: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramManagement;