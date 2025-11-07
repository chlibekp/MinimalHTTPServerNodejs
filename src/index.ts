import HTTPHeaders from "./http/headers";
import HTTPServer from "./http/server";

const server = new HTTPServer(3000);

server.listen();

server.on("listening", (port: number) => {
	console.log(`HTTP Server is listening on port ${port}`);
})

server.route("GET", "/", (req, res) => {
	res.writeHeader(200);
	const headers = new HTTPHeaders();
	headers.set("Content-Type", "application/json");
	res.sendHeaders(headers)
	res.write(JSON.stringify({ message: "Hello, World!" }));
	res.end();
})
