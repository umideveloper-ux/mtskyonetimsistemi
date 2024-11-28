import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LoginProps, LoginState } from './LoginTypes';
import { predefinedSchools } from '../config/schools';

interface MobileLoginProps extends LoginProps {
  state: LoginState;
  setState: React.Dispatch<React.SetStateAction<LoginState>>;
  handleSchoolChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const TypewriterCredit = () => {
  const [displayText, setDisplayText] = React.useState("");
  const text = "HAŞİM DOĞAN IŞIK TARAFINDAN TASARLANMIŞ VE KODLANMIŞTIR.\nİZİNSİZ PAYLAŞILMASI VE KULLANILMASI YASAKTIR";
  
  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center mt-8 px-4">
      <p className="font-mono text-[10px] text-gray-400/80 tracking-wide whitespace-pre-line">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1 inline-block"
        >
          |
        </motion.span>
      </p>
    </div>
  );
};

const MobileLogin: React.FC<MobileLoginProps> = ({
  state,
  setState,
  handleSchoolChange,
  handleSubmit
}) => {
  useEffect(() => {
    const selectedSchoolData = predefinedSchools.find(school => school.id === state.selectedSchool);
    if (selectedSchoolData) {
      setState(prev => ({ ...prev, email: selectedSchoolData.email || '' }));
    }
  }, [state.selectedSchool]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-8">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <motion.div
            className="flex justify-center mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-16 h-16 text-blue-500" />
          </motion.div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Biga MTSK Yönetim Sistemi
          </h1>
          <p className="text-sm text-gray-500">
            Güvenli giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
          {/* School Selection */}
          <div className="space-y-2">
            <select
              value={state.selectedSchool}
              onChange={handleSchoolChange}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base appearance-none"
            >
              <option value="">Sürücü Kursu Seçin</option>
              {predefinedSchools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>

          {/* Hidden email field */}
          <input
            type="hidden"
            value={state.email || ''}
          />

          {/* Password Field */}
          <div className="space-y-2">
            <input
              type="password"
              value={state.password || ''}
              onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Şifre"
              className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-900 border focus:ring-1 focus:ring-blue-500 text-base ${
                state.error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {/* Error message */}
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm px-1"
              >
                {state.error}
              </motion.div>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={state.isLoading || !state.selectedSchool || !state.password}
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-medium text-base
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.99] transition-transform"
          >
            {state.isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </motion.div>
                <span>Giriş yapılıyor</span>
              </div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>

      {/* Copyright Notice */}
      <TypewriterCredit />
    </div>
  );
};

export default MobileLogin;
