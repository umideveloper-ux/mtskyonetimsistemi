import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Key } from 'lucide-react';
import { db } from '../../firebase';
import { ref, get, set, remove, update } from 'firebase/database';
import { toast } from 'react-toastify';

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  school: string;
  createdAt: number;
}

interface SchoolInstructorManagementProps {
  school: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

const SchoolInstructorManagement: React.FC<SchoolInstructorManagementProps> = ({ school, onClose }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    loadInstructors();
  }, [school.id]);

  const loadInstructors = async () => {
    try {
      const instructorsRef = ref(db, `schools/${school.id}/instructors`);
      const snapshot = await get(instructorsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const instructorsList = Object.entries(data).map(([id, instructor]: [string, any]) => ({
          id,
          ...instructor
        }));
        setInstructors(instructorsList);
      } else {
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error loading instructors:', error);
      toast.error('Eğitmenler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const instructorsRef = ref(db, `schools/${school.id}/instructors`);
      const newInstructor: Omit<Instructor, 'id'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        school: school.name,
        createdAt: Date.now()
      };

      if (editingInstructor) {
        // Güncelleme
        await update(ref(db, `schools/${school.id}/instructors/${editingInstructor.id}`), newInstructor);
        toast.success('Eğitmen başarıyla güncellendi');
      } else {
        // Yeni ekleme
        const newRef = ref(db, `schools/${school.id}/instructors/${Date.now()}`);
        await set(newRef, newInstructor);
        toast.success('Eğitmen başarıyla eklendi');
      }

      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowAddForm(false);
      setEditingInstructor(null);
      loadInstructors();
    } catch (error) {
      console.error('Error saving instructor:', error);
      toast.error('Eğitmen kaydedilirken bir hata oluştu');
    }
  };

  const handleDelete = async (instructorId: string) => {
    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      try {
        await remove(ref(db, `schools/${school.id}/instructors/${instructorId}`));
        toast.success('Eğitmen başarıyla silindi');
        loadInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
        toast.error('Eğitmen silinirken bir hata oluştu');
      }
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setFormData({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      password: instructor.password
    });
    setEditingInstructor(instructor);
    setShowAddForm(true);
  };

  const handleUpdatePassword = async (instructor: Instructor) => {
    const newPassword = window.prompt('Yeni şifre girin:');
    if (newPassword) {
      try {
        await update(ref(db, `schools/${school.id}/instructors/${instructor.id}`), {
          password: newPassword
        });
        toast.success('Şifre başarıyla güncellendi');
        loadInstructors();
      } catch (error) {
        console.error('Error updating password:', error);
        toast.error('Şifre güncellenirken bir hata oluştu');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Eğitmen Yönetimi</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600"
            >
              <Plus size={20} className="mr-2" />
              Yeni Eğitmen Ekle
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">İsim Soyisim</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Şifre</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingInstructor(null);
                    setFormData({ name: '', email: '', phone: '', password: '' });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  {editingInstructor ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                className="bg-white border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{instructor.name}</h3>
                  <p className="text-sm text-gray-600">{instructor.email}</p>
                  <p className="text-sm text-gray-600">{instructor.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdatePassword(instructor)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                    title="Şifre Güncelle"
                  >
                    <Key size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(instructor)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Düzenle"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(instructor.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolInstructorManagement;