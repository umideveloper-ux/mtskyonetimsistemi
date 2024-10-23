import React, { useState, useEffect } from 'react';
import { School } from '../types';
import { Car, Lock, User, Mail } from 'lucide-react';
import { signIn } from '../firebase';
import { toast } from 'react-toastify';
import useWindowSize from '../hooks/useWindowSize';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface LoginProps {
  onLogin: (school: School) => void;
  onInstructorLogin: (instructor: any) => void;
}

interface Instructor {
  id: string;
  name: string;
  password: string;
}

const predefinedSchools: School[] = [
  { id: '1', name: 'ÖZEL BİGA LİDER MTSK', email: 'bigalidermtsk@biga.com', candidates: {} },
  { id: '2', name: 'ÖZEL BİGA IŞIKLAR MTSK', email: 'bigaisiklarmtsk@biga.com', candidates: {} },
  { id: '3', name: 'ÖZEL BİGA GÖZDE MTSK', email: 'bigagozdemtsk@biga.com', candidates: {} },
  { id: '4', name: 'ÖZEL BİGA MARMARA MTSK', email: 'bigamarmaramtsk@biga.com', candidates: {} },
  { id: '5', name: 'ÖZEL BİGA TEKSÜR MTSK', email: 'bigateksurmtsk@biga.com', candidates: {} },
];

const Login: React.FC<LoginProps> = ({ onLogin, onInstructorLogin }) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInstructorMode, setIsInstructorMode] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [instructorPassword, setInstructorPassword] = useState('');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const { width } = useWindowSize();

  const isMobile = width < 768;

  useEffect(() => {
    if (selectedSchool && isInstructorMode) {
      loadInstructors();
    }
  }, [selectedSchool, isInstructorMode]);

  const loadInstructors = async () => {
    if (!selectedSchool) return;
    
    try {
      const instructorsRef = ref(db, `schools/${selectedSchool}/instructors`);
      const snapshot = await get(instructorsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const instructorsList = Object.entries(data).map(([id, instructor]: [string, any]) => ({
          id,
          name: instructor.name,
          password: instructor.password
        }));
        setInstructors(instructorsList);
      } else {
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error loading instructors:', error);
      toast.error('Eğitmen listesi yüklenirken bir hata oluştu');
    }
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
    setSelectedInstructor('');
    setInstructorPassword('');
    
    const school = predefinedSchools.find(s => s.id === schoolId);
    if (school) {
      setEmail(school.email);
    } else if (schoolId === 'admin') {
      setEmail('admin@surucukursu.com');
    } else {
      setEmail('');
    }
  };

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedSchool || !selectedInstructor || !instructorPassword) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setIsLoading(true);
    try {
      const instructor = instructors.find(i => i.id === selectedInstructor);
      
      if (instructor && instructor.password === instructorPassword) {
        const school = predefinedSchools.find(s => s.id === selectedSchool);
        onInstructorLogin({
          ...instructor,
          school: school?.name || ''
        });
        toast.success('Giriş başarılı!');
      } else {
        throw new Error('Geçersiz şifre');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Giriş başarısız. Lütfen şifrenizi kontrol edin.');
      toast.error('Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedSchool || !password) {
      setError('Lütfen sürücü kursunuzu seçin ve şifrenizi girin');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      
      if (selectedSchool === 'admin') {
        onLogin({
          id: 'admin',
          name: 'Admin',
          email: 'admin@surucukursu.com',
          candidates: {}
        });
      } else {
        const school = predefinedSchools.find(s => s.id === selectedSchool);
        if (school) {
          onLogin(school);
          toast.success('Giriş başarılı!');
        } else {
          throw new Error('Seçilen okul bulunamadı');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      toast.error('Giriş başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-10 rounded-xl shadow-2xl transform transition-all hover:scale-105 relative z-10">
        <div>
          <Car className="mx-auto h-16 w-auto text-white animate-bounce" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Aday Takip Sistemi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Lütfen giriş yapın
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-4">
            <label htmlFor="school" className="sr-only">Sürücü Kursu</label>
            <div className="relative">
              <select
                id="school"
                name="school"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={selectedSchool}
                onChange={handleSchoolChange}
              >
                <option value="">Sürücü Kursu Seçin</option>
                {predefinedSchools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
                <option value="admin">Admin</option>
              </select>
              <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {selectedSchool && (
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setIsInstructorMode(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !isInstructorMode 
                    ? 'bg-white text-indigo-600 font-semibold'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Sürücü Kursu
              </button>
              <button
                type="button"
                onClick={() => setIsInstructorMode(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isInstructorMode 
                    ? 'bg-white text-indigo-600 font-semibold'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Eğitmen
              </button>
            </div>
          )}

          {selectedSchool && (
            <form onSubmit={isInstructorMode ? handleInstructorLogin : handleSchoolLogin} className="mt-4 space-y-4">
              {isInstructorMode ? (
                <>
                  <div>
                    <label htmlFor="instructor" className="sr-only">Eğitmen</label>
                    <select
                      id="instructor"
                      value={selectedInstructor}
                      onChange={(e) => setSelectedInstructor(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      required
                    >
                      <option value="">Eğitmen Seçin</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="instructor-password" className="sr-only">Şifre</label>
                    <input
                      id="instructor-password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Şifre"
                      value={instructorPassword}
                      onChange={(e) => setInstructorPassword(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="email" className="sr-only">E-posta</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={email}
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Şifre</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Şifre"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-300">
          <p>© 2024 Aday Takip Sistemi</p>
          <p>Haşim Doğan Işık tarafından tasarlanmış ve kodlanmıştır.</p>
          <p>Tüm hakları saklıdır. İzinsiz paylaşılması ve kullanılması yasaktır.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;