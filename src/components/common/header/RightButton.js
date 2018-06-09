import React from "react";
import { Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { colors } from "../../../styles/brand";

export default ({ onPress, type }) => {
	let icon = <Icon name={"ios-person"} size={30} color={colors.brandDark} />;

	if (type === "logout") {
		icon = (
			<Icon name={"ios-exit-outline"} size={30} color={colors.brandDark} />
		);
	} else if (type === "add") {
		icon = <Icon name={"ios-person"} size={30} color={colors.brandDark} />;
	} else {
		console.error("Pass 'type' to right header button");
		return null;
	}

	return onPress ? (
		<TouchableOpacity onPress={onPress} style={{ paddingRight: 10 }}>
			{icon}
		</TouchableOpacity>
	) : null;
};
