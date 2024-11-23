import type { Actions } from './$types';
import api, { ValidationError } from '$lib/api/api.service';

export const actions = {
	default: async ({ request }) => {

		const data = await request.formData();
		const username = data.get('username');
		const email = data.get('email');
		const password = data.get('password');

		try {
			const result: any = await api.post('auth/register', { username, email, password });
			return { success: true, message: result?.message };
		}
		catch (e: any) {
			if (e instanceof ValidationError) {
				return {
					success: false,
					errors: e.errors,
				};
			}

			return {
				success: false,
				error: e.message ?? 'An unexpected error occurred',
			};
		}
	}
} satisfies Actions;
