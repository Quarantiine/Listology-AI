import Push from "push.js";
import { useEffect } from "react";

class NotificationSystem {
	constructor() {}

	init() {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/serviceWorker.min.js").then(
				(registration) => {
					console.log(
						"ServiceWorker registration successful with scope: ",
						registration.scope
					);
				},

				(err) => {
					console.log("ServiceWorker registration failed: ", err);
				}
			);
		}
	}

	pushNotification(title: string, tag: string, body: string) {
		Push.Permission.request(onGranted, onDenied);

		function onGranted() {
			console.log("Permission granted!");
			showNotifications();
		}

		function onDenied() {
			console.log("Permission denied!");
		}

		function showNotifications() {
			// Check if permission is already granted
			if (Push.Permission.has()) {
				Push.create(`${title} | Listology`, {
					body: body,
					icon: "/icons/logo-2.svg",
					timeout: 0, // Optional
					silent: false, // Optional
					tag: tag, // Optional
					requireInteraction: true, // Optional
					vibrate: true, // Optional
					onClick: function () {
						this.close();
					},

					onError: function (error: string) {
						console.log(`Notification Error: ${error}`);
					},
				});
			} else {
				console.log("Notification permission is not granted.");
			}
		}
	}
}

const NS = new NotificationSystem();

export default function NotificationAPI() {
	useEffect(() => {
		NS.init();
	}, []);

	return {
		pushNotification: NS.pushNotification.bind(NS),
	};
}
