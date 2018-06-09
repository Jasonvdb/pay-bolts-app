import React from "react";
import {
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
	Text
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import PropTypes from "prop-types";

import { colors, spaces } from "../../styles/brand";
import Heading from "../common/Heading";

const Channel = ({ channel_id, state, spendable_msatoshi }) => {
	return (
		<View>
			<Heading type="h3">State: {state}</Heading>
			<Heading type="h4">{spendable_msatoshi} Satoshis</Heading>
		</View>
	);
};

const Channels = ({ channels }) => {
	if (!channels) {
		return null;
	}

	return channels.map(channel => (
		<Channel key={channel.channel_id} {...channel} />
	));
};

const PeerCard = ({ onPress, alias, connected, channels, showChannels }) => {
	const icon = connected ? (
		<Icon
			name={"ios-checkmark-circle"}
			size={40}
			color={colors.brandSeconday}
		/>
	) : (
		<Icon name={"ios-close-circle"} size={40} color={colors.brandDisabled} />
	);

	const card = (
		<View style={styles.card}>
			<View style={styles.cardBody}>
				{/* <Image style={styles.logo} source={cryptos[ticker].sourceLogo} /> */}

				<View style={styles.aliasView}>
					<Heading type="h3">{alias}</Heading>
					{connected ? "Connected" : "Not connected"}
				</View>

				<View style={styles.descriptionView}>
					<Heading type="h5">
						Channels: {channels ? channels.length : 0}
					</Heading>
				</View>
				<View style={styles.statusView}>{icon}</View>
			</View>
			{showChannels ? <Channels channels={channels} /> : null}
		</View>
	);

	return Platform.select({
		ios: <TouchableOpacity onPress={onPress}>{card}</TouchableOpacity>,
		android: (
			<TouchableNativeFeedback onPress={onPress}>
				{card}
			</TouchableNativeFeedback>
		)
	});
};

PeerCard.propTypes = {
	onPress: PropTypes.func.isRequired,
	alias: PropTypes.string.isRequired,
	connected: PropTypes.bool.isRequired,
	channels: PropTypes.array.isRequired,
	showChannels: PropTypes.bool.isRequired
};

export default PeerCard;

const styles = StyleSheet.create({
	card: {
		borderWidth: 0.3,
		borderColor: colors.brandCardBorderColor,
		backgroundColor: colors.brandCardBackground,
		borderRadius: 6,
		//height: 180,
		marginBottom: spaces.marginCard,
		marginRight: spaces.marginCard,
		marginLeft: spaces.marginCard,
		paddingTop: spaces.paddingCard,
		paddingBottom: spaces.paddingCard,
		paddingLeft: spaces.paddingSide,
		paddingRight: spaces.paddingSide
	},
	cardBody: {
		height: 50,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	logo: {
		resizeMode: "contain",
		flex: 1.2,
		maxHeight: "100%"
	},
	// infoView: {
	// 	flex: 9,
	// 	flexDirection: "row",
	// 	justifyContent: "flex-end"
	// },
	// descriptionView: {
	// 	flex: 6,
	// 	display: "flex",
	// 	flexDirection: "column",
	// 	justifyContent: "flex-start",
	// 	alignItems: "center",
	// 	paddingLeft: 10,
	// 	paddingRight: 10
	// },
	aliasView: {
		flex: 6,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		paddingLeft: 15,
		paddingRight: 10
	},

	statusView: {
		flex: 2,
		flexDirection: "row",
		justifyContent: "flex-end"
	}
});
