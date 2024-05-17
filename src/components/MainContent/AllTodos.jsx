import React from "react";

export default function AllIgnoredTodos({
	TodosContent,
	todoLists,
	filterState,
	clickedTodoFolder,
	auth,
	completedTodos,
	todolistFolder,
	folders,
	subTodoSearchInput,
	todoSearchInput,
}) {
	return (
		<>
			{todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todolistFolder.id &&
						value.userID === auth.currentUser?.uid &&
						value.completed === completedTodos &&
						!value.ignoreTodo
				)
				?.map((todolist) => {
					if (
						todolist.folderID === clickedTodoFolder &&
						todolist.todo
							.normalize("NFD")
							.replace(/\p{Diacritic}/gu, "")
							.toLowerCase()
							.includes(todoSearchInput.toLowerCase())
					) {
						if (filterState.filterCategories === "All") {
							return (
								<TodosContent
									key={todolist.id}
									todoLists={todoLists}
									todolist={todolist}
									folders={folders}
									todolistFolder={todolistFolder}
									subTodoSearchInput={subTodoSearchInput}
									todoSearchInput={todoSearchInput}
								/>
							);
						}

						if (
							filterState.filterCategories === "Favorites" &&
							todolist.favorited === true
						) {
							return (
								<TodosContent
									key={todolist.id}
									todoLists={todoLists}
									todolist={todolist}
									folders={folders}
									todolistFolder={todolistFolder}
									subTodoSearchInput={subTodoSearchInput}
									todoSearchInput={todoSearchInput}
								/>
							);
						}

						if (
							filterState.filterCategories.value === "Difficulty" &&
							filterState.filterCategories.value2 === todolist.difficulty
						) {
							return (
								<TodosContent
									key={todolist.id}
									todoLists={todoLists}
									todolist={todolist}
									folders={folders}
									todolistFolder={todolistFolder}
									subTodoSearchInput={subTodoSearchInput}
									todoSearchInput={todoSearchInput}
								/>
							);
						} else if (filterState.filterCategories.value2 === "") {
							return (
								<TodosContent
									key={todolist.id}
									todoLists={todoLists}
									todolist={todolist}
									folders={folders}
									todolistFolder={todolistFolder}
									subTodoSearchInput={subTodoSearchInput}
									todoSearchInput={todoSearchInput}
								/>
							);
						}
					}
				})}

			{todoLists.allTodoLists
				?.filter(
					(value) =>
						value.folderID === todolistFolder.id &&
						value.userID === auth.currentUser?.uid &&
						value.completed === completedTodos &&
						value.folderID === clickedTodoFolder &&
						value.todo
							.normalize("NFD")
							.replace(/\p{Diacritic}/gu, "")
							.toLowerCase()
							.includes(todoSearchInput.toLowerCase())
				)
				?.map((todolist) => todolist).length < 1 &&
				!completedTodos && <p className={`text-gray-400`}>No Todos Found</p>}
		</>
	);
}
