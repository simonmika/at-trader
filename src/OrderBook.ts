import { Order } from "./Order"
import { Orders } from "./Orders"

export class OrderBook {
	get average(): number {
		return (this.buy.average + this.sell.average) / 2
	}
	get buyPrice(): number {
		return this.buy.first.price
	}
	get sellPrice(): number {
		return this.sell.first.price
	}
	get spread(): number {
		return this.buyPrice - this.sellPrice
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
	selectPrice(minimum: number, maximum: number): OrderBook {
		return new OrderBook(this.buy.selectMinimumPrice(minimum), this.sell.selectMaximumPrice(maximum))
	}
	zip(): { buy: Order, sell: Order }[] {
		const result: { buy: Order, sell: Order }[] = []
		const count = Math.max(this.buy.length, this.sell.length)
		for (let i = 0; i < count; i++)
			result.push({ buy: this.buy.get(i), sell: this.sell.get(i) })
		return result
	}
}
