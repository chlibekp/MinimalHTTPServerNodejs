import EventEmitter from "node:events";
import TypedEmitter from "typed-emitter";
import net from "node:net"

import { TCPServerEvents } from "../types/tcp.ts";


class TCPServer extends (EventEmitter as new () => TypedEmitter<TCPServerEvents>) {
	port: number;
	server: net.Server;
	constructor(port: number) {
		super();
		this.port = port;
	}

	listen() {
		this.server = net.createServer((socket) => {
			this.emit("connection", socket);
		});

		// Start listening on the specified port
		this.server.listen(this.port, () => {
			this.emit("listening", this.port);
		});

		// Handle server errors
		this.server.on("error", (err) => {
			this.emit("error", err);
		});
	}
}

export default TCPServer;
