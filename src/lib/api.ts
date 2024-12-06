export class Api {

	private static readonly API_BASE_PATH = '/api';

	private static async parseRequestBody(body: Record<string, any> | Request): Promise<Record<string, any>> {
		if (body instanceof Request) {
			const contentType = body.headers.get('content-type') || '';

			if (contentType.includes('form')) {
				const formData = await body.formData();
				return Object.fromEntries(formData.entries());
			}
			else if (contentType.includes('json')) {
				return await body.json();
			}
		}

		return body as Record<string, any>;
	}

	private static async request<T>(
		url: string,
		body: Record<string, any> | undefined,
		customFetch: typeof fetch,
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	): Promise<ApiResponse<T>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		try {

			const response = await customFetch(`${this.API_BASE_PATH}${url}`, {
				method,
				headers,
				body: body ? JSON.stringify(body) : undefined,
			});

			const responseData = await response.json().catch(() => ({}));

			// console.log(`API request: ${response.status} ${method} ${url}`, responseData);

			// if (response.status === 422) { // Validation errors
			// 	return { success: false, error: responseData.message, errors: responseData.errors };
			// }

			if (!response.ok) {
				return { success: false, error: responseData.message || 'API request failed' };
			}

			return { success: true, data: responseData, message: responseData.message ?? 'Request successful' };
		}
		catch (error: any) {
			console.error(`Error in API request: ${method} ${url}`, error);
			return {
				success: false,
				message: error.message || 'An unexpected error occurred',
			};
		}
	}

	static async get<T>(url: string, customFetch: typeof fetch = fetch): Promise<ApiResponse<T>> {
		return this.request<T>(url, undefined, customFetch, 'GET');
	}

	static async post<T>(
		url: string,
		body: Record<string, any> | Request,
		customFetch: typeof fetch = fetch
	): Promise<ApiResponse<T>> {
		const parsedBody = await this.parseRequestBody(body);
		return this.request<T>(url, parsedBody, customFetch, 'POST');
	}

	static async put<T>(
		url: string,
		body: Record<string, any> | Request,
		customFetch: typeof fetch = fetch
	): Promise<ApiResponse<T>> {
		const parsedBody = await this.parseRequestBody(body);
		return this.request<T>(url, parsedBody, customFetch, 'PUT');
	}

	static async patch<T>(
		url: string,
		body: Record<string, any> | Request,
		customFetch: typeof fetch = fetch
	): Promise<ApiResponse<T>> {
		const parsedBody = await this.parseRequestBody(body);
		return this.request<T>(url, parsedBody, customFetch, 'PATCH');
	}

	static async delete<T>(
		url: string,
		body: Record<string, any> | Request | undefined,
		customFetch: typeof fetch = fetch
	): Promise<ApiResponse<T>> {
		const parsedBody = body ? await this.parseRequestBody(body) : undefined;
		return this.request<T>(url, parsedBody, customFetch, 'DELETE');
	}
}


type ApiResponse<T> = {
	success: boolean;
	data?: T;
	error?: string;
	errors?: Record<string, { message: string }>;
	message?: string;
};