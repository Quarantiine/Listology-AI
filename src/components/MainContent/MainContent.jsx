import React, { useContext, useEffect, useRef, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import TodolistPlaceholder from "./TodolistPlaceholder";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import FolderModal from "../Sidebar/FolderModal";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import TodolistMainContent from "./TodolistMainContent";
import TodoFoldersDashboard from "./TodoFoldersDashboard";
import Image from "next/image";

// TODO: Create a shortcut to search for todo folders

export default function MainContent() {
	const {
		setClickedTodoFolder,
		searchQueryRef,
		openFolderModal,
		setOpenFolderModal,
		clickedTodoFolder,
		setClickedFolder,
		clickedFolder,
	} = useContext(StateCtx);
	const { user } = useContext(UserCredentialCtx);
	const { auth, todolistFolders, folders } = FirebaseApi();
	const [searchQuery, setSearchQuery] = useState("");
	const [openHiddenFoldersDropdown, setOpenHiddenFoldersDropdown] =
		useState(false);

	useEffect(() => {
		const closeFolderModal = (e) => {
			if (!e.target.closest(".folder-modal")) {
				setOpenFolderModal(false);
			}
		};

		document.addEventListener("mousedown", closeFolderModal);
		return () => document.removeEventListener("mousedown", closeFolderModal);
	}, [setOpenFolderModal]);

	useEffect(() => {
		const closeHiddenFolderDropdown = (e) => {
			if (!e.target.closest(".hidden-folder-container")) {
				setOpenHiddenFoldersDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeHiddenFolderDropdown);
		return () =>
			document.removeEventListener("mousedown", closeHiddenFolderDropdown);
	}, [setOpenHiddenFoldersDropdown]);

	const handleFolderCreation = () => {
		setOpenFolderModal(!openFolderModal);
	};

	const handleHiddenFoldersDropdown = () => {
		setOpenHiddenFoldersDropdown(!openHiddenFoldersDropdown);
	};

	const handleHideTodoFolder = (todoFolder) => {
		todolistFolders.hideFolder(todoFolder.id, false);
	};

	const handleClickHiddenFolder = (todoFolder) => {
		setClickedFolder(todoFolder.folderName);
		setClickedTodoFolder(todoFolder.id);
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
					<div
						className={`flex flex-col justify-start items-center w-full ${
							todolistFolders.allTodoFolders
								?.map(
									(todolistFolder) =>
										todolistFolder.userID === auth.currentUser?.uid
								)
								?.includes(true) && todolistFolders.allTodoFolders.length > 0
								? "h-auto"
								: "h-full"
						} p-12 gap-10`}
					>
						<>
							{todolistFolders.allTodoFolders
								?.map(
									(todolistFolder) =>
										todolistFolder.userID === auth.currentUser?.uid
								)
								?.includes(true) &&
							todolistFolders.allTodoFolders.length > 0 ? (
								<>
									{clickedTodoFolder ? (
										todolistFolders.allTodoFolders
											?.filter(
												(value) =>
													clickedTodoFolder &&
													value.userID === auth.currentUser?.uid &&
													value.id === clickedTodoFolder
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
														placeholder="Search by todo and main folders"
														ref={searchQueryRef}
														onChange={(e) => setSearchQuery(e.target.value)}
														value={searchQuery}
													/>
												</div>

												{/* Recent Section */}
												{null && (
													<div className="">
														<h1 className="text-2xl font-semibold">Recent</h1>
													</div>
												)}

												<div className="flex flex-col justify-start items-start w-full gap-4">
													<div className="flex justify-between items-center gap-2 w-full">
														<h1 className="text-2xl font-semibold">
															Todo Folders
														</h1>

														<div className="relative hidden-folder-container">
															<div
																onClick={handleHiddenFoldersDropdown}
																className="flex justify-center items-center gap-2 text-btn select-none"
															>
																<p
																	className={`text-sm ${
																		user.themeColor
																			? "text-[#555]"
																			: "text-[#999]"
																	}`}
																>
																	Hidden Folders
																</p>

																<Image
																	className={`min-h-[13px] max-h-[13px] w-auto cursor-default md:cursor-pointer ${
																		null ? "rotate-180" : "rotate-0"
																	}`}
																	src={
																		user.themeColor
																			? "/icons/arrow-white.svg"
																			: "/icons/arrow-black.svg"
																	}
																	alt="search"
																	width={20}
																	height={20}
																/>
															</div>

															{openHiddenFoldersDropdown && (
																<div
																	className={`w-[200px] h-fit p-3 rounded-md absolute top-7 right-0 z-40 flex justify-start items-center bg-white text-black border shadow-md`}
																>
																	{!todolistFolders.allTodoFolders
																		?.filter(
																			(value) =>
																				value.userID === auth.currentUser.uid
																		)
																		?.map(
																			(todoFolder) => todoFolder.folderHidden
																		)
																		.includes(true) && (
																		<p className={`text-sm text-[#aaa] w-full`}>
																			No Hidden Folders
																		</p>
																	)}

																	<div
																		className={`flex flex-col gap-3 justify-start items-center ${
																			todolistFolders.allTodoFolders
																				?.filter(
																					(value) =>
																						value.userID ===
																						auth.currentUser.uid
																				)
																				?.map(
																					(todoFolder) =>
																						todoFolder.folderHidden
																				)
																				.includes(true) && "w-full"
																		}`}
																	>
																		{todolistFolders.allTodoFolders
																			.filter(
																				(value) =>
																					value.userID === auth.currentUser.uid
																			)
																			.map((todoFolder) => {
																				if (todoFolder.folderHidden === true) {
																					return (
																						<React.Fragment key={todoFolder.id}>
																							<div className="flex justify-between items-center gap-2 w-full">
																								<div
																									className={`flex justify-center items-center gap-1`}
																								>
																									<button
																										onClick={() =>
																											!todoFolder.pin &&
																											handleClickHiddenFolder(
																												todoFolder
																											)
																										}
																										className={`text-sm text-start line-clamp-2 ${
																											todoFolder.pin
																												? "cursor-not-allowed"
																												: "hover:text-[#0E51FF]"
																										}`}
																									>
																										{todoFolder.folderTitle}
																									</button>

																									{todoFolder.pin && (
																										<Image
																											className="w-auto min-h-[15px] max-h-[15px]"
																											src={
																												"/icons/lock-black.svg"
																											}
																											alt="trash"
																											width={25}
																											height={25}
																										/>
																									)}
																								</div>

																								<button
																									onClick={() =>
																										handleHideTodoFolder(
																											todoFolder
																										)
																									}
																									className="rotate-45"
																								>
																									<Image
																										className="min-w-[15px] max-w-[15px] min-h-[15px] max-h-[15px]"
																										src={
																											"/icons/plus-black.svg"
																										}
																										alt="add"
																										width={30}
																										height={30}
																									/>
																								</button>
																							</div>
																						</React.Fragment>
																					);
																				}
																			})}
																	</div>
																</div>
															)}
														</div>
													</div>

													{todolistFolders.allTodoFolders
														?.filter(
															(value) => value.userID === auth.currentUser.uid
														)
														?.map((todoFolder) => !todoFolder.folderHidden)
														.includes(true) ? null : (
														<p
															className={`mr-auto ${
																user.themeColor ? "text-[#555]" : "text-[#ccc]"
															}`}
														>
															You have hidden Todo Folders
														</p>
													)}

													<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full justify-start items-center gap-5 flex-wrap">
														{todolistFolders.allTodoFolders
															?.filter(
																(value) =>
																	value.userID === auth.currentUser?.uid &&
																	!value.folderHidden
															)
															?.map((todoFolder) => {
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
																		<React.Fragment key={todoFolder.id}>
																			<TodoFoldersDashboard
																				todoFolder={todoFolder}
																				user={user}
																				setClickedTodoFolder={
																					setClickedTodoFolder
																				}
																				setClickedFolder={setClickedFolder}
																				auth={auth}
																			/>
																		</React.Fragment>
																	);
																}
															})}
													</div>
												</div>
											</div>
										</>
									)}
								</>
							) : (
								<>
									<div className="w-[90%] h-full relative flex flex-col gap-10 justify-start items-start text-center">
										<div className="flex flex-col justify-center w-full h-full items-center gap-12 lg:gap-10 relative">
											<div className="flex flex-col justify-center items-center gap-3 w-full h-auto">
												<svg
													width="50"
													height="50"
													viewBox="0 0 30 30"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M0 29.0769H6.11918L24.1667 10.9815L18.0475 4.84613L0 22.9415V29.0769ZM3.26356 24.2994L18.0475 9.47631L19.5487 10.9815L4.7648 25.8047H3.26356V24.2994Z"
														fill={user.themeColor ? "#555" : "#aaa"}
													/>
													<path
														d="M24.6667 0.482758C24.0247 -0.160919 22.9877 -0.160919 22.3457 0.482758L19.3334 3.50309L25.5062 9.6923L28.5186 6.67197C29.1605 6.02829 29.1605 4.9885 28.5186 4.34482L24.6667 0.482758Z"
														fill={user.themeColor ? "#555" : "#aaa"}
													/>
												</svg>

												<div
													className={`flex flex-col justify-center items-center gap-5 ${
														user.themeColor ? "text-[#555]" : "text-[#aaa]"
													}`}
												>
													<p>You Have no Todo Folders</p>
													<button
														onClick={handleFolderCreation}
														className="base-btn"
													>
														Create Main Folder
													</button>
												</div>
											</div>
										</div>
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
