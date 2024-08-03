"use client";
import Head from "next/head";
import FirebaseApi from "./api/firebaseApi";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import React, { createContext, useContext } from "react";
import Image from "next/image";
import Settings from "../components/Sidebar/Settings";
import { StateCtx } from "../components/Layout";
import ThemeChanger from "../components/MainContent/ThemeChanger";

export const UserCredentialCtx = createContext();

export default function Home() {
	const { auth, registration } = FirebaseApi();
	const { navState, navDispatch } = useContext(StateCtx);

	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>

			<>
				{/* Loader */}
				<div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-[-5] gap-3">
					<div className="flex flex-col justify-center items-center gap-2 w-full h-auto">
						<svg
							width="50"
							height="50"
							viewBox="0 0 30 30"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 29.0769H6.11918L24.1667 10.9815L18.0475 4.84613L0 22.9415V29.0769ZM3.26356 24.2994L18.0475 9.47631L19.5487 10.9815L4.7648 25.8047H3.26356V24.2994Z"
								fill="black"
							/>
							<path
								d="M24.6667 0.482758C24.0247 -0.160919 22.9877 -0.160919 22.3457 0.482758L19.3334 3.50309L25.5062 9.6923L28.5186 6.67197C29.1605 6.02829 29.1605 4.9885 28.5186 4.34482L24.6667 0.482758Z"
								fill="black"
							/>
						</svg>

						<p className="text-black">One moment please...</p>
					</div>

					<Image
						className="w-auto h-[50px] animate-spin"
						src={"/icons/loader.svg"}
						alt="loader"
						width={30}
						height={30}
						priority="true"
					/>
				</div>
			</>

			{auth.currentUser &&
				registration.allusers &&
				registration.allusers[0] &&
				registration.allusers
					?.filter((value) => auth.currentUser?.uid === value.userID)
					?.map((user) => {
						return (
							<React.Fragment key={user.id}>
								<div
									className={`transition-colors duration-300 ${
										user.themeColor ? "bg-[#222]" : "bg-[#fff]"
									} fixed top-0 left-0 w-full h-full z-[-1]`}
								/>

								<UserCredentialCtx.Provider value={{ user }}>
									<main className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
										<ThemeChanger />
										{<Sidebar navState={navState} navDispatch={navDispatch} />}
										{navState.navigatorLink == "Dashboard" && <MainContent />}
										{navState.navigatorLink == "Settings" && (
											<Settings user={user} />
										)}
									</main>
								</UserCredentialCtx.Provider>
							</React.Fragment>
						);
					})}
		</>
	);
}
