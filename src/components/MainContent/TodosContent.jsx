import Image from "next/image";
import React, {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import SubTodos from "../MainContent/SubTodos";
import Link from "next/link";
import shortenUrl from "shorten-url";
import { createPortal } from "react-dom";
import Timeline from "../MainContent/Timeline";
import DateTimeline from "./DateTimeline";
import GeminiAPI from "../../pages/api/geminiApi";

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

export default function TodosContent({
	todolist,
	folders,
	todolistFolder,
	subTodoSearchInput,
}) {
	const { auth, todoLists } = FirebaseApi();
	const { readTodoDifficulty, todoLoading, grammaticallyFixedTodo } =
		GeminiAPI();
	const { user } = useContext(UserCredentialCtx);
	const { clickedFolder, clickedTodoFolder } = useContext(StateCtx);
	const [moreState, moreDispatch] = useReducer(moreReducer, {
		todoDropdown: "",
	});
	const [todoText, setTodoText] = useState("");
	const [editTextActive, setEditTextActive] = useState(false);
	const editTextActiveRef = useRef();
	const [subTodoButtonAppear, setSubTodoButtonAppear] = useState(false);
	const [closeSubTodos, setCloseSubTodos] = useState(true);
	const [openLinkDropdown, setOpenLinkDropdown] = useState(false);
	let [deletionIntervals, setDeletionIntervals] = useState(5000);
	const [openMoreDropdown, setOpenMoreDropdown] = useState(false);
	const [nextTimeline, setNextTimeline] = useState(false);
	const [timelineDate, setTimelineDate] = useState(new Date());
	const [timelineDate2, setTimelineDate2] = useState(new Date());
	const [openTimelineModal, setOpenTimelineModal] = useState(false);
	const [hideCalendarPopUp, setHideCalendarPopUp] = useState(false);

	const deleteDelay = useRef();
	const deleteDelayInterval = 5000;
	const deletionSetInterval = useRef();
	const todoIndicator = useRef();
	const linkPattern = /(https?:\/\/[^\s]+)/;
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

	const handleEditTextActive = () => {
		setEditTextActive(!editTextActive);
		setTimeout(() => {
			editTextActiveRef.current?.focus();
		}, 10);
	};

	const handleChangeEditText = async () => {
		if (todoText) {
			setTodoText("");
			setEditTextActive(false);
			todoLists.updatingTodolist(
				todolist.id,
				await grammaticallyFixedTodo(todoText),
			);

			const subTodos = todoLists.allSubTodos
				.filter((value) => value.todoID === todolist.id)
				.map((subTodo) => subTodo.todo)
				.toString();

			const startTimeMiliSec = todolist.startDate?.seconds * 1000;
			const endTimeMiliSec = todolist.endDate?.seconds * 1000;

			const todoDate = (timeMiliSec) => {
				const date = new Date(timeMiliSec);
				const month = date.getMonth();
				const day = date.getDate();

				return `${timeMonths[month]}, ${day}`;
			};

			function todoTime(time) {
				const modifiedDate = new Date(time);

				const hour =
					modifiedDate.getHours() >= 12
						? Math.abs(modifiedDate.getHours() - 12)
						: modifiedDate.getHours();

				const minutes = modifiedDate.getMinutes();

				const isPM = modifiedDate.getHours() >= 12 ? false : true;

				const formattedHours = hour.toString().padStart(2, "0");
				const formattedMinutes = minutes.toString().padStart(2, "0");

				// Return formatted time with AM/PM
				return `${formattedHours}:${formattedMinutes} ${isPM ? "AM" : "PM"}`;
			}

			todoLists.updatingTodoDifficulty(
				todolist.id,
				await readTodoDifficulty(
					todolistFolder.folderTitle,
					todolistFolder.folderDescription,
					todoText,
					`Start Date: ${todolist.startDate ? `Start Date: ${todoDate(startTimeMiliSec)}, ${todoTime(startTimeMiliSec)}` : "No Start Date"}`,
					`End Date: ${todolist.endDate ? `End Date: ${todoDate(endTimeMiliSec)}, ${todoTime(endTimeMiliSec)}` : "No End Date"}`,
					`${subTodos ? subTodos : "No Sub Todos"}`,
				),
			);
		}
	};

	const handleKeyedChangeEditText = (e) => {
		if (e.key === "Enter") {
			setTodoText("");
			handleChangeEditText();
		}
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
			todoIndicator.current ? true : false,
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
						auth.currentUser?.uid === value.userID,
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

	const handleCreateSubTodo = () => {
		setCloseSubTodos(false);

		todoLists.addSubTodo(
			folders.allFolders
				?.filter(
					(value) =>
						value.userID === auth.currentUser?.uid &&
						value.folderName === clickedFolder,
				)
				.slice(0, 1)
				?.map((folder) => folder.folderName),
			todolistFolder.id,
			todolist.id,
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
		const timeMiliSec = todolist.createdTime?.seconds * 1000;
		const date = new Date(timeMiliSec);
		const month = date.getMonth();
		const day = date.getUTCDate();

		return `${timeMonths[month]}, ${day}`;
	};
	createdTimeText();

	const handleSetDifficulty = (difficulty) => {
		setSubTodoButtonAppear(false);
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
			todolist.ignoreTodo ? !todolist.ignoreTodo : true,
		);

		todoLists.updatingTodolistFavorite(todolist.id, false);
		handleSetDifficulty("");
		setOpenMoreDropdown(!openMoreDropdown);
		todoLists.updatingTodoCompletionDates(todolist.id, "", "");
	};

	const handleMarkImportant = (markImportant) => {
		if (todolist.completed) {
			null;
		} else {
			todoLists.updatingMarkAsImportant(todolist.id, markImportant);
			setOpenMoreDropdown(false);
			setSubTodoButtonAppear(false);
		}
	};

	const handleOpenTimelineModal = () => {
		setOpenTimelineModal(!openTimelineModal);
		setOpenMoreDropdown(false);
		setSubTodoButtonAppear(false);
	};

	useEffect(() => {
		const closeTimeline = (e) => {
			if (!e.target.closest(".timeline")) {
				setOpenTimelineModal(false);
			}
		};

		document.addEventListener("mousedown", closeTimeline);
		return () => document.removeEventListener("mousedown", closeTimeline);
	}, []);

	const timelineDateTxt = (tld) => {
		const day = tld?.getDate();
		const month = tld?.getMonth();
		const year = tld?.getFullYear();
		return `${timeMonths[month] || "Month"} ${day || "Day"}, ${year || "Year"}`;
	};

	const fixedTimelineDateTxt = () => {
		const date = new Date(todolist.startDate.seconds * 1000);

		const day = date?.getDate();
		const month = date?.getMonth();
		const year = date?.getFullYear();

		const startDate = todolist.startDate.seconds * 1000;

		function millisecondsToTime() {
			const modifiedDate = new Date(startDate);

			const hour =
				modifiedDate.getHours() >= 12
					? Math.abs(modifiedDate.getHours() - 12)
					: modifiedDate.getHours();

			const minutes = modifiedDate.getMinutes();

			const isPM = modifiedDate.getHours() >= 12 ? false : true;

			const formattedHours = hour.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// Return formatted time with AM/PM
			return `${formattedHours}:${formattedMinutes} ${isPM ? "AM" : "PM"}`;
		}

		const startDateTime = millisecondsToTime();

		return `${timeMonths[month] || "Month"} ${day || "Day"}, ${
			year || "Year"
		}, ${startDateTime || "Time"}`;
	};

	const fixedTimelineDateTxt2 = () => {
		const date = new Date(todolist.endDate.seconds * 1000);

		const day = date?.getDate();
		const month = date?.getMonth();
		const year = date?.getFullYear();

		const endDate = todolist.endDate.seconds * 1000;

		function millisecondsToTime() {
			const modifiedDate = new Date(endDate);

			const hour =
				modifiedDate.getHours() >= 12
					? Math.abs(modifiedDate.getHours() - 12)
					: modifiedDate.getHours();

			const minutes = modifiedDate.getMinutes();

			const isPM = modifiedDate.getHours() >= 12 ? false : true;

			const formattedHours = hour.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// Return formatted time with AM/PM
			return `${formattedHours}:${formattedMinutes} ${isPM ? "AM" : "PM"}`;
		}

		const endDateTime = millisecondsToTime();

		return `${timeMonths[month] || "Month"} ${day || "Day"}, ${
			year || "Year"
		}, ${endDateTime || "Time"}`;
	};

	const handleCompletionTodoTime = () => {
		if (timelineDate && timelineDate2) {
			todoLists.updatingTodoCompletionDates(
				todolist.id,
				timelineDate,
				timelineDate2,
			);
			setOpenTimelineModal(false);
			setTimelineDate(new Date());
			setTimelineDate2(new Date());
			setNextTimeline(false);
		}
	};

	const handleRemoveCompletionTodoTime = () => {
		todoLists.updatingTodoCompletionDates(todolist.id, "", "");
	};

	const textDate = () => {
		const startDate = todolist.startDate.seconds * 1000;
		const endDate = todolist.endDate.seconds * 1000;

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

		const modifiedStartDate = new Date(startDate);
		const modifiedEndDate = new Date(endDate);

		function millisecondsToTime(date) {
			const modifiedDate = new Date(date);

			const hour =
				modifiedDate.getHours() >= 12
					? Math.abs(modifiedDate.getHours() - 12)
					: modifiedDate.getHours();

			const minutes = modifiedDate.getMinutes();

			const isPM = modifiedDate.getHours() >= 12 ? false : true;

			const formattedHours = hour.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// Return formatted time with AM/PM
			return `${formattedHours}:${formattedMinutes} ${isPM ? "AM" : "PM"}`;
		}

		const startDateTime = millisecondsToTime(startDate);
		const endDateTime = millisecondsToTime(endDate);

		return `Start: ${
			timeMonths[modifiedStartDate.getMonth()]
		} ${modifiedStartDate.getDate()}, ${startDateTime} - End: ${
			timeMonths[modifiedEndDate.getMonth()]
		} ${modifiedEndDate.getDate()}, ${endDateTime}`;
	};

	return (
		<div className="flex flex-col w-full relative">
			{createPortal(
				<>
					{openTimelineModal && (
						<div
							className={`flex justify-center items-center text-center w-full h-full fixed bg-[rgba(0,0,0,0.7)] z-[60]`}
						>
							<div
								className={`bg-white w-[90%] h-[90%] sm:w-fit p-10 rounded-md timeline flex flex-col gap-5 justify-start items-start sm:items-center overflow-y-scroll overflow-x-scroll relative ${
									todolist.completed && "border-4 border-green-500"
								}`}
							>
								{todolist.completed && (
									<h1 className="text-2xl font-semibold text-green-500 text-center w-full">
										Completed To-do
									</h1>
								)}

								<div className="flex flex-col justify-center items-center gap-3 w-full">
									<div className="flex flex-col justify-center items-center w-full">
										<h1 className="text-sm text-gray-400 font-semibold">
											{todolist.mainFolder[0]}
										</h1>
										<h1 className="text-2xl font-semibold">
											{nextTimeline ? "Set End Time" : "Set Start Time"}
										</h1>
									</div>

									{todolist.startDate && todolist.endDate && (
										<div className="flex flex-col justify-center items-center gap-1">
											<>
												<div className="flex flex-col justify-center items-center">
													<p className="font-semibold">
														Start:{" "}
														<span className="font-normal">
															{fixedTimelineDateTxt()}
														</span>
													</p>
													<p className="font-semibold">
														End:{" "}
														<span className="font-normal">
															{fixedTimelineDateTxt2()}
														</span>
													</p>
												</div>
											</>
										</div>
									)}

									<div className="flex flex-col gap-2 justify-center items-center w-full">
										{todolist.startDate && todolist.endDate && (
											<>
												<button
													onClick={handleRemoveCompletionTodoTime}
													className="base-btn !bg-red-500 w-full"
												>
													Remove Date
												</button>
											</>
										)}

										{nextTimeline ? (
											<>
												<button
													onClick={() => setNextTimeline(false)}
													className="border border-[#0E51FF] text-[#0E51FF] px-2 py-1 rounded-md cursor-pointer hover:opacity-80 transition-all w-full"
												>
													Back
												</button>
												<button
													onClick={handleCompletionTodoTime}
													className="base-btn w-full"
												>
													Set Date
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => setNextTimeline(true)}
													className="base-btn w-full"
												>
													Next
												</button>
												<button
													onClick={handleOpenTimelineModal}
													className="inverse-base-btn !border-red-500 !text-red-500 w-full"
												>
													Cancel
												</button>
											</>
										)}
									</div>
								</div>

								<div className="flex justify-end items-center flex-col w-full gap-2">
									<div className="flex flex-col justify-center item-center">
										<p className="text-sm text-gray-400">Set date below</p>
										<p>
											<span className="text-lg font-semibold">Date Set:</span>{" "}
											{nextTimeline
												? timelineDateTxt(timelineDate2)
												: timelineDateTxt(timelineDate)}
										</p>
									</div>

									<div className="calendar-overflow border w-full h-fit flex justify-start item-center rounded-lg overflow-y-hidden overflow-x-scroll">
										{nextTimeline ? (
											<DateTimeline
												value={timelineDate2}
												onChange={setTimelineDate2}
											/>
										) : (
											<Timeline
												value={timelineDate}
												onChange={setTimelineDate}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</>,
				document.body,
			)}

			<div
				id={`${
					todolist.ignoreTodo === true && todolist.ignoreTodo && "ignore-todo"
				}`}
				onMouseOver={() => setSubTodoButtonAppear(true)}
				onMouseLeave={() => !openLinkDropdown && setSubTodoButtonAppear(false)}
				className={`flex justify-start items-center gap-3 w-full rounded-lg px-2 py-1 relative transition-colors ${
					todolist.markImportant ? "border-r-4 border-[#0E51FF]" : ""
				} ${todolist.ignoreTodo ? "bg-[#0e52ff26] ignore-todo" : ""} ${
					todolist.deletionIndicator
						? "bg-gradient-to-r from-transparent to-[#ef2b2b51]"
						: ""
				}`}
			>
				{todolist.ignoreTodo ? (
					<div className={`absolute top-0 left-0 w-1 h-full base-bg`} />
				) : (
					<div
						className={`absolute top-0 left-0 w-1 h-full ${
							todolist && todolist.difficulty?.includes("Hard")
								? "bg-red-500"
								: todolist.difficulty?.includes("Intermediate")
									? "bg-yellow-500"
									: todolist.difficulty?.includes("Easy")
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

					<button
						className={`lg:pr-1 ${
							subTodoButtonAppear ? "opacity-100" : "opacity-100 lg:opacity-0"
						}`}
						onClick={todolist.deletionIndicator ? null : handleCreateSubTodo}
					>
						<div
							className={`w-auto h-auto ${
								todolist.deletionIndicator && "cursor-not-allowed opacity-50"
							}`}
						>
							{user.themeColor ? (
								<Image
									className="min-w-[20px] max-w-[20px] h-[20px]"
									src={"/icons/add-todo-white.svg"}
									alt="add-sub-todo"
									width={25}
									height={25}
								/>
							) : (
								<Image
									className="min-w-[20px] max-w-[20px] h-[20px]"
									src={"/icons/add-todo-black.svg"}
									alt="add-sub-todo"
									width={25}
									height={25}
								/>
							)}
						</div>
					</button>
				</div>

				<div className="w-full h-auto flex flex-col sm:flex-row justify-start items-center">
					{!todoLoading ? (
						<div className="w-full sm:w-[90%] h-fit relative flex justify-start items-center gap-3">
							{!todolist.deletionIndicator &&
							editTextActive &&
							!todolist.completed ? (
								<div className="flex justify-between items-center gap-2 w-full">
									<>
										<textarea
											ref={editTextActiveRef}
											onChange={(e) => setTodoText(e.target.value)}
											onKeyDown={handleKeyedChangeEditText}
											className={`input-todo-text outline-none block lg:hidden border-none w-full rounded-md px-3 py-2 h-[40px] ${
												user.themeColor
													? "text-white bg-[#333]"
													: "text-black bg-gray-200"
											}`}
											type="text"
											placeholder={todolist.todo}
										/>

										<input
											ref={editTextActiveRef}
											onChange={(e) => setTodoText(e.target.value)}
											onKeyDown={handleKeyedChangeEditText}
											className={`input-todo-text outline-none hidden lg:block border-none w-full rounded-md px-3 py-2 h-[40px] ${
												user.themeColor
													? "text-white bg-[#333]"
													: "text-black bg-gray-200"
											}`}
											type="text"
											placeholder={todolist.todo}
										/>
									</>

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
									{openLinkDropdown && extractLink() && (
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
													todolist.completed && "line-through select-all"
												}`}
											>
												<span>Link</span>
											</Link>
											<button
												onClick={handleEditTextActive}
												className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
													todolist.completed && "line-through select-all"
												}`}
											>
												<span>Edit</span>
											</button>
										</div>
									)}

									<button
										onClick={handleLinkDropdown}
										title={"Go to link"}
										className={`text-btn w-full sm:w-[90%] text-start no-underline line-clamp-1 flex justify-start items-center gap-1 ${
											todolist.completed && "line-through select-all"
										} ${
											subTodoButtonAppear || openLinkDropdown
												? "translate-x-0"
												: "translate-x-0 lg:-translate-x-8"
										}`}
									>
										<p className="">
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
									onClick={handleEditTextActive}
									className={`text-btn w-full ${
										todolist.completed && "line-through select-all"
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
					) : (
						<p
							className={`w-full ${user.themeColor ? "text-[#999]" : "text-gray-500"} ${
								todolist.completed && "line-through select-all"
							} ${
								subTodoButtonAppear || openLinkDropdown
									? "translate-x-0"
									: "translate-x-0 lg:-translate-x-8"
							}`}
						>
							Loading Todo...
						</p>
					)}

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

						{!editTextActive && !todolist.deletionIndicator && (
							<div className="w-fit h-auto relative flex justify-center items-center">
								{todolist.startDate && todolist.endDate && (
									<div
										className={`absolute top-1/2 -translate-y-1/2 w-full ${
											todolist.markImportant ? "left-[105px]" : "left-24"
										}`}
									>
										{hideCalendarPopUp && (
											<p className="absolute bottom-6 right-0 w-[170px] sm:w-fit h-fit bg-white text-black shadow-lg px-3 py-1 rounded-md sm:rounded-full text-[12px] sm:whitespace-nowrap">
												{textDate()}
											</p>
										)}

										<Image
											onMouseLeave={() => setHideCalendarPopUp(false)}
											onMouseEnter={() => setHideCalendarPopUp(true)}
											className="w-auto h-[20px] opacity-20"
											src={
												user.themeColor
													? "/icons/calendar_month_white.svg"
													: "/icons/calendar_month_black.svg"
											}
											alt="favorite"
											width={30}
											height={30}
										/>
									</div>
								)}

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
										onMouseLeave={() => setSubTodoButtonAppear(false)}
										className="more-dropdown absolute w-[160px] h-fit rounded-md flex flex-col justify-center items-center gap-1 top-8 -left-12 bg-white text-sm text-black border shadow-md z-10"
									>
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
													: handleMoreDispatch("todoDropdown", e.target.name)
											}
											className={`px-2 py-1  w-full ${
												todolist.ignoreTodo
													? "hover:bg-[#ccc] cursor-not-allowed"
													: "hover:bg-[#0E51FF] hover:text-white"
											}`}
											name="Todo Difficulty"
										>
											To-do Difficulty
										</button>

										<button
											onClick={(e) =>
												handleMoreDispatch("todoDropdown", e.target.textContent)
											}
											className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white w-full"
										>
											Time Created
										</button>

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
											} ${todolist.ignoreTodo && "bg-[#0e52ff6b] text-black"}`}
										>
											{todolist.ignoreTodo ? "Undo Ignore" : "Ignore To-do"}
										</button>

										<div className="flex justify-center items-center gap-2 w-full">
											{todolist.markImportant ? (
												<button
													className={`px-2 py-1 w-full bg-[#0e52ff6b] text-black ${
														todolist.completed
															? "cursor-not-allowed hover:bg-[#ccc]"
															: "hover:bg-[#0E51FF] hover:text-white"
													}`}
													onClick={() => {
														todolist.completed
															? null
															: handleMarkImportant(false);
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

										{todolist.startDate && todolist.endDate ? (
											<button
												onClick={
													todolist.ignoreTodo ? null : handleOpenTimelineModal
												}
												className={`px-2 py-1 bg-[#0e52ff6b] text-black w-full rounded-b-md ${
													todolist.ignoreTodo
														? "cursor-not-allowed hover:bg-[#ccc]"
														: "hover:bg-[#0E51FF] hover:text-white"
												}`}
											>
												Change/Remove Date
											</button>
										) : (
											<button
												onClick={
													todolist.ignoreTodo ? null : handleOpenTimelineModal
												}
												className={`px-2 py-1 w-full rounded-b-md ${
													todolist.ignoreTodo
														? "cursor-not-allowed hover:bg-[#ccc]"
														: "hover:bg-[#0E51FF] hover:text-white"
												}`}
											>
												Set Completion Date
											</button>
										)}

										{moreState.todoDropdown && (
											<div className="absolute top-48 left-0 w-full h-fit bg-white border rounded-md shadow-md">
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
							onClick={todolist.deletionIndicator ? null : handleDeleteTodo}
							className={`w-auto h-[18px] ${
								todolist.deletionIndicator
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

			<div className="flex flex-col justify-start items-center w-full relative">
				{todoLists?.allSubTodos
					?.filter(
						(value) =>
							value.folderID === todolistFolder.id &&
							value.userID === auth.currentUser?.uid &&
							value.todoID === todolist.id,
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
								!closeSubTodos && "rotate-180"
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
				)}
				{todoLists?.allSubTodos
					?.filter(
						(value) =>
							value.folderID === todolistFolder.id &&
							value.userID === auth.currentUser?.uid,
					)
					.map((subTodo) => {
						if (
							subTodo.folderID === clickedTodoFolder &&
							subTodo.todoID === todolist.id &&
							subTodo.todo
								.normalize("NFD")
								.replace(/\p{Diacritic}/gu, "")
								.toLowerCase()
								.includes(subTodoSearchInput.toLowerCase())
						) {
							return (
								<React.Fragment key={subTodo.id}>
									<SubTodos
										subTodo={subTodo}
										user={user}
										todolist={todolist}
										todoLists={todoLists}
										closeSubTodos={closeSubTodos}
									/>
								</React.Fragment>
							);
						}
					})}
			</div>
		</div>
	);
}
