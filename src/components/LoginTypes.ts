import { School } from '../types';

export interface LoginProps {
  onLogin: (school: School) => void;
  onInstructorLogin: (instructor: InstructorWithSchool) => void;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface InstructorWithSchool extends Omit<Instructor, 'password'> {
  school: string;
}

export interface LoginState {
  selectedSchool: string;
  email: string;
  password: string;
  isInstructorMode: boolean;
  selectedInstructor: string;
  instructorPassword: string;
  error: string;
  isLoading: boolean;
}

export interface FormValidationError {
  field: string;
  message: string;
}
