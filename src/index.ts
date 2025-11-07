import HTTPServer from "./http/server.ts";

const server = new HTTPServer(3000);

server.listen();

server.on("listening", (port: number) => {
	console.log(`HTTP Server is listening on port ${port}`);
})
