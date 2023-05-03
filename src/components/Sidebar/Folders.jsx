import React, { useContext, useEffect } from "react";
import FoldersPlaceholder from "./FoldersPlaceholder";
import Image from "next/image";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";
import AllFolders from "./AllFolders";

export default function Folders() {
	const { setOpenFolderModal, clickedFolder, setClickedFolder } = useContext(StateCtx);
	const { user } = useContext(UserCredentialCtx);
	const { auth, folders, todolistFolders } = FirebaseApi();

	return (
		<>
			<div
				className={`px-8 py-4 border-t-2 transition-colors duration-300 ${
					user.themeColor ? "border-[#333] text-white" : "border-gray-200 text-black"
				} folders-overflow w-full relative overflow-y-scroll overflow-x-hidden flex flex-col gap-3`}
			>
				<div className="flex justify-between items-center gap-1">
					<h1 className="text-2xl font-semibold">Main Folders</h1>
					<button onClick={() => setOpenFolderModal(true)} className="flex justify-center items-center relative">
						<Image
							className="w-auto h-[20px]"
							src={user.themeColor ? "/icons/plus-white.svg" : "/icons/plus-black.svg"}
							alt=""
							width={20}
							height={20}
						/>
					</button>
				</div>
				{folders.allFolders?.map((folder) => folder.userID === auth.currentUser.uid).includes(true) ? (
					folders.allFolders?.map((folder) => {
						if (folder.userID === auth.currentUser.uid) {
							return (
								<React.Fragment key={folder.id}>
									<AllFolders setClickedFolder={setClickedFolder} folder={folder} />
								</React.Fragment>
							);
						}
					})
				) : (
					<FoldersPlaceholder />
				)}
			</div>
		</>
	);
}
