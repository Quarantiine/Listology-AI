import Image from "next/image";
import React, { useContext, useEffect, useState, useCallback } from "react";
import GalleryModal from "../MainContent/GalleryModal";
import { createPortal } from "react-dom";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import { useDropzone } from "react-dropzone";

export default function PersonalInfoSection({ user }) {
	const { openGalleryModal, setOpenGalleryModal, clickedImageLoading } =
		useContext(StateCtx);
	const { registration } = FirebaseApi();
	const [uploadProfileImage, setUploadProfileImage] = useState();

	const onDrop = useCallback((acceptedFiles) => {
		const reader = new FileReader();

		reader.onload = () => {
			setUploadProfileImage(reader.result);
		};

		reader.readAsDataURL(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps, fileRejections } = useDropzone({
		onDrop,
		maxSize: 1048487,
		maxFiles: 1,
	});

	const [fullSize, setFullSize] = useState(false);
	const [uploadModal, setUploadModal] = useState(false);

	const handleOpenGalleryModal = () => {
		setOpenGalleryModal(!openGalleryModal);
	};

	const handleFullSize = () => {
		setFullSize(!fullSize);
	};

	const handleUploadModal = () => {
		setUploadModal(!uploadModal);
	};

	useEffect(() => {
		const closeUploadModal = (e) => {
			if (!e.target.closest(".upload-modal")) {
				setUploadModal(false);
				setUploadProfileImage("");
			}
		};

		document.addEventListener("mousedown", closeUploadModal);
		return () => document.removeEventListener("mousedown", closeUploadModal);
	}, []);

	const handleSubmitImage = () => {
		registration.updatingProfileImage(uploadProfileImage, user.id);
		setUploadModal(false);
		setUploadProfileImage("");
	};

	const fileRejectionSystem = () => {
		const sizeInMB = fileRejections[0]?.file.size / 1048576;

		if (fileRejections.length > 0) {
			return `File (${fileRejections[0]?.file.name.slice(
				0,
				10
			)}...) is larger than 1 MB. Image File size: ${sizeInMB.toFixed(1)} MB`;
		}
		return false;
	};

	return (
		<>
			{clickedImageLoading &&
				createPortal(
					<div className="image-loading-indicator w-full h-fit px-10 py-2 bg-green-500 text-white fixed left-1/2 -translate-x-1/2 z-50 flex justify-center items-center text-center">
						<p className="">(Successful) Your Picture is Arriving...</p>
					</div>,
					document.body
				)}

			{fullSize &&
				createPortal(
					<div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.7)] z-[101] flex justify-center items-center">
						<div className="w-[90%] h-[90%] bg-white rounded-md relative">
							<Image
								onClick={handleFullSize}
								className="w-auto min-h-[30px] max-h-[30px] text-btn absolute top-2 right-3 bg-white p-1 rounded-full z-10"
								src={"/icons/close-image.svg"}
								alt="open"
								width={35}
								height={35}
							/>

							<Image
								className="object-contain lg:object-cover rounded-md"
								src={user.bannerImage}
								alt={user.bannerImage}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
							></Image>
						</div>
					</div>,
					document.body
				)}

			{uploadModal &&
				createPortal(
					<>
						<div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-[rgb(0,0,0,0.7)] z-50 p-10">
							<div className="w-80 h-fit rounded-md p-5 bg-white upload-modal flex flex-col justify-center items-center gap-4">
								{fileRejectionSystem() && (
									<h1 className="bg-red-500 w-full rounded-md text-center py-1 px-2 text-white">
										{fileRejectionSystem()}
									</h1>
								)}
								<div className="flex flex-col justify-center items-center gap-2 w-full">
									<h1 className="text-2xl font-semibold">Upload Image</h1>
									<p className="text-sm text-gray-500 text-center">
										Image size needs to be 1 MB or less
									</p>
								</div>

								<div className="flex flex-col justify-center items-center gap-3 w-full">
									<div
										className="flex flex-col justify-center items-center gap-3 w-full"
										{...getRootProps()}
									>
										{uploadProfileImage ? (
											<div className="bg-gray-300 rounded-md text-btn relative w-full h-full">
												<Image
													className="w-full h-auto rounded-md text-btn relative object-cover object-center"
													src={uploadProfileImage}
													alt="uploaded image"
													width={160}
													height={160}
												/>
											</div>
										) : (
											<div className="w-full h-40 p-2 bg-gray-300 rounded-md text-btn relative">
												<input {...getInputProps()} />
												<p className="text-gray-500 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
													Click
												</p>
											</div>
										)}
									</div>

									<button
										className="base-btn w-full"
										onClick={handleSubmitImage}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</>,
					document.body
				)}

			<div className="w-full h-full flex flex-col gap-7 relative">
				<h1 className="text-2xl text-gray-400 font-medium">
					Personal Information
				</h1>

				<div className="w-full h-auto relative">
					<div className="flex justify-center items-center absolute top-1/2 -translate-y-1/2 left-5 z-10">
						{user.profileImage ? (
							<Image
								onClick={handleUploadModal}
								className={`object-cover rounded-full w-16 h-16 text-btn ${
									user.themeColor
										? "bg-[#333] border border-[#666]"
										: "bg-[#eee] border"
								}`}
								src={user.profileImage}
								alt={user.profileImage}
								width={80}
								height={80}
							/>
						) : (
							<div
								onClick={handleUploadModal}
								className={`rounded-full w-16 h-16 text-btn flex justify-center items-center ${
									user.themeColor
										? "bg-[#333] border border-[#666]"
										: "bg-[#eee] border"
								}`}
							>
								<p
									className={`text-sm font-bold ${
										user.themeColor ? "text-[#555]" : "text-[#999]"
									}`}
								>
									IMAGE
								</p>
							</div>
						)}
					</div>

					{user.bannerImage ? (
						<div className="relative w-full h-auto">
							<button
								onClick={handleOpenGalleryModal}
								className="w-full h-32 relative text-btn"
							>
								<Image
									className="object-cover rounded-md"
									src={user.bannerImage}
									alt={user.bannerImage}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
								></Image>
							</button>

							<Image
								onClick={handleFullSize}
								className="w-auto min-h-[30px] max-h-[30px] text-btn absolute bottom-2 right-3 bg-white p-1 rounded-full"
								src={"/icons/open-image.svg"}
								alt="open"
								width={35}
								height={35}
							/>
						</div>
					) : (
						<>
							<button
								onClick={handleOpenGalleryModal}
								className={`text-btn w-full h-20 rounded-md flex justify-center items-center p-3 ${
									user.themeColor ? "bg-[#444]" : "bg-[#ccc]"
								}`}
							>
								<p
									className={`font-bold ${
										user.themeColor ? "text-[#666]" : "text-[#aaa]"
									}`}
								>
									BANNER IMAGE
								</p>
							</button>
						</>
					)}

					{openGalleryModal &&
						createPortal(
							<GalleryModal
								openGalleryModal={openGalleryModal}
								setOpenGalleryModal={setOpenGalleryModal}
							/>,
							document.body
						)}
				</div>

				<ChangingInfoSection user={user} />
			</div>
		</>
	);
}

