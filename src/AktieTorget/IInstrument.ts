import { ICurrency } from "./ICurrency"
import { IInstrumentIsin } from "./IInstrumentIsin"

export interface IInstrument {
	InstrumentID: string
	ID_Instrument: number
	ISIN: string
	OrderBookID: number
	CompanyId: number
	ShortName: string
	Name: string
	ListName: string
	Observation: boolean
	History: boolean
	NoOfStocks: number
	RatioValue: number
	TradingLot: number
	StockNote: string
	DisplayName: string
	DisplayShortName: string
	ParentISIN: string
	ValidFrom: string
	ValidTo: string
	InstrumentType: number
	FormalName: string
	LiquidityProvider: string
	SortingName: string
	FirstTradingDate: string
	Title: string
	Keywords: string
	CountryCode: string
	Currency: ICurrency
	FISN: string
	CFI: string
	RealFirstDate?: any
	InstrumentIsins: IInstrumentIsin[]
	ShareClass: number
}
