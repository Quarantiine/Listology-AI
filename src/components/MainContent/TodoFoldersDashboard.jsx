import React from "react";
import FirebaseApi from "../../pages/api/firebaseApi";

export default function TodoFoldersDashboard({
	todoFolder,
	user,
	setClickedFolder,
	setClickedTodoFolder,
	auth,
}) {
	const { todoLists } = FirebaseApi();

	const handleClickedTodoFolder = () => {
		setClickedFolder(todoFolder.folderName);
		setClickedTodoFolder(todoFolder.id);
	};

	return (
		<>
			<button
				onClick={() => {
					handleClickedTodoFolder();
				}}
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
}
