import React from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";

export default function Providers() {
	const { auth, registration } = FirebaseApi();
	const allusers = registration.allusers;

	const handleGoogleSignIn = (e) => {
		e.preventDefault();
		registration.googleProvider();
	};

	return (
		<>
			<div className="flex justify-center items-center gap-2 mt-5">
				<h1 className="text-gray-400">or sign in with: </h1>
				<button onClick={handleGoogleSignIn}>
					<Image src={"/icons/google.svg"} alt="google icon" width={25} height={25} />
				</button>
			</div>
		</>
	);
}
