import { onAuthStateChanged } from "firebase/auth";
import React, {
	createContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import FirebaseApi from "../pages/api/firebaseApi";
import { useRouter } from "next/router";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

export const StateCtx = createContext();

const navigationBarReducer = (state, { payload, type }) => {
	switch (type) {
		case "sidebar-navigation-link":
			return {
				...state,
				[payload.key]: payload.value,
			};

		default:
			console.log(`Unknown Payload`);
	}
};

const filterReducer = (state, { payload, type }) => {
	switch (type) {
		case "filter-category":
			return {
				...state,
				[payload.key]: payload.value,
			};

		case "filter-category-2":
			return {
				...state,
				[payload.key]: payload,
			};

		default:
			console.log(`Unknown Type`);
	}
};

export default function Layout({ children }) {
	const { auth, todolistFolders } = FirebaseApi();
	const router = useRouter();
	const [navState, navDispatch] = useReducer(navigationBarReducer, {
		navigatorLink: "Dashboard",
	});
	const [filterState, filterDispatch] = useReducer(filterReducer, {
		filterCategories: "All",
	});
	const [closeSidebar, setCloseSidebar] = useState(false);
	const [bannerImage, setBannerImage] = useState("");
	const [clickedImageLoading, setClickedImageLoading] = useState(false);
	const [openFolderModal, setOpenFolderModal] = useState(false);
	const [openTodolistSidebar, setOpenTodolistSidebar] = useState(false);
	const [openTodolistSidebarModal, setOpenTodolistSidebarModal] =
		useState(false);
	const [clickedFolder, setClickedFolder] = useState("");
	const [clickedTodoFolder, setClickedTodoFolder] = useState("");
	const [startX, setStartX] = useState(null);
	const [endX, setEndX] = useState(null);
	const [difficulty, setDifficulty] = useState("");
	const [closeFilterSidebar, setCloseFilterSidebar] = useState();
	const [openGalleryModal, setOpenGalleryModal] = useState(false);
	const [completedTodos, setCompletedTodos] = useState(false);
	const [openTodoSearchInput, setOpenTodoSearchInput] = useState(false);
	const [todoSearchInput, setTodoSearchInput] = useState("");

	const searchQueryRef = useRef();

	function handleTouchStart(e) {
		setStartX(e.touches[0].clientX);
	}

	function handleTouchMove(e) {
		setEndX(e.touches[0].clientX);
	}

	function handleTouchEnd() {
		if (endX && startX && endX - startX > 50) {
			setCloseSidebar(false);
			setOpenTodolistSidebar(false);
		} else if (endX && startX && startX - endX > 50) {
			setCloseSidebar(true);
		}

		setStartX(null);
		setEndX(null);
	}

	const queryClient = new QueryClient();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				router.push("/registration");
			}
		});
	}, []);

	useEffect(() => {
		const mobileSidebar = () => {
			if (window.innerWidth < 1024) {
				setCloseSidebar(true);
			} else {
				setCloseSidebar(false);
			}
		};

		window.addEventListener("resize", mobileSidebar);
		return () => window.removeEventListener("resize", mobileSidebar);
	}, []);

	const handleCloseSidebar = () => {
		setCloseSidebar(!closeSidebar);
	};

	const handleCreateTodos = () => {
		setOpenTodolistSidebarModal(clickedFolder && !openTodolistSidebarModal);
	};

	const handleCreateFolder = () => {
		const folderDescriptionText = "No Description";
		todolistFolders.addingTodoFolder(
			"",
			"Untitled",
			folderDescriptionText,
			clickedFolder
		);
	};

	return (
		<>
			<Head>
				<link
					rel="shortcut icon"
					href="/icons/logo-2.svg"
					type="image/x-icon"
				/>
			</Head>

			<QueryClientProvider client={queryClient}>
				<StateCtx.Provider
					value={{
						bannerImage,
						setBannerImage,
						closeSidebar,
						setCloseSidebar,
						clickedImageLoading,
						setClickedImageLoading,
						openFolderModal,
						setOpenFolderModal,
						openTodolistSidebar,
						setOpenTodolistSidebar,
						clickedFolder,
						setClickedFolder,
						clickedTodoFolder,
						setClickedTodoFolder,
						handleCloseSidebar,
						openTodolistSidebarModal,
						setOpenTodolistSidebarModal,
						searchQueryRef,
						navState,
						navDispatch,
						filterState,
						filterDispatch,
						difficulty,
						setDifficulty,
						closeFilterSidebar,
						setCloseFilterSidebar,
						openGalleryModal,
						setOpenGalleryModal,
						completedTodos,
						setCompletedTodos,
						openTodoSearchInput,
						setOpenTodoSearchInput,
						todoSearchInput,
						setTodoSearchInput,
						handleCreateTodos,
						handleCreateFolder,
					}}
				>
					<div
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						{children}
					</div>
				</StateCtx.Provider>
			</QueryClientProvider>
		</>
	);
}
