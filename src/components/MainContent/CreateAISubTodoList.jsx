import React, { useEffect, useState } from "react";
import shortenUrl from "shorten-url";
import FirebaseApi from "../../pages/api/firebaseApi";
import GeminiAPI from "../../pages/api/geminiApi";
import ReactMarkdown from "react-markdown";

export default function CreateAISubTodoList({
	handleOpenGeminiTodoModal,
	clickedTodoFolder,
	clickedFolder,
	setChatStyle,
}) {
	const { auth, todoLists, todolistFolders } = FirebaseApi();

	const {
		geminiCreateSubTodos: {
			geminiLoadingSubTodos,
			errorLoadingSubTodoList,
			AIListOfSubTodos,
			setAIListOfSubTodos,
			createSubTodoListWithAI,
		},

		geminiDifficultyAssessment: { readTodoDifficulty, loadingDifficulty },
	} = GeminiAPI();

	const [clickedTodo, setClickedTodo] = useState("");
	const [subTodoPrompt, setSubTodoPrompt] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const handleClearChatStyle = (e) => {
		e.preventDefault();
		setChatStyle("");
	};

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

	const handleCreateSubTodoListWithAI = async (e) => {
		e.preventDefault();

		if (subTodoPrompt) {
			await createSubTodoListWithAI(
				subTodoPrompt,
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
								!value.completed &&
								value.id === clickedTodo
						)
						.map((value) => value)
				),

				JSON.stringify(
					todoLists.allSubTodos
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed &&
								value.todoID === clickedTodo
						)
						.map((value) => value)
				),

				JSON.stringify(
					todoLists.allSubTodos
						.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								value.completed &&
								value.todoID === clickedTodo
						)
						.map((value) => value)
				)
			);

			setSubTodoPrompt(subTodoPrompt);
		}
	};

	const handleSaveListOfSubTodos = async () => {
		try {
			AIListOfSubTodos?.reverse()?.map((todoItem) =>
				todoLists.addingSubTodosGemini(
					todoItem.todo,
					clickedTodo,
					clickedTodoFolder,
					clickedFolder
				)
			);

			const todo = todoLists.allTodoLists
				.filter(
					(value) =>
						value.id === clickedTodo && value.userID === auth.currentUser.uid
				)
				.map((value) => value.todo)
				.toString();

			const todoIgnored = todoLists.allTodoLists
				.filter(
					(value) =>
						value.id === clickedTodo && value.userID === auth.currentUser.uid
				)
				.map((value) => value.ignoredTodo)[0];

			const subTodos = todoLists.allSubTodos
				.filter(
					(value) =>
						value.todoID === clickedTodo &&
						value.userID === auth.currentUser.uid
				)
				.map((value) => value.todo)
				.toString();


			todoLists.updatingTodoDifficulty(
				clickedTodo,

				await readTodoDifficulty(
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
					todo,
					"No Start Date",
					"No End Date",
					subTodos,
					todoIgnored
				)
			);
		} catch (error) {
			console.log(error);
		} finally {
			setAIListOfSubTodos("");
			handleOpenGeminiTodoModal();
		}
	};

	const handleClearSubTodoList = () => {
		setAIListOfSubTodos("");
	};

	const handleSearchQueryChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<>
			{!clickedTodo && (
				<>
					{todoLists.allTodoLists
						?.filter(
							(value) =>
								value.userID === auth.currentUser.uid &&
								value.folderID === clickedTodoFolder &&
								!value.completed
						)
						?.map((value) => value).length > 5 && (
						<input
							className="input-field w-full"
							type="search"
							name="search"
							placeholder="Search to-dos"
							onChange={handleSearchQueryChange}
							value={searchQuery}
						/>
					)}

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
							?.map((value, index) => {
								if (
									value.todo
										.normalize("NFD")
										.replace(/\p{Diacritic}/gu, "")
										.toLowerCase()
										.includes(searchQuery.toLowerCase())
								) {
									return (
										<React.Fragment key={value.id}>
											<button
												onClick={(e) => handleClickedTodo(e, value.id)}
												className="text-btn text-start flex flex-col justify-start items-start gap-1 w-full bg-gray-200 px-2 py-1 rounded-lg"
											>
												<p className="font-bold min-w-[50px]">
													<span className="text-gray-500">{index + 1}. </span>
													To-do:
												</p>

												{!extractLink(value.todo) && (
													<div className="line-clamp-2">
														<ReactMarkdown>{value.todo}</ReactMarkdown>
													</div>
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
								}
							})}

						{todoLists.allTodoLists
							?.filter(
								(value) =>
									value.userID === auth.currentUser.uid &&
									value.folderID === clickedTodoFolder &&
									!value.completed &&
									value.todo
										.normalize("NFD")
										.replace(/\p{Diacritic}/gu, "")
										.toLowerCase()
										.includes(searchQuery.toLowerCase())
							)
							?.map((value) => value).length < 1 && (
							<p className="text-gray-500">No Search Results</p>
						)}
					</div>

					<button
						onClick={handleClearChatStyle}
						className="base-btn !bg-red-500 w-full"
					>
						Back
					</button>
				</>
			)}

			{clickedTodo && (
				<>
					{geminiLoadingSubTodos ? (
						<p className="text-gray-500">Loading Sub To-dos...</p>
					) : AIListOfSubTodos ? (
						<>
							<div className="flex flex-col gap-4 w-full">
								<div className="flex flex-wrap sm:grid sm:grid-cols-2 gap-2 w-full min-h-auto h-full sm:max-h-[300px] overflow-y-scroll overflow-x-hidden">
									{AIListOfSubTodos?.map((todoItem, index) => (
										<div key={index}>
											<p className="font-bold">{index + 1}. To-do:</p>

											{!extractLink(todoItem?.todo) && (
												<div className="line-clamp-3">
													<ReactMarkdown>{todoItem?.todo}</ReactMarkdown>
												</div>
											)}

											{extractLink(todoItem?.todo) && (
												<p>
													{todoItem?.todo.replace(
														extractLink(todoItem?.todo),
														""
													)}{" "}
													<span className="text-gray-500">
														{shortenUrl(extractLink(todoItem?.todo), -30)
															.replace("", "[Link]")
															.slice(0, 6)}
													</span>
												</p>
											)}
										</div>
									))}
								</div>

								<div className="flex flex-col w-full justify-center items-center gap-1 mt-auto relative">
									{loadingDifficulty ? (
										<>
											<button className="base-btn !bg-gray-500 w-full !cursor-not-allowed">
												Save
											</button>

											<button className="base-btn !bg-gray-500 w-full !cursor-not-allowed">
												Cancel
											</button>
										</>
									) : (
										<>
											<button
												onClick={handleSaveListOfSubTodos}
												className="base-btn w-full"
											>
												Save
											</button>

											<button
												onClick={handleClearSubTodoList}
												className="base-btn !bg-red-500 w-full"
											>
												Cancel
											</button>
										</>
									)}

									{loadingDifficulty && (
										<p className="text-gray-500 mt-2">
											Loading To-do Difficulty...
										</p>
									)}
								</div>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-2 w-full h-full justify-start items-center">
							{errorLoadingSubTodoList && (
								<p className="text-white bg-red-500 text-center px-2 py-1 rounded-lg w-full">
									Invalid Prompt
								</p>
							)}

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
											<div className="flex justify-center items-center gap-1 w-full bg-gray-100 px-2 py-1 rounded-lg">
												<p className="font-bold min-w-[50px]">To-do: </p>
												{!extractLink(value.todo) && (
													<div className="line-clamp-3">
														<ReactMarkdown>{value.todo}</ReactMarkdown>
													</div>
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
											</div>
										</React.Fragment>
									);
								})}

							<form className="flex flex-col gap-2 w-full">
								<textarea
									className="input-field rounded-lg w-full min-h-[100px] max-h-[300px]"
									rows={5}
									placeholder="Create me a list..."
									onChange={(e) => setSubTodoPrompt(e.target.value)}
									value={subTodoPrompt}
									type="text"
									name="message"
								/>

								<button
									onClick={handleCreateSubTodoListWithAI}
									className="base-btn w-full"
								>
									Create Sub To-dos
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
			)}
		</>
	);
}
