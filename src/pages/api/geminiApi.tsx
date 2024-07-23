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
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

class GeminiChatSystem {
	setGeminiDifficultyChoice: React.Dispatch<React.SetStateAction<string>>;
	setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setGeminiLoadingTodos: React.Dispatch<React.SetStateAction<boolean>>;
	setErrorLoadingList: React.Dispatch<React.SetStateAction<boolean>>;
	errorLoadingListRef: any;
	setAIListOfTodos: React.Dispatch<React.SetStateAction<any>>;
	setGeminiChatLoading: React.Dispatch<React.SetStateAction<boolean>>;
	messageHistory: any;
	setMessageHistory: any;

	constructor(
		setGeminiDifficultyChoice: React.Dispatch<React.SetStateAction<string>>,
		setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>,
		setGeminiLoadingTodos: React.Dispatch<React.SetStateAction<boolean>>,
		setErrorLoadingList: React.Dispatch<React.SetStateAction<boolean>>,
		errorLoadingListRef: any,
		setAIListOfTodos: React.Dispatch<React.SetStateAction<any>>,
		setGeminiChatLoading: React.Dispatch<React.SetStateAction<boolean>>,
		messageHistory: any,
		setMessageHistory: any
	) {
		this.setGeminiDifficultyChoice = setGeminiDifficultyChoice;
		this.setTodoLoading = setTodoLoading;
		this.setGeminiLoadingTodos = setGeminiLoadingTodos;
		this.setErrorLoadingList = setErrorLoadingList;
		this.errorLoadingListRef = errorLoadingListRef;
		this.setAIListOfTodos = setAIListOfTodos;
		this.setGeminiChatLoading = setGeminiChatLoading;
		this.messageHistory = messageHistory;
		this.setMessageHistory = setMessageHistory;
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
							text: "Hello Gemini. You are intergated into a web application called listology. It is a to-do list managament tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. I want you to tell me if a to-do is easy, intermidate, or hard. I want you to base this difficulty on the to-do folder title, description, the specific to-do task, the to-do due date, and the to-do sub to-dos. Only say `Easy`, `Intermediate`, `Hard`, or `Unsure`. And if a you see `Todo is Ignored`, just add `Unsure` or change the current difficulty to `Unsure`. Do not say anything other than the difficulties I provided, also If the to-do doesn't have a task or unsure if it does, then say `Unsure` and that's it. You only say the difficulies or `Unsure` according the information giving to you.",
						},
					],
				},
			],
		});

		try {
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
							text: "Hello Gemini. You are intergated into a web application called listology. It is a to-do list managament tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. What I want you to do is to change the text, no matter what it says that I send you, make it grammatically accurate and easier to read only and nothing more than that. Also without changing the meaning of the text. Just give me the changed text and that's it. If a to-do have a link, don't change the link at all.",
						},
					],
				},
			],
		});

		try {
			this.setTodoLoading(true);
			await chatSession.sendMessage(
				`Change this text and make it better accorrding to the instructions given above: ${text}`
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
							text: `Hello Gemini. You are intergated into a web application called listology. It is a to-do list managament tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. What I want you to do is follow carefully the instructions below.

							Instruction: Create a to-do list for the user. The user will provide you with the prompt of what the to-do list should consist of. Make the best to-do list that best fit the user's prompt. Output the to-do list in a JSON format.

							Instruction: The user will also provide you with their to-do list and sub to-dos that already exsist and the title, and description of the to-do folder for better creating specialized to-dos for that folder. Take in their to-do list as a memory so if the user ask you about their own to-do list, like wanting you to create to-do lists that aligns with their already Existing to-do list or wanting you to add on to their exsiting to-do list, you can use the memory gained to create a to-do list for them. You can create you own to-do list that aligns with the user's to-do list, so you can create new to-do list that's related to the user's to-dos list but it doesn't have to exactly be the same as the user's to-do list. That's only if they ask you to create to-do list that aligns or adds on with their already Existing to-do list. If they ask you to create to-do list about something else, then just create a to-do list about that. If the user doesn't have an Existing to-do list or any sub to-dos, then just only say "error" and that's it. If the user have completed to-dos, then take into account those completed to-dos so you don't have repeat creating that same to-dos over and over again, so the user can focus on completing new to-dos. With every to-do you create, add a difficulty rating for the to-do like in the example below. The difficulty rating is based on the to-do and their should be "Easy", "Intermediate", "Hard" or "Unsure" if you don't know the difficulty of a to-do. If the user wants to ignore a to-do list, then the user will just input "@ignore" then you will make ignore "true" like in the example below. If a user types "@ignore" then set the difficulties to "Unsure", then the difficulty will be "Unsure". If you don't see the "@ignore" in the user's prompt then the "ignoreTodo" should be "false".

							Instruction: The "todo" item will have a title then an explaination of the to-do. Make sure the "todo" are concise and detailed with the most important info for the user. Only out the JSON format  of the to-dos. NO MATTER WHAT, the only output you should have is the JSON format without the word "json" in it and that's it. If the user prompt is not clear and it's hard for you to create to-do list for, then just only say "error" and that's it.

							Example Below: (User prompt: Give me a list of errands):

							[
								{todo: "Buy groceries: milk, eggs, and chips etc...", difficulty: "Easy", ignoreTodo: false},
								{todo: "Replenish your stock of pantry staples: rice, beans, bread, and cereal etc...",  difficulty: "Intermediate", ignoreTodo: false},
								{todo: "Pick up meat or seafood"},
								{todo: "Get household supplies: raid, bleach, and window clearner etc...",  difficulty: "Intermediate", ignoreTodo: false},
								{todo: "Look for personal care items: deodorant, shampoo, soap etc...",  difficulty: "Easy", ignoreTodo: false},
								{todo: "Go to the pharmacy for medications or toiletries",  difficulty: "Hard", ignoreTodo: false}
							]

							Example Below with "@ignore": (User prompt: @ignore Give me a list of errands):

							[
								{todo: "Buy groceries: milk, eggs, and chips etc...", difficulty: "Unsure", ignoreTodo: true},
								{todo: "Replenish your stock of pantry staples: rice, beans, bread, and cereal etc...",  difficulty: "Unsure", ignoreTodo: true},
								{todo: "Pick up meat or seafood"},
								{todo: "Get household supplies: raid, bleach, and window clearner etc...",  difficulty: "Unsure", ignoreTodo: true},
								{todo: "Look for personal care items: deodorant, shampoo, soap etc...",  difficulty: "Unsure", ignoreTodo: true},
								{todo: "Go to the pharmacy for medications or toiletries",  difficulty: "Unsure", ignoreTodo: true}
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

						Instuction: You are meant to be a helpful assistant. Answer whatever questions they may have. You will have the user's to-do folder's information, which is going to be the to-do folder's title, description, and the user's to-dos, and sub to-dos in that folder. This information will be just for your memory. If the user answer anything concerning things in their to-do folder, then try your best helping them answer their questions. The user's to-do folder's information will be given in a object string JSON format to you so you'll know everything about the user's info in their to-do folder. Keep it as a memory until the user asks you something about it. But if the user ask questions or commands you to do something that's not related to anything in their to-do folder then answer there questions and do things for them. So whether the user ask things about things in their to-do folder or not, be a helpful assistance to what they need.

						Instruction: Add User's Data like a memory to use later for the user: User's To-do folder info - To-do folder title: ${todoFolderTitle} and description: ${todoFolderDescription} | To-dos: ${todos}, Sub To-dos: ${subTodos}

						Instrcution: You should get these items from the user's to-dos and their types. Use these to help the user in anyway you can. The ones for you to ignore will have an indicator like this: /ignore in front of the item below, but the ones without the /ignore in front of it, freely give the user the information concering to-do. If they ask you about the ignored items, then explain to them that it is sensetive information.
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
}

export default function GeminiAPI() {
	const [geminiDifficultyChoice, setGeminiDifficultyChoice] =
		useState<string>("");
	const [todoLoading, setTodoLoading] = useState<boolean>(false);
	const [geminiLoadingTodos, setGeminiLoadingTodos] = useState<boolean>(false);
	const [errorLoadingList, setErrorLoadingList] = useState<boolean>(false);
	const errorLoadingListRef = useRef<any>(null);
	const [AIListOfTodos, setAIListOfTodos] = useState<any>();
	const [geminiChatLoading, setGeminiChatLoading] = useState<boolean>(false);
	const [messageHistory, setMessageHistory] = useState<any>([]);

	const GCS = new GeminiChatSystem(
		setGeminiDifficultyChoice,
		setTodoLoading,
		setGeminiLoadingTodos,
		setErrorLoadingList,
		errorLoadingListRef,
		setAIListOfTodos,
		setGeminiChatLoading,
		messageHistory,
		setMessageHistory
	);

	GCS.readTodoDifficulty;
	GCS.grammaticallyFixedTodo;
	GCS.createTodoListWithAI;
	GCS.geminiChat;

	return {
		messageHistory,
		setMessageHistory,
		geminiChatLoading,
		setAIListOfTodos,
		geminiChat: GCS.geminiChat.bind(GCS),
		AIListOfTodos,
		errorLoadingList,
		geminiLoadingTodos,
		createTodoListWithAI: GCS.createTodoListWithAI.bind(GCS),
		todoLoading,
		grammaticallyFixedTodo: GCS.grammaticallyFixedTodo.bind(GCS),
		geminiDifficultyChoice,
		readTodoDifficulty: GCS.readTodoDifficulty.bind(GCS),
	};
}
