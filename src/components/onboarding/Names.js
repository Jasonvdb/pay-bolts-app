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
			firstName: "",
			lastName: ""
		};
	}

	render() {
		const { firstName, lastName } = this.state;

		const { navigation } = this.props;

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
							marginTop: 10,
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
						Welcome. Let's get started.
					</Heading>

					<View
						style={{
							flex: 1,
							flexDirection: "column",
							justifyContent: "center"
						}}
					>
						<TextInput
							white
							label="First name"
							text={firstName}
							onChangeText={firstName => this.setState({ firstName })}
						/>
						<View style={{ marginTop: 30 }} />
						<TextInput
							white
							label="Last name"
							text={lastName}
							onChangeText={lastName => this.setState({ lastName })}
						/>
					</View>
					<Button
						type="info"
						title={"Submit"}
						onPress={() => {
							navigation.push("Signup", { firstName, lastName });
						}}
					/>
				</View>
			</Container>
		);
	}
}
