import { Transactions } from "./Transactions"

export class Prices {
	private lowCached: number
	get low(): number {
		if (!this.lowCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.lowCached || Number.parseFloat(price) < this.lowCached))
					this.lowCached = Number.parseFloat(price)
		return this.lowCached
	}
	private highCached: number
	get high(): number {
		if (!this.highCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.highCached || Number.parseFloat(price) > this.highCached))
					this.highCached = Number.parseFloat(price)
		return this.highCached
	}
	private minimumVolumeCached: number
	get minimumVolume(): number {
		if (!this.minimumVolumeCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.minimumVolumeCached || this.backend[price].volume < this.minimumVolumeCached))
					this.minimumVolumeCached = this.backend[price].volume
		return this.minimumVolumeCached
	}
	private maximumVolumeCached: number
	get maximumVolume(): number {
		if (!this.maximumVolumeCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.maximumVolumeCached || this.backend[price].volume > this.maximumVolumeCached))
					this.maximumVolumeCached = this.backend[price].volume
		return this.maximumVolumeCached
	}
	private minimumCountCached: number
	get minimumCount(): number {
		if (!this.minimumCountCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.minimumCountCached || this.backend[price].count < this.minimumCountCached))
					this.minimumCountCached = this.backend[price].count
		return this.minimumCountCached
	}
	private maximumCountCached: number
	get maximumCount(): number {
		if (!this.maximumCountCached)
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price) && (!this.maximumCountCached || this.backend[price].count > this.maximumCountCached))
					this.maximumCountCached = this.backend[price].count
		return this.maximumCountCached
	}
	private volumesCache: { price: number, value: number }[]
	get volumes() {
		if (!this.volumesCache) {
			this.volumesCache = []
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price))
					this.volumesCache.push({ price: Number.parseFloat(price), value: this.backend[price].volume })
			this.volumesCache = this.volumesCache.sort((left, right) => left.price - right.price)
		}
		return this.volumesCache
	}
	private countsCache: { price: number, value: number }[]
	get counts() {
		if (!this.countsCache) {
			this.countsCache = []
			for (const price in this.backend)
				if (this.backend.hasOwnProperty(price))
					this.countsCache.push({ price: Number.parseFloat(price), value: this.backend[price].count })
			this.countsCache = this.countsCache.sort((left, right) => left.price - right.price)
		}
		return this.countsCache
	}
	constructor(private readonly backend: { [price: number]: { volume: number, count: number } }) { }
	get(price: number) {
		return this.backend[price]
	}
	between(floor: number, ceiling: number) {
		const result: { [price: number]: { volume: number, count: number } } = {}
		for (const price in this.backend)
			if (this.backend.hasOwnProperty(price))
				result[price] = this.backend[price]
		return new Prices(result)
	}
	static create(transactions: Transactions): Prices {
		return new Prices(transactions.reduce((data: { [price: number]: { volume: number, count: number } }, current) => {
			const price = data[current.price]
			data[current.price] = price ? { volume: price.volume + current.volume, count: price.count + 1 } : { volume: current.volume, count: 1 }
			return data
		}, {}))
	}
}
