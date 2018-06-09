import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../styles/brand";
export default class LoadingScreen extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>Loading...</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.brandBackground1
	},
	welcome: {
		fontSize: 20,
		textAlign: "center",
		margin: 10,
		color: colors.brandLight
	}
});
