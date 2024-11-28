import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { School, LicenseClass, DifferenceClass } from '../../types';

interface CandidateManagerProps {
  school: School;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const CandidateManager: React.FC<CandidateManagerProps> = ({ school, updateCandidates }) => {
  const [showCandidates, setShowCandidates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formCandidates, setFormCandidates] = useState<School['candidates']>(school.candidates || {
    B: 0,
    A1: 0,
    A2: 0,
    C: 0,
    D: 0,
    FARK_A1: 0,
    FARK_A2: 0,
    BAKANLIK_A1: 0
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await updateCandidates(school.id, formCandidates);
      toast.success('Aday sayıları güncellendi');
    } catch (error) {
      console.error('Aday güncelleme hatası:', error);
      toast.error('Aday sayıları güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setFormCandidates(school.candidates || {
    B: 0,
    A1: 0,
    A2: 0,
    C: 0,
    D: 0,
    FARK_A1: 0,
    FARK_A2: 0,
    BAKANLIK_A1: 0
  });

  const handleIncrement = (classType: LicenseClass | DifferenceClass) => {
    setFormCandidates(prev => ({
      ...prev,
      [classType]: (prev[classType] || 0) + 1
    }));
  };

  const handleDecrement = (classType: LicenseClass | DifferenceClass) => {
    setFormCandidates(prev => ({
      ...prev,
      [classType]: Math.max(0, (prev[classType] || 0) - 1)
    }));
  };

  const handleInputChange = (classType: LicenseClass | DifferenceClass, value: string) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    setFormCandidates(prev => ({
      ...prev,
      [classType]: newValue
    }));
  };

  return (
    <div className="bg-white backdrop-blur-sm bg-opacity-90 shadow-2xl rounded-xl p-8 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Aday Sayıları
        </h2>
        <button
          onClick={() => setShowCandidates(!showCandidates)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
        >
          {showCandidates ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M14.707 2.293a1 1 0 010 1.414L3.414 15a1 1 0 01-1.414-1.414L13.293 2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Gizle
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M10 3C5.5 3 2 7.5 2 10c0 2.5 3.5 7 8 7s8-4.5 8-7c0-2.5-3.5-7-8-7zm0 11c-3.5 0-6-3.5-6-5 0-1.5 2.5-5 6-5s6 3.5 6 5c0 1.5-2.5 5-6 5z" clipRule="evenodd" />
              </svg>
              Göster
            </>
          )}
        </button>
      </div>

      {!showCandidates ? (
        <div className="text-gray-500 italic bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Aday sayılarını görüntülemek için "Göster" butonuna tıklayın
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.entries(formCandidates) as [LicenseClass | DifferenceClass, number][]).map(([classType, count]) => (
              <div key={classType} className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-gray-700">{classType}</label>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {count || 0} Aday
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDecrement(classType)}
                    className="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={count || 0}
                    onChange={(e) => handleInputChange(classType, e.target.value)}
                    className="w-20 text-center border border-gray-200 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleIncrement(classType)}
                    className="w-10 h-10 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Sıfırla
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManager;
