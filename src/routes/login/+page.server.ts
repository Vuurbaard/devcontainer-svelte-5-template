import type { Actions } from './$types';
import { Api } from '$lib/api';

export const actions = {
	default: async ({ request, fetch }) => {
		const result = await Api.post('/auth/login', request, fetch);

		return result;
	},
} satisfies Actions;