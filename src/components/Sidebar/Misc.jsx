import React from "react";
import FirebaseApi from "../../pages/api/firebaseApi";

export default function Misc() {
	const { auth, registration } = FirebaseApi();

	const handleSigningOut = (e) => {
		e.preventDefault();
		registration.signingOut();
	};

	return (
		<>
			<div>
				<button onClick={handleSigningOut} className="base-btn">
					Logout
				</button>
			</div>
		</>
	);
}
