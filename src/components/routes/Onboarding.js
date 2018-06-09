import React from "react";
import { TouchableOpacity } from "react-native";
import { StackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import Welcome from "../onboarding/Welcome";
import Signin from "../onboarding/Signin";
import Names from "../onboarding/Names";
import Signup from "../onboarding/Signup";

import { colors } from "../../styles/brand";

export default StackNavigator(
	{
		Welcome: {
			screen: Welcome
		},
		Signin: {
			screen: Signin
		},
		Names: {
			screen: Names
		},
		Signup: {
			screen: Signup
		}
	},
	{
		navigationOptions: {
			header: null,
			headerLeft: props => {
				const { onPress } = props;
				return (
					<TouchableOpacity onPress={onPress} style={{ paddingLeft: 10 }}>
						<Icon name={"ios-arrow-back"} size={30} color={colors.brandDark} />
					</TouchableOpacity>
				);
			}
		}
	}
);
