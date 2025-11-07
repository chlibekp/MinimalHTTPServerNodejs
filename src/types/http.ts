import HTTPHeaders from "../http/headers";

type HTTPServerEvents = {
	request: (req: any, res: any) => void;
	listening: (port: number) => void;
}

type Headers = Record<string, string>;

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

type RequestLine = {
	method: Methods;
	path: string;
	version: string;
}

type Request = {
	method: Methods;
	path: string;
	headers: HTTPHeaders;
	body: Buffer;
}


export type { HTTPServerEvents, Request, Headers, RequestLine, Methods };
