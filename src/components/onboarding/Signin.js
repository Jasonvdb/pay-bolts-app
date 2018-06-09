import React, { Component } from "react";
import { Image, View, Alert } from "react-native";
import Meteor from "react-native-meteor";

import Container from "../common/Container";
import Button from "../common/Button";
import Heading from "../common/Heading";
import TextInput from "../common/form/TextInput";
import { spaces } from "../../styles/brand";

export default class Signin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: __DEV__ ? "jayvdb1@gmail.com" : "",
			password: __DEV__ ? "Jason123" : "",
			isSubmitting: false
		};
	}

	onSubmit() {
		this.setState({ isSubmitting: true }, () => {
			const { email, password } = this.state;

			Meteor.loginWithPassword(email, password, err => {
				if (err) {
					//console.error(err.reason);
					Alert.alert("Login failed", err.reason);
					this.setState({ isSubmitting: false });
				}
			});
		});
	}

	renderInputs() {
		const { email, password } = this.state;
		return (
			<View
				style={{
					flex: 1,
					flexDirection: "column",
					justifyContent: "center"
				}}
			>
				<TextInput
					white
					keyboardType={"email-address"}
					label="Email address"
					text={email}
					onChangeText={email => this.setState({ email })}
				/>
				<View style={{ marginTop: 30 }} />
				<TextInput
					white
					secureTextEntry
					label="Password"
					text={password}
					onChangeText={password => this.setState({ password })}
				/>
			</View>
		);
	}

	render() {
		const { isSubmitting } = this.state;
		return (
			<Container keyboardScroll image>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Image
						style={{
							flex: 0.7,
							width: "70%",
							resizeMode: Image.resizeMode.contain
						}}
						source={require("../../../images/logo.png")}
					/>
				</View>

				<View
					style={{
						flex: 2,
						flexDirection: "column",
						justifyContent: "center",
						paddingBottom: 25
					}}
				>
					<Heading
						textStyle={{
							color: "#fff",
							paddingLeft: spaces.paddingSide,
							paddingRight: spaces.paddingSide
						}}
					>
						Welcome back.
					</Heading>

					{this.renderInputs()}

					<Button
						type="info"
						disabled={isSubmitting}
						title={isSubmitting ? "Logging in..." : "Submit"}
						onPress={() => {
							if (!isSubmitting) {
								this.onSubmit();
							}
						}}
					/>
				</View>
			</Container>
		);
	}
}
