import React, { Component } from "react";
import {
	Text,
	View,
	Platform,
	Alert,
	ListView,
	RefreshControl
} from "react-native";

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
			paymentsDataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			paymentCount: null,
			currentExchangeRate: null,
			currentFiatSymbol: null,
			showFiatValueIds: {},
			isRefreshing: false
		};
	}

	componentDidMount() {
		this.startInterval();
	}

	componentWillUnmount() {
		this.stopInterval();
	}

	startInterval() {
		this.fetchPayments();
		this.interval = setInterval(() => {
			this.fetchPayments();
		}, 15000);

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

	stopInterval() {
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

				const { paymentsDataSource } = this.state;

				this.setState({
					paymentsDataSource: paymentsDataSource.cloneWithRows(payments),
					paymentCount: payments.length,
					isRefreshing: false
				});
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	onRefresh() {
		this.setState({ isRefreshing: true }, () => {
			this.stopInterval();
			this.startInterval();
		});
	}

	renderList() {
		const {
			paymentsDataSource,
			showFiatValueIds,
			currentExchangeRate,
			currentFiatSymbol,
			isRefreshing
		} = this.state;

		return (
			<ListView
				enabled
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={this.onRefresh.bind(this)}
					/>
				}
				dataSource={paymentsDataSource}
				renderRow={payment => (
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
				)}
			/>
		);
	}

	render() {
		const { paymentCount } = this.state;

		return (
			<Container>
				{!paymentCount === null ? (
					<LargeIcon type="pending">Loading payments...</LargeIcon>
				) : paymentCount === 0 ? (
					<Heading type={"h1"}>No payments yet</Heading>
				) : (
					this.renderList()
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
