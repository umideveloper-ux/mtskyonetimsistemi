import React, { useState } from 'react';
import { School } from '../../types';
import { IoPersonAdd } from 'react-icons/io5';
import { AnimatePresence } from 'framer-motion';
import AddCandidateModal from './AddCandidateModal';

interface MobileDashboardProps {
  school: School;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ school, updateCandidates }) => {
  const [showAddCandidate, setShowAddCandidate] = useState(false);

  const courseStats = {
    total: Object.keys(school.candidates || {}).length,
    active: Object.values(school.candidates || {}).filter(c => c.status === 'active').length,
    completed: Object.values(school.candidates || {}).filter(c => c.status === 'completed').length
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Ana İçerik */}
      <div className="p-4 pb-20">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-3 shadow">
            <p className="text-xs text-gray-500">Toplam</p>
            <p className="text-xl font-bold text-blue-600">{courseStats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow">
            <p className="text-xs text-gray-500">Aktif</p>
            <p className="text-xl font-bold text-green-600">{courseStats.active}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow">
            <p className="text-xs text-gray-500">Tamamlanan</p>
            <p className="text-xl font-bold text-purple-600">{courseStats.completed}</p>
          </div>
        </div>

        {/* Adaylar Listesi */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kursiyerler</h2>
            <button
              onClick={() => setShowAddCandidate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <IoPersonAdd className="mr-1" />
              Aday Ekle
            </button>
          </div>
          <div className="divide-y">
            {Object.entries(school.candidates || {}).map(([id, candidate]) => (
              <div key={id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-gray-500">{candidate.courseType}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  candidate.status === 'active' ? 'bg-green-100 text-green-800' :
                  candidate.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.status === 'active' ? 'Aktif' :
                   candidate.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aday Ekleme Modal */}
      <AnimatePresence>
        {showAddCandidate && (
          <AddCandidateModal
            onClose={() => setShowAddCandidate(false)}
            school={school}
            updateCandidates={updateCandidates}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileDashboard;
