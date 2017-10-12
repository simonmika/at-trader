import * as Moment from "moment"
import * as RestClient from "../RestClient"
import * as Data from "../Data"
import { IDeal } from "./IDeal"
import { IOrders } from "./IOrders"
import { IOrdersLevel } from "./IOrdersLevel"

export class Instrument {
	private constructor(private connection: RestClient.Connection, private identifier: string) {
	}

	getTransactions(from = new Date(Date.now())): Promise<Data.Transactions> {
		return this.connection.get(`/getinstrumentdeals.json?id=${this.identifier}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ?
				new Data.Transactions((response.body as IDeal[])
					.map(deal => new Data.Transaction(Moment(deal.DealDateTime), deal.Volume,	deal.Price, deal.SellerShortName, deal.BuyerShortName)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) :
				undefined,
				reason => reason,
			)
	}
	getOrderBook(): Promise<Data.OrderBook> {
		return this.connection.get(`/getinstrumentorders.json?id=${this.identifier}`)
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
	static open(identifier: string): Instrument {
		return new Instrument(new RestClient.Connection("json.aktietorget.se", false), identifier)
	}
}
