"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ja } from "date-fns/locale"
import { WorkingDateCalculation, isSameDay } from "@/features/WorkingDateCalculation"

export const BusinessCalculation = () => {
	const [baseDate, setBaseDate] = useState<Date | undefined>(new Date());
	const [workingDate, setWorkingDate] = useState<number | undefined>(undefined);	// 営業日
	const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);			// 休業日
	const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);	// 納期
	const [isHolidayEditMode, setIsHolidayEditMode] = useState<Boolean>(false);		// 休業日の修正フラグ

	// 基準日を設定
	const handleDirectSetDate = (selectedDate: Date | undefined) => {
		setBaseDate(selectedDate);
	};

	// 営業日を設定
	const handleSetDate = (selectedDate: number | undefined) => {
		if (selectedDate === undefined) {
			setWorkingDate(undefined);
		} else if (!isNaN(selectedDate)) {
			setWorkingDate(selectedDate);
		}
	};

	// 休業日を設定
	const handleSetBusinessHoliday = (selectedDate: Date | undefined) => {
		if (!selectedDate) return;

		// 休業日の追加
		if (!highlightedDates.some((date) => isSameDay(date, selectedDate))) {
			setHighlightedDates([selectedDate, ...highlightedDates]);

		// 休業日の削除
		} else {
			const newDates = highlightedDates.filter((date) => !isSameDay(date, selectedDate));
			setHighlightedDates(newDates);
		}
	}

	// 納期を設定
	useEffect(() => {
		if (baseDate && workingDate !== undefined) {
			const workingDays: Date = WorkingDateCalculation(baseDate, workingDate, highlightedDates);
			setDeliveryDate(workingDays);
		}
	}, [baseDate, workingDate, highlightedDates]);

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
			<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
					営業日計算ツール
				</h1>
				<div className="flex flex-col space-y-6 items-center">
					<div className="w-full h-full flex flex-row gap-4">
						{/* 休業日 */}
						<div className="flex flex-col justify-center items-center w-full p-4 border rounded-md shadow-sm bg-white">
							<Label
								htmlFor="business-holiday"
								className="text-gray-700 mb-2 text-lg font-semibold"
							>
								休業日
							</Label>
							<Button
								variant="outline"
								onClick={() => setIsHolidayEditMode(!isHolidayEditMode)}
								className={`px-4 py-2 rounded-md ${
									isHolidayEditMode ? "bg-amber-500 hover:bg-amber-300 text-white" : ""
								}`}
							>
								{isHolidayEditMode ? "終了" : "追加"}
							</Button>
						</div>

						{/* 営業日 */}
						<div className="flex flex-col justify-center items-center w-full p-4 border rounded-md shadow-sm bg-white">
							<Label
								htmlFor="date"
								className="text-gray-700 mb-2 text-lg font-semibold"
							>
								営業日
							</Label>
							<Input
								id="date"
								type="number"
								min="0"
								placeholder="例：3"
								className="w-3/4 text-center border border-gray-300 rounded-md p-2"
								onChange={(e) => handleSetDate(parseInt(e.target.value))}
							/>
						</div>
					</div>
					<div className="flex flex-col items-center">
						<Label className="text-gray-700 mb-2 text-center">カレンダーから基準日を選択</Label>
						<Calendar
							locale={ja}
							mode="single"
							selected={baseDate}
							onSelect={isHolidayEditMode ? handleSetBusinessHoliday : handleDirectSetDate}
							className="rounded-md border max-w-sm w-fit"
							modifiers={{
								highlighted: highlightedDates,
							}}
							modifiersStyles={{
								highlighted: { backgroundColor: '#90cdf4' }
							}}
						/>
						<div className="flex items-center mt-5">
							<span className="block w-4 h-4 bg-black rounded-sm"></span>
							<span className="ml-2 mr-10 text-gray-700 text-sm">基準日</span>
							<span className="block w-4 h-4 bg-sky-300 rounded-sm"></span>
							<span className="ml-2 text-gray-700 text-sm">休業日</span>
						</div>
					</div>
					{workingDate !== undefined && baseDate !== undefined && (
						<>
							<p className="text-center text-gray-700 mt-4">
								{baseDate?.toLocaleDateString()}から<br/>{workingDate} 営業日後の<span className='font-bold'>納期</span>は<br/><span className='font-bold text-2xl'>{deliveryDate?.toLocaleDateString()}</span> です。
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
