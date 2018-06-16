import React, { Component } from "react";
import {
	View,
	Alert,
	TouchableOpacity,
	Platform,
	Clipboard
} from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";

import Container from "../common/Container";
import Button from "../common/Button";
import { spaces } from "../../styles/brand";
import TextInput from "../common/form/TextInput";
import RightButton from "../common/header/RightButton";
import { getCache, removeCache } from "../../helpers/localcache";
import signedRequest from "../../helpers/signedRequest";
import Heading from "../common/Heading";

const APIDetail = ({ children, label }) => {
	if (!children) {
		return null;
	}
	return (
		<View>
			<Heading type="h3">{label}:</Heading>
			<TouchableOpacity
				onPress={() => {
					Clipboard.setString(children);
					Alert.alert("", "Copied to clipboard");
				}}
			>
				<Heading type="h4">{children}</Heading>
			</TouchableOpacity>
		</View>
	);
};

class NodeSettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			apiKey: "",
			secret: "",
			apiUrl: "",
			failedToLoad: false
		};
	}

	componentDidMount() {
		this.checkFingerprint();
	}

	checkFingerprint() {
		//Check with fingerprint, only for ios. Android might need extra setup
		//https://github.com/hieuvp/react-native-fingerprint-scanner
		if (Platform.OS === "ios") {
			FingerprintScanner.authenticate({
				description: "Display node settings."
			})
				.then(() => {
					this.loadNodeDetails();
				})
				.catch(error => {
					console.log(error);
					Alert.alert("Whoops", "Authentication failed.");
					this.setState({ failedToLoad: true });
				});
		} else {
			this.loadNodeDetails();
		}
	}

	async loadNodeDetails() {
		const apiUrl = await getCache("apiUrl");
		const apiKey = await getCache("apiKey");
		const secret = await getCache("secret");

		this.setState({ apiUrl, apiKey, secret, failedToLoad: false });
	}

	resetApp() {
		Alert.alert(
			"Reset app?",
			"This will delete all settings and close the app",
			[
				{
					text: "Yes, reset",
					onPress: () => {
						removeCache("apiUrl");
						removeCache("apiKey");
						removeCache("secret");
					}
				},
				{
					text: "Cancel",
					style: "cancel"
				}
			],
			{ cancelable: false }
		);
	}

	testAPI() {
		this.setState({
			isTesting: true
		});

		const { apiKey, secret, apiUrl, failedToLoad } = this.state;

		signedRequest({
			apiKey,
			secret,
			apiUrl: "http://10.0.0.5:3071/",
			method: "docs",
			params: {},
			onSuccess: ({ documentation }) => {
				this.setState({ isTesting: false });
				console.log(documentation);
				Alert.alert("Success", documentation);
			},
			onError: errorMessage => {
				this.setState({ isTesting: false });
				Alert.alert("TEST FAILED", errorMessage);
			}
		});
	}

	renderTestButton() {
		const { isTesting, apiKey } = this.state;

		if (!__DEV__ || !apiKey) {
			return null;
		}

		return (
			<Button
				disabled={!!isTesting}
				onPress={this.testAPI.bind(this)}
				title="TEST"
			/>
		);
	}

	render() {
		const { apiKey, secret, apiUrl, failedToLoad } = this.state;

		return (
			<Container>
				<View
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "space-around",
						padding: spaces.paddingSide
					}}
				>
					<APIDetail label="API key">{apiKey}</APIDetail>
					<APIDetail label="Secret">{secret}</APIDetail>
					<APIDetail label="API URL">{apiUrl}</APIDetail>

					{failedToLoad ? (
						<Button
							onPress={this.checkFingerprint.bind(this)}
							title="Display details"
						/>
					) : null}
					{!failedToLoad && !!apiKey ? (
						<Button onPress={this.resetApp.bind(this)} title="Reset app" />
					) : null}

					{/* {this.renderTestButton()} */}
				</View>
			</Container>
		);
	}
}

NodeSettings.navigationOptions = ({ navigation }) => {
	return { headerTitle: "Node settings" };
};

export default NodeSettings;
