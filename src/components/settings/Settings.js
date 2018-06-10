import React, { Component } from "react";
import { View, Alert, Text, Platform } from "react-native";

import Container from "../common/Container";
import Button from "../common/Button";
import { spaces } from "../../styles/brand";
import TextInput from "../common/form/TextInput";
import RightButton from "../common/header/RightButton";
import { getCache } from "../../helpers/localcache";
import signedRequest from "../../helpers/signedRequest";
import Heading from "../common/Heading";

const NodeDetail = ({ label, value }) => {
	return (
		<View>
			<Heading type="h3">{label}:</Heading>
			<Heading type="h2">{value || "-"}</Heading>
		</View>
	);
};

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			blockheight: null,
			id: null,
			network: null,
			version: null
		};
	}

	componentDidMount() {
		signedRequest({
			method: "getinfo",
			onSuccess: data => {
				console.log(data.info);
				this.setState({ ...data.info });
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	render() {
		const { blockheight, id, network, version } = this.state;

		const viewStyle = { marginBottom: 20 };

		return (
			<Container>
				<View
					style={{
						marginTop: spaces.marginTop,
						flex: 1,
						flexDirection: "column",
						justifyContent: "space-around",
						marginBottom: spaces.marginBottom,
						paddingLeft: spaces.paddingSide,
						paddingRight: spaces.paddingSide
					}}
				>
					<NodeDetail label={"Blockheight"} value={blockheight} />
					<NodeDetail label={"Network"} value={network} />
					<NodeDetail label={"Node ID"} value={id} />
					<NodeDetail label={"Node version"} value={version} />
					<View />
					<View />
				</View>
			</Container>
		);
	}
}

Settings.navigationOptions = ({ navigation }) => {
	return { headerTitle: "Settings" };
};

export default Settings;
