import { Instrument } from "./"

Instrument.open("SE0007692124").catch(reason => console.log(reason)).then(instrument => {
	if (instrument) {
		instrument.getTransactions().then(transactions => console.log(transactions.getTransactionsAsCsv()))
		instrument.getOrderBook().then(orderBook => console.log("buy\n" + orderBook.buy.getOrdersAsCsv() + "\nsell\n" + orderBook.sell.getOrdersAsCsv()))
	}
})
console.log("done")
