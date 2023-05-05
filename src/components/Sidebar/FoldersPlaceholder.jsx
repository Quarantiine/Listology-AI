import React, { useContext } from "react";
import { UserCredentialCtx } from "../../pages";

export default function FoldersPlaceholder() {
	const { user } = useContext(UserCredentialCtx);

	return (
		<>
			<div className="flex flex-col justify-start items-start gap-3 w-full">
				<p className={user.themeColor ? "text-[#555]" : "text-gray-400"}>No Todo Folders</p>
			</div>
		</>
	);
}
