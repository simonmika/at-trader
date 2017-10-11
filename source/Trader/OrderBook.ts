import { Order } from "./Order"
import { Orders } from "./Orders"
export class OrderBook {
	get spread(): number {
		return this.buy.first.price - this.sell.first.price
	}
	constructor(readonly buy: Orders, readonly sell: Orders) {
	}
	selectDepth(depth: number): OrderBook {
		return new OrderBook(this.buy.selectDepth(depth), this.sell.selectDepth(depth))
	}
	selectVolume(volume?: number): OrderBook {
		volume = Math.min(volume ? volume : Number.MAX_VALUE, this.sell.volume, this.buy.volume)
		return new OrderBook(this.buy.selectVolume(volume), this.sell.selectVolume(volume))
	}
}
