import React, { useState, useEffect } from 'react';
import { X, Save, UserCircle2, UserCircle } from 'lucide-react';
import { db } from '../../firebase';
import { ref, push, get } from 'firebase/database';
import { toast } from 'react-toastify';

interface CandidateRegistrationProps {
  school: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

interface Candidate {
  name: string;
  phone: string;
  licenseType: string;
  registrationMonth: string;
  gender: 'male' | 'female';
  instructorId?: string;
}

interface Instructor {
  id: string;
  name: string;
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const LICENSE_TYPES = [
  { value: 'B', label: 'B' },
  { value: 'B_AUTO', label: 'B Otomatik' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' }
];

const CandidateRegistration: React.FC<CandidateRegistrationProps> = ({ school, onClose }) => {
  const [formData, setFormData] = useState<Candidate>({
    name: '',
    phone: '',
    licenseType: '',
    registrationMonth: MONTHS[new Date().getMonth()],
    gender: 'male'
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const instructorsRef = ref(db, `schools/${school.id}/instructors`);
        const snapshot = await get(instructorsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const instructorsList = Object.entries(data).map(([id, instructor]: [string, any]) => ({
            id,
            name: instructor.name
          }));
          setInstructors(instructorsList);
        }
      } catch (error) {
        console.error('Error loading instructors:', error);
        toast.error('Eğitmenler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    loadInstructors();
  }, [school.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.licenseType || !formData.registrationMonth) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    try {
      const candidatesRef = ref(db, `schools/${school.id}/candidates`);
      await push(candidatesRef, {
        ...formData,
        createdAt: Date.now(),
        schoolId: school.id,
        schoolName: school.name
      });

      toast.success('Aday başarıyla kaydedildi');
      onClose();
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error('Aday kaydedilirken bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Yeni Aday Kaydı</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              İsim Soyisim
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ehliyet Sınıfı
            </label>
            <select
              value={formData.licenseType}
              onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {LICENSE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kayıt Ayı
            </label>
            <select
              value={formData.registrationMonth}
              onChange={(e) => setFormData({ ...formData, registrationMonth: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cinsiyet
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 flex items-center">
                  <UserCircle2 className="h-5 w-5 text-blue-500 mr-1" />
                  Erkek
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="form-radio h-4 w-4 text-pink-600"
                />
                <span className="ml-2 flex items-center">
                  <UserCircle className="h-5 w-5 text-pink-500 mr-1" />
                  Kadın
                </span>
              </label>
            </div>
          </div>

          {instructors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Atanacak Eğitmen
              </label>
              <select
                value={formData.instructorId || ''}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seçiniz</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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

export default CandidateRegistration;