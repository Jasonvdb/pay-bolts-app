import React, { Component } from "react";
import { Alert, AsyncStorage } from "react-native";
import Meteor, { createContainer, Accounts } from "react-native-meteor";

import Onboarding from "./routes/Onboarding";
//import AuthedDraw from "./components/routes/AuthedDraw";
import AuthedTab from "./routes/AuthedTab";
import LoadingScreen from "./common/LoadingScreen";

const localIP = "10.0.0.4";
const serverUrl = __DEV__
	? `ws://${localIP}:3061/websocket`
	: "wss://paybolts.com/websocket";

Meteor.connect(serverUrl);

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			storedUserId: null,
			hasLoggedIn: false
		};
	}

	componentDidMount() {
		this.waitForConnection();

		this.getStoredUserId();
		setInterval(() => {
			this.getStoredUserId();
		}, 2000);

		Accounts.onLogin(() => {
			if (!this.state.hasLoggedIn) {
				console.log("Onlogin: ", Meteor.userId());
				this.setState({ hasLoggedIn: true });
				const storedUserId = Meteor.userId();
				if (storedUserId) {
					try {
						AsyncStorage.setItem("storedUserId", storedUserId);
						this.setState({ storedUserId });
					} catch (error) {
						console.log(error);
					}
				} else {
					this.setState({ storedUserId: false });
				}
			}
		});
	}

	getStoredUserId() {
		const userId = Meteor.userId();
		if (userId) {
			return this.setState({ storedUserId: userId });
		}

		AsyncStorage.getItem("storedUserId", (error, storedUserId) => {
			if (storedUserId) {
				this.setState({ storedUserId });
			} else {
				this.setState({ storedUserId: false });
			}
		});
	}

	waitForConnection() {
		setTimeout(() => {
			const { user } = this.props;

			if (!user && !Meteor.status().connected) {
				Alert.alert("", "Failed to connect to server.", [
					{
						text: "Retry",
						onPress: () => {
							Meteor.connect(serverUrl);
							this.waitForConnection();
						}
					}
				]);
			}
		}, 5000);
	}

	render() {
		const { isConnected, user } = this.props;
		const { storedUserId, hasLoggedIn } = this.state;
		//console.log("user: ", Meteor.user());
		//console.log("isConnected: ", isConnected);

		if (user || storedUserId || hasLoggedIn) {
			return <AuthedTab />;
		}

		if (storedUserId === false && !user) {
			return <Onboarding />;
		}

		if (!isConnected) {
			return <LoadingScreen />;
		}

		return <Onboarding />;
	}
}

export default createContainer(() => {
	Meteor.subscribe("rates");
	Meteor.subscribe("crypto.details");

	const user = Meteor.user();
	console.log("USer: ", !!user);
	if (user) {
		Meteor.subscribe("invoices");
	}

	return {
		isConnected: Meteor.status().connected,
		user
	};
}, App);
