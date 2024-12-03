import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {

	const userCookie = event.cookies.get('user');

	// console.log('hooks.server.ts: userCookie', userCookie);

	event.locals.user = userCookie ? JSON.parse(userCookie) : null;

	console.log('hooks.server.ts: event.locals.user', event.locals.user);


	return resolve(event);
};
