import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import FirebaseApi from "../pages/api/firebaseApi";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Layout({ children }) {
	const { auth } = FirebaseApi();
	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				router.push("/registration");
			}
		});
	}, []);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/icons/logo.svg" type="image/x-icon" />
			</Head>
			<div>{children}</div>
		</>
	);
}
