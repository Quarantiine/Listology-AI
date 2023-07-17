import React, { useEffect, useReducer, useRef, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";

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

export default function FolderModal({ handleFolderCreation }) {
	const [inputState, inputDispatch] = useReducer(reducer, {
		folderName: "",
		folderTitle: "",
		folderDescription: "",
	});
	const { auth, folders } = FirebaseApi();
	const [openEmojiModal, setOpenEmojiModal] = useState(false);
	const [errorMesg, setErrorMesg] = useState(false);
	const errorMesgRef = useRef();
	const [showInfo, setShowInfo] = useState(false);

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
			inputState.folderName &&
			!folders.allFolders
				.filter((value) => auth.currentUser.uid === value.userID)
				?.map((folder) => folder.folderName === inputState.folderName)
				.includes(true)
		) {
			folders.addingFolder(inputState.folderName);
			handleFolderCreation();
		} else {
			handleErrorMesg();
		}
	};

	const handleInfo = (e) => {
		e.preventDefault();
		setShowInfo(!showInfo);
	};

	return (
		<>
			<div className="sidebar z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]">
				<form className="folder-modal flex flex-col justify-center items-start gap-4 w-[80%] md:w-[40%] xl:w-[30%] h-fit p-5 bg-white rounded-md">
					{errorMesg && (
						<>
							<div className="w-full text-center relative h-fit p-2 bg-red-500 rounded-md text-white">
								<p>Error: Check your information</p>
							</div>
						</>
					)}
					<div className="flex justify-between items-center gap-2 relative w-full">
						<h1 className="text-2xl font-semibold">Create Folder</h1>
					</div>
					<div className="flex flex-col justify-center items-start gap-1 w-full">
						<div className="flex justify-center items-center gap-2">
							<label htmlFor="folder-name">Folder Name</label>
							<p className="text-sm text-gray-400">Required</p>
							<div className="w-fit h-fit relative flex justify-center items-center">
								<div onClick={handleInfo} className="text-btn">
									<Image
										className="w-auto h-[18px]"
										src={"/icons/info.svg"}
										alt="info"
										width={20}
										height={20}
									/>
								</div>
								{showInfo && (
									<div className="info-pop-up absolute top-5 right-0 sm:left-0 bg-white w-36 h-fit p-2 rounded-md border shadow-md">
										<p className="text-sm">Folder Name should be unique</p>
									</div>
								)}
							</div>
						</div>
						<input
							onChange={handleInput}
							className="px-2 py-1 rounded-md bg-gray-100 border w-full"
							type="text"
							name="folderName"
							placeholder="Name"
							value={inputState.folderName}
							required
						/>
					</div>
					<button
						onClick={handleCreateFolder}
						className="base-btn w-full"
						type="submit"
					>
						Create Folder
					</button>
				</form>
			</div>
		</>
	);
}
