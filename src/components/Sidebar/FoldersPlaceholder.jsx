import React, { useContext } from "react";
import { StateCtx } from "../Layout";
import { UserCredentialCtx } from "../../pages";

export default function FoldersPlaceholder() {
	const { user } = useContext(UserCredentialCtx);

	return (
		<>
			<div className="flex justify-start items-start w-full h-fit gap-5">
				<div className={`w-[70%] min-h-[30px] ${user.themeColor ? "bg-[#555]" : "bg-gray-300"} rounded-md`} />
				<div className={`w-[20%] min-h-[30px] ${user.themeColor ? "bg-[#333]" : "bg-gray-500"} rounded-md`} />
			</div>
			<div className="flex justify-start items-start w-full h-fit gap-5">
				<div className={`w-[70%] min-h-[30px] ${user.themeColor ? "bg-[#555]" : "bg-gray-300"} rounded-md`} />
				<div className={`w-[20%] min-h-[30px] ${user.themeColor ? "bg-[#333]" : "bg-gray-500"} rounded-md`} />
			</div>
			<div className="flex justify-start items-start w-full h-fit gap-5">
				<div className={`w-[70%] min-h-[30px] ${user.themeColor ? "bg-[#555]" : "bg-gray-300"} rounded-md`} />
				<div className={`w-[20%] min-h-[30px] ${user.themeColor ? "bg-[#333]" : "bg-gray-500"} rounded-md`} />
			</div>
			<div className="flex justify-start items-start w-full h-fit gap-5">
				<div className={`w-[70%] min-h-[30px] ${user.themeColor ? "bg-[#555]" : "bg-gray-300"} rounded-md`} />
				<div className={`w-[20%] min-h-[30px] ${user.themeColor ? "bg-[#333]" : "bg-gray-500"} rounded-md`} />
			</div>
			<div className="flex justify-start items-start w-full h-fit gap-5">
				<div className={`w-[70%] min-h-[30px] ${user.themeColor ? "bg-[#555]" : "bg-gray-300"} rounded-md`} />
				<div className={`w-[20%] min-h-[30px] ${user.themeColor ? "bg-[#333]" : "bg-gray-500"} rounded-md`} />
			</div>
		</>
	);
}
