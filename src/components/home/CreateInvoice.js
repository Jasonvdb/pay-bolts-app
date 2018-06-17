import React, { Component } from "react";
import { Dimensions, View, Alert } from "react-native";
import PropTypes from "prop-types";

import Container from "../common/Container";
import { colors, spaces } from "../../styles/brand";
import * as Animatable from "react-native-animatable";
import TextInput from "../common/form/TextInput";
import Heading from "../common/Heading";
import Button from "../common/Button";
import getExchangeRate from "../../helpers/getExchangeRate";

const { width } = Dimensions.get("window");

class CreateInvoice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fiatValue: "",
			label: "",
			description: "",
			rate: 0,
			symbol: ""
		};
	}

	componentDidMount() {
		getExchangeRate(
			({ value, symbol }) => {
				this.setState({
					rate: value,
					symbol
				});
			},
			errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		);
	}

	createInvoice() {
		let { fiatValue, label, description, rate, symbol } = this.state;
		if (!fiatValue) {
			return Alert.alert("Whoops", "Provide invoice value.");
		}

		if (!label) {
			return Alert.alert("Whoops", "Provide a label.");
		}

		const cryptoValue = (parseFloat(fiatValue) / rate).toFixed(8);

		const msatoshi = cryptoValue / 0.00000000001;

		const params = { msatoshi, label, description };

		this.setState({ isCreating: true });

		alert(JSON.stringify(params));
	}

	renderCryptoValue() {
		let { fiatValue, isCreating, rate, symbol } = this.state;

		if (!rate) {
			return null;
		}

		fiatValue = fiatValue ? fiatValue : 0;

		const cryptoValue = parseFloat(fiatValue) / rate;
		const satoshis = (cryptoValue / 0.00000001).toFixed(0);

		return (
			<Animatable.View
				animation="fadeIn"
				duration={250}
				style={{ marginTop: spaces.marginTop }}
			>
				<Heading type={"h2"}>{satoshis} satoshis</Heading>
				<Heading type={"h4"}>
					1 BTC = {parseFloat(rate).toFixed(2)} {symbol}
				</Heading>
				<View style={{ marginTop: spaces.marginTop }} />
				{fiatValue !== 0 ? (
					<Button
						showAnimated
						disabled={isCreating}
						title={isCreating ? "Loading..." : "Create"}
						type={"info"}
						onPress={this.createInvoice.bind(this)}
					/>
				) : null}
			</Animatable.View>
		);
	}

	render() {
		const { navigation } = this.props;
		const { fiatValue, label, description, symbol } = this.state;

		return (
			<Container keyboardScroll>
				<View style={{ flex: 1 }}>
					<View style={{ marginTop: spaces.marginTop }}>
						<TextInput
							autoFocus
							type="large"
							label={`Value (${symbol})`}
							keyboardType={"decimal-pad"}
							text={fiatValue}
							onChangeText={fiatValue => this.setState({ fiatValue })}
						/>
					</View>
					<View style={{ marginTop: spaces.marginTop }}>
						<TextInput
							type="large"
							label={"Label"}
							text={label}
							onChangeText={label => this.setState({ label })}
						/>
					</View>
					<View style={{ marginTop: spaces.marginTop }}>
						<TextInput
							type="large"
							label={"Description (Optional)"}
							text={description}
							onChangeText={description => this.setState({ description })}
						/>
					</View>
					{this.renderCryptoValue()}
				</View>
			</Container>
		);
	}
}

CreateInvoice.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Create invoice"
	};
};

export default CreateInvoice;
