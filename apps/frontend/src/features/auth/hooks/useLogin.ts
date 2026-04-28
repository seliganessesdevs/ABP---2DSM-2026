import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import type { LoginPayload } from '../types/auth.types';

export const useLogin = () => {
	const setAuth = useAuthStore((s) => s.setAuth);
	const navigate = useNavigate();

	return useMutation((payload: LoginPayload) => authApi.login(payload), {
		onSuccess: (data) => {
			setAuth(data.token, data.user);
			if (data.user.role === 'ADMIN') {
				navigate('/admin');
			} else {
				navigate('/secretaria');
			}
		},
	});
};
