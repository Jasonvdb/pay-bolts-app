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

		this.state = { peers: null, showChannelIds: {}, connectingToNode: false };
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

	splitPeerData(data, onError) {
		if (data.indexOf("@") > 0) {
			const splitData = data.split("@");
			const nodeId = splitData[0];
			const url = splitData[1];

			if (url.indexOf(":") > -1) {
				const urlSplit = url.split(":");
				const ipAddress = urlSplit[0];
				const port = urlSplit[1];

				return { nodeId, ipAddress, port };
			} else {
				onError("Invalid peer data");
				return false;
			}
		} else {
			onError("Invalid peer data");
			return false;
		}
	}

	fundChannel(nodeId) {
		const satoshis = 1000000;

		console.log("Funding....");

		signedRequest({
			params: { nodeId, satoshis },
			method: "fundchannel",
			onSuccess: data => {
				console.log("DATA: ", data);
				this.fetchPeers();
			},
			onError: errorMessage => {
				Alert.alert("Whoops", errorMessage);
			}
		});
	}

	onRead(data) {
		this.props.navigation.pop();
		const params = this.splitPeerData(data, errorMessage =>
			Alert.alert("Whoops", errorMessage)
		);

		if (params) {
			console.log("Finding: ", params);

			this.setState({ connectingToNode: true });
			signedRequest({
				params,
				method: "connect",
				onSuccess: data => {
					this.setState({ connectingToNode: false });

					const { result } = data;
					const nodeId = result.id;
					Alert.alert(
						"Peer found",
						"Would you like to open and fund a channel?",
						[
							{
								text: "Yes, fund",
								onPress: () => this.fundChannel(nodeId)
							},
							{
								text: "Cancel",
								style: "cancel"
							}
						],
						{ cancelable: false }
					);
				},
				onError: errorMessage => {
					this.setState({ connectingToNode: false });

					Alert.alert("Whoops", errorMessage);
				}
			});
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
		const { peers, showChannelIds, connectingToNode } = this.state;
		const { navigation } = this.props;

		if (connectingToNode) {
			return (
				<Container>
					<LargeIcon type="pending">Locating node...</LargeIcon>
				</Container>
			);
		}

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
								this.setState({
									showChannelIds
								});
							}}
							showChannels={showChannelIds[peer.id] === true}
						/>
					))
				)}
				<View style={{ marginBottom: 90 }} />
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
