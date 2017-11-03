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
	private averageCache: number
	get average(): number {
		if (!this.averageCache)
			this.averageCache = this.amount / this.volume
		return this.averageCache
	}
	private lowCache: number
	get low(): number {
		if (!this.lowCache) {
			this.data.forEach(deal => {
				if (!this.lowCache || this.lowCache > deal.price)
					this.lowCache = deal.price
			})
		}
		return this.lowCache
	}
	private highCache: number
	get high(): number {
		if (!this.highCache) {
			this.data.forEach(deal => {
				if (!this.highCache || this.highCache < deal.price)
					this.highCache = deal.price
			})
		}
		return this.highCache
	}
	private openCache: number
	get open(): number {
		if (!this.openCache && this.data.length > 0)
			this.openCache = this.data[0].price
		return this.openCache
	}
	private closeCache: number
	get close(): number {
		if (!this.closeCache && this.data.length > 0)
			this.closeCache = this.data[this.data.length - 1].price
		return this.closeCache
	}
	private dateCache: Date
	get date(): Date {
		if (!this.dateCache && this.data.length > 0)
		this.dateCache = this.data[0].time
		return this.dateCache
	}
	private endDateCache: Date
	get endDate(): Date {
		if (!this.endDateCache && this.data.length > 0)
		this.endDateCache = this.data[this.data.length - 1].time
		return this.endDateCache
	}
	constructor(private data: Transaction[]) { }
	getTransactionsAsCsv(): string {
		return "time, volume, price\n" + this.data.map(deal => deal.asCsv()).join("")
	}
	asCsv(): string {
		return `${this.date.toISOString()}, ${this.endDate.toISOString()}, ${this.volume}, ${this.average}, ${this.open}, ${this.close}, ${this.low}, ${this.high}\n`
	}
	merge(other: Transactions): Transactions {
		return new Transactions(this.data.concat(other.data).sort((left, right) => right.time.valueOf() - left.time.valueOf()))
	}
	split(intervall: Intervall): Transactions[] {
		let start = round(this.date, intervall)
		let close = this.open
		const result = [] as Transactions[]
		do {
			const end = increase(start, intervall)
			const data = this.data.filter(deal => deal.time >= start && deal.time < end)
			if (data.length == 0)
				data.push(new Transaction(start, 0, close, "", ""))
			const r = new Transactions(data)
			result.push(r)
			close = r.close
			start = end
		} while (start.valueOf() < this.endDate.valueOf())
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
