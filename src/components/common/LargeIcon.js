import React from "react";
import { View, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

import { colors, fontSizes, fontFamily } from "../../styles/brand";

const { width } = Dimensions.get("window");

const LargeIcon = ({ children, type }) => {
	let color = colors.brandDark;
	let iconName = "";

	if (type === "success") {
		color = colors.brandSeconday;
		iconName = "ios-checkmark-circle";
	} else if (type === "pending") {
		color = colors.brandYellow;
		iconName = "ios-flash";
	}

	const text = children ? (
		<Text
			style={{
				color,
				fontSize: fontSizes.h2,
				fontFamily
			}}
		>
			{children}
		</Text>
	) : null;

	const viewStyle = {
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center"
	};

	if (type === "pending") {
		return (
			<View style={viewStyle}>
				<Animatable.View
					animation="pulse"
					easing="ease-out"
					iterationCount="infinite"
					duration={450}
				>
					<Icon name={iconName} size={width * 0.5} color={color} />
				</Animatable.View>
				{text}
			</View>
		);
	}

	return (
		<Animatable.View
			style={viewStyle}
			easing="ease-in-cubic"
			animation="bounceIn"
			duration={500}
		>
			<Icon name={iconName} size={width * 0.5} color={color} />
			{text}{" "}
		</Animatable.View>
	);
};

LargeIcon.propTypes = {
	children: PropTypes.string,
	type: PropTypes.oneOf(["success", "pending", "default"])
};

export default LargeIcon;
