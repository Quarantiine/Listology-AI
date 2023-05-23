import React, { useReducer, useRef, useState } from "react";
import FirebaseApi from "../pages/api/firebaseApi";
import Head from "next/head";
import Image from "next/image";
import SigningUp from "../components/Registration/SigningUp";
import SigningIn from "../components/Registration/SigningIn";
import SlideShow from "../components/Registration/SlideShow";
import { createPortal } from "react-dom";

const registrationReducer = (state, { type, payload }) => {
	switch (type) {
		case "input":
			return {
				...state,
				[payload.key]: payload.value,
			};
		default:
			console.log(`Unknown Action, ${type}:${payload}`);
	}
};

export default function Registration() {
	const { registration } = FirebaseApi();
	const [registrationState, registrationDispatch] = useReducer(registrationReducer, {
		text: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [switchRegistration, setSwitchRegistration] = useState(true);
	const [errorMesg, setErrorMesg] = useState(false);
	const errorMesgRef = useRef();
	const [successfulSignUp, setSuccessfulSignUp] = useState(false);
	const successfulSignUpRef = useRef();

	const handleInputChanging = (e) => {
		registrationDispatch({
			type: "input",
			payload: {
				key: e.target.name,
				value: e.target.value,
			},
		});
	};

	const handleSigningUp = (e) => {
		e.preventDefault();
		if (
			registrationState.text?.length > 2 &&
			/^[a-zA-Z]+/.test(registrationState.text) &&
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registrationState.email) &&
			registrationState.password?.length > 5 &&
			registrationState.password === registrationState.confirmPassword &&
			!registration.allusers?.map((user) => user.email === registrationState.email).includes(true)
		) {
			registration.signingUp(registrationState.email, registrationState.password, registrationState.text);
			setSuccessfulSignUp("Successful Sign Up");
			successfulSignUpRef.current = setTimeout(() => {
				setSuccessfulSignUp("");
				clearTimeout(successfulSignUpRef.current);
			}, 3000);
		} else {
			setErrorMesg("Error: Check your information below");
			errorMesgRef.current = setTimeout(() => {
				setErrorMesg("");
				clearTimeout(errorMesgRef.current);
			}, 7000);
		}
	};

	const handleRegistrationChange = (e) => {
		e.preventDefault();
		setSwitchRegistration(!switchRegistration);
	};

	return (
		<>
			<Head>
				<title>Registration | Listology</title>
			</Head>
			<div className="absolute top-0 left-0 w-full h-full flex md:grid md:grid-cols-[40%_60%] justify-between items-center gap-0">
				<SlideShow />
				<div className="relative w-full h-full left-0 top-0 flex flex-col justify-center items-center">
					{successfulSignUp &&
						createPortal(
							<div className="absolute right-0 top-0 bg-green-500 px-10 py-2 text-white flex justify-center md:justify-start items-center text-center w-full md:w-[60%]">
								<p>{successfulSignUp}</p>
							</div>,
							document.body
						)}
					{errorMesg &&
						createPortal(
							<div className="absolute right-0 top-0 bg-red-500 px-10 py-2 text-white flex justify-center md:justify-start items-center text-center w-full md:w-[60%]">
								<p>{errorMesg}</p>
							</div>,
							document.body
						)}
					<div className="w-full sm:w-[80%] flex flex-col justify-start items-start gap-12 px-10 sm:px-0">
						<div className="flex flex-col justify-center items-start gap-2">
							<Image
								className="w-auto h-[60px]"
								src={"/icons/logo-text.svg"}
								alt="logo-text"
								width={300}
								height={143}
								sizes="true"
								priority="true"
							/>
							<p className="text-lg w-[90%]">An easy to use management and light weight tool for your daily life.</p>
						</div>
						{!switchRegistration ? (
							<SigningUp
								handleInputChanging={handleInputChanging}
								handleSubmitBtn={handleSigningUp}
								handleRegistrationChange={handleRegistrationChange}
							/>
						) : (
							<SigningIn handleRegistrationChange={handleRegistrationChange} />
						)}
					</div>
				</div>
			</div>
		</>
	);
}
