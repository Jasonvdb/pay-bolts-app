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
import moment from "moment";
import PropTypes from "prop-types";

import { colors, spaces } from "../../styles/brand";
import Heading from "../common/Heading";
import satoshisConversion from "../../helpers/satoshiConversion";

const StatusIcon = ({ status }) => {
	let name = "ios-help-outline";
	let color = colors.brandDark;

	if (status) {
		name = "ios-checkmark-circle";
		color = colors.brandSeconday;
	} else {
		name = "ios-time-outline";
		color = colors.brandPrimary;
	}

	return <Icon name={name} size={40} color={color} />;
};

const Description = ({
	showFiatValue,
	msatoshi_sent,
	msatoshi,
	currentExchangeRate,
	currentFiatSymbol,
	created_at
}) => {
	const satoshisSent = (msatoshi_sent / 100).toFixed(0);
	const satoshisFee = ((msatoshi_sent - msatoshi) / 100).toFixed(0);

	let sentString = `${satoshisSent} Satoshis`;
	let feeString = `${satoshisFee} Satoshis`;

	if (showFiatValue && currentExchangeRate && currentFiatSymbol) {
		sentString = `${(
			satoshisConversion(satoshisSent) * currentExchangeRate
		).toFixed(2)} ${currentFiatSymbol}`;
		feeString = `${(
			satoshisConversion(satoshisFee) * currentExchangeRate
		).toFixed(2)} ${currentFiatSymbol}`;
	}

	return (
		<View style={styles.descriptionView}>
			<Heading type="h5">Sent: {sentString}</Heading>
			<Heading type="h5">Fee: {feeString}</Heading>
			<Heading type="h5">
				{moment.unix(created_at).format("DD/MM/YYYY H:mm:ss")}
			</Heading>
		</View>
	);
};

const PaymentCard = props => {
	const {
		onPress,
		msatoshi,
		msatoshi_sent,
		id,
		created_at,
		status,
		showFiatValue,
		currentExchangeRate,
		currentFiatSymbol
	} = props;

	const card = (
		<View style={styles.card}>
			<View style={styles.cardBody}>
				{/* <Image style={styles.logo} source={cryptos[ticker].sourceLogo} /> */}

				<View style={styles.idView}>
					<Heading type="h3">{id}</Heading>
				</View>

				<Description
					showFiatValue={showFiatValue}
					msatoshi={msatoshi}
					msatoshi_sent={msatoshi_sent}
					currentExchangeRate={currentExchangeRate}
					currentFiatSymbol={currentFiatSymbol}
					created_at={created_at}
				/>
				{/* <View style={styles.descriptionView}>
					<Heading type="h5">Sent: {msatoshi_sent} Satoshis</Heading>
					<Heading type="h5">Fee: {msatoshi_sent - msatoshi} Satoshis</Heading>
				</View> */}
				<View style={styles.statusView}>
					<StatusIcon status={status} />
				</View>
			</View>
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

PaymentCard.propTypes = {
	onPress: PropTypes.func.isRequired,
	showFiatValue: PropTypes.bool.isRequired,
	currentExchangeRate: PropTypes.number,
	currentFiatSymbol: PropTypes.string
};

export default PaymentCard;

const styles = StyleSheet.create({
	card: {
		borderWidth: 0.3,
		borderColor: colors.brandCardBorderColor,
		backgroundColor: colors.brandCardBackground,
		borderRadius: 4,
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
		flex: 1,
		maxHeight: "100%"
	},
	// infoView: {
	// 	flex: 9,
	// 	flexDirection: "row",
	// 	justifyContent: "flex-end"
	// },
	descriptionView: {
		flex: 6,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "flex-start",
		alignItems: "flex-start",
		paddingLeft: 10,
		paddingRight: 10
	},
	idView: {
		flex: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start"
		//paddingLeft: 15,
		//paddingRight: 10
	},

	statusView: {
		flex: 2,
		flexDirection: "row",
		justifyContent: "flex-end"
	}
});
