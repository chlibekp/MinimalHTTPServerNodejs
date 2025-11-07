import TypedEmitter from 'typed-emitter';
import EventEmitter from 'events';
import { HTTPServerEvents } from '../types/http'; 
import TCPServer from '../tcp/server';
import net from 'node:net';
import RequestFactory from './requestFactory';
import ResponseFactory from './responseFactory';
import HTTPHeaders from './headers';

class HTTPServer extends (EventEmitter as new () => TypedEmitter<HTTPServerEvents>) {
	tcpServer: TCPServer;
	private routes: Map<string, Function>;
	constructor(port: number) {
		super();
		this.routes = new Map<string, Function>();
		this.tcpServer = new TCPServer(port);
	}

	listen() {
		this.tcpServer.listen();
	
		this.tcpServer.on("listening", (port: number) => {
			this.emit("listening", port);
		});

		// Handle new TCP connections
		this.tcpServer.on("connection", this.handleConnection.bind(this));
	}

	route(method: string, path: string, handler: (req: RequestFactory, res: ResponseFactory) => void) {	
		this.routes.set(`${method}${path}`, handler);
	}

	handleConnection(socket: net.Socket) {
		socket.on("data", (data: Buffer) => {
			const request = new RequestFactory()
				.setBuffer(data)
				.build();
			const url = new URL(`http://localhost${request.path}`)
			const callback = this.routes.get(`${request.method}${url.pathname}`)
			try {
				callback?.(request, new ResponseFactory(socket))
			} catch (error) {
				const response = new ResponseFactory(socket);
				response.writeHeader(500);
				const headers = new HTTPHeaders();
				headers.set("Content-Type", "text/plain");
				response.sendHeaders(headers)
				response.write("Internal Server Error");
				response.end();
			}
		});
	}
}

export default HTTPServer;
