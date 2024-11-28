import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { LoginProps, LoginState } from './LoginTypes';
import { predefinedSchools } from '../config/schools';

interface DesktopLoginProps extends LoginProps {
  state: LoginState;
  setState: React.Dispatch<React.SetStateAction<LoginState>>;
  handleSchoolChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const Star = ({ delay = 0 }: { delay?: number }) => {
  const startX = Math.random() * 100;
  const duration = 2 + Math.random() * 2;
  const size = 2 + Math.random() * 2;

  return (
    <motion.div
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'white',
        borderRadius: '50%',
        filter: 'blur(1px)',
      }}
      initial={{ 
        x: `${startX}vw`,
        y: -20,
        opacity: 0,
      }}
      animate={{
        y: ['0vh', '100vh'],
        opacity: [0, 1, 1, 0],
        x: [
          `${startX}vw`,
          `${startX + (Math.random() * 10 - 5)}vw`,
        ],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

const FallingStars = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <Star key={i} delay={i * 0.3} />
      ))}
    </div>
  );
};

const TypewriterCredit = () => {
  const text = "HAŞİM DOĞAN IŞIK TARAFINDAN TASARLANMIŞ VE KODLANMIŞTIR.\nİZİNSİZ PAYLAŞILMASI VE KULLANILMASI YASAKTIR";
  const [displayText, setDisplayText] = useState("");
  
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
    <motion.div 
      className="mt-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="inline-block">
        <p className="font-mono text-sm text-blue-400/90 tracking-wide whitespace-pre-line">
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
    </motion.div>
  );
};

const DesktopLogin: React.FC<DesktopLoginProps> = ({
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
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#1c1c1e]">
      {/* Modern gradient background */}
      <div 
        className="fixed inset-0 opacity-40"
        style={{
          background: 'linear-gradient(125deg, #00008B, #4169E1, #1E90FF)',
          filter: 'blur(100px)',
        }}
      />

      {/* Falling stars background */}
      <FallingStars />

      {/* Glass morphism container */}
      <motion.div 
        className="w-full max-w-xl relative z-10 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Login card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/10">
          {/* Logo and title */}
          <div className="text-center mb-12">
            <motion.div
              className="flex justify-center mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-20 h-20 text-blue-400" />
            </motion.div>
            <h1 className="text-3xl font-semibold text-white mb-3">
              Biga MTSK Yönetim Sistemi
            </h1>
            <p className="text-gray-400 text-base">
              Güvenli giriş yapın
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* School selection */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">Sürücü Kursu</label>
              <div className="relative">
                <select
                  value={state.selectedSchool}
                  onChange={handleSchoolChange}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-lg"
                >
                  <option value="" className="bg-[#1c1c1e]">Sürücü Kursu Seçin</option>
                  {predefinedSchools.map((school) => (
                    <option key={school.id} value={school.id} className="bg-[#1c1c1e]">
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hidden email field */}
            <input
              type="hidden"
              value={state.email || ''}
            />

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">Şifre</label>
              <input
                type="password"
                value={state.password || ''}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-lg ${
                  state.error ? 'border-red-500/50' : 'border-white/10'
                }`}
              />
              {/* Error message */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {state.error}
                </motion.div>
              )}
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={state.isLoading || !state.selectedSchool || !state.password}
              className="w-full mt-8 px-5 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
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

        {/* Developer credit with typewriter effect */}
        <TypewriterCredit />
      </motion.div>
    </div>
  );
};

export default DesktopLogin;
