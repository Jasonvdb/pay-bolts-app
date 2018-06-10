import React, { Component } from "react";
import { Text, View, Platform, Alert } from "react-native";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";
import signedRequest from "../../helpers/signedRequest";
import LargeIcon from "../common/LargeIcon";
import PaymentCard from "./PaymentCard";
import getExchangeRate from "../../helpers/getExchangeRate";

class Transactions extends Component {
	constructor(props) {
		super(props);

		this.state = {
			payments: null,
			currentExchangeRate: null,
			currentFiatSymbol: null,
			showFiatValueIds: {}
		};
	}

	componentDidMount() {
		this.fetchPayments();
		this.interval = setInterval(() => {
			this.fetchPayments();
		}, 10000);

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
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	fetchPayments() {
		signedRequest({
			method: "listpayments",
			onSuccess: data => {
				const { payments } = data;
				payments.reverse();
				this.setState({ payments });
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	render() {
		const {
			payments,
			showFiatValueIds,
			currentExchangeRate,
			currentFiatSymbol
		} = this.state;

		return (
			<Container scrollView={payments !== null}>
				{payments === null ? (
					<LargeIcon type="pending">Loading payments...</LargeIcon>
				) : payments.length === 0 ? (
					<Heading type={"h1"}>No payments yet</Heading>
				) : (
					payments.map(payment => (
						<PaymentCard
							key={payment.id}
							{...payment}
							onPress={() => {
								showFiatValueIds[payment.id] = !showFiatValueIds[payment.id];

								this.setState({
									showFiatValueIds
								});
							}}
							currentExchangeRate={currentExchangeRate}
							currentFiatSymbol={currentFiatSymbol}
							showFiatValue={showFiatValueIds[payment.id] === true}
						/>
					))
				)}
			</Container>
		);
	}
}

Transactions.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Transactions"
	};
};

export default Transactions;
