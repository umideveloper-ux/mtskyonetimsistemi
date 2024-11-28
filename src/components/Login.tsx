import React, { useState } from 'react';
import { signIn } from '../firebase/auth';
import { toast } from 'react-toastify';
import { useDevice } from '../hooks/useDevice';
import { predefinedSchools } from '../config/schools';
import { LoginProps, LoginState, FormValidationError, Instructor } from './LoginTypes';
import MobileLogin from './MobileLogin';
import DesktopLogin from './DesktopLogin';

const initialState: LoginState = {
  selectedSchool: '',
  email: '',
  password: '',
  isInstructorMode: false,
  selectedInstructor: '',
  instructorPassword: '',
  error: '',
  isLoading: false,
};

const Login: React.FC<LoginProps> = ({ onLogin, onInstructorLogin }) => {
  const { isMobile } = useDevice();
  const [state, setState] = useState<LoginState>(initialState);
  const [instructors] = useState<Instructor[]>([]);

  const validateForm = (): FormValidationError | null => {
    if (!state.selectedSchool) {
      return { field: 'school', message: 'Lütfen bir okul seçin' };
    }
    if (!state.password || state.password.length < 6) {
      return { field: 'password', message: 'Şifre en az 6 karakter olmalıdır' };
    }
    if (state.isInstructorMode && !state.selectedInstructor) {
      return { field: 'instructor', message: 'Lütfen bir eğitmen seçin' };
    }
    return null;
  };

  const handleError = (error: Error) => {
    let errorMessage = 'Şifrenizi hatalı girdiniz. Lütfen tekrar deneyin';
    
    if (error.message.includes('auth/wrong-password')) {
      errorMessage = 'Şifrenizi hatalı girdiniz. Lütfen tekrar deneyin';
    } else if (error.message.includes('auth/user-not-found')) {
      errorMessage = 'Şifrenizi hatalı girdiniz. Lütfen tekrar deneyin';
    } else if (error.message.includes('auth/too-many-requests')) {
      errorMessage = 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
    }
    
    setState(prev => ({ ...prev, error: errorMessage }));
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value;
    const school = predefinedSchools.find(s => s.id === schoolId);
    
    setState(prev => ({
      ...prev,
      selectedSchool: schoolId,
      selectedInstructor: '',
      instructorPassword: '',
      email: school ? school.email : schoolId === 'admin' ? 'admin@surucukursu.com' : '',
      error: ''
    }));
  };

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: '', isLoading: true }));

    const validation = validateForm();
    if (validation) {
      setState(prev => ({ ...prev, error: validation.message, isLoading: false }));
      return;
    }

    try {
      const instructor = instructors.find(i => i.id === state.selectedInstructor);
      
      if (instructor && instructor.password === state.instructorPassword) {
        const school = predefinedSchools.find(s => s.id === state.selectedSchool);
        onInstructorLogin({
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          school: school?.name || ''
        });
        toast.success('Giriş başarılı!');
      } else {
        throw new Error('auth/wrong-password');
      }
    } catch (error) {
      handleError(error as Error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: '', isLoading: true }));

    const validation = validateForm();
    if (validation) {
      setState(prev => ({ ...prev, error: validation.message, isLoading: false }));
      return;
    }

    try {
      await signIn(state.email, state.password);
      
      if (state.selectedSchool === 'admin') {
        onLogin({
          id: 'admin',
          name: 'Admin',
          email: 'admin@surucukursu.com',
          candidates: {
            B: 0, A1: 0, A2: 0, C: 0, D: 0,
            FARK_A1: 0, FARK_A2: 0, BAKANLIK_A1: 0
          }
        });
      } else {
        const school = predefinedSchools.find(s => s.id === state.selectedSchool);
        if (school) {
          onLogin(school);
          toast.success('Giriş başarılı!');
        } else {
          throw new Error('Seçilen okul bulunamadı');
        }
      }
    } catch (error) {
      handleError(error as Error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.isInstructorMode) {
      handleInstructorLogin(e);
    } else {
      handleSchoolLogin(e);
    }
  };

  const loginProps = {
    state,
    setState,
    handleSchoolChange,
    handleSubmit,
    onLogin,
    onInstructorLogin
  };

  return isMobile ? (
    <MobileLogin {...loginProps} />
  ) : (
    <DesktopLogin {...loginProps} />
  );
};

export default Login;