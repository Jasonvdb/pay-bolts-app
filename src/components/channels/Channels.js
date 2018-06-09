import React, { Component } from "react";
import { Text, View, Platform } from "react-native";
import Meteor, { createContainer } from "react-native-meteor";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";
import PeerCard from "./PeerCard";
import LargeIcon from "../common/LargeIcon";

class Channels extends Component {
	constructor(props) {
		super(props);

		this.state = { peers: null, showChannelIds: {} };
	}
	componentDidMount() {
		console.log("Channels mounted");

		this.loadPeers();
		this.peersInterval = setInterval(() => {
			this.loadPeers();
		}, 10000);
	}

	componentWillUnmount() {
		if (this.peersInterval) {
			clearInterval(this.peersInterval);
		}
	}

	loadPeers() {
		Meteor.call("testnet.peers", {}, (err, peers) => {
			if (!err) {
				if (peers) {
					this.setState({ peers });
				}
			} else {
				this.setState({ errors: err.reason, peers: null });
			}
		});
	}

	render() {
		const { peers, showChannelIds } = this.state;

		console.log(peers);

		const actions = {
			scan: {
				label: "Scan QR",
				callback: () => {
					// navigation.push("ScanInvoice", {
					// 	onRead: res => this.onRead(res.data)
					// });
				},
				icon: "scan"
			}
			// manual: {
			// 	label: "Manually enter",
			// 	callback: () => {
			// 		// navigation.push("ScanInvoice", {
			// 		// 	onRead: res => this.onRead(res.data)
			// 		// });
			// 	},
			// 	icon: "edit"
			// }
		};

		return (
			<Container
				actions={actions}
				actionIcon={"add"}
				scrollView={peers !== null}
			>
				{peers === null ? (
					<LargeIcon type="pending">Loading peers...</LargeIcon>
				) : peers.length === 0 ? (
					<Heading type={"h1"}>No channels yet</Heading>
				) : (
					peers.map(peer => (
						<PeerCard
							key={peer.id}
							{...peer}
							onPress={() => {
								showChannelIds[peer.id] = !showChannelIds[peer.id];
								console.log(showChannelIds);
								this.setState({
									showChannelIds
								});
							}}
							showChannels={showChannelIds[peer.id] === true}
						/>
					))
				)}
			</Container>
		);
	}
}

const ViewChannelsContainer = createContainer(({ navigation }) => {
	//TODO load channels into DB maybe
	// Meteor.subscribe("invoices");
	// Meteor.subscribe("crypto.details");

	// const invoices =
	// 	Meteor.collection("invoices").find({}, { sort: { addedAt: -1 } }) || [];
	// console.log(invoices);
	return {
		//invoices
	};
}, Channels);

ViewChannelsContainer.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Channels"
	};
};

export default ViewChannelsContainer;
