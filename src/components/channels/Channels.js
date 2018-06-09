import React, { Component } from "react";
import { Text, View, Alert } from "react-native";
import axios from "axios";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";
import PeerCard from "./PeerCard";
import LargeIcon from "../common/LargeIcon";
import signedRequest from "../../helpers/signedRequest";

class Channels extends Component {
	constructor(props) {
		super(props);

		this.state = { peers: null, showChannelIds: {} };
	}
	componentDidMount() {
		console.log("Channels mounted");

		this.fetchPeers();
		this.peersInterval = setInterval(() => {
			this.fetchPeers();
		}, 10000);
	}

	componentWillUnmount() {
		if (this.peersInterval) {
			clearInterval(this.peersInterval);
		}
	}

	fetchPeers() {
		signedRequest({
			method: "listpeers",
			onSuccess: data => {
				this.setState({ peers: data.peers });
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	render() {
		const { peers, showChannelIds } = this.state;
		const { navigation } = this.props;

		const actions = {
			scan: {
				label: "Scan QR",
				callback: () => {
					navigation.push("ScanPeer", {
						onRead: res => this.onRead(res.data),
						title: "Scan peer"
					});
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

Channels.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Channels"
	};
};

export default Channels;
