import React, { useEffect, useState } from "react";
import Image from "next/image";
import FirebaseApi from "../../pages/api/firebaseApi";
import GeminiAPI from "../../pages/api/geminiApi";
import ReactMarkdown from "react-markdown";

export default function AskGeminiComponent({
	handleOpenGeminiTodoModal,
	clickedTodoFolder,
	clickedFolder,
	loadingTodos,
	setLoadingTodos,
}) {
	const { auth, todoLists, todolistFolders } = FirebaseApi();
	const {
		geminiLoadingTodos,
		createTodoListWithAI,
		errorLoadingList,
		AIListOfTodos,
		setAIListOfTodos,
	} = GeminiAPI();
	const [promptText, setPromptText] = useState("");

	const handleCreateTodoListWithAI = async () => {
		if (promptText) {
			await createTodoListWithAI(
				promptText,

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder &&
							value.folderName === clickedFolder,
					)
					.map((value) => value.folderTitle)
					.toString(),

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder &&
							value.folderName === clickedFolder,
					)
					.map((value) => value.folderDescription)
					.toString(),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed,
						)
						.map((value) => value.todo),
				),

				JSON.stringify(
					todoLists.allSubTodos
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed,
						)
						.map((value) => value.todo),
				),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								value.completed,
						)
						.map((value) => value.todo),
				),
			);

			setPromptText(promptText);
		}
	};

	const handleClearTodolist = () => {
		setAIListOfTodos("");
	};

	const handleSaveListOfTodos = () => {
		try {
			setLoadingTodos(true);

			AIListOfTodos.map((todoItem) =>
				todoLists.addingTodosGemini(
					clickedTodoFolder,
					clickedFolder,
					todoItem.todo,
					todoItem.difficulty,
					todoItem.ignoreTodo,
				),
			);
		} catch (error) {
			console.log(error);
		} finally {
			setAIListOfTodos("");
			setLoadingTodos(false);
			handleOpenGeminiTodoModal();
		}
	};

	useEffect(() => {
		console.log(promptText);
	});

	return (
		<>
			<div className="absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50 p-8">
				<div
					className={`default-overflow bg-white w-[90%] max-w-[90%] sm:w-fit md:max-w-[60%] lg:max-w-[600px] rounded-lg relative p-4 flex flex-col gap-4 overflow-y-scroll overflow-x-hidden ${AIListOfTodos ? "max-h-[90%] min-h-fit sm:h-fit" : "h-fit"}`}
				>
					{errorLoadingList && (
						<p className="text-sm bg-red-500 text-white px-2 py-1 rounded-lg text-center">
							Invalid Prompt
						</p>
					)}

					{loadingTodos && (
						<p className="text-sm bg-green-500 text-white px-2 py-1 rounded-lg text-center">
							Saving To-dos...
						</p>
					)}

					<div className="flex justify-between items-start gap-2">
						<div className="flex flex-col w-full">
							<h1 className="text-xl font-bold">
								Create To-dos with Gemini AI
							</h1>
							<p className="text-sm text-gray-500">
								Ask Gemini anything to create to-dos for you
							</p>
						</div>

						{loadingTodos ? (
							<button className="cursor-not-allowed opacity-50">
								<Image
									className="min-h-[25px] max-h-[25px] w-auto cursor-default md:cursor-pointer rotate-90"
									src={"/icons/close.svg"}
									alt="close"
									width={30}
									height={30}
								/>
							</button>
						) : (
							<button onClick={handleOpenGeminiTodoModal} className="text-btn">
								<Image
									className="min-h-[25px] max-h-[25px] w-auto cursor-default md:cursor-pointer rotate-90"
									src={"/icons/close.svg"}
									alt="close"
									width={30}
									height={30}
								/>
							</button>
						)}
					</div>

					{!geminiLoadingTodos ? (
						<>
							{!AIListOfTodos ? (
								<div className="flex flex-col gap-2 w-full">
									<textarea
										className="input-field rounded-lg"
										cols={20}
										rows={5}
										placeholder="Create me a list..."
										onChange={(e) => setPromptText(e.target.value)}
										value={promptText}
									/>

									<button
										onClick={handleCreateTodoListWithAI}
										className="base-btn w-full"
									>
										Create
									</button>
								</div>
							) : (
								<div className="flex flex-col gap-4 w-full">
									<div className="flex flex-wrap sm:grid sm:grid-cols-2 gap-2 w-full min-h-auto h-full sm:max-h-[300px] overflow-y-scroll overflow-x-hidden">
										{AIListOfTodos.map((todoItem, index) => (
											<div key={index}>
												<p className="font-bold">{index + 1}. To-do:</p>{" "}
												<ReactMarkdown>{todoItem.todo}</ReactMarkdown>
											</div>
										))}
									</div>

									<div className="flex flex-col w-full justify-center items-center gap-1 mt-auto">
										<button
											onClick={handleSaveListOfTodos}
											className="base-btn w-full"
										>
											Save
										</button>

										<button
											onClick={handleClearTodolist}
											className="base-btn !bg-red-500 w-full"
										>
											Cancel
										</button>
									</div>
								</div>
							)}
						</>
					) : (
						<p className="text-gray-500">Loading To-dos...</p>
					)}
				</div>
			</div>
		</>
	);
}
