import { School, InstructorWithoutCredentials } from '../types';

export interface LoginProps {
  onLogin: (school: School) => void;
  onInstructorLogin: (instructor: InstructorWithoutCredentials) => void;
}

export interface LoginState {
  selectedSchool: string;
  email: string;
  password: string;
  selectedInstructor: string;
  isInstructorLogin: boolean;
  error: string;
  isLoading: boolean;
}

export class FormValidationError extends Error {
  constructor(public field: string, public message: string) {
    super(message);
    this.name = 'FormValidationError';
  }
}
