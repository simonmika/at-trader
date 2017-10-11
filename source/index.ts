import * as AktieTorget from "./AktieTorget"

const instrument = AktieTorget.Instrument.open("SE0007692124")
instrument.getTransactions().then(transactions => console.log(transactions.getTransactionsAsCsv()))
instrument.getOrderBook().then(orderBook => console.log("buy\n" + orderBook.buy.getOrdersAsCsv() + "\nsell\n" + orderBook.sell.getOrdersAsCsv()))
