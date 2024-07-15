import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { StateCtx } from "../Layout";

export default function Filters({ user }) {
	const {
		filterState,
		filterDispatch,
		difficulty,
		closeFilterSidebar,
		setCloseFilterSidebar,
		completedTodos,
	} = useContext(StateCtx);

	const handleFilterSidebar = () => {
		setCloseFilterSidebar(!closeFilterSidebar);
	};

	useEffect(() => {
		const closeFilterSidebar = (e) => {
			if (!e.target.closest(".filter-system")) {
				setCloseFilterSidebar(false);
			}
		};

		document.addEventListener("mousedown", closeFilterSidebar);
		return () => document.removeEventListener("mousedown", closeFilterSidebar);
	}, []);

	const handleFilterDispatch = (key, value) => {
		filterDispatch({
			type: "filter-category",
			payload: {
				key: key,
				value: value,
			},
		});
	};

	const handleFilterDispatch2 = (key, value, value2) => {
		filterDispatch({
			type: "filter-category-2",
			payload: {
				key: key,
				value: value,
				value2: value2,
			},
		});
	};

	return (
		<>
			<div
				onClick={() => {
					!completedTodos && !closeFilterSidebar && handleFilterSidebar();
				}}
				className={`filter-system z-40 fixed top-1/2 translate-y-10 rounded-l-lg right-[5px] px-5 pt-3 flex flex-col gap-1 ${
					user.themeColor ? "bg-[#111]" : "bg-white shadow-md border"
				} ${
					closeFilterSidebar
						? "w-[120px] h-[100px]"
						: "w-[40px] h-[40px] p-2 flex justify-center items-center"
				} ${user.themeColor ? "text-white" : "text-black"} ${
					completedTodos ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
				}`}
			>
				{closeFilterSidebar ? (
					<>
						<div className="flex justify-between items-center gap-1">
							<button
								onClick={(e) => {
									handleFilterDispatch(
										"filterCategories",
										e.target.textContent,
									);
								}}
								className={`w-fit px-1 rounded-md ${
									user.themeColor
										? `${
												filterState.filterCategories === "All"
													? "bg-[#444]"
													: ""
											} text-white`
										: `${
												filterState.filterCategories === "All"
													? "bg-[#ddd]"
													: ""
											} text-black`
								}`}
							>
								All
							</button>
							<button onClick={handleFilterSidebar} className={`w-fit`}>
								<Image
									className={`w-[15px] h-auto -rotate-90`}
									src={
										user.themeColor
											? "/icons/arrow-white.svg"
											: "/icons/arrow-black.svg"
									}
									alt="arrow"
									width={20}
									height={20}
								/>
							</button>
						</div>
						<div className="flex flex-col justify-start items-start">
							<button
								onClick={(e) => {
									handleFilterDispatch(
										"filterCategories",
										e.target.textContent,
									);
								}}
								className={`flex justify-start items-center gap-1 w-fit text-btn px-1 rounded-md ${
									user.themeColor
										? `${
												filterState.filterCategories === "Favorites"
													? "bg-[#444]"
													: ""
											} text-white`
										: `${
												filterState.filterCategories === "Favorites"
													? "bg-[#ddd]"
													: ""
											} text-black`
								}`}
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
									: null && (
											<Image
												src={"/icons/unfavorite.svg"}
												alt="unfavorite"
												width={18}
												height={18}
											/>
										)}
								<p>Favorites</p>
							</button>
							<button
								onClick={(e) => {
									handleFilterDispatch2(
										"filterCategories",
										e.target.textContent,
										difficulty,
									);
								}}
								className={`flex justify-start items-center gap-1 w-fit text-btn px-1 rounded-md ${
									user.themeColor
										? `${
												filterState.filterCategories.value === "Difficulty"
													? "bg-[#444]"
													: ""
											} text-white`
										: `${
												filterState.filterCategories.value === "Difficulty"
													? "bg-[#ddd]"
													: ""
											} text-black`
								}`}
							>
								{null && (
									<Image
										className="w-auto h-[14px]"
										src={`${
											user.themeColor
												? "/icons/labels-white.svg"
												: "/icons/labels-black.svg"
										}`}
										alt="completed"
										width={17}
										height={17}
									/>
								)}
								<p>Difficulty</p>
							</button>
						</div>
					</>
				) : (
					<button
						className={`w-fit h-fit absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center ${
							completedTodos ? "opacity-50 cursor-not-allowed" : null
						}`}
					>
						<Image
							className={`w-auto min-h-[20px] max-h-[20px] rotate-90`}
							src={
								user.themeColor
									? "/icons/arrow-white.svg"
									: "/icons/arrow-black.svg"
							}
							alt="arrow"
							width={30}
							height={30}
						/>
					</button>
				)}

				{closeFilterSidebar &&
					filterState.filterCategories.value === "Difficulty" && (
						<div
							className={`absolute top-28 right-0 w-[120px] h-[100px] rounded-l-md flex justify-start items-start px-4 py-2 ${
								user.themeColor ? "bg-[#111]" : "bg-white shadow-md border"
							}`}
						>
							{true && (
								<div className="flex flex-col justify-start items-start gap-1">
									<button
										onClick={(e) => {
											handleFilterDispatch2(
												"filterCategories",
												"Difficulty",
												e.target.textContent,
											);
										}}
										className={`text-btn line-clamp-1 px-1 rounded-md ${
											user.themeColor
												? filterState.filterCategories.value2?.includes("Easy")
													? "bg-[#444]"
													: ""
												: filterState.filterCategories.value2?.includes("Easy")
													? "bg-[#ddd]"
													: ""
										}`}
									>
										Easy
									</button>

									<button
										onClick={(e) => {
											handleFilterDispatch2(
												"filterCategories",
												"Difficulty",
												e.target.textContent,
											);
										}}
										className={`text-btn line-clamp-1 px-1 rounded-md ${
											user.themeColor
												? filterState.filterCategories.value2?.includes(
														"Intermediate",
													)
													? "bg-[#444]"
													: ""
												: filterState.filterCategories.value2?.includes(
															"Intermediate",
													  )
													? "bg-[#ddd]"
													: ""
										}`}
									>
										Intermediate
									</button>

									<button
										onClick={(e) => {
											handleFilterDispatch2(
												"filterCategories",
												"Difficulty",
												e.target.textContent,
											);
										}}
										className={`text-btn line-clamp-1 px-1 rounded-md ${
											user.themeColor
												? filterState.filterCategories.value2?.includes("Hard")
													? "bg-[#444]"
													: ""
												: filterState.filterCategories.value2?.includes("Hard")
													? "bg-[#ddd]"
													: ""
										}`}
									>
										Hard
									</button>
								</div>
							)}
						</div>
					)}
			</div>
		</>
	);
}
