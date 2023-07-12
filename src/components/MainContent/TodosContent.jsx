import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import SubTodos from "../MainContent/SubTodos";
import Link from "next/link";
import shortenUrl from "shorten-url";
import { createPortal } from "react-dom";

export default function TodosContent({
	todoLists,
	todolist,
	folders,
	todolistFolder,
}) {
	const { auth } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const { clickedFolder, clickedTodoFolder } = useContext(StateCtx);
	const [todoText, setTodoText] = useState("");
	const [editTextActive, setEditTextActive] = useState(false);
	const editTextActiveRef = useRef();
	const [subTodoButtonAppear, setSubTodoButtonAppear] = useState(false);
	const [closeSubTodos, setCloseSubTodos] = useState(false);
	const [openLinkDropdown, setOpenLinkDropdown] = useState(false);
	const [deletedTodo, setDeletedTodo] = useState("");
	const deleteDelay = useRef();
	const deleteDelayInterval = 5000;
	const linkPattern = /(https?:\/\/[^\s]+)/;

	useEffect(() => {
		const closeTodoTextEdit = (e) => {
			if (!e.target.closest(".input-todo-text")) {
				setEditTextActive(false);
			}
		};

		document.addEventListener("mousedown", closeTodoTextEdit);
		return () => document.removeEventListener("mousedown", closeTodoTextEdit);
	}, [editTextActive]);

	const handleCompletedTodo = () => {
		todoLists.updatingTodolistCompleted(todolist.id, !todolist.completed);
	};

	const handleEditTextActive = () => {
		setEditTextActive(!editTextActive);
		setTimeout(() => {
			editTextActiveRef.current?.focus();
		}, 10);
	};

	const handleChangeEditText = () => {
		if (todoText) {
			setEditTextActive(false);
			todoLists.updatingTodolist(todolist.id, todoText);
		}
	};

	const handleKeyedChangeEditText = (e) => {
		if (e.key === "Enter") {
			handleChangeEditText();
		}
	};

	const handleFavorited = () => {
		todoLists.updatingTodolistFavorite(todolist.id, !todolist.favorited);
	};

	const handleDeleteTodo = () => {
		clearTimeout(deleteDelay.current);
		setDeletedTodo(todolist.todo);

		deleteDelay.current = setTimeout(() => {
			setDeletedTodo("");
			todoLists.deletingTodolist(todolist.id);

			todoLists.allSubTodos
				.filter(
					(value) =>
						value.todoID === todolist.id &&
						auth.currentUser.uid === value.userID
				)
				?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));
		}, deleteDelayInterval);
	};

	const handleCancelDeletion = () => {
		setDeletedTodo("");
		clearTimeout(deleteDelay.current);
	};

	const handleCreateSubTodo = () => {
		todoLists.addSubTodo(
			folders.allFolders
				?.filter((value) => value.folderName === clickedFolder)
				.slice(0, 1)
				?.map((folder) => folder.folderName),
			todolistFolder.id,
			todolist.id
		);
	};

	const handleCloseSubTodos = () => {
		setCloseSubTodos(!closeSubTodos);
	};

	function extractLink() {
		var pattern = /(https?:\/\/[^\s]+)/;
		var matches = todolist.todo.match(pattern);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		return null;
	}

	const handleLinkDropdown = () => {
		if (!todolist.completed) setOpenLinkDropdown(!openLinkDropdown);
	};

	useEffect(() => {
		const closeLinkDropdown = (e) => {
			if (!e.target.closest(".link-dropdown")) {
				setOpenLinkDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeLinkDropdown);
		return () => document.removeEventListener("mousedown", closeLinkDropdown);
	}, []);

	return (
		<div className="flex flex-col w-full">
			{deletedTodo === todolist.todo &&
				createPortal(
					<>
						<div className="sm:max-w-[60%] w-[90%] sm:w-fit px-3 py-2 h-fit rounded-md absolute bottom-5 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-5 bg-red-500 text-white flex justify-center items-center text-center gap-4 border border-red-300">
							<p>{}</p>
							<p>
								Undo Deletion of:{" "}
								<span className="underline italic">{deletedTodo}</span>
							</p>
							<button
								onClick={handleCancelDeletion}
								className="flex justify-center items-center"
							>
								<Image
									className="w-auto min-h-[25px] min-w-[25px] max-h-[25px] max-w-[25px]"
									src={"/icons/undo.svg"}
									alt="undo"
									width={30}
									height={30}
								/>
							</button>
						</div>
					</>,
					document.body
				)}

			<div
				onMouseOver={() => setSubTodoButtonAppear(true)}
				onMouseLeave={() =>
					openLinkDropdown ? null : setSubTodoButtonAppear(false)
				}
				className={`flex justify-start items-center gap-3 w-full rounded-lg px-2 py-1 relative ${
					deletedTodo === todolist.todo ? "bg-[#ef2b2b51]" : ""
				} ${
					todolist.favorited
						? user.themeColor
							? "bg-[#292929]"
							: "bg-[#eee]"
						: ""
				}`}
			>
				{todoLists?.allSubTodos
					?.filter(
						(value) =>
							value.folderID === todolistFolder.id &&
							value.userID === auth.currentUser.uid &&
							value.todoID === todolist.id
					)
					.map((subTodo) => subTodo.todoID === todolist.id)
					.includes(true) && (
					<div
						className={`absolute top-0 left-0 w-1 h-full ${
							user.themeColor ? "bg-[#444]" : "bg-[#ccc]"
						}`}
					/>
				)}

				<div className="relative flex flex-col lg:flex-row justify-center items-center gap-2">
					<button
						className="min-w-[18px] max-w-[18px]"
						onClick={handleCompletedTodo}
					>
						<Image
							className="w-auto h-[20px]"
							src={
								todolist.completed
									? "/icons/completed-todo.svg"
									: user.themeColor
									? "/icons/checkbox-empty-white.svg"
									: "/icons/checkbox-empty-black.svg"
							}
							alt=""
							width={25}
							height={25}
						/>
					</button>

					<button
						className={`lg:pr-1 transition-all duration-300 ${
							subTodoButtonAppear ? "opacity-100" : "opacity-100 lg:opacity-0"
						}`}
						onClick={null}
					>
						<div
							className={`w-auto h-auto ${
								deletedTodo ? "cursor-not-allowed opacity-50" : ""
							}`}
							onClick={deletedTodo ? null : handleCreateSubTodo}
						>
							{user.themeColor ? (
								<Image
									className="min-w-[20px] max-w-[20px] h-[20px]"
									src={"/icons/add-todo-white.svg"}
									alt=""
									width={25}
									height={25}
								/>
							) : (
								<Image
									className="min-w-[20px] max-w-[20px] h-[20px]"
									src={"/icons/add-todo-black.svg"}
									alt=""
									width={25}
									height={25}
								/>
							)}
						</div>
					</button>
				</div>

				<div className="w-full h-auto flex flex-col sm:flex-row justify-start items-center">
					<div className="w-full h-fit relative flex justify-start items-center gap-3">
						{editTextActive && !todolist.completed ? (
							<div className="flex justify-start items-center gap-2 w-full">
								<textarea
									ref={editTextActiveRef}
									onChange={(e) => setTodoText(e.target.value)}
									onKeyDown={handleKeyedChangeEditText}
									className={`input-todo-text border-none w-full rounded-md px-3 py-2 h-[40px] ${
										user.themeColor
											? "text-white bg-[#333]"
											: "text-black bg-gray-200"
									}`}
									type="text"
									placeholder={todolist.todo}
								/>
								<div className="input-todo-text flex flex-col sm:flex-row justify-center items-center gap-2">
									<button onClick={handleChangeEditText} className="base-btn">
										change
									</button>
									<button
										onClick={handleEditTextActive}
										className="base-btn !bg-red-500"
									>
										cancel
									</button>
								</div>
							</div>
						) : linkPattern.test(todolist.todo) ? (
							<>
								{openLinkDropdown && (
									<div
										className={`link-dropdown relative w-fit h-fit px-3 py-1 rounded-md border z-10 flex justify-center items-start gap-1 bg-[#0E51FF] text-white text-sm`}
									>
										<Link
											href={extractLink()}
											target="_blank"
											onClick={() => {
												handleLinkDropdown();
												setSubTodoButtonAppear(false);
											}}
											className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
												todolist.completed ? "line-through select-all" : ""
											}`}
										>
											<span>Link</span>
										</Link>
										<button
											onClick={handleEditTextActive}
											className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
												todolist.completed ? "line-through select-all" : ""
											}`}
										>
											<span>Edit</span>
										</button>
									</div>
								)}

								<button
									onClick={handleLinkDropdown}
									title={"Go to link"}
									className={`text-btn w-full text-start underline line-clamp-1 ${
										todolist.completed ? "line-through select-all" : ""
									} ${
										subTodoButtonAppear || openLinkDropdown
											? "translate-x-0"
											: "translate-x-0 lg:-translate-x-8"
									}`}
								>
									{todolist.todo.replace(extractLink(), "")}
									{shortenUrl(extractLink(), 0)}
								</button>
							</>
						) : (
							<p
								onClick={handleEditTextActive}
								className={`text-btn w-full ${
									todolist.completed ? "line-through select-all" : ""
								} ${
									subTodoButtonAppear || openLinkDropdown
										? "translate-x-0"
										: "translate-x-0 lg:-translate-x-8"
								}`}
							>
								{todolist.todo}
							</p>
						)}
					</div>

					<div className="flex w-20 justify-end items-center gap-3 ml-auto">
						<>
							{todolist.favorited ? (
								<button className="min-w-[20px] text-btn relative right-[1px] flex justify-center items-center">
									<Image
										onClick={handleFavorited}
										className="w-auto h-[20px] text-btn"
										src={
											user.themeColor
												? "/icons/favorite-white.svg"
												: "/icons/favorite-black.svg"
										}
										alt="favorite"
										width={25}
										height={25}
									/>
								</button>
							) : (
								<button
									className="text-btn flex justify-center items-center"
									onClick={handleFavorited}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="23"
										viewBox="0 96 960 960"
										width="23"
										fill={user.themeColor ? "white" : "black"}
									>
										<path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" />
									</svg>
								</button>
							)}
						</>
						<Image
							onClick={handleDeleteTodo}
							className="w-auto h-[18px] text-btn"
							src={"/icons/trash.svg"}
							alt="delete todos"
							width={20}
							height={20}
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-start items-center w-full relative">
				{todoLists?.allSubTodos
					?.filter(
						(value) =>
							value.folderID === todolistFolder.id &&
							value.userID === auth.currentUser.uid &&
							value.todoID === todolist.id
					)
					.map((subTodo) => subTodo.todoID === todolist.id)
					.includes(true) && (
					<button
						onClick={handleCloseSubTodos}
						className={`w-full h-fit p-1 rounded-md flex justify-start items-center gap-2 text-sm border ${
							user.themeColor
								? "bg-[#333] border-[#555]"
								: "bg-[#eee] border-[#ccc]"
						}`}
					>
						<p>{closeSubTodos ? "Show more" : "Close"}</p>
						<Image
							className={`w-[15px] h-auto text-btn ${
								closeSubTodos ? "" : "rotate-180"
							}`}
							src={
								user.themeColor
									? "/icons/arrow-white.svg"
									: "/icons/arrow-black.svg"
							}
							alt="delete todos"
							width={20}
							height={20}
						/>
					</button>
				)}
				{todoLists?.allSubTodos
					?.filter(
						(value) =>
							value.folderID === todolistFolder.id &&
							value.userID === auth.currentUser.uid
					)
					.map((subTodo) => {
						if (
							subTodo.folderID === clickedTodoFolder &&
							subTodo.todoID === todolist.id
						) {
							return (
								<React.Fragment key={subTodo.id}>
									<SubTodos
										subTodo={subTodo}
										user={user}
										todolist={todolist}
										todoLists={todoLists}
										closeSubTodos={closeSubTodos}
										deletedTodo={deletedTodo}
									/>
								</React.Fragment>
							);
						}
					})}
			</div>
		</div>
	);
}
