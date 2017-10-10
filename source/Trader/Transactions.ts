import * as Moment from "moment"

import { Transaction } from "./Transaction"

export class Transactions {
	private volume: number
	private amount: number
	private averagePrice: number
	private minimumPrice: number
	private maximumPrice: number
	private firstPrice: number
	private lastPrice: number
	private startTime: Moment.Moment
	private endTime: Moment.Moment
	constructor(private data: Transaction[]) {
	}
	getVolume(): number {
		if (!this.volume)
			this.volume = this.data.map(deal => deal.volume).reduce((sum, current) => sum + current, 0)
		return this.volume
	}
	getAmount(): number {
		if (!this.amount)
			this.amount = this.data.map(deal => deal.price * deal.volume).reduce((sum, current) => sum + current, 0)
		return this.amount
	}
	getAveragePrice(): number {
		if (!this.averagePrice)
			this.averagePrice = this.getAmount() / this.getVolume()
		return this.averagePrice
	}
	getMinimumPrice(): number {
		if (!this.minimumPrice) {
			this.data.forEach(deal => {
				if (!this.minimumPrice || this.minimumPrice > deal.price)
					this.minimumPrice = deal.price
			})
		}
		return this.minimumPrice
	}
	getMaximumPrice(): number {
		if (!this.maximumPrice) {
			this.data.forEach(deal => {
				if (!this.maximumPrice || this.maximumPrice > deal.price)
					this.maximumPrice = deal.price
			})
		}
		return this.maximumPrice
	}
	getFirstPrice(): number {
		if (!this.firstPrice && this.data.length > 0)
			this.firstPrice = this.data[this.data.length - 1].price
		return this.firstPrice
	}
	getLastPrice(): number {
		if (!this.lastPrice && this.data.length > 0)
			this.lastPrice = this.data[0].price
		return this.lastPrice
	}
	getStartTime(): Moment.Moment {
		if (!this.startTime && this.data.length > 0)
			this.startTime = this.data[this.data.length - 1].time
		return this.startTime
	}
	getEndTime(): Moment.Moment {
		if (!this.endTime && this.data.length > 0)
			this.endTime = this.data[0].time
		return this.endTime
	}
	getDealsAsCsv(): string {
		return "time, volume, price\n" + this.data.map(deal => deal.asCsv()).join("")
	}
	asCsv(): string {
		return `${this.getStartTime()}, ${this.getEndTime()}, ${this.getVolume()}, ${this.getAveragePrice()}, ${this.getFirstPrice()}, ${this.getLastPrice()}, ${this.getMinimumPrice()}, ${this.getMaximumPrice()}\n`
	}
	merge(other: Transactions): Transactions {
		return new Transactions(this.data.concat(other.data).sort((left, right) => left.time.valueOf() - right.time.valueOf()))
	}
	split(interval: Moment.Duration): Transactions[] {
		const result = [] as Transactions[]
		let start = this.startTime
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
