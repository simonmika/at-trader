import * as Moment from "moment"

export class Transaction {
	constructor(
		public time: Moment.Moment,
		public volume: number,
		public price: number) { }
	asCsv(): string {
		return `${this.time}, ${this.volume}, ${this.price}\n`
	}
}
