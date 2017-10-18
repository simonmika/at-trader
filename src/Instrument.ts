import * as Moment from "moment"
import * as Data from "./"

export abstract class Instrument {
	protected constructor(readonly isin: string, readonly name: string, readonly shortName: string, readonly stockCount: number) {
	}
	abstract getTransactions(from: Date): Promise<Data.Transactions>
	abstract getOrderBook(): Promise<Data.OrderBook>
	static async open(isin: string): Promise<Instrument | undefined> {
		let result: Instrument | undefined
		for (const opener of openers) {
			result = await opener(isin)
			if (result)
				break
		}
		return result
	}
}
export const openers: ((isin: string) => Promise<Instrument | undefined>)[] = []
