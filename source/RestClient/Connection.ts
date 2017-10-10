import http = require("http")
import https = require("https")

import { Response } from "./Response"

export class Connection {
	private requestMethod: (options: http.RequestOptions, callback?: (result: http.IncomingMessage) =>void ) => http.ClientRequest
	private options: http.RequestOptions
	private timeout = 32000
	constructor(private host: string, encrypted?: boolean, port?: number) {
		this.options = {
			headers: { },
			protocol: encrypted ? "https:" : "http:",
			hostname: host,
			port: port ? port : encrypted ? 443 : 80,
			agent: encrypted ? <http.Agent>new https.Agent({ rejectUnauthorized: false }) : new http.Agent()
		}
		this.requestMethod = encrypted ? https.request : http.request
	}
	setHeader(key: string, value: string | number) {
		this.options.headers[key] = value
	}
	async get(path: string, accept?: string): Promise<Response> {
		return this.request("GET", path, undefined, accept)
	}
	async post(path: string, body?: any, accept?: string): Promise<Response> {
		return this.request("POST", path, body, accept)
	}
	async put(path: string, body?: any, accept?: string): Promise<Response> {
		return this.request("PUT", path, body, accept)
	}
	async patch(path: string, body?: any, accept?: string): Promise<Response> {
		return this.request("PATCH", path, body, accept)
	}
	async delete(path: string, accept?: string): Promise<Response> {
		return this.request("DELETE", path, accept)
	}
	private async request(method: string, path: string, body?: any, accept?: string): Promise<Response> {
		this.options.method = method
		this.options.path = path
		if (body)
			this.options.headers["content-type"] = "application/json; charset=UTF-8"
		else
			delete this.options.headers["content-type"]
		if (!accept)
			accept = "application/json; charset=UTF-8"
		this.options.headers["accept"] = accept
		var data: string
		if (body) {
			data = JSON.stringify(body)
			// TODO: seams not to work
			//this.setHeader("content-length", Buffer.byteLength(data, "utf8"))
		}
		return new Promise<Response>((resolve, reject) => {
			try {
				var request = this.requestMethod(this.options, message => {
					message.setEncoding("utf8")
					var body = ""
					var result = { status: { code: message.statusCode, message: message.statusMessage }, headers: message.headers, body: <string>undefined }
					message.on("data", (chunk: string) => body += chunk)
					message.on("end", () => {
						if (result.status.code >= 200 && result.status.code < 300 && (<string>result.headers["content-type"]).startsWith(accept)) {
							if (body) {
								switch (accept) {
									case "application/json; charset=UTF-8":
										result.body = JSON.parse(body)
										break;
									default:
										result.body = body
										break;
								}
							} else
								result.body = undefined
						} else if (result.status.code >= 300) {
/*							console.log("Received Error:")
							console.log(this.options)
							console.log(data)
							console.log(result)
							console.log(body)
*/
							result.body = undefined
						}
						resolve(result)
					})
					message.on("error", (error : any) => {
						error["method"] = method
						error["path"] = path
						error["body"] = body
						reject(error)
					})
				})
				request.on("error", (error: any) => {
					error["method"] = method
					error["path"] = path
					error["body"] = body
					reject(error)
				})
				request.end(data)
				request.setTimeout(this.timeout, () => reject({ errno: "timeout " + this.timeout }))
			} catch (error) {
				error["method"] = method
				error["path"] = path
				error["body"] = body
				reject(error)
			}
		})
	}
}
