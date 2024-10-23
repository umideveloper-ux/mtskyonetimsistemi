import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, UserCircle2, UserCircle, Phone, Edit, Save, X } from 'lucide-react';
import CandidateRegistration from '../school/CandidateRegistration';
import { db } from '../../firebase';
import { ref, onValue, remove, update } from 'firebase/database';
import { toast } from 'react-toastify';

interface CandidateManagementProps {
  school: {
    id: string;
    name: string;
  };
}

interface Candidate {
  id: string;
  name: string;
  phone: string;
  licenseType: string;
  registrationMonth: string;
  gender: 'male' | 'female';
  instructorId?: string;
  createdAt: number;
}

interface Instructor {
  id: string;
  name: string;
}

const CandidateManagement: React.FC<CandidateManagementProps> = ({ school }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    licenseType: '',
    instructorId: ''
  });

  const months = [
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

  useEffect(() => {
    if (!school?.id) return;

    const loadData = () => {
      // Load candidates
      const candidatesRef = ref(db, `schools/${school.id}/candidates`);
      const candidatesUnsubscribe = onValue(candidatesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const candidatesList = Object.entries(data).map(([id, candidate]: [string, any]) => ({
            id,
            ...candidate
          }));
          setCandidates(candidatesList.sort((a, b) => b.createdAt - a.createdAt));
        } else {
          setCandidates([]);
        }
        setIsLoading(false);
      }, (error) => {
        console.error('Error loading candidates:', error);
        toast.error('Adaylar yüklenirken bir hata oluştu');
        setIsLoading(false);
      });

      // Load instructors
      const instructorsRef = ref(db, `schools/${school.id}/instructors`);
      const instructorsUnsubscribe = onValue(instructorsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const instructorsList = Object.entries(data).map(([id, instructor]: [string, any]) => ({
            id,
            name: instructor.name
          }));
          setInstructors(instructorsList);
        } else {
          setInstructors([]);
        }
      });

      return () => {
        candidatesUnsubscribe();
        instructorsUnsubscribe();
      };
    };

    loadData();
  }, [school?.id]);

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!school?.id) return;
    
    if (window.confirm('Bu adayı silmek istediğinizden emin misiniz?')) {
      try {
        await remove(ref(db, `schools/${school.id}/candidates/${candidateId}`));
        toast.success('Aday başarıyla silindi');
      } catch (error) {
        console.error('Error deleting candidate:', error);
        toast.error('Aday silinirken bir hata oluştu');
      }
    }
  };

  const handleEditClick = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setEditForm({
      name: candidate.name,
      phone: candidate.phone,
      licenseType: candidate.licenseType,
      instructorId: candidate.instructorId || ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate || !school?.id) return;

    try {
      const updates = {
        ...editingCandidate,
        ...editForm,
        updatedAt: Date.now()
      };

      await update(ref(db, `schools/${school.id}/candidates/${editingCandidate.id}`), updates);
      toast.success('Aday bilgileri başarıyla güncellendi');
      setEditingCandidate(null);
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast.error('Aday güncellenirken bir hata oluştu');
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (!candidate?.name || !candidate?.phone) return false;
    
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm);
    const matchesMonth = !selectedMonth || candidate.registrationMonth === selectedMonth;
    return matchesSearch && matchesMonth;
  });

  const getGenderIcon = (gender: 'male' | 'female') => {
    return gender === 'male' ? (
      <UserCircle2 className="h-5 w-5 text-blue-500" />
    ) : (
      <UserCircle className="h-5 w-5 text-pink-500" />
    );
  };

  const renderLicenseType = (licenseType: string) => {
    const isAutomatic = licenseType === 'B_AUTO';
    const displayText = isAutomatic ? 'B' : licenseType;
    
    return (
      <div className="flex items-center space-x-1">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {displayText}
        </span>
        {isAutomatic && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            OTOMATİK
          </span>
        )}
      </div>
    );
  };

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
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tüm Aylar</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Aday ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => setShowRegistrationForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Aday
        </button>
      </div>

      {/* Aday Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm || selectedMonth ? 'Arama kriterlerine uygun aday bulunamadı' : 'Henüz aday bulunmuyor'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ehliyet Sınıfı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Ayı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eğitmen
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getGenderIcon(candidate.gender)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderLicenseType(candidate.licenseType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.registrationMonth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{candidate.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {instructors.find(i => i.id === candidate.instructorId)?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(candidate)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRegistrationForm && (
        <CandidateRegistration
          school={school}
          onClose={() => setShowRegistrationForm(false)}
        />
      )}

      {/* Edit Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Aday Düzenle</h3>
              <button
                onClick={() => setEditingCandidate(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İsim Soyisim
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ehliyet Sınıfı
                </label>
                <select
                  value={editForm.licenseType}
                  onChange={(e) => setEditForm({ ...editForm, licenseType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {LICENSE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Eğitmen
                </label>
                <select
                  value={editForm.instructorId}
                  onChange={(e) => setEditForm({ ...editForm, instructorId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Eğitmen Seçin</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
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
      )}
    </div>
  );
};

export default CandidateManagement;