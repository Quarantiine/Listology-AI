import React, { useContext, useEffect, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";
import Folders from "./Folders";
import TodolistSidebar from "./TodolistSidebar";
import Filters from "./Filters";
// import Filters from "./Filters";
// import Misc from "./Misc";

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

const Misc = ({ user }) => {
	const { registration } = FirebaseApi();
	const { setOpenTodolistSidebar, setClickedFolder, setClickedTodoFolder } = useContext(StateCtx);

	const handleSigningOut = (e) => {
		e.preventDefault();
		setOpenTodolistSidebar(false);
		setClickedFolder("");
		setClickedTodoFolder("");
		registration.signingOut();
	};

	return (
		<>
			<div
				className={`flex transition-colors duration-300 flex-col justify-start items-start gap-6 p-8 border-t-2 ${
					user.themeColor ? "border-[#333]" : "border-gray-200"
				} w-full h-auto mt-auto`}
			>
				<div
					className={`flex flex-col justify-start items-start gap-2 ${user.themeColor ? "text-white" : "text-black"}`}
				>
					<h1 className="text-2xl font-semibold">Misc</h1>
					<div className="flex flex-col justify-start items-start gap-3">
						<div className="flex flex-col justify-start items-start">
							<button
								onClick={null}
								className={`cursor-not-allowed hover:opacity-80 ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}
								disabled
							>
								Tutorials
							</button>
							<button
								onClick={null}
								className={`cursor-not-allowed hover:opacity-80 ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}
								disabled
							>
								Settings
							</button>
						</div>
						<button onClick={handleSigningOut} className="base-btn">
							Logout
						</button>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start gap-0">
					<p className={`${user.themeColor ? "text-white" : "text-black"}`}>{user.username}</p>
					<p className={`text-sm ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}>{user.email}</p>
				</div>
			</div>
		</>
	);
};
