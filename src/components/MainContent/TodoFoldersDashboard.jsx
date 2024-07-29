import React, { useContext, useEffect, useRef, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";
import { createPortal } from "react-dom";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";

export default function TodoFoldersDashboard({
	todoFolder,
	user,
	setClickedFolder,
	setClickedTodoFolder,
	auth,
}) {
	const {
		registration,
		todoLists,
		todolistFolders,
		folders,
		sharingTodoFolder,
	} = FirebaseApi();
	const {
		filterDispatch,
		setCompletedTodos,
		setTodoSearchInput,
		setOpenTodoSearchInput,
	} = useContext(StateCtx);

	const [openDeletionModal, setOpenDeletionModal] = useState(false);
	const [openMoreModal, setOpenMoreModal] = useState(false);
	const [openAddPinModal, setOpenAddPinModal] = useState(false);
	const [pinAddedMesg, setPinAddedMesg] = useState("");
	const [removedPinMesg, setRemovedPinMesg] = useState("");
	const [beforeRemoving, setBeforeRemoving] = useState("");
	const [unlockTodoFolder, setUnlockTodoFolder] = useState("");
	const [openTransferModal, setOpenTransferModal] = useState(false);
	const [accountID, setAccountID] = useState("");
	const [sharingTodoFolderError, setSharingTodoFolderError] = useState("");

	const todoFolderDeletionRef = useRef();
	const removePinIndicator = useRef();
	const pinAddedIndicator = useRef();
	const sharingTodoFolderErrorRef = useRef();

	const timeStamp = () => {
		let date = new Date();
		return date;
	};

	const handleEnteringTodoFolder = () => {
		setClickedFolder(todoFolder.folderName);
		setClickedTodoFolder(todoFolder.id);
		setCompletedTodos(false);
		setTodoSearchInput("");
		setOpenTodoSearchInput(false);

		folders.allFolders
			?.filter(
				(value) =>
					value.folderName === todoFolder.folderName &&
					auth.currentUser?.uid === value.userID
			)
			.map((folder) => folders.updatingCreatedTime(folder.id));
		todolistFolders.updatingClickTimeStamp(todoFolder.id, timeStamp());

		filterDispatch({
			type: "filter-category",
			payload: {
				key: "filterCategories",
				value: "All",
				value2: "",
			},
		});
	};

	const handleClickedTodoFolder = () => {
		if (todoFolder.pin) {
			setUnlockTodoFolder(!unlockTodoFolder);
		} else {
			handleEnteringTodoFolder();
		}
	};

	const handleDeletion = () => {
		todolistFolders.deletingTodoFolder(todoFolder.id);

		todoLists.allTodoLists
			?.filter(
				(value) =>
					(value.folderID === todoFolder.id ||
						value.folderID === todoFolder.senderTodoFolderID) &&
					auth.currentUser?.uid === value.userID
			)
			?.map((todoList) => todoLists.deletingTodolist(todoList.id));

		todoLists.allSubTodos
			?.filter(
				(value) =>
					(value.folderID === todoFolder.id ||
						value.folderID === todoFolder.senderTodoFolderID) &&
					auth.currentUser?.uid === value.userID
			)
			?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));

		setClickedTodoFolder("");
		clearTimeout(todoFolderDeletionRef.current);
	};

	const handleOpenDeletionTodoModal = () => {
		setOpenDeletionModal(!openDeletionModal);
	};

	const handleMoreModal = () => {
		setOpenMoreModal(!openMoreModal);
	};

	const handleAddPinModal = (e) => {
		e?.preventDefault();
		setOpenAddPinModal(!openAddPinModal);
	};

	useEffect(() => {
		const closeMoreModal = (e) => {
			if (!e.target.closest(".more-modal")) {
				setOpenMoreModal(false);
			}
		};

		document.addEventListener("mousedown", closeMoreModal);
		return () => document.removeEventListener("mousedown", closeMoreModal);
	}, [setOpenMoreModal]);

	const handleRemovePin = () => {
		clearTimeout(removePinIndicator.current);
		todolistFolders.removePin(todoFolder.id);

		setRemovedPinMesg("Code Removed Successfully from: ");

		removePinIndicator.current = setTimeout(() => {
			setRemovedPinMesg("");
		}, 5000);
	};

	const handleBeforeRemovingPin = () => {
		setBeforeRemoving(!beforeRemoving);
	};

	const handleHideTodoFolder = () => {
		todolistFolders.hideFolder(
			todoFolder.id,
			todoFolder.folderHidden ? !todoFolder.folderHidden : true
		);
	};

	const totalCompletionPercentage = () => {
		const percentage =
			(todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todoFolder.id &&
						value.userID === auth.currentUser?.uid &&
						value.completed === true &&
						!value.ignoreTodo
				)
				?.map((todo) => todo).length +
				todoLists.allTodoLists
					?.filter(
						(value) =>
							value.folderID === todoFolder.senderTodoFolderID &&
							value.userID === auth.currentUser?.uid &&
							value.completed === true &&
							!value.ignoreTodo
					)
					?.map((todo) => todo).length) /
			(todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todoFolder.id &&
						value.userID === auth.currentUser?.uid &&
						!value.ignoreTodo
				)
				?.map((todo) => todo).length +
				todoLists.allTodoLists
					?.filter(
						(value) =>
							value.folderID === todoFolder.senderTodoFolderID &&
							value.userID === auth.currentUser?.uid &&
							!value.ignoreTodo
					)
					?.map((todo) => todo).length);

		return percentage;
	};

	useEffect(() => {
		const completionPercentage =
			(todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todoFolder.id &&
						value.userID === auth.currentUser?.uid &&
						value.completed === true &&
						!value.ignoreTodo
				)
				?.map((todo) => todo).length +
				todoLists.allTodoLists
					?.filter(
						(value) =>
							value.folderID === todoFolder.senderTodoFolderID &&
							value.userID === auth.currentUser?.uid &&
							value.completed === true &&
							!value.ignoreTodo
					)
					?.map((todo) => todo).length) /
			(todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todoFolder.id &&
						value.userID === auth.currentUser?.uid &&
						!value.ignoreTodo
				)
				?.map((todo) => todo).length +
				todoLists.allTodoLists
					?.filter(
						(value) =>
							value.folderID === todoFolder.senderTodoFolderID &&
							value.userID === auth.currentUser?.uid &&
							!value.ignoreTodo
					)
					?.map((todo) => todo).length);

		if (completionPercentage >= 1) {
			todolistFolders.updatingCompletion(todoFolder.id, true);
			todoFolder.pinned &&
				todolistFolders.updatingPinnedIndicator(todoFolder.id, false);
		}

		if (completionPercentage < 1) {
			todolistFolders.updatingCompletion(todoFolder.id, false);
		}
	}, [todoFolder.completed, todolistFolders, todoFolder.pinned]);

	const handlePinTodoFolder = () => {
		todolistFolders.updatingPinnedIndicator(todoFolder.id, !todoFolder.pinned);
	};

	const handleTransferModal = () => {
		setOpenTransferModal(!openTransferModal);
	};

	useEffect(() => {
		const closeTransferModal = (e) => {
			if (!e.target.closest(".todo-transfer-modal")) {
				setOpenTransferModal(false);
			}
		};

		document.addEventListener("mousedown", closeTransferModal);
		return () => document.removeEventListener("mousedown", closeTransferModal);
	}, [openTransferModal]);

	const handleShareTodoFolder = async (e) => {
		e.preventDefault();

		const checkUserAccountID = registration?.allusers
			?.map((value) => value.userID === accountID)
			.includes(true);

		const checkIfTodoFolderIDExist = todolistFolders.allTodoFolders
			?.filter(
				(value) =>
					value.userID === accountID &&
					value.senderTodoFolderID === todoFolder.id
			)
			?.map((value) => value.senderTodoFolderID === todoFolder.id)
			.includes(true);

		// TODO: Make sure the user can see the sub to-dos on the first share
		// TODO: Allow the user to copy shared to-do folders into uncompleted to-do folders

		clearTimeout(sharingTodoFolderErrorRef.current);

		if (
			accountID &&
			checkUserAccountID &&
			accountID !== auth?.currentUser.uid &&
			!checkIfTodoFolderIDExist
		) {
			await todoLists.allSubTodos
				?.filter(
					(value) =>
						value.userID === auth.currentUser.uid &&
						(value.folderID === todoFolder.id ||
							value.folderID === todoFolder.senderTodoFolderID)
				)
				?.map((value) =>
					sharingTodoFolder.shareSubTodos(
						accountID,
						todoFolder.id,
						value.todo,
						value.favorited,
						value.completed,
						value.todoID
					)
				);

			await todoLists.allTodoLists
				?.filter(
					(value) =>
						value.userID === auth.currentUser.uid &&
						(value.folderID === todoFolder.id ||
							value.folderID === todoFolder.senderTodoFolderID)
				)
				?.map((value) =>
					sharingTodoFolder.shareTodos(
						accountID,
						todoFolder.id,
						value.todo,
						value.favorited,
						value.completed,
						value.ignoreTodo,
						value.difficulty,
						value.endDate,
						value.startDate,
						value.markImportant,
						value.id
					)
				);

			await sharingTodoFolder.shareTodoFolder(
				accountID,
				todoFolder.id,
				todoFolder.folderEmoji,
				todoFolder.folderTitle,
				todoFolder.folderDescription
			);

			setOpenTransferModal(false);
			setSharingTodoFolderError("200");

			sharingTodoFolderErrorRef.current = setTimeout(() => {
				setSharingTodoFolderError("");
			}, 3000);
		} else {
			setSharingTodoFolderError("404");

			sharingTodoFolderErrorRef.current = setTimeout(() => {
				setSharingTodoFolderError("");
			}, 3000);
		}
	};

	return (
		<div
			className={`flex justify-center items-center w-full h-fit relative ${
				totalCompletionPercentage() >= 1
					? "border border-green-500 rounded-md"
					: ""
			}`}
		>
			{removedPinMesg &&
				createPortal(
					<>
						<div className="absolute w-full h-fit bg-red-500 text-center flex gap-2 justify-center items-center text-white px-2 py-1">
							<p className="text-lg font-light">{removedPinMesg}</p>
							<p className={`text-lg italic font-medium`}>
								{todoFolder.folderTitle}
							</p>
						</div>
					</>,
					document.body
				)}
			{pinAddedMesg &&
				createPortal(
					<div className="absolute w-full h-fit bg-green-500 text-center flex gap-2 justify-center items-center text-white px-2 py-1">
						<p className="text-lg font-light">{pinAddedMesg}</p>
						<p className={`text-lg italic font-medium`}>
							{todoFolder.folderTitle}
						</p>
					</div>,
					document.body
				)}

			<button
				onClick={() => {
					handleClickedTodoFolder();
				}}
				className={`border text-btn w-full min-h-[170px] py-3 px-4 rounded-md flex flex-col justify-start items-start text-start gap-2 relative ${
					user.themeColor
						? "bg-[#333] border-[#555]"
						: "bg-[#eee] border-[#ccc]"
				}`}
			>
				{todoFolder.pin &&
					(user.themeColor ? (
						<Image
							className="w-auto min-h-[15px] max-h-[15px] absolute top-1.5 right-1.5"
							src={"/icons/lock-white.svg"}
							alt="trash"
							width={25}
							height={25}
						/>
					) : (
						<Image
							className="w-auto min-h-[15px] max-h-[15px] absolute top-1.5 right-1.5"
							src={"/icons/lock-black.svg"}
							alt="trash"
							width={25}
							height={25}
						/>
					))}

				<div className="w-full flex flex-col justify-center items-between">
					{todoFolder.folderName ? (
						<h1
							className={`text-sm line-clamp-1 ${
								user.themeColor ? "text-[#666]" : "text-[#aaa]"
							}`}
						>
							Main Folder:{" "}
							<span className="font-bold underline">
								{todoFolder.folderName}
							</span>
						</h1>
					) : (
						<h1
							className={`text-sm line-clamp-1 ${
								user.themeColor ? "text-[#666]" : "text-[#aaa]"
							}`}
						>
							Shared Folder
						</h1>
					)}

					<div className="flex justify-between items-center w-full">
						<h2 className={`text-2xl font-semibold line-clamp-1`}>
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

				<div className="flex justify-between items-center gap-2 w-full mt-auto">
					<>
						{totalCompletionPercentage() ? (
							<>
								{totalCompletionPercentage() >= 1 ? (
									<p className={`text-base font-normal text-green-500`}>
										{totalCompletionPercentage()
											.toFixed(2)
											.replace("0.", "")
											.replace(".", "")}
										% Completed
									</p>
								) : totalCompletionPercentage().toString().includes("0") ? (
									<p
										className={`text-base font-normal ${
											user.themeColor ? "text-[#666]" : "text-[#9CA3AF]"
										} ${
											totalCompletionPercentage() > 0.59
												? "text-yellow-600"
												: totalCompletionPercentage() < 0.6
												? "text-red-500"
												: ""
										}`}
									>
										{totalCompletionPercentage().toFixed(2).replace("0.", "")}%
										Completed
									</p>
								) : (
									<p
										className={`text-base font-normal ${
											user.themeColor ? "text-[#666]" : "text-[#9CA3AF]"
										}`}
									>
										{totalCompletionPercentage()
											.toFixed(2)
											.replace("0.", "")
											.replace("0", "")}
										% Completed
									</p>
								)}
							</>
						) : todoLists.allTodoLists
								?.filter(
									(value) =>
										value.folderID === todoFolder.id &&
										value.userID === auth.currentUser?.uid
								)
								?.map((todo) => todo).length +
								todoLists.allTodoLists
									?.filter(
										(value) =>
											value.folderID === todoFolder.senderTodoFolderID &&
											value.userID === auth.currentUser?.uid
									)
									?.map((todo) => todo).length >
						  0 ? (
							todoLists.allTodoLists
								?.filter(
									(value) =>
										(value.folderID === todoFolder.id ||
											value.folderID === todoFolder.senderTodoFolderID) &&
										value.userID === auth.currentUser?.uid
								)
								?.map((todo) => todo.ignoreTodo)
								.includes(false) ? (
								<p
									className={`text-base font-normal ${
										user.themeColor ? "text-[#666]" : "text-[#9CA3AF]"
									}`}
								>
									0% Completed
								</p>
							) : (
								<p
									className={`text-base font-normal ${
										user.themeColor ? "text-[#666]" : "text-[#9CA3AF]"
									}`}
								>
									All Ignored To-dos
								</p>
							)
						) : (
							<p
								className={`text-base font-normal ${
									user.themeColor ? "text-[#666]" : "text-[#9CA3AF]"
								}`}
							>
								No To-dos
							</p>
						)}
					</>
				</div>
			</button>

			{sharingTodoFolderError === "200" &&
				createPortal(
					<>
						<div className="absolute bottom-10 right-10 bg-green-500 px-2 py-1 text-center w-fit text-white rounded-lg z-50 flex justify-center items-center gap-2">
							<p>To-do Folder Shared</p>

							<Image
								className="w-auto min-h-[12px] max-h-[12px]"
								src={"/icons/completed-white.svg"}
								alt="close"
								width={20}
								height={20}
							/>
						</div>
					</>,
					document.body
				)}

			{openTransferModal &&
				createPortal(
					<>
						<div className="modal-base">
							<div className="todo-transfer-modal bg-gray-100 w-[90%] sm:w-[400px] h-fit rounded-lg p-4 flex flex-col gap-3 justify-start items-start">
								{sharingTodoFolderError === "404" && (
									<p className="bg-red-500 px-2 py-1 text-center w-full text-white rounded-lg">
										Invalid Account ID
									</p>
								)}

								<div className="flex justify-between items-start gap-1 w-full">
									<div className="flex flex-col justify-start items-start w-full gap-1">
										<h1 className="h1-base">Share Your To-do Folder</h1>

										<p className="text-sm text-gray-500">
											- To share a to-do folder to another user, {"you're "}
											required to have their account ID
										</p>

										<p className="text-sm text-gray-500">
											- You CANNOT share the same to-do folder twice with the
											same user
										</p>

										<p className="text-sm text-gray-500">
											- When editing to-dos and sub to-dos in a shared to-do
											folder, it will reflect for both users sharing it
										</p>
									</div>

									<Image
										onClick={handleTransferModal}
										className="w-auto min-h-[25px] max-h-[25px] text-btn"
										src={"/icons/close.svg"}
										alt="close"
										width={30}
										height={30}
									/>
								</div>

								<form className="flex flex-col justify-start items-start w-full gap-1">
									<label htmlFor="Share">Receiver Account ID:</label>
									<input
										className="input-field !bg-gray-200"
										placeholder="AI09cy9q8dJUIUGuj839u3boishe96"
										autoComplete="off"
										type="text"
										name="message"
										onChange={(e) => setAccountID(e.target.value)}
										value={accountID}
									/>

									<button
										onClick={handleShareTodoFolder}
										className="base-btn w-full"
									>
										Share
									</button>
								</form>
							</div>
						</div>
					</>,
					document.body
				)}

			<div className="absolute bottom-3 right-3 flex justify-center items-center gap-2">
				<button
					className="flex justify-center items-center relative"
					onClick={handleMoreModal}
				>
					<Image
						className="w-auto min-h-[25px] max-h-[25px] text-btn"
						src={
							user.themeColor
								? "/icons/more-white.svg"
								: "/icons/more-black.svg"
						}
						alt="trash"
						width={30}
						height={30}
					/>

					{openMoreModal && (
						<div className="more-modal absolute top-7 left-0 w-24 h-fit rounded-md overflow-hidden border bg-white text-black text-sm z-10 flex flex-col gap-1 text-start">
							{!todoFolder.completed && (
								<p
									onClick={handlePinTodoFolder}
									className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
								>
									{todoFolder.pinned ? "Unpin" : "Pin to top"}
								</p>
							)}

							{!todoFolder.completed && !todoFolder.senderUID && (
								<p
									onClick={handleTransferModal}
									className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
								>
									Share
								</p>
							)}

							{!todoFolder.completed && todoFolder.senderUID && (
								<p
									onClick={null}
									className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
								>
									Copy
								</p>
							)}

							<p
								onClick={handleHideTodoFolder}
								className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
							>
								{todoFolder.folderHidden ? "Show" : "Hide"}
							</p>

							{todoFolder.pin ? (
								<p
									onClick={handleBeforeRemovingPin}
									className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
								>
									Remove Code
								</p>
							) : (
								<p
									onClick={handleAddPinModal}
									className="px-2 py-1 hover:bg-[#0E51FF] hover:text-white"
								>
									Add a Code
								</p>
							)}
						</div>
					)}
				</button>
				<button
					className="flex justify-center items-center"
					onClick={handleOpenDeletionTodoModal}
				>
					<Image
						className="w-auto min-h-[20px] max-h-[20px] text-btn"
						src={"/icons/trash.svg"}
						alt="trash"
						width={25}
						height={25}
					/>
				</button>
			</div>

			{unlockTodoFolder &&
				createPortal(
					<UnlockingTodoFolderPin
						todoFolder={todoFolder}
						handleEnteringTodoFolder={handleEnteringTodoFolder}
						setUnlockTodoFolder={setUnlockTodoFolder}
					/>,
					document.body
				)}

			{beforeRemoving &&
				createPortal(
					<BeforeRemovingPinModal
						todoFolder={todoFolder}
						handleBeforeRemovingPin={handleBeforeRemovingPin}
						handleRemovePin={handleRemovePin}
					/>,
					document.body
				)}

			{openDeletionModal &&
				createPortal(
					<TodoListFolderDeletionModal
						todoFolder={todoFolder}
						handleDeletion={handleDeletion}
						handleOpenDeletionTodoModal={handleOpenDeletionTodoModal}
					/>,
					document.body
				)}

			{openAddPinModal &&
				createPortal(
					<TodoListAddingPinMode
						todoFolder={todoFolder}
						handleAddPinModal={handleAddPinModal}
						pinAddedIndicator={pinAddedIndicator}
						setPinAddedMesg={setPinAddedMesg}
					/>,
					document.body
				)}
		</div>
	);
}

