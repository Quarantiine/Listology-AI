import React, { use, useContext, useEffect, useReducer, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import FirebaseApi from "../../pages/api/firebaseApi";

const reducer = (state, { type, payload }) => {
	switch (type) {
		case "input":
			return {
				...state,
				[payload.key]: payload.value,
			};
		default:
			console.log(`Unknown Action: ${type}-${payload}`);
	}
};

export default function TodolistSidebarModal({ setOpenTodolistSidebarModal }) {
	const { auth, folders } = FirebaseApi();
	const [inputState, inputDispatch] = useReducer(reducer, {
		folderTitle: "",
		folderDescription: "",
	});
	const [emoji, setEmoji] = useState("");
	const [openEmojiModal, setOpenEmojiModal] = useState(false);
	const [errorMesg, setErrorMesg] = useState(false);
	const errorMesgRef = useRef();
	const [showInfo, setShowInfo] = useState(false);

	useEffect(() => {
		const closeTodoListModal = (e) => {
			if (!e.target.closest(".todolist-sidebar-modal")) {
				setOpenTodolistSidebarModal(false);
			}
		};

		document.addEventListener("mousedown", closeTodoListModal);
		return () => document.removeEventListener("mousedown", closeTodoListModal);
	}, [setOpenTodolistSidebarModal]);

	useEffect(() => {
		const closeInfoPopUp = (e) => {
			if (!e.target.closest(".info-pop-up")) {
				setShowInfo(false);
			}
		};

		document.addEventListener("mousedown", closeInfoPopUp);
		return () => document.removeEventListener("mousedown", closeInfoPopUp);
	}, [showInfo]);

	useEffect(() => {
		const closeEmojiModal = (e) => {
			if (!e.target.closest(".emoji-modal")) {
				setOpenEmojiModal(false);
			}
		};

		document.addEventListener("mousedown", closeEmojiModal);
		return () => document.removeEventListener("mousedown", closeEmojiModal);
	}, [setOpenEmojiModal]);

	const handleInput = (e) => {
		inputDispatch({
			type: "input",
			payload: {
				key: e.target.name,
				value: e.target.value,
			},
		});
	};

	const handleErrorMesg = () => {
		setErrorMesg(true);
		errorMesgRef.current = setTimeout(() => {
			setErrorMesg(false);
		}, 3000);
	};

	const handleCreateFolder = (e) => {
		e.preventDefault();
		clearTimeout(errorMesgRef.current);
		if (
			emoji.native &&
			inputState.folderTitle &&
			!folders.allFolders
				.filter((value) => auth.currentUser.uid === value.userID)
				?.map((folder) => folder.folderName === inputState.folderName)
				.includes(true)
		) {
			// TODO: FIXED THE TODO FOLDER SYSTEM
			// folders. (emoji.native, inputState.folderTitle, inputState.folderDescription);
			setOpenTodolistSidebarModal(false);
		} else {
			handleErrorMesg();
		}
	};

	const handleEmojiModal = (e) => {
		e.preventDefault();
		setOpenEmojiModal(!openEmojiModal);
	};

	return (
		<>
			<div className="z-50 todolist-sidebar flex justify-center items-center fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]">
				<form className="todolist-sidebar-modal flex flex-col justify-center items-start gap-4 w-[80%] md:w-[40%] xl:w-[30%] h-fit p-5 bg-white rounded-md">
					{errorMesg && (
						<>
							<div className="w-full text-center relative h-fit p-2 bg-red-500 rounded-md text-white">
								<p>Error: Check your information</p>
							</div>
						</>
					)}
					<div className="flex justify-between items-center gap-2 relative w-full">
						<h1 className="text-2xl font-semibold">Create Folder</h1>
						<div className="hidden sm:block">
							{emoji ? (
								<button onClick={handleEmojiModal}>
									<p className="text-4xl">{emoji.native}</p>
								</button>
							) : (
								<button onClick={handleEmojiModal} className="w-10 h-10 rounded-full bg-gray-400" />
							)}
							{openEmojiModal && (
								<div
									className={`emoji-modal z-10 w-40 fixed top-64 left-1/2 -translate-x-1/2 sm:absolute sm:top-10 sm:right-0`}
								>
									<Picker dynamicWidth={false} data={data} onEmojiSelect={setEmoji} />
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col justify-center items-start gap-1 w-full">
						<div className="flex justify-center items-center gap-2">
							<label htmlFor="folder-title">Folder Title</label>
							<p className="text-sm text-gray-400">Required</p>
						</div>
						<input
							onChange={handleInput}
							className="px-2 py-1 rounded-md bg-gray-100 border w-full"
							type="text"
							name="folderTitle"
							placeholder="Title"
							value={inputState.folderTitle}
							required
						/>
					</div>
					<div className="flex flex-col justify-center items-start gap-1 w-full">
						<div className="flex justify-center items-center gap-2">
							<label htmlFor="folder-description">Folder Description</label>
							<p className="text-sm text-gray-400">Optional</p>
						</div>
						<textarea
							onChange={handleInput}
							placeholder="Description"
							type="text"
							className="px-2 py-1 rounded-md bg-gray-100 border w-full h-32 max-h-[200px]"
							name="folderDescription"
							value={inputState.folderDescription}
						></textarea>
					</div>
					<button onClick={handleCreateFolder} className="base-btn w-full" type="submit">
						Create Todo Folder
					</button>
				</form>
			</div>
		</>
	);
}
