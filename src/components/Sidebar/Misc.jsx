import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";
import { useRouter } from "next/router";

export default function Misc({ user, handleNavigator }) {
	const { registration } = FirebaseApi();
	const {
		setOpenTodolistSidebar,
		setClickedFolder,
		setClickedTodoFolder,
		navState,
		navDispatch,
	} = useContext(StateCtx);
	const router = useRouter();

	const handleSigningOut = (e) => {
		e.preventDefault();
		setOpenTodolistSidebar(false);
		setClickedFolder("");
		setClickedTodoFolder("");

		setTimeout(() => {
			router.push("/registration");
		}, 1000);

		navDispatch({
			type: "sidebar-navigation-link",
			payload: {
				key: "navigatorLink",
				value: "Dashboard",
			},
		});

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
						: "border-t-2"
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
							onClick={() => router.push("/tutorials")}
							className={`text-btn text-white`}
						>
							Tutorials
						</button>
					</div>
				</div>

				<div className="flex flex-col justify-start items-start gap-0 mt-auto">
					<button onClick={handleSigningOut} className="base-btn mb-3">
						Logout
					</button>
				</div>
			</div>
		</>
	);
}
