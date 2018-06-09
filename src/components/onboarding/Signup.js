import React, { Component } from "react";
import { Image, View, Alert } from "react-native";
import Meteor, { Accounts } from "react-native-meteor";

import Container from "../common/Container";
import Button from "../common/Button";
import Heading from "../common/Heading";
import TextInput from "../common/form/TextInput";
import { spaces } from "../../styles/brand";

export default class Signin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			password2: "",
			isSubmitting: false
		};
	}

	onSubmit() {
		const { navigation } = this.props;
		const { firstName, lastName } = navigation.state.params;

		this.setState({ isSubmitting: true }, () => {
			const { email, password } = this.state;
			Accounts.createUser({ email, password, firstName, lastName }, err => {
				if (err) {
					Alert.alert("Sign up error", err.reason);
					this.setState({ isSubmitting: false });
				} else {
					Alert.alert(
						"Success!",
						"Please make sure to confirm your email address."
					);

					Meteor.call("user.signup.success", {}, (err, res) => {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		});
	}

	renderInputs() {
		const { email, password, password2 } = this.state;
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
				<View style={{ marginTop: 30 }} />
				<TextInput
					white
					secureTextEntry
					label="Confirm password"
					text={password2}
					onChangeText={password2 => this.setState({ password2 })}
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
						flex: 3,
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
						Last step.
					</Heading>

					{this.renderInputs()}

					<Button
						type="info"
						disabled={isSubmitting}
						title={isSubmitting ? "Signing up..." : "Submit"}
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
