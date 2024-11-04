import holidays from "@holiday-jp/holiday_jp";
import { addDays } from "date-fns";

// 営業日（月曜から金曜）の設定
const BUSINESS_DAYS = [1, 2, 3, 4, 5];

/**
 * 指定された日付が祝日かどうかを判定
 * @param date 判定する日付
 * @returns 祝日の場合はtrue、それ以外はfalse
 */
function isHoliday(date: Date): boolean {
	return holidays.isHoliday(date);
}

/**
 * 指定された日付が営業日かどうかを判定
 * 営業日は平日（月曜から金曜）かつ祝日でない日を指す
 * @param date 判定する日付
 * @returns 営業日の場合はtrue、それ以外はfalse
 */
function isBusinessDay(date: Date): boolean {
	return BUSINESS_DAYS.includes(date.getDay()) && !isHoliday(date);
}
/**
 * 指定された日付から指定された営業日数後の日付を取得
 * 土日と祝日はスキップ
 * @param date 基準となる日付
 * @param days 追加する営業日数
 * @returns 指定された営業日数後の日付
 */
function addBusinessDays(date: Date, days: number): Date {
	let result = new Date(date);
	let remainingDays = days;
	const direction = days >= 0 ? 1 : -1;

	while (remainingDays !== 0) {
	  result = addDays(result, direction);
	  if (isBusinessDay(result)) {
		remainingDays -= direction;
	  }
	}

	return result;
}

/**
 * 指定された日数後の営業日を取得
 * @param addDays 追加する日数
 * @returns 営業日
 */
export const WorkingDateCalculation = (addDays: number) => {
	const workingDate: Date = addBusinessDays(new Date(), addDays);
	return workingDate;
}