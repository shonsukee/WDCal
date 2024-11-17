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
 * 同日かどうかを判定
 * @param date1 休業日
 * @param date2 基準日
 * @returns 同日ならtrue、それ以外はfalse
 */
export function isSameDay(date1: Date, date2: Date): boolean {
	return date1.getDate() === date2.getDate() &&
	date1.getMonth() === date2.getMonth() &&
	date1.getFullYear() === date2.getFullYear();
}

/**
 * 指定された日付が営業日かどうかを判定
 * 営業日は平日（月曜から金曜）かつ祝日および休業日でない日を指す
 * @param date 判定する日付
 * @param holiday 休業日
 * @returns 営業日の場合はtrue、それ以外はfalse
 */
function isBusinessDay(date: Date, holiday: Date[]): boolean {
	return BUSINESS_DAYS.includes(date.getDay()) &&
	!isHoliday(date) &&
	!holiday.some((business_day) => isSameDay(business_day, date));
}

/**
 * 指定された日付から指定された営業日数後の日付を取得
 * 土日と祝日と休業日はスキップ
 * @param date 基準日
 * @param days 営業日数
 * @param holiday 休業日
 * @returns 指定された営業日数後の日付
 */
function addBusinessDays(date: Date, days: number, holiday: Date[]): Date {
	let result = new Date(date);
	let remainingDays = days;
	const direction = days >= 0 ? 1 : -1;

	while (remainingDays !== 0) {
	  result = addDays(result, direction);
	  // 営業日のみデクリメント
	  if (isBusinessDay(result, holiday)) {
		remainingDays -= direction;
	  }
	}

	return result;
}

/**
 * 指定された営業日後の納期を取得
 * @param date 基準日
 * @param addDays 追加する日数
 * @param holiday 休業日
 * @returns 納期
 */
export const WorkingDateCalculation = (date: Date, addDays: number, holiday: Date[]) => {
	const workingDate: Date = addBusinessDays(date, addDays+1, holiday);
	return workingDate;
}