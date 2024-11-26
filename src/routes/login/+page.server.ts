import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch }) => {

		// const data = await request.formData();
		// console.log('form data:', data);

		// const username = data.get('username') ?? data.get('email');
		// const password = data.get('password');

		try {


			const result: any = await fetch('/api/auth/login', {
				method: 'POST',
				body: request.body,

				// headers: {
				// 	'Content-Type': 'application/json'
				// },
				// body: JSON.stringify(data)
			});

			// Process server response
			if (result.ok) {
				const responseData = await result.json();
				return { success: true, message: responseData.message };
			}
			else {
				const errorData = await result.json();
				return {
					success: false,
					error: errorData.message ?? 'Login failed',
				};
			}
		}
		catch (e: any) {
			console.error(e);

			return {
				success: false,
				error: e.message ?? 'An unexpected error occurred',
				errors: e.errors ?? {},
			};
		}
	},
} satisfies Actions;
