import type { Actions } from './$types';
import api from '$lib/api/api.service';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const password = data.get('password');

		console.log('Registering user', { name, email, password });

		let user = await api.post('auth/register', { name, email, password });

		console.log('User registered');
		return { success: true, user };

	}
} satisfies Actions;