import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import FirebaseAPI from "../../pages/api/firebaseApi";
import Link from "next/link";

export default function SavedLinks({ user }) {
	const { auth, personalURLsSystem } = FirebaseAPI();
	const [errMessage, setErrMessage] = useState("");
	const [openSavedLinks, setOpenSavedLinks] = useState(false);
	const [openSaveLinkModal, setOpenSaveLinkModal] = useState(false);
	const [URLText, setURLText] = useState("");
	const [URLTitle, setURLTitle] = useState("");
	const [initiateSearch, setInitiateSearch] = useState(false);
	const [searchResults, setSearchResults] = useState("");

	const errMessageRef = useRef();

	const handleOpenSavedLinks = () => {
		setOpenSavedLinks(!openSavedLinks);
	};

	const handleOpenSaveLinkModal = () => {
		setOpenSaveLinkModal(!openSaveLinkModal);
		setOpenSavedLinks(false);
	};

	useEffect(() => {
		const closeSavedLinks = (e) => {
			if (!e.target.closest(".saved-links")) {
				setOpenSavedLinks(false);
			}
		};

		document.addEventListener("mousedown", closeSavedLinks);
		return () => document.removeEventListener("mousedown", closeSavedLinks);
	}, []);

	useEffect(() => {
		const closeSaveLinkModal = (e) => {
			if (!e.target.closest(".saved-links-modal")) {
				setOpenSaveLinkModal(false);
			}
		};

		document.addEventListener("mousedown", closeSaveLinkModal);
		return () => document.removeEventListener("mousedown", closeSaveLinkModal);
	}, []);

	const handleURL = (e) => {
		e.preventDefault();
		clearTimeout(errMessageRef.current);

		function isValidUrl() {
			const urlRegex = /https?:\/\/[^\s]+/g;
			const url = URLText.match(urlRegex);

			return url;
		}

		if (isValidUrl() && URLTitle) {
			personalURLsSystem.addURL(URLText, URLTitle);
			setOpenSaveLinkModal("");
			setURLText("");
			setURLTitle("");

			clearTimeout(errMessageRef.current);
			setErrMessage("");
		} else {
			setErrMessage("Check Information");

			errMessageRef.current = setTimeout(() => {
				setErrMessage("");
			}, 4000);
		}
	};

	const handleInitiateSearch = () => {
		setInitiateSearch(!initiateSearch);
	};

	return (
		<>
			<div
				className={`transition-colors duration-300 flex-col gap-6 w-full mt-auto px-8 py-4 flex justify-start items-center relative ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<button
					onClick={handleOpenSavedLinks}
					className="saved-links flex justify-center items-center base-btn w-full"
				>
					Saved Links
				</button>

				{openSaveLinkModal &&
					createPortal(
						<>
							<div className="sidebar absolute top-0 left-0 w-full h-full z-50 bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
								<div className="saved-links-modal saved-links-overflow w-[300px] h-fit rounded-lg bg-white px-4 pt-2 pb-4 overflow-y-scroll overflow-x-hidden gap-2 flex flex-col justify-center items-start relative">
									{errMessage && (
										<p className="text-center bg-red-500 text-white px-2 py-1 rounded-md w-full mb-2">
											{errMessage}
										</p>
									)}

									<div className="flex flex-col justify-center items-start w-full">
										<div className="flex justify-between items-center gap-1 w-full">
											<h1 className="text-lg font-bold">Add URL</h1>
											<button
												onClick={handleOpenSaveLinkModal}
												className="saved-links-modal text-btn"
											>
												<Image
													className=""
													src={"/icons/close.svg"}
													alt="icon"
													width={20}
													height={20}
												/>
											</button>
										</div>

										<p className="text-sm text-gray-500">Must be a valid URL</p>
									</div>

									<form className="flex flex-col gap-2 justify-center items-center w-full">
										<input
											className="input-field"
											placeholder="Google"
											type="text"
											name="title"
											onChange={(e) => setURLTitle(e.target.value)}
										/>

										<input
											className="input-field"
											placeholder="https://google.com"
											type="url"
											name="link"
											onChange={(e) => setURLText(e.target.value)}
										/>

										<button className="base-btn w-full" onClick={handleURL}>
											Add URL
										</button>
									</form>
								</div>
							</div>
						</>,
						document.body,
					)}

				{openSavedLinks && (
					<div className="saved-links saved-links-overflow absolute top-16 left-1/2 -translate-x-1/2 w-[80%] min-h-[50px] max-h-[150px] bg-white shadow-md rounded-lg text-black px-3 py-2 overflow-y-scroll overflow-x-hidden">
						{!initiateSearch && (
							<>
								<div className="flex flex-row justify-between items-center gap-1 w-full">
									<h1 className="text-lg font-bold">Links</h1>

									<div className="flex justify-center items-center gap-1">
										<button
											onClick={handleInitiateSearch}
											className="saved-links-modal text-btn hidden sm:block"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												x="0px"
												y="0px"
												width="18"
												height="18"
												viewBox="0 0 24 24"
											>
												<path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
											</svg>
										</button>

										<button
											onClick={handleOpenSaveLinkModal}
											className="saved-links-modal text-btn hidden sm:block"
										>
											<Image
												className="rotate-45"
												src={"/icons/close.svg"}
												alt="icon"
												width={20}
												height={20}
											/>
										</button>
									</div>
								</div>

								<p className="text-sm">Save links for easy access</p>
							</>
						)}

						{initiateSearch && (
							<div className="flex flex-col w-full hidden sm:block">
								<div className="flex justify-between items-center">
									<h1 className="text-lg font-bold">Search</h1>

									<button
										onClick={handleInitiateSearch}
										className="saved-links-modal text-btn hidden sm:block"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											x="0px"
											y="0px"
											width="18"
											height="18"
											viewBox="0 0 24 24"
										>
											<path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
										</svg>
									</button>
								</div>

								<input
									className="px-2 py-1 rounded-md text-sm bg-gray-100 w-full outline-none"
									type="search"
									name="search"
									placeholder="Search Links"
									onChange={(e) => setSearchResults(e.target.value)}
								/>
							</div>
						)}

						<div className="flex flex-col justify-center items-start mt-2">
							{personalURLsSystem.allPersonalURLs
								.filter(
									(value) =>
										value.uid === auth.currentUser.uid &&
										value.title
											.normalize("NFD")
											.replace(/\p{Diacritic}/gu, "")
											.toLowerCase()
											.includes(searchResults.toLowerCase()),
								)
								.map((personalURL) => personalURL).length > 0 ? (
								<>
									{personalURLsSystem.allPersonalURLs
										.filter((value) => value.uid === auth.currentUser.uid)
										.map((personalURL) => {
											if (
												personalURL.title
													.normalize("NFD")
													.replace(/\p{Diacritic}/gu, "")
													.toLowerCase()
													.includes(searchResults.toLowerCase())
											) {
												return (
													<URLDeletionSystem
														key={personalURL.id}
														personalURLsSystem={personalURLsSystem}
														personalURL={personalURL}
													/>
												);
											}
										})}
								</>
							) : (
								<p className="text-gray-500">No Links</p>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

const URLDeletionSystem = ({ personalURLsSystem, personalURL }) => {
	const handleDeleteURL = () => {
		personalURLsSystem.deleteURL(personalURL.id);
	};

	return (
		<>
			<div className="flex justify-between items-center gap-1 w-full">
				<Link
					href={personalURL.url}
					target="_blank"
					className="text-btn w-full text-start line-clamp-1"
					title={personalURL.title}
				>
					{personalURL.title}
				</Link>

				<Image
					onClick={handleDeleteURL}
					className="text-btn"
					src={"/icons/trash.svg"}
					alt="icon"
					width={12}
					height={12}
				/>
			</div>
		</>
	);
};
