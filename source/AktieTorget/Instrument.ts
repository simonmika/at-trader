import * as Moment from "moment"
import * as RestClient from "../RestClient"
import * as Trader from "../Trader"
import { IDeal } from "./IDeal"
import { IOrders } from "./IOrders"
import { IOrdersLevel } from "./IOrdersLevel"

export class Instrument {
	private constructor(private connection: RestClient.Connection, private identifier: string) {
	}

	getTransactions(from = new Date(Date.now())): Promise<Trader.Transactions> {
		return this.connection.get(`/getinstrumentdeals.json?id=${this.identifier}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ?
				new Trader.Transactions((response.body as IDeal[])
					.map(deal => new Trader.Transaction(Moment(deal.DealDateTime), deal.Volume,	deal.Price, deal.SellerShortName, deal.BuyerShortName)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) :
				undefined,
				reason => reason,
			)
	}
	getOrderBook(): Promise<Trader.OrderBook> {
		return this.connection.get(`/getinstrumentorders.json?id=${this.identifier}`)
			.then(
				response => response && response.status.code == 200 ?
				Instrument.convert(response.body as IOrders) :
				undefined,
				reason => reason,
			)
	}
	private static convert(orders: IOrders): Trader.OrderBook {
		const buy: Trader.Order[] = []
		const sell: Trader.Order[] = []
		orders.Levels.forEach(order => {
			if (order.AskCount > 0)
				sell.push(new Trader.Order(order.AskPrice, order.AskVolume, order.AskCount))
			if (order.BidCount > 0)
				buy.push(new Trader.Order(order.BidPrice, order.BidVolume, order.BidCount))
		})
		return new Trader.OrderBook(new Trader.Orders(buy), new Trader.Orders(sell))
	}
	static open(identifier: string): Instrument {
		return new Instrument(new RestClient.Connection("json.aktietorget.se", false), identifier)
	}
}
