import Image from "next/image";
import { useContext, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";
import { createPortal } from "react-dom";
import { StateCtx } from "../Layout";

const AllFolders = ({ folder }) => {
	const { user } = useContext(UserCredentialCtx);
	const { folders } = FirebaseApi();
	const { openTodolistSidebar, setOpenTodolistSidebar } = useContext(StateCtx);
	const [completedFolder, setCompletedFolder] = useState(true);
	const [deleteWarning, setDeleteWarning] = useState(false);
	// folderName
	// folderEmoji
	// folderTitle
	// folderDescription

	const handleCompletedFolder = () => {
		folders.updatingCompletionFolder(folder.id, completedFolder);
		setCompletedFolder(!completedFolder);
	};

	const handleDeleteWarning = () => {
		setDeleteWarning(!deleteWarning);
	};

	const handleDeleteFolder = () => {
		folders.deletingFolder(folder.id);
		setOpenTodolistSidebar(false);
	};

	const handleTodolistSidebar = () => {
		setOpenTodolistSidebar(!openTodolistSidebar);
	};

	return (
		<>
			<div className="flex justify-between items-center gap-2">
				<button onClick={handleTodolistSidebar} className="flex justify-center items-center gap-2">
					<h1>{folder.folderName}</h1>
					<h1>{folder.folderEmoji}</h1>
				</button>

				<div className="flex justify-center items-center gap-2">
					<button onClick={handleCompletedFolder}>
						<Image
							className="w-auto h-[18px]"
							src={
								folder.completed
									? "/icons/completed-folder.svg"
									: user.themeColor
									? "/icons/checkbox-empty-white.svg"
									: "/icons/checkbox-empty-black.svg"
							}
							alt="selector"
							width={20}
							height={20}
						/>
					</button>
					{deleteWarning &&
						createPortal(
							<>
								<div className="sidebar flex z-50 justify-center items-center w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.8)]">
									<div className="w-fit h-fit p-5 rounded-md bg-white text-center flex flex-col gap-5">
										<div className="flex flex-col justify-center items-center gap-0">
											<h1 className="text-2xl font-semibold">Deleting Folder</h1>
											<p>Are you sure you want to delete?</p>
										</div>
										<div className="flex justify-center items-center gap-4">
											<button onClick={handleDeleteFolder} className="base-btn !bg-red-500">
												Delete
											</button>
											<button onClick={handleDeleteWarning} className="base-btn">
												Cancel
											</button>
										</div>
									</div>
								</div>
							</>,
							document.body
						)}
					<button onClick={handleDeleteWarning}>
						<Image className="w-auto h-[18px]" src={"/icons/trash.svg"} alt="trash" width={20} height={20} />
					</button>
				</div>
			</div>
		</>
	);
};

export default AllFolders;
