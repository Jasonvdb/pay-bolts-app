import React from "react";
import { SafeAreaView, ScrollView, View, ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FloatingButton from "./FloatingButton";

import { colors } from "../../styles/brand";

const { brandBackground1, brandLight } = colors;

const backgroundSource = require("../../../images/background.png");

const Background = props => (
	<ImageBackground source={backgroundSource} {...props} />
);

const Container = ({
	children,
	image,
	scrollView,
	keyboardScroll,
	noSafeArea,
	actions,
	actionIcon,
	leftActions,
	leftActionIcon
}) => {
	const style = {
		backgroundColor: image ? brandBackground1 : brandLight,
		flexDirection: "column",
		justifyContent: "space-around",
		flex: 1
	};
	let newChildren;
	if (image) {
		newChildren = <Background style={style}>{children}</Background>;
	} else {
		newChildren = children;
	}

	const actionElement = (
		<View>
			{leftActions ? (
				<FloatingButton
					position="left"
					actions={leftActions}
					actionIcon={leftActionIcon}
				/>
			) : null}
			{actions ? (
				<FloatingButton actions={actions} actionIcon={actionIcon} />
			) : null}
		</View>
	);

	if (keyboardScroll) {
		return (
			<KeyboardAwareScrollView
				justifyContent="flex-start"
				style={{
					backgroundColor: image ? brandBackground1 : brandLight
				}}
				contentContainerStyle={style}
			>
				{newChildren}
				{actionElement}
			</KeyboardAwareScrollView>
		);
	}

	if (scrollView) {
		return (
			<View style={style}>
				<ScrollView>{newChildren}</ScrollView>
				{actionElement}
			</View>
		);
	}

	if (noSafeArea) {
		return (
			<View style={style}>
				{newChildren} {actionElement}
			</View>
		);
	}

	return (
		<SafeAreaView style={style}>
			{newChildren} {actionElement}
		</SafeAreaView>
	);
};

export default Container;
