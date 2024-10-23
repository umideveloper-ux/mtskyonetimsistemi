import React from 'react';
import { User, Mail, Building, Phone, MapPin } from 'lucide-react';

interface Instructor {
  id: string;
  name: string;
  email: string;
  school: string;
}

interface InstructorProfileProps {
  instructor: Instructor;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({ instructor }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{instructor.name}</h2>
          <p className="text-gray-600">Direksiyon Eğitmeni</p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 flex items-center">
              <dt className="text-gray-500 w-1/3 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email
              </dt>
              <dd className="text-gray-900 flex-1">{instructor.email}</dd>
            </div>
            <div className="py-4 flex items-center">
              <dt className="text-gray-500 w-1/3 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Sürücü Kursu
              </dt>
              <dd className="text-gray-900 flex-1">{instructor.school}</dd>
            </div>
            <div className="py-4 flex items-center">
              <dt className="text-gray-500 w-1/3 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Telefon
              </dt>
              <dd className="text-gray-900 flex-1">+90 555 123 4567</dd>
            </div>
            <div className="py-4 flex items-center">
              <dt className="text-gray-500 w-1/3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Adres
              </dt>
              <dd className="text-gray-900 flex-1">Biga, Çanakkale</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">İstatistikler</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Toplam Ders Saati</p>
            <p className="text-2xl font-bold text-indigo-600">248</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Aktif Öğrenci</p>
            <p className="text-2xl font-bold text-indigo-600">12</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Başarı Oranı</p>
            <p className="text-2xl font-bold text-indigo-600">95%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Mezun Öğrenci</p>
            <p className="text-2xl font-bold text-indigo-600">156</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;