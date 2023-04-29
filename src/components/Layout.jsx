import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import FirebaseApi from "../pages/api/firebaseApi";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export const StateCtx = createContext();

export default function Layout({ children }) {
	const { auth } = FirebaseApi();
	const router = useRouter();
	const [themeColor, setThemeColor] = useState(true);
	const [closeSidebar, setCloseSidebar] = useState(false);
	const [windowLoaded, setWindowLoaded] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				router.push("/registration");
			}
		});
	}, []);

	useEffect(() => {
		const mobileSidebar = () => {
			if (window.innerWidth < 768) {
				setCloseSidebar(true);
			} else {
				setCloseSidebar(false);
			}
		};

		window.addEventListener("resize", mobileSidebar);
		return () => window.removeEventListener("resize", mobileSidebar);
	}, []);

	useEffect(() => {
		document.readyState === "loading" ? setWindowLoaded(true) : setWindowLoaded(false);
	}, [windowLoaded]);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/icons/logo.svg" type="image/x-icon" />
			</Head>

			<>
				<StateCtx.Provider value={{ windowLoaded, themeColor, setThemeColor, closeSidebar, setCloseSidebar }}>
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
					<div>{children}</div>
				</StateCtx.Provider>
			</>
		</>
	);
}
