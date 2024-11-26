import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, request }) => {
	try {
		// Forward headers from client
		const forwardedHeaders = new Headers(request.headers);

		const apiResponse = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/${params.path}${url.search}`,
			{
				method: 'GET',
				headers: forwardedHeaders,
			}
		);

		// Return headers and body from the API response
		const responseHeaders = new Headers();
		apiResponse.headers.forEach((value, key) => {
			responseHeaders.append(key, value);
		});

		return new Response(apiResponse.body, {
			status: apiResponse.status,
			headers: responseHeaders,
		});
	}
	catch (error) {
		console.error('GET error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ params, request, cookies }) => {

	console.log('POST request:', request);

	try {

		const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/${params.path}`

		const apiResponse = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': request.headers.get('Content-Type') || 'application/json',
			},
			body: await request.text(),
		});

		console.log('apiResponse:', apiResponse);

		// Return headers and body from the API response
		const responseHeaders = new Headers();
		apiResponse.headers.forEach((value, key) => {
			responseHeaders.append(key, value);
		});

		let res = new Response(apiResponse.body, {
			status: apiResponse.status,
			headers: responseHeaders,
		});

		console.log('res:', res);


		return res
	}
	catch (error) {
		console.error('POST error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
