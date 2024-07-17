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

	constructor(
		setGeminiDifficultyChoice: React.Dispatch<React.SetStateAction<string>>,
		setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>,
		setGeminiLoadingTodos: React.Dispatch<React.SetStateAction<boolean>>,
		setErrorLoadingList: React.Dispatch<React.SetStateAction<boolean>>,
		errorLoadingListRef: any,
		setAIListOfTodos: React.Dispatch<React.SetStateAction<any>>,
	) {
		this.setGeminiDifficultyChoice = setGeminiDifficultyChoice;
		this.setTodoLoading = setTodoLoading;
		this.setGeminiLoadingTodos = setGeminiLoadingTodos;
		this.setErrorLoadingList = setErrorLoadingList;
		this.errorLoadingListRef = errorLoadingListRef;
		this.setAIListOfTodos = setAIListOfTodos;
	}

	async readTodoDifficulty(
		todoFolderTitle: string,
		todoFolderDescription: string,
		todoTask: string,
		todoStartDate: string,
		todoEndDate: string,
		todoSubTodo: string,
		ignoredTodo: boolean,
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
				`Todo Folder Title: ${todoFolderTitle}, Descriptions: ${todoFolderDescription}, Todo Task: ${todoTask}, Start Date: ${todoStartDate}, End Date: ${todoEndDate}, Sub Todo: ${todoSubTodo}, Todo is ${ignoredTodo ? "Ignored" : "Not Ignored"}. What is the difficulty of the to-do based on the given information?`,
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
				`Change this text and make it better accorrding to the instructions given above: ${text}`,
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
		userExsistingTodos: string,
		userExsistingSubTodos: string,
		userExsistingCompletedTodos: string,
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

							Instruction: The user will also provide you with their to-do list and sub to-dos that already exsist and the title, and description of the to-do folder for better creating specialized to-dos for that folder. Take in their to-do list as a memory so if the user ask you about their own to-do list, like wanting you to create to-do lists that aligns with their already exsisting to-do list or wanting you to add on to their exsiting to-do list, you can use the memory gained to create a to-do list for them. You can create you own to-do list that aligns with the user's to-do list, so you can create new to-do list that's related to the user's to-dos list but it doesn't have to exactly be the same as the user's to-do list. That's only if they ask you to create to-do list that aligns or adds on with their already exsisting to-do list. If they ask you to create to-do list about something else, then just create a to-do list about that. If the user doesn't have an exsisting to-do list or any sub to-dos, then just only say "error" and that's it. If the user have completed to-dos, then take into account those completed to-dos so you don't have repeat creating that same to-dos over and over again, so the user can focus on completing new to-dos. With every to-do you create, add a difficulty rating for the to-do like in the example below. The difficulty rating is based on the to-do and their should be "Easy", "Intermediate", "Hard" or "Unsure" if you don't know the difficulty of a to-do. If the user wants to ignore a to-do list, then the user will just input "@ignore" then you will make ignore "true" like in the example below. If you don't see the "@ignore" in the user's prompt then it should be "false".

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

							Example Below with "/ignore": (User prompt: /ignore Give me a list of errands):

							[
								{todo: "Buy groceries: milk, eggs, and chips etc...", difficulty: "Easy", ignoreTodo: true},
								{todo: "Replenish your stock of pantry staples: rice, beans, bread, and cereal etc...",  difficulty: "Intermediate", ignoreTodo: true},
								{todo: "Pick up meat or seafood"},
								{todo: "Get household supplies: raid, bleach, and window clearner etc...",  difficulty: "Intermediate", ignoreTodo: true},
								{todo: "Look for personal care items: deodorant, shampoo, soap etc...",  difficulty: "Easy", ignoreTodo: true},
								{todo: "Go to the pharmacy for medications or toiletries",  difficulty: "Hard", ignoreTodo: true}
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
				`User's Prompt: ${prompt} | User's Todo Folder Title: ${todoFolderTitle} and Description: ${todoFolderDescription}, Exsisting To-dos: ${userExsistingTodos ? userExsistingTodos : "No To-dos"}, Exsisting Sub To-dos: ${userExsistingSubTodos ? userExsistingSubTodos : "No Sub To-dos"} | Completed To-dos: ${userExsistingCompletedTodos ? userExsistingCompletedTodos : "No Completed To-dos"}`,
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

			return listOfTodos;
		} catch (error) {
			this.setErrorLoadingList(true);
		} finally {
			this.setGeminiLoadingTodos(false);
			this.errorLoadingListRef.current = setTimeout(() => {
				this.setErrorLoadingList(false);
			}, 5000);
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

	const GCS = new GeminiChatSystem(
		setGeminiDifficultyChoice,
		setTodoLoading,
		setGeminiLoadingTodos,
		setErrorLoadingList,
		errorLoadingListRef,
		setAIListOfTodos,
	);

	GCS.readTodoDifficulty;
	GCS.grammaticallyFixedTodo;
	GCS.createTodoListWithAI;

	return {
		setAIListOfTodos,
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
