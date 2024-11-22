class ApiService {
	private baseUrl = import.meta.env.VITE_API_BASE_URL || '';
	private defaultHeaders = { 'Content-Type': 'application/json' };

	private async request<T>(
		endpoint: string,
		options: RequestInit
	): Promise<T> {
		const url = `${this.baseUrl}/${endpoint}`;
		const response = await fetch(url, {
			...options,
			headers: {
				...this.defaultHeaders,
				...options.headers, // Allow overriding headers if needed
			},
			credentials: 'include', // Include cookies for session-based authentication
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Error ${response.status}: ${errorData.message || response.statusText}`
			);
		}

		return response.json();
	}

	public async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' });
	}

	public async post<T>(endpoint: string, body: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: JSON.stringify(body),
		});
	}

	public async put<T>(endpoint: string, body: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(body),
		});
	}

	public async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}
}

// Export a singleton instance
const api = new ApiService();
export default api;
