import React, { useContext, useEffect, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import Image from "next/image";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import { createPortal } from "react-dom";
import TodolistSidebarModal from "./TodolistSidebarModal";

export default function TodolistSidebar() {
	const { folders } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const { openTodolistSidebar, setOpenTodolistSidebar } = useContext(StateCtx);
	const [openTodolistSidebarModal, setOpenTodolistSidebarModal] = useState(false);

	const handleTodolistSidebar = () => {
		setOpenTodolistSidebar(!openTodolistSidebar);
	};

	const handleCreateTodos = () => {
		setOpenTodolistSidebarModal(!openTodolistSidebarModal);
	};

	return (
		<>
			<div
				className={`todolist-sidebar z-40 transition-colors duration-300 shadow-[10px_0px_20px_0px_rgba(0,0,0,0.3)] ${
					user.themeColor ? "bg-[#222] text-white" : "bg-white text-black"
				} absolute top-0 left-0 sm:left-[280px] min-w-[280px] max-w-[280px] h-full flex flex-col justify-start items-start border-r-2 ${
					user.themeColor ? "border-[#333]" : "border-gray-200"
				} flex flex-col justify-start items-start p-7`}
			>
				<div className="flex justify-between items-center gap-2 w-full">
					<h1 className="text-2xl font-semibold">Todo Lists</h1>
					<div className="flex justify-center items-center gap-2">
						<button className="w-fit h-fit relative text-btn" onClick={handleTodolistSidebar}>
							{!user.themeColor ? (
								<Image src={"/icons/menu-open.svg"} alt="completed icon" width={25} height={25} />
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 96 960 960" width="25" fill="white">
									<path d="M150 816q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 756h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 816H150Zm0-212q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 544h340q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T490 604H150Zm0-208q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 336h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 396H150Zm545 179 125 125q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L630 596q-9-9-9-21t9-21l146-146q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L695 575Z" />
								</svg>
							)}
						</button>
						<button onClick={handleCreateTodos} className="flex justify-center items-center relative">
							<Image
								className="w-auto h-[20px]"
								src={user.themeColor ? "/icons/plus-white.svg" : "/icons/plus-black.svg"}
								alt=""
								width={20}
								height={20}
							/>
						</button>
					</div>
				</div>
				{/* <div className="flex justify-start items-start gap-2">
					{folders.allTodoFolders?.map((todoFolder) => {
						return (
							<React.Fragment key={todoFolder.id}>
								<h1>{todoFolder.folderTitle}</h1>
							</React.Fragment>
						);
					})}
				</div> */}
				{openTodolistSidebarModal &&
					createPortal(
						<TodolistSidebarModal setOpenTodolistSidebarModal={setOpenTodolistSidebarModal} />,
						document.body
					)}
			</div>
		</>
	);
}
