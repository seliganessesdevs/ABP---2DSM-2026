import { api } from '@/lib/axios';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

export const authApi = {
	login: async (payload: LoginPayload): Promise<LoginResponse> => {
		const res = await api.post('/auth/login', payload);
		const data = res.data?.data ?? res.data;
		return data as LoginResponse;
	},
};
