import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { School } from '../../types';

interface AddCandidateModalProps {
  onClose: () => void;
  school: School;
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => Promise<void>;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ onClose, school, updateCandidates }) => {
  const [name, setName] = useState('');
  const [courseType, setCourseType] = useState('A1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courseType) return;

    setIsSubmitting(true);
    try {
      const newCandidate = {
        id: Date.now().toString(),
        name,
        courseType,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedCandidates = {
        ...(school.candidates || {}),
        [newCandidate.id]: newCandidate
      };

      await updateCandidates(school.id, updatedCandidates);
      onClose();
    } catch (error) {
      console.error('Aday eklenirken hata oluştu:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 500 }}
      className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Yeni Aday Ekle</h2>
          <button
            onClick={onClose}
            className="text-gray-500">
            Kapat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ad Soyad"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ehliyet Sınıfı
            </label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Ekleniyor...' : 'Aday Ekle'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddCandidateModal;
