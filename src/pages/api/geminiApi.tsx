"use client";

import React, { useState } from "react";
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

	constructor(
		setGeminiDifficultyChoice: React.Dispatch<React.SetStateAction<string>>,
		setTodoLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		this.setGeminiDifficultyChoice = setGeminiDifficultyChoice;
		this.setTodoLoading = setTodoLoading;
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

	async createTodoList() {
		// STOPPED HERE
	}
}

export default function GeminiAPI() {
	const [geminiDifficultyChoice, setGeminiDifficultyChoice] =
		useState<string>("");
	const [todoLoading, setTodoLoading] = useState<boolean>(false);

	const GCS = new GeminiChatSystem(setGeminiDifficultyChoice, setTodoLoading);

	GCS.readTodoDifficulty;
	GCS.grammaticallyFixedTodo;

	return {
		todoLoading,
		grammaticallyFixedTodo: GCS.grammaticallyFixedTodo.bind(GCS),
		geminiDifficultyChoice,
		readTodoDifficulty: GCS.readTodoDifficulty.bind(GCS),
	};
}
