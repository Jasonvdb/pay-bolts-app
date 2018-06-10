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

const StatusIcon = ({ connected, channels }) => {
	let name = "ios-help-outline";
	let color = colors.brandDark;

	if (connected) {
		name = "ios-checkmark-circle";
		color = colors.brandSeconday;
	} else {
		name = "ios-close-circle";
		color = colors.brandDisabled;
	}

	if (channels) {
		channels.forEach(({ state }) => {
			if (state === "CHANNELD_AWAITING_LOCKIN" || state === "OPENINGD") {
				name = "ios-time-outline";
				color = colors.brandPrimary;
			}
		});
	} else {
		//No channels yet
		name = "ios-time-outline";
		color = colors.brandPrimary;
	}

	return <Icon name={name} size={40} color={color} />;
};

const Channel = ({ channel_id, state, spendable_msatoshi }) => {
	return (
		<View>
			<Heading type="h4">Channel state: {state}</Heading>
			{spendable_msatoshi ? (
				<Heading type="h4">{spendable_msatoshi} Satoshis</Heading>
			) : null}
		</View>
	);
};

const Channels = ({ channels, connected }) => {
	if (!channels) {
		return null;
	}

	return (
		<View>
			<Heading type="h3">
				{connected ? "Connected to peer" : "Not connected to peer"}
			</Heading>
			<View style={{ marginBottom: 10 }} />
			{channels.map(channel => (
				<Channel key={channel.channel_id || Math.random()} {...channel} />
			))}
		</View>
	);
};

const PeerCard = ({ onPress, alias, connected, channels, showChannels }) => {
	const card = (
		<View style={styles.card}>
			<View style={styles.cardBody}>
				{/* <Image style={styles.logo} source={cryptos[ticker].sourceLogo} /> */}

				<View style={styles.aliasView}>
					<Heading type="h3">{alias || "-"}</Heading>
				</View>

				<View style={styles.descriptionView}>
					<Heading type="h5">
						Channels: {channels ? channels.length : 0}
					</Heading>
				</View>
				<View style={styles.statusView}>
					<StatusIcon connected={connected} channels={channels} />
				</View>
			</View>
			{showChannels ? (
				<Channels channels={channels} connected={connected} />
			) : null}
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
	alias: PropTypes.string,
	connected: PropTypes.bool.isRequired,
	channels: PropTypes.array,
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
