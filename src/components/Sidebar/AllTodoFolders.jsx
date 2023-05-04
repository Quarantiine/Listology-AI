import Image from "next/image";
import React, { useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";

export default function AllTodoFolders({
	todolistFolders,
	todoFolder,
	user,
	index,
	setClickedTodoFolder,
	todoFolderDeletionRef,
	handleDeletionIndicator,
}) {
	const { todoLists } = FirebaseApi();
	const { setOpenTodolistSidebar } = useContext(StateCtx);
	const [todoFolderComplete, setTodoFolderComplete] = useState(true);
	const [todoFolderCompleteIndicator, setTodoFolderCompleteIndicator] = useState(false);
	const todoFolderCompleteRef = useRef();

	const handleCompletionIndicator = () => {
		if (!todoFolder.completed) {
			setTodoFolderCompleteIndicator(true);
			todoFolderCompleteRef.current = setTimeout(() => {
				setTodoFolderCompleteIndicator(false);
			}, 2000);
		} else {
			setTodoFolderCompleteIndicator(false);
		}
	};

	const handleCompletion = () => {
		clearTimeout(todoFolderCompleteRef.current);
		todolistFolders.updatingCompletion(todoFolder.id, todoFolderComplete);
	};

	const handleDeletion = () => {
		todolistFolders.deletingTodoFolder(todoFolder.id);
		todoLists.allTodoLists
			.filter((value) => value.folderID === todoFolder.id && auth.currentUser.uid === value.userID)
			?.map((todoList) => todoLists.deletingTodolist(todoList.id));
		setOpenTodolistSidebar(false);
		setClickedTodoFolder("");
		clearTimeout(todoFolderDeletionRef.current);
	};

	const handleClickedTodoFolder = () => {
		setClickedTodoFolder(todoFolder.id);
	};

	return (
		<>
			<div className="flex justify-between items-center gap-2">
				{todoFolderCompleteIndicator &&
					createPortal(
						<>
							<div className="fixed top-0 left-0 w-full h-fit py-3 flex justify-center items-center text-white bg-green-500 z-50">
								<p>Completed Todo Folder: {todoFolder.folderTitle}</p>
							</div>
						</>,
						document.body
					)}
				<p className={`text-sm ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}>{index + 1}</p>
				<button
					onClick={handleClickedTodoFolder}
					className="flex text-btn justify-start items-center gap-1 w-full text-start"
				>
					<h1 className="line-clamp-1 w-36" title={todoFolder.folderTitle}>
						{todoFolder.folderTitle}
					</h1>
					<h1>
						{todoFolder.folderEmoji ? (
							todoFolder.folderEmoji
						) : (
							<>
								<div className="w-4 h-4 rounded-full bg-gray-400" />
							</>
						)}
					</h1>
				</button>
				<div className="flex justify-center items-center gap-2">
					<button
						onClick={() => {
							handleCompletion();
							handleCompletionIndicator();
							setTodoFolderComplete(!todoFolderComplete);
						}}
					>
						<Image
							className="w-auto h-[18px]"
							src={
								todoFolder.completed
									? "/icons/completed-folder.svg"
									: user.themeColor
									? "/icons/checkbox-empty-white.svg"
									: "/icons/checkbox-empty-black.svg"
							}
							alt="selector"
							width={20}
							height={20}
						/>
					</button>
					<button
						onClick={() => {
							handleDeletion();
							handleDeletionIndicator();
						}}
					>
						<Image className="w-auto h-[18px]" src={"/icons/trash.svg"} alt="trash" width={20} height={20} />
					</button>
				</div>
			</div>
		</>
	);
}
