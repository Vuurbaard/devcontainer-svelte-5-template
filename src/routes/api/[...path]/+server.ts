import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, request, getClientAddress }) => {
	try {

		const forwardedHeaders = new Headers(request.headers);
		forwardedHeaders.set('X-Forwarded-For', getClientAddress());

		const apiResponse = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/${params.path}${url.search}`,
			{
				method: 'GET',
				headers: forwardedHeaders,
			}
		);

		const responseHeaders = new Headers();
		apiResponse.headers.forEach((value, key) => {
			responseHeaders.append(key, value);
		});

		return new Response(apiResponse.clone().body, {
			status: apiResponse.status,
			headers: responseHeaders,
		});
	}
	catch (error) {
		console.error('GET error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ params, request, getClientAddress }) => {

	try {

		const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/${params.path}`

		const method = request.method;
		const headers = new Headers(request.headers);
		headers.set('X-Forwarded-For', getClientAddress());
		const body = await request.text()

		// console.log(`${method} /api/${params.path} request: headers:`, headers);
		// console.log(`${method} /api/${params.path} request: body:`, body);

		const apiResponse = await fetch(apiUrl, {
			method: method,
			headers: headers,
			body: body,
		});

		// console.log(`${method} /api/${params.path} response: headers:`, apiResponse.headers);
		// console.log(`${method} /api/${params.path} response: body:`, await apiResponse.clone().json());

		return new Response(apiResponse.body, {
			status: apiResponse.status,
			headers: apiResponse.headers,
		});
	}
	catch (error) {
		console.error('POST error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
