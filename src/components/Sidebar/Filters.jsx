import Image from "next/image";
import React, { useState } from "react";

export default function Filters({ user }) {
	const [closeFilterSidebar, setCloseFilterSidebar] = useState();

	const handleFilterSidebar = () => {
		setCloseFilterSidebar(!closeFilterSidebar);
	};

	return (
		<>
			<div
				onClick={() => {
					!closeFilterSidebar && handleFilterSidebar();
				}}
				className={`z-40 fixed top-32 md:top-1/2 -translate-y-1/2 ${
					user.themeColor ? "bg-[#111]" : "bg-white shadow-md border"
				} right-[5px] px-5 pt-3 transition-all duration-500 ${
					closeFilterSidebar
						? "w-[120px] h-[160px]"
						: "w-fit h-[60px] p-2 flex justify-center items-center cursor-pointer"
				} rounded-l-lg ${user.themeColor ? "text-white" : "text-black"}`}
			>
				{closeFilterSidebar ? (
					<>
						<div className="flex justify-between items-center gap-1">
							<button
								onClick={null}
								className={`w-fit ${
									user.themeColor ? "text-[#555]" : "text-gray-400"
								} ${"cursor-not-allowed hover:opacity-80"}`}
							>
								All
							</button>
							<button onClick={handleFilterSidebar} className={`w-fit`}>
								<Image
									className="w-auto h-[8px] -rotate-90"
									src={user.themeColor ? "/icons/arrow-white.svg" : "/icons/arrow-black.svg"}
									alt="arrow"
									width={20}
									height={20}
								/>
							</button>
						</div>
						<div className="flex flex-col gap-1 justify-start items-start">
							<button
								className={`flex justify-start items-center gap-1 w-fit ${
									user.themeColor ? "text-[#555]" : "text-gray-400"
								} ${"cursor-not-allowed hover:opacity-80"}`}
							>
								{null && (
									<Image
										className="w-auto h-[15px]"
										src={`${user.themeColor ? "/icons/completed-white.svg" : "/icons/completed-black.svg"}`}
										alt="completed icon"
										width={18}
										height={12}
									/>
								)}
								<p>Completed</p>
							</button>
							<button
								className={`flex justify-start items-center gap-1 w-fit ${
									user.themeColor ? "text-[#555]" : "text-gray-400"
								} ${"cursor-not-allowed hover:opacity-80"}`}
							>
								{null && (
									<Image
										className="w-auto h-[14px]"
										src={`${user.themeColor ? "/icons/labels-white.svg" : "/icons/labels-black.svg"}`}
										alt="completed icon"
										width={17}
										height={17}
									/>
								)}
								<p>Labels</p>
							</button>
							<button
								className={`flex justify-start items-center gap-1 w-fit ${
									user.themeColor ? "text-[#555]" : "text-gray-400"
								} ${"cursor-not-allowed hover:opacity-80"}`}
							>
								{null && (
									<Image
										className="w-auto h-[16px]"
										src={`${user.themeColor ? "/icons/active-white.svg" : "/icons/active-black.svg"}`}
										alt="completed icon"
										width={15}
										height={15}
									/>
								)}
								<p>Actives</p>
							</button>
							<button
								className={`flex justify-start items-center gap-1 w-fit ${
									user.themeColor ? "text-[#555]" : "text-gray-400"
								} ${"cursor-not-allowed hover:opacity-80"}`}
							>
								{user.themeColor
									? null && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="18"
												viewBox="0 96 960 960"
												width="18"
												fill="white"
											>
												<path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" />
											</svg>
									  )
									: null && <Image src={"/icons/unfavorite.svg"} alt="completed icon" width={18} height={18} />}
								<p>Favorites</p>
							</button>
						</div>
					</>
				) : (
					<button className={`w-fit relative bottom-[3px] flex justify-center items-center`}>
						<Image
							className={`w-auto h-[10px] rotate-90`}
							src={user.themeColor ? "/icons/arrow-white.svg" : "/icons/arrow-black.svg"}
							alt="arrow"
							width={20}
							height={20}
						/>
					</button>
				)}
			</div>
		</>
	);
}
