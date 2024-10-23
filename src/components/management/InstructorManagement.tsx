import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save } from 'lucide-react';
import { db } from '../../firebase';
import { ref, get, set, remove, update } from 'firebase/database';
import { toast } from 'react-toastify';

interface InstructorManagementProps {
  school: {
    id: string;
    name: string;
  };
}

interface Instructor {
  id: string;
  name: string;
  password: string;
  createdAt: number;
}

const InstructorManagement: React.FC<InstructorManagementProps> = ({ school }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  useEffect(() => {
    if (school?.id) {
      loadInstructors();
    }
  }, [school.id]);

  const loadInstructors = async () => {
    try {
      setIsLoading(true);
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

  // İsimden kullanıcı adı oluştur (Türkçe karakterleri değiştir ve boşlukları kaldır)
  const createUsernameFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const username = createUsernameFromName(formData.name);
      
      if (editingInstructor) {
        // Güncelleme işlemi
        await update(ref(db, `schools/${school.id}/instructors/${editingInstructor.id}`), {
          name: formData.name,
          username,
          password: formData.password,
          updatedAt: Date.now()
        });
        toast.success('Eğitmen başarıyla güncellendi');
      } else {
        // Yeni ekleme işlemi
        const newInstructor = {
          name: formData.name,
          username,
          password: formData.password,
          createdAt: Date.now()
        };
        const instructorRef = ref(db, `schools/${school.id}/instructors/${Date.now()}`);
        await set(instructorRef, newInstructor);
        toast.success('Eğitmen başarıyla eklendi');
      }
      
      setShowAddForm(false);
      setEditingInstructor(null);
      setFormData({ name: '', password: '' });
      await loadInstructors();
    } catch (error) {
      console.error('Error saving instructor:', error);
      toast.error(editingInstructor ? 'Eğitmen güncellenirken bir hata oluştu' : 'Eğitmen eklenirken bir hata oluştu');
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.name,
      password: instructor.password
    });
    setShowAddForm(true);
  };

  const handleDelete = async (instructorId: string) => {
    if (window.confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      try {
        await remove(ref(db, `schools/${school.id}/instructors/${instructorId}`));
        toast.success('Eğitmen başarıyla silindi');
        await loadInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
        toast.error('Eğitmen silinirken bir hata oluştu');
      }
    }
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Eğitmen ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => {
            setEditingInstructor(null);
            setFormData({ name: '', password: '' });
            setShowAddForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Eğitmen
        </button>
      </div>

      {/* Instructor List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredInstructors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Henüz eğitmen bulunmuyor
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eğitmen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şifre
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {instructor.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {instructor.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{createUsernameFromName(instructor.name)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">••••••</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(instructor)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Düzenle"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(instructor.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingInstructor ? 'Eğitmen Düzenle' : 'Yeni Eğitmen Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingInstructor(null);
                  setFormData({ name: '', password: '' });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
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
                {formData.name && (
                  <p className="mt-1 text-sm text-gray-500">
                    Kullanıcı adı: {createUsernameFromName(formData.name)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingInstructor(null);
                    setFormData({ name: '', password: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editingInstructor ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManagement;