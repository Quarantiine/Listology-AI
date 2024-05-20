import React, { useContext, useEffect, useState } from "react";
import FirebaseAPI from "../../pages/api/firebaseApi.tsx";
import { createPortal } from "react-dom";
import { StateCtx } from "../Layout.jsx";

export default function DeleteAccount() {
	const { auth, registration, folders, todolistFolders, todoLists } =
		FirebaseAPI();
	const { navDispatch } = useContext(StateCtx);

	const [confirmDeletion, setConfirmDeletion] = useState(false);

	const handleConfirmDeletion = () => {
		setConfirmDeletion(!confirmDeletion);
	};

	const handleDeletion = () => {
		todoLists.allSubTodos
			.filter((value) => auth.currentUser?.uid === value.userID)
			?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));

		todoLists.allTodoLists
			.filter((value) => auth.currentUser?.uid === value.userID)
			?.map((todoList) => todoLists.deletingTodolist(todoList.id));

		todolistFolders.allTodoFolders
			.filter((value) => auth.currentUser?.uid === value.userID)
			?.map((todolistFolder) =>
				todolistFolders.deletingTodoFolder(todolistFolder.id)
			);

		folders.allFolders
			.filter((value) => auth.currentUser?.uid === value.userID)
			.map((folder) => folders.deletingFolder(folder.id));

		registration.allusers
			.filter((value) => auth.currentUser?.uid === value.userID)
			?.map((user) => registration.deletingRegistrationInfo(user.id));

		if (
			registration.allusers
				.filter((value) => auth.currentUser?.uid === value.userID)
				?.map((user) => user).length < 1
		) {
			navDispatch({
				type: "sidebar-navigation-link",
				payload: {
					key: "navigatorLink",
					value: "Dashboard",
				},
			});

			registration.deletingProfile();
		}
	};

	useEffect(() => {
		const closeDeletionModal = (e) => {
			if (!e.target.closest(".deletion-modal")) {
				setConfirmDeletion(false);
			}
		};

		document.addEventListener("mousedown", closeDeletionModal);
		return () => document.removeEventListener("mousedown", closeDeletionModal);
	}, []);

	return (
		<>
			{confirmDeletion &&
				createPortal(
					<>
						<div className="fixed z-50 flex flex-col justify-center items-center top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.8)] gap-5">
							<div className="deletion-modal bg-white w-[90%] sm:w-[400px] h-fit rounded-md p-5 flex flex-col justify-center items-center gap-4">
								<h1 className="text-2xl font-medium text-center">
									Are you sure you want to delete your account? This action is
									permanent and cannot be undone
								</h1>
								<div className="flex flex-col justify-center item-center gap-2 w-full">
									<button
										onClick={handleDeletion}
										className="!bg-red-500 base-btn"
									>
										Delete Account
									</button>
									<button onClick={handleConfirmDeletion} className="base-btn">
										Cancel
									</button>
								</div>
							</div>
						</div>
					</>,
					document.body
				)}

			<div className="w-full h-full flex flex-col gap-7 relative">
				<div className="w-full h-auto flex gap-5">
					<div className="flex flex-col gap-5 justify-start items-start">
						<h1 className="text-2xl text-gray-400 font-medium">
							Delete Account
						</h1>
						<p>
							Warning: Deleting your account is permanent. Once you confirm, you
							will lose access to all your data and content on our platform.
						</p>
						<button
							onClick={handleConfirmDeletion}
							className="!bg-red-500 base-btn"
						>
							Delete Account
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
