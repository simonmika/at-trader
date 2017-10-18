export interface IInstrumentIsin {
	ID: number
	InstrumentID: string
	NewIsin: string
	ReplacedIsin: string
	ValidFrom?: any
	ValidTo: Date
	DateCreated: Date
	DateModified: Date
}
