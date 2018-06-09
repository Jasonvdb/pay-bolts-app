import React from "react";
import {
	TouchableNativeFeedback,
	TouchableOpacity,
	StyleSheet,
	Platform,
	View,
	Text
} from "react-native";
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";

import { colors, spaces, fontSizes } from "../../styles/brand";

const { paddingSide } = spaces;
const {
	brandDark,
	brandPrimary,
	brandSeconday,
	brandLight,
	brandDisabled,
	brandInfo
} = colors;

const Button = ({
	type,
	onPress,
	title,
	disabled,
	showAnimated,
	stylesOuter = {},
	size = "large"
}) => {
	const formattedTitle =
		Platform.OS === "android" ? title.toUpperCase() : title;

	const buttonStyle = [styles.button];
	const textStyle = [styles.text];

	if (disabled) {
		buttonStyle.push(styles.buttonDisabled);
	} else if (type === "primary") {
		buttonStyle.push(styles.buttonPrimary);
	} else if (type === "secondary") {
		buttonStyle.push(styles.buttonSecondary);
		textStyle.push(styles.textWhite);
	} else if (type === "info") {
		buttonStyle.push(styles.buttonInfo);
		textStyle.push(styles.textWhite);
	} else {
		buttonStyle.push(styles.buttonDefault);
		textStyle.push(styles.textWhite);
	}

	if (size === "small") {
		buttonStyle.push(styles.buttonSmall);
		textStyle.push(styles.textSmall);
	}

	const styleOuter = [styles.outer, stylesOuter];

	if (disabled) {
		return (
			<View style={styleOuter} accessibilityComponentType="button">
				<View style={buttonStyle}>
					<Text style={textStyle}>{formattedTitle}</Text>
				</View>
			</View>
		);
	}

	const innerView = (
		<View style={buttonStyle}>
			<Text style={textStyle}>{formattedTitle}</Text>
		</View>
	);

	let button;
	if (Platform.OS === "ios") {
		button = (
			<TouchableOpacity
				style={styleOuter}
				onPress={onPress}
				accessibilityComponentType="button"
			>
				{innerView}
			</TouchableOpacity>
		);
	} else {
		button = (
			<View
				style={styleOuter}
				onPress={onPress}
				accessibilityComponentType="button"
			>
				<TouchableNativeFeedback
					onPress={onPress}
					accessibilityComponentType="button"
				>
					{innerView}
				</TouchableNativeFeedback>
			</View>
		);
	}

	if (showAnimated === true || showAnimated === false) {
		return showAnimated ? (
			<Animatable.View easing="linear" animation="fadeInUp" duration={150}>
				{button}
			</Animatable.View>
		) : (
			<View style={{ height: 60 }} />
		);
	} else {
		return button;
	}
};

Button.propTypes = {
	type: PropTypes.oneOf(["primary", "secondary", "default", "info"]),
	title: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	stylesOuter: PropTypes.object,
	showAnimated: PropTypes.bool,
	size: PropTypes.string
};

export default Button;

const styles = StyleSheet.create({
	outer: { flexDirection: "row", paddingLeft: paddingSide, paddingRight: 25 },
	button: Platform.select({
		ios: {
			borderRadius: 8,
			flex: 1,
			justifyContent: "center",
			height: 60
		},
		android: {
			justifyContent: "center",
			flex: 1,
			height: 56,
			marginTop: 2,
			marginBottom: 2,
			elevation: 1,
			borderRadius: 4
		}
	}),
	buttonSmall: Platform.select({
		ios: {
			height: 40
		},
		android: {
			height: 36,
			marginTop: 2,
			marginBottom: 2
		}
	}),
	buttonPrimary: {
		backgroundColor: brandPrimary
	},
	buttonSecondary: {
		backgroundColor: brandSeconday
	},
	buttonInfo: {
		backgroundColor: brandInfo
	},
	buttonDefault: {
		backgroundColor: brandDark
	},
	text: Platform.select({
		ios: {
			color: brandLight,
			textAlign: "center",
			padding: 10,
			fontSize: fontSizes.button
		},
		android: {
			color: brandLight,
			textAlign: "center",
			padding: 8,
			fontWeight: "500",
			fontSize: fontSizes.button
		}
	}),
	textSmall: Platform.select({
		ios: {
			fontSize: fontSizes.buttonSmall
		},
		android: {
			fontSize: fontSizes.buttonSmall
		}
	}),
	buttonDisabled: Platform.select({
		ios: {
			backgroundColor: brandDisabled
		},
		android: {
			elevation: 0,
			backgroundColor: brandDisabled //TODO
		}
	}),
	textWhite: Platform.select({
		ios: {
			color: "white"
		},
		android: {
			color: "white"
		}
	})
});
