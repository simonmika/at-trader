export class Quote {
	constructor(
		readonly todayAbsolute: number,
		readonly todayPrecent: number,
		readonly buy: number,
		readonly sell: number,
		readonly latest: number,
		readonly high: number,
		readonly low: number,
		readonly turnover: number,
		readonly valuation: number) {
		}
	}
