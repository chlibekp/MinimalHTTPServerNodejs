import { Headers } from "../types/http";

function parseHeaders(lines: string[]): Headers {
	const headers: Headers = {};
	for (const line of lines) {
		const [key, ...rest] = line.split(':');
		headers[key.trim().toLowerCase()] = rest.join(':').trim();
	}
	return headers;
}

class HTTPHeaders {
	private headers: Headers = {};
	constructor(headersRaw: string[]) {
		this.headers = parseHeaders(headersRaw);		
	}

	getAll() : Headers {
		return this.headers;
	}

	get(key: string): string | undefined {
		return this.headers[key.toLowerCase()];
	}

	set(key: string, value: string): void {
		this.headers[key.toLowerCase()] = value;
	}

	toString(): string {
		// Simple JSON representation
		return JSON.stringify(this.headers);
	}
}

export default HTTPHeaders;
