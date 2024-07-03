import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { createPortal } from "react-dom";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";
import TodosContent from "./TodosContent";
import Filters from "../Sidebar/Filters";
import AllIgnoredTodos from "./AllIgnoredTodos";
import AllTodos from "./AllTodos";

export default function TodolistMainContent({
	todolistFolder,
	user,
	todolistFolders,
}) {
	const { auth, todoLists, folders } = FirebaseApi();
	const {
		clickedTodoFolder,
		clickedFolder,
		setClickedFolder,
		setClickedTodoFolder,
		setCloseSidebar,
		setOpenTodolistSidebar,
		searchQueryRef,
		closeSidebar,
		filterState,
		filterDispatch,
		completedTodos,
		setCompletedTodos,
		todoSearchInput,
		setTodoSearchInput,
		openTodoSearchInput,
		setOpenTodoSearchInput,
	} = useContext(StateCtx);
	const [editFolderTitleMode, setEditFolderTitleMode] = useState(false);
	const [editFolderTitle, setEditFolderTitle] = useState("");
	const [editFolderEmoji, setEditFolderEmoji] = useState(false);
	const [editFolderDescription, setEditFolderDescription] = useState("");
	const [editFolderDescriptionMode, setEditFolderDescriptionMode] =
		useState(false);
	const [windowWidthCheck, setWindowWidthCheck] = useState(false);
	const [subSearchDropdown, setSubSearchDropdown] = useState(false);
	const [subTodoSearchInput, setSubTodoSearchInput] = useState("");
	const [openTransferDropdown, setOpenTransferDropdown] = useState(false);
	const [deleteCompletedTodo, setDeleteCompletedTodo] = useState(false);
	const [deletionLoad, setDeletionLoad] = useState(false);
	const windowWidthCheckRef = useRef();

	const handleWindowWidth = () => {
		if (window.innerWidth < 445) {
			setWindowWidthCheck(true);
			windowWidthCheckRef.current = setTimeout(() => {
				setWindowWidthCheck(false);
			}, 10000);
		}
	};

	useEffect(() => {
		const closeWidowWidthWarning = (e) => {
			if (!e.target.closest(".widow-width-warning")) {
				setWindowWidthCheck(false);
			}
		};

		document.addEventListener("mousedown", closeWidowWidthWarning);
		return () =>
			document.removeEventListener("mousedown", closeWidowWidthWarning);
	}, [windowWidthCheck]);

	useEffect(() => {
		const closeEmojiDropdown = (e) => {
			if (!e.target.closest(".emoji-dropdown")) {
				setEditFolderEmoji(false);
			}
		};

		document.addEventListener("mousedown", closeEmojiDropdown);
		return () =>
			document.removeEventListener("mousedown", closeEmojiDropdown);
	}, [editFolderEmoji]);

	const handleActivateFolderTitleEdit = (e) => {
		e.preventDefault();
		setEditFolderTitleMode(!editFolderTitleMode);
	};

	const handleFolderTitleEdit = (e) => {
		e.preventDefault();
		if (editFolderTitle.length > 0) {
			todolistFolders.updatingFolderTitle(
				todolistFolder.id,
				editFolderTitle,
			);
			setEditFolderTitleMode(false);
			setEditFolderTitle("");
		}
	};

	const handleActivateFolderEmojiEdit = () => {
		setEditFolderEmoji(!editFolderEmoji);
		clearTimeout(windowWidthCheckRef.current);
	};

	const handleFolderEmojiEdit = (emoji) => {
		todolistFolders.updatingFolderEmoji(todolistFolder.id, emoji.native);
	};

	const handleActivateFolderDescriptionEdit = (e) => {
		e.preventDefault();
		setEditFolderDescriptionMode(!editFolderDescriptionMode);
	};

	const handleFolderDescriptionEdit = (e) => {
		e.preventDefault();
		if (editFolderDescription) {
			todolistFolders.updatingFolderDescription(
				todolistFolder.id,
				editFolderDescription,
			);
			setEditFolderDescriptionMode(false);
			setEditFolderDescription("");
		}
	};

	const handleAddingTodos = () => {
		setCompletedTodos(false);

		todoLists.addingTodos(
			todolistFolder.id,
			folders.allFolders
				?.filter(
					(value) =>
						value.folderName === clickedFolder &&
						value.userID === auth.currentUser?.uid,
				)
				.slice(0, 1)
				?.map((folder) => folder.folderName),
		);
	};

	const handleSubSearchBarDropdown = () => {
		setSubSearchDropdown(!subSearchDropdown);
		setSubTodoSearchInput("");
	};

	const handleTransferTodoFolderDropdown = (e) => {
		e.preventDefault();
		setOpenTransferDropdown(!openTransferDropdown);
	};

	useEffect(() => {
		const closeTransferDropdown = (e) => {
			if (!e.target.closest(".transfer-dropdown")) {
				setOpenTransferDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeTransferDropdown);
		return () =>
			document.removeEventListener("mousedown", closeTransferDropdown);
	}, [openTransferDropdown]);

	const handleTransferTodoFolder = (e, folderName) => {
		e.preventDefault();
		setClickedFolder("");
		setClickedTodoFolder("");

		todolistFolders.updatingFolderName(todolistFolder.id, folderName);

		todoLists.allTodoLists
			?.filter(
				(value) =>
					value.userID === auth.currentUser?.uid &&
					value.mainFolder[0] === clickedFolder &&
					value.folderID === clickedTodoFolder,
			)
			?.map((todo) =>
				todoLists.updatingTodoMainFolder(todo.id, [folderName]),
			);

		todoLists.allSubTodos
			?.filter(
				(value) =>
					value.userID === auth.currentUser?.uid &&
					value.mainFolder[0] === clickedFolder &&
					value.folderID === clickedTodoFolder,
			)
			?.map((subTodo) =>
				todoLists.updatingSubTodoMainFolder(subTodo.id, [folderName]),
			);
	};

	const handleCompletedTodosBtn = () => {
		setCompletedTodos(!completedTodos);

		filterDispatch({
			type: "filter-category",
			payload: {
				key: "filterCategories",
				value: "All",
				value2: "",
			},
		});
	};

	const handleOpenTodoSearchInput = () => {
		setOpenTodoSearchInput(!openTodoSearchInput);
		setTodoSearchInput("");
		setSubTodoSearchInput("");
		if (openTodoSearchInput) setSubSearchDropdown(false);
	};

	const handleDeleteAll = () => {
		todoLists.allTodoLists
			.filter(
				(value) =>
					value.userID == auth.currentUser?.uid &&
					value.completed === true &&
					value.folderID === clickedTodoFolder,
			)
			.map((todos) => {
				todoLists.allSubTodos
					.filter(
						(value) =>
							value.todoID === todos.id &&
							value.folderID === clickedTodoFolder &&
							auth.currentUser?.uid === value.userID,
					)
					?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));

				return todoLists.deletingTodolist(todos.id);
			});

		setDeletionLoad(true);
	};

	useEffect(() => {
		if (
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID == auth.currentUser?.uid &&
						value.completed === true &&
						value.folderID === clickedTodoFolder,
				)
				?.map((todos) => todos) < 1
		) {
			setDeleteCompletedTodo(false);
			setDeletionLoad(false);
		}
	});

	const handleDeleteCompletedTodo = () => {
		setDeleteCompletedTodo(!deleteCompletedTodo);
	};

	useEffect(() => {
		const closeDeletedTodoModal = (e) => {
			if (!e.target.closest(".delete-completed-todos")) {
				setDeleteCompletedTodo(false);
			}
		};

		document.addEventListener("mousedown", closeDeletedTodoModal);
		return () =>
			document.removeEventListener("mousedown", closeDeletedTodoModal);
	}, [openTransferDropdown]);

	const handleClearTodoFolderClick = () => {
		setClickedTodoFolder("");
		setClickedFolder("");
		setOpenTodolistSidebar(false);
		setCloseSidebar(closeSidebar);

		if (window.innerWidth > 1024) {
			setTimeout(() => {
				searchQueryRef.current?.focus();
			}, 10);
		}
	};

	const totalTodos = () => {
		return `${
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID === auth.currentUser?.uid &&
						value.folderID === clickedTodoFolder &&
						value.completed === true,
				)
				?.map((todo) => todo).length
		}/${
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID === auth.currentUser?.uid &&
						value.folderID === clickedTodoFolder &&
						!value.ignoreTodo,
				)
				?.map((todo) => todo).length
		}`;
	};

	const totalSubTodos = () => {
		return todoLists.allSubTodos
			?.filter(
				(value) =>
					value.userID === auth.currentUser?.uid &&
					value.folderID === clickedTodoFolder,
			)
			.map((subTodo) => subTodo).length;
	};

	const todoSearchInputWidthCheck = () => {
		if (window.innerWidth > 768) {
			return openTodoSearchInput;
		}
	};

	const handleClearFilter = () => {
		filterDispatch({
			type: "filter-category",
			payload: {
				key: "filterCategories",
				value: "All",
				value2: "",
			},
		});
	};

	const totalCompletionPercentage = () => {
		const percentage =
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID === auth.currentUser.uid &&
						value.folderID === clickedTodoFolder &&
						value.mainFolder[0] === clickedFolder &&
						value.completed &&
						!value.ignoreTodo,
				)
				?.map((todolist) => todolist).length /
			todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID === auth.currentUser.uid &&
						value.folderID === clickedTodoFolder &&
						value.mainFolder[0] === clickedFolder &&
						!value.ignoreTodo,
				)
				?.map((todolist) => todolist).length;

		return percentage;
	};

	const handleCopyAll = () => {
		const todosLength = todoLists.allTodoLists
			?.filter(
				(value) =>
					value.userID &&
					auth.currentUser.uid &&
					todolistFolder.id === value.folderID &&
					!value.completed &&
					!value.ignoreTodo,
			)
			?.map((todolist) => todolist).length;

		const completedTodosLength = todoLists.allTodoLists
			?.filter(
				(value) =>
					value.userID &&
					auth.currentUser.uid &&
					todolistFolder.id === value.folderID &&
					value.completed &&
					!value.ignoreTodo,
			)
			?.map((todolist) => todolist).length;

		const todos = completedTodos
			? todoLists.allTodoLists
					?.filter(
						(value) =>
							value.userID &&
							auth.currentUser.uid &&
							todolistFolder.id === value.folderID &&
							value.completed &&
							!value.ignoreTodo,
					)
					?.map((todolist) => ` - ${todolist.todo}`)
			: todoLists.allTodoLists
					?.filter(
						(value) =>
							value.userID &&
							auth.currentUser.uid &&
							todolistFolder.id === value.folderID &&
							!value.completed &&
							!value.ignoreTodo,
					)
					?.map((todolist) => ` - ${todolist.todo}`);

		const ignoredTodos = todoLists.allTodoLists
			?.filter(
				(value) =>
					value.userID &&
					auth.currentUser.uid &&
					todolistFolder.id === value.folderID &&
					value.ignoreTodo,
			)
			?.map((todolist) => ` - ${todolist.todo}`);

		completedTodos
			? navigator.clipboard.writeText(
					`Completed To-dos (${completedTodosLength}):\n\n ${todos.toString()}`,
				)
			: navigator.clipboard.writeText(
					`To-dos (${todosLength}):\n\n ${todos.toString()} \n\nIgnored Todos (${
						ignoredTodos.length
					}):\n\n ${ignoredTodos.toString()}`,
				);
	};

	return (
		<>
			<div className="flex flex-col gap-8 w-full lg:w-[80%] 2xl:w-[70%] h-auto">
				<Filters user={user} />

				<button
					onClick={() => {
						handleClearTodoFolderClick();
					}}
					className={`w-fit flex justify-start items-center gap-2 text-sm ${
						user.themeColor ? "text-white" : "text-black"
					}`}
				>
					<Image
						className="min-h-[13px] max-h-[13px] w-auto cursor-default md:cursor-pointer rotate-90"
						src={
							user.themeColor
								? "/icons/arrow-white.svg"
								: "/icons/arrow-black.svg"
						}
						alt="search"
						width={20}
						height={20}
					/>
					<span>Back to Dashboard</span>
				</button>

				<div className="w-full h-auto flex flex-col gap-2 justify-center items-start">
					<div className="flex justify-between items-center gap-2 w-full">
						<div className="flex justify-start items-center gap-5 w-full">
							<form
								className={`flex flex-col justify-start items-start gap-1 ${
									editFolderTitleMode ? "w-full" : "w-fit"
								}`}
							>
								{folders.allFolders
									?.filter(
										(value) =>
											value.folderName ===
												clickedFolder &&
											value.userID ===
												auth.currentUser?.uid,
									)
									.slice(0, 1)
									?.map((folder) => (
										<div
											className="relative text-black"
											key={folder.id}
										>
											{openTransferDropdown && (
												<div className="transfer-dropdown absolute top-6 left-0 min-w-[144px] h-fit px-3 py-2 bg-white rounded-md border z-10 text-sm flex flex-col justify-center items-start gap-2">
													<h1 className="font-bold max-w-[100%] w-44">
														Transfer To-do Folder
														to:
													</h1>
													<div className="flex flex-col justify-center items-start gap-0">
														<p className="text-sm text-[#aaa] font-semibold">
															Main Folders
														</p>
														{folders.allFolders
															.filter(
																(value) =>
																	value.folderName !==
																		folder.folderName &&
																	value.userID ===
																		auth
																			.currentUser
																			?.uid,
															)
															.map((folders) => {
																return (
																	<React.Fragment
																		key={
																			folders.id
																		}
																	>
																		<button
																			className="text-btn text-start flex justify-start items-start"
																			onClick={(
																				e,
																			) => {
																				handleTransferTodoFolder(
																					e,
																					folders.folderName,
																				);
																			}}
																		>
																			<p
																				className="line-clamp-1"
																				title={
																					folders.folderName
																				}
																			>
																				{
																					folders.folderName
																				}
																			</p>
																		</button>
																	</React.Fragment>
																);
															})}

														{folders.allFolders
															.filter(
																(value) =>
																	value.userID ===
																		auth
																			.currentUser
																			?.uid &&
																	value.folderName !==
																		folder.folderName,
															)
															.map(
																(folders) =>
																	folders,
															).length < 1 && (
															<p className="text-[#bbb]">
																No Folders to
																Transfer
															</p>
														)}
													</div>
												</div>
											)}
											<div
												onClick={
													handleTransferTodoFolderDropdown
												}
												className="transfer-dropdown text-btn flex justify-center items-center gap-2 relative"
											>
												<h3
													className={`text-sm ${
														user.themeColor
															? "text-[#555]"
															: "text-gray-400"
													}`}
												>
													Transfer
												</h3>
											</div>
										</div>
									))}
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									{editFolderTitleMode ? (
										<input
											className={`border-none w-full rounded-md px-3 py-2 ${
												user.themeColor
													? "text-white bg-[#333]"
													: "text-black bg-gray-200"
											}`}
											onChange={(e) =>
												setEditFolderTitle(
													e.target.value,
												)
											}
											type="text"
											name="folder-title"
											placeholder={
												todolistFolder.folderTitle
											}
										/>
									) : (
										<h1
											onClick={
												handleActivateFolderTitleEdit
											}
											title={todolistFolder.folderTitle}
											className="text-2xl font-semibold line-clamp-2 text-btn"
										>
											{todolistFolder.folderTitle}
										</h1>
									)}
								</div>
								{editFolderTitleMode && (
									<>
										<div className="flex justify-center items-center gap-2 mt-1">
											<button
												onClick={handleFolderTitleEdit}
												className="base-btn"
											>
												change
											</button>
											<button
												onClick={
													handleActivateFolderTitleEdit
												}
												className="base-btn !bg-red-500"
											>
												cancel
											</button>
										</div>
									</>
								)}
							</form>
						</div>
						{windowWidthCheck &&
							createPortal(
								<>
									<div className="widow-width-warning fixed top-0 left-0 w-full h-fit px-2 py-3 flex justify-center items-center text-white bg-yellow-600 z-50 text-center">
										<p>
											{user.username}, you can only add
											emojis on devices with a width of{" "}
											{'"455"'} or higher
										</p>
									</div>
								</>,
								document.body,
							)}
						{!editFolderTitleMode && (
							<div className="relative">
								<button
									onClick={() => {
										handleActivateFolderEmojiEdit();
										handleWindowWidth();
									}}
									className="text-5xl"
								>
									{todolistFolder.folderEmoji ? (
										todolistFolder.folderEmoji
									) : (
										<>
											<div className="text-btn w-10 h-10 rounded-full bg-gray-400" />
										</>
									)}
								</button>
								{editFolderEmoji && (
									<div className="emoji-dropdown absolute top-[56px] right-0 z-10">
										<Picker
											data={data}
											onEmojiSelect={
												handleFolderEmojiEdit
											}
										/>
									</div>
								)}
							</div>
						)}
					</div>
					{editFolderDescriptionMode ? (
						<form className="flex flex-col justify-start items-start gap-3 w-full">
							<textarea
								className={`border-none rounded-md px-3 py-2 w-full min-h-[66px] h-[66px] max-h-[250px] ${
									user.themeColor
										? "text-white bg-[#333]"
										: "text-black bg-gray-200"
								}`}
								onChange={(e) =>
									setEditFolderDescription(e.target.value)
								}
								type="text"
								name="folder-description"
								placeholder={todolistFolder.folderDescription}
							></textarea>
							<div className="flex justify-center items-center gap-2">
								<button
									onClick={handleFolderDescriptionEdit}
									className="base-btn"
								>
									change
								</button>
								<button
									onClick={
										handleActivateFolderDescriptionEdit
									}
									className="base-btn !bg-red-500"
								>
									cancel
								</button>
							</div>
						</form>
					) : (
						<div className="flex flex-col justify-start items-start gap-2">
							<p
								className="text-btn"
								onClick={handleActivateFolderDescriptionEdit}
							>
								{todolistFolder.folderDescription}
							</p>
						</div>
					)}
				</div>

				<div className="handle-bar-overflow flex flex-col md:flex-row justify-start items-center gap-5 md:gap-5">
					<div className="flex flex-col gap-2 justify-center items-center w-full md:w-fit relative">
						<div className="flex justify-start items-center gap-2 w-full md:w-fit">
							{user.themeColor ? (
								<button onClick={handleOpenTodoSearchInput}>
									<Image
										className="min-h-[16px] min-w-[16px] cursor-default md:cursor-pointer"
										src={"/icons/search.svg"}
										alt="search"
										width={20}
										height={20}
									/>
								</button>
							) : (
								<button onClick={handleOpenTodoSearchInput}>
									<svg
										className="min-h-[16px] min-w-[16px] cursor-default md:cursor-pointer"
										width="16"
										height="16"
										viewBox="0 0 27 27"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"
											fill="black"
										/>
									</svg>
								</button>
							)}

							{openTodoSearchInput && (
								<>
									{todoSearchInput.length > 0 && (
										<button
											onClick={() => {
												setTodoSearchInput("");
												setSubTodoSearchInput("");
												setSubSearchDropdown(false);
											}}
											className="text-[14px] base-btn !bg-red-500"
										>
											Clear
										</button>
									)}
									<div className="hidden md:flex justify-center items-center gap-1 relative h-fit w-full">
										<input
											type="text"
											onChange={(e) =>
												setTodoSearchInput(
													e.target.value,
												)
											}
											value={todoSearchInput}
											placeholder="Search To-dos"
											className={`pl-2 pr-9 py-1 rounded-md border outline-none text-sm w-full md:w-fit ${
												user.themeColor
													? "bg-[#333] border-[#555]"
													: "bg-[#eee]"
											}`}
										/>

										<button
											onClick={handleSubSearchBarDropdown}
											className="flex h-full justify-center items-center absolute top-1/2 -translate-y-1/2 right-2"
										>
											<Image
												className={`w-auto h-[9px] ${
													subSearchDropdown &&
													"rotate-180"
												}`}
												src={
													user.themeColor
														? "/icons/arrow-white.svg"
														: "/icons/arrow-black.svg"
												}
												alt="arrow"
												width={20}
												height={20}
											/>
										</button>
									</div>
								</>
							)}

							<div
								className={`flex md:hidden justify-center items-center gap-1 relative h-fit w-full`}
							>
								<input
									type="text"
									onChange={(e) =>
										setTodoSearchInput(e.target.value)
									}
									placeholder="Search To-dos"
									className={`pl-2 pr-9 py-1 rounded-md border outline-none text-sm w-full md:w-fit ${
										user.themeColor
											? "bg-[#333] border-[#555]"
											: "bg-[#eee]"
									}`}
								/>

								<button
									onClick={handleSubSearchBarDropdown}
									className="flex h-full justify-center items-center absolute top-1/2 -translate-y-1/2 right-2"
								>
									<Image
										className={`w-auto h-[9px] ${
											subSearchDropdown && "rotate-180"
										}`}
										src={
											user.themeColor
												? "/icons/arrow-white.svg"
												: "/icons/arrow-black.svg"
										}
										alt="arrow"
										width={20}
										height={20}
									/>
								</button>
							</div>
						</div>
						{subSearchDropdown && (
							<div className="flex z-10 justify-end items-center gap-2 w-full absolute top-9 left-0">
								<input
									type="text"
									onChange={(e) =>
										setSubTodoSearchInput(e.target.value)
									}
									placeholder="Search Sub To-dos"
									className={`pl-2 pr-9 py-1 rounded-md border outline-none text-sm w-full md:w-fit ${
										user.themeColor
											? "bg-[#333] border-[#555]"
											: "bg-[#eee]"
									}`}
								/>

								<div
									className={`flex justify-center items-center absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-r-md ${
										user.themeColor
											? "bg-[#444]"
											: "bg-[#ddd]"
									}`}
								></div>
							</div>
						)}
					</div>

					<button
						onClick={handleAddingTodos}
						className={`base-btn w-full md:w-auto md:min-w-[130px] flex justify-center items-center gap-3`}
					>
						<h1 className={`text-white`}>Add To-do</h1>
						<div className="flex justify-center items-center relative">
							<Image
								className="w-auto h-[20px]"
								src={"/icons/plus-white.svg"}
								alt="add to-do"
								width={20}
								height={20}
							/>
						</div>
					</button>

					<button
						onClick={handleCompletedTodosBtn}
						className={`w-full md:w-auto md:min-w-[180px] px-2 py-1 flex justify-center items-center gap-2 text-center rounded-md ${
							user.themeColor
								? completedTodos
									? "border border-[#0E51FF] text-white"
									: "text-btn bg-[#0E51FF] text-white"
								: completedTodos
									? "border border-[#0E51FF] text-[#0E51FF]"
									: "text-btn bg-[#0E51FF] text-white"
						}`}
					>
						<p>Completed To-dos</p>
						{completedTodos && (
							<Image
								className="min-w-[15px] min-h-[15px] rotate-[45deg]"
								src={
									user.themeColor
										? "/icons/plus-white.svg"
										: "/icons/plus-black.svg"
								}
								alt="complete"
								width={20}
								height={20}
							/>
						)}
					</button>

					<div
						className={`md:ml-auto flex flex-col justify-center items-center md:items-end ${
							todoSearchInputWidthCheck() && "hidden"
						}`}
					>
						<h1 className="text-2xl font-semibold line-clamp-1 flex justify-start items-center gap-2">
							<span>
								{totalTodos()}{" "}
								{totalTodos() === 1 ? "To-do" : "To-dos"}
							</span>
						</h1>
						<h3 className="text-[12px] font-light line-clamp-1">
							{totalSubTodos()} Sub To-dos
						</h3>
					</div>
				</div>

				{completedTodos && (
					<>
						<button
							onClick={handleDeleteCompletedTodo}
							className={`bg-red-500 w-full md:w-auto md:min-w-[180px] px-2 py-1 flex justify-center items-center gap-2 text-center rounded-md`}
						>
							<p className="text-white">Delete All</p>
						</button>

						{deleteCompletedTodo &&
							createPortal(
								<div className="delete-completed-todos bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center w-full h-full top-0 left-0 absolute text-center px-10">
									<div className="delete-completed-todos w-fit h-fit p-6 bg-white rounded-md flex flex-col justify-center items-center gap-3">
										{deletionLoad && (
											<p className="text-white bg-red-500 px-2 py-1 rounded-lg w-full text-center">
												Deleting Todos...Please Wait
											</p>
										)}
										<div className="flex flex-col justify-center items-center gap-2">
											<h1 className="text-2xl font-semibold">
												Are you sure you want to delete?
											</h1>
											<p>
												Your completed to-do category
												will be gone forever
											</p>
										</div>
										<div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
											{deletionLoad ? (
												<button className="px-2 py-1 rounded-md !bg-gray-500 cursor-not-allowed w-full text-white">
													Delete All
												</button>
											) : (
												<button
													onClick={handleDeleteAll}
													className="px-2 py-1 rounded-md bg-red-500 w-full text-white"
												>
													Delete All
												</button>
											)}

											{deletionLoad ? (
												<button className="px-2 py-1 rounded-md !bg-gray-500 w-full text-white cursor-not-allowed">
													Cancel
												</button>
											) : (
												<button
													onClick={
														handleDeleteCompletedTodo
													}
													className="px-2 py-1 rounded-md bg-[#0E51FF] w-full text-white"
												>
													Cancel
												</button>
											)}
										</div>
									</div>
								</div>,
								document.body,
							)}
					</>
				)}

				<div
					className={`flex flex-col justify-start items-start w-full gap-2 rounded-md`}
				>
					<>
						{filterState.filterCategories.value ? (
							<div className="flex justify-start items-start gap-2">
								<div className="flex justify-start items-center gap-1">
									<p
										className={`text-lg font-semibold ${
											user.themeColor
												? "text-[#555]"
												: "text-gray-400"
										}`}
									>
										{filterState.filterCategories.value}:
									</p>
									<p
										className={`text-lg font-semibold ${
											user.themeColor
												? "text-[#555]"
												: "text-gray-400"
										}`}
									>
										{filterState.filterCategories.value2}
									</p>
								</div>
								{filterState.filterCategories !== "All" && (
									<button
										className="px-2 py-1 rounded-md text-white bg-red-500 text-sm"
										onClick={handleClearFilter}
									>
										Clear
									</button>
								)}
							</div>
						) : (
							<div className="w-full flex justify-start items-center gap-2">
								<p
									className={`text-xl font-semibold ${
										user.themeColor
											? "text-[#555]"
											: "text-gray-400"
									}`}
								>
									{filterState.filterCategories}
								</p>

								{completedTodos
									? todoLists.allTodoLists
											?.filter(
												(value) =>
													value.userID &&
													auth.currentUser.uid &&
													todolistFolder.id ===
														value.folderID &&
													value.completed,
											)
											?.map((todolist) => todolist)
											.length > 1 && (
											<button
												onClick={handleCopyAll}
												className={`text-btn text-sm ${
													user.themeColor
														? "text-[#999]"
														: "text-[#a9a9a9]"
												}`}
											>
												Copy All To-dos
											</button>
										)
									: todoLists.allTodoLists
											?.filter(
												(value) =>
													value.userID &&
													auth.currentUser.uid &&
													todolistFolder.id ===
														value.folderID &&
													!value.completed,
											)
											?.map((todolist) => todolist)
											.length > 1 && (
											<button
												onClick={handleCopyAll}
												className={`text-btn text-sm ${
													user.themeColor
														? "text-[#999]"
														: "text-[#a9a9a9]"
												}`}
											>
												Copy All To-dos
											</button>
										)}

								{filterState.filterCategories === "All" && (
									<>
										{totalCompletionPercentage() ? (
											<>
												{totalCompletionPercentage() >=
												1 ? (
													<p
														className={`text-base font-normal ml-auto ${
															user.themeColor
																? "text-[#666]"
																: "text-[#9CA3AF]"
														}`}
													>
														{totalCompletionPercentage()
															.toFixed(2)
															.replace("0.", "")
															.replace(".", "")}
														% Completed
													</p>
												) : totalCompletionPercentage()
														.toString()
														.includes("0") ? (
													<p
														className={`text-base font-normal ml-auto ${
															user.themeColor
																? "text-[#666]"
																: "text-[#9CA3AF]"
														}`}
													>
														{totalCompletionPercentage()
															.toFixed(2)
															.replace("0.", "")}
														% Completed
													</p>
												) : (
													<p
														className={`text-base font-normal ml-auto ${
															user.themeColor
																? "text-[#666]"
																: "text-[#9CA3AF]"
														}`}
													>
														{totalCompletionPercentage()
															.toFixed(2)
															.replace("0.", "")
															.replace("0", "")}
														% Completed
													</p>
												)}
											</>
										) : (
											<>
												<p
													className={`text-base font-normal ml-auto ${
														user.themeColor
															? "text-[#666]"
															: "text-[#9CA3AF]"
													}`}
												>
													No To-dos Completed
												</p>
											</>
										)}
									</>
								)}
								{filterState.filterCategories !== "All" && (
									<button
										className="px-2 py-1 rounded-md text-white bg-red-500 text-sm"
										onClick={handleClearFilter}
									>
										Clear
									</button>
								)}
							</div>
						)}

						<AllTodos
							TodosContent={TodosContent}
							todoLists={todoLists}
							filterState={filterState}
							clickedTodoFolder={clickedTodoFolder}
							auth={auth}
							completedTodos={completedTodos}
							todolistFolder={todolistFolder}
							folders={folders}
							subTodoSearchInput={subTodoSearchInput}
							todoSearchInput={todoSearchInput}
						/>

						<AllIgnoredTodos
							TodosContent={TodosContent}
							todoLists={todoLists}
							filterState={filterState}
							clickedTodoFolder={clickedTodoFolder}
							auth={auth}
							completedTodos={completedTodos}
							todolistFolder={todolistFolder}
							folders={folders}
							subTodoSearchInput={subTodoSearchInput}
							todoSearchInput={todoSearchInput}
						/>
					</>

					{/* Difficulty Main */}
					{!todoLists.allTodoLists
						?.filter(
							(value) => value.userID === auth.currentUser?.uid,
						)
						?.map(
							(todolist) =>
								todolist.folderID === clickedTodoFolder &&
								todolist.completed === false &&
								!todolist.ignoreTodo,
						)
						.includes(true) &&
						!completedTodos &&
						filterState.filterCategories.value === "Difficulty" &&
						filterState.filterCategories.value2 === "" && (
							<div className="flex flex-col justify-start items-start gap-3 w-full">
								<p
									className={
										user.themeColor
											? "text-[#555]"
											: "text-gray-400"
									}
								>
									No To-dos
								</p>
							</div>
						)}

					{/* Favorites */}
					{!todoLists.allTodoLists
						?.filter(
							(value) => value.userID === auth.currentUser?.uid,
						)
						?.map(
							(todolist) =>
								todolist.folderID === clickedTodoFolder &&
								todolist.favorited === true &&
								todolist.completed === false,
						)
						.includes(true) &&
						filterState.filterCategories === "Favorites" && (
							<div className="flex flex-col justify-start items-start gap-3 w-full">
								<p
									className={
										user.themeColor
											? "text-[#555]"
											: "text-gray-400"
									}
								>
									No Favorited To-dos
								</p>
							</div>
						)}

					<>
						{/* Difficulties */}
						{!todoLists.allTodoLists
							?.filter(
								(value) =>
									value.userID === auth.currentUser?.uid,
							)
							?.map(
								(todolist) =>
									todolist.folderID === clickedTodoFolder &&
									todolist.difficulty === "Easy" &&
									todolist.completed === false,
							)
							.includes(true) &&
							filterState.filterCategories.value ===
								"Difficulty" &&
							filterState.filterCategories.value2 === "Easy" && (
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									<p
										className={
											user.themeColor
												? "text-[#555]"
												: "text-gray-400"
										}
									>
										No Easy To-dos
									</p>
								</div>
							)}

						{!todoLists.allTodoLists
							?.filter(
								(value) =>
									value.userID === auth.currentUser?.uid,
							)
							?.map(
								(todolist) =>
									todolist.folderID === clickedTodoFolder &&
									todolist.difficulty === "Intermediate" &&
									todolist.completed === false,
							)
							.includes(true) &&
							filterState.filterCategories.value ===
								"Difficulty" &&
							filterState.filterCategories.value2 ===
								"Intermediate" && (
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									<p
										className={
											user.themeColor
												? "text-[#555]"
												: "text-gray-400"
										}
									>
										No Intermediate Todos
									</p>
								</div>
							)}

						{!todoLists.allTodoLists
							?.filter(
								(value) =>
									value.userID === auth.currentUser?.uid,
							)
							?.map(
								(todolist) =>
									todolist.folderID === clickedTodoFolder &&
									todolist.difficulty === "Hard" &&
									todolist.completed === false,
							)
							.includes(true) &&
							filterState.filterCategories.value ===
								"Difficulty" &&
							filterState.filterCategories.value2 === "Hard" && (
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									<p
										className={
											user.themeColor
												? "text-[#555]"
												: "text-gray-400"
										}
									>
										No Hard To-dos
									</p>
								</div>
							)}
					</>

					{/* No To-dos */}
					{filterState.filterCategories !== "Favorites" &&
						filterState.filterCategories.value !== "Difficulty" &&
						todoLists.allTodoLists
							?.filter(
								(value) =>
									value.folderID === todolistFolder.id &&
									value.userID === auth.currentUser?.uid &&
									value.completed === completedTodos &&
									value.folderID === clickedTodoFolder &&
									value.todo
										.normalize("NFD")
										.replace(/\p{Diacritic}/gu, "")
										.toLowerCase()
										.includes(
											todoSearchInput.toLowerCase(),
										),
							)
							?.map((todolist) => todolist).length < 1 &&
						!completedTodos && (
							<p
								className={`${
									user.themeColor
										? "text-[#555]"
										: "text-gray-400"
								}`}
							>
								No To-dos Found
							</p>
						)}

					{/* No Completed Todos */}
					{!todoLists.allTodoLists
						?.filter(
							(value) => value.userID === auth.currentUser?.uid,
						)
						?.map(
							(todolist) =>
								todolist.folderID === clickedTodoFolder &&
								todolist.completed === true &&
								todolist.todo
									.normalize("NFD")
									.replace(/\p{Diacritic}/gu, "")
									.toLowerCase()
									.includes(todoSearchInput.toLowerCase()),
						)
						.includes(true) &&
						completedTodos && (
							<div className="flex flex-col justify-start items-start gap-3 w-full">
								<p
									className={
										user.themeColor
											? "text-[#555]"
											: "text-gray-400"
									}
								>
									No Completed To-dos
								</p>
							</div>
						)}
				</div>
			</div>
		</>
	);
}
