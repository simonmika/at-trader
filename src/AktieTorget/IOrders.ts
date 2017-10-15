import { IOrdersLevel } from "./IOrdersLevel"

export interface IOrders {
	isin: string
	CompanyId: number
	MaxLevel: number
	Levels: IOrdersLevel[]
}
