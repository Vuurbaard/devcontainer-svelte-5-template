import { Api } from '$lib/api.js';

export async function load({ params, fetch }) {

	const lang = 'nl';
	const category = 'dashboard';

	const response = await Api.get<Record<string, string>>(`/translation?lang=${lang}&category=${category}`, fetch);
	const translations = response.data || {};

	console.log(`translations for category ${category} in ${lang}: ${JSON.stringify(translations)}`);

	return { t: translations, lang };
}
