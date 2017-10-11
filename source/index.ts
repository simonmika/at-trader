import * as AktieTorget from "./AktieTorget"

const connection = AktieTorget.Connection.open()
async function todaysTransactionsAsCsv(): Promise<string> {
	const todaysTransactions = await connection.getTransactions("SE0007692124")
	return todaysTransactions.getTransactionsAsCsv()
}
async function currentOrdersAsCsv(): Promise<string> {
	const currentOrders = await connection.getOrderBook("SE0007692124")
	return "buy\n" + currentOrders.buy.getOrdersAsCsv() + "\nsell\n" + currentOrders.sell.getOrdersAsCsv()
}
todaysTransactionsAsCsv().then(data => console.log(data))
currentOrdersAsCsv().then(data => console.log(data))
