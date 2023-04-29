import React, { useContext } from "react";
import { UserCredentialCtx } from "../../pages";
import TodolistPlaceholder from "./TodolistPlaceholder";
import Banner from "./Banner";

export default function MainContent() {
	const { user } = useContext(UserCredentialCtx);

	return (
		<>
			<div className={`w-full h-full ${user.themeColor ? "text-white" : "text-black"}`}>
				<div className="main-content-overflow w-full h-full flex flex-col overflow-y-scroll justify-start items-center overflow-x-hidden">
					<Banner />
					<div className="flex flex-col justify-start items-center w-full p-10">
						<div className="w-[90%] h-full relative flex flex-col gap-10 justify-center items-center">
							<div className="flex flex-col lg:flex-row justify-around w-full h-auto items-center lg:items-center gap-12 lg:gap-10">
								<div className="flex flex-col justify-center lg:justify-start items-center lg:items-start gap-2 text-center lg:text-start">
									<h1 className="text-2xl font-semibold">Need a Short Tutorial?</h1>
									<p className="">This will expedite your productivity significantly</p>
									<button className="base-btn">Start Tutorial</button>
								</div>
								<div className="flex flex-col justify-center lg:justify-start items-center lg:items-start gap-2 text-center lg:text-start">
									<h1 className="text-2xl font-semibold">Create a Folder!</h1>
									<p className="">Ensure that the chosen appellation is to your liking.</p>
									<button className="base-btn">Create Folder</button>
								</div>
							</div>
							<TodolistPlaceholder />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
