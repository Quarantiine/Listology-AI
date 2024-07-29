import React from "react";
import Calendar from "react-calendar";
import DateTimePicker from "react-datetime-picker";
import "react-calendar/dist/Calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function Timeline({ value, onChange }) {
	return (
		<>
			<div className="w-fit flex flex-col justify-center items-center mx-auto">
				<DateTimePicker
					onChange={onChange}
					value={value}
					calendarIcon={null}
					closeWidgets
					isCalendarOpen={false}
					isClockOpen={false}
				/>
				<Calendar
					className={`text-black w-full !bg-white !border-none flex flex-col justify-center items-center gap-2 p-2 mx-auto`}
					onChange={onChange}
					value={value}
				/>
			</div>
		</>
	);
}
