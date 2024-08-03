import React from "react";
import FirebaseApi from "./api/firebaseApi";
import { useRouter } from "next/router";
import Head from "next/head";
import demos from "../data/demos.json";

export default function Tutorials() {
	const { auth, registration } = FirebaseApi();

	return (
		<>
			<Head>
				<title>Tutorial Demos</title>
			</Head>

			{auth?.currentUser ? (
				<>
					{registration.allusers
						?.filter((user) => user.userID === auth?.currentUser?.uid)
						?.map((user) => {
							return <UserLoggedIn key={user.id} user={user} />;
						})}
				</>
			) : (
				<>
					<UserNotLoggedIn />
				</>
			)}
		</>
	);
}

const UserNotLoggedIn = () => {
	const router = useRouter();

	return (
		<>
			<div className="p-16 flex flex-col gap-8">
				<div className="flex flex-col justify-start items-start">
					<button
						onClick={() => router.push("/registration")}
						className="text-sm font-base text-btn text-gray-500"
					>
						Not Logged In?
					</button>
					<h1 className="text-3xl font-bold">Tutorial Demos</h1>
				</div>

				{demos.map((demo) => {
					return (
						<React.Fragment key={demo.id}>
							<div className="flex flex-col">
								<h1 className="font-semibold text-lg">{demo.title}</h1>

								<div
									className={`tutorial-overflow overflow-x-scroll overflow-y-hidden w-full h-[200px] sm:h-[300px] grid grid-flow-col auto-cols-[200px] sm:auto-cols-[300px] gap-10 py-3`}
								>
									{demo.videos?.map((video) => {
										return (
											<React.Fragment key={video.id}>
												<div className="bg-[rgba(0,0,0,0.7)] text-white h-full w-full bg-gray-100 flex flex-col justify-start items-end rounded-t-xl overflow-auto">
													<div className="h-full w-full bg-black">
														<video
															className="w-full h-full flex justify-center items-center"
															controls
														>
															<source src={video.src} type="video/mp4" />
															Your browser does not support the video tag.
														</video>
													</div>

													<p
														title={video.title}
														className="font-bold bg-gray-500 p-2 w-full rounded-b-xl line-clamp-1"
													>
														{video.title}
													</p>
												</div>
											</React.Fragment>
										);
									})}
								</div>
							</div>
						</React.Fragment>
					);
				})}
			</div>
		</>
	);
};

const UserLoggedIn = ({ user }) => {
	const router = useRouter();

	return (
		<>
			<div className="p-16 flex flex-col gap-5">
				<div className="flex flex-col justify-start items-start">
					<button
						onClick={() => router.push("/")}
						className="text-sm font-base text-btn text-gray-500"
					>
						User {user.username}, is Logged In
					</button>
					<h1 className="text-3xl font-bold">Tutorial Demos</h1>
				</div>

				{demos.map((demo) => {
					return (
						<React.Fragment key={demo.id}>
							<div className="flex flex-col">
								<h1 className="font-semibold text-lg">{demo.title}</h1>

								<div
									className={`tutorial-overflow overflow-x-scroll overflow-y-hidden w-full h-[200px] sm:h-[300px] grid grid-flow-col auto-cols-[200px] sm:auto-cols-[300px] gap-10 py-3`}
								>
									{demo.videos?.map((video) => {
										return (
											<React.Fragment key={video.id}>
												<div className="bg-[rgba(0,0,0,0.7)] text-white h-full w-full bg-gray-100 flex flex-col justify-start items-end rounded-t-xl overflow-auto">
													<div className="h-full w-full bg-black">
														<video
															className="w-full h-full flex justify-center items-center"
															controls
														>
															<source src={video.src} type="video/mp4" />
															Your browser does not support the video tag.
														</video>
													</div>

													<p
														title={video.title}
														className="font-bold bg-gray-500 p-2 w-full rounded-b-xl line-clamp-1"
													>
														{video.title}
													</p>
												</div>
											</React.Fragment>
										);
									})}
								</div>
							</div>
						</React.Fragment>
					);
				})}
			</div>
		</>
	);
};
