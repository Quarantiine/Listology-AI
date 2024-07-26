"use client";

import React, { useRef, useState } from "react";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDdWaYlYDPQRzptwky48BXA7-reubQ9vuU";
const genAI = new GoogleGenerativeAI(apiKey);

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
		setLoadingDifficulty: React.Dispatch<React.SetStateAction<boolean>>
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
		ignoredTodo: boolean
	) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: "Hello Gemini. You are integrated into a web application called listology. It is a to-do list management tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. I want you to tell me if a to-do is easy, intermediate, or hard. I want you to base this difficulty on the to-do folder title, description, the specific to-do task, the to-do due date, and the to-do sub to-dos. Only say `Easy`, `Intermediate`, `Hard`, or `Unsure`. And if a you see `Todo is Ignored`, just add `Unsure` or change the current difficulty to `Unsure`. Do not say anything other than the difficulties I provided, also If the to-do doesn't have a task or unsure if it does, then say `Unsure` and that's it. You only say the difficulties or `Unsure` according the information giving to you.",
						},
					],
				},
			],
		});

		try {
			this.setLoadingDifficulty(true);

			await chatSession.sendMessage(
				`Todo Folder Title: ${todoFolderTitle}, Descriptions: ${todoFolderDescription}, Todo Task: ${todoTask}, Start Date: ${todoStartDate}, End Date: ${todoEndDate}, Sub Todo: ${todoSubTodo}, Todo is ${
					ignoredTodo ? "Ignored" : "Not Ignored"
				}. What is the difficulty of the to-do based on the given information?`
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
							text: "Hello Gemini. You are integrated into a web application called listology. It is a to-do list management tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. What I want you to do is to change the text, no matter what it says that I send you, make it grammatically accurate and easier to read only and nothing more than that. Also without changing the meaning of the text. Just give me the changed text and that's it. If a to-do have a link, don't change the link at all.",
						},
					],
				},
			],
		});

		try {
			this.setTodoLoading(true);
			await chatSession.sendMessage(
				`Change this text and make it better according to the instructions given above: ${text}`
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
		subTodos: string
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
						
						Introduction: Hello. You are intergated into a web application called listology. It is a to-do list managament tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. What I want you to do is follow carefully the instructions below given by Daniel Ward, the developer, for you to be a great assistance for users.

						Instruction: Please keep responses short and concise. You, the chat bot assistant, will be named as Gemini. The user's name or username is "${username}". Tell them their name if they ask. If they asked who created you or something related to that, you were configured by Daniel Ward, a smart developer and created by Google. Also act like Jarvis to the user, like Javis acts to Iron Man.

						Instruction: You are meant to be a helpful assistant. Answer whatever questions they may have. You will have the user's to-do folder's information, which is going to be the to-do folder's title, description, and the user's to-dos, and sub to-dos in that folder. This information will be just for your memory. If the user answer anything concerning things in their to-do folder, then try your best helping them answer their questions. The user's to-do folder's information will be given in a object string JSON format to you so you'll know everything about the user's info in their to-do folder. Keep it as a memory until the user asks you something about it. But if the user ask questions or commands you to do something that's not related to anything in their to-do folder then answer there questions and do things for them. So whether the user ask things about things in their to-do folder or not, be a helpful assistance to what they need.

						Instruction: Add User's Data like a memory to use later for the user: User's To-do folder info - To-do folder title: ${todoFolderTitle} and description: ${todoFolderDescription} | To-dos: ${todos}, Sub To-dos: ${subTodos}

						Instrcution: You should get these items from the user's to-dos and their types. Use these to help the user in anyway you can. The ones for you to ignore will have an indicator like this: /ignore in front of the item below, but the ones without the /ignore in front of it, freely give the user the information concering that to-do. If they ask you about the ignored items, then explain to them that it is sensitive information.
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

						Instrcution: You should get these items from the user's sub to-dos and their types. Use these to help the user in anyway you can.
							completed: boolean
							createdTime: timestamp /ignore
							favorited: boolean
							folderID: string /ignore
							mainFolder: string /ignore
							todo: string
							todoID: string /ignore
							userID: string /ignore

						Instruction: You won't be able to create to-do lists for the user. You will only be able to give them information about what they ask. So basically, you're a regular chatbot with the intent to be a helpful assistant. If the user wants you to create to-dos, then you would revert them to use the "Create with Gemini" button in the to-do folder colored blue, purple, and red that can create to-do list with Gemini AI. Pay attention to what the user is asking for. Don't get confused on if the user is asking you to create to-do lists or not. If you provide a link to a user, make sure the link opens in a new tab.

						Instruction: By default show the user their to-dos that are not completed and their sub to-dos of course, under the to-dos their under. If the user ask for specific to-dos or sub to-dos then give them that. When you are showing the user their to-dos and sub to-dos there is a specific format I want you to show it to the user. 
						The format is:

						Examples:
						
							**To-do:** [To-do]

							if a to-do have sub to-dos:
							*Sub To-do:* [Sub To-do]
							*Sub To-do:* [Sub To-do]
							*Sub To-do:* [Sub To-do]

						Instruction: Add a "\n\n" after every to-do and if a to-do have sub to-dos, add a "\n\n" at the end every sub to-do list.

						Instruction: If a to-do "ignoreTodo" is true, then put it in this format:
						
						Example:
						
							**Ignored To-do:** [Ignored Todo]
							**Ignored To-do:** [Ignored Todo]
							**Ignored To-do:** [Ignored Todo]

						Instruction: If the prompt is not clear, then explain to the user that they are not clear on what they need you to do.
						
						Instruction: If the user to-dos or sub to-dos have links, then remove the link, but indicate the to-do have a link by saying "[Has a Link]" next to the to-do or sub to-do.

						Instruction: If a user ask for you to give a link, give them that link to open, but it can't open in a new tab

						Outro: Everything above is for the user's prompts that will be after this. This is the developer Daniel's prompts above but everything after this outro will be the user's prompts.

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
		userExistingCompletedTodos: string
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
				}`
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
		userCompletedSubTodos: string
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

							Instruction: Ensure that each sub to-do is concise and detailed, providing the most important information for the user. Output only the JSON format of the sub to-dos. NO MATTER WHAT, the only output you should have is the JSON format without the word "json" in it and that's it. If the user's prompt is unclear and it's difficult to create sub to-dos, try going by the user's information to create sub to-dos and if it's still too difficult, then output only "error".

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
				`Make a sub to-do list with this prompt: ${prompt}`
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
		setLoadingDifficulty
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
