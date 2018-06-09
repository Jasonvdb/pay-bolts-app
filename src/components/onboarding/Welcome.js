import React, { Component } from "react";
import { Image, View, Alert } from "react-native";

import Container from "../common/Container";
import Button from "../common/Button";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";

export default class Welcome extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { navigation } = this.props;

		return (
			<Container image noSafeArea>
				<View
					style={{
						flex: 2,
						alignItems: "center",
						justifyContent: "flex-end"
					}}
				>
					<Image
						style={{
							flex: 1,
							width: "65%",
							resizeMode: Image.resizeMode.contain
						}}
						source={require("../../../images/logo.png")}
					/>
				</View>

				<View
					style={{
						flex: 2,
						flexDirection: "column",
						justifyContent: "space-between",
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
						Simplified Bitcoin lightning payments
					</Heading>

					<View>
						<Button
							type="info"
							title="Sign up"
							showAnimated={true}
							onPress={() => navigation.navigate("Names")}
						/>
						<View style={{ paddingBottom: spaces.paddingBottom / 2 }} />
						<Button
							type="default"
							title="Login"
							showAnimated={true}
							onPress={() => navigation.navigate("Signin")}
						/>
					</View>
				</View>
			</Container>
		);
	}
}
