import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useReducer, useRef, useState } from "react";
import shortenUrl from "shorten-url";

const moreReducer = (state, { payload, type }) => {
	switch (type) {
		case "more-dropdown":
			return {
				...state,
				[payload.key]: payload.value,
			};
		default:
			console.log(`Unknown Value/Type`);
	}
};

export default function SubTodos({
	subTodo,
	todolist,
	user,
	todoLists,
	closeSubTodos,
}) {
	const [moreState, moreDispatch] = useReducer(moreReducer, {
		subTodoDropdown: "",
	});
	const [openMoreDropdown, setOpenMoreDropdown] = useState(false);
	const [subTodoText, setSubTodoText] = useState("");
	const [editTextActive, setEditTextActive] = useState(false);
	const [openLinkDropdown, setOpenLinkDropdown] = useState(false);
	const [deletedSubTodo, setDeletedSubTodo] = useState("");
	let [deletionIntervals, setDeletionIntervals] = useState(5000);

	const deleteDelay = useRef();
	const deleteDelayInterval = 5000;
	const deletionSetInterval = useRef();
	const editTextActiveRef = useRef();
	const todoIndicator = useRef();
	const linkPattern = /(https?:\/\/[^\s]+)/;

	useEffect(() => {
		const closeSubTodoTextEdit = (e) => {
			if (!e.target.closest(".input-todo-text")) {
				setEditTextActive(false);
			}
		};

		document.addEventListener("mousedown", closeSubTodoTextEdit);
		return () =>
			document.removeEventListener("mousedown", closeSubTodoTextEdit);
	}, [editTextActive]);

	const handleCompletedTodo = () => {
		todoLists.updatingSubTodoCompleted(subTodo.id, !subTodo.completed);
	};

	const handleEditTextActive = () => {
		setEditTextActive(!editTextActive);
		setTimeout(() => {
			editTextActiveRef.current?.focus();
		}, 10);
	};

	const handleChangeEditText = () => {
		if (subTodoText) {
			setSubTodoText("");
			setEditTextActive(false);
			todoLists.updatingSubTodoEdit(subTodo.id, subTodoText);
		}
	};

	const handleKeyedChangeEditText = (e) => {
		if (e.key === "Enter") {
			handleChangeEditText();
			setSubTodoText("");
		}
	};

	const handleFavorited = () => {
		todoLists.updatingSubTodoFavorite(subTodo.id, !subTodo.favorited);
	};

	const handleDeletionInterval = () => {
		clearInterval(deletionSetInterval.current);

		deletionSetInterval.current = setInterval(() => {
			setDeletionIntervals((deletionIntervals -= 1000));
		}, 1000);
	};

	// const handleDeleteTodo = () => {
	// 	setDeletedSubTodo(subTodo.todo);
	// 	clearTimeout(deleteDelay.current);

	// 	handleDeletionInterval();

	// 	deleteDelay.current = setTimeout(() => {
	// 		clearInterval(deletionSetInterval.current);
	// 		setDeletedSubTodo("");
	// 		0todoLists.deletingSubTodo(subTodo.id);
	// 	}, deleteDelayInterval);
	// };

	const handleDeleteTodo = () => {
		todoIndicator.current = subTodo.todo;

		todoLists.updatingSubTodoDeletionIndicator(
			subTodo.id,
			todoIndicator.current ? true : false
		);
		clearTimeout(deleteDelay.current);

		handleDeletionInterval();

		deleteDelay.current = setTimeout(() => {
			clearInterval(deletionSetInterval.current);
			todoLists.deletingSubTodo(subTodo.id);
		}, deleteDelayInterval);
	};

	const handleCancelDeletion = () => {
		todoIndicator.current = "";
		todoLists.updatingSubTodoDeletionIndicator(subTodo.id, false);
		setDeletedSubTodo("");
		setDeletionIntervals(5000);
		clearInterval(deletionSetInterval.current);
		clearTimeout(deleteDelay.current);
	};

	function extractLink() {
		var pattern = /(https?:\/\/[^\s]+)/;
		var matches = subTodo.todo.match(pattern);

		if (matches && matches.length > 0) {
			return matches[0];
		}
		return null;
	}

	const handleLinkDropdown = () => {
		if (!subTodo.completed && !todolist.completed)
			setOpenLinkDropdown(!openLinkDropdown);
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

	const handleMoreDispatch = (key, value) => {
		moreDispatch({
			type: "more-dropdown",
			payload: {
				key: key,
				value: value,
			},
		});
	};

	const handleOpenMoreDropdown = () => {
		setOpenMoreDropdown(!openMoreDropdown);

		if (openMoreDropdown) {
			moreDispatch({
				type: "more-dropdown",
				payload: {
					key: "todoDropdown",
					payload: false,
				},
			});
		}
	};

	useEffect(() => {
		const closeMoreDropdown = (e) => {
			if (!e.target.closest(".more-dropdown")) {
				setOpenMoreDropdown(false);
				moreDispatch({
					type: "more-dropdown",
					payload: {
						key: "todoDropdown",
						payload: false,
					},
				});
			}
		};

		document.addEventListener("mousedown", closeMoreDropdown);
		return () => document.removeEventListener("mousedown", closeMoreDropdown);
	}, []);

	const copyTodoText = () => {
		navigator.clipboard.writeText(subTodo.todo);
		setOpenMoreDropdown(!openMoreDropdown);
	};

	return (
		<>
			<div
				className={`flex flex-col sm:flex-row justify-start items-center gap-0 rounded-lg w-[90%] lg:w-[95%] ml-auto relative ${
					subTodo.favorited || todolist.favorited
						? user.themeColor
							? "bg-[#292929]"
							: "bg-[#eee]"
						: ""
				} ${closeSubTodos ? "h-0 overflow-hidden" : "px-2 py-1"} ${
					subTodo.deletionIndicator
						? "bg-gradient-to-r from-transparent to-[#ef2b2b51]"
						: ""
				}`}
			>
				<div className={`absolute top-0 left-0 w-1 h-full bg-[#0E51FF]`} />

				<div className="w-full h-auto flex justify-start items-center gap-3">
					<button
						className="min-w-[18px] max-w-[18px]"
						onClick={handleCompletedTodo}
					>
						<Image
							className="w-auto h-[20px]"
							src={
								subTodo.completed || todolist.completed
									? "/icons/completed-todo.svg"
									: user.themeColor
									? "/icons/checkbox-empty-white.svg"
									: "/icons/checkbox-empty-black.svg"
							}
							alt="checkbox"
							width={25}
							height={25}
						/>
					</button>

					{openLinkDropdown && extractLink() && (
						<>
							<div
								className={`link-dropdown relative w-fit h-fit px-3 py-1 rounded-md border z-50 flex ml-auto justify-center items-start gap-1 bg-[#0E51FF] text-white text-sm`}
							>
								<Link
									href={extractLink()}
									target="_blank"
									onClick={() => {
										handleLinkDropdown();
									}}
									className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
										subTodo.completed || todolist.completed
											? "line-through select-all"
											: ""
									}`}
								>
									<span>Link</span>
								</Link>
								<button
									onClick={handleEditTextActive}
									className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
										subTodo.completed || todolist.completed
											? "line-through select-all"
											: ""
									}`}
								>
									<span>Edit</span>
								</button>
							</div>
						</>
					)}

					{!deletedSubTodo &&
					editTextActive &&
					!subTodo.completed &&
					!todolist.completed ? (
						<div className="flex justify-start items-center gap-2 w-full">
							<textarea
								ref={editTextActiveRef}
								onChange={(e) => setSubTodoText(e.target.value)}
								onKeyDown={handleKeyedChangeEditText}
								className={`input-todo-text outline-none block lg:hidden border-none w-full rounded-md px-3 py-2 h-[40px] ${
									user.themeColor
										? "text-white bg-[#333]"
										: "text-black bg-gray-200"
								}`}
								type="text"
								placeholder={subTodo.todo}
							/>
							<input
								ref={editTextActiveRef}
								onChange={(e) => setSubTodoText(e.target.value)}
								onKeyDown={handleKeyedChangeEditText}
								className={`input-todo-text outline-none hidden lg:block border-none w-full rounded-md px-3 py-2 h-[40px] ${
									user.themeColor
										? "text-white bg-[#333]"
										: "text-black bg-gray-200"
								}`}
								type="text"
								placeholder={subTodo.todo}
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
					) : linkPattern.test(subTodo.todo) ? (
						<>
							<button
								onClick={handleLinkDropdown}
								title={"Go to link"}
								className={`text-btn w-full text-start no-underline line-clamp-1 flex flex-wrap items-start gap-1 ${
									subTodo.completed && "line-through select-all"
								}`}
							>
								<p className={`${subTodo.completed && "line-through"}`}>
									{subTodo.todo.replace(extractLink(), "")}{" "}
									<span className="text-[#0E51FF]">
										{shortenUrl(extractLink(), -30)
											.replace("", "(Link)")
											.slice(0, 6)}
									</span>
								</p>
							</button>
						</>
					) : (
						<p
							onClick={handleEditTextActive}
							className={`text-btn w-full ${
								subTodo.completed || todolist.completed
									? "line-through select-all"
									: ""
							}`}
						>
							{subTodo.todo}
						</p>
					)}
				</div>

				<div className="flex w-[100px] justify-end items-center gap-3 ml-auto">
					{/* {deletedSubTodo === subTodo.todo && (
						<>
							<p className="text-lg">
								{deletionIntervals.toString().replace("000", "")}
							</p>
							<button
								onClick={handleCancelDeletion}
								className="flex justify-center items-center"
							>
								{user.themeColor ? (
									<Image
										className="min-w-[25px] min-h-[25px]"
										src={"/icons/undo-white.svg"}
										alt="undo"
										width={30}
										height={30}
									/>
								) : (
									<Image
										className="min-w-[25px] min-h-[25px]"
										src={"/icons/undo-black.svg"}
										alt="undo"
										width={30}
										height={30}
									/>
								)}
							</button>
						</>
					)} */}
					{subTodo.deletionIndicator && deletionIntervals === 5000 && (
						<p className="text-white text-sm">Deleting...</p>
					)}

					{subTodo.deletionIndicator && deletionIntervals !== 5000 && (
						<>
							<p>{deletionIntervals.toString().replace("000", "")}</p>
							<button
								onClick={handleCancelDeletion}
								className="flex justify-center items-center rounded-full"
							>
								{user.themeColor ? (
									<Image
										className="min-w-[25px] min-h-[25px]"
										src={"/icons/undo-white.svg"}
										alt="undo"
										width={30}
										height={30}
									/>
								) : (
									<Image
										className="min-w-[25px] min-h-[25px]"
										src={"/icons/undo-black.svg"}
										alt="undo"
										width={30}
										height={30}
									/>
								)}
							</button>
						</>
					)}

					<>
						{!editTextActive && deletionIntervals === 5000 && (
							<div className="w-fit h-auto relative">
								<button className="min-w-[25px] text-btn relative flex justify-center items-center">
									<Image
										onClick={handleOpenMoreDropdown}
										className="w-auto h-[25px] text-btn"
										src={
											user.themeColor
												? "/icons/more-white.svg"
												: "/icons/more-black.svg"
										}
										alt="favorite"
										width={30}
										height={30}
									/>
								</button>

								{openMoreDropdown && (
									<div
										onMouseLeave={() => null}
										className="more-dropdown absolute w-[130px] h-fit rounded-md flex flex-col justify-center items-center gap-1 top-8 left-0 bg-white text-sm text-black border shadow-md z-10"
									>
										<button
											onClick={() => {
												handleMoreDispatch("todoDropdown", "");
												copyTodoText();
											}}
											className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full rounded-md"
										>
											Copy Text
										</button>

										{/* <button
											onClick={(e) =>
												handleMoreDispatch("todoDropdown", e.target.textContent)
											}
											className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full rounded-t-md"
										>
											Todo Difficulty
										</button>
										<button
											onClick={(e) =>
												handleMoreDispatch("todoDropdown", e.target.textContent)
											}
											className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full"
										>
											Time Created
										</button> */}
									</div>
								)}
							</div>
						)}
					</>

					<>
						{subTodo.favorited ? (
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

					{/* <Image
						onClick={deletionIntervals !== 5000 ? null : handleDeleteTodo}
						className={`w-auto h-[18px] ${
							deletionIntervals !== 5000
								? "cursor-not-allowed opacity-50"
								: "text-btn"
						}`}
						src={"/icons/trash.svg"}
						alt="trash"
						width={20}
						height={20}
					/> */}
					<Image
						onClick={subTodo.deletionIndicator ? null : handleDeleteTodo}
						className={`w-auto h-[18px] ${
							subTodo.deletionIndicator
								? "cursor-not-allowed opacity-50"
								: "text-btn"
						}`}
						src={"/icons/trash.svg"}
						alt="trash"
						width={20}
						height={20}
					/>
				</div>
			</div>
		</>
	);
}
