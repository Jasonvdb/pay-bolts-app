import React, { Component } from "react";
import { View, Platform, Alert } from "react-native";
import Meteor from "react-native-meteor";

import Container from "../common/Container";
import { spaces } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import LogoHeader from "../common/header/LogoHeader";
import CustomTextInput from "../common/form/TextInput";
import Button from "../common/Button";
import Heading from "../common/Heading";
import LargeIcon from "../common/LargeIcon";
import Summary from "./Summary";

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			bolt11: "",
			isPaying: false,
			isDecodingInvoice: false,
			description: "",
			msatoshi: "",
			paymentSuccessfull: false
		};
	}

	componentDidMount() {}

	onSubmit() {
		const { bolt11 } = this.state;

		this.setState({ isPaying: true });

		Meteor.call(
			"testnet.pay",
			{
				bolt11
			},
			(err, invoice) => {
				this.setState({
					isPaying: false
				});

				if (!err) {
					console.log(invoice);
					this.onSuccess();
				} else {
					console.log(err);
					Alert.alert("Whoops", err.reason);
				}
			}
		);
	}

	onSuccess() {
		this.reset();
		this.setState({ paymentSuccessfull: true }, () => {
			setTimeout(() => this.setState({ paymentSuccessfull: false }), 6000);
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

		Meteor.call(
			"testnet.decodepay",
			{
				bolt11
			},
			(err, invoice) => {
				this.setState({ isDecodingInvoice: false });

				this.setState({
					isPaying: false
				});
				if (!err) {
					if (invoice) {
						const { description, msatoshi } = invoice;

						this.setState({ description, msatoshi });
					}
				} else {
					console.log(err);
					Alert.alert("Whoops", err.reason);
				}
			}
		);
	}

	renderInvoice() {
		const { description, msatoshi, isDecodingInvoice } = this.state;

		if (description && msatoshi) {
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
						<Heading type={"h2"}>{msatoshi} Satoshis</Heading>
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
						onRead: res => this.onRead(res.data)
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
							onPress={() => this.onSubmit()}
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
