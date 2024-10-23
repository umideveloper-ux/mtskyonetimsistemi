import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bell, 
  DollarSign, 
  FileText, 
  RefreshCw, 
  Trash2, 
  Save,
  Shield,
  MessageSquare,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';
import { db, auth } from '../firebase';
import { ref, push, remove, update, get } from 'firebase/database';
import { toast } from 'react-toastify';
import { LicenseClass, DifferenceClass, CLASS_NAMES } from '../types';

const AdminPanel: React.FC = () => {
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [announcementType, setAnnouncementType] = useState<'meeting' | 'fee_collection' | 'price_update'>('meeting');
  const [licenseFees, setLicenseFees] = useState<{ [key in LicenseClass | DifferenceClass]: number }>({
    B: 0,
    A1: 0,
    A2: 0,
    C: 0,
    D: 0,
    FARK_A1: 0,
    FARK_A2: 0,
    BAKANLIK_A1: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load license fees
        const licenseFeesRef = ref(db, 'licenseFees');
        const licenseFeesSnapshot = await get(licenseFeesRef);
        if (licenseFeesSnapshot.exists()) {
          setLicenseFees(licenseFeesSnapshot.val());
        }

        // Load schools
        const schoolsRef = ref(db, 'schools');
        const schoolsSnapshot = await get(schoolsRef);
        if (schoolsSnapshot.exists()) {
          const schoolsData = Object.entries(schoolsSnapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data,
            hasAccess: data.hasManagementAccess || false
          }));
          setSchools(schoolsData);
        }

        // Load announcements
        const announcementsRef = ref(db, 'announcements');
        const announcementsSnapshot = await get(announcementsRef);
        if (announcementsSnapshot.exists()) {
          const announcementsData = Object.entries(announcementsSnapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          setAnnouncements(announcementsData.sort((a, b) => b.createdAt - a.createdAt));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.trim() === '') return;

    try {
      const announcementsRef = ref(db, 'announcements');
      await push(announcementsRef, {
        content: newAnnouncement,
        type: announcementType,
        createdAt: Date.now(),
      });
      setNewAnnouncement('');
      toast.success('Duyuru başarıyla eklendi.');
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast.error('Duyuru eklenirken bir hata oluştu.');
    }
  };

  const updateLicenseFees = async () => {
    try {
      const licenseFeesRef = ref(db, 'licenseFees');
      await update(licenseFeesRef, licenseFees);
      toast.success('Ehliyet ücretleri başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating license fees:', error);
      toast.error('Ehliyet ücretleri güncellenirken bir hata oluştu.');
    }
  };

  const handleLicenseFeeChange = (licenseClass: LicenseClass | DifferenceClass, newFee: number) => {
    setLicenseFees(prev => ({ ...prev, [licenseClass]: newFee }));
  };

  const resetAllCandidates = async () => {
    if (window.confirm('Tüm adayların sayısını sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        const schoolsRef = ref(db, 'schools');
        const snapshot = await get(schoolsRef);
        if (snapshot.exists()) {
          const updates: { [key: string]: any } = {};
          snapshot.forEach((childSnapshot) => {
            const schoolId = childSnapshot.key;
            updates[`${schoolId}/candidates`] = {
              B: 0,
              A1: 0,
              A2: 0,
              C: 0,
              D: 0,
              FARK_A1: 0,
              FARK_A2: 0,
              BAKANLIK_A1: 0,
            };
          });
          await update(schoolsRef, updates);
          toast.success('Tüm adayların sayısı başarıyla sıfırlandı.');
        }
      } catch (error) {
        console.error('Error resetting candidates:', error);
        toast.error('Adaylar sıfırlanırken bir hata oluştu.');
      }
    }
  };

  const clearChat = async () => {
    if (window.confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        const messagesRef = ref(db, 'messages');
        await remove(messagesRef);
        toast.success('Sohbet geçmişi başarıyla temizlendi.');
      } catch (error) {
        console.error('Error clearing chat:', error);
        toast.error('Sohbet geçmişi temizlenirken bir hata oluştu.');
      }
    }
  };

  const toggleSchoolAccess = async (schoolId: string, currentAccess: boolean) => {
    try {
      await update(ref(db, `schools/${schoolId}`), {
        hasManagementAccess: !currentAccess
      });
      
      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, hasAccess: !currentAccess }
          : school
      ));

      toast.success(`Yönetim paneli erişimi ${!currentAccess ? 'verildi' : 'kaldırıldı'}`);
    } catch (error) {
      console.error('Error toggling school access:', error);
      toast.error('Erişim güncellenirken bir hata oluştu');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      try {
        await remove(ref(db, `announcements/${id}`));
        setAnnouncements(announcements.filter(a => a.id !== id));
        toast.success('Duyuru başarıyla silindi');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Duyuru silinirken bir hata oluştu');
      }
    }
  };

  const editAnnouncement = async (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement(announcement.content);
    setAnnouncementType(announcement.type);
  };

  const updateAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      await update(ref(db, `announcements/${selectedAnnouncement.id}`), {
        content: newAnnouncement,
        type: announcementType,
        updatedAt: Date.now()
      });

      setAnnouncements(announcements.map(a => 
        a.id === selectedAnnouncement.id 
          ? { ...a, content: newAnnouncement, type: announcementType }
          : a
      ));

      setSelectedAnnouncement(null);
      setNewAnnouncement('');
      toast.success('Duyuru başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Duyuru güncellenirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Duyuru Yönetimi */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Duyuru Yönetimi</h2>
        <form onSubmit={selectedAnnouncement ? updateAnnouncement : addAnnouncement} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duyuru İçeriği
            </label>
            <textarea
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
              placeholder="Duyuru metnini buraya girin..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duyuru Tipi
            </label>
            <select
              value={announcementType}
              onChange={(e) => setAnnouncementType(e.target.value as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="meeting">Toplantı</option>
              <option value="fee_collection">Ücretlerin Toplanması</option>
              <option value="price_update">Ehliyet Fiyatlarının Güncellenmesi</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="mr-2 -ml-1 h-5 w-5" />
            {selectedAnnouncement ? 'Güncelle' : 'Duyuru Ekle'}
          </button>
          {selectedAnnouncement && (
            <button
              type="button"
              onClick={() => {
                setSelectedAnnouncement(null);
                setNewAnnouncement('');
              }}
              className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              İptal
            </button>
          )}
        </form>

        {/* Duyuru Listesi */}
        <div className="mt-6 space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-900">{announcement.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(announcement.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editAnnouncement(announcement)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => deleteAnnouncement(announcement.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sürücü Kursu Erişim Yönetimi */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sürücü Kursu Erişim Yönetimi</h2>
        <div className="space-y-4">
          {schools.map((school) => (
            <div key={school.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-lg font-medium">{school.name}</p>
                <p className="text-sm text-gray-500">{school.email}</p>
              </div>
              <button
                onClick={() => toggleSchoolAccess(school.id, school.hasAccess)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  school.hasAccess 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {school.hasAccess ? (
                  <>
                    <Unlock className="mr-2 h-5 w-5" />
                    Erişim Var
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Erişim Yok
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ehliyet Ücretleri */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Ehliyet Ücretleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(CLASS_NAMES).map(([licenseClass, className]) => (
            <div key={licenseClass} className="flex items-center space-x-2">
              <span className="font-medium">{className}:</span>
              <input
                type="number"
                value={licenseFees[licenseClass as LicenseClass | DifferenceClass] || 0}
                onChange={(e) => handleLicenseFeeChange(licenseClass as LicenseClass | DifferenceClass, Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span>TL</span>
            </div>
          ))}
        </div>
        <button
          onClick={updateLicenseFees}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Save className="mr-2 -ml-1 h-5 w-5" />
          Ücretleri Kaydet
        </button>
      </div>

      {/* Sistem İşlemleri */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Sistem İşlemleri</h2>
        <div className="space-y-4">
          <button
            onClick={resetAllCandidates}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCw className="mr-2 -ml-1 h-5 w-5" />
            Tüm Adayları Sıfırla
          </button>
          <button
            onClick={clearChat}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <MessageSquare className="mr-2 -ml-1 h-5 w-5" />
            Sohbeti Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;