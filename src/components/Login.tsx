import React, { useState } from 'react';
import { signIn } from '../firebase/auth';
import { toast } from 'react-toastify';
import { useDevice } from '../hooks/useDevice';
import { predefinedSchools } from '../config/schools';
import { LoginProps, LoginState, FormValidationError } from './LoginTypes';
import MobileLogin from './MobileLogin';
import DesktopLogin from './DesktopLogin';

const initialState: LoginState = {
  selectedSchool: '',
  email: '',
  password: '',
  selectedInstructor: '',
  isInstructorLogin: false,
  error: '',
  isLoading: false,
};

const Login: React.FC<LoginProps> = ({ onLogin, onInstructorLogin }) => {
  const { isMobile } = useDevice();
  const [state, setState] = useState<LoginState>(initialState);

  const validateForm = (): FormValidationError | null => {
    if (!state.selectedSchool) {
      return new FormValidationError('school', 'Lütfen bir okul seçin');
    }
    if (!state.password || state.password.length < 6) {
      return new FormValidationError('password', 'Şifre en az 6 karakter olmalıdır');
    }
    if (state.isInstructorLogin && !state.selectedInstructor) {
      return new FormValidationError('instructor', 'Lütfen bir eğitmen seçin');
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
      email: school ? school.email : schoolId === 'admin' ? 'admin@surucukursu.com' : '',
      error: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.isInstructorLogin) {
      handleInstructorLogin(e);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError.message }));
      toast.error(validationError.message);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const selectedSchoolData = predefinedSchools.find(school => school.id === state.selectedSchool);
      if (!selectedSchoolData) {
        throw new Error('Okul bulunamadı');
      }

      await signIn(selectedSchoolData.email, state.password);
      onLogin(selectedSchoolData);
    } catch (error: any) {
      handleError(error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleInstructorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: '', isLoading: true }));

    try {
      const school = predefinedSchools.find(s => s.id === state.selectedSchool);
      if (!school || !school.instructors) {
        throw new Error('Okul veya eğitmen bilgisi bulunamadı');
      }

      const instructor = school.instructors[state.selectedInstructor];
      if (!instructor) {
        throw new Error('Eğitmen bilgisi bulunamadı');
      }

      if (instructor.password !== state.password) {
        throw new Error('Şifre hatalı');
      }

      onInstructorLogin(instructor);
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      toast.error(error.message);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
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