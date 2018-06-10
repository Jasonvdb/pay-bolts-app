import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import { StackNavigator, TabNavigator } from "react-navigation";
//import Icon from "react-native-vector-icons/dist/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";

import Home from "../home/Home";
import Scan from "../home/Scan";
import Transactions from "../transactions/Transactions";
import Settings from "../settings/Settings";
import Channels from "../channels/Channels";

import { colors } from "../../styles/brand";

const generalNavigationOptions = {
	swipeEnabled: true,
	headerStyle: {
		backgroundColor: colors.brandLight,
		borderBottomWidth: 0
	},
	headerTintColor: colors.brandPrimary,
	headerLeft: props => {
		const { onPress } = props;
		return (
			<TouchableOpacity onPress={onPress} style={{ paddingLeft: 10 }}>
				<Icon name={"ios-arrow-back"} size={30} color={colors.brandPrimary} />
			</TouchableOpacity>
		);
	}
};

const HomeScreenNavigator = StackNavigator(
	{
		Home: { screen: Home },
		ScanInvoice: { screen: Scan }
		// ViewInvoice: { screen: Invoice }
	},
	{
		navigationOptions: ({ navigation }) => {
			const propertiesViewToShowTabBarOn = ["Home"];

			const showTab =
				propertiesViewToShowTabBarOn.indexOf(navigation.state.routeName) > -1;

			let androidOptions = {};
			if (showTab && Platform.OS === "android") {
				androidOptions = {
					header: null
				};
			}

			return {
				...generalNavigationOptions,
				// headerStyle: {
				// 	...generalNavigationOptions.headerStyle,
				// 	backgroundColor: colors.brandPrimary,
				// 	borderBottomWidth: 0
				// },
				//headerTintColor: colors.brandDark,
				//*******HIDE TAB BAR */
				tabBarVisible: showTab,
				swipeEnabled: showTab,
				//******* */
				...androidOptions,
				tabBarIcon: ({ focused }) => {
					// const source = focused
					// 	? require("../../../images/icons/white/Purse.png")
					// 	: require("../../../images/icons/gray/Purse.png");
					// return <Image style={{ width: 30, height: 30 }} source={source} />;
					return (
						<Icon
							name={"ios-home"}
							size={35}
							color={
								focused
									? colors.brandActiveIconColor
									: colors.brandInnactiveIconColor
							}
						/>
					);
				}
			};
		}
	}
);

const InvoicesScreenNavigator = StackNavigator(
	{
		ViewTransactions: {
			screen: Transactions
		}
		// ViewInvoice: { screen: Invoice }
	},
	{
		navigationOptions: ({ navigation, screenProps }) => {
			const viewToShowTabBarOn = ["ViewTransactions"];

			const showTab =
				viewToShowTabBarOn.indexOf(navigation.state.routeName) > -1;

			let androidOptions = {};
			if (showTab && Platform.OS === "android") {
				androidOptions = {
					header: null
				};
			}

			return {
				...generalNavigationOptions,
				// headerStyle: {
				// 	...generalNavigationOptions.headerStyle,
				// 	backgroundColor: colors.brandSeconday,
				// 	borderBottomWidth: 0
				// },

				//*******HIDE TAB BAR */
				tabBarVisible: showTab,
				swipeEnabled: showTab,
				//******* */

				...androidOptions,

				tabBarOnPress: ({ scene, jumpToIndex }) => {
					jumpToIndex(scene.index);

					//If they're on the 'properties' tab and they tab the tab icon again, it goes to the start of the route
					if (scene.route.index > 0 && scene.focused) {
						navigation.goBack();
					}
				},
				tabBarIcon: ({ focused }) => {
					// const source = focused
					// 	? require("../../../images/icons/white/List.png")
					// 	: require("../../../images/icons/gray/List.png");
					// return <Image style={{ width: 30, height: 30 }} source={source} />;
					return (
						<Icon
							name={"ios-document"}
							size={35}
							color={
								focused
									? colors.brandActiveIconColor
									: colors.brandInnactiveIconColor
							}
						/>
					);
				}
			};
		}
	}
);

