import type { Actions } from './$types';
import api, { ValidationError } from '$lib/api/api.service';

export const actions = {
	default: async ({ request, fetch }) => {

		const data = await request.formData();
		const username = data.get('username') ?? data.get('email');
		const password = data.get('password');

		try {
			const result: any = await api.post('auth/login', { username, password }, { fetch });
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
