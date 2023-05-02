import { useEffect, useRef, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	Firestore,
	Query,
	addDoc,
	collection,
	doc,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import {
	createUserWithEmailAndPassword,
	Auth,
	getAuth,
	sendEmailVerification,
	UserCredential,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDetapdvyXWk9GParxqPi1YudSyCOnSbyc",
	authDomain: "todo-list-web-app-3329a.firebaseapp.com",
	projectId: "todo-list-web-app-3329a",
	storageBucket: "todo-list-web-app-3329a.appspot.com",
	messagingSenderId: "26673966045",
	appId: "1:26673966045:web:22be18e3d54b36ba03e434",
	measurementId: "G-PBC8GGMJYC",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const colRefRegistration: CollectionReference = collection(db, "registration", "");

const colRefTodoList: CollectionReference = collection(db, "todo-list", "");
const queTodoList: Query = query(colRefTodoList, orderBy("createdTime"));

// ==================

export default function FirebaseApi() {
	// Registration System ======
	const [allusers, setAllusers] = useState<any>();
	const [errorMesg, setErrorMesg] = useState<string>("");
	const [successfulSignin, setSuccessfulSignin] = useState<string>("");
	const errorMesgRef = useRef<any>();
	const successfulSigninRef = useRef<any>();

	// T0do List System ======
	const [allTodoList, setAllTodoList] = useState<any>();

	useEffect(() => {
		onSnapshot(colRefRegistration, (ss) => {
			const users: any = [];
			setAllusers(users);

			ss.docs.map((doc) => {
				users.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	useEffect(() => {
		onSnapshot(queTodoList, (ss) => {
			const todos: any = [];
			setAllTodoList(todos);

			ss.docs.map((doc) => {
				todos.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	class RegistrationSystem {
		constructor() {}

		signingUp = async (email: string, password: string, username: string) => {
			try {
				const user: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
				await sendEmailVerification(user.user);
			} catch (err) {
				console.log(`Adding User Credentials Error |`, err.message);
			}

			try {
				await addDoc(colRefRegistration, {
					email: email,
					username: username,
					userID: auth.currentUser.uid,
					themeColor: false,
					bannerImage: "",
					bannerSize: false,
				});
			} catch (err) {
				console.log(`Adding To Database Error |`, err.message);
			}
		};

		updatingThemeColor = async (themeColor: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				themeColor: themeColor,
			});
		};

		updatingBannerImage = async (bannerImage: string, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				bannerImage: bannerImage,
			});
		};

		updatingBannerSize = async (bannerSize: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				bannerSize: bannerSize,
			});
		};

		signingIn = async (email: string, password: string) => {
			try {
				await signInWithEmailAndPassword(auth, email, password);
				setSuccessfulSignin("Successful Sign In");
				successfulSigninRef.current = setTimeout(() => {
					setSuccessfulSignin("");
					clearTimeout(successfulSigninRef.current);
				}, 3000);
			} catch (err) {
				setErrorMesg(err.message);
				errorMesgRef.current = setTimeout(() => {
					setErrorMesg("");
					clearTimeout(errorMesgRef.current);
				}, 5000);
			}
		};

		signingOut = async () => {
			try {
				signOut(auth);
			} catch (err) {
				console.log(`Signing Out Error |`, err.message);
			}
		};

		forgotPassword = async (email: string) => {
			try {
				sendPasswordResetEmail(auth, email);
			} catch (err) {
				console.log(`Forgot Password Error |`, err.message);
			}
		};
	}
	const RS = new RegistrationSystem();
	const signingUp = RS.signingUp;
	const updatingThemeColor = RS.updatingThemeColor;
	const updatingBannerImage = RS.updatingBannerImage;
	const updatingBannerSize = RS.updatingBannerSize;
	const signingIn = RS.signingIn;
	const signingOut = RS.signingOut;
	const forgotPassword = RS.forgotPassword;

	class TodoListSystem {
		constructor() {}

		addingTodos = async (text: string) => {
			addDoc(colRefTodoList, {
				todo: text,
				createdTime: serverTimestamp(),
			});
		};
	}

	return {
		auth,
		registration: {
			successfulSignin,
			errorMesg,
			allusers,
			signingUp,
			updatingThemeColor,
			updatingBannerImage,
			updatingBannerSize,
			signingIn,
			signingOut,
			forgotPassword,
		},
		todoList: {
			allTodoList,
		},
	};
}
