import * as RestClient from "../RestClient"
import { Instrument as BaseInstrument } from "../Instrument"
import { Transaction as BaseTransaction } from "../Transaction"
import { Transactions as BaseTransactions } from "../Transactions"
import { Order as BaseOrder } from "../Order"
import { Orders as BaseOrders } from "../Orders"
import { OrderBook as BaseOrderBook } from "../OrderBook"
import { IDeal } from "./IDeal"
import { IOrders } from "./IOrders"
import { IOrdersLevel } from "./IOrdersLevel"
import { IInstrument } from "./IInstrument"

export class Instrument extends BaseInstrument {
	private constructor(private data: IInstrument) {
		super(data.ISIN, data.Name, data.ShortName, data.NoOfStocks)
	}
	getTransactions(from = new Date(Date.now())): Promise<BaseTransactions> {
		return Instrument.connection.get(`/getinstrumentdeals.json?id=${this.isin}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ?
				new BaseTransactions((response.body as IDeal[])
					.map(deal => new BaseTransaction(new Date(Date.parse(deal.DealDateTime)), deal.Volume,	deal.Price, deal.SellerShortName, deal.BuyerShortName)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) :
				undefined,
				reason => reason,
			)
	}
	getOrderBook(): Promise<BaseOrderBook> {
		return Instrument.connection.get(`/getinstrumentorders.json?id=${this.isin}`)
			.then(
				response => response && response.status.code == 200 ?
				Instrument.convert(response.body as IOrders) :
				undefined,
				reason => reason,
			)
	}
	private static convert(orders: IOrders): BaseOrderBook {
		const buy: BaseOrder[] = []
		const sell: BaseOrder[] = []
		orders.Levels.forEach(order => {
			if (order.AskCount > 0)
				sell.push(new BaseOrder(order.AskPrice, order.AskVolume, order.AskCount))
			if (order.BidCount > 0)
				buy.push(new BaseOrder(order.BidPrice, order.BidVolume, order.BidCount))
		})
		return new BaseOrderBook(new BaseOrders(buy), new BaseOrders(sell))
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
BaseInstrument.openers.push(Instrument.open)
