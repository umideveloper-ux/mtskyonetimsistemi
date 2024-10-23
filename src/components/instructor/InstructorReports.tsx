import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface InstructorReportsProps {
  instructor: Instructor;
}

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  status: 'completed' | 'pending';
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Mart 2024 Aylık Değerlendirme',
    date: '2024-03-01',
    type: 'Aylık Rapor',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Öğrenci İlerleme Raporu',
    date: '2024-03-15',
    type: 'İlerleme Raporu',
    status: 'pending'
  }
];

const InstructorReports: React.FC<InstructorReportsProps> = ({ instructor }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Raporlar</h2>
        <div className="flex space-x-2">
          <button className="bg-white px-4 py-2 rounded-lg shadow flex items-center hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            Filtrele
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.date).toLocaleDateString('tr-TR')} - {report.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      report.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {report.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aylık Özet</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Toplam Ders Saati</dt>
              <dd className="text-2xl font-bold text-indigo-600">48</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tamamlanan Dersler</dt>
              <dd className="text-2xl font-bold text-green-600">36</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">İptal Edilen Dersler</dt>
              <dd className="text-2xl font-bold text-red-600">2</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Öğrenci İstatistikleri</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Aktif Öğrenciler</dt>
              <dd className="text-2xl font-bold text-indigo-600">12</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tamamlanan Eğitimler</dt>
              <dd className="text-2xl font-bold text-green-600">8</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Devam Eden Eğitimler</dt>
              <dd className="text-2xl font-bold text-yellow-600">4</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performans</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Başarı Oranı</dt>
              <dd className="text-2xl font-bold text-indigo-600">95%</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Öğrenci Memnuniyeti</dt>
              <dd className="text-2xl font-bold text-green-600">4.8/5</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Zamanında Tamamlama</dt>
              <dd className="text-2xl font-bold text-blue-600">98%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InstructorReports;