import React, { useState } from "react";
import shortenUrl from "shorten-url";
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
	const [chatStyle, setChatStyle] = useState("");

	const handleCreateTodoListWithAI = async (e) => {
		e.preventDefault();

		if (promptText) {
			await createTodoListWithAI(
				promptText,

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder &&
							value.folderName === clickedFolder
					)
					.map((value) => value.folderTitle)
					.toString(),

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder &&
							value.folderName === clickedFolder
					)
					.map((value) => value.folderDescription)
					.toString(),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed
						)
						.map((value) => value.todo)
				),

				JSON.stringify(
					todoLists.allSubTodos
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed
						)
						.map((value) => value.todo)
				),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								value.completed
						)
						.map((value) => value.todo)
				)
			);

			setPromptText(promptText);
		}
	};

	const handleClearTodoList = () => {
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
					todoItem.ignoreTodo
				)
			);
		} catch (error) {
			console.log(error);
		} finally {
			setAIListOfTodos("");
			setLoadingTodos(false);
			handleOpenGeminiTodoModal();
		}
	};

	const handleClearChatStyle = (e) => {
		e.preventDefault();
		setChatStyle("");
	};

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

					{loadingTodos && (
						<p className="text-sm bg-green-500 text-white px-2 py-1 rounded-lg text-center">
							Saving To-dos...
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

					{chatStyle === "" && (
						<>
							<div className="w-full flex flex-col gap-2 justify-center items-center">
								<button
									onClick={handleChatStyleTodo}
									className="base-btn w-full"
								>
									Create To-dos
								</button>
								<button
									onClick={handleChatStyleSubTodo}
									className="base-btn w-full"
								>
									Create Sub To-dos
								</button>
							</div>
						</>
					)}

					{chatStyle === "todo" && (
						<CreateAITodoList
							geminiLoadingTodos={geminiLoadingTodos}
							AIListOfTodos={AIListOfTodos}
							promptText={promptText}
							setPromptText={setPromptText}
							handleCreateTodoListWithAI={handleCreateTodoListWithAI}
							handleSaveListOfTodos={handleSaveListOfTodos}
							handleClearTodoList={handleClearTodoList}
							handleClearChatStyle={handleClearChatStyle}
						/>
					)}

					{chatStyle === "subTodo" && (
						<CreateAISubTodoList
							handleClearChatStyle={handleClearChatStyle}
							todoLists={todoLists}
							auth={auth}
							clickedTodoFolder={clickedTodoFolder}
						/>
					)}
				</div>
			</div>
		</>
	);
}

const CreateAISubTodoList = ({
	handleClearChatStyle,
	todoLists,
	auth,
	clickedTodoFolder,
}) => {
	const [clickedTodo, setClickedTodo] = useState("");
	const [subTodoText, setSubTodoText] = useState("");

	function extractLink(value) {
		var pattern = /(https?:\/\/[^\s]+)/;

		var matches = value.match(pattern);

		if (matches && matches.length > 0) {
			return matches[0];
		}

		return null;
	}

	const handleClickedTodo = (e, id) => {
		e.preventDefault();
		setClickedTodo(id);
	};

	const handleChangeTodo = (e) => {
		e.preventDefault();
		setClickedTodo("");
	};

	const AICreateSubTodos = (e) => {
		e.preventDefault();
		// CODE HERE
	};

	return (
		<>
			{!clickedTodo && (
				<>
					<div className="flex flex-col justify-start items-start gap-1 text-start overflow-x-hidden overflow-y-scroll default-overflow w-full h-full">
						<h1 className="text-xl font-bold">
							Choose a to-do for your sub to-do list
						</h1>

						{todoLists.allTodoLists
							?.filter(
								(value) =>
									value.userID === auth.currentUser.uid &&
									value.folderID === clickedTodoFolder &&
									!value.completed
							)
							?.map((value) => {
								return (
									<React.Fragment key={value.id}>
										<button
											onClick={(e) => handleClickedTodo(e, value.id)}
											className="text-btn text-start flex justify-start items-start gap-1"
										>
											<p className="font-bold min-w-[50px]">To-do: </p>
											{!extractLink(value.todo) && (
												<ReactMarkdown>{value.todo}</ReactMarkdown>
											)}

											{extractLink(value.todo) && (
												<p>
													{value.todo.replace(extractLink(value.todo), "")}{" "}
													<span className="text-gray-500">
														{shortenUrl(extractLink(value.todo), -30)
															.replace("", "[Link]")
															.slice(0, 6)}
													</span>
												</p>
											)}
										</button>
									</React.Fragment>
								);
							})}
					</div>

					<button
						onClick={handleClearChatStyle}
						className="base-btn !bg-red-500 w-full mt-2"
					>
						Back
					</button>
				</>
			)}

			{clickedTodo && (
				<div className="flex flex-col gap-2 w-full h-full justify-start items-center">
					{todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								value.id === clickedTodo
						)
						.map((value) => {
							return (
								<React.Fragment key={value.id}>
									<div className="text-start flex justify-start items-start gap-1">
										<p className="font-bold min-w-[50px]">To-do: </p>
										<ReactMarkdown>{value.todo}</ReactMarkdown>
									</div>
								</React.Fragment>
							);
						})}

					<form className="flex flex-col gap-2 w-full">
						<input
							className="input-field rounded-lg w-full"
							placeholder="Create me a list..."
							onChange={(e) => setSubTodoText(e.target.value)}
							value={subTodoText}
							type="text"
							name="message"
						/>

						<button onClick={AICreateSubTodos} className="base-btn w-full">
							Create (Coming Soon)
						</button>

						<button
							onClick={handleChangeTodo}
							className="inverse-base-btn w-full"
						>
							Change To-do
						</button>

						<button
							onClick={handleClearChatStyle}
							className="inverse-base-btn !text-red-500 !border-red-500 w-full"
						>
							Back
						</button>
					</form>
				</div>
			)}
		</>
	);
};

const CreateAITodoList = ({
	geminiLoadingTodos,
	AIListOfTodos,
	promptText,
	setPromptText,
	handleCreateTodoListWithAI,
	handleSaveListOfTodos,
	handleClearTodoList,
	handleClearChatStyle,
}) => {
	return (
		<>
			{!geminiLoadingTodos ? (
				<>
					{!AIListOfTodos ? (
						<form className="flex flex-col gap-2 w-full">
							<input
								className="input-field rounded-lg w-full"
								placeholder="Create me a list..."
								onChange={(e) => setPromptText(e.target.value)}
								value={promptText}
								type="text"
								name="message"
							/>

							<button
								onClick={handleCreateTodoListWithAI}
								className="base-btn w-full"
							>
								Create
							</button>

							<button
								onClick={handleClearChatStyle}
								className="inverse-base-btn !text-red-500 !border-red-500 w-full"
							>
								Back
							</button>
						</form>
					) : (
						<div className="flex flex-col gap-4 w-full">
							<div className="flex flex-wrap sm:grid sm:grid-cols-2 gap-2 w-full min-h-auto h-full sm:max-h-[300px] overflow-y-scroll overflow-x-hidden">
								{AIListOfTodos.map((todoItem, index) => (
									<div key={index}>
										<p className="font-bold">{index + 1}. To-do:</p>
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
									onClick={handleClearTodoList}
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
		</>
	);
};
