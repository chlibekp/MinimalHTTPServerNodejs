import { Methods, Request } from "../types/http";
import HTTPHeaders from "./headers";

class HTTPRequest {
	public method: Methods;
	public path: string;
	public headers: HTTPHeaders;
	public body: Buffer;
	constructor(options: Request) {
		this.method = options.method;
		this.path = options.path;
		this.headers = options.headers;
		this.body = options.body;
	}
}

export default HTTPRequest;
