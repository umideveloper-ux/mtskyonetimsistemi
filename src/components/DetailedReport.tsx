import React, { useMemo, useState, useEffect } from 'react';
import { School, LicenseClass, DifferenceClass, CLASS_NAMES } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useResponsive from '../hooks/useResponsive';
import { db } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

interface DetailedReportProps {
  schools: School[];
}

const DetailedReport: React.FC<DetailedReportProps> = ({ schools: initialSchools }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isMobile, isTablet } = useResponsive();
  const [schools, setSchools] = useState<School[]>(initialSchools);
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
    const schoolsRef = ref(db, 'schools');
    const licenseFeesRef = ref(db, 'licenseFees');

    const schoolsUnsubscribe = onValue(schoolsRef, (snapshot) => {
      if (snapshot.exists()) {
        const schoolsData = snapshot.val();
        const updatedSchools = Object.entries(schoolsData).map(([id, schoolData]: [string, any]) => ({
          id,
          name: schoolData.name,
          email: schoolData.email,
          candidates: schoolData.candidates || {},
        }));
        setSchools(updatedSchools);
      }
    });

    const feesUnsubscribe = onValue(licenseFeesRef, (snapshot) => {
      if (snapshot.exists()) {
        setLicenseFees(snapshot.val());
      }
    });

    return () => {
      schoolsUnsubscribe();
      feesUnsubscribe();
    };
  }, []);

  const calculateTotalFee = (candidates: School['candidates']) => {
    return Object.entries(candidates).reduce((total, [classType, count]) => {
      const fee = licenseFees[classType as LicenseClass | DifferenceClass] || 0;
      return total + (Number(count) || 0) * fee;
    }, 0);
  };

  const filteredSchools = useMemo(() =>
    schools.filter(school => school.id !== 'admin'), [schools]
  );

  // Toplam aday sayısı hesaplama
  const totalCandidates = useMemo(() =>
    filteredSchools.reduce((sum, school) =>
      sum + Object.values(school.candidates || {}).reduce((schoolSum, count) => 
        schoolSum + (Number(count) || 0), 0), 0
    ), [filteredSchools]
  );

  // Toplam ücret hesaplama
  const totalFee = useMemo(() =>
    filteredSchools.reduce((sum, school) =>
      sum + calculateTotalFee(school.candidates || {}), 0
    ), [filteredSchools, licenseFees]
  );

  const classTypes: (LicenseClass | DifferenceClass)[] = [
    'B', 'A1', 'A2', 'C', 'D', 'FARK_A1', 'FARK_A2', 'BAKANLIK_A1'
  ];

  const shortenSchoolName = (name: string) => {
    if (isMobile) {
      return name.replace('ÖZEL BİGA ', '');
    }
    return name;
  };

  const getFontSize = () => {
    if (isMobile) return 'text-xs';
    if (isTablet) return 'text-sm';
    return 'text-base';
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('tr-TR')} ₺`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 flex justify-between items-center">
        <h2 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          Detaylı Rapor
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white focus:outline-none transition-transform duration-200 ease-in-out transform hover:scale-110"
        >
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 overflow-x-auto">
          <table className={`min-w-full ${getFontSize()}`}>
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  MTSK
                </th>
                {classTypes.map((type) => (
                  <th key={type} className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                    {CLASS_NAMES[type]}
                  </th>
                ))}
                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Toplam
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Ücret
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchools.map((school) => {
                const schoolTotalCandidates = Object.values(school.candidates || {})
                  .reduce((sum, count) => sum + (Number(count) || 0), 0);
                const schoolTotalFee = calculateTotalFee(school.candidates || {});

                return (
                  <tr key={school.id}>
                    <td className="px-2 py-2 whitespace-nowrap">
                      {shortenSchoolName(school.name)}
                    </td>
                    {classTypes.map((type) => (
                      <td key={type} className="px-2 py-2 whitespace-nowrap">
                        {Number(school.candidates?.[type]) || 0}
                      </td>
                    ))}
                    <td className="px-2 py-2 whitespace-nowrap text-blue-600">
                      {schoolTotalCandidates}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-green-600">
                      {formatCurrency(schoolTotalFee)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-2 py-2 whitespace-nowrap font-bold">Toplam</td>
                {classTypes.map((type) => (
                  <td key={type} className="px-2 py-2 whitespace-nowrap font-bold">
                    {filteredSchools.reduce((sum, school) =>
                      sum + (Number(school.candidates?.[type]) || 0), 0
                    )}
                  </td>
                ))}
                <td className="px-2 py-2 whitespace-nowrap font-bold text-blue-600">
                  {totalCandidates}
                </td>
                <td className="px-2 py-2 whitespace-nowrap font-bold text-green-600">
                  {formatCurrency(totalFee)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailedReport;