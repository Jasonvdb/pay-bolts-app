import React, { Component } from "react";
import { View, Alert, ListView, RefreshControl } from "react-native";

import Container from "../common/Container";
import Heading from "../common/Heading";
import { spaces } from "../../styles/brand";
import PeerCard from "./PeerCard";
import LargeIcon from "../common/LargeIcon";
import signedRequest from "../../helpers/signedRequest";

class Channels extends Component {
	constructor(props) {
		super(props);

		this.state = {
			peersDataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2
			}),
			peerCount: null,
			showChannelIds: {},
			connectingToNode: false,
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
		this.fetchPeers();
		this.peersInterval = setInterval(() => {
			this.fetchPeers();
		}, 20000);
	}

	stopInterval() {
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
				const { peersDataSource } = this.state;
				const { peers } = data;

				this.setState({
					peersDataSource: peersDataSource.cloneWithRows(peers || []),
					peerCount: peers.length,
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

	renderPeers() {
		const { isRefreshing, peersDataSource, showChannelIds } = this.state;

		return (
			<ListView
				enabled
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={this.onRefresh.bind(this)}
					/>
				}
				dataSource={peersDataSource}
				renderRow={peer => (
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
				)}
			/>
		);
	}

	render() {
		const { peerCount, connectingToNode } = this.state;
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
			<Container actions={actions} actionIcon={"add"}>
				{peerCount === null ? (
					<LargeIcon type="pending">Loading peers...</LargeIcon>
				) : peerCount.length === 0 ? (
					<Heading type={"h1"}>No channels yet</Heading>
				) : (
					this.renderPeers()
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
