import Image from "next/image";
import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";
import { StateCtx } from "../Layout";

export default function ThemeChanger() {
	const { registration } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);
	const { themeColor, setThemeColor } = useContext(StateCtx);

	const handleThemeChange = () => {
		registration.updatingThemeColor(themeColor, user.id);
		setThemeColor(!themeColor);
	};

	return (
		<>
			<div className="fixed z-40 top-3 right-5 w-fit h-fit flex justify-center items-center">
				<div
					onClick={handleThemeChange}
					className="flex justify-center items-center w-fit h-fit bg-[#fff] p-1 rounded-l-md text-btn"
				>
					<Image className="w-auto h-[18px]" src={"/icons/light-black.svg"} alt="" width={20} height={20} />
				</div>
				<div
					onClick={handleThemeChange}
					className="flex justify-center items-center w-fit h-fit bg-[#000] p-1 rounded-r-md text-btn"
				>
					<Image className="w-auto h-[18px]" src={"/icons/dark-white.svg"} alt="" width={20} height={20} />
				</div>
			</div>
		</>
	);
}
