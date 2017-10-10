import * as Moment from "moment"

export class Transaction {
	constructor(
		public readonly time: Moment.Moment,
		public readonly volume: number,
		public readonly price: number) { }
	asCsv(): string {
		return `${this.time}, ${this.volume}, ${this.price}\n`
	}
}