const ChannelsScreenNavigator = StackNavigator(
	{
		Channels: {
			screen: Channels
		},
		ScanPeer: { screen: Scan }
	},
	{
		navigationOptions: ({ navigation, screenProps }) => {
			const viewToShowTabBarOn = ["Channels"];

			const showTab =
				viewToShowTabBarOn.indexOf(navigation.state.routeName) > -1;

			let androidOptions = {};
			if (showTab && Platform.OS === "android") {
				androidOptions = {
					header: null
				};
			}

			return {
				...generalNavigationOptions,
				// headerStyle: {
				// 	...generalNavigationOptions.headerStyle,
				// 	backgroundColor: colors.brandSeconday,
				// 	borderBottomWidth: 0
				// },

				//*******HIDE TAB BAR */
				tabBarVisible: showTab,
				swipeEnabled: showTab,
				//******* */

				...androidOptions,

				tabBarOnPress: ({ scene, jumpToIndex }) => {
					jumpToIndex(scene.index);

					//If they're on the 'properties' tab and they tab the tab icon again, it goes to the start of the route
					if (scene.route.index > 0 && scene.focused) {
						navigation.goBack();
					}
				},
				tabBarIcon: ({ focused }) => {
					// const source = focused
					// 	? require("../../../images/icons/white/List.png")
					// 	: require("../../../images/icons/gray/List.png");
					// return <Image style={{ width: 30, height: 30 }} source={source} />;
					return (
						<Icon
							name={"ios-swap-outline"} //ios-resize-outline
							size={35}
							color={
								focused
									? colors.brandActiveIconColor
									: colors.brandInnactiveIconColor
							}
						/>
					);
				}
			};
		}
	}
);

// const ChannelsScreenNavigator = StackNavigator(
// 	{
// 		Channels: {
// 			screen: Channels
// 		},
// 		ScanPeer: { screen: Scan }
// 	},
// 	{
// 		navigationOptions: {
// 			...generalNavigationOptions,
// 			//headerStyle: {
// 			// ...generalNavigationOptions.headerStyle,
// 			// backgroundColor: colors.brandPrimary,
// 			// borderBottomWidth: 0
// 			//},

// 			tabBarIcon: ({ focused }) => {
// 				// const source = focused
// 				// 	? require("../../../images/icons/white/User.png")
// 				// 	: require("../../../images/icons/gray/User.png");
// 				return (
// 					<Icon
// 						name={"ios-swap-outline"} //ios-resize-outline
// 						size={35}
// 						color={
// 							focused
// 								? colors.brandActiveIconColor
// 								: colors.brandInnactiveIconColor
// 						}
// 					/>
// 				);
// 				//return <Image style={{ width: 30, height: 30 }} source={source} />;
// 			}
// 		}
// 	}
// );

const SettingsScreenNavigator = StackNavigator(
	{
		Settings: {
			screen: Settings
		}
	},
	{
		navigationOptions: {
			...generalNavigationOptions,
			//headerStyle: {
			// ...generalNavigationOptions.headerStyle,
			// backgroundColor: colors.brandPrimary,
			// borderBottomWidth: 0
			//},
			tabBarIcon: ({ focused }) => {
				// const source = focused
				// 	? require("../../../images/icons/white/User.png")
				// 	: require("../../../images/icons/gray/User.png");
				return (
					<Icon
						name={"ios-cog"}
						size={35}
						color={
							focused
								? colors.brandActiveIconColor
								: colors.brandInnactiveIconColor
						}
					/>
				);
				//return <Image style={{ width: 30, height: 30 }} source={source} />;
			}
		}
	}
);

const Tabs = TabNavigator(
	{
		Home: { screen: HomeScreenNavigator },
		Invoices: { screen: InvoicesScreenNavigator },
		Channels: { screen: ChannelsScreenNavigator },
		Settings: { screen: SettingsScreenNavigator }
	},
	{
		animationEnabled: true,
		lazy: false,

		navigationOptions: {
			//swipeEnabled: false //TO go back
		},

		tabBarOptions: {
			activeTintColor: colors.brandActiveTabIconColor,
			inactiveTintColor: colors.brandInnactiveTabIconColor,
			showLabel: Platform.select({ ios: false, android: true }),
			labelStyle: Platform.select({
				ios: {},
				android: {
					fontSize: 12,
					color: colors.brandActiveIconColor
				}
			}),
			style: {
				borderTopColor: "transparent", //colors.brandInnactiveTabIconColor,
				backgroundColor: colors.brandLight //"#798eec" //
			}
		}
	}
);

export default Tabs;
