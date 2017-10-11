import * as Moment from "moment"
import * as RestClient from "../RestClient"
import * as Trader from "../Trader"
import { IDeal } from "./IDeal"
import { IOrders } from "./IOrders"
import { IOrdersLevel } from "./IOrdersLevel"

export class Connection {
	private constructor(private backend: RestClient.Connection) {
	}

	getTransactions(instrument: string, from = new Date(Date.now())): Promise<Trader.Transactions> {
		return this.backend.get(`/getinstrumentdeals.json?id=${instrument}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ?
				new Trader.Transactions((response.body as IDeal[])
					.map(deal => new Trader.Transaction(Moment(deal.DealDateTime), deal.Volume,	deal.Price, deal.SellerShortName, deal.BuyerShortName)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) :
				undefined,
				reason => reason,
			)
	}
	getOrders(instrument: string): Promise<Trader.Orders> {
		return this.backend.get(`/getinstrumentorders.json?id=${instrument}`)
			.then(
				response => response && response.status.code == 200 ?
				Connection.convert(response.body as IOrders) :
				undefined,
				reason => reason,
			)
	}
	private static convert(orders: IOrders): Trader.Orders {
		const buy: Trader.Order[] = []
		const sell: Trader.Order[] = []
		orders.Levels.forEach(order => {
			if (order.AskCount > 0)
				sell.push(new Trader.Order(order.AskPrice, order.AskVolume, order.AskCount))
			if (order.BidCount > 0)
				buy.push(new Trader.Order(order.BidPrice, order.BidVolume, order.BidCount))
		})
		return new Trader.Orders(buy, sell)
	}
	static open(): Connection {
		return new Connection(new RestClient.Connection("json.aktietorget.se", false))
	}
}
