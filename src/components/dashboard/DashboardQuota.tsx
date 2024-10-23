import React, { useState } from 'react';
import { Plus, Minus, Info } from 'lucide-react';
import { School } from '../../types';

interface DashboardQuotaProps {
  schools: School[];
}

const DashboardQuota: React.FC<DashboardQuotaProps> = ({ schools }) => {
  const [showQuota, setShowQuota] = useState(false);

  const getQuotaInfo = (school: School) => {
    const bQuota = 30 - (Number(school.candidates['B']) || 0);
    const differenceQuota = 15 - (
      (Number(school.candidates['FARK_A1']) || 0) + 
      (Number(school.candidates['FARK_A2']) || 0) + 
      (Number(school.candidates['BAKANLIK_A1']) || 0)
    );
    return { bQuota, differenceQuota };
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Boş Kontenjan Bilgisi</h2>
        <button
          onClick={() => setShowQuota(!showQuota)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {showQuota ? <Minus size={20} /> : <Plus size={20} />}
          <span className="ml-2">{showQuota ? 'Gizle' : 'Göster'}</span>
        </button>
      </div>

      {!showQuota && (
        <div className="text-gray-600 italic flex items-center">
          <Info size={18} className="mr-2" />
          <span>Boş kontenjan bilgilerini görüntülemek için "Göster" butonuna tıklayın.</span>
        </div>
      )}

      {showQuota && (
        <div className="space-y-4">
          {schools.map((s) => {
            const { bQuota, differenceQuota } = getQuotaInfo(s);
            return (
              <div key={s.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{s.name}</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-gray-700">B Sınıfı Boş Kontenjan:</p>
                    <p className={`text-2xl font-bold ${bQuota > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bQuota}
                    </p>
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-gray-700">Fark Sınıfı Boş Kontenjan:</p>
                    <p className={`text-2xl font-bold ${differenceQuota > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {differenceQuota}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Yönlendirme yapabilirsiniz. Boş kontenjanı olan kurslara adayları yönlendirerek sistemi daha verimli kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuota;