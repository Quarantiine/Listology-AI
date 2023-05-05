import React, { useContext, useEffect } from "react";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";
import Folders from "./Folders";
import TodolistSidebar from "./TodolistSidebar";
import Misc from "./Misc";

export default function Sidebar() {
	const { user } = useContext(UserCredentialCtx);
	const { closeSidebar, setCloseSidebar, openTodolistSidebar, handleCloseSidebar } = useContext(StateCtx);

	useEffect(() => {
		const handleCloseSidebar = (e) => {
			if (!e.target.closest(".sidebar")) {
				if (window.innerWidth < 768) {
					setCloseSidebar(true);
				}
			}
		};

		document.addEventListener("mousedown", handleCloseSidebar);
		return () => document.removeEventListener("mousedown", handleCloseSidebar);
	}, [setCloseSidebar]);

	return (
		<>
			{!closeSidebar ? (
				<div
					className={`sidebar todolist-sidebar z-50 transition-colors duration-300 ${
						user.themeColor ? "bg-[#222]" : "bg-white"
					} fixed md:sticky top-0 left-0 min-w-[280px] max-w-[280px] h-full flex flex-col justify-start items-start border-r-2 ${
						user.themeColor ? "border-[#333]" : "border-gray-200"
					}`}
				>
					{openTodolistSidebar && <TodolistSidebar />}
					<Folders handleCloseSidebar={handleCloseSidebar} />
					<Misc user={user} />
				</div>
			) : (
				<>
					<div
						className={`relative top-0 left-0 text-btn min-w-[20px] h-full ${
							user.themeColor ? "bg-[#333]" : "bg-gray-200"
						}`}
						onClick={handleCloseSidebar}
					></div>
				</>
			)}
		</>
	);
}
