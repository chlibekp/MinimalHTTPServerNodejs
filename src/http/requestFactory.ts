import HTTPHeaders from "./headers";
import HTTPRequestLine from "./requestLine";
import HTTPRequest from "./request";

class RequestFactory {
	private buffer: Buffer;
	constructor() { }

	setBuffer(buffer: Buffer) {
		this.buffer = buffer;
		return this;
	}

	build(): HTTPRequest {
		// Find where the body starts
		const bodyStartIndex = this.buffer.indexOf('\r\n\r\n');
		// Extract the head (request line + headers)
		const head = bodyStartIndex == -1 ? this.buffer.toString() : this.buffer.subarray(0, bodyStartIndex).toString();
		const [RequestLineRaw, ...headersRaw] = head.split("\r\n");

		// Parse the request line
		const headers = new HTTPHeaders(headersRaw);
		const firstLine = new HTTPRequestLine(RequestLineRaw);

		// Create new HTTPRequest
		const httpRequest = new HTTPRequest({
			method: firstLine.getMethod(),
			headers: headers,
			body: bodyStartIndex == -1 ? Buffer.alloc(0) : this.buffer.subarray(bodyStartIndex + 4),
			path: firstLine.getPath(),
		});

		return httpRequest;
	}
}

export default RequestFactory;
