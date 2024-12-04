import { Api } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url, fetch }) => {

	// console.log('user locale:', locals.user?.locale);

	const lang = locals.user?.locale ?? 'en';
	const category = url.pathname.slice(1).replace(/\//g, '.'); // Convert pathname like /user/profile to user.profile

	// These always get passed as placeholders
	const placeholders = {
		username: locals.user?.username,
		useremail: locals.user?.email,
		userlocale: locals.user?.locale,
	};

	const placeholdersQuery = encodeURIComponent(JSON.stringify(placeholders));

	// console.log(`fetching translations for ${lang}:${category} with placeholders ${JSON.stringify(placeholders)}`);

	const response = await Api.get<Record<string, string>>(`/translation?lang=${lang}&category=${category}&placeholders=${placeholdersQuery}`, fetch);
	const translations = response.data || {};

	// console.log(`translations for ${lang}:${category} \n${JSON.stringify(translations)}`);

	return {
		user: locals.user,
		t: translations,
	};
};