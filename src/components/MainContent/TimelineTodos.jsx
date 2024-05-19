import Image from "next/image";
import Link from "next/link";
import React, {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";
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

export default function TimelineTodos({
	todolist,
	modifiedEndDate,
	modifiedStartDate,
}) {
	const { auth, todoLists } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const {
		setClickedFolder,
		setClickedTodoFolder,
		setCompletedTodos,
		setTodoSearchInput,
		setOpenTodoSearchInput,
	} = useContext(StateCtx);
	const [moreState, moreDispatch] = useReducer(moreReducer, {
		todoDropdown: "",
	});
	const [editTextActive, setEditTextActive] = useState(false);
	const [openLinkDropdown, setOpenLinkDropdown] = useState(false);
	const [deletedTodo, setDeletedTodo] = useState("");
	let [deletionIntervals, setDeletionIntervals] = useState(5000);
	const [openMoreDropdown, setOpenMoreDropdown] = useState(false);

	const deleteDelay = useRef();
	const deleteDelayInterval = 5000;
	const deletionSetInterval = useRef();
	const todoIndicator = useRef();
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
		todoLists.updatingMarkAsImportant(todolist.id, false);
	};

	const handleFavorited = () => {
		todoLists.updatingTodolistFavorite(todolist.id, !todolist.favorited);
	};

	const handleDeletionInterval = () => {
		clearInterval(deletionSetInterval.current);

		deletionSetInterval.current = setInterval(() => {
			setDeletionIntervals((deletionIntervals -= 1000));
		}, 1000);
	};

	const handleDeleteTodo = () => {
		todoIndicator.current = todolist.todo;

		todoLists.updatingDeletionIndicator(
			todolist.id,
			todoIndicator.current ? true : false
		);
		clearTimeout(deleteDelay.current);

		handleDeletionInterval();

		deleteDelay.current = setTimeout(() => {
			clearInterval(deletionSetInterval.current);
			todoLists.deletingTodolist(todolist.id);

			todoLists.allSubTodos
				.filter(
					(value) =>
						value.todoID === todolist.id &&
						auth.currentUser?.uid === value.userID
				)
				?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));
		}, deleteDelayInterval);
	};

	const handleCancelDeletion = () => {
		todoIndicator.current = "";
		todoLists.updatingDeletionIndicator(todolist.id, false);
		setDeletionIntervals(5000);
		clearInterval(deletionSetInterval.current);
		clearTimeout(deleteDelay.current);
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

	const handleMoreDispatch = (key, value) => {
		moreDispatch({
			type: "more-dropdown",
			payload: {
				key: key,
				value: value,
			},
		});
	};

	const createdTimeText = () => {
		// TODO: Add time here
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

		const timeMiliSec = todolist.createdTime?.seconds * 1000;
		const date = new Date(timeMiliSec);
		const month = date.getMonth();
		const day = date.getUTCDate();

		return `${timeMonths[month]}, ${day}`;
	};
	createdTimeText();

	const handleSetDifficulty = (difficulty) => {
		setOpenMoreDropdown(false);
		todoLists.updatingTodoDifficulty(todolist.id, difficulty);
	};

	const copyTodoText = () => {
		navigator.clipboard.writeText(todolist.todo);
		setOpenMoreDropdown(!openMoreDropdown);
	};

	const handleIgnoreTodo = () => {
		todoLists.updatingIgnoreTodo(
			todolist.id,
			todolist.ignoreTodo ? !todolist.ignoreTodo : true
		);

		todoLists.updatingTodolistFavorite(todolist.id, false);
		handleSetDifficulty("");
		setOpenMoreDropdown(!openMoreDropdown);
		todoLists.updatingTodoCompletionDates(todolist.id, "", "");
	};

	const handleMarkImportant = (markImportant) => {
		todolist.completed
			? null
			: todoLists.updatingMarkAsImportant(todolist.id, markImportant);
		setOpenMoreDropdown(false);
	};

	const handleTodoLocation = () => {
		setClickedFolder(todolist.mainFolder[0]);
		setClickedTodoFolder(todolist.folderID);
		setOpenMoreDropdown(false);
		setCompletedTodos(false);
		setTodoSearchInput(todolist.todo);
		setOpenTodoSearchInput(true);
	};

	const handleRemoveDate = () => {
		todoLists.updatingTodoCompletionDates(todolist.id, "", "");
	};

	const millisecondsPerDay = 24 * 60 * 60 * 1000;

	const currentDateTime = new Date().getTime();
	const endDateTime = new Date(todolist.endDate?.seconds * 1000);
	const startDateTime = new Date(todolist.startDate?.seconds * 1000);

	const differenceInEndMilliseconds = endDateTime - currentDateTime;
	const differenceInEndHours = (
		(differenceInEndMilliseconds / millisecondsPerDay) *
		24
	).toFixed(0);

	return (
		<div className="flex flex-col w-full h-auto">
			<div className="flex justify-start items-center gap-2">
				{startDateTime.getTime() > currentDateTime && (
					<p
						className={`text-sm ${
							user.themeColor ? "text-[#82a5fd]" : "text-[#0E51FF]"
						}`}
					>
						<span className="font-bold">Start:</span> {modifiedStartDate}
					</p>
				)}

				{startDateTime.getTime() < currentDateTime && (
					<div className="text-sm flex justify-start items-center gap-3">
						<p
							className={`${
								differenceInEndHours >= -1
									? "text-yellow-500"
									: user.themeColor
									? "text-[#888]"
									: "text-gray-400"
							} ${
								differenceInEndHours <= -1
									? "text-red-500"
									: user.themeColor
									? "text-[#888]"
									: "text-gray-400"
							}`}
						>
							{differenceInEndHours <= -1 ? (
								<span className="font-bold">Overdue: </span>
							) : (
								<span className="font-bold">Due: </span>
							)}
							{modifiedEndDate}
						</p>

						{differenceInEndHours <= -1 ? (
							""
						) : differenceInEndHours < 24 ? (
							<p>
								Hours Left (
								{Math.round(differenceInEndHours) < 1
									? "< 1h"
									: Math.round(differenceInEndHours)}
								)
							</p>
						) : (
							<p>Days Left ({Math.round(differenceInEndHours / 24)})</p>
						)}
					</div>
				)}
			</div>

			<div
				id={
					todolist.ignoreTodo === false
						? ""
						: todolist.ignoreTodo && "ignore-todo"
				}
				title={todolist.todo}
				className={`flex justify-start items-center gap-3 w-full rounded-lg px-2 py-1 relative transition-colors ${
					todolist.deletionIndicator
						? "bg-gradient-to-r from-transparent to-[#ef2b2b51]"
						: ""
				} ${
					todolist.ignoreTodo
						? "bg-[#0e52ff1f] ignore-todo"
						: todolist.favorited
						? user.themeColor
							? "bg-[#292929]"
							: "bg-[#eee]"
						: ""
				}`}
			>
				{todolist.ignoreTodo ? (
					<div className={`absolute top-0 left-0 w-1 h-full base-bg`} />
				) : (
					<div
						className={`absolute top-0 left-0 w-1 h-full ${
							todolist && todolist.difficulty === "Hard"
								? "bg-red-500"
								: todolist.difficulty === "Intermediate"
								? "bg-yellow-500"
								: todolist.difficulty === "Easy"
								? "bg-green-500"
								: user.themeColor
								? "bg-[#444]"
								: "bg-[#ccc]"
						}`}
					/>
				)}

				<div className="relative flex flex-col lg:flex-row justify-center items-center gap-2">
					{!todolist.ignoreTodo && (
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
								alt="completed"
								width={25}
								height={25}
							/>
						</button>
					)}
				</div>

				<div className="w-full h-auto flex flex-col sm:flex-row justify-start items-center">
					<div className="w-full h-fit relative flex justify-start items-center gap-3">
						{linkPattern.test(todolist.todo) && !todolist.completed ? (
							<>
								{!deletedTodo && openLinkDropdown && extractLink() && (
									<div
										className={`link-dropdown relative w-fit h-fit px-3 py-1 rounded-md border z-10 flex justify-center items-start gap-1 bg-[#0E51FF] text-white text-sm`}
									>
										<Link
											href={extractLink()}
											target="_blank"
											onClick={handleLinkDropdown}
											className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
												todolist.completed && "line-through select-all"
											}`}
										>
											<span>Link</span>
										</Link>
										<button
											onClick={handleTodoLocation}
											className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
												todolist.completed && "line-through select-all"
											}`}
										>
											<span>Todo</span>
										</button>
									</div>
								)}

								<button
									onClick={handleLinkDropdown}
									title={"Go to link"}
									className={`text-btn w-full text-start no-underline line-clamp-1 flex justify-start items-center gap-1 ${
										todolist.completed && "line-through select-all"
									}`}
								>
									<p className="w-full sm:w-[90%] line-clamp-1">
										{todolist.todo.replace(extractLink(), "")}{" "}
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
								onClick={handleTodoLocation}
								className={`text-btn w-full sm:w-[90%] line-clamp-1 ${
									todolist.completed && "line-through select-all"
								}`}
							>
								{todolist.todo}
							</p>
						)}
					</div>

					<div className="flex w-20 justify-end items-center gap-3 ml-auto">
						{todolist.deletionIndicator && deletionIntervals === 5000 && (
							<p className="text-white text-sm">Deleting...</p>
						)}

						{todolist.deletionIndicator && deletionIntervals !== 5000 && (
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
									<div className="more-dropdown absolute w-[140px] h-fit rounded-md flex flex-col justify-center items-center gap-1 top-8 -left-10 bg-white text-sm text-black border shadow-md z-10">
										<button
											onClick={() => {
												handleMoreDispatch("todoDropdown", "");
												copyTodoText();
											}}
											className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full rounded-t-md"
										>
											Copy Text
										</button>

										<button
											onClick={(e) =>
												todolist.ignoreTodo
													? null
													: handleMoreDispatch(
															"todoDropdown",
															e.target.textContent
													  )
											}
											className={`px-2 py-1  w-full ${
												todolist.ignoreTodo
													? "hover:bg-[#ccc] cursor-not-allowed"
													: "hover:bg-[#0E51FF] hover:text-white"
											}`}
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
										</button>

										{todolist.ignoreTodo && (
											<button
												onClick={() => {
													todolist.completed
														? null
														: handleMoreDispatch("todoDropdown", "");
													todolist.completed ? null : handleIgnoreTodo();
												}}
												className={`px-2 py-1 w-full ${
													todolist.completed
														? "cursor-not-allowed hover:bg-[#ccc]"
														: "hover:bg-[#0E51FF] hover:text-white"
												} ${
													todolist.ignoreTodo && "bg-[#0e52ff6b] text-black"
												}`}
											>
												{todolist.ignoreTodo ? "Undo Ignore" : "Ignore Todo"}
											</button>
										)}

										<div className="flex justify-center items-center gap-2 w-full">
											{todolist.markImportant ? (
												<button
													className={`px-2 py-1 w-full bg-[#0e52ff6b] text-black ${
														todolist.completed
															? "cursor-not-allowed hover:bg-[#ccc]"
															: "hover:bg-[#0E51FF] hover:text-white"
													}`}
													onClick={() => {
														handleMarkImportant(false);
													}}
												>
													Marked Important
												</button>
											) : (
												<button
													className={`px-2 py-1 w-full ${
														todolist.completed
															? "cursor-not-allowed hover:bg-[#ccc]"
															: "hover:bg-[#0E51FF] hover:text-white"
													}`}
													onClick={() => {
														handleMarkImportant(true);
													}}
												>
													Mark Important
												</button>
											)}
										</div>

										{todolist.startDate && todolist.endDate && (
											<button
												onClick={handleRemoveDate}
												className="px-2 py-1 bg-[#0e52ff6b] text-black hover:bg-[#0E51FF] hover:text-white w-full rounded-b-md"
											>
												Remove Date
											</button>
										)}

										{moreState.todoDropdown && (
											<div className="absolute top-40 left-0 w-full h-fit bg-white border rounded-md shadow-md">
												{moreState.todoDropdown === "Todo Difficulty" && (
													<div className="flex flex-col justify-center items-center w-full">
														<button
															onClick={(e) =>
																handleSetDifficulty(e.target.textContent)
															}
															className="px-2 py-1 hover:bg-green-500 hover:text-white w-full rounded-t-md"
														>
															Easy
														</button>
														<button
															onClick={(e) =>
																handleSetDifficulty(e.target.textContent)
															}
															className="px-2 py-1 hover:bg-yellow-500 hover:text-white w-full"
														>
															Intermediate
														</button>
														<button
															onClick={(e) =>
																handleSetDifficulty(e.target.textContent)
															}
															className="px-2 py-1 hover:bg-red-500 hover:text-white w-full"
														>
															Hard
														</button>
														{
															<button
																onClick={(e) => handleSetDifficulty("")}
																className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full rounded-b-md"
															>
																Remove
															</button>
														}
													</div>
												)}

												{moreState.todoDropdown === "Time Created" && (
													<div className="flex flex-col justify-center items-center gap-1 w-full text-center">
														<p className="px-2 py-1 w-full rounded-t-md">
															{createdTimeText()}
														</p>
													</div>
												)}
											</div>
										)}
									</div>
								)}
							</div>
						)}

						{!todolist.ignoreTodo && (
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
						)}

						<Image
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
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
