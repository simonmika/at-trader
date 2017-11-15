import { Transaction } from "./Transaction"
import { Transactions } from "./Transactions"

export class Brokers {
	private data: { [name: string]: { buy: { amount: number, volume: number, count: number }, sell: { amount: number, volume: number, count: number } }} = {}
	private constructor() { }
	get(name: string): { buy: { amount: number, volume: number, count: number }, sell: { amount: number, volume: number, count: number } } {
		let result = this.data[name]
		if (!result)
			result = { buy: { amount: 0, volume: 0, count: 0 }, sell: { amount: 0, volume: 0, count: 0 } }
		return result
	}
	private add(transaction: Transaction) {
		const buyer = this.get(transaction.buyer)
	}
	map(): { broker: string, netto: number, buy: { price: number, volume: number, count: number }, sell: { price: number, volume: number, count: number } }[] {
		const result: { broker: string, netto: number, buy: { price: number, volume: number, count: number }, sell: { price: number, volume: number, count: number } }[] = []
		for (const broker in this.data)
			if (this.data.hasOwnProperty(broker)) {
				const data = this.data[broker]
				result.push({ broker, netto: data.buy.volume - data.sell.volume, buy: { price: data.buy.amount / data.buy.volume, volume: data.buy.volume, count: data.buy.count }, sell: { price: data.sell.amount / data.sell.volume, volume: data.sell.volume, count: data.sell.count }})
			}
		return result.sort((left, right) => right.netto - left.netto)
	}
	static create(transactions: Transactions) {
		const result = new Brokers()
		transactions.apply(transaction => {
			const seller = result.get(transaction.seller)
			result.data[transaction.seller] = { buy: seller.buy, sell: { amount: seller.sell.amount + transaction.amount, volume: seller.sell.volume + transaction.volume, count: seller.sell.count + 1 } }
			const buyer = result.get(transaction.buyer)
			result.data[transaction.buyer] = { buy: { amount: buyer.buy.amount + transaction.amount, volume: buyer.buy.volume + transaction.volume, count: buyer.buy.count + 1 }, sell: buyer.sell }
		})
		return result
	}
}
