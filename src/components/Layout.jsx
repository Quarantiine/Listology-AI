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

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/icons/logo.svg" type="image/x-icon" />
			</Head>

			<>
				<StateCtx.Provider value={{ themeColor, setThemeColor, closeSidebar, setCloseSidebar }}>
					<div>{children}</div>
				</StateCtx.Provider>
			</>
		</>
	);
}
