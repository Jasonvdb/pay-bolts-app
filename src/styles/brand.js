import { Platform } from "react-native";
//https://uigradients.com/#RainbowBlue
//https://uigradients.com/#SublimeLight
//https://uigradients.com/#Subu
//https://uigradients.com/#Nepal
//https://uigradients.com/#Ali
export const colors = {
	brandDark: "#2C3E50",
	brandPrimary: "#1a67b4",
	brandSeconday: "#18bc9c",
	brandInfo: "#f83600",
	brandLight: "#fff",
	brandYellow: "#FFBE1E",
	brandDisabled: "#95a5a6",
	brandGray: "#e5e5e5",
	brandCardBackground: "#FBFBFB",
	brandCardBorderColor: "#E3E5E9",
	brandInnactiveIconColor: "rgba(44,62,80, 0.2)",
	brandActiveIconColor: "#4776e6",
	brandBackground1: "#4776e6",
	brandBackground2: "#8e54e9"
};

export const spaces = {
	marginTop: 15,
	marginBottom: 15,
	paddingSide: 15,
	paddingBottom: 25,
	paddingTop: 25,
	marginCard: 15,
	paddingCard: 8,
	listPadding: 15,
	paddingFAB: 30
};

export const fontSizes = {
	h1: Platform.OS === "ios" ? 35 : 26,
	h2: Platform.OS === "ios" ? 22 : 20,
	h3: Platform.OS === "ios" ? 18 : 17,
	h4: Platform.OS === "ios" ? 16 : 15,
	h5: Platform.OS === "ios" ? 13 : 12,
	text: Platform.OS === "ios" ? 18 : 16,
	textMedium: Platform.OS === "ios" ? 16 : 14,
	textSmall: Platform.OS === "ios" ? 12 : 10,
	button: Platform.OS === "ios" ? 24 : 26,
	buttonSmall: Platform.OS === "ios" ? 20 : 18,
	select: 18,
	textInputLabel: Platform.OS === "ios" ? 18 : 16,
	textInput: Platform.OS === "ios" ? 20 : 18,
	textInputLabelLarge: Platform.OS === "ios" ? 22 : 20,
	textInputLarge: Platform.OS === "ios" ? 24 : 22
};

export const fontFamily = "System"; //https://medium.com/react-native-training/react-native-custom-fonts-ccc9aacf9e5e
