import React, { useReducer, useRef, useState } from "react";
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
		savedUserUIDs: { allSavedUsers, deletingUserUID },
	} = FirebaseApi();

	const [navigatorState, navigatorDispatch] = useReducer(navigatorReducer, {
		navigate: "Personal Info",
	});
	const [copied, setCopied] = useState(false);
	const copiedRef = useRef();

	const handleNavigation = (value) => {
		navigatorDispatch({
			type: "navigator",
			payload: {
				key: "navigate",
				value: value,
			},
		});
	};

	const handleDeleteSavedUser = (id) => {
		deletingUserUID(id);
	};

	const handleCopyButton = (uidText) => {
		clearTimeout(copiedRef.current);
		setCopied(true);

		navigator.clipboard.writeText(uidText);
		copiedRef.current = setTimeout(() => {
			setCopied(false);
		}, 2000);
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

										<div className="flex flex-col gap-2 justify-start items-start">
											{allSavedUsers
												?.filter((value) => value.uid === auth.currentUser.uid)
												?.map((value) => {
													return (
														<div
															className={`flex flex-col sm:flex-row gap-2 sm:gap-1 justify-start sm:justify-between items-start sm:items-center w-full px-3 py-2 rounded-lg ${
																user.themeColor
																	? "hover:bg-[#333]"
																	: "hover:bg-gray-100"
															}`}
															key={value.id}
														>
															<div className="flex flex-col justify-start items-start">
																<p>Username: {value.username}</p>
																<p className="line-clamp-1">
																	UID: {value.accountUID}
																</p>

																<button
																	onClick={() =>
																		handleCopyButton(value.accountUID)
																	}
																	className={`text-btn text-sm ${
																		user.themeColor
																			? "text-[#555]"
																			: "text-gray-500"
																	}`}
																>
																	<p>{copied ? "Copied" : "Copy UID"}</p>
																</button>
															</div>

															<button
																onClick={() => handleDeleteSavedUser(value.id)}
																className="base-btn !bg-red-500 text-sm"
															>
																Delete
															</button>
														</div>
													);
												})}

											{allSavedUsers
												?.filter((value) => value.uid === auth.currentUser.uid)
												?.map((value) => value).length < 1 && (
												<p
													className={`px-3 ${
														user.themeColor ? "text-[#555]" : "text-gray-500"
													}`}
												>
													No Saved User UIDs
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
