import type { PageServerLoad } from './$types';
import { Api } from '$lib/api.js';

// export const load: PageServerLoad = async ({ locals, fetch }) => {

// 	const lang = 'en';
// 	const category = 'dashboard';

// 	const placeholders = { name: locals.user?.username };
// 	const placeholdersQuery = encodeURIComponent(JSON.stringify(placeholders));

// 	const response = await Api.get<Record<string, string>>(`/translation?lang=${lang}&category=${category}&placeholders=${placeholdersQuery}`, fetch);
// 	const translations = response.data || {};

// 	console.log(`translations for category ${category} in ${lang}: ${JSON.stringify(translations)}`);

// 	return { t: translations, lang };
// }