import React, { Component } from "react";
import { View, Platform, Alert } from "react-native";
import FingerprintScanner from "react-native-fingerprint-scanner";

import Container from "../common/Container";
import { spaces } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import LogoHeader from "../common/header/LogoHeader";
import CustomTextInput from "../common/form/TextInput";
import Button from "../common/Button";
import Heading from "../common/Heading";
import LargeIcon from "../common/LargeIcon";
import Summary from "./Summary";
import signedRequest from "../../helpers/signedRequest";
import getExchangeRate from "../../helpers/getExchangeRate";
import satoshiConversion from "../../helpers/satoshiConversion";

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			bolt11: "",
			isPaying: false,
			isDecodingInvoice: false,
			description: "",
			msatoshi: "",
			paymentSuccessfull: false,
			currentExchangeRate: null,
			currentFiatSymbol: null
		};
	}

	componentDidMount() {}

	checkFingerprint() {
		//Check with fingerprint, only for ios. Android might need extra setup
		//https://github.com/hieuvp/react-native-fingerprint-scanner
		if (Platform.OS === "ios") {
			FingerprintScanner.authenticate({
				description: "Scan your fingerprint to pay."
			})
				.then(() => {
					this.onPay();
				})
				.catch(error => {
					console.log(error);
					Alert.alert("Whoops", "Authentication failed.");
				});
		} else {
			this.onPay();
		}
	}

	onPay() {
		const { bolt11 } = this.state;

		this.setState({ isPaying: true });

		signedRequest({
			method: "pay",
			params: { bolt11, maxfeepercent: 2 }, //TODO allow them to set this value
			onSuccess: data => {
				this.setState({
					isPaying: false
				});

				this.onSuccess();
			},
			onError: errorMessage => {
				this.setState({ isPaying: false });

				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	onSuccess() {
		this.reset();
		this.setState({ paymentSuccessfull: true }, () => {
			setTimeout(() => this.setState({ paymentSuccessfull: false }), 5000);
		});
	}

	onRead(data) {
		this.props.navigation.pop();
		const bolt11 = data.replace("lightning:", "");
		this.setState({ bolt11 }, () => this.decodeInvoice());
	}

	decodeInvoice() {
		const { bolt11 } = this.state;
		this.setState({ isDecodingInvoice: true });

		signedRequest({
			method: "decodepay",
			params: { bolt11 },
			onSuccess: data => {
				const { description, msatoshi } = data.invoice;

				getExchangeRate(
					({ value, symbol }) => {
						this.setState({
							currentExchangeRate: value,
							currentFiatSymbol: symbol
						});
					},
					errorMessage => {
						Alert.alert("Whoops", errorMessage);
					}
				);

				this.setState({
					description,
					msatoshi,
					isDecodingInvoice: false,
					isPaying: false
				});
			},
			onError: errorMessage => {
				this.setState({ isDecodingInvoice: false }, () => {
					Alert.alert("Whoops", errorMessage);
				});
			}
		});
	}

	renderInvoice() {
		const {
			description,
			msatoshi,
			currentExchangeRate,
			currentFiatSymbol
		} = this.state;

		if (description && msatoshi) {
			const bitcoinValue = satoshiConversion(msatoshi, "m");
			return (
				<View>
					<Animatable.View
						easing="linear"
						animation="fadeIn"
						duration={100}
						style={{ marginBottom: 25 }}
					>
						<Heading type={"h1"}>{description}</Heading>
					</Animatable.View>

					<Animatable.View
						easing="linear"
						animation="fadeIn"
						duration={200}
						delay={200}
					>
						{currentExchangeRate && currentFiatSymbol ? (
							<Heading type={"h1"}>
								{(bitcoinValue * currentExchangeRate).toFixed(2)}{" "}
								{currentFiatSymbol}
							</Heading>
						) : null}

						<Heading type={"h2"}>{msatoshi / 100} Satoshis</Heading>
					</Animatable.View>
				</View>
			);
		}

		return null;
	}

	reset() {
		this.setState({
			bolt11: "",
			description: "",
			msatoshi: "",
			isPaying: false,
			isDecodingInvoice: false
		});
	}

	render() {
		const { navigation } = this.props;
		const {
			bolt11,
			isPaying,
			msatoshi,
			isDecodingInvoice,
			paymentSuccessfull
		} = this.state;

		const actions = {
			edit: {
				label: "Scan",
				callback: () => {
					this.setState({ paymentSuccessfull: false });

					navigation.push("ScanInvoice", {
						onRead: res => this.onRead(res.data),
						title: "Scan invoice"
					});
				},
				icon: "scan"
			}
		};

		const showSummary =
			!paymentSuccessfull && !isDecodingInvoice && !isPaying && !msatoshi;

		return (
			<Container
				actions={isPaying || isDecodingInvoice || msatoshi ? null : actions}
				// keyboardScroll={!showSummary}
			>
				<View style={{ flex: 1, justifyContent: "space-between" }}>
					{/* <CustomTextInput
							label="Bolt11 invoice string"
							text={bolt11}
							onChangeText={bolt11 => this.setState({ bolt11 })}
						/> */}
					{showSummary ? <Summary /> : null}
					<View />
					<View style={{ marginTop: spaces.marginTop }}>
						{this.renderInvoice()}

						{paymentSuccessfull ? (
							<LargeIcon type="success">Paid!</LargeIcon>
						) : null}

						{isDecodingInvoice ? <LargeIcon type="pending" /> : null}

						{isPaying ? <LargeIcon type="pending" /> : null}
					</View>

					<View>
						<Button
							stylesOuter={{ marginBottom: spaces.marginBottom }}
							showAnimated={!isPaying && !!bolt11 && !!msatoshi}
							title={isPaying ? "Paying..." : "Pay"}
							type="secondary"
							onPress={() => this.checkFingerprint()}
						/>

						<Button
							stylesOuter={{ marginBottom: spaces.marginBottom }}
							showAnimated={!isPaying && !!bolt11 && !!msatoshi}
							title={"Cancel"}
							onPress={this.reset.bind(this)}
						/>
					</View>
				</View>
			</Container>
		);
	}
}

Home.navigationOptions = ({ navigation }) => {
	return Platform.select({
		ios: {
			headerTitle: () => <LogoHeader />
		},
		android: {
			header: null
		}
	});
};

export default Home;
