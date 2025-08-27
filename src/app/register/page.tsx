"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		full_name: '',
		password: '',
		confirm: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		if (formData.password !== formData.confirm) {
			setError('Passwords do not match');
			return;
		}
		setIsLoading(true);
		try {
			// Use authService directly to register (auto-login logic is inside)
			const { authService } = await import('@/services/auth');
			const resp = await authService.register({
				email: formData.email,
				full_name: formData.full_name,
				password: formData.password,
			});
			// Save after auto-login response
			authService.saveToken(resp.access_token);
			authService.saveUser(resp.user);
			router.push('/');
		} catch (err: any) {
			setError(err.response?.data?.detail || 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
							sign in to existing account
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="email" className="sr-only">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="full_name" className="sr-only">Full Name</label>
							<input
								id="full_name"
								name="full_name"
								type="text"
								required
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Full Name"
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label htmlFor="confirm" className="sr-only">Confirm Password</label>
							<input
								id="confirm"
								name="confirm"
								type="password"
								required
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Confirm Password"
								value={formData.confirm}
								onChange={handleChange}
							/>
						</div>
					</div>
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
					)}
					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
						>
							{isLoading ? 'Creating account...' : 'Create account'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