const ChangingInfoSection = ({ user }) => {
	const { registration } = FirebaseApi();
	const [username, setUsername] = useState("");
	const [changeUsername, setChangeUsername] = useState(false);
	const [email, setEmail] = useState("");
	const [changingEmail, setChangingEmail] = useState(false);
	const [countDownDisplay, setCountDownDisplay] = useState("");

	const currentDate = new Date();
	const emailChangeWaitTime = new Date();
	emailChangeWaitTime.setDate(emailChangeWaitTime.getDate() + 1);
	emailChangeWaitTime.setHours(16); // Set the desired hour (in 24-hour format)
	emailChangeWaitTime.setMinutes(0); // Set the desired minute
	emailChangeWaitTime.setSeconds(0); // Set the desired second

	const handleChangeInputs = (setChangeInput, changeInput) => {
		setChangeInput(!changeInput);
	};

	const handleOnChangUsername = (e) => {
		setUsername(e.target.value);
	};

	const handleUsernameChange = () => {
		const usernameCheck = () => {
			if (username) {
				return true;
			}
			return false;
		};

		if (usernameCheck()) {
			registration.updatingUsername(username, user.id);
			setChangeUsername(false);
			setUsername("");
		}
	};

	const handleChangingEmail = () => {
		setChangingEmail(!changingEmail);
	};

	const handleChangeUserEmail = () => {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			registration.updatingUserEmail(email);
		}
	};

	function calculateTimeDifference(currentTime, desiredTime) {
		const timeDifference = desiredTime - currentTime;
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
		const minutes = Math.floor(
			(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
		);
		const hours = Math.floor(
			(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

		return {
			days,
			hours,
			minutes,
			seconds,
		};
	}

	function updateCountdownDisplay(currentTime, desiredTime) {
		const timeDifference = calculateTimeDifference(currentTime, desiredTime);
		setCountDownDisplay(timeDifference);
	}

	const countdownInterval = setInterval(() => {
		const currentTime = new Date();
		updateCountdownDisplay(currentTime, emailChangeWaitTime);
	}, 1000);

	useEffect(() => {
		if (currentDate > emailChangeWaitTime) {
			clearTimeout(countdownInterval);
		}
	}, [currentDate, countdownInterval]);

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end w-full gap-3">
				<div className="flex flex-col justify-center items-start w-full">
					<h1 className="text-lg font-semibold">Username</h1>
					{changeUsername ? (
						<input
							onChange={handleOnChangUsername}
							onKeyDown={(e) =>
								e.key == "Enter" ? handleUsernameChange() : null
							}
							className={`rounded-md px-2 py-1 w-full ${
								user.themeColor
									? "bg-[#444] border border-[#666]"
									: "bg-[#eee] border"
							}`}
							type="text"
							name="username"
							placeholder={user.username}
						/>
					) : (
						<p>{user.username}</p>
					)}
				</div>

				<div className="flex flex-col w-full sm:w-fit h-auto sm:flex-row justify-center items-center gap-2">
					<button
						onClick={() =>
							changeUsername
								? handleUsernameChange()
								: handleChangeInputs(setChangeUsername, changeUsername)
						}
						className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white w-full sm:w-fit`}
					>
						Change
					</button>
					{changeUsername && (
						<button
							onClick={() =>
								handleChangeInputs(setChangeUsername, changeUsername)
							}
							className={`text-sm text-btn bg-red-500 px-2 py-1 rounded-md text-white w-full sm:w-fit`}
						>
							Cancel
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end gap-3 w-full">
				<div className="flex flex-col justify-center items-start w-full">
					<h1 className="text-lg font-semibold">Email</h1>
					<p>{user.email}</p>
					<p
						className={`text-sm pt-1 ${
							user.themeColor ? "text-[#888]" : "text-gray-500"
						}`}
					>
						Takes up to 24 hours for visible change{" "}
						{/* <span className="">{`| ${countDownDisplay.days}d, ${countDownDisplay.hours}h`}</span> */}
					</p>

					{changingEmail && (
						<div className="flex flex-col justify-center items-start pt-1 w-full">
							<label className="text-gray-400" htmlFor="new-email">
								New Email:
							</label>

							<input
								className={`px-2 p-1 rounded-md outline-none border w-full ${
									user.themeColor
										? "bg-[#222] border-[#444]"
										: "bg-[#eee] border-gray-200"
								}`}
								type="text"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="example123@example.com"
							/>
						</div>
					)}
				</div>

				{/* currentDate > emailChangeWaitTime */}
				{/* {true && (
					<>
						{changingEmail ? (
							<div className="flex flex-col sm:flex-row justify-start items-start sm:justify-end sm:items-end gap-2 w-full">
								<button
									onClick={handleChangeUserEmail}
									className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white w-full sm:w-auto`}
								>
									Change
								</button>
								<button
									onClick={handleChangingEmail}
									className={`text-sm text-btn bg-red-500 px-2 py-1 rounded-md text-white w-full sm:w-auto`}
								>
									Cancel
								</button>
							</div>
						) : (
							<button
								onClick={handleChangingEmail}
								className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white`}
							>
								Change
							</button>
						)}
					</>
				)} */}
			</div>

			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end gap-3 w-full">
				<div className="flex flex-col justify-center items-start">
					<h1 className="text-lg font-semibold">Password</h1>
					<p>************</p>
					<p
						className={`text-sm ${
							user.themeColor ? "text-[#888]" : "text-gray-500"
						}`}
					>
						To change your password, logout and click {"forget password"}
					</p>
				</div>
			</div>
		</>
	);
};
