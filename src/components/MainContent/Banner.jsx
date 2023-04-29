import React, { useContext } from "react";
import ThemeChanger from "./ThemeChanger";
import { UserCredentialCtx } from "../../pages";
import BannerImage from "./BannerImage";
import ImageControls from "./ImageControls";

export default function Banner() {
	const { user } = useContext(UserCredentialCtx);

	return (
		<>
			<div className="relative w-full h-fit flex justify-start items-start">
				<ThemeChanger />
				<BannerImage user={user} />
				<ImageControls />
			</div>
		</>
	);
}
