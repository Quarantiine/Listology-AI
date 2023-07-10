import React from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import Image from "next/image";

export default function Providers() {
	const { registration } = FirebaseApi();

	const handleGoogleSignIn = (e) => {
		e.preventDefault();
		registration.googleProvider();
	};

	const handleFacebookSignIn = (e) => {
		e.preventDefault();
		registration.facebookProvider();
	};

	return (
		<div className="mt-5 w-full h-auto flex justify-start items-start gap-4">
			<button
				onClick={handleGoogleSignIn}
				className="flex justify-center items-center gap-2 border p-2 rounded-md"
			>
				<Image
					src={"/icons/google.svg"}
					alt="google icon"
					width={25}
					height={25}
				/>
				<h1>Continue with Google</h1>
			</button>

			<button
				onClick={handleFacebookSignIn}
				className="flex justify-center items-center gap-2 border p-2 rounded-md"
			>
				<Image
					src={"/icons/facebook.svg"}
					alt="google icon"
					width={25}
					height={25}
				/>
				<h1>Continue with Facebook</h1>
			</button>
		</div>
	);
}
