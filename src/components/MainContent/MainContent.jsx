import React, { useContext, useEffect, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import TodolistPlaceholder from "./TodolistPlaceholder";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import FolderModal from "../Sidebar/FolderModal";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import TodolistMainContent from "./TodolistMainContent";

export default function MainContent() {
	const { user } = useContext(UserCredentialCtx);
	const { auth, todolistFolders } = FirebaseApi();
	const { openFolderModal, setOpenFolderModal, clickedTodoFolder } = useContext(StateCtx);

	useEffect(() => {
		const closeFolderModal = (e) => {
			if (!e.target.closest(".folder-modal")) {
				setOpenFolderModal(false);
			}
		};

		document.addEventListener("mousedown", closeFolderModal);
		return () => document.removeEventListener("mousedown", closeFolderModal);
	}, [setOpenFolderModal]);

	const handleFolderCreation = () => {
		setOpenFolderModal(!openFolderModal);
	};

	return (
		<>
			<div className={`w-full h-full ${user.themeColor ? "text-white" : "text-black"}`}>
				<div className="main-content-overflow w-full h-full flex flex-col overflow-y-scroll justify-start items-center overflow-x-hidden">
					<Banner />
					<div className="flex flex-col justify-start items-center w-full p-10 gap-10">
						<>
							{todolistFolders.allTodoFolders
								?.map((todolistFolder) => todolistFolder.userID === auth.currentUser.uid)
								?.includes(true) && todolistFolders.allTodoFolders.length > 0 ? (
								<>
									{clickedTodoFolder ? (
										todolistFolders.allTodoFolders
											?.filter(
												(value) =>
													clickedTodoFolder && value.id === clickedTodoFolder && value.userID === auth.currentUser.uid
											)
											?.map((todolistFolder) => {
												return (
													<TodolistMainContent
														key={todolistFolder.id}
														todolistFolders={todolistFolders}
														user={user}
														todolistFolder={todolistFolder}
													/>
												);
											})
									) : (
										<>
											<div className="w-full flex flex-col justify-start items-start gap-5">
												<h1 className={`text-xl ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}>
													Click a Todo Folder
												</h1>
												<TodolistPlaceholder />
											</div>
										</>
									)}
								</>
							) : (
								<div className="w-[90%] h-full relative flex flex-col gap-10 justify-center items-center">
									<div className="flex flex-col lg:flex-row justify-around w-full h-auto items-center lg:items-center gap-12 lg:gap-10">
										<div className="flex flex-col justify-center lg:justify-start items-center lg:items-start gap-2 text-center lg:text-start">
											<h1 className="text-2xl font-semibold">Need a Short Tutorial?</h1>
											<p className="">This will expedite your productivity significantly</p>
											<button onClick={null} className="base-btn">
												Start Tutorial
											</button>
										</div>
										<div className="flex flex-col justify-center lg:justify-start items-center lg:items-start gap-2 text-center lg:text-start">
											<h1 className="text-2xl font-semibold">Create a Folder!</h1>
											<p className="">Ensure that the chosen appellation is to your liking.</p>
											<button onClick={handleFolderCreation} className="base-btn">
												Create Folder
											</button>
										</div>
									</div>
									<TodolistPlaceholder />
								</div>
							)}
						</>
					</div>
				</div>
				{openFolderModal && createPortal(<FolderModal handleFolderCreation={handleFolderCreation} />, document.body)}
			</div>
		</>
	);
}
