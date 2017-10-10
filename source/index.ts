import * as AktieTorget from "./AktieTorget"

async function todaysTransactionsAsCsv(): Promise<string> {
	const connection = AktieTorget.Connection.open()
	const todaysTransactions = await connection.GetTransactions("SE0007692124")
	return todaysTransactions.getTransactionsAsCsv()
}
todaysTransactionsAsCsv().then(data => console.log(data))
