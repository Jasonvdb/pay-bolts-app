import React from "react";
import { Image, Dimensions, View } from "react-native";
import { colors } from "../../../styles/brand";

const { height } = Dimensions.get("window");

export default () => {
	return (
		<View
			style={{
				backgroundColor: colors.brandLight,
				borderRadius: 4,
				paddingLeft: 8,
				paddingRight: 8
			}}
		>
			<Image
				style={{
					width: 140,
					height: height < 600 ? 30 : 40,
					resizeMode: "contain"
				}}
				source={require("../../../../images/text-header.png")}
			/>
		</View>
	);
};
