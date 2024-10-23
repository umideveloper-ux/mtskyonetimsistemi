import React, { useState, useEffect } from 'react';
import { X, User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface InstructorLoginProps {
  schoolId: string;
  schoolName: string;
  onClose: () => void;
  onLogin: (instructor: any) => void;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

const InstructorLogin: React.FC<InstructorLoginProps> = ({ schoolId, schoolName, onClose, onLogin }) => {
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const instructorsRef = ref(db, `schools/${schoolId}/instructors`);
        const snapshot = await get(instructorsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const instructorsList = Object.entries(data).map(([id, instructor]: [string, any]) => ({
            id,
            ...instructor
          }));
          setInstructors(instructorsList);
        }
      } catch (error) {
        console.error('Error loading instructors:', error);
        toast.error('Eğitmen listesi yüklenirken bir hata oluştu');
      }
    };

    loadInstructors();
  }, [schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedInstructor || !password) {
      setError('Lütfen eğitmen seçin ve şifrenizi girin');
      return;
    }

    setIsLoading(true);
    try {
      const instructor = instructors.find(i => i.id === selectedInstructor);
      if (instructor && instructor.password === password) {
        onLogin({
          ...instructor,
          school: schoolName
        });
        toast.success('Giriş başarılı!');
        onClose();
      } else {
        throw new Error('Geçersiz kimlik bilgileri');
      }
    } catch (error: any) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      toast.error('Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <User className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {schoolName}
          </h2>
          <p className="mt-2 text-gray-600">Direksiyon Eğitmeni Girişi</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
              Eğitmen Seçin
            </label>
            <div className="mt-1 relative">
              <select
                id="instructor"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Eğitmen Seçin</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
              <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstructorLogin;