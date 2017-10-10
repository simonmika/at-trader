import * as Moment from "moment"
import * as RestClient from "../RestClient"
import * as Trader from "../Trader"
import { IDeal } from "./IDeal"

export class Connection {
	private constructor(private backend: RestClient.Connection) {
	}

	GetTransactions(instrument: string, from: Date): Promise<Trader.Transactions> {
		return this.backend.get(`/getinstrumentdeals.json?id=${instrument}&DateFrom=${from.toLocaleDateString("SE-sv")}`)
			.then(
				response => response && response.status.code == 200 ? new Trader.Transactions((response.body as IDeal[]).map(deal => new Trader.Transaction(Moment(deal.DealDateTime), deal.Volume,	deal.Price)).sort((left, right) => left.time.valueOf() - right.time.valueOf())) : undefined,
				reason => reason,
			)
	}
	static open(): Connection {
		return new Connection(new RestClient.Connection("json.aktietorget.se", false))
	}
}
