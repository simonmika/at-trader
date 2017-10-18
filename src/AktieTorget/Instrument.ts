import * as Moment from "moment"
import * as RestClient from "../RestClient"
import * as Data from "../"
import { openers } from "../Instrument"
import { IDeal } from "./IDeal"
import { IOrders } from "./IOrders"
import { IOrdersLevel } from "./IOrdersLevel"
import { IInstrument } from "./IInstrument"

export class Instrument extends Data.Instrument {
	private constructor(private data: IInstrument) {
		super(data.InstrumentID, data.Name, data.ShortName, data.NoOfStocks)
	}
	getTransactions(from = new Date(Date.now())): Promise<Data.Transactions> {
		return Instrument.connection.get(`/getinstrumentdeals.json?id=${this.isin}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ?
				new Data.Transactions((response.body as IDeal[])
					.map(deal => new Data.Transaction(Moment(deal.DealDateTime), deal.Volume,	deal.Price, deal.SellerShortName, deal.BuyerShortName)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) :
				undefined,
				reason => reason,
			)
	}
	getOrderBook(): Promise<Data.OrderBook> {
		return Instrument.connection.get(`/getinstrumentorders.json?id=${this.isin}`)
			.then(
				response => response && response.status.code == 200 ?
				Instrument.convert(response.body as IOrders) :
				undefined,
				reason => reason,
			)
	}
	private static convert(orders: IOrders): Data.OrderBook {
		const buy: Data.Order[] = []
		const sell: Data.Order[] = []
		orders.Levels.forEach(order => {
			if (order.AskCount > 0)
				sell.push(new Data.Order(order.AskPrice, order.AskVolume, order.AskCount))
			if (order.BidCount > 0)
				buy.push(new Data.Order(order.BidPrice, order.BidVolume, order.BidCount))
		})
		return new Data.OrderBook(new Data.Orders(buy), new Data.Orders(sell))
	}
	private static readonly connection = new RestClient.Connection("json.aktietorget.se", false)
	static async open(isin: string): Promise<Instrument | undefined>
	static async open(): Promise<Instrument[]>
	static async open(isin?: string): Promise<Instrument[] | Instrument | undefined> {
		const data = await Instrument.connection.get(`/instruments.json${ isin ? `?id=${isin}` : "" }`).then(response => response && response.status.code == 200 ? response.body as IInstrument[] : undefined)
		return !data ? [] :
			!isin ? data.map(instrument => new Instrument(instrument)) :
			data && data.length > 0 ? new Instrument(data[0]) :
			undefined
	}
}
openers.push(Instrument.open)
