type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpOptions {
    headers?: Record<string, string>;
    body?: any;
    token?: string;
}

function getToken(): string | null {
    return localStorage.getItem('token');
}

async function request(url: string, method: HttpMethod, options: HttpOptions = {}) {
    const token = options.token ?? getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json', ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return await fetch(`${url}`, {
        method, headers, body: options.body ? JSON.stringify(options.body) : undefined,
    });
}

export const http = {
    get: (url: string, options?: HttpOptions) => request(url, 'GET', options),
    post: (url: string, body: any, options?: HttpOptions) => request(url, 'POST', {...options, body}),
    put: (url: string, body: any, options?: HttpOptions) => request(url, 'PUT', {...options, body}),
    delete: (url: string, options?: HttpOptions) => request(url, 'DELETE', options),
};
