import type { PageServerLoad, Actions } from './$types';
import { Api } from '$lib/api';
import { redirect } from '@sveltejs/kit';

// export const load: PageServerLoad = async ({ fetch }) => {

// 	const lang = 'nl';
// 	const category = 'loginpage';

// 	const response = await Api.get<Record<string, string>>(`/translation?lang=${lang}&category=${category}`, fetch);
// 	const translations = response.data || {};

// 	console.log(`translations for category ${category} in ${lang}: ${JSON.stringify(translations)}`);

// 	return { t: translations, lang };
// }


export const actions = {
	default: async ({ request, fetch }) => {

		const result = await Api.post('/auth/login', request, fetch);

		console.log('login result:', result);


		if (result.success) {
			throw redirect(302, '/dashboard');
		}

		return result;
	},
} satisfies Actions;