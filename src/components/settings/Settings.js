import React, { Component } from "react";
import { View, Alert, AsyncStorage, Platform } from "react-native";
import Meteor, { createContainer } from "react-native-meteor";

import Container from "../common/Container";
import Button from "../common/Button";
import { spaces } from "../../styles/brand";
import TextInput from "../common/form/TextInput";
import RightButton from "../common/header/RightButton";
import { getCache } from "../../helpers/localcache";

class Profile extends Component {
	constructor(props) {
		super(props);

		//Set these strings to false first so we know to use the vars from the prop
		this.state = {
			firstName: false,
			lastName: false,
			email: false,
			cellNumber: false,
			isSubmitting: false,
			isLoggingOut: false
		};
	}

	async getCachedUser() {
		const cachedUser = await getCache("user");
		if (cachedUser) {
			this.setState({ cachedUser });
		}
	}

	componentDidMount() {
		this.getCachedUser();

		//Only allow editing if the have already gone through setup
		const { navigation } = this.props;

		navigation.setParams({
			onLogout: this.onLogout.bind(this)
		});
	}

	onLogout() {
		Alert.alert("Logout", "Are you sure?", [
			{
				text: "Logout",
				onPress: () => {
					this.setState({ isLoggingOut: true }, () => {
						AsyncStorage.removeItem("storedUserId", error => {
							if (error) {
								console.log("Failed to remove storedUserId");
								console.log(error);
							}
						});
						Meteor.logout();
					});
				}
			},
			{
				text: "Cancel",
				onPress: () => {},
				style: "cancel"
			}
		]);
	}

	//Use prop defaults first unless they have started editing a field, then use that
	getUserDetails() {
		let { firstName, lastName, email, cellNumber } = this.state;
		const user = this.props.user || this.state.cachedUser;

		if (user) {
			const { profile } = user;
			firstName = firstName === false ? profile.firstName : firstName;
			lastName = lastName === false ? profile.lastName : lastName;
			cellNumber = cellNumber === false ? profile.cellNumber : cellNumber;
			email = email === email ? user.emails[0].address : email;
			return { firstName, lastName, cellNumber, email };
		} else {
			return { firstName: "", lastName: "", cellNumber: "", email: "" };
		}
	}

	onSubmit() {
		const { firstName, lastName, cellNumber, email } = this.getUserDetails();

		this.setState({ isSubmitting: true });

		Meteor.call(
			"user.update",
			{
				firstName,
				lastName,
				cellNumber,
				email
			},
			(err, res) => {
				this.setState({
					isSubmitting: false
				});

				if (!err) {
					Alert.alert("Success", "Profile updated.");
				} else {
					console.log(err);

					Alert.alert("Whoops", err.reason);
				}
			}
		);
	}

	render() {
		const { isSubmitting, isLoggingOut } = this.state;

		const { firstName, lastName, cellNumber, email } = this.getUserDetails();

		return (
			<Container keyboardScroll>
				<View
					style={{
						marginTop: spaces.marginTop,
						flex: 1,
						flexDirection: "column",
						justifyContent: "space-between",
						marginBottom: spaces.marginBottom
					}}
				>
					<TextInput
						label="First name"
						text={firstName}
						onChangeText={firstName => this.setState({ firstName })}
					/>

					<TextInput
						label="Last name"
						text={lastName}
						onChangeText={lastName => this.setState({ lastName })}
					/>

					<TextInput
						keyboardType={"email-address"}
						label="Email address"
						text={email}
						onChangeText={email => this.setState({ email })}
					/>

					<TextInput
						keyboardType={"phone-pad"}
						label="Cellphone number"
						text={cellNumber || " "}
						onChangeText={cellNumber => this.setState({ cellNumber })}
					/>

					<Button
						disabled={isSubmitting}
						title={isSubmitting ? "Updating..." : "Update"}
						type="primary"
						onPress={() => this.onSubmit()}
					/>

					{Platform.OS === "android" ? (
						<Button
							size="small"
							title={"Logout"}
							type="default"
							onPress={this.onLogout.bind(this)}
						/>
					) : null}
				</View>
			</Container>
		);
	}
}

const ProfileContainer = createContainer(() => {
	return {
		user: Meteor.user()
	};
}, Profile);

ProfileContainer.navigationOptions = ({ navigation }) => {
	const { state } = navigation;
	const { params } = state;

	return Platform.select({
		ios: {
			headerTitle: "Profile",
			headerRight: (
				<RightButton type="logout" onPress={params ? params.onLogout : null} />
			)
		},
		android: {
			header: null
		}
	});
};

export default ProfileContainer;
