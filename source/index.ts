import * as AktieTorget from "./AktieTorget"
const connection = AktieTorget.Connection.open()
async function todaysTransactionsAsCsv(): Promise<string> {
	const todaysTransactions = await connection.getTransactions("SE0007692124")
	return todaysTransactions.getTransactionsAsCsv()
}
async function currentOrdersAsCsv(): Promise<string> {
	const currentOrders = await connection.getOrders("SE0007692124")
	return currentOrders.getOrdersAsCsv()
}
todaysTransactionsAsCsv().then(data => console.log(data))
currentOrdersAsCsv().then(data => console.log(data))
