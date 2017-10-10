import * as AktieTorget from "./AktieTorget"

const connection = AktieTorget.Connection.open()
const todaysTransactions = connection.GetTransactions("SE0007692124")
