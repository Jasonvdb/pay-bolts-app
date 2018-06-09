import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";

import { colors, spaces, fontSizes, fontFamily } from "../../styles/brand";

const { paddingSide } = spaces;
const { brandDark } = colors;

const Heading = props => {
	const {
		children,
		type = "h1",
		viewStyle = {},
		textStyle = {},
		ellipsizeMode = null
	} = props;

	const viewStyles = [styles.view];
	viewStyles.push(viewStyle);

	const textStyles = [styles[type]];
	textStyles.push(textStyle);

	return (
		<View style={viewStyles}>
			<Text {...props} style={textStyles}>
				{children}
			</Text>
		</View>
	);
};

Heading.propTypes = {
	children: PropTypes.any.isRequired,
	type: PropTypes.string
};

export default Heading;

const styles = StyleSheet.create({
	view: {
		flexDirection: "row",
		justifyContent: "center"
	},
	h1: {
		color: brandDark,
		textAlign: "center",
		fontSize: fontSizes.h1,
		fontFamily
	},
	h2: {
		color: brandDark,
		textAlign: "center",
		fontSize: fontSizes.h2,
		fontFamily
	},
	h3: {
		color: brandDark,
		textAlign: "center",
		fontSize: fontSizes.h3,
		fontFamily
	},
	h4: {
		color: brandDark,
		textAlign: "center",
		fontSize: fontSizes.h4,
		fontFamily
	},
	h5: {
		color: brandDark,
		textAlign: "center",
		fontSize: fontSizes.h5,
		fontFamily
	}
});
