import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { UserCredentialCtx } from "../../pages";

export default function ImageControls() {
	const { user } = useContext(UserCredentialCtx);
	const [openDropdown, setOpenDropdown] = useState(false);

	useEffect(() => {
		const closeDropdown = (e) => {
			if (!e.target.closest(".gallery-dropdown")) {
				setOpenDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeDropdown);
		return () => document.removeEventListener("mousedown", closeDropdown);
	}, [openDropdown]);

	const handleDropdown = () => {
		setOpenDropdown(!openDropdown);
	};

	return (
		<>
			<div className="z-30 absolute bottom-3 right-5 w-fit h-fit flex justify-center items-center">
				<button
					onClick={null}
					className="flex justify-center items-center w-fit h-fit bg-[#fff] p-2 rounded-l-md text-btn"
				>
					<Image className="w-auto h-[18px]" src={"/icons/move-image-black.svg"} alt="" width={20} height={20} />
				</button>
				<button
					onClick={handleDropdown}
					className="flex justify-center items-center w-fit h-fit bg-white p-2 rounded-r-md text-btn"
				>
					<Image className="w-auto h-[18px]" src={"/icons/picture-black.svg"} alt="" width={20} height={20} />
				</button>

				{openDropdown && (
					<div
						className={`gallery-dropdown flex flex-col gap-1 justify-center items-center p-2 absolute top-9 left-0 w-full h-fit rounded-md bg-white border text-black`}
					>
						<button onClick={handleDropdown} className="text-btn text-sm">
							Gallery
						</button>
						<button onClick={null && handleDropdown} className="text-sm select-none cursor-not-allowed text-gray-400">
							Upload
						</button>
					</div>
				)}

				{/* TODO: Create and Finish the Gallery Modal */}
				{null && <GalleryModal />}
			</div>
		</>
	);
}

const GalleryModal = () => {
	return (
		<>
			<div></div>
		</>
	);
};
