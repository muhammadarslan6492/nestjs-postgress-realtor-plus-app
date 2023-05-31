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

export interface signinResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
  };
  token: string;
}
