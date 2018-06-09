import React, { Component } from "react";
import { View, Alert, Image } from "react-native";
import axios from "axios";

import { colors, spaces } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import Heading from "../common/Heading";
import LargeIcon from "../common/LargeIcon";
import satoshisConversion from "../../helpers/satoshiConversion";
import { setCache, getCache } from "../../helpers/localcache";
import settings from "../../helpers/settings";

class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inWalletSathosis: null,
			onChannelSatoshis: null,
			isLoading: false
		};
	}

	componentDidMount() {
		console.log("Channels mounted");

		this.fetchFunds();
		this.fundsInterval = setInterval(() => {
			this.fetchFunds();
		}, 20000);

		this.loadFromCache();
	}

	componentWillUnmount() {
		if (this.fundsInterval) {
			clearInterval(this.fundsInterval);
		}
	}

	async loadFromCache() {
		const funds = await getCache("funds");
		console.log("CAHSH", funds);
		if (funds) {
			this.setFunds(funds);
		} else {
			//If we don't have cache first, show lighting
			this.setState({ isLoading: true });
		}
	}

	fetchFunds() {
		const { apiBaseUrl } = settings;

		axios
			.get(`${apiBaseUrl}listfunds`)
			.then(response => {
				const { data } = response;
				this.setFunds(data.funds);
				setCache("funds", data.funds);
			})
			.catch(errorResult => {
				const { response } = errorResult;
				if (response.data) {
					Alert.alert("Whoops", response.data.error.message);
				} else {
					Alert.alert("Whoops", "An API error occured");
				}
			});
	}

	setFunds(funds) {
		let inWalletSathosis = 0;
		let onChannelSatoshis = 0;
		const { outputs, channels } = funds;
		outputs.forEach(({ value, status }) => {
			inWalletSathosis = inWalletSathosis + value;
		});

		channels.forEach(({ channel_sat, channel_total_sat }) => {
			onChannelSatoshis = onChannelSatoshis + channel_sat;
		});

		this.setState({ inWalletSathosis, onChannelSatoshis });
	}

	renderBalances() {
		const { inWalletSathosis, onChannelSatoshis } = this.state;

		return (
			<View
				style={{
					flex: 1,
					display: "flex"
				}}
			>
				<Animatable.View
					easing="ease-in-cubic"
					animation="fadeIn"
					duration={400}
					style={{
						justifyContent: "center",
						alignItems: "center",
						marginTop: spaces.marginTop,
						flex: 5
					}}
				>
					<Image
						style={{
							height: "100%",
							width: "100%",
							resizeMode: "contain"
						}}
						source={require("../../../images/logo.png")}
					/>
				</Animatable.View>
				<Animatable.View
					easing="ease-in"
					animation="fadeInLeftBig"
					duration={700}
					style={{ justifyContent: "center", alignItems: "center", flex: 3 }}
				>
					<Heading type="h2">Wallet balance:</Heading>
					<Heading type="h1" textStyle={{ color: colors.brandSeconday }}>
						{satoshisConversion(inWalletSathosis).toFixed(6)} BTC
					</Heading>
				</Animatable.View>
				<Animatable.View
					easing="ease-in"
					animation="fadeInRightBig"
					duration={700}
					style={{ justifyContent: "center", alignItems: "center", flex: 3 }}
				>
					<Heading type="h2">Channel balance:</Heading>
					<Heading type="h1" textStyle={{ color: colors.brandSeconday }}>
						{satoshisConversion(onChannelSatoshis).toFixed(6)} BTC
					</Heading>
				</Animatable.View>
			</View>
		);
	}

	render() {
		const { isLoading } = this.state;

		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center"
				}}
			>
				{isLoading ? (
					<LargeIcon type="pending">Updating balances...</LargeIcon>
				) : (
					this.renderBalances()
				)}
			</View>
		);
	}
}

export default Summary;
