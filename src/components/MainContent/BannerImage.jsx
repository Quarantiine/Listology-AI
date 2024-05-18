import Image from "next/image";
import React from "react";
import ImageControls from "./ImageControls";

export default function BannerImage({ user }) {
	return (
		<>
			<div
				className={`w-full transition-all duration-500 overflow-hidden ${
					user.bannerSize ? "min-h-[0px]" : "min-h-[230px]"
				} relative`}
			>
				<TextContent user={user} />
				<Image
					className="object-cover object-center transition-all duration-500"
					src={
						user.bannerImage
							? user.bannerImage
							: "/images/default-banner-img.jpeg"
					}
					alt="banner-image"
					fill
					priority="true"
				/>
				{!user.profileImage && <Fallback user={user} />}
			</div>
			{user.bannerSize && (
				<div className="fixed top-5 right-0 z-40 w-20 h-20">
					<ImageControls />
				</div>
			)}
		</>
	);
}

const TextContent = ({ user }) => {
	return (
		<>
			<div className="absolute flex justify-center items-center z-10 w-full h-full">
				<div className="w-[95%] h-full flex flex-col justify-end items-start gap-2 pb-4">
					{/* <div className="flex justify-center items-center gap-3">
						<p
							className={`${
								user.themeColor ? "text-white" : "text-[#333]"
							} text-xl sm:text-3xl font-thin`}
						>
							Welcome
						</p>
					</div> */}
					<h1
						className={`line-clamp-1 px-5 py-2 rounded-full flex justify-center items-center gap-2 ${
							user.themeColor ? "text-white bg-[#333]" : "text-[#333] bg-white"
						} text-xl font-medium`}
					>
						<span>
							{user.profileImage && (
								<Image
									className="min-w-[25px] max-w-[25px]  min-h-[25px] max-h-[25px] rounded-full object-cover object-center"
									src={user.profileImage}
									alt="profileImage"
									width={30}
									height={30}
								/>
							)}
						</span>
						<span>{user.username || "Username"}</span>
					</h1>
				</div>
			</div>
		</>
	);
};

const Fallback = ({ user }) => {
	return (
		<>
			<div
				className={`transition-all duration-500 w-full ${
					user.bannerSize ? "min-h-[0px]" : "min-h-[230px]"
				} ${user.themeColor ? "bg-[#333]" : "bg-gray-300"}`}
			></div>
		</>
	);
};
