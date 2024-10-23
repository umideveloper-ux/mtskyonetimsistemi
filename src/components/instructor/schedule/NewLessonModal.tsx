import React from 'react';
import { X, Save } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  licenseType: string;
  registrationMonth: string;
}

interface NewLessonModalProps {
  students: Student[];
  formData: {
    studentId: string;
    startTime: string;
    endTime: string;
    date: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

const NewLessonModal: React.FC<NewLessonModalProps> = ({
  students,
  formData,
  onClose,
  onSubmit,
  onChange
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Yeni Ders Ekle</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Öğrenci
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => onChange('studentId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Öğrenci Seçin</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.licenseType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tarih
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Başlangıç Saati
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => onChange('startTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bitiş Saati
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => onChange('endTime', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLessonModal;