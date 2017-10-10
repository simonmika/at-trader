import { IStatus } from "./IStatus"

export interface IResponse {
	status: IStatus
	headers: any
	body: any
}
