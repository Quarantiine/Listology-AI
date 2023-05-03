import React, { useContext, useEffect, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";
import Folders from "./Folders";
import TodolistSidebar from "./TodolistSidebar";
// import Filters from "./Filters";
// import Misc from "./Misc";

export default function Sidebar() {
	const { user } = useContext(UserCredentialCtx);
	const { closeSidebar, setCloseSidebar, openTodolistSidebar } = useContext(StateCtx);

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

	const handleCloseSidebar = () => {
		setCloseSidebar(!closeSidebar);
	};

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
					<Filters user={user} handleCloseSidebar={handleCloseSidebar} />
					<Folders />
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

const Filters = ({ handleCloseSidebar, user }) => {
	return (
		<>
			<div className={`p-7 w-full h-auto ${user.themeColor ? "text-white" : "text-black"}`}>
				<div className="flex justify-bewteen gap-4 items-center w-full">
					<h1 className="text-2xl font-semibold">Todo List Filters</h1>
					<button className="w-fit h-fit relative text-btn" onClick={handleCloseSidebar}>
						{!user.themeColor ? (
							<Image src={"/icons/menu-open.svg"} alt="completed icon" width={25} height={25} />
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 96 960 960" width="25" fill="white">
								<path d="M150 816q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 756h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 816H150Zm0-212q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 544h340q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T490 604H150Zm0-208q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 336h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 396H150Zm545 179 125 125q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L630 596q-9-9-9-21t9-21l146-146q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L695 575Z" />
							</svg>
						)}
					</button>
				</div>
				<button className="font-bold text-btn w-fit my-3">All</button>
				<div className="flex flex-col gap-1 justify-start items-start">
					<button className="flex justify-start items-center gap-1 text-btn w-fit">
						<Image
							className="w-auto h-[15px]"
							src={`${user.themeColor ? "/icons/completed-white.svg" : "/icons/completed-black.svg"}`}
							alt="completed icon"
							width={18}
							height={12}
						/>
						<p>Completed</p>
					</button>
					<button className="flex justify-start items-center gap-1 text-btn w-fit">
						<Image
							className="w-auto h-[14px]"
							src={`${user.themeColor ? "/icons/labels-white.svg" : "/icons/labels-black.svg"}`}
							alt="completed icon"
							width={17}
							height={17}
						/>
						<p>Labels</p>
					</button>
					<button className="flex justify-start items-center gap-1 text-btn w-fit">
						<Image
							className="w-auto h-[16px]"
							src={`${user.themeColor ? "/icons/active-white.svg" : "/icons/active-black.svg"}`}
							alt="completed icon"
							width={15}
							height={15}
						/>
						<p>Actives</p>
					</button>
					<button className="flex justify-start items-center gap-1 text-btn w-fit">
						{user.themeColor ? (
							<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 96 960 960" width="18" fill="white">
								<path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" />
							</svg>
						) : (
							<Image src={"/icons/unfavorite.svg"} alt="completed icon" width={18} height={18} />
						)}
						<p>Favorites</p>
					</button>
				</div>
			</div>
		</>
	);
};

const Misc = ({ user }) => {
	const { registration } = FirebaseApi();
	const { setOpenTodolistSidebar } = useContext(StateCtx);

	const handleSigningOut = (e) => {
		e.preventDefault();
		setOpenTodolistSidebar(false);
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
