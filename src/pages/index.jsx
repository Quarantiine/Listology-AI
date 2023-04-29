import Head from "next/head";
import FirebaseApi from "./api/firebaseApi";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import React, { createContext, useContext } from "react";
import { StateCtx } from "../components/Layout";
import Image from "next/image";

export const UserCredentialCtx = createContext();

export default function Home() {
	const { auth, registration } = FirebaseApi();

	return (
		<>
			<Head>
				<title>Home | Listology</title>
			</Head>
			<>
				{/* Loader */}
				<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[-5]">
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
				registration.allusers?.map((user) => {
					if (auth.currentUser?.uid === user.userID) {
						return (
							<React.Fragment key={user.id}>
								<div
									className={`transition-colors duration-300 ${
										user.themeColor ? "bg-[#222]" : "bg-[#fff]"
									} fixed top-0 left-0 w-full h-full z-[-1]`}
								/>
								<UserCredentialCtx.Provider value={{ user }}>
									<main className="absolute top-0 left-0 flex justify-center items-start w-full h-full">
										<Sidebar />
										<MainContent />
									</main>
								</UserCredentialCtx.Provider>
							</React.Fragment>
						);
					}
				})}
		</>
	);
}
