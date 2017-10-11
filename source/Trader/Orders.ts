import { Order } from "./Order"
export class Orders {
	get highestBuy(): Order {
		return this.buy[0]
	}
	get lowestSell(): Order {
		return this.sell[0]
	}
	get spread(): number {
		return this.highestBuy.price - this.lowestSell.price
	}
	buyVolumeCache: number
	get buyVolume(): number {
		if (!this.buyVolumeCache)
			this.buyVolumeCache = this.buy.reduce((accumulated, order) => accumulated + order.volume, 0)
		return this.buyVolumeCache
	}
	sellVolumeCache: number
	get sellVolume(): number {
		if (!this.sellVolumeCache)
			this.sellVolumeCache = this.sell.reduce((accumulated, order) => accumulated + order.volume, 0)
		return this.sellVolumeCache
	}
	constructor(readonly buy: Order[], readonly sell: Order[]) {
	}
	getOrdersAsCsv(): string {
		return "direction, price, volume, count\n" + this.buy.map(order => "buy, " + order.asCsv()).join("") + this.sell.map(order => "sell, " + order.asCsv()).join("")
	}
	selectDepth(depth: number): Orders {
		const buy: Order[] = []
		for (let i = 0; i < depth && i < this.buy.length; i++)
			buy.push(this.buy[i])
		const sell: Order[] = []
		for (let i = 0; i < depth && i < this.sell.length; i++)
			sell.push(this.sell[i])
		return new Orders(buy, sell)
	}
	selectVolume(volume: number): Orders {
		const buy: Order[] = []
		volume = Math.min(volume, this.sellVolume, this.buyVolume)
		let count = volume
		for (const order of this.buy)
			if (count > 0) {
				buy.push(count > order.count ? order : new Order(order.price, count, 0))
				count -= order.volume
			} else
				break
		const sell: Order[] = []
		count = volume
		for (const order of this.sell)
			if (count > 0) {
				sell.push(count > order.count ? order : new Order(order.price, count, 0))
				count -= order.volume
			} else
				break
		return new Orders(buy, sell)
	}
}
