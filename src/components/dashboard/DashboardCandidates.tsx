import React, { useState } from 'react';
import { Plus, Minus, Info } from 'lucide-react';
import { School, LicenseClass, DifferenceClass } from '../../types';
import { toast } from 'react-toastify';

interface DashboardCandidatesProps {
  school: School;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const DashboardCandidates: React.FC<DashboardCandidatesProps> = ({ school, updateCandidates }) => {
  const [showCandidates, setShowCandidates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCandidateChange = async (licenseClass: LicenseClass | DifferenceClass, change: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCandidates = {
        ...school.candidates,
        [licenseClass]: Math.max(0, (school.candidates[licenseClass] || 0) + change)
      };
      await updateCandidates(school.id, updatedCandidates);
      toast.success('Aday sayısı başarıyla güncellendi.');
    } catch (error: any) {
      console.error('Error updating candidates:', error);
      setError('Aday sayısı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Aday sayısı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Aday Sayıları</h2>
        <button
          onClick={() => setShowCandidates(!showCandidates)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {showCandidates ? <Minus size={20} /> : <Plus size={20} />}
          <span className="ml-2">{showCandidates ? 'Gizle' : 'Göster'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!showCandidates && (
        <div className="text-gray-600 italic flex items-center">
          <Info size={18} className="mr-2" />
          <span>Aday sayılarını görüntülemek ve düzenlemek için "Göster" butonuna tıklayın.</span>
        </div>
      )}

      {showCandidates && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(school.candidates).map(([classType, count]) => (
            <div key={classType} className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{classType}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{count || 0}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, -1)}
                    className="bg-red-500 text-white p-2 rounded-full"
                    disabled={isLoading}
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, 1)}
                    className="bg-green-500 text-white p-2 rounded-full"
                    disabled={isLoading}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCandidates;