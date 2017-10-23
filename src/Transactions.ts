import { Transaction } from "./Transaction"
import { Intervall, increase, round } from "./Intervall"

export class Transactions {
	private volumeCache: number
	get volume(): number {
		if (!this.volumeCache)
			this.volumeCache = this.data.map(deal => deal.volume).reduce((sum, current) => sum + current, 0)
		return this.volumeCache
	}
	private amountCache: number
	get amount(): number {
		if (!this.amountCache)
			this.amountCache = this.data.map(deal => deal.price * deal.volume).reduce((sum, current) => sum + current, 0)
		return this.amountCache
	}
	private averagePriceCache: number
	get averagePrice(): number {
		if (!this.averagePriceCache)
			this.averagePriceCache = this.amount / this.volume
		return this.averagePriceCache
	}
	private minimumPriceCache: number
	get minimumPrice(): number {
		if (!this.minimumPriceCache) {
			this.data.forEach(deal => {
				if (!this.minimumPriceCache || this.minimumPriceCache > deal.price)
					this.minimumPriceCache = deal.price
			})
		}
		return this.minimumPriceCache
	}
	private maximumPriceCache: number
	get maximumPrice(): number {
		if (!this.maximumPriceCache) {
			this.data.forEach(deal => {
				if (!this.maximumPriceCache || this.maximumPriceCache < deal.price)
					this.maximumPriceCache = deal.price
			})
		}
		return this.maximumPriceCache
	}
	private firstPriceCache: number
	get firstPrice(): number {
		if (!this.firstPriceCache && this.data.length > 0)
			this.firstPriceCache = this.data[this.data.length - 1].price
		return this.firstPriceCache
	}
	private lastPriceCache: number
	get lastPrice(): number {
		if (!this.lastPriceCache && this.data.length > 0)
			this.lastPriceCache = this.data[0].price
		return this.lastPriceCache
	}
	private startTimeCache: Date
	get startTime(): Date {
		if (!this.startTimeCache && this.data.length > 0)
		this.startTimeCache = this.data[0].time
		return this.startTimeCache
	}
	private endTimeCache: Date
	get endTime(): Date {
		if (!this.endTimeCache && this.data.length > 0)
		this.endTimeCache = this.data[this.data.length - 1].time
		return this.endTimeCache
	}
	constructor(private data: Transaction[]) { }
	getTransactionsAsCsv(): string {
		return "time, volume, price\n" + this.data.map(deal => deal.asCsv()).join("")
	}
	asCsv(): string {
		return `${this.startTime.toISOString()}, ${this.endTime.toISOString()}, ${this.volume}, ${this.averagePrice}, ${this.firstPrice}, ${this.lastPrice}, ${this.minimumPrice}, ${this.maximumPrice}\n`
	}
	merge(other: Transactions): Transactions {
		return new Transactions(this.data.concat(other.data).sort((left, right) => right.time.valueOf() - left.time.valueOf()))
	}
	split(intervall: Intervall): Transactions[] {
		let start = round(this.startTime, intervall)
		const result = [] as Transactions[]
		do {
			const end = increase(start, intervall)
			const data = this.data.filter(deal => deal.time >= start && deal.time < end)
			if (data && data.length > 0)
				result.push(new Transactions(data))
			start = end
		} while (start.valueOf() < this.endTime.valueOf())
		return result
	}
	map(): Transaction[]
	map<T>(map: (transaction: Transaction) => T): T[]
	map<T>(map?: (transaction: Transaction) => T): T[] | Transaction[] {
		return map ? this.data.map(map) : this.data
	}
	reduce<T>(reduce: (previous: T, current: Transaction) => T, initial: T): T {
		return this.data.reduce(reduce, initial)
	}
	filter(predicate: (transaction: Transaction) => boolean): Transactions {
		return new Transactions(this.data.filter(predicate))
	}
}
