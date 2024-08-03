import React, { useEffect, useReducer, useRef, useState } from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import ActivitySection from "./ActivitySection";
import DeleteAccount from "./DeleteAccount";
import FirebaseApi from "../../pages/api/firebaseApi";

const navigatorReducer = (state, { type, payload }) => {
	switch (type) {
		case "navigator":
			return {
				...state,
				[payload.key]: payload.value,
			};

		default:
			console.log(`Unknown Type ${type}`);
	}
};

export default function Settings({ user }) {
	const {
		auth,
		savedUserUIDs: { allSavedUsers, deletingUserUID, blockUser, savingUserUID },
		registration,
	} = FirebaseApi();

	const [userUIDText, setUserUIDText] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [searchUIDByUsername, setSearchUIDByUsername] = useState("");

	const errorMessageRef = useRef();

	const [navigatorState, navigatorDispatch] = useReducer(navigatorReducer, {
		navigate: "Personal Info",
	});

	const handleNavigation = (value) => {
		navigatorDispatch({
			type: "navigator",
			payload: {
				key: "navigate",
				value: value,
			},
		});
	};

	const handleSaveUserUID = (e) => {
		e.preventDefault();
		clearTimeout(errorMessageRef.current);

		const username = registration.allusers
			?.filter(
				(value) =>
					value.userID !== auth?.currentUser?.uid &&
					value.userID === userUIDText
			)
			?.map((value) => value.username)
			.toString();

		const userAccountID = registration.allusers
			?.filter(
				(value) =>
					value.userID !== auth?.currentUser?.uid && value.userID == userUIDText
			)
			?.map((value) => value.userID)
			.toString();

		const checkAlreadyHaveUserUID = allSavedUsers
			?.filter(
				(value) =>
					value.uid === auth?.currentUser?.uid &&
					value.accountUID === userUIDText
			)
			?.map((value) => value.accountUID === userUIDText)
			.includes(true);

		const checkAccountUIDExist = registration.allusers
			?.filter((value) => value.userID !== auth?.currentUser?.uid)
			?.map((value) => value.userID === userUIDText)
			.includes(true);

		if (
			!checkAlreadyHaveUserUID &&
			userUIDText !== auth?.currentUser?.uid &&
			userUIDText.length > 0 &&
			checkAccountUIDExist
		) {
			setUserUIDText("");
			savingUserUID(username, userAccountID);
		} else {
			userUIDText === "" && setErrorMessage("Error: Empty Input");

			userUIDText === user.userID &&
				setErrorMessage("Error: Can't save your own UID");

			checkAlreadyHaveUserUID &&
				userUIDText !== "" &&
				checkAccountUIDExist &&
				setErrorMessage("Error: User UID already exist");

			checkAccountUIDExist === false &&
				userUIDText !== "" &&
				userUIDText !== user.userID &&
				setErrorMessage("Error: User UID Doesn't Exist");

			errorMessageRef.current = setTimeout(() => {
				setErrorMessage("");
			}, 4000);
		}
	};

	return (
		<>
			<div
				className={`px-10 pb-10 pt-16 mr-auto mb-auto flex flex-col gap-10 relative main-content-overflow w-full h-full overflow-y-scroll justify-center items-center overflow-x-hidden ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<div className="w-full md:w-[90%] lg:w-[80%] xl:w-[900px] h-full margin-auto flex flex-col gap-6 sm:gap-10">
					<h1 className="text-2xl font-semibold">Settings</h1>
					<div className="flex flex-col sm:flex-row justify-between items-start gap-10 pb-16">
						<div
							className={`w-full sm:w-[200px] h-[80px] sm:h-[400px] sm:max-h-[400px] rounded-md sticky -top-10 flex flex-row sm:flex-col justify-start item-center px-4 py-3 gap-2 sm:gap-1 z-40 overflow-x-scroll overflow-y-hidden settings-overflow ${
								user.themeColor
									? "bg-[#333] border border-[#555]"
									: "bg-[#eee] border"
							}`}
						>
							<button
								onClick={(e) => handleNavigation(e.target.textContent)}
								className={`w-fit sm:w-full transition-all px-2 py-1 text-start whitespace-nowrap ${
									navigatorState.navigate === "Personal Info"
										? "base-bg text-white rounded-md"
										: ""
								}`}
							>
								Personal Info
							</button>

							<button
								onClick={(e) => handleNavigation(e.target.textContent)}
								className={`w-fit sm:w-full transition-all px-2 py-1 text-start whitespace-nowrap ${
									navigatorState.navigate === "Saved UIDs"
										? "base-bg text-white rounded-md"
										: ""
								}`}
							>
								Saved UIDs
							</button>
						</div>

						<div className="w-full h-full">
							{navigatorState.navigate === "Personal Info" && (
								<>
									<PersonalInfoSection user={user} />
								</>
							)}

							{navigatorState.navigate === "Saved UIDs" && (
								<>
									<div className="w-full h-full flex flex-col gap-7 relative">
										<h1 className="text-2xl text-gray-400 font-medium px-3">
											Saved User UIDs
										</h1>

										<form className="flex flex-col w-full gap-2 px-4">
											{errorMessage && (
												<div className="bg-red-500 px-2 py-1 text-white rounded-lg w-full">
													<p className="text-center">{errorMessage}</p>
												</div>
											)}

											<h1>Add User UID</h1>
											<input
												onChange={(e) => setUserUIDText(e.target.value)}
												className="input-field w-full text-black"
												placeholder="AI09cy9q8dJUIUGuj839u3boishe96"
												type="text"
												value={userUIDText}
											/>

											<button onClick={handleSaveUserUID} className="base-btn">
												Add
											</button>
										</form>

										<div className="flex flex-col gap-2 justify-start items-start w-full">
											{allSavedUsers
												?.filter(
													(value) => value.uid === auth?.currentUser?.uid
												)
												?.map((value) => value).length > 4 && (
												<div className="flex flex-col justify-start items-start gap-1 px-3 w-full">
													<h1>Search Users</h1>
													<input
														onChange={(e) =>
															setSearchUIDByUsername(e.target.value)
														}
														className="input-field w-full text-black"
														placeholder="Search by username"
														type="search"
														value={searchUIDByUsername}
													/>
												</div>
											)}

											{allSavedUsers
												?.filter(
													(value) =>
														value.uid === auth.currentUser.uid && !value.blocked
												)
												?.map((value) => {
													if (
														value?.username
															?.normalize("NFD")
															.replace(/\p{Diacritic}/gu, "")
															.toLowerCase()
															.includes(searchUIDByUsername.toLowerCase())
													) {
														return (
															<UserUIDs
																key={value.id}
																value={value}
																user={user}
															/>
														);
													}
												})}

											{allSavedUsers
												?.filter(
													(value) =>
														value.uid === auth.currentUser.uid && value.blocked
												)
												?.map((value) => {
													if (
														value?.username
															?.normalize("NFD")
															.replace(/\p{Diacritic}/gu, "")
															.toLowerCase()
															.includes(searchUIDByUsername.toLowerCase())
													) {
														return (
															<BlockedUserUIDs
																key={value.id}
																value={value}
																user={user}
															/>
														);
													}
												})}

											{allSavedUsers
												?.filter(
													(value) =>
														value.uid === auth.currentUser.uid &&
														value?.username
															?.normalize("NFD")
															.replace(/\p{Diacritic}/gu, "")
															.toLowerCase()
															.includes(searchUIDByUsername.toLowerCase())
												)
												?.map((value) => value).length < 1 && (
												<p
													className={`px-3 ${
														user.themeColor ? "text-[#555]" : "text-gray-500"
													}`}
												>
													No User UIDs
												</p>
											)}
										</div>
									</div>
								</>
							)}

							{navigatorState.navigate === "Activity" && (
								<>
									<ActivitySection />
								</>
							)}

							{navigatorState.navigate === "Delete Account" && (
								<>
									<DeleteAccount />
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const UserUIDs = ({ value, user }) => {
	const {
		savedUserUIDs: { deletingUserUID, blockUser },
	} = FirebaseApi();
	const [copied, setCopied] = useState(false);
	const copiedRef = useRef();

	const handleDeleteSavedUser = () => {
		deletingUserUID(value.id);
	};

	const handleCopyButton = () => {
		clearTimeout(copiedRef.current);
		setCopied(true);

		navigator.clipboard.writeText(value.accountUID);
		copiedRef.current = setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	const handleBlockUser = () => {
		blockUser(value.blocked ? !value.blocked : true, value.id);
	};

	return (
		<div
			className={`flex flex-col sm:flex-row gap-2 sm:gap-1 justify-start sm:justify-between items-start sm:items-end w-full px-3 py-2 rounded-lg ${
				user.themeColor ? "hover:bg-[#333]" : "hover:bg-gray-100"
			}`}
			key={value.id}
		>
			<div className="flex flex-col justify-start items-start w-full">
				<p>Username: {value.username}</p>
				<p className="line-clamp-1">UID: {value.accountUID}</p>

				<div className="flex justify-start items-center gap-2 pt-1 w-full">
					<button
						onClick={handleCopyButton}
						className={`base-btn text-sm ${
							user.themeColor ? "text-[#555]" : "text-gray-500"
						}`}
					>
						<p>{copied ? "Copied" : "Copy UID"}</p>
					</button>

					<button
						onClick={handleBlockUser}
						className={`base-btn !bg-red-500 text-sm ${
							user.themeColor ? "text-[#555]" : "text-gray-500"
						}`}
					>
						<p>{value.blocked ? "Unblock" : "Block"}</p>
					</button>

					<button
						onClick={handleDeleteSavedUser}
						className="base-btn !bg-red-500 text-sm ml-auto"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

const BlockedUserUIDs = ({ value, user }) => {
	const {
		savedUserUIDs: { blockUser },
	} = FirebaseApi();
	const [copied, setCopied] = useState(false);

	const copiedRef = useRef();

	const handleCopyButton = () => {
		clearTimeout(copiedRef.current);
		setCopied(true);

		navigator.clipboard.writeText(value.accountUID);
		copiedRef.current = setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	const handleBlockUser = () => {
		blockUser(value.blocked ? !value.blocked : true, value.id);
	};

	return (
		<div
			className={`flex flex-col sm:flex-row gap-2 sm:gap-1 justify-start sm:justify-between items-start sm:items-end w-full px-3 py-2 rounded-lg opacity-60 ${
				user.themeColor ? "bg-[#333]" : "bg-gray-100"
			}`}
		>
			<div className="flex flex-col justify-start items-start">
				<p>Username: {value.username}</p>
				<p className="line-clamp-1">UID: {value.accountUID}</p>

				<div className="flex justify-start items-center gap-2 pt-1">
					<button
						onClick={handleCopyButton}
						className={`base-btn text-sm ${
							user.themeColor ? "text-[#555]" : "text-gray-500"
						}`}
					>
						<p>{copied ? "Copied" : "Copy UID"}</p>
					</button>

					<button
						onClick={handleBlockUser}
						className={`base-btn !bg-red-500 text-sm ${
							user.themeColor ? "text-[#555]" : "text-gray-500"
						}`}
					>
						<p>{value.blocked ? "Unblock" : "Block"}</p>
					</button>
				</div>
			</div>
		</div>
	);
};
