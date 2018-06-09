import React, { Component } from "react";
import { Dimensions } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";

import Container from "../common/Container";
import { colors } from "../../styles/brand";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

class Scan extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {}

	render() {
		const { navigation } = this.props;

		const { onRead } = navigation.state.params;

		return (
			<Container>
				<QRCodeScanner
					cameraStyle={{ height: "100%" }}
					showMarker
					customMarker={
						<Animatable.View
							easing="ease-in-cubic"
							animation="zoomIn"
							duration={500}
							delay={1200}
						>
							<Icon
								name={"ios-qr-scanner"}
								size={width * 0.8}
								color={colors.brandSeconday}
							/>
						</Animatable.View>
					}
					onRead={onRead}
				/>
			</Container>
		);
	}
}

Scan.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: navigation.state.params.title || "Scan"
	};
};

// Scan.propTypes = {
// 	onRead: PropTypes.func.isRequired
// };

export default Scan;
