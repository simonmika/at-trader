export class Transaction {
	get amount() { return this.price * this.volume }
	constructor(
		readonly time: Date,
		readonly volume: number,
		readonly price: number,
		readonly seller: string,
		readonly buyer: string) { }
	asCsv(): string {
		return `${this.time.toISOString()}, ${this.volume}, ${this.price}, ${this.seller}, ${this.buyer}\n`
	}
}
