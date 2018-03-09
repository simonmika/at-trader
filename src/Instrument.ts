import { Transactions } from "./Transactions"
import { OrderBook } from "./OrderBook"
import { Quote } from "./Quote"

export abstract class Instrument {
	protected constructor(readonly isin: string, readonly name: string, readonly shortName: string, readonly stockCount: number) {
	}
	abstract getTransactions(from?: Date): Promise<Transactions>
	abstract getOrderBook(): Promise<OrderBook>
	abstract getQuote(): Promise<Quote>
	static openers: ((isin: string) => Promise<Instrument | undefined>)[] = []
	static async open(isin: string): Promise<Instrument | undefined> {
		let result: Instrument | undefined
		for (const opener of Instrument.openers) {
			result = await opener(isin)
			if (result)
				break
		}
		return result
	}
}
