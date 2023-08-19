import React, { useContext, useEffect } from "react";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";
import Folders from "./Folders";
import TodolistSidebar from "./TodolistSidebar";
import Misc from "./Misc";
import Image from "next/image";

export default function Sidebar({ navState, navDispatch }) {
	const { user } = useContext(UserCredentialCtx);
	const {
		closeSidebar,
		setCloseSidebar,
		openTodolistSidebar,
		handleCloseSidebar,
		setOpenTodolistSidebar,
	} = useContext(StateCtx);

	useEffect(() => {
		const handleCloseSidebar = (e) => {
			if (!e.target.closest(".sidebar")) {
				if (window.innerWidth < 1024) {
					setCloseSidebar(true);
				}
			}
		};

		document.addEventListener("mousedown", handleCloseSidebar);
		return () => document.removeEventListener("mousedown", handleCloseSidebar);
	}, [setCloseSidebar]);

	const handleNavigator = (key, value) => {
		setOpenTodolistSidebar(false);

		navDispatch({
			type: "sidebar-navigation-link",
			payload: {
				key: key,
				value: value,
			},
		});
	};

	return (
		<>
			{!closeSidebar ? (
				<div
					className={`sidebar todolist-sidebar z-50 transition-colors duration-300 fixed md:sticky top-0 left-0 min-w-[280px] max-w-[280px] h-full flex flex-col justify-start items-start border-r-2 ${
						user.themeColor ? "bg-[#222]" : "bg-white"
					} ${user.themeColor ? "border-[#333]" : "border-gray-200"}`}
				>
					{openTodolistSidebar && <TodolistSidebar />}

					<Folders
						handleCloseSidebar={handleCloseSidebar}
						navState={navState}
					/>

					{navState.navigatorLink === "Settings" && (
						<div className="flex justify-end items-center gap-2 absolute top-8 right-5">
							<button
								className="w-fit h-fit relative text-btn"
								onClick={handleCloseSidebar}
							>
								{!user.themeColor ? (
									<Image
										src={"/icons/menu-open.svg"}
										alt="menu"
										width={25}
										height={25}
									/>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="25"
										viewBox="0 96 960 960"
										width="25"
										fill="white"
									>
										<path d="M150 816q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 756h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 816H150Zm0-212q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 544h340q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T490 604H150Zm0-208q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 336h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 396H150Zm545 179 125 125q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L630 596q-9-9-9-21t9-21l146-146q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L695 575Z" />
									</svg>
								)}
							</button>
						</div>
					)}

					<Misc user={user} handleNavigator={handleNavigator} />
				</div>
			) : (
				<>
					<div
						className={`relative top-0 left-0 text-btn min-w-[20px] h-full mr-auto ${
							user.themeColor ? "bg-[#333]" : "bg-gray-200"
						}`}
						onClick={handleCloseSidebar}
					></div>
				</>
			)}
		</>
	);
}
