import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { createPortal } from "react-dom";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";
import TodosContent from "./TodosContent";
import Filters from "../Sidebar/Filters";

export default function TodolistMainContent({
	todolistFolder,
	user,
	todolistFolders,
}) {
	const { auth, todoLists, folders } = FirebaseApi();
	const { clickedTodoFolder, clickedFolder } = useContext(StateCtx);
	const [editFolderTitleMode, setEditFolderTitleMode] = useState(false);
	const [editFolderTitle, setEditFolderTitle] = useState("");
	const [editFolderEmoji, setEditFolderEmoji] = useState(false);
	const [editFolderDescription, setEditFolderDescription] = useState("");
	const [editFolderDescriptionMode, setEditFolderDescriptionMode] =
		useState(false);
	const [windowWidthCheck, setWindowWidthCheck] = useState(false);
	const [todoSearchInput, setTodoSearchInput] = useState("");
	const [subSearchDropdown, setSubSearchDropdown] = useState(false);
	const [subTodoSearchInput, setSubTodoSearchInput] = useState("");
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
		return () => document.removeEventListener("mousedown", closeEmojiDropdown);
	}, [editFolderEmoji]);

	const handleActivateFolderTitleEdit = (e) => {
		e.preventDefault();
		setEditFolderTitleMode(!editFolderTitleMode);
	};

	const handleFolderTitleEdit = (e) => {
		e.preventDefault();
		if (editFolderTitle.length > 0) {
			todolistFolders.updatingFolderTitle(todolistFolder.id, editFolderTitle);
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
				editFolderDescription
			);
			setEditFolderDescriptionMode(false);
			setEditFolderDescription("");
		}
	};

	const handleAddingTodos = () => {
		todoLists.addingTodos(
			todolistFolder.id,
			folders.allFolders
				?.filter((value) => value.folderName === clickedFolder)
				.slice(0, 1)
				?.map((folder) => folder.folderName)
		);
	};

	const handleSubSearchBarDropdown = () => {
		setSubSearchDropdown(!subSearchDropdown);
	};

	return (
		<>
			<div className="flex flex-col gap-8 w-full lg:w-[80%] 2xl:w-[70%] h-auto">
				{/* <Filters user={user} /> */}
				<div className="flex flex-col sm:flex-row justify-start items-start gap-5">
					<button
						onClick={handleAddingTodos}
						className="base-btn w-fit flex justify-start items-center gap-3"
					>
						<h1 className={`text-white`}>Add Todo</h1>
						<div className="flex justify-center items-center relative">
							<Image
								className="w-auto h-[20px]"
								src={"/icons/plus-white.svg"}
								alt=""
								width={20}
								height={20}
							/>
						</div>
					</button>
					<div className="flex flex-col gap-2 justify-start items-end">
						<div className="flex justify-start items-center gap-2">
							{user.themeColor ? (
								<Image
									className="w-auto h-[16px]"
									src={"/icons/search.svg"}
									alt=""
									width={20}
									height={20}
								/>
							) : (
								<svg
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
							)}

							<div className="flex justify-center items-center gap-1 relative">
								<input
									type="text"
									onChange={(e) => setTodoSearchInput(e.target.value)}
									placeholder="Search Todos"
									className={`pl-2 pr-9 py-1 rounded-md border outline-none text-sm ${
										user.themeColor ? "bg-[#333] border-[#555]" : "bg-[#eee]"
									}`}
								/>
								<button
									onClick={handleSubSearchBarDropdown}
									className="flex h-full justify-center items-center absolute top-1/2 -translate-y-1/2 right-2"
								>
									<Image
										className={`w-auto h-[9px] ${
											subSearchDropdown ? "rotate-180" : ""
										}`}
										src={
											user.themeColor
												? "/icons/arrow-white.svg"
												: "/icons/arrow-black.svg"
										}
										alt=""
										width={20}
										height={20}
									/>
								</button>
							</div>
						</div>
						{subSearchDropdown && (
							<div className="flex justify-end items-center gap-2 w-full relative">
								<input
									type="text"
									onChange={(e) => setSubTodoSearchInput(e.target.value)}
									placeholder="Search Sub Todos"
									className={`pl-2 pr-9 py-1 rounded-md border outline-none text-sm ${
										user.themeColor ? "bg-[#333] border-[#555]" : "bg-[#eee]"
									}`}
								/>
								<div className="flex justify-center items-center absolute top-1/2 -translate-y-1/2 bg-[#444] w-7 h-7 rounded-r-md"></div>
							</div>
						)}
					</div>
				</div>

				<div className="w-full h-auto flex flex-col gap-2 justify-center items-start">
					<div className="flex justify-between items-center gap-2 w-full">
						<div className="flex justify-start items-center gap-5 w-full">
							<form
								className={`flex flex-col justify-start items-start gap-1 ${
									editFolderTitleMode ? "w-full" : "w-fit"
								}`}
							>
								{folders.allFolders
									?.filter((value) => value.folderName === clickedFolder)
									.slice(0, 1)
									?.map((folder) => (
										<React.Fragment key={folder.id}>
											<h3
												className={`text-sm ${
													user.themeColor ? "text-[#555]" : "text-gray-400"
												}`}
											>
												{folder.folderName}
											</h3>
										</React.Fragment>
									))}
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									{editFolderTitleMode ? (
										<input
											className={`border-none w-full rounded-md px-3 py-2 ${
												user.themeColor
													? "text-white bg-[#333]"
													: "text-black bg-gray-200"
											}`}
											onChange={(e) => setEditFolderTitle(e.target.value)}
											type="text"
											name="folder-title"
											placeholder={todolistFolder.folderTitle}
										/>
									) : (
										<h1
											onClick={handleActivateFolderTitleEdit}
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
												onClick={handleActivateFolderTitleEdit}
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
											{user.username}, you can only add emojis on devices with a
											width of {'"455"'} or higher
										</p>
									</div>
								</>,
								document.body
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
										<Picker data={data} onEmojiSelect={handleFolderEmojiEdit} />
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
								onChange={(e) => setEditFolderDescription(e.target.value)}
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
									onClick={handleActivateFolderDescriptionEdit}
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

				<div className={`flex flex-col justify-start items-start w-full gap-2`}>
					<>
						{todoLists.allTodoLists
							?.filter(
								(value) =>
									value.folderID === todolistFolder.id &&
									value.userID === auth.currentUser.uid
							)
							?.map((todolist) => {
								if (
									todolist.folderID === clickedTodoFolder &&
									todolist.todo
										.normalize("NFD")
										.replace(/\p{Diacritic}/gu, "")
										.toLowerCase()
										.includes(todoSearchInput.toLowerCase())
								) {
									return (
										<TodosContent
											key={todolist.id}
											todoLists={todoLists}
											todolist={todolist}
											folders={folders}
											todolistFolder={todolistFolder}
											subTodoSearchInput={subTodoSearchInput}
										/>
									);
								}
							})}
					</>

					{!todoLists.allTodoLists
						?.filter((value) => value.userID === auth.currentUser.uid)
						?.map((todolist) => todolist.folderID === clickedTodoFolder)
						.includes(true) && (
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
								No Added Todo List
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
