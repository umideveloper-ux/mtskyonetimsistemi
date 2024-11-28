import React, { useState } from 'react';
import { School, LicenseClass, DifferenceClass, CLASS_NAMES } from '../../types';
import { toast } from 'react-toastify';

interface DashboardCandidatesProps {
  school: School;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const DashboardCandidates: React.FC<DashboardCandidatesProps> = ({ school, updateCandidates }) => {
  const [showCandidates, setShowCandidates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCandidateChange = async (licenseClass: LicenseClass | DifferenceClass, change: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const currentCount = school.candidates[licenseClass] || 0;
      const newCount = Math.max(0, currentCount + change);
      
      const updatedCandidates = {
        ...school.candidates,
        [licenseClass]: newCount
      };
      
      await updateCandidates(school.id, updatedCandidates);
      toast.success('Aday sayısı güncellendi');
    } catch (error) {
      console.error('Error updating candidates:', error);
      toast.error('Aday sayısı güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Aday Sayıları</h2>
        <button
          onClick={() => setShowCandidates(!showCandidates)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showCandidates ? 'Gizle' : 'Göster'}
        </button>
      </div>

      {!showCandidates ? (
        <div className="text-center text-gray-500 py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Aday sayılarını görüntülemek için "Göster" butonuna tıklayın
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(school.candidates).map(([classType, count]) => (
            <div
              key={classType}
              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{classType}</h3>
                  <p className="text-sm text-gray-500">{CLASS_NAMES[classType as LicenseClass | DifferenceClass]}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {count}
                </span>
              </div>
              
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, -1)}
                  disabled={isLoading || count === 0}
                  className={`flex-1 p-2 rounded ${
                    count === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  } transition-colors`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleCandidateChange(classType as LicenseClass | DifferenceClass, 1)}
                  disabled={isLoading}
                  className="flex-1 p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded transition-colors"
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCandidates;