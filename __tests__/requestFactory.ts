import { describe, expect, test} from "@jest/globals";
import RequestFactory from "../src/http/requestFactory";

describe("http parsing in RequestFactory", () => {
	test("Succesfully parse HTTP request", () => {
		const testData = Buffer.from(`POST / HTTP/1.1\r\nHost: localhost:3000\r\nConnection: keep-alive\r\nsec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"\r\nsec-ch-ua-mobile: ?0\r\nsec-ch-ua-platform: "Windows"\r\nUpgrade-Insecure-Requests: 1\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/\r\n\r\ntest`)
		const request = new RequestFactory()
			.setBuffer(testData)
			.build();
		console.log(request);

		expect(request.method).toBe("POST");
		expect(request.path).toBe("/");
		expect(request.headers.get("Host")).toBe("localhost:3000");
		expect(request.headers.get("Connection")).toBe("keep-alive");
		expect(request.body.toString()).toBe("test");
		
	})
});
