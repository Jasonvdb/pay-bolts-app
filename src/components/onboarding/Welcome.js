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
						justifyContent: "flex-start",
						paddingTop: spaces.marginTop
					}}
				>
					<Image
						style={{
							flex: 1,
							width: "82%",
							resizeMode: Image.resizeMode.contain
						}}
						source={require("../../../images/text-header-white.png")}
					/>
				</View>

				<View
					style={{
						flex: 2.3,
						alignItems: "center",
						justifyContent: "flex-start"
					}}
				>
					<Image
						style={{
							flex: 1,
							width: "55%",
							resizeMode: Image.resizeMode.contain
						}}
						source={require("../../../images/logo.png")}
					/>
				</View>

				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center"
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
				</View>

				<View
					style={{
						flex: 2,
						flexDirection: "column",
						justifyContent: "flex-end",
						paddingBottom: 25
					}}
				>
					<View>
						<Button
							type="info"
							title="Connect to node"
							showAnimated={true}
							onPress={() => navigation.navigate("Details")}
						/>
					</View>
				</View>
			</Container>
		);
	}
}
