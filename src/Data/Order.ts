export class Order {
	constructor(readonly price: number, readonly volume: number, readonly count: number) {
	}
	asCsv(): string {
		return `${this.price}, ${this.volume}, ${this.count}\n`
	}
}
