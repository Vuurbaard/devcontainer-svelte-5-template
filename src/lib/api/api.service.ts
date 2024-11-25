
class ApiService {
	private baseUrl = import.meta.env.VITE_API_BASE_URL || '';
	private defaultHeaders = { 'Content-Type': 'application/json' };

	private async request<T>(endpoint: string, options: RequestInit, customFetch: typeof fetch = fetch): Promise<T> {
		const url = `${this.baseUrl}/${endpoint}`;

		console.log(`API request: ${options.method} ${url}`, options.body);
		console.log(`credentials:`, options.credentials);

		const response = await customFetch(url, {
			...options,
			headers: {
				...this.defaultHeaders,
				...options.headers,
			},
			credentials: 'include'
		});

		if (!response.ok) {
			const errorResponse = await response.json();
			throw this.handleError(errorResponse, response.status);
		}

		console.log(`headers:`, response.headers);


		return response.json();
	}

	private handleError(errorResponse: any, status: number): Error {

		if (errorResponse && errorResponse.message) {
			if (Array.isArray(errorResponse.message)) {

				// Transform the errors array into a frontend-friendly structure
				const transformedErrors = errorResponse.message.reduce(
					(acc: Record<string, { message: string }>, err: any) => {
						if (err.path?.length) {
							const field = err.path[0];
							acc[field] = err.message;
						}
						return acc;
					},
					{}
				);

				return new ValidationError(
					'Validation error',
					transformedErrors,
					status
				);
			}
		}

		// Generic fallback for non-validation errors
		return new ApiError(
			errorResponse.message || 'Unknown error occurred',
			status,
			errorResponse
		);
	}


	public async get<T>(endpoint: string, context?: { fetch?: typeof fetch }): Promise<T> {
		const customFetch = context?.fetch || fetch;

		return this.request<T>(endpoint, { method: 'GET' }, customFetch);
	}

	public async post<T>(endpoint: string, body: unknown, context?: { fetch?: typeof fetch }): Promise<T> {
		const customFetch = context?.fetch || fetch;

		return this.request<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(body),
		}, customFetch);
	}

	public async put<T>(endpoint: string, body: unknown, context?: { fetch?: typeof fetch }): Promise<T> {
		const customFetch = context?.fetch || fetch;

		return this.request<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body),
		}, customFetch);
	}

	public async delete<T>(endpoint: string, context?: { fetch?: typeof fetch }): Promise<T> {
		const customFetch = context?.fetch || fetch;

		return this.request<T>(endpoint, { method: 'DELETE' }, customFetch);
	}
}

export class ApiError extends Error {
	public status: number;
	public details: any;

	constructor(message: string, status: number, details?: any) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.details = details;
	}
}

export class ValidationError extends ApiError {
	public errors: Record<string, { message: string }>;

	constructor(message: string, validationErrors: Record<string, { message: string }>, status: number) {
		super(message, status);
		this.name = "ValidationError";
		this.errors = validationErrors;
	}
}


const api = new ApiService();
export default api;
