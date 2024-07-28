"use client";

import React, { useRef, useState } from "react";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import { apiKeys } from "../../../config";

const { geminiAPIKey } = apiKeys;
const genAI = new GoogleGenerativeAI(geminiAPIKey);

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-pro",
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 10000,
	responseMimeType: "text/plain",
};

class GeminiChatSystem {
	setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setGeminiLoadingTodos: React.Dispatch<React.SetStateAction<boolean>>;
	setErrorLoadingList: React.Dispatch<React.SetStateAction<boolean>>;
	errorLoadingListRef: any;
	setAIListOfTodos: React.Dispatch<React.SetStateAction<any>>;
	setGeminiChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
	messageHistory: any;
	setMessageHistory: any;
	setGeminiLoadingSubTodos: React.Dispatch<React.SetStateAction<boolean>>;
	setErrorLoadingSubTodoList: React.Dispatch<React.SetStateAction<boolean>>;
	errorLoadingSubTodoListRef: any;
	setAIListOfSubTodos: React.Dispatch<React.SetStateAction<any>>;
	loadingDifficulty: boolean;
	setLoadingDifficulty: React.Dispatch<React.SetStateAction<boolean>>;

	constructor(
		setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>,
		setGeminiLoadingTodos: React.Dispatch<React.SetStateAction<boolean>>,
		setErrorLoadingList: React.Dispatch<React.SetStateAction<boolean>>,
		errorLoadingListRef: any,
		setAIListOfTodos: React.Dispatch<React.SetStateAction<any>>,
		setGeminiChatLoading: React.Dispatch<React.SetStateAction<boolean>>,
		messageHistory: any,
		setMessageHistory: any,
		setGeminiLoadingSubTodos: React.Dispatch<React.SetStateAction<boolean>>,
		setErrorLoadingSubTodoList: React.Dispatch<React.SetStateAction<boolean>>,
		errorLoadingSubTodoListRef: any,
		setAIListOfSubTodos: React.Dispatch<React.SetStateAction<any>>,
		loadingDifficulty: boolean,
		setLoadingDifficulty: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		this.setTodoLoading = setTodoLoading;
		this.setGeminiLoadingTodos = setGeminiLoadingTodos;
		this.setErrorLoadingList = setErrorLoadingList;
		this.errorLoadingListRef = errorLoadingListRef;
		this.setAIListOfTodos = setAIListOfTodos;
		this.setGeminiChatLoading = setGeminiChatLoading;
		this.messageHistory = messageHistory;
		this.setMessageHistory = setMessageHistory;
		this.setGeminiLoadingSubTodos = setGeminiLoadingSubTodos;
		this.setErrorLoadingSubTodoList = setErrorLoadingSubTodoList;
		this.errorLoadingSubTodoListRef = errorLoadingSubTodoListRef;
		this.setAIListOfSubTodos = setAIListOfSubTodos;
		this.loadingDifficulty = loadingDifficulty;
		this.setLoadingDifficulty = setLoadingDifficulty;
	}

