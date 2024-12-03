import type { PageLoad } from './$types';
import { Api } from '$lib/api.js';

export const load: PageLoad = async ({ data, fetch }) => {

	// const lang = 'en';
	const lang = 'nl';
	const category = 'loginpage';

	const response = await Api.get<Record<string, string>>(`/translation?lang=${lang}&category=${category}`, fetch);
	const translations = response.data || {};

	console.log(`translations for category ${category} in ${lang}: ${JSON.stringify(translations)}`);

	return { t: translations, lang };
}
