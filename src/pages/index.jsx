import Head from "next/head";
import FirebaseApi from "./api/firebaseApi";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import React, { createContext, useContext } from "react";
import { StateCtx } from "../components/Layout";

export const UserCredentialCtx = createContext();

export default function Home() {
	const { auth, registration } = FirebaseApi();

	return (
		<>
			<Head>
				<title>Home | Listology</title>
			</Head>
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
