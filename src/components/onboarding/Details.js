import React, { Component } from "react";
import { Image, View, Alert } from "react-native";
import axios from "axios";
import crypto from "crypto";

import Container from "../common/Container";
import Button from "../common/Button";
import TextInput from "../common/form/TextInput";
import { setCache } from "../../helpers/localcache";
import signedRequest from "../../helpers/signedRequest";

export default class Details extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSubmitting: false,
			apiUrl: __DEV__ ? "https://lighting-testnet.paybolts.com/" : "",
			apiKey: "",
			secret: ""
		};
	}

	onSubmit() {
		const { apiUrl, apiKey, secret } = this.state;

		if (!apiUrl || !apiKey || !secret) {
			return Alert.alert("Whoops", "Please complete all fields.");
		}

		this.setState({ isSubmitting: true });
		console.log("Checking details...");
		signedRequest({
			apiUrl,
			apiKey,
			secret,
			method: "getinfo",
			onSuccess: data => {
				console.log(data);
				const { info } = data;
				Alert.alert("Connected", `ID: ${info.id}`);

				setCache("apiUrl", apiUrl);
				setCache("apiKey", apiKey);
				setCache("secret", secret);
			},
			onError: errorMessage => {
				this.setState({ isSubmitting: false });

				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	randomString(length) {
		const chars =
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

		var result = "";
		for (var i = length; i > 0; --i)
			result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	generateNew() {
		const apiKey = this.randomString(32);

		const hash = crypto.createHash("sha256");

		hash.on("readable", () => {
			const data = hash.read();
			if (data) {
				const secret = data.toString("hex");
				this.setState({ apiKey, secret });
			}
		});

		hash.write(this.randomString(32));
		hash.end();
	}

	render() {
		const { isSubmitting, apiUrl, apiKey, secret } = this.state;

		return (
			<Container keyboardScroll image>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "flex-start"
					}}
				>
					<Image
						style={{
							flex: 1,
							width: "80%",
							resizeMode: Image.resizeMode.contain
						}}
						source={require("../../../images/text-header-white.png")}
					/>
				</View>
				<View
					style={{
						flex: 3,
						flexDirection: "column",
						justifyContent: "center",
						paddingBottom: 25
					}}
				>
					{/* <Heading
						textStyle={{
							color: "#fff",
							paddingLeft: spaces.paddingSide,
							paddingRight: spaces.paddingSide,
							marginTop: spaces.marginTop
						}}
					>
						Your node details
					</Heading> */}

					<View
						style={{
							flex: 1,
							flexDirection: "column",
							justifyContent: "center"
						}}
					>
						<TextInput
							type="url"
							white
							label="Your node IP or URL"
							text={apiUrl}
							onChangeText={apiUrl => this.setState({ apiUrl })}
						/>
						<View style={{ marginTop: 30 }} />
						<TextInput
							white
							label="API key"
							text={apiKey}
							onChangeText={apiKey => this.setState({ apiKey })}
						/>
						<View style={{ marginTop: 30 }} />
						<TextInput
							white
							label="Secret"
							text={secret}
							onChangeText={secret => this.setState({ secret })}
						/>
					</View>
					<Button
						disabled={isSubmitting}
						//type="secondary"
						size="small"
						title={"Generate new pair"}
						onPress={this.generateNew.bind(this)}
					/>
					<View style={{ marginTop: 20 }} />

					<Button
						disabled={isSubmitting}
						type="info"
						title={isSubmitting ? "Connecting..." : "Submit"}
						onPress={this.onSubmit.bind(this)}
					/>
				</View>
			</Container>
		);
	}
}