	async readTodoDifficulty(
		todoFolderTitle: string,
		todoFolderDescription: string,
		todoTask: string,
		todoStartDate: string,
		todoEndDate: string,
		todoSubTodo: string,
		ignoredTodo: boolean,
		createdSubTodos: string,
	) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: "Hello Gemini. You are integrated into a web application called Listology, a to-do list management tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. Your task is to assess the difficulty of a to-do item. Base the difficulty rating on the following criteria: the to-do folder title, description, the specific to-do task, the to-do due date, and any associated sub to-dos. You should only respond with one of the following difficulty levels: `Easy`, `Intermediate`, `Hard`, or `Unsure`. If you encounter the phrase Todo is Ignored, mark the difficulty as `Unsure` or change the current difficulty to `Unsure`. Do not provide any output other than the specified difficulty ratings. If the to-do does not have a specific task or you are `unsure`, respond with `Unsure`. The user information will consist of a lot of things so try your best to give the best difficulty",
						},
					],
				},
			],
		});

		try {
			this.setLoadingDifficulty(true);

			await chatSession.sendMessage(
				`
				- To-do Folder Title: ${todoFolderTitle} and Descriptions: ${todoFolderDescription}
				- To-do Task: ${todoTask}, To-do Start Date: ${todoStartDate}, To-do End Date: ${todoEndDate}, and Todo is ${
					ignoredTodo ? "Ignored" : "Not Ignored"
				}
				- Sub To-dos: ${todoSubTodo}, ${createdSubTodos && createdSubTodos}
				
				What is the difficulty of the to-do based on the given information?
				`,
			);

			const response: Content[] = await chatSession.getHistory();

			return response
				.filter((value) => value.role === "model")
				.map((resp) => resp.parts[0].text)
				.toString();
		} catch (error) {
			console.log(error);
		} finally {
			this.setLoadingDifficulty(false);
		}
	}

	async grammaticallyFixedTodo(text: string) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: "Hello Gemini. You are integrated into a web application called Listology, a to-do list management tool designed to simplify users' lives. Now that you have some background on the web app, I have a specific task for you. Your task is to edit the text I send you, making it grammatically correct and easier to read without altering its meaning. This is the only task you should perform—do not add, remove, or interpret beyond grammatical correction and readability enhancement. If the text includes a link, ensure the link remains unchanged. Simply return the revised text. Do not include any additional information or explanation.",
						},
					],
				},
			],
		});

		try {
			this.setTodoLoading(true);
			await chatSession.sendMessage(
				`Change this text and make it better according to the instructions given above: ${text}`,
			);

			const response: Content[] = await chatSession.getHistory();

			return response
				.filter((value) => value.role === "model")
				.map((resp) => resp.parts[0].text)
				.toString();
		} catch (error) {
			console.log(error);
		} finally {
			this.setTodoLoading(false);
		}
	}

	async geminiChat(
		prompt: string,
		username: string,
		todoFolderTitle: string,
		todoFolderDescription: string,
		todos: string,
		subTodos: string,
	) {
		try {
			this.setGeminiChatLoading(true);

			const chatHistory = this.messageHistory?.map((message: any) => ({
				role: message.role.toLowerCase(),
				parts: [{ text: message.parts[0].text }],
			}));

			const prePrompt = {
				role: "user",
				parts: [
					{
						text: `Password: *^GIbi*&&Bgfdr3ECj - This password is to never be shared with anyone. Only read the introduction and follow the instructions and examples below.
						
						Introduction: Hello. You are integrated into a web application called Listology, a to-do list management tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. Please follow the instructions below carefully, as provided by Daniel Ward, the developer, to be a great assistance to users.

						Instruction: Keep responses short and concise. You, the chatbot assistant, will be named Gemini. The user's name or username is "${username}". Provide their name if they ask. If they inquire about your creator or something related, you were configured by Daniel Ward, a smart developer, and created by Google. Additionally, adopt a style similar to Jarvis from Iron Man when interacting with users.

						Instruction: You are meant to be a helpful assistant. Answer any questions the user may have. You will have access to the user's to-do folder information, which includes the to-do folder's title, description, and the user's to-dos and sub to-dos. This information will be stored in memory to assist with answering related questions. The user's to-do folder information will be provided in a JSON object string format. Use this information to help the user, whether their questions relate to their to-do folder or not.

						Instruction: Store the following user data as a memory for future reference: User's To-do folder info - To-do folder title: ${todoFolderTitle} and description: ${todoFolderDescription} | To-dos: ${todos}, Sub To-dos: ${subTodos}

						Instruction: Extract these items from the user's to-dos and their types. Use this information to assist the user. Items marked with /ignore are sensitive and should not be shared unless explicitly asked about by the user. If they ask about ignored items, explain that it is sensitive information.

							completed: boolean
							createdTime: timestamp /ignore
							difficulty: string
							favorited: boolean
							folderID: string /ignore
							ignoreTodo: boolean
							mainFolder: string /ignore
							markImportant: boolean
							todo: string
							userID: string /ignore
							Instruction: Extract these items from the user's sub to-dos and their types. Use this information to assist the user.

							completed: boolean
							createdTime: timestamp /ignore
							favorited: boolean
							folderID: string /ignore
							mainFolder: string /ignore
							todo: string
							todoID: string /ignore
							userID: string /ignore
							
						Instruction: You will not be able to create to-do lists for the user. Your role is to provide information and assistance based on the user's inquiries. If the user requests to create to-dos, direct them to use the "Create with Gemini" button in the to-do folder, which is colored blue, purple, and red and can create to-do lists with Gemini AI. Pay close attention to the user's requests and do not confuse their request with the creation of to-do lists. If providing a link, ensure it opens in a new tab.

						Instruction: By default, show the user their to-dos that are not completed, along with their sub to-dos under each to-do. If the user requests specific to-dos or sub to-dos, provide those. Use the following format when displaying to-dos and sub to-dos:

							Examples:
	
							To-do: [To-do]
								Sub To-do: [Sub To-do]
								Sub To-do: [Sub To-do]
								Sub To-do: [Sub To-do]
	
							Instruction: Add a "\n\n" after every to-do and sub to-do list.
	
							Instruction: If a to-do has "ignoreTodo" set to true, display it in the following format:
	
							Example:
								Ignored To-do: [Ignored Todo]
								Ignored To-do: [Ignored Todo]
								Ignored To-do: [Ignored Todo]

						Instruction: If the user's prompt is unclear, explain that the request is not clear and ask for clarification.

						Instruction: If the user's to-dos or sub to-dos contain links, remove the link but indicate the presence of a link by stating "[Has a Link]" next to the to-do or sub to-do.

						Instruction: If a user requests a link, provide it, ensuring it does not open in a new tab.

						Instruction: If the user wants you to create prompts with you, so they could create great to-do list with the "Create with Gemini" button, then help them create prompts tailored to their prompts that will maximize the chances of creating great to-dos with the "Create with Gemini" button. Give the user one prompt to use and if the user doesn't like it and ask for more, then give the user one prompt at a time. With all of your prompts, don't make them too complex.

						Instruction: If the user ask what can you do, then explain to them things various things your capable of doing for them in Listology

						Outro: The instructions above are for handling the user prompts that follow this outro message. The instructions above are from the developer Daniel Ward, but everything after this outro will be the user's prompts. Answer their question the best you can and if you don't understand something, explain to the user you miss understood them.

						`,
					},
				],
			};

			if (this.messageHistory.length < 1) {
				chatHistory?.unshift(prePrompt);
			}

			const chatSession = model.startChat({
				generationConfig,
				history: chatHistory,
			});

			await chatSession.sendMessage(prompt);

			this.setMessageHistory(await chatSession.getHistory());
		} catch (error) {
			console.log(error);
		} finally {
			this.setGeminiChatLoading(false);
		}
	}

	async createTodoListWithAI(
		prompt: string,
		todoFolderTitle: string,
		todoFolderDescription: string,
		userExistingTodos: string,
		userExistingSubTodos: string,
		userExistingCompletedTodos: string,
	) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: `
							**Hello Gemini.** You are integrated into a web application called **Listology**, a to-do list management tool designed to simplify users' lives. Now that you know a bit about the app, I have an important task for you. Please carefully follow the instructions below. 

							**Instruction 1: To-do List Creation**
							- Your primary task is to create a to-do list for the user based on the prompt they provide. Always output the to-do list in a structured JSON format. Ensure that the list is comprehensive and well-aligned with the user's prompt. For whatever your task might be, always output it in a list.

							**Instruction 2: Memory and Context Utilization**
							- The user may provide their existing to-do list, sub to-dos, the title, and the description of the to-do folder. Store this information as a memory to reference when creating new to-dos. Use this memory to create to-dos that align with the existing list or to add to the existing to-dos if the user requests. If the user asks for to-dos unrelated to the existing list, create a new to-do list based on the new prompt.
							- If the user has completed to-dos, ensure you don't duplicate these tasks. Focus on generating new tasks to help the user progress.

							**Instruction 3: Difficulty Rating and Ignore Functionality**
							- Each "todo" item must include a title and a brief explanation, ensuring the details are concise and informative. Additionally, assign a difficulty rating to each to-do based on the task's nature, using "Easy," "Intermediate," "Hard," or "Unsure" if the difficulty level is unclear.
							- If the user includes "@ignore" in their prompt, mark "ignoreTodo" as true and set the difficulty to "Unsure." If "@ignore" is not present, set "ignoreTodo" to false.

							**Output Format:**
							- The output should be in JSON format only. **Ensure the output does not include the word "json" and is solely the JSON structure.** If the user prompt is unclear or insufficient to create a to-do list, simply output "error."

							**Example Outputs:**

							**Without "@ignore":**
							User prompt: "Give me a list of errands."
							[
									{ "todo": "Buy groceries: milk, eggs, and chips etc.", "difficulty": "Easy", "ignoreTodo": false },
									{ "todo": "Replenish pantry staples: rice, beans, bread, and cereal etc.", "difficulty": "Intermediate", "ignoreTodo": false },
									{ "todo": "Pick up meat or seafood", "difficulty": "Intermediate", "ignoreTodo": false },
									{ "todo": "Get household supplies: raid, bleach, and window cleaner etc.", "difficulty": "Intermediate", "ignoreTodo": false },
									{ "todo": "Look for personal care items: deodorant, shampoo, soap etc.", "difficulty": "Easy", "ignoreTodo": false },
									{ "todo": "Go to the pharmacy for medications or toiletries", "difficulty": "Hard", "ignoreTodo": false }
							]

							**With "@ignore":**
							User prompt: "@ignore Give me a list of errands."
							[
									{ "todo": "Buy groceries: milk, eggs, and chips etc.", "difficulty": "Unsure", "ignoreTodo": true },
									{ "todo": "Replenish pantry staples: rice, beans, bread, and cereal etc.", "difficulty": "Unsure", "ignoreTodo": true },
									{ "todo": "Pick up meat or seafood", "difficulty": "Unsure", "ignoreTodo": true },
									{ "todo": "Get household supplies: raid, bleach, and window cleaner etc.", "difficulty": "Unsure", "ignoreTodo": true },
									{ "todo": "Look for personal care items: deodorant, shampoo, soap etc.", "difficulty": "Unsure", "ignoreTodo": true },
									{ "todo": "Go to the pharmacy for medications or toiletries", "difficulty": "Unsure", "ignoreTodo": true }
							]
							`,
						},
					],
				},
			],
		});

		try {
			clearTimeout(this.errorLoadingListRef.current);

			this.setGeminiLoadingTodos(true);

			await chatSession.sendMessage(
				`User's Prompt: ${prompt} | User's Todo Folder Title: ${todoFolderTitle} and Description: ${todoFolderDescription}, Existing To-dos: ${
					userExistingTodos ? userExistingTodos : "No To-dos"
				}, Existing Sub To-dos: ${
					userExistingSubTodos ? userExistingSubTodos : "No Sub To-dos"
				} | Completed To-dos: ${
					userExistingCompletedTodos
						? userExistingCompletedTodos
						: "No Completed To-dos"
				}`,
			);

			const response: Content[] = await chatSession.getHistory();

			const listOfTodos: any = response
				.filter((value) => value.role === "model")
				.map((resp) => resp.parts[0].text)
				.toString()
				.includes("error")
				? this.setErrorLoadingList(true)
				: response
						.filter((value) => value.role === "model")
						.map((resp) => JSON.parse(resp.parts[0].text));

			this.setAIListOfTodos([...listOfTodos[0]]);
		} catch (error) {
			this.setErrorLoadingList(true);
		} finally {
			this.setGeminiLoadingTodos(false);
			this.errorLoadingListRef.current = setTimeout(() => {
				this.setErrorLoadingList(false);
			}, 5000);
		}
	}

	async createSubTodoListWithAI(
		prompt: string,
		todoFolderTitle: string,
		todoFolderDescription: string,
		userTodo: string,
		userSubTodos: string,
		userCompletedSubTodos: string,
	) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: `
							Hello Gemini. You are integrated into a web application called Listology, a to-do list management tool designed to make life easier and more organized. Now that you know a little about the web app, I have an important task for you. Please carefully follow the instructions below.

							Instruction: Create sub to-dos for the user. The user will provide you with a prompt detailing what the sub to-dos should consist of. For whatever your task might be, always output it in a list. Your task is to generate the best sub to-dos that align with the user's main to-do or prompt. Give the user a step by step plan on how to achieve their prompt whether it's a question or a list of something the user wants you to create. Be flexible with the user's prompt and learn how to give the user what they need in the form of a list. Make sure what you give to the user is short and concise for the user to easily understand and scan the sub to-do list.

							Instruction: The user will also provide you with their main to-do and any existing sub to-dos, as well as the title and description of their to-do folder. Use this information to tailor the sub to-dos accordingly. Store this information so that if the user asks for sub to-dos that align with their existing main to-do and sub to-dos, you can generate relevant sub to-dos based on this memory. You may create new sub to-dos that are related but not identical to the existing ones. Avoid duplicating tasks that have already been completed.

							User Information Used to Create the Best Fitting Sub To-do List:

							User's To-do Folder Title: ${todoFolderTitle}
							Description: ${todoFolderDescription}
							User Main To-do: ${userTodo}
							Existing Sub To-dos: ${userSubTodos ? userSubTodos : "No Sub To-dos"}
							Completed Sub To-dos: ${
								userCompletedSubTodos
									? userCompletedSubTodos
									: "No Completed Sub Todos"
							}

							Instruction: Ensure that each sub to-do is short, but also providing the most important information for the user. Output only the JSON format of the sub to-dos. NO MATTER WHAT, the only output you should have is the JSON format without the word "json" in it and that's it. If the user's prompt is unclear and it's difficult to create sub to-dos, try going by the user's information to create sub to-dos if the user's prompt is too hard to understand and if it's still too difficult, then output only "error". The limit of sub to-dos is "15" or less. Make sure every detail is provided for each sub to-do you create so you can maximize on the 15 limit. You don't have to make 15 sub to-dos if you don't have to.

							Example:
								User prompt: Give me a list of errands that aligns with my to-do. User's Main To-do: Helping my friend move into a home.

								[
									{todo: "Buy groceries: milk, eggs, and chips, etc."},
									{todo: "Replenish pantry staples: rice, beans, bread, and cereal, etc."},
									{todo: "Pick up meat or seafood"},
									{todo: "Get household supplies: raid, bleach, and window cleaner, etc."},
									{todo: "Look for personal care items: deodorant, shampoo, soap, etc."}
								]

							`,
						},
					],
				},
			],
		});

		try {
			clearTimeout(this.errorLoadingSubTodoListRef.current);

			this.setGeminiLoadingSubTodos(true);

			await chatSession.sendMessage(
				`Make a sub to-do list with this prompt: ${prompt}`,
			);

			const response: Content[] = await chatSession.getHistory();

			const listOfTodos: any = response
				.filter((value) => value.role === "model")
				.map((resp) => resp.parts[0].text)
				.toString()
				.includes("error")
				? this.setErrorLoadingSubTodoList(true)
				: response
						.filter((value) => value.role === "model")
						.map((resp) => JSON.parse(resp.parts[0].text));

			this.setAIListOfSubTodos([...listOfTodos[0]]);
		} catch (error) {
			this.setErrorLoadingSubTodoList(true);
		} finally {
			this.setGeminiLoadingSubTodos(false);
			this.errorLoadingSubTodoListRef.current = setTimeout(() => {
				this.setErrorLoadingSubTodoList(false);
			}, 5000);
		}
	}
}

