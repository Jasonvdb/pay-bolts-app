import React, { Component } from "react";
import { View, Alert, Image, TouchableOpacity, AppState } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { colors, spaces } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import Heading from "../common/Heading";
import LargeIcon from "../common/LargeIcon";
import satoshisConversion from "../../helpers/satoshiConversion";
import { setCache, getCache } from "../../helpers/localcache";
import signedRequest from "../../helpers/signedRequest";
import getExchangeRate from "../../helpers/getExchangeRate";

class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			inWalletSathosis: null,
			onChannelSatoshis: null,
			isLoading: false,
			isConnected: null,
			network: null,
			currentExchangeRate: null,
			currentFiatSymbol: null
		};
	}

	componentDidMount() {
		this.startInterval();
		this.loadFromCache();
		this.componentIsMounted = true;

		AppState.addEventListener("change", this.handleAppStateChange.bind(this));
	}

	startInterval() {
		this.stopInterval();
		this.fetchUpdates();
		this.interval = setInterval(() => {
			this.fetchUpdates();
		}, 20000);
	}

	componentWillUnmount() {
		this.componentIsMounted = false;

		this.stopInterval();

		AppState.removeEventListener(
			"change",
			this.handleAppStateChange.bind(this)
		);
	}

	handleAppStateChange(nextAppState) {
		if (nextAppState !== this.currentAppState) {
			if (nextAppState === "active") {
				this.setState({ isConnected: null }, () => this.startInterval());
			} else {
				this.stopInterval();
			}
		}
		this.currentAppState = nextAppState;
	}

	stopInterval() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	async loadFromCache() {
		const funds = await getCache("funds");
		if (funds) {
			this.setFunds(funds);
		} else {
			//If we don't have cache first, show lighting
			this.setState({ isLoading: true });
		}
	}

	fetchUpdates() {
		signedRequest({
			method: "listfunds",
			onSuccess: data => {
				if (this.componentIsMounted) {
					this.setFunds(data.funds);
					setCache("funds", data.funds);
				}
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});

		signedRequest({
			method: "getinfo",
			onSuccess: data => {
				if (this.componentIsMounted) {
					const { network } = data.info;
					this.setState({ isConnected: true, network });
				}
			},
			onError: errorMessage => {
				this.setState({ isConnected: false });
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	setFunds(funds) {
		let inWalletSathosis = 0;
		let onChannelSatoshis = 0;
		const { outputs, channels } = funds;
		outputs.forEach(output => {
			const { value, status } = output;
			inWalletSathosis = inWalletSathosis + value;
		});

		channels.forEach(({ channel_sat, channel_total_sat }) => {
			onChannelSatoshis = onChannelSatoshis + channel_sat;
		});

		if (this.componentIsMounted) {
			this.setState({ inWalletSathosis, onChannelSatoshis }, () => {
				getExchangeRate(
					({ value, symbol }) => {
						this.setState({
							currentExchangeRate: value,
							currentFiatSymbol: symbol,
							isLoading: false
						});
					},
					errorMessage => {
						Alert.alert("Whoops", errorMessage);
					}
				);
			});
		}
	}

	renderConectionStatus() {
		const { isConnected, network } = this.state;

		let iconName = "ios-time-outline";
		let color = colors.brandDisabled;
		let text = "Connecting...";

		if (isConnected === true) {
			iconName = "ios-checkmark-circle-outline";
			color = colors.brandSeconday;
			text = "Connected";
		} else if (isConnected === false) {
			iconName = "ios-close-circle-outline";
			color = colors.brandInfo;
			text = "Connection failed";
		}

		const inner = (
			<View style={{ flexDirection: "row", alignItems: "flex-start" }}>
				<Icon name={iconName} size={20} color={color} />
				<View style={{ marginLeft: 5 }} />
				<Heading textStyle={{ color }} type="h4">
					{text}
					{network && isConnected === true ? ` (${network})` : ""}
				</Heading>
			</View>
		);

		if (isConnected === false) {
			return (
				<TouchableOpacity
					onPress={() =>
						this.setState({ isConnected: null }, () => this.startInterval())
					}
				>
					{inner}
				</TouchableOpacity>
			);
		}

		return inner;
	}

	renderBalances() {
		const {
			inWalletSathosis,
			onChannelSatoshis,
			currentExchangeRate,
			currentFiatSymbol
		} = this.state;

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
						flex: 4
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
					{currentExchangeRate ? (
						<Heading type="h1">
							{(
								satoshisConversion(inWalletSathosis) * currentExchangeRate
							).toFixed(2)}{" "}
							{currentFiatSymbol}
						</Heading>
					) : null}
					<Heading type="h3">
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
					{currentExchangeRate ? (
						<Heading type="h1">
							{(
								satoshisConversion(onChannelSatoshis) * currentExchangeRate
							).toFixed(2)}{" "}
							{currentFiatSymbol}
						</Heading>
					) : null}
					<Heading type="h3">
						{satoshisConversion(onChannelSatoshis).toFixed(6)} BTC
					</Heading>
				</Animatable.View>

				<Animatable.View
					easing="ease-in"
					animation="fadeIn"
					duration={600}
					style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
				>
					{this.renderConectionStatus()}
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
