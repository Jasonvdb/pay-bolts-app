import React, { Component } from "react";
import { View, Alert, Text, Platform } from "react-native";

import Container from "../common/Container";
import Button from "../common/Button";
import { spaces } from "../../styles/brand";
import TextInput from "../common/form/TextInput";
import RightButton from "../common/header/RightButton";
import { getCache } from "../../helpers/localcache";

class Settings extends Component {
	constructor(props) {
		super(props);

		//TODO load 'getinfo'
		//Set these strings to false first so we know to use the vars from the prop
		this.state = {
			isSubmitting: false
		};
	}

	componentDidMount() {}

	render() {
		const { isSubmitting } = this.state;

		return (
			<Container keyboardScroll>
				<View
					style={{
						marginTop: spaces.marginTop,
						flex: 1,
						flexDirection: "column",
						justifyContent: "space-between",
						marginBottom: spaces.marginBottom
					}}
				>
					<Text>Settings</Text>
				</View>
			</Container>
		);
	}
}

Settings.navigationOptions = ({ navigation }) => {
	return { headerTitle: "Settings" };
};

export default Settings;
