import React, { useState, useEffect } from 'react';
import { Users, Calculator } from 'lucide-react';
import { School, LicenseClass, DifferenceClass } from '../../types';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

interface DashboardStatsProps {
  school: School;
  schools: School[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ school, schools }) => {
  const [licenseFees, setLicenseFees] = useState<{ [key in LicenseClass | DifferenceClass]: number }>({
    B: 15000,
    A1: 12000,
    A2: 12000,
    C: 15000,
    D: 15000,
    FARK_A1: 10000,
    FARK_A2: 12000,
    BAKANLIK_A1: 7500,
  });

  useEffect(() => {
    const licenseFeesRef = ref(db, 'licenseFees');
    const unsubscribe = onValue(licenseFeesRef, (snapshot) => {
      if (snapshot.exists()) {
        setLicenseFees(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  const totalCandidates = schools.reduce((sum, school) => {
    return sum + Object.values(school.candidates).reduce((schoolSum, count) => 
      schoolSum + (Number(count) || 0), 0);
  }, 0);

  const totalFee = schools.reduce((sum, school) => {
    return sum + Object.entries(school.candidates).reduce((schoolSum, [classType, count]) => {
      const fee = licenseFees[classType as LicenseClass | DifferenceClass] || 0;
      return schoolSum + (Number(count) || 0) * fee;
    }, 0);
  }, 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Özet</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Toplam Aday Sayısı</h3>
          <div className="flex items-center">
            <Users className="text-blue-500 mr-2" size={24} />
            <span className="text-2xl font-bold">{totalCandidates}</span>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Toplam Ücret</h3>
          <div className="flex items-center">
            <Calculator className="text-green-500 mr-2" size={24} />
            <span className="text-2xl font-bold">{totalFee.toLocaleString('tr-TR')} TL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;