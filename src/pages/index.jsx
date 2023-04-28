import Head from "next/head";
import FirebaseApi from "./api/firebaseApi";
import { useEffect } from "react";

export default function Home() {
	const { auth, registration } = FirebaseApi();

	const handleSigningOut = (e) => {
		e.preventDefault();
		registration.signingOut();
	};

	return (
		<>
			<Head>
				<title>Home | Listology</title>
			</Head>
			{auth.currentUser &&
				registration.allusers?.map((user) => {
					if (auth.currentUser?.uid === user.userID) {
						return (
							<>
								<main>
									<div className="p-10 flex flex-col justify-start items-start gap-2">
										<p>
											<span className="font-bold">Username:</span> {user.username}
										</p>
										<p>
											<span className="font-bold">Email:</span> {user.email}
										</p>
										<p>
											<span className="font-bold">ID:</span> {user.id}
										</p>
										<p>
											<span className="font-bold">UserID:</span> {user.userID}
										</p>
										<button onClick={handleSigningOut} className="base-btn">
											Logout
										</button>
									</div>
								</main>
							</>
						);
					}
				})}
		</>
	);
}
