import React, { Component } from "react";
import {
	StyleSheet,
	Text,
	View,
	Platform,
	Alert,
	Dimensions
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";

import Container from "../common/Container";
import { colors } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import LogoHeader from "../common/header/LogoHeader";
import CustomTextInput from "../common/form/TextInput";
import Button from "../common/Button";

const { width } = Dimensions.get("window");

class ScanInvoice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			enterManually: false
		};
	}

	componentDidMount() {}

	render() {
		const { navigation } = this.props;
		const { enterManually } = this.state;

		const { onRead } = navigation.state.params;

		if (enterManually) {
			return (
				<View>
					<Text>Manually</Text>
				</View>
			);
		}

		return (
			<Container>
				<QRCodeScanner
					cameraStyle={{ height: "100%" }}
					showMarker
					customMarker={
						<Icon
							name={"ios-qr-scanner"}
							size={width * 0.8}
							color={colors.brandSeconday}
						/>
					}
					onRead={onRead}
				/>
			</Container>
		);
	}
}

ScanInvoice.navigationOptions = ({ navigation }) => {
	return Platform.select({
		ios: {
			headerTitle: () => <LogoHeader />
		},
		android: {
			header: null
		}
	});
};

// ScanInvoice.propTypes = {
// 	onRead: PropTypes.func.isRequired
// };

export default ScanInvoice;
