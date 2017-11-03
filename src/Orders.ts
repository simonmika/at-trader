import { Order } from "./Order"
export class Orders {
	get length(): number { return this.data.length }
	get first(): Order {
		return this.data[0]
	}
	volumeCache: number
	get volume(): number {
		if (!this.volumeCache)
			this.volumeCache = this.data.reduce((accumulated, order) => accumulated + order.volume, 0)
		return this.volumeCache
	}
	amountCache: number
	get amount(): number {
		if (!this.amountCache)
			this.amountCache = this.data.reduce((accumulated, order) => accumulated + order.price * order.volume, 0)
		return this.amountCache
	}
	averageCache: number
	get average(): number {
		if (!this.averageCache)
			this.averageCache = this.amount / this.volume
		return this.averageCache
	}
	constructor(private readonly data: Order[]) {
	}
	get(index: number): Order {
		return this.data[index]
	}
	getOrdersAsCsv(): string {
		return "price, volume, count\n" + this.data.map(order => order.asCsv()).join("")
	}
	selectDepth(depth: number): Orders {
		const result: Order[] = []
		for (let i = 0; i < depth && i < this.data.length; i++)
			result.push(this.data[i])
		return new Orders(result)
	}
	selectVolume(volume: number): Orders {
		const result: Order[] = []
		let count = volume
		for (const order of this.data)
			if (count > 0) {
				result.push(count > order.count ? order : new Order(order.price, count, 0))
				count -= order.volume
			} else
				break
		return new Orders(result)
	}
	selectMinimumPrice(level: number): Orders {
		const result: Order[] = []
		for (const order of this.data)
			if (order.price >= level)
				result.push(order)
		return new Orders(result)
	}
	selectMaximumPrice(level: number): Orders {
		const result: Order[] = []
		for (const order of this.data)
			if (order.price <= level)
				result.push(order)
		return new Orders(result)
	}
	map(): Order[]
	map<T>(map: (order: Order) => T): T[]
	map<T>(map?: (order: Order) => T): T[] | Order[] {
		return map ? this.data.map(map) : this.data
	}
	reduce<T>(reduce: (previous: T, current: Order) => T, initial: T): T {
		return this.data.reduce(reduce, initial)
	}
	filter(predicate: (order: Order) => boolean): Orders {
		return new Orders(this.data.filter(predicate))
	}
}
