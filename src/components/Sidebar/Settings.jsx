import React, { useContext, useReducer } from "react";
import { UserCredentialCtx } from "../../pages";
import PersonalInfoSection from "./PersonalInfoSection";
import ActivitySection from "./ActivitySection";
import DeleteAccount from "./DeleteAccount";

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

export default function Settings() {
	const { user } = useContext(UserCredentialCtx);

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

	return (
		<>
			<div
				className={`px-10 pb-10 pt-16 mr-auto mb-auto flex flex-col gap-10 relative main-content-overflow w-full h-full overflow-y-scroll justify-center items-center overflow-x-hidden ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<div className="w-full md:w-[90%] lg:w-[80%] xl:w-[900px] h-full margin-auto flex flex-col gap-6 sm:gap-16">
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

							{/* <button
								onClick={(e) => handleNavigation(e.target.textContent)}
								className={`w-fit sm:w-full transition-all px-2 py-1 text-start whitespace-nowrap ${
									navigatorState.navigate === "Activity"
										? "base-bg text-white rounded-md"
										: ""
								}`}
							>
								Activity
							</button> */}

							{/* <button
								onClick={(e) => handleNavigation(e.target.textContent)}
								className={`w-fit sm:w-full transition-all px-2 py-1 text-start whitespace-nowrap ${
									navigatorState.navigate === "Delete Account"
										? "base-bg text-white rounded-md"
										: ""
								}`}
							>
								Delete Account
							</button> */}
						</div>

						<div className="w-full h-full">
							{navigatorState.navigate === "Personal Info" && (
								<>
									<PersonalInfoSection user={user} />
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