export default function GeminiAPI() {
	const [todoLoading, setTodoLoading] = useState<boolean>(false);
	const [geminiLoadingTodos, setGeminiLoadingTodos] = useState<boolean>(false);
	const [errorLoadingList, setErrorLoadingList] = useState<boolean>(false);
	const errorLoadingListRef = useRef<any>(null);
	const [AIListOfTodos, setAIListOfTodos] = useState<any>();

	const [geminiChatLoading, setGeminiChatLoading] = useState<boolean>(false);
	const [messageHistory, setMessageHistory] = useState<any>([]);

	const [geminiLoadingSubTodos, setGeminiLoadingSubTodos] =
		useState<boolean>(false);
	const [errorLoadingSubTodoList, setErrorLoadingSubTodoList] =
		useState<boolean>(false);
	const errorLoadingSubTodoListRef = useRef<any>(null);
	const [AIListOfSubTodos, setAIListOfSubTodos] = useState<any>();

	const [loadingDifficulty, setLoadingDifficulty] = useState<boolean>(false);

	const GCS = new GeminiChatSystem(
		setTodoLoading,
		setGeminiLoadingTodos,
		setErrorLoadingList,
		errorLoadingListRef,
		setAIListOfTodos,
		setGeminiChatLoading,
		messageHistory,
		setMessageHistory,
		setGeminiLoadingSubTodos,
		setErrorLoadingSubTodoList,
		errorLoadingSubTodoListRef,
		setAIListOfSubTodos,
		loadingDifficulty,
		setLoadingDifficulty,
	);

	GCS.readTodoDifficulty;
	GCS.grammaticallyFixedTodo;
	GCS.createTodoListWithAI;
	GCS.geminiChat;
	GCS.createSubTodoListWithAI;

	return {
		grammaticallyFixedTodo: GCS.grammaticallyFixedTodo.bind(GCS),

		geminiCreateTodos: {
			AIListOfTodos,
			setAIListOfTodos,
			errorLoadingList,
			geminiLoadingTodos,
			createTodoListWithAI: GCS.createTodoListWithAI.bind(GCS),
			todoLoading,
		},

		geminiCreateSubTodos: {
			geminiLoadingSubTodos,
			errorLoadingSubTodoList,
			AIListOfSubTodos,
			setAIListOfSubTodos,
			createSubTodoListWithAI: GCS.createSubTodoListWithAI.bind(GCS),
		},

		geminiChatSystem: {
			messageHistory,
			setMessageHistory,
			geminiChatLoading,
			geminiChat: GCS.geminiChat.bind(GCS),
		},

		geminiDifficultyAssessment: {
			loadingDifficulty,
			readTodoDifficulty: GCS.readTodoDifficulty.bind(GCS),
		},
	};
}
