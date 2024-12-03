import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {

	console.log('layout.server.ts: locals.user', locals.user);


	return {
		user: locals.user
	};
};