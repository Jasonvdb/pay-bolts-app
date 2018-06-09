import React, { Component } from "react";
import { Text, View, Alert } from "react-native";
import axios from "axios";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";
import PeerCard from "./PeerCard";
import LargeIcon from "../common/LargeIcon";
import settings from "../../helpers/settings";

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
		const { apiBaseUrl } = settings;
		axios
			.get(`${apiBaseUrl}listpeers`)
			.then(response => {
				const { data } = response;
				this.setState({ peers: data.peers });
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

	render() {
		const { peers, showChannelIds } = this.state;

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

Channels.navigationOptions = ({ navigation }) => {
	return {
		headerTitle: "Channels"
	};
};

export default Channels;
