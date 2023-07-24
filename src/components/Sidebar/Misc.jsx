import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";

export default function Misc({ user, handleNavigator }) {
	const { registration } = FirebaseApi();
	const {
		setOpenTodolistSidebar,
		setClickedFolder,
		setClickedTodoFolder,
		navState,
	} = useContext(StateCtx);

	const handleSigningOut = (e) => {
		e.preventDefault();
		setOpenTodolistSidebar(false);
		setClickedFolder("");
		setClickedTodoFolder("");
		registration.signingOut();
	};

	return (
		<>
			<div
				className={`flex transition-colors duration-300 flex-col justify-start items-start gap-6 p-8 w-full ${
					user.themeColor ? "border-[#333]" : "border-gray-200"
				} ${
					navState.navigatorLink === "Settings"
						? "mb-auto h-full"
						: "mt-auto border-t-2"
				}`}
			>
				<div
					className={`flex flex-col justify-start items-start gap-5 ${
						user.themeColor ? "text-white" : "text-black"
					}`}
				>
					<h1 className="text-2xl font-semibold">Misc</h1>
					<div
						className={`flex flex-col justify-start items-start ${
							navState.navigatorLink === "Dashboard" ? "gap-1" : "gap-2"
						}`}
					>
						{navState.navigatorLink !== "Dashboard" && (
							<button
								onClick={(e) =>
									handleNavigator("navigatorLink", e.target.textContent)
								}
								className={`text-btn`}
							>
								Dashboard
							</button>
						)}
						<button
							onClick={(e) =>
								handleNavigator("navigatorLink", e.target.textContent)
							}
							className={`text-btn ${
								user.themeColor ? "text-white" : "text-black"
							} ${
								navState.navigatorLink === "Settings"
									? "bg-[#0E51FF] text-white rounded-md px-2 py-1"
									: ""
							}`}
						>
							Settings
						</button>
						<button
							onClick={null}
							className={`cursor-not-allowed hover:opacity-80 ${
								user.themeColor ? "text-[#444]" : "text-gray-400"
							} ${
								navState.navigatorLink === "Tutorials"
									? "bg-[#0E51FF] rounded-md px-2 py-1"
									: ""
							}`}
							disabled
						>
							Tutorials
						</button>
					</div>
				</div>

				<div className="flex flex-col justify-start items-start gap-0 mt-auto">
					<button onClick={handleSigningOut} className="base-btn mb-3">
						Logout
					</button>
					<p className={`${user.themeColor ? "text-white" : "text-black"}`}>
						{user.username}
					</p>
				</div>
			</div>
		</>
	);
}
