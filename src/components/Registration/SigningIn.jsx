import React, { useEffect, useRef, useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { createPortal } from "react-dom";
import Image from "next/image";
import Providers from "./Providers";

export default function SigningIn({ handleRegistrationChange }) {
	const { registration } = FirebaseApi();

	const email = useRef();
	const [modalEmail, setModalEmail] = useState();
	const password = useRef();
	const accountErrorRef = useRef();
	const [resetPassword, setResetPassword] = useState(false);
	const [emailExist, setEmailExist] = useState(false);
	const [accountError, setAccountError] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);

	useEffect(() => {
		const closeResetModal = (e) => {
			if (!e.target.closest(".reset-modal")) {
				setResetPassword(false);
			}
		};

		document.addEventListener("mousedown", closeResetModal);
		return () => document.removeEventListener("mousedown", closeResetModal);
	}, []);

	const handleSigningIn = (e) => {
		e.preventDefault();
		setEmailExist(true);
		clearTimeout(accountErrorRef.current);
		if (
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.current.value) &&
			password.current.value?.length > 5
		) {
			registration.signingIn(email.current.value, password.current.value);
		}
	};

	const handleForgotPassword = (e) => {
		e.preventDefault();
		if (
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(modalEmail) &&
			registration.allusers?.map((user) => user.email === modalEmail).includes(true)
		) {
			setResetPassword(false);
			registration.forgotPassword(modalEmail);
		} else {
			setAccountError(true);
			accountErrorRef.current = setTimeout(() => {
				setAccountError(false);
			}, 5000);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-start items-start gap-7 w-full">
				{registration.successfulSignin &&
					createPortal(
						<div className="absolute right-0 top-0 bg-green-500 px-10 py-2 text-white flex justify-center md:justify-start items-center text-center w-full md:w-[60%]">
							<p>{registration.successfulSignin}</p>
						</div>,
						document.body
					)}
				{registration.errorMesg &&
					createPortal(
						<div className="absolute right-0 top-0 bg-red-500 px-10 py-2 text-white flex justify-center md:justify-start items-center text-center w-full md:w-[60%]">
							<p>{registration.errorMesg.slice(9)}</p>
						</div>,
						document.body
					)}
				<h1 className="text-3xl font-semibold">Sign In</h1>
				<form className="flex flex-col justify-start items-start gap-5 w-full">
					<div className="flex flex-row justify-between items-start gap-5 lg:gap-10 w-full">
						<div className="flex flex-col justify-start items-start gap-5 w-full">
							<div className="flex flex-col justify-normal items-start gap-1 w-full">
								<label htmlFor="username">Email:</label>
								<input
									ref={email}
									className="bg-gray-100 px-2 py-1 rounded-md w-full md:w-[70%]"
									type="email"
									name="email"
									placeholder="example123@example.com"
									required
								/>
							</div>
							<div className="flex flex-col justify-normal items-start gap-1 w-full">
								<label htmlFor="username">Password:</label>
								<div className="w-full md:w-[70%] relative">
									<input
										autoComplete="off"
										placeholder="••••••••••••••"
										ref={password}
										className="bg-gray-100 px-2 py-1 rounded-md w-full"
										type={passwordVisible ? "text" : "password"}
										required
									/>
									<Image
										onClick={() => setPasswordVisible(!passwordVisible)}
										className="absolute top-2 right-3 cursor-pointer"
										src={passwordVisible ? "/icons/visibility.svg" : "/icons/visibility_off.svg"}
										alt=""
										width={18}
										height={18}
									/>
								</div>
							</div>
							<button onClick={handleSigningIn} className="px-3 py-1 rounded-md base-bg text-white w-full md:w-[70%]">
								Sign In
							</button>
						</div>
					</div>
					<Providers />
					<div className="flex flex-col justify-start items-start gap-2 mt-2">
						<button onClick={handleRegistrationChange} className="base-col cursor-pointer">
							{`Don't`} have an account?
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								setResetPassword(true);
							}}
							className="base-col cursor-pointer"
						>
							Forgot password?
						</button>
					</div>
				</form>
				{resetPassword &&
					createPortal(
						<ForgotPasswordModal
							accountError={accountError}
							emailExist={emailExist}
							setResetPassword={setResetPassword}
							handleForgotPassword={handleForgotPassword}
							modalEmail={modalEmail}
							setModalEmail={setModalEmail}
						/>,
						document.body
					)}
			</div>
		</>
	);
}

const ForgotPasswordModal = ({ accountError, emailExist, handleForgotPassword, modalEmail, setModalEmail }) => {
	return (
		<>
			<div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center px-5">
				<form className="reset-modal flex-col gap-5 w-fit h-fit p-5 bg-white rounded-md flex justify-center items-center">
					{accountError && (
						<div className="bg-red-500 px-10 py-2 text-white flex justify-center items-center text-center w-full rounded-md">
							<p>Account {`doesn't`} exist</p>
						</div>
					)}
					{emailExist && (
						<div className="bg-green-500 px-10 py-2 text-white flex justify-center items-center text-center rounded-md">
							<p>Signed In Successfully</p>
						</div>
					)}
					<h1 className="text-3xl font-semibold">Reset Password</h1>
					<div className="flex flex-col justify-normal items-start gap-1 w-full">
						<label htmlFor="username">Email:</label>
						<input
							onChange={(e) => setModalEmail(e.target.value)}
							className="bg-gray-100 px-2 py-1 rounded-md w-full border"
							type="email"
							name="email"
						/>
					</div>
					<button onClick={handleForgotPassword} className="px-3 py-1 rounded-md base-bg text-white w-full">
						Reset
					</button>
				</form>
			</div>
		</>
	);
};
