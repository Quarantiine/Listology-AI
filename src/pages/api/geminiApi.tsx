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

	async createTodoListWithAI(text: string) {
		const chatSession = model.startChat({
			generationConfig,
			history: [
				{
					role: "user",
					parts: [
						{
							text: `Hello Gemini. You are intergated into a web application called listology. It is a to-do list managament tool designed to make life easier. Now that you know a little about the web app, I have an important task for you. What I want you to do is...Create a to-do list for the user. The user will provide you with the prompt of what the to-do list should consist of. Make the best to-do list that best fit the user's prompt. Output the to-do list in a JSON format. 

							The "todo" item will have a title then an explaination of the to-do. Make sure the "todo" are concise and detailed with the most important info for the user. Only out the JSON format  of the to-dos. NO MATTER WHAT, the only output you should have is the JSON format without the word "json" in it and that's it. If the user prompt is not clear and it's hard for you to create to-do list for, then just only say "error" and that's it.

							Example Below (User prompt: Give me a list of errands):

							[
								{todo: "Buy groceries: milk, eggs, and chips etc..."},
								{todo: "Replenish your stock of pantry staples: rice, beans, bread, and cereal etc..."},
								{todo: "Pick up meat or seafood"},
								{todo: "Get household supplies: raid, bleach, and window clearner etc..."},
								{todo: "Look for personal care items: deodorant, shampoo, soap etc..."},
								{todo: "Go to the pharmacy for medications or toiletries"}
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

			await chatSession.sendMessage(text);

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
