"use client";
import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";

export default function Placeholders({ user, todolistFolder }) {
	const { auth, todoLists } = FirebaseApi();
	const { clickedTodoFolder, filterState, completedTodos, todoSearchInput } =
		useContext(StateCtx);

	return (
		<>
			{/* Difficulty Main */}
			{!todoLists.allTodoLists
				?.filter((value) => value.userID === auth.currentUser?.uid)
				?.map(
					(todolist) =>
						(todolist.folderID === todolistFolder.senderTodoFolderID ||
							todolist.folderID === clickedTodoFolder) &&
						todolist.completed === false &&
						!todolist.ignoreTodo
				)
				.includes(true) &&
				!completedTodos &&
				filterState.filterCategories.value === "Difficulty" &&
				filterState.filterCategories.value2 === "" && (
					<div className="flex flex-col justify-start items-start gap-3 w-full">
						<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
							No To-dos
						</p>
					</div>
				)}

			{/* Favorites */}
			{!todoLists.allTodoLists
				?.filter((value) => value.userID === auth.currentUser?.uid)
				?.map(
					(todolist) =>
						(todolist.folderID === todolistFolder.senderTodoFolderID ||
							todolist.folderID === clickedTodoFolder) &&
						todolist.favorited === true &&
						todolist.completed === false
				)
				.includes(true) &&
				filterState.filterCategories === "Favorites" && (
					<div className="flex flex-col justify-start items-start gap-3 w-full">
						<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
							No Favorited To-dos
						</p>
					</div>
				)}

			<>
				{/* Difficulties */}
				{!todoLists.allTodoLists
					?.filter((value) => value.userID === auth.currentUser?.uid)
					?.map(
						(todolist) =>
							(todolist.folderID === todolistFolder.senderTodoFolderID ||
								todolist.folderID === clickedTodoFolder) &&
							todolist.difficulty?.includes("Easy") &&
							todolist.completed === false
					)
					.includes(true) &&
					filterState.filterCategories.value === "Difficulty" &&
					filterState.filterCategories.value2?.includes("Easy") && (
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
								No Easy To-dos
							</p>
						</div>
					)}

				{!todoLists.allTodoLists
					?.filter((value) => value.userID === auth.currentUser?.uid)
					?.map(
						(todolist) =>
							(todolist.folderID === todolistFolder.senderTodoFolderID ||
								todolist.folderID === clickedTodoFolder) &&
							todolist.difficulty?.includes("Intermediate") &&
							todolist.completed === false
					)
					.includes(true) &&
					filterState.filterCategories.value === "Difficulty" &&
					filterState.filterCategories.value2?.includes("Intermediate") && (
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
								No Intermediate Todos
							</p>
						</div>
					)}

				{!todoLists.allTodoLists
					?.filter((value) => value.userID === auth.currentUser?.uid)
					?.map(
						(todolist) =>
							(todolist.folderID === todolistFolder.senderTodoFolderID ||
								todolist.folderID === clickedTodoFolder) &&
							todolist.difficulty?.includes("Hard") &&
							todolist.completed === false
					)
					.includes(true) &&
					filterState.filterCategories.value === "Difficulty" &&
					filterState.filterCategories.value2?.includes("Hard") && (
						<div className="flex flex-col justify-start items-start gap-3 w-full">
							<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
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
							value.userID === auth.currentUser?.uid &&
							value.completed === completedTodos &&
							(value.folderID === todolistFolder.senderTodoFolderID ||
								value.folderID === clickedTodoFolder) &&
							value.todo
								.normalize("NFD")
								.replace(/\p{Diacritic}/gu, "")
								.toLowerCase()
								.includes(todoSearchInput.toLowerCase())
					)
					?.map((todolist) => todolist).length < 1 &&
				!completedTodos && (
					<div className="flex flex-col gap-2 justify-start items-start">
						<p
							className={`${user.themeColor ? "text-[#555]" : "text-gray-400"}`}
						>
							No To-dos Found
						</p>
					</div>
				)}

			{/* No Completed Todos */}
			{!todoLists.allTodoLists
				?.filter((value) => value.userID === auth.currentUser?.uid)
				?.map(
					(todolist) =>
						(todolist.folderID === todolistFolder.senderTodoFolderID ||
							todolist.folderID === clickedTodoFolder) &&
						todolist.completed === true &&
						todolist.todo
							.normalize("NFD")
							.replace(/\p{Diacritic}/gu, "")
							.toLowerCase()
							.includes(todoSearchInput.toLowerCase())
				)
				.includes(true) &&
				completedTodos && (
					<div className="flex flex-col justify-start items-start gap-2 w-full">
						<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>
							No Completed To-dos
						</p>
					</div>
				)}
		</>
	);
}
