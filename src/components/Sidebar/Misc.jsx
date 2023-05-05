import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";

export default function Misc({ user }) {
	const { auth, registration } = FirebaseApi();
	const { setOpenTodolistSidebar, setClickedFolder, setClickedTodoFolder } = useContext(StateCtx);

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
				className={`flex transition-colors duration-300 flex-col justify-start items-start gap-6 p-8 border-t-2 ${
					user.themeColor ? "border-[#333]" : "border-gray-200"
				} w-full h-auto mt-auto`}
			>
				<div
					className={`flex flex-col justify-start items-start gap-2 ${user.themeColor ? "text-white" : "text-black"}`}
				>
					<h1 className="text-2xl font-semibold">Misc</h1>
					<div className="flex flex-col justify-start items-start gap-3">
						<div className="flex flex-col justify-start items-start">
							<button
								onClick={null}
								className={`cursor-not-allowed hover:opacity-80 ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}
								disabled
							>
								Tutorials
							</button>
							<button
								onClick={null}
								className={`cursor-not-allowed hover:opacity-80 ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}
								disabled
							>
								Settings
							</button>
						</div>
						<button onClick={handleSigningOut} className="base-btn">
							Logout
						</button>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start gap-0">
					<p className={`${user.themeColor ? "text-white" : "text-black"}`}>{user.username}</p>
					<p className={`text-sm ${user.themeColor ? "text-[#555]" : "text-gray-400"}`}>{user.email}</p>
				</div>
			</div>
		</>
	);
}
