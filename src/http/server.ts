import TypedEmitter from 'typed-emitter';
import EventEmitter from 'node:events';
import { HTTPServerEvents } from '../types/http.ts'; 
import TCPServer from '../tcp/server.ts';
import net from 'node:net';
import RequestFactory from './requestFactory.ts';

class HTTPServer extends (EventEmitter as new () => TypedEmitter<HTTPServerEvents>) {
	tcpServer: TCPServer;
	constructor(port: number) {
		super();
		this.tcpServer = new TCPServer(port);
	}

	listen() {
		this.tcpServer.listen();
	
		this.tcpServer.on("listening", (port: number) => {
			this.emit("listening", port);
		});

		// Handle new TCP connections
		this.tcpServer.on("connection", this.handleConnection)
	}

	handleConnection(socket: net.Socket) {
		socket.on("data", (data: Buffer) => {
			const request = new RequestFactory()
				.setBuffer(data)
				.build();

			console.log(request)
		});
	}
}

export default HTTPServer;
