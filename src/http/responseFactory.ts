import net from "net";
import HTTPHeaders from "./headers";

const VERSION = "1.1"

const httpStatuses = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "103": "Early Hints",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "306": "Switch Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Too Early",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "451": "Unavailable For Legal Reasons",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}

function checkOpenSocket(socket: net.Socket) {
	if(socket.readyState !== "open") {
		throw new Error("Connection closed")
	}
}

class ResponseFactory {
	private socket: net.Socket;
	private firstLineSent: boolean = false;
	private headersSent: boolean = false;
	constructor(socket: net.Socket) {
		this.socket = socket;
	}

	writeHeader(statusCode: number) {
		checkOpenSocket(this.socket);

		if(this.firstLineSent) {
			throw new Error("First line already sent");
		}

		// Make sure the response status code is valid
		if(!Object.keys(httpStatuses).includes(statusCode?.toString())) {
			throw new Error("Invalid status code");
		}

		// Write the first line
		this.socket.write(`HTTP/${VERSION} ${statusCode} ${httpStatuses[statusCode.toString()]}\r\n`);

		this.firstLineSent = true;
	}

	sendHeaders(headers: HTTPHeaders) {
		checkOpenSocket(this.socket);
		if(!this.firstLineSent) {
			throw new Error("First line not sent yet");
		}
		if(this.headersSent) {
			throw new Error("Headers already sent");
		}
		// Write all headers
		for (const [key, value] of Object.entries(headers.getAll())) {
			this.socket.write(`${key}: ${value}\r\n`);
		}
		this.socket.write(`\r\n`); // End of headers
		this.headersSent = true;
	}

	write(data: string | Buffer) {
		checkOpenSocket(this.socket);
		if(!this.firstLineSent) {
			throw new Error("Header not sent yet");
		}
		if(!this.headersSent) {
			throw new Error("Headers not sent yet");
		}
		// Write the data
		this.socket.write(data)
	}

	end() {
		if(this.socket.readyState !== "open") {
			return;
		}
		// End the response
		this.socket.end()
	}
}

export default ResponseFactory;
