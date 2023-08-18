import Image from "next/image";
import React, { useContext, useState } from "react";
import GalleryModal from "../MainContent/GalleryModal";
import { createPortal } from "react-dom";
import { StateCtx } from "../Layout";

export default function PersonalInfoSection({ user }) {
	const { openGalleryModal, setOpenGalleryModal, clickedImageLoading } =
		useContext(StateCtx);
	const [fullSize, setFullSize] = useState(false);

	const handleOpenGalleryModal = () => {
		setOpenGalleryModal(!openGalleryModal);
	};

	const handleFullSize = () => {
		setFullSize(!fullSize);
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
					<div className="w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center">
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
							></Image>
						</div>
					</div>,
					document.body
				)}

			<div className="w-full h-full flex flex-col gap-7 relative">
				<div className="w-full h-auto relative">
					<div className="flex justify-center items-center absolute top-1/2 -translate-y-1/2 left-5 z-10">
						{user.photoURL ? (
							<Image
								onClick={null}
								className={`object-cover rounded-full w-16 h-16 text-btn ${
									user.themeColor
										? "bg-[#333] border border-[#666]"
										: "bg-[#eee] border"
								}`}
								src={user.photoURL}
								alt={user.photoURL}
								width={80}
								height={80}
							/>
						) : (
							<div
								onClick={null}
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
	const [changeUsername, setChangeUsername] = useState(false);
	const [changeEmail, setChangeEmail] = useState(false);
	const [changePassword, setChangePassword] = useState(false);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleChangeEmail = (setChangeInput, changeInput) => {
		setChangeInput(!changeInput);
	};

	return (
		<>
			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end w-full gap-3">
				<div className="flex flex-col justify-center items-start w-full">
					<h1 className="text-lg font-semibold">Username</h1>
					{changeUsername ? (
						<input
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
								? null
								: handleChangeEmail(setChangeUsername, changeUsername)
						}
						className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white w-full sm:w-fit`}
					>
						Change
					</button>
					{changeUsername && (
						<button
							onClick={() =>
								handleChangeEmail(setChangeUsername, changeUsername)
							}
							className={`text-sm text-btn bg-red-500 px-2 py-1 rounded-md text-white w-full sm:w-fit`}
						>
							Cancel
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end w-full gap-3">
				<div className="flex flex-col justify-center items-start w-full">
					<h1 className="text-lg font-semibold">Email</h1>
					{changeEmail ? (
						<input
							className={`rounded-md px-2 py-1 w-full ${
								user.themeColor
									? "bg-[#444] border border-[#666]"
									: "bg-[#eee] border"
							}`}
							type="email"
							name="email"
							placeholder={user.email}
						/>
					) : (
						<p>{user.email}</p>
					)}
				</div>

				<div className="flex flex-col w-full sm:w-fit h-auto sm:flex-row justify-center items-center gap-2">
					<button
						onClick={() =>
							changeEmail
								? null
								: handleChangeEmail(setChangeEmail, changeEmail)
						}
						className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white w-full sm:w-fit`}
					>
						Change
					</button>
					{changeEmail && (
						<button
							onClick={() => handleChangeEmail(setChangeEmail, changeEmail)}
							className={`text-sm text-btn bg-red-500 px-2 py-1 rounded-md text-white w-full sm:w-fit`}
						>
							Cancel
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col sm:flex-row justify-start sm:justify-between sm:items-end gap-3 w-full">
				<div className="flex flex-col justify-center items-start">
					<h1 className="text-lg font-semibold">Password</h1>
					<p>*********</p>
				</div>
				<button
					onClick={null}
					className={`text-sm text-btn base-bg px-2 py-1 rounded-md text-white`}
				>
					Change
				</button>
			</div>
		</>
	);
};
