import { api } from '@/lib/axios';
import type { LoginPayload, AuthUser } from '../types/auth.types';

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
};

export const authApi = {
  login: async (
    payload: LoginPayload
  ): Promise<{ token: string; user: AuthUser }> => {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      payload
    );

    return response.data.data;
  },
};
