import * as Moment from "moment"

import { Transaction } from "./Transaction"

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
				if (!this.maximumPriceCache || this.maximumPriceCache > deal.price)
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
	private startTimeCache: Moment.Moment
	get startTime(): Moment.Moment {
		if (!this.startTimeCache && this.data.length > 0)
			this.startTimeCache = this.data[this.data.length - 1].time
		return this.startTimeCache
	}
	private endTimeCache: Moment.Moment
	get endTime(): Moment.Moment {
		if (!this.endTimeCache && this.data.length > 0)
			this.endTimeCache = this.data[0].time
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
		return new Transactions(this.data.concat(other.data).sort((left, right) => left.time.valueOf() - right.time.valueOf()))
	}
	split(interval: Moment.Duration): Transactions[] {
		const result = [] as Transactions[]
		let start = this.startTimeCache
		do {
			const end = start.add(interval)
			const data = this.data.filter(deal => deal.time >= start && deal.time < end)
			if (data && data.length > 0)
				result.push(new Transactions(data))
			start = end
		} while (start.valueOf() < this.endTime.valueOf())
		return result
	}
}
