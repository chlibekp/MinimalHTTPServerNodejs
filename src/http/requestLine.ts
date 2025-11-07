import { Methods, RequestLine } from "../types/http";

function parseHTTPRequestLine(rawFirstLine: string): RequestLine {
	const parts = rawFirstLine.split(' ');
	// Expecting exactly 3 parts: METHOD PATH VERSION
	if (parts.length !== 3) {
		throw new Error('Invalid HTTP request line');
	}
	const method = parts[0] as Methods;
	const path = parts[1];
	const version = parts[2];
	return { method, path, version }; 
}

class HTTPRequestLine {
	private firstLine: RequestLine; 
	private rawFirstLine: string;
	constructor(rawFirstLine: string) {
		this.rawFirstLine = rawFirstLine;
		this.firstLine = parseHTTPRequestLine(rawFirstLine);	
	}

	getMethod(): Methods {
		return this.firstLine.method;
	}
	
	getPath(): string {
		return this.firstLine.path;
	}
	getVersion(): string {
		return this.firstLine.version;
	}
	getRaw(): string {
		return this.rawFirstLine;	
	}
}

export default HTTPRequestLine;
