import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { LoginProps, LoginState } from './LoginTypes';
import { predefinedSchools } from '../config/schools';

interface MobileLoginProps extends LoginProps {
  state: LoginState;
  setState: React.Dispatch<React.SetStateAction<LoginState>>;
  handleSchoolChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const MobileLogin: React.FC<MobileLoginProps> = ({
  state,
  setState,
  handleSchoolChange,
  handleSubmit
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white p-6 flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-center text-gray-900">
            {state.isInstructorMode ? 'Eğitmen Girişi' : 'MTSK Girişi'}
          </h1>
          <p className="text-center text-gray-500 text-sm">
            {state.isInstructorMode ? 'Eğitmen hesabınıza giriş yapın' : 'MTSK hesabınıza giriş yapın'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {state.isInstructorMode ? (
              <>
                <select
                  value={state.selectedSchool}
                  onChange={handleSchoolChange}
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sürücü Kursu Seçin</option>
                  {predefinedSchools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
                <select
                  value={state.selectedInstructor}
                  onChange={(e) => setState(prev => ({ ...prev, selectedInstructor: e.target.value }))}
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Eğitmen Seçin</option>
                  {/* Eğitmenler buraya eklenecek */}
                </select>
                <input
                  type="password"
                  value={state.instructorPassword}
                  onChange={(e) => setState(prev => ({ ...prev, instructorPassword: e.target.value }))}
                  placeholder="Şifre"
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </>
            ) : (
              <>
                <select
                  value={state.selectedSchool}
                  onChange={handleSchoolChange}
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sürücü Kursu Seçin</option>
                  <option value="admin">Admin</option>
                  {predefinedSchools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
                <input
                  type="password"
                  value={state.password}
                  onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Şifre"
                  className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </>
            )}

            <button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-blue-500 text-white p-4 rounded-2xl flex items-center justify-between"
            >
              <span className="flex-1">
                {state.isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setState(prev => ({ ...prev, isInstructorMode: !prev.isInstructorMode }));
          }}
          className="w-full p-4 text-blue-500 text-sm font-medium"
        >
          {state.isInstructorMode ? 'MTSK Girişine Dön' : 'Eğitmen Girişi'}
        </button>

        {state.error && (
          <div className="text-red-500 text-sm text-center">
            {state.error}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileLogin;
