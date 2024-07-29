import React, { useState } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import GeminiAPI from "../../pages/api/geminiApi";
import ReactMarkdown from "react-markdown";

export default function CreateAITodoList({
	handleOpenGeminiTodoModal,
	clickedTodoFolder,
	clickedFolder,
	setChatStyle,
	todolistFolder,
}) {
	const { auth, todoLists, todolistFolders, sharingTodoFolder } = FirebaseApi();

	const {
		geminiCreateTodos: {
			AIListOfTodos,
			setAIListOfTodos,
			geminiLoadingTodos,
			createTodoListWithAI,
		},
	} = GeminiAPI();

	const [promptText, setPromptText] = useState("");

	const handleCreateTodoListWithAI = async (e) => {
		e.preventDefault();

		if (promptText) {
			await createTodoListWithAI(
				promptText,

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder
					)
					.map((value) => value.folderTitle)
					.toString(),

				todolistFolders.allTodoFolders
					.filter(
						(value) =>
							value.userID === auth.currentUser.uid &&
							value.id === clickedTodoFolder
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
				),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === todolistFolder.senderTodoFolderID &&
								!value.completed
						)
						.map((value) => value.todo)
				),

				JSON.stringify(
					todoLists.allTodoLists
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === todolistFolder.senderTodoFolderID &&
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
			todolistFolder.senderTodoFolderID
				? AIListOfTodos?.reverse()?.map((todoItem) =>
						todoLists.addingTodosGemini(
							clickedTodoFolder,
							[],
							todoItem.todo,
							todoItem.difficulty,
							todoItem.ignoreTodo || false
						)
				  )
				: AIListOfTodos?.reverse()?.map((todoItem) =>
						todoLists.addingTodosGemini(
							clickedTodoFolder,
							clickedFolder,
							todoItem.todo,
							todoItem.difficulty,
							todoItem.ignoreTodo || false
						)
				  );
		} catch (error) {
			console.log(error);
		} finally {
			setAIListOfTodos("");
			handleOpenGeminiTodoModal();
		}
	};

	const handleClearChatStyle = (e) => {
		e.preventDefault();
		setChatStyle("");
	};

	return (
		<>
			{!geminiLoadingTodos ? (
				<>
					{!AIListOfTodos ? (
						<form className="flex flex-col gap-2 w-full">
							<textarea
								className="input-field rounded-lg w-full min-h-[100px] max-h-[300px]"
								rows={5}
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
}
