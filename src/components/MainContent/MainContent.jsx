import React, { useContext, useEffect, useRef, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import TodolistPlaceholder from "./TodolistPlaceholder";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import FolderModal from "../Sidebar/FolderModal";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import TodolistMainContent from "./TodolistMainContent";

export default function MainContent() {
	const { setClickedTodoFolder, searchQueryRef } = useContext(StateCtx);
	const { user } = useContext(UserCredentialCtx);
	const { auth, todolistFolders } = FirebaseApi();
	const { openFolderModal, setOpenFolderModal, clickedTodoFolder } =
		useContext(StateCtx);
	const [searchQuery, setSearchQuery] = useState("");

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

	const handleTodoFolderClick = (id) => {
		setClickedTodoFolder(id);
		setSearchQuery("");
	};

	return (
		<>
			<div
				className={`w-full h-full ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<div className="main-content-overflow w-full h-full flex flex-col overflow-y-scroll justify-start items-center overflow-x-hidden mr-auto">
					<Banner />
					<div className="flex flex-col justify-start items-center w-full p-10 gap-10">
						<>
							{todolistFolders.allTodoFolders
								?.map(
									(todolistFolder) =>
										todolistFolder.userID === auth.currentUser.uid
								)
								?.includes(true) &&
							todolistFolders.allTodoFolders.length > 0 ? (
								<>
									{clickedTodoFolder ? (
										todolistFolders.allTodoFolders
											?.filter(
												(value) =>
													clickedTodoFolder &&
													value.id === clickedTodoFolder &&
													value.userID === auth.currentUser.uid
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
												<h1
													className={`text-xl ${
														user.themeColor ? "text-[#555]" : "text-gray-400"
													}`}
												>
													Click a Todo Folder
												</h1>

												<div className="flex justify-start items-center gap-3 w-full relative">
													<>
														{user.themeColor ? (
															<svg
																className="w-auto min-h-[18px] max-h-[18px] absolute top-1/2 -translate-y-1/2 left-3"
																width="20"
																height="20"
																viewBox="0 0 27 27"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"
																	fill="white"
																/>
															</svg>
														) : (
															<svg
																className="w-auto min-h-[18px] max-h-[18px] absolute top-1/2 -translate-y-1/2 left-3"
																width="20"
																height="20"
																viewBox="0 0 27 27"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"
																	fill="black"
																/>
															</svg>
														)}
													</>

													<input
														className={`pl-10 pr-2 py-1 rounded-md outline-none w-full ${
															user.themeColor
																? "bg-[#333] text-white"
																: "bg-[#eee] text-black"
														}`}
														type="search"
														name="search"
														placeholder="Search by todo folders, main folder titles"
														ref={searchQueryRef}
														onChange={(e) => setSearchQuery(e.target.value)}
														value={searchQuery}
													/>
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full justify-start items-center gap-5 flex-wrap">
													{todolistFolders.allTodoFolders
														.filter(
															(value) => value.userID === auth.currentUser.uid
														)
														.map((todoFolder) => {
															if (
																todoFolder.folderTitle
																	.normalize("NFD")
																	.replace(/\p{Diacritic}/gu, "")
																	.toLowerCase()
																	.includes(searchQuery.toLowerCase()) ||
																todoFolder.folderName
																	.normalize("NFD")
																	.replace(/\p{Diacritic}/gu, "")
																	.toLowerCase()
																	.includes(searchQuery.toLowerCase())
															) {
																return (
																	<TodoFoldersDashboard
																		key={todoFolder.id}
																		todoFolder={todoFolder}
																		user={user}
																		handleTodoFolderClick={
																			handleTodoFolderClick
																		}
																		auth={auth}
																	/>
																);
															}
														})}
												</div>

												{/* <TodolistPlaceholder /> */}
											</div>
										</>
									)}
								</>
							) : (
								<>
									{/* <div className="w-[90%] h-full relative flex flex-col gap-10 justify-center items-center">
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
									</div> */}

									<div className="w-[90%] h-full relative flex flex-col gap-10 justify-start items-start">
										<div className="flex flex-col lg:flex-row justify-around w-full h-auto items-center lg:items-center gap-12 lg:gap-10">
											<div className="flex flex-col justify-center items-center gap-2 text-center">
												<h1 className="text-2xl font-semibold">
													Create a Folder!
												</h1>
												<p className="">
													Ensure that the chosen appellation is to your liking.
												</p>
												<button
													onClick={handleFolderCreation}
													className="base-btn"
												>
													Create Folder
												</button>
											</div>
										</div>
										<TodolistPlaceholder />
									</div>
								</>
							)}
						</>
					</div>
				</div>
				{openFolderModal &&
					createPortal(
						<FolderModal handleFolderCreation={handleFolderCreation} />,
						document.body
					)}
			</div>
		</>
	);
}

const TodoFoldersDashboard = ({
	todoFolder,
	user,
	handleTodoFolderClick,
	auth,
}) => {
	const { todoLists } = FirebaseApi();

	return (
		<>
			<button
				onClick={() => handleTodoFolderClick(todoFolder.id)}
				className={`border text-btn w-full min-h-[170px] py-3 px-4 rounded-md flex flex-col justify-start items-start text-start gap-2 ${
					user.themeColor
						? "bg-[#333] border-[#555]"
						: "bg-[#eee] border-[#ccc]"
				}`}
			>
				<div className="w-full flex flex-col justify-center items-between">
					<h1
						className={`text-sm ${
							user.themeColor ? "text-[#666]" : "text-[#aaa]"
						}`}
					>
						Main Folder:{" "}
						<span className="font-bold underline">{todoFolder.folderName}</span>
					</h1>
					<div className="flex justify-between items-center w-full">
						<h2 className="text-2xl font-semibold line-clamp-1">
							{todoFolder.folderTitle}
						</h2>
						{todoFolder.folderEmoji ? (
							<p className="text-3xl">{todoFolder.folderEmoji}</p>
						) : (
							<div
								className={`${
									user.themeColor ? "bg-[#555]" : "bg-[#999]"
								} w-7 h-7 rounded-full`}
							/>
						)}
					</div>
				</div>
				<p className="line-clamp-2">{todoFolder.folderDescription}</p>
				<p
					className={`text-sm mt-auto flex justify-center items-center gap-1 ${
						user.themeColor ? "text-[#666]" : "text-[#aaa]"
					}`}
				>
					{todoLists.allTodoLists
						?.filter(
							(value) =>
								value.folderID === todoFolder.id &&
								value.userID === auth.currentUser.uid &&
								value.completed === true
						)
						?.map((todo) => todo).length !== 0 && (
						<>
							<span>
								{
									todoLists.allTodoLists
										?.filter(
											(value) =>
												value.folderID === todoFolder.id &&
												value.userID === auth.currentUser.uid &&
												value.completed === true
										)
										?.map((todo) => todo).length
								}
							</span>
							<span>/</span>
						</>
					)}
					<span>
						{todoLists.allTodoLists
							?.filter(
								(value) =>
									value.folderID === todoFolder.id &&
									value.userID === auth.currentUser.uid
							)
							?.map((todo) => todo).length === 0
							? "No Todos"
							: todoLists.allTodoLists
									?.filter(
										(value) =>
											value.folderID === todoFolder.id &&
											value.userID === auth.currentUser.uid
									)
									?.map((todo) => todo).length}
					</span>
					{todoLists.allTodoLists
						?.filter(
							(value) =>
								value.folderID === todoFolder.id &&
								value.userID === auth.currentUser.uid &&
								value.completed === true
						)
						?.map((todo) => todo).length !== 0 ? (
						<span>Todos Completed</span>
					) : todoLists.allTodoLists
							?.filter(
								(value) =>
									value.folderID === todoFolder.id &&
									value.userID === auth.currentUser.uid
							)
							?.map((todo) => todo).length === 0 ? (
						""
					) : todoLists.allTodoLists
							?.filter(
								(value) =>
									value.folderID === todoFolder.id &&
									value.userID === auth.currentUser.uid
							)
							?.map((todo) => todo).length === 1 ? (
						<span>Todo Not Completed</span>
					) : (
						<span>Todos Not Completed</span>
					)}
				</p>
			</button>
		</>
	);
};
