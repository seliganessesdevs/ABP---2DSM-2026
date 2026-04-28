import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import type { LoginPayload } from '../types/auth.types';

const schema = z.object({
	email: z.string().email({ message: 'Email inválido' }),
	password: z.string().min(6, { message: 'Senha muito curta' }),
});

export const LoginForm: React.FC = () => {
	const { register, handleSubmit, formState } = useForm<LoginPayload>({
		resolver: zodResolver(schema),
	});

	const mutation = useLogin();

	const onSubmit = (values: LoginPayload) => {
		mutation.mutate(values);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div>
				<label>Email</label>
				<input type="email" {...register('email')} />
				{formState.errors.email && <p>{formState.errors.email.message}</p>}
			</div>

			<div>
				<label>Senha</label>
				<input type="password" {...register('password')} />
				{formState.errors.password && <p>{formState.errors.password.message}</p>}
			</div>

			{mutation.isError && (
				<p role="alert">
					{(mutation.error as any)?.response?.data?.message ?? 'Erro ao efetuar login'}
				</p>
			)}

			<button type="submit" disabled={mutation.isLoading}>
				{mutation.isLoading ? 'Entrando...' : 'Entrar'}
			</button>
		</form>
	);
};
