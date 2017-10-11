import { Order } from "./Order"
export class Orders {
	constructor(readonly buy: Order[], readonly sell: Order[]) {
	}
	getOrdersAsCsv(): string {
		return "direction, price, volume, count\n" + this.buy.map(order => "buy, " + order.asCsv()).join("") + this.sell.map(order => "sell, " + order.asCsv()).join("")
	}
}
