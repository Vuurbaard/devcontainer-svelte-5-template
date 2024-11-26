import { Api } from '$lib/api';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch }) => {

		const result = await Api.post('/auth/register', request, fetch);

		console.log(result);


		return result;

		// const formData = await request.formData();
		// const data = Object.fromEntries(formData.entries());

		// try {
		// 	const result: any = await fetch('/api/auth/register', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify(data),
		// 	});

		// 	console.log(result);

		// 	return { success: true, message: result?.message };
		// }
		// catch (e: any) {
		// 	// if (e instanceof ValidationError) {
		// 	// 	return {
		// 	// 		success: false,
		// 	// 		errors: e.errors,
		// 	// 	};
		// 	// }

		// 	return {
		// 		success: false,
		// 		error: e.message ?? 'An unexpected error occurred',
		// 	};
		// }
	}
} satisfies Actions;