const UnlockingTodoFolderPin = ({
	todoFolder,
	handleEnteringTodoFolder,
	setUnlockTodoFolder,
}) => {
	const [showInfo, setShowInfo] = useState("");
	const [pin, setPin] = useState("");
	const [pinErrorMesg, setPinErrorMesg] = useState("");
	const checkPinRef = useRef();

	const handleUnlockingPin = (e) => {
		e.preventDefault();
		clearTimeout(checkPinRef.current);

		if (todoFolder.pin === pin) {
			handleEnteringTodoFolder();
		} else {
			setPinErrorMesg("Wrong Code");

			checkPinRef.current = setTimeout(() => {
				setPinErrorMesg("");
			}, 5000);
		}
	};

	useEffect(() => {
		const closeUnlockTodoFolderModal = (e) => {
			if (!e.target.closest(".unlock-pin-modal")) {
				setUnlockTodoFolder(false);
			}
		};

		document.addEventListener("mousedown", closeUnlockTodoFolderModal);
		return () =>
			document.removeEventListener("mousedown", closeUnlockTodoFolderModal);
	}, []);

	useEffect(() => {
		const closeInfoModal2 = (e) => {
			if (!e.target.closest(".info-modal-2")) {
				setShowInfo(false);
			}
		};

		document.addEventListener("mousedown", closeInfoModal2);
		return () => document.removeEventListener("mousedown", closeInfoModal2);
	}, []);

	return (
		<>
			<div className="w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center text-center p-5">
				<div className="unlock-pin-modal w-fit h-fit p-5 rounded-md flex flex-col gap-4 bg-white">
					{pinErrorMesg && (
						<div className="w-full h-fit bg-red-500 text-white px-2 py-1 rounded-md">
							<p>{pinErrorMesg}</p>
						</div>
					)}
					<div className="w-full flex flex-col justify-center items-center gap-1">
						<h1 className="text-2xl font-semibold">Enter Code for:</h1>
						<h3 className={`text-lg text-[#999]`}>
							Folder: {todoFolder.folderTitle}
						</h3>
					</div>
					<form className="flex justify-center items-center gap-2 relative">
						<input
							className="w-full px-2 py-1 rounded-md bg-[#eee] border text-center"
							onChange={(e) => setPin(e.target.value)}
							type="password"
							autoComplete="off"
							maxLength={4}
							value={pin}
							placeholder="Ex: 1234"
							onKeyDown={(e) =>
								e.key == "Enter" ? handleUnlockingPin(e) : null
							}
						/>
						<button
							onClick={(e) => {
								e.preventDefault();
								setShowInfo(!showInfo);
							}}
						>
							<Image
								className="w-auto min-h-[25px] max-h-[25px] text-btn"
								src={"/icons/info.svg"}
								alt="trash"
								width={30}
								height={30}
							/>
						</button>
						{showInfo && (
							<ul className="info-modal-2 absolute top-8 right-0 pl-6 pr-4 py-2 w-fit h-fit rounded-md border bg-white text-black text-sm z-10 flex flex-col justify-center items-center gap-1 list-disc">
								<li>Code must be 4 numbers</li>
							</ul>
						)}
					</form>
					<div className="flex flex-col gap-2 w-full justify-center items-center sm:flex-row">
						<button
							className="p-1 rounded-md w-full text-white bg-[#0E51FF]"
							onClick={handleUnlockingPin}
						>
							Access
						</button>
						<button
							className="p-1 rounded-md w-full text-white bg-red-500"
							onClick={() => setUnlockTodoFolder(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

const BeforeRemovingPinModal = ({
	todoFolder,
	handleBeforeRemovingPin,
	handleRemovePin,
}) => {
	const { user } = useContext(UserCredentialCtx);
	const [email, setEmail] = useState("");
	const [emailErrMesg, setEmailErrMesg] = useState("");
	const emailCheckRef = useRef();

	useEffect(() => {
		const closeBeforeDeletionModal = (e) => {
			if (!e.target.closest(".before-deletion-modal")) {
				handleBeforeRemovingPin();
			}
		};

		document.addEventListener("mousedown", closeBeforeDeletionModal);
		return () =>
			document.removeEventListener("mousedown", closeBeforeDeletionModal);
	}, []);

	const handleEmailCheck = () => {
		clearTimeout(emailCheckRef.current);

		if (email === user.email) {
			handleRemovePin();
			handleBeforeRemovingPin();
		} else {
			setEmailErrMesg("Email Don't Match");

			emailCheckRef.current = setTimeout(() => {
				setEmailErrMesg("");
			}, 5000);
		}
	};

	return (
		<>
			<div className="w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center text-center p-5">
				<div className="before-deletion-modal w-fit h-fit p-5 rounded-md flex flex-col gap-4 bg-white">
					{emailErrMesg && (
						<div className="w-full h-fit bg-red-500 text-white px-2 py-1 rounded-md">
							<p>{emailErrMesg}</p>
						</div>
					)}
					<div className="w-full flex flex-col justify-center items-center gap-1">
						<h1 className="text-2xl font-semibold">
							Are you sure you want to remove the pin from:
						</h1>
						<h3 className="text-xl italic">{todoFolder.folderTitle}</h3>
					</div>
					<div className="w-full h-fit flex flex-col justify-center items-center gap-2 mt-1">
						<div className="flex justify-center items-center gap-1">
							<Image
								className="w-auto min-h-[20px] max-h-[20px]"
								src={"/icons/info.svg"}
								alt="trash"
								width={30}
								height={30}
							/>
							<p className="text-sm">
								Confirm this is your account by entering in your email
							</p>
						</div>
						<input
							onChange={(e) => setEmail(e.target.value)}
							className="px-2 py-1 rounded-md bg-[#eee] border w-full"
							type="email"
							placeholder="Email"
							onKeyDown={(e) => (e.key === "Enter" ? handleEmailCheck() : null)}
						/>
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-center sm:flex-row">
						<button
							className="p-1 rounded-md w-full text-white bg-red-500"
							onClick={handleEmailCheck}
						>
							Remove Code
						</button>
						<button
							className="p-1 rounded-md w-full text-white bg-[#0E51FF]"
							onClick={handleBeforeRemovingPin}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

const TodoListFolderDeletionModal = ({
	handleDeletion,
	handleOpenDeletionTodoModal,
	todoFolder,
}) => {
	useEffect(() => {
		const closeDeletionModal = (e) => {
			if (!e.target.closest(".deletion-modal")) {
				handleOpenDeletionTodoModal();
			}
		};

		document.addEventListener("mousedown", closeDeletionModal);
		return () => document.removeEventListener("mousedown", closeDeletionModal);
	}, []);

	return (
		<>
			<div className="w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center text-center p-5">
				<div className="deletion-modal w-fit h-fit p-5 rounded-md flex flex-col gap-4 bg-white">
					<div className="w-full flex flex-col justify-center items-center gap-1">
						<h1 className="text-2xl font-semibold">
							Are you sure you want to delete:
						</h1>
						<h3 className="text-xl italic">{todoFolder.folderTitle}</h3>
					</div>
					<div className="flex flex-col gap-4 w-full justify-center items-center sm:flex-row">
						<button
							className="p-1 rounded-md w-full text-white bg-red-500"
							onClick={handleDeletion}
						>
							Delete
						</button>
						<button
							className="p-1 rounded-md w-full text-white bg-[#0E51FF]"
							onClick={handleOpenDeletionTodoModal}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

const TodoListAddingPinMode = ({
	todoFolder,
	handleAddPinModal,
	pinAddedIndicator,
	setPinAddedMesg,
}) => {
	const { todolistFolders } = FirebaseApi();
	const [showInfo, setShowInfo] = useState("");
	const [pin, setPin] = useState("");
	const [pinErrorMesg, setPinErrorMesg] = useState("");
	const checkPinRef = useRef();

	const handleAddPin = (e) => {
		e?.preventDefault();
		clearTimeout(checkPinRef.current);
		const checkPin = /[a-zA-Z]/.test(pin);

		clearTimeout(pinAddedIndicator.current);

		if (pin.length == 4 && !checkPin) {
			todolistFolders.updatingPin(todoFolder.id, pin);

			setPinAddedMesg("Code Added Successfully to: ");
			pinAddedIndicator.current = setTimeout(() => {
				setPinAddedMesg("");
			}, 5000);

			setPinErrorMesg("");
			handleAddPinModal();
		} else {
			setPinErrorMesg("Error: Check Information");
			checkPinRef.current = setTimeout(() => {
				setPinErrorMesg("");
			}, 4000);
		}
	};

	const handlePinChange = (e, pinNumber) => {
		e?.preventDefault();
		setPin(pinNumber);
	};

	useEffect(() => {
		const closeInfoModal = (e) => {
			if (!e.target.closest(".info-modal")) {
				setShowInfo(false);
			}
		};

		document.addEventListener("mousedown", closeInfoModal);
		return () => document.removeEventListener("mousedown", closeInfoModal);
	}, [setShowInfo]);

	useEffect(() => {
		const closeAddPinModal = (e) => {
			if (!e.target.closest(".add-pin-modal")) {
				handleAddPinModal();
			}
		};

		document.addEventListener("mousedown", closeAddPinModal);
		return () => document.removeEventListener("mousedown", closeAddPinModal);
	}, []);

	return (
		<>
			<div className="w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center text-center p-5">
				<form className="add-pin-modal w-fit h-fit p-5 rounded-md flex flex-col gap-4 bg-white">
					{pinErrorMesg && (
						<div className="w-full h-fit bg-red-500 text-white px-2 py-1 rounded-md">
							<p>{pinErrorMesg}</p>
						</div>
					)}
					<div className="w-full flex flex-col justify-center items-center gap-1">
						<h1 className="text-2xl font-semibold">Add a Code to:</h1>
						<h3 className="text-xl italic">{todoFolder.folderTitle}</h3>
					</div>
					<div className="flex justify-center items-center gap-2 relative">
						<input
							className="w-full px-2 py-1 rounded-md bg-[#eee] border text-center"
							onChange={(e) => {
								handlePinChange(e, e.target.value);
							}}
							type="text"
							maxLength={4}
							value={pin}
							placeholder="Ex: 1234"
							onKeyDown={(e) => (e.key == "Enter" ? handleAddPin(e) : null)}
						/>
						<button
							onClick={(e) => {
								e?.preventDefault();
								setShowInfo(!showInfo);
							}}
						>
							<Image
								className="w-auto min-h-[25px] max-h-[25px] text-btn"
								src={"/icons/info.svg"}
								alt="trash"
								width={30}
								height={30}
							/>
						</button>
						{showInfo && (
							<ul className="info-modal absolute top-8 right-0 pl-6 pr-4 py-2 w-fit h-fit rounded-md border bg-white text-black text-sm z-10 flex flex-col justify-center items-center gap-1 list-disc">
								<li>Code must be 4 numbers</li>
							</ul>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-center sm:flex-row">
						<button
							className="p-1 rounded-md w-full text-white bg-[#0E51FF]"
							onClick={handleAddPin}
						>
							Add
						</button>
						<button
							className="p-1 rounded-md w-full text-white bg-red-500"
							onClick={handleAddPinModal}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</>
	);
};
