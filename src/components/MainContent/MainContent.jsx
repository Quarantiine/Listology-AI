import React, { useContext, useEffect, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import Banner from "./Banner";
import { createPortal } from "react-dom";
import FolderModal from "../Sidebar/FolderModal";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import TodolistMainContent from "./TodolistMainContent";
import TodoFoldersDashboard from "./TodoFoldersDashboard";
import Image from "next/image";
import ImportantTodos from "./ImportantTodos";
import TimelineTodos from "./TimelineTodos";

export default function MainContent() {
	const {
		setClickedTodoFolder,
		searchQueryRef,
		openFolderModal,
		setOpenFolderModal,
		clickedTodoFolder,
		setClickedFolder,
		setOpenTodolistSidebar,
		handleCloseSidebar,
	} = useContext(StateCtx);
	const { user } = useContext(UserCredentialCtx);
	const { auth, todolistFolders, todoLists, folders } = FirebaseApi();

	const [searchQuery, setSearchQuery] = useState("");
	const [openHiddenFoldersDropdown, setOpenHiddenFoldersDropdown] =
		useState(false);
	const [importantTodosDropdown, setImportantTodosDropdown] = useState(true);
	const [todoTimelineDropdown, setTodoTimelineDropdown] = useState(true);
	const [inputTxt, setInputTxt] = useState("");
	const [showMoreDates, setShowMoreDates] = useState(6);
	const [showMoreDateBtn, setShowMoreDateBtn] = useState(false);

	const lengthOfSearchedFolders = todolistFolders.allTodoFolders
		?.filter(
			(value) =>
				(value.userID === auth.currentUser?.uid &&
					!value.folderHidden &&
					value.folderTitle
						.normalize("NFD")
						.replace(/\p{Diacritic}/gu, "")
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) ||
				(value.userID === auth.currentUser?.uid &&
					!value.folderHidden &&
					value.folderName
						.normalize("NFD")
						.replace(/\p{Diacritic}/gu, "")
						.toLowerCase()
						.includes(searchQuery.toLowerCase())),
		)
		?.map((t) => t).length;

	const timeMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

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
				setInputTxt("");
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
		const date = new Date();
		setClickedFolder(todoFolder.folderName);
		setClickedTodoFolder(todoFolder.id);
		todolistFolders.updatingClickTimeStamp(todoFolder.id, date);
	};

	const handleImportantTodoDropDown = () => {
		setImportantTodosDropdown(!importantTodosDropdown);
	};

	const handleCreateTodoFolder = () => {
		setOpenTodolistSidebar(true);
		handleCloseSidebar();

		setClickedFolder(
			folders.allFolders
				?.filter((value) => value.userID === auth.currentUser.uid)
				.slice(0, 1)
				.map((folder) => folder.folderName)[0],
		);
	};

	const handleShowMoreDates = () => {
		if (
			todoLists.allTodoLists
				?.filter(
					(todolist) =>
						todolist.userID === auth.currentUser.uid &&
						todolist.startDate &&
						todolist.endDate &&
						!todolist.completed,
				)
				.map((todolist) => todolist).length !== showMoreDates
		) {
			setShowMoreDates((prevState) => prevState + 1);
		}
	};

	const handleShowLessDates = () => {
		setShowMoreDates(6);
	};

	useEffect(() => {
		if (
			todoLists.allTodoLists
				?.filter(
					(todolist) =>
						todolist.userID === auth.currentUser.uid &&
						todolist.startDate &&
						todolist.endDate &&
						!todolist.completed,
				)
				.map((todolist) => todolist).length !== showMoreDates
		) {
			setShowMoreDateBtn(true);
		} else {
			setShowMoreDates(
				todoLists.allTodoLists
					?.filter(
						(todolist) =>
							todolist.userID === auth.currentUser.uid &&
							todolist.startDate &&
							todolist.endDate &&
							!todolist.completed,
					)
					.map((todolist) => todolist).length,
			);
			setShowMoreDateBtn(false);
		}
	}, [showMoreDates]);

	useEffect(() => {
		const completionPercentage =
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === clickedTodoFolder &&
						value.userID === auth.currentUser?.uid &&
						value.completed === true &&
						!value.ignoreTodo,
				)
				?.map((todo) => todo).length /
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === clickedTodoFolder &&
						value.userID === auth.currentUser?.uid &&
						!value.ignoreTodo,
				)
				?.map((todo) => todo).length;

		if (completionPercentage >= 1) {
			todolistFolders.updatingCompletion(clickedTodoFolder, true);
			todolistFolders.allTodoFolders
				.filter(
					(value) =>
						value.userID === auth.currentUser.uid &&
						value.id === clickedTodoFolder,
				)
				.map((todoFolder) => todoFolder.pinned)
				.includes(true) &&
				todolistFolders.updatingPinnedIndicator(clickedTodoFolder, false);
		}

		if (completionPercentage < 1) {
			todolistFolders.updatingCompletion(clickedTodoFolder, false);
		}
	}, [todolistFolders, clickedTodoFolder]);

	return (
		<>
			<div
				className={`w-full h-full ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<div className="main-content-overflow w-full h-full flex flex-col overflow-y-scroll justify-start items-center overflow-x-hidden mr-auto">
					{!clickedTodoFolder && <Banner />}
					<div
						className={`flex flex-col justify-start items-center w-full ${
							todolistFolders.allTodoFolders
								?.map(
									(todolistFolder) =>
										todolistFolder.userID === auth.currentUser?.uid,
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
										todolistFolder.userID === auth.currentUser?.uid,
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
													value.id === clickedTodoFolder,
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
											<div
												className={`flex flex-col justify-start items-start w-full transition-all gap-5`}
											>
												<div className="flex flex-col justify-between items-start gap-10 w-full">
													{todoLists.allTodoLists
														?.filter(
															(todolist) =>
																todolist.userID === auth.currentUser.uid &&
																todolist.startDate &&
																todolist.endDate &&
																!todolist.completed,
														)
														.map((todolist) => todolist).length > 0 && (
														<div className="flex flex-col justify-center items-start gap-4 w-full">
															<button
																onClick={() =>
																	setTodoTimelineDropdown(!todoTimelineDropdown)
																}
																className={`w-full flex justify-between items-center gap-3 py-1 px-3 rounded-md ${
																	user.themeColor ? "bg-[#333]" : "bg-gray-100"
																}`}
															>
																<h1 className="text-2xl font-semibold">
																	To-do Timeline:{" "}
																	{
																		todoLists.allTodoLists
																			?.filter(
																				(todolist) =>
																					todolist.userID ===
																						auth.currentUser.uid &&
																					todolist.startDate &&
																					todolist.endDate &&
																					!todolist.completed,
																			)
																			.map((todolist) => todolist).length
																	}
																</h1>

																<Image
																	className={`min-w-[20px] min-h-[20px] h-auto w-[20px] transition-all ${
																		todoTimelineDropdown && "rotate-180"
																	}`}
																	src={
																		user.themeColor
																			? "/icons/arrow-white.svg"
																			: "/icons/arrow-black.svg"
																	}
																	alt="undo"
																	width={30}
																	height={30}
																/>
															</button>

															{todoTimelineDropdown && (
																<div
																	className={`grid w-full h-auto gap-x-5 gap-y-3 ${
																		todoLists.allTodoLists
																			?.filter(
																				(todolist) =>
																					todolist.userID ===
																						auth.currentUser.uid &&
																					todolist.startDate &&
																					todolist.endDate &&
																					!todolist.completed,
																			)
																			.map((todolist) => todolist).length > 1
																			? "grid-cols-1 md:grid-cols-2"
																			: "grid-cols-1"
																	}`}
																>
																	{todoLists.allTodoLists
																		?.filter(
																			(todolist) =>
																				todolist.userID ===
																					auth.currentUser.uid &&
																				todolist.startDate &&
																				todolist.endDate &&
																				!todolist.completed,
																		)
																		.sort((a, b) => a.startDate - b.startDate)
																		.sort((a, b) => a.endDate - b.endDate)
																		.slice(0, showMoreDates)
																		.map((todolist) => {
																			const currentDate = new Date();
																			const startDate = new Date(
																				todolist.startDate.seconds * 1000,
																			);
																			const endDate = new Date(
																				todolist.endDate.seconds * 1000,
																			);

																			const modifiedEndDate = `${
																				timeMonths[endDate.getMonth()]
																			} ${endDate.getDate()}, ${endDate.getFullYear()}`;

																			const modifiedStartDate = `${
																				timeMonths[startDate.getMonth()]
																			} ${startDate.getDate()}, ${startDate.getFullYear()}`;

																			return (
																				<TimelineTodos
																					key={todolist.id}
																					todolist={todolist}
																					modifiedEndDate={modifiedEndDate}
																					modifiedStartDate={modifiedStartDate}
																					endDate={endDate}
																					currentDate={currentDate}
																				/>
																			);
																		})}
																</div>
															)}

															{todoTimelineDropdown && (
																<>
																	{todoLists.allTodoLists
																		?.filter(
																			(todolist) =>
																				todolist.userID ===
																					auth.currentUser.uid &&
																				todolist.startDate &&
																				todolist.endDate &&
																				!todolist.completed,
																		)
																		.map((todolist) => todolist).length > 6 &&
																		showMoreDateBtn && (
																			<div className="flex justify-center items-center w-full">
																				<button
																					onClick={handleShowMoreDates}
																					className="base-btn w-full sm:!w-[50%] md:!w-[30%]"
																				>
																					Show More
																				</button>
																			</div>
																		)}

																	{todoLists.allTodoLists
																		?.filter(
																			(todolist) =>
																				todolist.userID ===
																					auth.currentUser.uid &&
																				todolist.startDate &&
																				todolist.endDate &&
																				!todolist.completed,
																		)
																		.map((todolist) => todolist).length ===
																		showMoreDates &&
																		todoLists.allTodoLists
																			?.filter(
																				(todolist) =>
																					todolist.userID ===
																						auth.currentUser.uid &&
																					todolist.startDate &&
																					todolist.endDate &&
																					!todolist.completed,
																			)
																			.map((todolist) => todolist).length >
																			6 && (
																			<div className="flex justify-center items-center w-full">
																				<button
																					onClick={handleShowLessDates}
																					className="base-btn w-full sm:!w-[50%] md:!w-[30%]"
																				>
																					Show Less
																				</button>
																			</div>
																		)}
																</>
															)}
														</div>
													)}
												</div>

												<div className="flex flex-col justify-center items-start gap-4 w-full">
													<button
														onClick={handleImportantTodoDropDown}
														className={`flex justify-between items-center gap-3 btn w-full py-1 px-3 rounded-md ${
															user.themeColor ? "bg-[#333]" : "bg-gray-100"
														}`}
													>
														<div>
															<h1 className="text-2xl font-semibold">
																Important Todos:{" "}
																<span>
																	{
																		todoLists.allTodoLists
																			.filter(
																				(value) =>
																					value.userID ===
																						auth.currentUser.uid &&
																					value.markImportant &&
																					!value.completed,
																			)
																			.map((t) => t).length
																	}
																</span>
															</h1>
														</div>

														<Image
															className={`min-w-[20px] min-h-[20px] h-auto w-[20px] transition-all ${
																importantTodosDropdown && "rotate-180"
															}`}
															src={
																user.themeColor
																	? "/icons/arrow-white.svg"
																	: "/icons/arrow-black.svg"
															}
															alt="undo"
															width={30}
															height={30}
														/>
													</button>

													{importantTodosDropdown && (
														<div
															className={`grid justify-start items-center gap-3 w-full ${
																todoLists.allTodoLists
																	?.filter(
																		(value) =>
																			value.userID === auth.currentUser.uid &&
																			value.markImportant &&
																			!value.completed,
																	)
																	.map((todolist) => todolist).length > 1
																	? "grid-cols-1 md:grid-cols-2"
																	: "grid-cols-1"
															}`}
														>
															{todoLists.allTodoLists
																.filter(
																	(value) =>
																		value.userID === auth.currentUser.uid &&
																		!value.ignoreTodo &&
																		!value.completed,
																)
																.map((todolist) => {
																	if (todolist.markImportant) {
																		return (
																			<ImportantTodos
																				key={todolist.id}
																				todolist={todolist}
																			/>
																		);
																	}
																})}

															{todoLists.allTodoLists
																.filter(
																	(value) =>
																		value.userID === auth.currentUser.uid &&
																		value.ignoreTodo &&
																		!value.completed,
																)
																.map((todolist) => {
																	if (todolist.markImportant) {
																		return (
																			<ImportantTodos
																				key={todolist.id}
																				todolist={todolist}
																			/>
																		);
																	}
																})}

															{!todoLists.allTodoLists
																.filter(
																	(value) =>
																		value.userID === auth.currentUser.uid &&
																		!value.completed,
																)
																.map((todolist) =>
																	todolist.markImportant ? true : false,
																)
																.includes(true) && (
																<p
																	className={`${
																		user.themeColor
																			? "text-[#555]"
																			: "text-gray-400"
																	}`}
																>
																	No Important Todos to Complete
																</p>
															)}
														</div>
													)}
												</div>

												<div className="flex flex-col justify-start items-start gap-4 w-full">
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
															autoComplete="off"
															placeholder="Search by to-do and main folders"
															ref={searchQueryRef}
															onChange={(e) => setSearchQuery(e.target.value)}
															value={searchQuery}
														/>
													</div>

													<div className="flex justify-between items-center gap-2 w-full">
														<div className="flex justify-center items-center gap-1">
															<h1 className="text-2xl font-semibold">
																To-do Folders:
															</h1>
															<h1 className="text-2xl font-semibold">
																{lengthOfSearchedFolders}
															</h1>
														</div>

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
																	className={`min-h-[8px] max-h-[8px] h-auto w-auto cursor-default md:cursor-pointer ${
																		openHiddenFoldersDropdown
																			? "rotate-180"
																			: "rotate-0"
																	}`}
																	src={
																		user.themeColor
																			? "/icons/arrow-white.svg"
																			: "/icons/arrow-black.svg"
																	}
																	alt="search"
																	width={15}
																	height={15}
																/>
															</div>

															{openHiddenFoldersDropdown && (
																<div
																	className={`w-[200px] max-h-[250px] overflow-x-hidden overflow-y-scroll main-content-overflow p-3 rounded-md absolute top-7 right-0 z-40 flex flex-col justify-start items-center bg-white text-black border shadow-md gap-1`}
																>
																	<div
																		className={`flex flex-col gap-2 justify-start items-center ${
																			todolistFolders.allTodoFolders
																				?.filter(
																					(value) =>
																						value.userID ===
																						auth.currentUser.uid,
																				)
																				?.map(
																					(todoFolder) =>
																						todoFolder.folderHidden,
																				)
																				.includes(true) && "w-full"
																		}`}
																	>
																		<input
																			className="px-2 py-1 rounded-md w-full outline-none border border-gray-200 text-sm placeholder:text-sm"
																			type="search"
																			placeholder="Search Hidden Folders"
																			onChange={(e) =>
																				setInputTxt(e.target.value)
																			}
																		/>

																		{todolistFolders.allTodoFolders
																			.filter(
																				(value) =>
																					value.userID === auth.currentUser.uid,
																			)
																			.map((todoFolder) => {
																				if (todoFolder.folderHidden === true) {
																					if (
																						todoFolder.folderTitle
																							.normalize("NFD")
																							.replace(/\p{Diacritic}/gu, "")
																							.toLowerCase()
																							.includes(inputTxt.toLowerCase())
																					) {
																						return (
																							<React.Fragment
																								key={todoFolder.id}
																							>
																								<div
																									className={`flex justify-between items-center gap-2 w-full border rounded-md px-2 py-1 ${
																										todoFolder.pin
																											? "border-blue-500"
																											: todoFolder.completed
																												? "border-green-500"
																												: "border-gray-100"
																									}`}
																								>
																									<div
																										className={`flex justify-center items-center gap-1 w-full`}
																									>
																										<button
																											onClick={() =>
																												!todoFolder.pin &&
																												handleClickHiddenFolder(
																													todoFolder,
																												)
																											}
																											className={`text-sm text-start w-full ${
																												todoFolder.pin
																													? "cursor-not-allowed"
																													: "hover:text-[#0E51FF]"
																											}`}
																										>
																											<p className="line-clamp-1 w-full">
																												{todoFolder.folderTitle}
																											</p>
																										</button>
																									</div>

																									<div className="flex w-fit ml-auto justify-end items-center gap-1">
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
																										<button
																											onClick={() =>
																												handleHideTodoFolder(
																													todoFolder,
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
																								</div>
																							</React.Fragment>
																						);
																					}
																				}
																			})}
																	</div>

																	{!todolistFolders.allTodoFolders
																		?.filter(
																			(value) =>
																				value.userID === auth.currentUser.uid &&
																				value.folderTitle
																					.normalize("NFD")
																					.replace(/\p{Diacritic}/gu, "")
																					.toLowerCase()
																					.includes(inputTxt.toLowerCase()) &&
																				value.folderHidden === true,
																		)
																		?.map(
																			(todoFolder) => todoFolder.folderHidden,
																		)
																		.includes(true) && (
																		<p
																			className={`text-sm text-[#aaa] w-full px-2 py-1`}
																		>
																			No Hidden Folders
																		</p>
																	)}
																</div>
															)}
														</div>
													</div>

													{todolistFolders.allTodoFolders
														?.filter(
															(value) => value.userID === auth.currentUser.uid,
														)
														?.map((todoFolder) => !todoFolder.folderHidden)
														.includes(true) ? null : (
														<p
															className={`mr-auto ${
																user.themeColor
																	? "text-[#555]"
																	: "text-gray-400"
															}`}
														>
															You have hidden To-do Folders
														</p>
													)}

													<div className="flex flex-col gap-6 w-full h-auto">
														{searchQuery && (
															<div
																className={`grid w-full justify-start items-center gap-5 flex-wrap transition-all relative ${
																	todolistFolders.allTodoFolders
																		?.filter(
																			(value) =>
																				(value.userID ===
																					auth.currentUser?.uid &&
																					!value.folderHidden &&
																					value.completed === false &&
																					value.folderTitle
																						.normalize("NFD")
																						.replace(/\p{Diacritic}/gu, "")
																						.toLowerCase()
																						.includes(
																							searchQuery.toLowerCase(),
																						)) ||
																				(value.userID ===
																					auth.currentUser?.uid &&
																					!value.folderHidden &&
																					value.folderName
																						.normalize("NFD")
																						.replace(/\p{Diacritic}/gu, "")
																						.toLowerCase()
																						.includes(
																							searchQuery.toLowerCase(),
																						)),
																		)
																		?.map((t) => t).length < 1
																		? "grid-cols-1"
																		: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
																}`}
															>
																{todolistFolders.allTodoFolders
																	?.filter(
																		(value) =>
																			value.userID === auth.currentUser?.uid &&
																			!value.folderHidden,
																	)
																	?.map((todoFolder) => {
																		if (
																			(todoFolder.userID ===
																				auth.currentUser?.uid &&
																				!todoFolder.folderHidden &&
																				todoFolder.folderTitle
																					.normalize("NFD")
																					.replace(/\p{Diacritic}/gu, "")
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase(),
																					)) ||
																			(todoFolder.userID ===
																				auth.currentUser?.uid &&
																				!todoFolder.folderHidden &&
																				todoFolder.folderName
																					.normalize("NFD")
																					.replace(/\p{Diacritic}/gu, "")
																					.toLowerCase()
																					.includes(searchQuery.toLowerCase()))
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
																						searchQuery={searchQuery}
																					/>
																				</React.Fragment>
																			);
																		}
																	})}

																{todolistFolders.allTodoFolders
																	?.filter(
																		(value) =>
																			(value.userID === auth.currentUser?.uid &&
																				!value.folderHidden &&
																				value.folderTitle
																					.normalize("NFD")
																					.replace(/\p{Diacritic}/gu, "")
																					.toLowerCase()
																					.includes(
																						searchQuery.toLowerCase(),
																					)) ||
																			(value.userID === auth.currentUser?.uid &&
																				!value.folderHidden &&
																				value.folderName
																					.normalize("NFD")
																					.replace(/\p{Diacritic}/gu, "")
																					.toLowerCase()
																					.includes(searchQuery.toLowerCase())),
																	)
																	?.map((t) => t).length < 1 &&
																	todolistFolders.allTodoFolders
																		?.filter(
																			(value) =>
																				value.userID === auth.currentUser.uid,
																		)
																		?.map(
																			(todoFolder) => !todoFolder.folderHidden,
																		)
																		.includes(true) && (
																		<div className="flex flex-col gap-4 justify-center items-center w-full pt-10">
																			<svg
																				width="50"
																				height="50"
																				viewBox="0 0 30 30"
																				fill="none"
																				xmlns="http://www.w3.org/2000/svg"
																			>
																				<path
																					d="M0 29.0769H6.11918L24.1667 10.9815L18.0475 4.84613L0 22.9415V29.0769ZM3.26356 24.2994L18.0475 9.47631L19.5487 10.9815L4.7648 25.8047H3.26356V24.2994Z"
																					fill={
																						user.themeColor ? "#555" : "#aaa"
																					}
																				/>
																				<path
																					d="M24.6667 0.482758C24.0247 -0.160919 22.9877 -0.160919 22.3457 0.482758L19.3334 3.50309L25.5062 9.6923L28.5186 6.67197C29.1605 6.02829 29.1605 4.9885 28.5186 4.34482L24.6667 0.482758Z"
																					fill={
																						user.themeColor ? "#555" : "#aaa"
																					}
																				/>
																			</svg>
																			<p
																				className={`text-lg ${
																					user.themeColor
																						? "text-[#555]"
																						: "text-gray-400"
																				}`}
																			>
																				No To-do Folder Called:{" "}
																				<span className="text-gray-600 italic">
																					{searchQuery}
																				</span>
																			</p>
																		</div>
																	)}
															</div>
														)}

														{!searchQuery && (
															<>
																{todolistFolders.allTodoFolders
																	?.filter(
																		(value) =>
																			value.userID === auth.currentUser?.uid &&
																			!value.folderHidden &&
																			value.pinned &&
																			value.completed === false,
																	)
																	?.map((value) => value).length > 0 && (
																	<div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
																		<h1 className="text-lg text-gray-400">
																			Pinned To-do Folders
																		</h1>

																		<div
																			className={`grid w-full justify-start items-center gap-5 flex-wrap transition-all relative ${
																				todolistFolders.allTodoFolders
																					?.filter(
																						(value) =>
																							value.userID ===
																								auth.currentUser?.uid &&
																							!value.folderHidden &&
																							value.pinned &&
																							value.completed === false,
																					)
																					?.map((t) => t).length < 1
																					? "grid-cols-1"
																					: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
																			}`}
																		>
																			{todolistFolders.allTodoFolders
																				?.filter(
																					(value) =>
																						value.userID ===
																							auth.currentUser?.uid &&
																						!value.folderHidden &&
																						value.pinned &&
																						value.completed === false,
																				)
																				?.map((todoFolder) => {
																					if (
																						todoFolder.userID ===
																							auth.currentUser?.uid &&
																						!todoFolder.folderHidden
																					) {
																						return (
																							<React.Fragment
																								key={todoFolder.id}
																							>
																								<TodoFoldersDashboard
																									todoFolder={todoFolder}
																									user={user}
																									setClickedTodoFolder={
																										setClickedTodoFolder
																									}
																									setClickedFolder={
																										setClickedFolder
																									}
																									auth={auth}
																									searchQuery={searchQuery}
																								/>
																							</React.Fragment>
																						);
																					}
																				})}
																		</div>
																	</div>
																)}

																<div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
																	<h1 className="text-lg text-gray-400">
																		Uncompleted To-do Folders
																	</h1>

																	{todolistFolders.allTodoFolders
																		?.filter(
																			(value) =>
																				value.userID ===
																					auth.currentUser?.uid &&
																				!value.folderHidden &&
																				value.completed === false &&
																				!value.pinned,
																		)
																		?.map((value) => value).length < 1 && (
																		<p
																			className={`${
																				user.themeColor
																					? "text-[#555]"
																					: "text-gray-400"
																			}`}
																		>
																			No To-do Folders
																		</p>
																	)}

																	<div
																		className={`grid w-full justify-start items-center gap-5 flex-wrap transition-all relative ${
																			todolistFolders.allTodoFolders
																				?.filter(
																					(value) =>
																						value.userID ===
																							auth.currentUser?.uid &&
																						!value.folderHidden &&
																						value.completed === false &&
																						!value.pinned,
																				)
																				?.map((t) => t).length < 1
																				? "grid-cols-1"
																				: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
																		}`}
																	>
																		{todolistFolders.allTodoFolders
																			?.filter(
																				(value) =>
																					value.userID ===
																						auth.currentUser?.uid &&
																					!value.folderHidden &&
																					value.completed === false &&
																					!value.pinned,
																			)
																			?.map((todoFolder) => {
																				if (
																					todoFolder.userID ===
																						auth.currentUser?.uid &&
																					!todoFolder.folderHidden &&
																					todoFolder.folderTitle
																				) {
																					return (
																						<React.Fragment key={todoFolder.id}>
																							<TodoFoldersDashboard
																								todoFolder={todoFolder}
																								user={user}
																								setClickedTodoFolder={
																									setClickedTodoFolder
																								}
																								setClickedFolder={
																									setClickedFolder
																								}
																								auth={auth}
																								searchQuery={searchQuery}
																							/>
																						</React.Fragment>
																					);
																				}
																			})}
																	</div>
																</div>

																{todolistFolders.allTodoFolders
																	?.filter(
																		(value) =>
																			value.userID === auth.currentUser?.uid &&
																			!value.folderHidden &&
																			value.completed === true &&
																			!value.pinned,
																	)
																	?.map((value) => value).length > 0 && (
																	<div className="w-full h-auto flex flex-col gap-3 justify-start items-start">
																		<h1 className="text-lg text-gray-400">
																			Completed To-do Folders
																		</h1>

																		<div
																			className={`grid w-full justify-start items-center gap-5 flex-wrap transition-all relative ${
																				todolistFolders.allTodoFolders
																					?.filter(
																						(value) =>
																							value.userID ===
																								auth.currentUser?.uid &&
																							!value.folderHidden &&
																							value.completed === true &&
																							!value.pinned,
																					)
																					?.map((t) => t).length < 1
																					? "grid-cols-1"
																					: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
																			}`}
																		>
																			{todolistFolders.allTodoFolders
																				?.filter(
																					(value) =>
																						value.userID ===
																							auth.currentUser?.uid &&
																						!value.folderHidden &&
																						value.completed === true &&
																						!value.pinned,
																				)
																				?.map((todoFolder) => {
																					if (
																						todoFolder.userID ===
																							auth.currentUser?.uid &&
																						!todoFolder.folderHidden
																					) {
																						return (
																							<React.Fragment
																								key={todoFolder.id}
																							>
																								<TodoFoldersDashboard
																									todoFolder={todoFolder}
																									user={user}
																									setClickedTodoFolder={
																										setClickedTodoFolder
																									}
																									setClickedFolder={
																										setClickedFolder
																									}
																									auth={auth}
																									searchQuery={searchQuery}
																								/>
																							</React.Fragment>
																						);
																					}
																				})}
																		</div>
																	</div>
																)}
															</>
														)}
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
													<p>You Have no To-do Folders</p>
													{folders.allFolders
														?.filter(
															(folder) =>
																folder.userID === auth.currentUser?.uid,
														)
														?.map((folder) => folder).length > 0 ? (
														<button
															onClick={handleCreateTodoFolder}
															className="sidebar todolist-sidebar base-btn"
														>
															Create To-do Folder
														</button>
													) : (
														<button
															onClick={handleFolderCreation}
															className="sidebar base-btn"
														>
															Create Main Folder
														</button>
													)}
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
						document.body,
					)}
			</div>
		</>
	);
}
