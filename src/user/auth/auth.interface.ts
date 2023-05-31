export interface SignupParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
  };
}

export interface SigninParams {
  email: string;
  password: string;
}
