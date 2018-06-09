import React from "react";
import { StyleSheet, Platform, View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";

import { colors, spaces, fontSizes } from "../../../styles/brand";

const { paddingSide } = spaces;
const { brandDark } = colors;

const CustomTextInput = props => {
	const {
		text,
		onChangeText,
		label,
		keyboardType,
		secureTextEntry,
		type = "default",
		autoFocus,
		white
	} = props;

	const textInputStyles = [styles.textInput];
	if (type === "large") {
		textInputStyles.push(styles.textInputLarge);
	}

	const textLabelStyles = [styles.labelText];
	let underlineColor = brandDark;
	if (white) {
		textInputStyles.push(styles.whiteText);
		textLabelStyles.push(styles.whiteText);
		underlineColor = "#fff";
	}

	return (
		<View
			style={{
				paddingRight: paddingSide,
				paddingLeft: paddingSide
			}}
		>
			{label ? <Text style={textLabelStyles}>{label}</Text> : null}

			<TextInput
				autoFocus={autoFocus}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				style={textInputStyles}
				onChangeText={onChangeText}
				value={text}
				underlineColorAndroid={underlineColor}
				selectionColor={underlineColor}
			/>
		</View>
	);
};

CustomTextInput.propTypes = {
	text: PropTypes.string.isRequired,
	onChangeText: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	keyboardType: PropTypes.string,
	secureTextEntry: PropTypes.bool
};

export default CustomTextInput;

const styles = StyleSheet.create({
	labelText: {
		fontSize: fontSizes.textInputLabel,
		color: brandDark,
		marginBottom: 8
	},
	textInput: {
		height: Platform.OS === "ios" ? 40 : 45,
		borderColor: brandDark,
		borderBottomWidth: 1.5,
		color: brandDark,

		fontSize: fontSizes.textInput
	},
	textInputLarge: {
		fontSize: fontSizes.textInputLarge
	},
	whiteText: {
		color: "#fff",
		borderColor: "#fff"
	}
});
