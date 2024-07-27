import React, { useState } from "react";
import Image from "next/image";
import FirebaseApi from "../../pages/api/firebaseApi";
import GeminiAPI from "../../pages/api/geminiApi";
import CreateAITodoList from "./CreateAITodoList";
import CreateAISubTodoList from "./CreateAISubTodoList";

export default function AskGeminiComponent({
	handleOpenGeminiTodoModal,
	clickedTodoFolder,
	clickedFolder,
}) {
	const { auth, todoLists } = FirebaseApi();

	const {
		geminiCreateTodos: { errorLoadingList },
	} = GeminiAPI();

	const [chatStyle, setChatStyle] = useState("");

	const handleChatStyleTodo = () => {
		setChatStyle("todo");
	};

	const handleChatStyleSubTodo = () => {
		setChatStyle("subTodo");
	};

	return (
		<>
			<div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50 p-8">
				<div
					className={`default-overflow bg-white w-[90%] max-w-[90%] sm:w-fit md:max-w-[60%] lg:max-w-[500px] rounded-lg relative p-4 flex flex-col gap-4 overflow-y-scroll overflow-x-hidden max-h-[90%]`}
				>
					{errorLoadingList && (
						<p className="text-sm bg-red-500 text-white px-2 py-1 rounded-lg text-center">
							Invalid Prompt
						</p>
					)}

					<div className="flex justify-between items-start gap-2">
						{chatStyle === "todo" ? (
							<div className="flex flex-col w-full">
								<h1 className="text-xl font-bold">
									Create To-dos with Gemini AI
								</h1>
								<p className="text-sm text-gray-500">
									Ask Gemini anything to create to-dos for you
								</p>
							</div>
						) : chatStyle === "subTodo" ? (
							<div className="flex flex-col w-full">
								<h1 className="text-xl font-bold">
									Create Sub to-dos with Gemini AI
								</h1>
								<p className="text-sm text-gray-500">
									Ask Gemini anything to create Sub to-dos for the to-do below
								</p>
							</div>
						) : (
							<div className="flex flex-col w-full">
								<h1 className="text-xl font-bold">Create with Gemini AI</h1>
								<p className="text-sm text-gray-500">
									Ask Gemini anything to create To-dos or Sub to-dos
								</p>
							</div>
						)}

						<button onClick={handleOpenGeminiTodoModal} className="text-btn">
							<Image
								className="min-h-[25px] max-h-[25px] w-auto cursor-default md:cursor-pointer rotate-90"
								src={"/icons/close.svg"}
								alt="close"
								width={30}
								height={30}
							/>
						</button>
					</div>

					{chatStyle === "" && (
						<>
							<div className="w-full flex flex-col gap-2 justify-center items-center">
								<button
									onClick={handleChatStyleTodo}
									className="base-btn w-full"
								>
									Create To-dos
								</button>

								{todoLists.allTodoLists
									?.filter(
										(value) =>
											value.userID === auth.currentUser.uid &&
											value.folderID === clickedTodoFolder
									)
									?.map((value) => value).length > 0 ? (
									<button
										onClick={handleChatStyleSubTodo}
										className="base-btn w-full"
									>
										Create Sub To-dos
									</button>
								) : (
									<button className="base-btn !bg-gray-500 !cursor-not-allowed w-full">
										Create Sub To-dos
									</button>
								)}
							</div>
						</>
					)}

					{chatStyle === "todo" && (
						<CreateAITodoList
							handleOpenGeminiTodoModal={handleOpenGeminiTodoModal}
							clickedTodoFolder={clickedTodoFolder}
							clickedFolder={clickedFolder}
							setChatStyle={setChatStyle}
						/>
					)}

					{chatStyle === "subTodo" && (
						<CreateAISubTodoList
							handleOpenGeminiTodoModal={handleOpenGeminiTodoModal}
							clickedTodoFolder={clickedTodoFolder}
							clickedFolder={clickedFolder}
							setChatStyle={setChatStyle}
						/>
					)}
				</div>
			</div>
		</>
	);
}
