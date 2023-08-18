import React, { useContext, useEffect } from "react";
import FirebaseApi from "../../pages/api/firebaseApi";
import { UserCredentialCtx } from "../../pages";

export default function ActivitySection() {
	const { auth, todoLists, todolistFolders } = FirebaseApi();
	const { user } = useContext(UserCredentialCtx);

	useEffect(() => {
		console.log(allSubTodos);
	});

	const activityCategories = [
		{ title: "Total Todos Completed", value: 234 },
		{ title: "Total Todos Created", value: 234 },
		{ title: "Total Todos Deleted", value: 234 },
		{ title: "Total Sub Todos Completed", value: 234 },
		{ title: "Total Sub Todos Created", value: 234 },
		{ title: "Total Sub Todos Deleted", value: 234 },
		{ title: "Total Folders Completed", value: 234 },
		{ title: "Total Folders Created", value: 234 },
		{ title: "Total Folders Deleted", value: 234 },
	];

	return (
		<>
			<div className="w-full h-full flex flex-col gap-7 relative">
				<div className="w-full h-auto flex flex-wrap gap-5">
					{activityCategories.map((category, i) => {
						return (
							<React.Fragment key={i}>
								<div
									className={`w-64 h-fit p-2 rounded-md flex justify-between items-center gap-2 transition-all ${
										user.themeColor
											? "border border-[#444] hover:bg-[#444]"
											: "border hover:bg-[#eee]"
									}`}
								>
									<h3 className="font-semibold">{category.title}</h3>
									<p>{category.value}</p>
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</>
	);
}
