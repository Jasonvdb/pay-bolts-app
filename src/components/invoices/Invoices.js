import React, { Component } from "react";
import { Text, View, Platform } from "react-native";
import Meteor, { createContainer } from "react-native-meteor";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";

class ViewInvoices extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	componentDidMount() {
		console.log("Invoices mounted");
	}

	render() {
		const { invoices, navigation } = this.props;
		// console.log(invoices);
		// if (invoices && invoices.length > 0) {
		// 	return (
		// 		<Container scrollView>
		// 			{Platform.OS === "android" ? (
		// 				<View style={{ marginTop: spaces.marginTop }} />
		// 			) : null}
		// 			{/* <Text>Invoices</Text> */}
		// 		</Container>
		// 	);
		// }

		return (
			<Container>
				<Heading type={"h1"}>No invoices yet</Heading>
			</Container>
		);
	}
}

const ViewInvoicesContainer = createContainer(({ navigation }) => {
	// Meteor.subscribe("invoices");
	// Meteor.subscribe("crypto.details");

	// const invoices =
	// 	Meteor.collection("invoices").find({}, { sort: { addedAt: -1 } }) || [];
	return {
		//invoices
	};
}, ViewInvoices);

ViewInvoicesContainer.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Invoices"
	};
};

export default ViewInvoicesContainer;
