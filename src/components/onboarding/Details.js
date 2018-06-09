import React, { Component } from "react";
import { Image, View, Alert } from "react-native";
import axios from "axios";

import Container from "../common/Container";
import Button from "../common/Button";
import TextInput from "../common/form/TextInput";
import { setCache } from "../../helpers/localcache";

export default class Details extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSubmitting: false,
			apiUrl: "",
			apiKey: "",
			secret: ""
		};
	}

	onSubmit() {
		const { apiUrl } = this.state;
		this.setState({ isSubmitting: true });
		axios
			.get(`${apiUrl}api/getinfo`)
			.then(response => {
				const { data } = response;
				console.log(data);
				const { info } = data;
				Alert.alert("Connected", `ID: ${info.id}`);
				setCache("apiUrl", apiUrl);
			})
			.catch(errorResult => {
				this.setState({ isSubmitting: false });

				const { response } = errorResult;
				if (response) {
					if (response.data && response.data.error) {
						Alert.alert("Whoops", response.data.error.message);
					} else {
						Alert.alert("Whoops", "An API error occured");
					}
				} else {
					Alert.alert("Whoops", "Looks like we can't connect to that URL");
				}
			});
	}

	randomString(length) {
		const chars =
			"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-";
		var result = "";
		for (var i = length; i > 0; --i)
			result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	}

	generateNew() {
		const apiKey = this.randomString(32);
		const secret = this.randomString(32);

		this.setState({ apiKey, secret });
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
							onChangeText={url => this.setState({ url })}
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
						title={"Generate new key"}
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
