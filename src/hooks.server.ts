import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {

	const userCookie = event.cookies.get('user');
	event.locals.user = userCookie ? JSON.parse(userCookie) : null;

	return resolve(event);
};
