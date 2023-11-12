import React, { useContext, useEffect, useRef, useState } from "react";
import { UserCredentialCtx } from "../../pages";
import Image from "next/image";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import { createPortal } from "react-dom";
import TodolistSidebarModal from "./TodolistSidebarModal";
import TodoListFoldersPlaceholder from "./TodoListFoldersPlaceholder";
import AllTodoFolders from "./AllTodoFolders";

export default function TodolistSidebar() {
	const { auth, todolistFolders, folders } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const {
		clickedFolder,
		openTodolistSidebarModal,
		setOpenTodolistSidebarModal,
		handleCreateTodos,
		handleCreateFolder,
	} = useContext(StateCtx);
	const { openTodolistSidebar, setOpenTodolistSidebar, setClickedTodoFolder } =
		useContext(StateCtx);
	const [todoFolderDeletionIndicator, setTodoFolderDeletionIndicator] =
		useState(false);
	const [
		todoFolderDeletionIndicatorNumber,
		setTodoFolderDeletionIndicatorNumber,
	] = useState(0);
	const [windowWidthCheck, setWindowWidthCheck] = useState(false);
	const todoFolderDeletionRef = useRef();
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		window.innerWidth < 768
			? setWindowWidthCheck(true)
			: setWindowWidthCheck(false);
		window.addEventListener("resize", () => {
			window.innerWidth < 768
				? setWindowWidthCheck(true)
				: setWindowWidthCheck(false);
		});
	}, [windowWidthCheck]);

	useEffect(() => {
		const closeTodoListSidebar = (e) => {
			if (!e.target.closest(".todolist-sidebar")) {
				setOpenTodolistSidebar(false);
			}
		};

		document.addEventListener("mousedown", closeTodoListSidebar);
		return () =>
			document.removeEventListener("mousedown", closeTodoListSidebar);
	}, [setOpenTodolistSidebar]);

	const handleTodolistSidebar = () => {
		setOpenTodolistSidebar(!openTodolistSidebar);
	};

	const handleDeletionIndicator = () => {
		setTodoFolderDeletionIndicator(true);
		setTodoFolderDeletionIndicatorNumber(todoFolderDeletionIndicatorNumber + 1);
		todoFolderDeletionRef.current = setTimeout(() => {
			setTodoFolderDeletionIndicator(false);
			setTodoFolderDeletionIndicatorNumber(0);
		}, 4000);
	};

	return (
		<>
			<div
				className={`todolist-sidebar z-40 transition-colors duration-300 shadow-[10px_0px_20px_0px_rgba(0,0,0,0.1)] flex flex-col justify-start items-start p-7 absolute top-0 left-0 sm:left-[280px] min-w-[280px] max-w-[280px] h-full border-r-2 gap-5 ${
					user.themeColor ? "bg-[#222] text-white" : "bg-white text-black"
				} ${user.themeColor ? "border-[#333]" : "border-gray-200"} `}
			>
				<div className="flex justify-between items-start gap-2 w-full">
					<div className="flex flex-col justify-start items-start">
						<>
							<h1 className="text-2xl font-semibold">Todo Folders</h1>
							{folders.allFolders
								?.filter(
									(value) =>
										value.folderName === clickedFolder &&
										value.userID === auth.currentUser?.uid
								)
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
						</>
					</div>
					<div className="flex justify-center items-center gap-2 pt-1">
						{!windowWidthCheck ? (
							<button
								onClick={handleCreateTodos}
								className="min-w-[20px] max-w-[20px] flex justify-center items-center relative"
							>
								<Image
									className="w-auto h-[20px]"
									src={
										user.themeColor
											? "/icons/plus-white.svg"
											: "/icons/plus-black.svg"
									}
									alt="add"
									width={20}
									height={20}
								/>
							</button>
						) : (
							<button
								onClick={handleCreateFolder}
								className="min-w-[20px] max-w-[20px] flex justify-center items-center relative"
							>
								<Image
									className="w-auto h-[20px]"
									src={
										user.themeColor
											? "/icons/plus-white.svg"
											: "/icons/plus-black.svg"
									}
									alt="add"
									width={20}
									height={20}
								/>
							</button>
						)}

						<button
							className="min-w-[20px] max-w-[20px] relative text-btn"
							onClick={handleTodolistSidebar}
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
				</div>

				<div className="w-full h-fit hidden md:block">
					<TodoListFolderSearchBar
						user={user}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
				</div>

				{todoFolderDeletionIndicator &&
					createPortal(
						<>
							<div className="fixed top-0 left-0 w-full h-fit py-3 flex justify-center items-center text-white bg-red-500 z-50">
								<p>Deleted Todo Folders: {todoFolderDeletionIndicatorNumber}</p>
							</div>
						</>,
						document.body
					)}
				<div className="todo-list-folders-overflow flex flex-col justify-start items-start gap-1 w-full overflow-y-scroll overflow-x-hidden">
					{todolistFolders.allTodoFolders
						?.map((value) => value.userID === auth.currentUser?.uid)
						.includes(true)
						? todolistFolders.allTodoFolders
								.filter(
									(value) =>
										value.userID === auth.currentUser?.uid &&
										value.folderName === clickedFolder
								)
								?.map((todoFolder, index) => {
									if (todoFolder.userID === auth.currentUser?.uid) {
										if (
											todoFolder.folderTitle
												.normalize("NFD")
												.replace(/\p{Diacritic}/gu, "")
												.toLowerCase()
												.includes(searchQuery.toLowerCase())
										) {
											return (
												<AllTodoFolders
													key={todoFolder.id}
													todolistFolders={todolistFolders}
													todoFolder={todoFolder}
													user={user}
													index={index}
													setClickedTodoFolder={setClickedTodoFolder}
													todoFolderDeletionIndicator={
														todoFolderDeletionIndicator
													}
													setTodoFolderDeletionIndicator={
														setTodoFolderDeletionIndicator
													}
													todoFolderDeletionRef={todoFolderDeletionRef}
													handleDeletionIndicator={handleDeletionIndicator}
													pin={todoFolder.pin}
												/>
											);
										}
									}
								})
						: null}
					{!todolistFolders.allTodoFolders
						?.slice(0)
						?.filter((value) => value.userID === auth.currentUser?.uid)
						?.map(
							(todolistFolder) => todolistFolder.folderName === clickedFolder
						)
						.includes(true) && <TodoListFoldersPlaceholder />}
				</div>
				{openTodolistSidebarModal &&
					createPortal(
						<TodolistSidebarModal
							setOpenTodolistSidebarModal={setOpenTodolistSidebarModal}
						/>,
						document.body
					)}
			</div>
		</>
	);
}

const TodoListFolderSearchBar = ({ user, searchQuery, setSearchQuery }) => {
	return (
		<>
			<div className="w-full h-auto flex justify-start items-center gap-3 relative">
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
					className={`w-full pl-10 pr-2 py-1 rounded-md outline-none ${
						user.themeColor ? "bg-[#333] text-white" : "bg-[#eee] text-black"
					}`}
					type="search"
					name="search"
					onChange={(e) => setSearchQuery(e.target.value)}
					value={searchQuery}
				/>
			</div>
		</>
	);
};
