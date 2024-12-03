import type { Actions } from './$types';
import { Api } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, fetch }) => {

		const result = await Api.post('/auth/login', request, fetch);

		if (result.success) {
			throw redirect(302, '/dashboard');
		}

		return result;
	},
} satisfies Actions;