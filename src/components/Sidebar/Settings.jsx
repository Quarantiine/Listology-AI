import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";

export default function Settings() {
	const { user } = useContext(UserCredentialCtx);
	const { auth } = FirebaseApi();

	return (
		<>
			<div
				className={`px-10 pb-10 pt-16 mr-auto mb-auto flex flex-col gap-10 relative ${
					user.themeColor ? "text-white" : "text-black"
				}`}
			>
				<h1 className="text-2xl font-semibold">Settings</h1>
				<div>
					<p className={`${user.themeColor ? "text-[#555]" : "text-[#aaa]"}`}>
						Settings Coming Soon
					</p>
				</div>
			</div>
		</>
	);
}
