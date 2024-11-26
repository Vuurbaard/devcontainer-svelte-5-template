import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch }) => {

		const formData = await request.formData();
		const data = Object.fromEntries(formData.entries());

		try {
			const result: any = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const responseData = await result.json();

			console.log('Login response:', responseData);

			if (result.ok) {
				return { success: true, message: responseData.message ?? 'Login successful' };
			}

			return {
				success: false,
				error: responseData.message ?? 'Login failed',
			};
		}
		catch (e: any) {
			console.error(e);
			return {
				success: false,
				error: e.message ?? 'An unexpected error occurred',
				errors: e.errors ?? {},
			};
		}
	},
} satisfies Actions;