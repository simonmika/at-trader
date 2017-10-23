export enum Intervall {
	OneMinute,
	TwoMinutes,
	FiveMinutes,
	TenMinutes,
	ThirtyMinutes,
	OneHour,
	OneDay,
	OneWeek,
	OneMonth,
	ThreeMonths,
	OneYear,
}

export function round(start: Date, intervall: Intervall) {
	let result: Date
	switch (intervall) {
		case Intervall.OneMinute: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes()); break
		case Intervall.TwoMinutes: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(start.getMinutes() / 2) * 2); break
		case Intervall.FiveMinutes: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(start.getMinutes() / 5) * 5); break
		case Intervall.TenMinutes: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(start.getMinutes() / 10) * 10); break
		case Intervall.ThirtyMinutes: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), Math.floor(start.getMinutes() / 30) * 30); break
		case Intervall.OneHour: result = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours()); break
		case Intervall.OneDay: result = new Date(start.getFullYear(), start.getMonth(), start.getDate()); break
		case Intervall.OneWeek:
			result = new Date(result.getFullYear(), start.getFullYear(), start.getMonth(), start.getDate())
			result.setDate(result.getDate() - (result.getDay() - 1) % 7)
			break
		case Intervall.OneMonth: result = new Date(start.getFullYear(), start.getMonth()); break
		case Intervall.ThreeMonths: result = new Date(start.getFullYear(), start.getMonth()); break
		case Intervall.OneYear: result = new Date(start.getFullYear()); break
	}
	return result
}

export function increase(start: Date, intervall: Intervall) {
	const result = new Date(start.valueOf())
	switch (intervall) {
		case Intervall.OneMinute: result.setMinutes(start.getMinutes() + 1); break
		case Intervall.TwoMinutes: result.setMinutes(start.getMinutes() + 2); break
		case Intervall.FiveMinutes: result.setMinutes(start.getMinutes() + 5); break
		case Intervall.TenMinutes: result.setMinutes(start.getMinutes() + 10); break
		case Intervall.ThirtyMinutes: result.setMinutes(start.getMinutes() + 30); break
		case Intervall.OneHour: result.setHours(start.getHours() + 1); break
		case Intervall.OneDay: result.setDate(start.getDate() + 1); break
		case Intervall.OneWeek: result.setDate(start.getDate() + 7); break
		case Intervall.OneMonth: result.setMonth(start.getMonth() + 1); break
		case Intervall.ThreeMonths: result.setMonth(start.getMonth() + 3); break
		case Intervall.OneYear: result.setFullYear(result.getFullYear() + 1); break
	}
	return result
}
