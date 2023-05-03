import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TodolistPlaceholder from "./TodolistPlaceholder";
import { createPortal } from "react-dom";

export default function TodolistMainContent({ todolistFolder, user, todolistFolders }) {
	const [editAppear, setEditAppear] = useState(false);
	const [editAppearDescription, setEditAppearDescription] = useState(false);
	const [editFolderTitleMode, setEditFolderTitleMode] = useState(false);
	const [editFolderTitle, setEditFolderTitle] = useState("");
	const [editFolderEmoji, setEditFolderEmoji] = useState(false);
	const [editFolderDescription, setEditFolderDescription] = useState("");
	const [editFolderDescriptionMode, setEditFolderDescriptionMode] = useState(false);
	const [windowWidthCheck, setWindowWidthCheck] = useState(false);
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
		return () => document.removeEventListener("mousedown", closeWidowWidthWarning);
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

	const handleEditAppearing = () => {
		setEditAppear(true);
	};

	const handleEditDisappearing = () => {
		setEditAppear(false);
	};

	const handleActivateFolderTitleEdit = () => {
		setEditFolderTitleMode(!editFolderTitleMode);
		setEditAppear(false);
	};

	const handleFolderTitleEdit = () => {
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

	const handleActivateFolderDescriptionEdit = () => {
		setEditFolderDescriptionMode(!editFolderDescriptionMode);
	};

	const handleFolderDescriptionEdit = () => {
		if (editFolderDescription) {
			todolistFolders.updatingFolderDescription(todolistFolder.id, editFolderDescription);
			setEditFolderDescriptionMode(false);
			setEditFolderDescription("");
		}
	};

	return (
		<>
			<div className="flex flex-col gap-7 w-full 2xl:w-[70%] h-auto">
				<button onClick={null} className="base-btn w-fit flex justify-start items-center gap-3">
					<h1 className={`text-white`}>Add Todo</h1>
					<div className="flex justify-center items-center relative">
						<Image className="w-auto h-[20px]" src={"/icons/plus-white.svg"} alt="" width={20} height={20} />
					</div>
				</button>
				<div className="w-full h-auto flex flex-col justify-center items-start gap-3">
					<div className="flex justify-between items-center gap-2 w-full">
						<div className="flex justify-start items-center gap-5 w-full">
							<div
								onMouseOver={handleEditAppearing}
								onMouseLeave={handleEditDisappearing}
								className={`flex flex-col justify-start items-start gap-2 ${editFolderTitleMode ? "w-full" : "w-fit"}`}
							>
								<div className="flex flex-col justify-start items-start gap-3 w-full">
									{editFolderTitleMode ? (
										<input
											className={`border-none w-full rounded-md px-3 py-2 ${
												user.themeColor ? "text-white bg-[#333]" : "text-black bg-gray-200"
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
										<div className="flex justify-center items-center gap-2">
											<button onClick={handleFolderTitleEdit} className="base-btn">
												change
											</button>
											<button onClick={handleActivateFolderTitleEdit} className="base-btn !bg-red-500">
												cancel
											</button>
										</div>
									</>
								)}
							</div>
						</div>
						{windowWidthCheck &&
							createPortal(
								<>
									<div className="widow-width-warning fixed top-0 left-0 w-full h-fit px-2 py-3 flex justify-center items-center text-white bg-yellow-600 z-50 text-center">
										<p>
											{user.username}, you can only add emojis on devices with a width of {'"455"'} or higher
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
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<textarea
								className={`border-none rounded-md px-3 py-2 w-full min-h-[66px] h-[66px] max-h-[250px] ${
									user.themeColor ? "text-white bg-[#333]" : "text-black bg-gray-200"
								}`}
								onChange={(e) => setEditFolderDescription(e.target.value)}
								type="text"
								name="folder-description"
								placeholder={todolistFolder.folderDescription}
							></textarea>
							<div className="flex justify-center items-center gap-2">
								<button onClick={handleFolderDescriptionEdit} className="base-btn">
									change
								</button>
								<button onClick={handleActivateFolderDescriptionEdit} className="base-btn !bg-red-500">
									cancel
								</button>
							</div>
						</div>
					) : (
						<div
							onMouseOver={() => setEditAppearDescription(true)}
							onMouseLeave={() => setEditAppearDescription(false)}
							className="flex flex-col justify-start items-start gap-2"
						>
							<p className="text-btn" onClick={handleActivateFolderDescriptionEdit}>
								{todolistFolder.folderDescription}
							</p>
						</div>
					)}
				</div>
				{<TodolistPlaceholder />}
			</div>
		</>
	);
}
