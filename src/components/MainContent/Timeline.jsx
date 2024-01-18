import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Timeline({ value, onChange }) {
	return (
		<>
			<div className="w-fit flex justify-center items-center mx-auto">
				<Calendar
					className={`!border-none text-black !bg-white block`}
					onChange={onChange}
					value={value}
				/>
			</div>
		</>
	);
}
