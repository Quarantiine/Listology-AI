import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import GalleryModal from "./GalleryModal";
import { StateCtx } from "../Layout";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";

export default function ImageControls() {
	const { user } = useContext(UserCredentialCtx);
	const { registration } = FirebaseApi();
	const { clickedImageLoading, setClickedImageLoading, increaseBannerSize, setIncreaseBannerSize } =
		useContext(StateCtx);
	const [openDropdown, setOpenDropdown] = useState(false);
	const [openGalleryModal, setOpenGalleryModal] = useState(false);

	useEffect(() => {
		const closeImageLoadingIndicator = (e) => {
			if (!e.target.closest(".image-loading-indicator")) {
				setClickedImageLoading(false);
			}
		};

		document.addEventListener("mousedown", closeImageLoadingIndicator);
		return () => document.removeEventListener("mousedown", closeImageLoadingIndicator);
	}, [setClickedImageLoading]);

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

	const handleGalleryModal = () => {
		setOpenGalleryModal(!openGalleryModal);
	};

	const handleIncreaseBannerSize = () => {
		registration.updatingBannerSize(increaseBannerSize, user.id);
		setIncreaseBannerSize(!increaseBannerSize);
	};

	return (
		<>
			<div className="z-30 absolute bottom-3 right-5 w-fit h-fit flex justify-center items-center">
				{clickedImageLoading &&
					createPortal(
						<div className="image-loading-indicator w-full h-fit px-10 py-2 bg-green-500 text-white fixed left-1/2 -translate-x-1/2 z-50 flex justify-center items-center text-center">
							<p className="">(Successful) Your Picture is Arriving...</p>
						</div>,
						document.body
					)}

				<button
					onClick={handleIncreaseBannerSize}
					className={`flex justify-center items-center w-fit h-fit bg-[#fff] p-2 text-btn rounded-l-md`}
				>
					<Image className="w-auto h-[18px]" src={"/icons/increase-size-black.svg"} alt="" width={20} height={20} />
				</button>

				<button
					onClick={handleDropdown}
					className="flex justify-center items-center w-fit h-fit bg-white py-2 px-1 rounded-r-md text-btn"
				>
					<Image className="w-auto h-[18px]" src={"/icons/picture-black.svg"} alt="" width={20} height={20} />
				</button>

				{openDropdown && (
					<div
						className={`gallery-dropdown flex flex-col gap-1 justify-center items-center p-2 absolute top-9 left-0 w-full h-fit rounded-md bg-white border text-black`}
					>
						<button
							onClick={() => {
								handleDropdown();
								handleGalleryModal();
							}}
							className="text-btn text-sm"
						>
							Gallery
						</button>
					</div>
				)}

				{openGalleryModal &&
					createPortal(
						<GalleryModal openGalleryModal={openGalleryModal} setOpenGalleryModal={setOpenGalleryModal} />,
						document.body
					)}
			</div>
		</>
	);
}
