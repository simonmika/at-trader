import { Status } from "./Status"
import { Response } from "./Response"

export interface Response {
	status: Status
	headers: any
	body: any
}
