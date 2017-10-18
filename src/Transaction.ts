import * as Moment from "moment"

export class Transaction {
	constructor(
		readonly time: Moment.Moment,
		readonly volume: number,
		readonly price: number,
		readonly seller: string,
		readonly buyer: string) { }
	asCsv(): string {
		return `${this.time.toISOString()}, ${this.volume}, ${this.price}, ${this.seller}, ${this.buyer}\n`
	}
}
