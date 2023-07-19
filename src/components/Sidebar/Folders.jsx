import React, { useContext, useState } from "react";
import FoldersPlaceholder from "./FoldersPlaceholder";
import Image from "next/image";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";
import AllFolders from "./AllFolders";

export default function Folders({ handleCloseSidebar }) {
	const { setOpenFolderModal, setClickedFolder, navState } =
		useContext(StateCtx);
	const { user } = useContext(UserCredentialCtx);
	const { auth, folders } = FirebaseApi();
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<>
			{navState.navigatorLink !== "Settings" && (
				<div
					className={`border-t-2 transition-colors duration-300 py-4 folders-overflow w-full relative overflow-y-scroll overflow-x-hidden flex flex-col gap-5 ${
						user.themeColor
							? "border-[#333] text-white"
							: "border-gray-200 text-black"
					} ${navState.navigatorLink === "Settings" ? "px-4" : "px-8"}`}
				>
					<>
						<div className="flex justify-between items-center gap-1">
							<div className="flex justify-between items-center gap-2">
								<h1 className="text-2xl font-semibold">Main Folders</h1>
							</div>
							<div className="flex justify-end items-center relative gap-2">
								<button className="text-btn flex justify-center items-center">
									<Image
										onClick={() => setOpenFolderModal(true)}
										className="w-auto min-h-[20px] max-h-[20px]"
										src={
											user.themeColor
												? "/icons/plus-white.svg"
												: "/icons/plus-black.svg"
										}
										alt="add"
										width={25}
										height={25}
									/>
								</button>
								<button
									className="w-fit h-fit relative text-btn"
									onClick={handleCloseSidebar}
								>
									{!user.themeColor ? (
										<Image
											src={"/icons/menu-open.svg"}
											alt="menu"
											width={25}
											height={25}
										/>
									) : (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="25"
											viewBox="0 96 960 960"
											width="25"
											fill="white"
										>
											<path d="M150 816q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 756h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 816H150Zm0-212q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 544h340q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T490 604H150Zm0-208q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T150 336h460q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T610 396H150Zm545 179 125 125q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L630 596q-9-9-9-21t9-21l146-146q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L695 575Z" />
										</svg>
									)}
								</button>
							</div>
						</div>

						<div className="flex flex-col justify-center items-start gap-5">
							{folders.allFolders
								?.filter((value) => value.userID === auth.currentUser?.uid)
								?.map((folder, index) => index + 1 > 5)
								.includes(true) && (
								<div className="w-full h-auto flex justify-start items-center gap-3 relative">
									<>
										{user.themeColor ? (
											<svg
												className="w-auto min-h-[18px] max-h-[18px] absolute top-1/2 -translate-y-1/2 left-3"
												width="20"
												height="20"
												viewBox="0 0 27 27"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"
													fill="white"
												/>
											</svg>
										) : (
											<svg
												className="w-auto min-h-[18px] max-h-[18px] absolute top-1/2 -translate-y-1/2 left-3"
												width="20"
												height="20"
												viewBox="0 0 27 27"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M19.2967 16.9811H18.0772L17.6449 16.5643C19.1578 14.8045 20.0686 12.5197 20.0686 10.0343C20.0686 4.49228 15.5763 0 10.0343 0C4.49228 0 0 4.49228 0 10.0343C0 15.5763 4.49228 20.0686 10.0343 20.0686C12.5197 20.0686 14.8045 19.1578 16.5643 17.6449L16.9811 18.0772V19.2967L24.6998 27L27 24.6998L19.2967 16.9811ZM10.0343 16.9811C6.19039 16.9811 3.08748 13.8782 3.08748 10.0343C3.08748 6.19039 6.19039 3.08748 10.0343 3.08748C13.8782 3.08748 16.9811 6.19039 16.9811 10.0343C16.9811 13.8782 13.8782 16.9811 10.0343 16.9811Z"
													fill="black"
												/>
											</svg>
										)}
									</>
									<input
										className={`w-full text-white pl-10 pr-2 py-1 rounded-md outline-none ${
											user.themeColor ? "bg-[#333]" : "bg-[#eee]"
										}`}
										type="search"
										name="search"
										placeholder="Search by main folders"
										onChange={(e) => setSearchQuery(e.target.value)}
										value={searchQuery}
									/>
								</div>
							)}

							<div className="flex flex-col justify-center items-start">
								{folders.allFolders
									?.map((folder) => folder.userID === auth.currentUser?.uid)
									.includes(true) ? (
									folders.allFolders?.map((folder) => {
										if (folder.userID === auth.currentUser?.uid) {
											if (
												folder.folderName
													.normalize("NFD")
													.replace(/\p{Diacritic}/gu, "")
													.toLowerCase()
													.includes(searchQuery.toLowerCase())
											) {
												return (
													<React.Fragment key={folder.id}>
														<AllFolders
															setClickedFolder={setClickedFolder}
															folder={folder}
														/>
													</React.Fragment>
												);
											}
										}
									})
								) : (
									<FoldersPlaceholder />
								)}
							</div>
						</div>
					</>
				</div>
			)}
		</>
	);
}
