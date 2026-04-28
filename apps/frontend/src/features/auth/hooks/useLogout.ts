import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export const useLogout = () => {
	const clearAuth = useAuthStore((s) => s.clearAuth);
	const navigate = useNavigate();

	return useCallback(() => {
		clearAuth();
		navigate('/login');
	}, [clearAuth, navigate]);
};
