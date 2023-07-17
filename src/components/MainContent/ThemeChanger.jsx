import Image from "next/image";
import React, { useContext } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";

export default function ThemeChanger() {
	const { registration } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);

	const handleThemeChange = () => {
		registration.updatingThemeColor(!user.themeColor, user.id);
	};

	return (
		<>
			<div className="fixed z-50 top-3 right-5 w-fit h-fit flex justify-center items-center">
				<div
					onClick={handleThemeChange}
					className="flex justify-center items-center w-fit h-fit bg-[#fff] p-1 rounded-l-md text-btn"
				>
					<Image
						className="w-auto h-[18px]"
						src={"/icons/light-black.svg"}
						alt="light"
						width={20}
						height={20}
					/>
				</div>
				<div
					onClick={handleThemeChange}
					className="flex justify-center items-center w-fit h-fit bg-[#222] p-1 rounded-r-md text-btn"
				>
					<Image
						className="w-auto h-[18px]"
						src={"/icons/dark-white.svg"}
						alt="dark"
						width={20}
						height={20}
					/>
				</div>
			</div>
		</>
	);
}
