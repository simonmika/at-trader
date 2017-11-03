import { Instrument, Transactions, Intervall } from "./"

async function run() {
	const instrument = await Instrument.open("SE0007692124")
	if (instrument) {
		const start = new Date(2017, 1, 1)
		let result: Transactions
		while (start.valueOf() <= Date.now()) {
			start.setDate(start.getDate() + 1)
			const transactions = (await instrument.getTransactions(start))
			result = result ? result.merge(transactions) : transactions
		}
		// console.log("SEB seller")
		// console.log("date, volume, price, buyer")
		result = result.filter(transaction => transaction.seller == "SHB")
		console.log(result.getTransactionsAsCsv())
		// let days = result.filter(transaction => transaction.seller == "SHB").split(Intervall.OneDay)
		// for (const day of days)
		// 	console.log(`${day.date.toLocaleDateString()}, ${day.volume}, ${day.average}`)
		// console.log("SEB buyer")
		// console.log("date, volume, price")
		// days = result.filter(transaction => transaction.buyer == "SHB").split(Intervall.OneDay)
		// for (const day of days)
		// 	console.log(`${day.date.toLocaleDateString()}, ${day.volume}, ${day.average}`)
		// 	// instrument.getOrderBook().then(orderBook => console.log("buy\n" + orderBook.buy.getOrdersAsCsv() + "\nsell\n" + orderBook.sell.getOrdersAsCsv()))
	}
}
run().then(() => console.error("done"))
console.error("started")
