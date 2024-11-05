"use client"

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ja } from "date-fns/locale"
import { WorkingDateCalculation } from "@/features/WorkingDateCalculation"

export const BusinessCalculation = () => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [daysToAdd, setDaysToAdd] = useState<number | undefined>(undefined);

	const handleSetDate = (e: React.ChangeEvent<HTMLInputElement>) => {
		const days = parseInt(e.target.value);
		if (!isNaN(days)) {
			setDaysToAdd(days);

			// 営業日の計算
			const workingDays: Date = WorkingDateCalculation(days);
			setDate(workingDays);
		} else {
			setDaysToAdd(undefined);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
			<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
					営業日計算ツール
				</h1>
				<div className="flex flex-col space-y-6 items-center">
					<div className="flex flex-col items-center">
						<Label htmlFor="date" className="text-gray-700 mb-1 block text-left">
							営業日
						</Label>
						<Input
							id="date"
							type="number"
							min="0"
							placeholder="例：3"
							className="w-2/4 text-center"
							onChange={handleSetDate}
						/>
					</div>
					<div className="flex flex-col items-center">
						<Label className="text-gray-700 mb-2 text-center">カレンダーから日付を選択</Label>
						<Calendar
							locale={ja}
							mode="single"
							selected={date}
							onSelect={(selectedDate) => setDate(selectedDate)}
							className="rounded-md border max-w-sm w-fit"
						/>
					</div>
					{daysToAdd !== undefined && (
						<p className="text-center text-gray-700 mt-4">
							{daysToAdd} 営業日後は <span className='font-bold'>{date?.toLocaleDateString()}</span> です。
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
