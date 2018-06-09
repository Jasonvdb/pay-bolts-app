import React from "react";
import PropTypes from "prop-types";
import { FloatingAction } from "react-native-floating-action";
import Icon from "react-native-vector-icons/Ionicons";

import { colors, spaces } from "../../styles/brand";

const { paddingFAB } = spaces;
const { brandInfo, brandGrey3 } = colors;

const icons = {
	scan: <Icon name={"ios-qr-scanner"} size={30} color={colors.brandLight} />,
	list: <Icon name={"ios-arrow-back"} size={30} color={colors.brandLight} />,
	arrows: <Icon name={"ios-arrow-back"} size={30} color={colors.brandLight} />
};

const FloatingButton = ({ actions, actionIcon }) => {
	const color = brandInfo;

	let floatingActions = [];
	let position = 1;

	let mainIcon = actionIcon ? icons[actionIcon] : icons.list;

	//If there is only one action passed through, use that as the onPressMain
	let onPressMain;
	if (Object.keys(actions).length === 1) {
		const { callback, label, icon } = actions[Object.keys(actions)[0]];
		onPressMain = callback;
		mainIcon = icons[icon];
	} else {
		Object.keys(actions).forEach(key => {
			const { label, icon } = actions[key];
			floatingActions.push({
				color,
				text: label,
				icon: icons[icon] || icons.arrows,
				name: key,
				position,
				textColor: brandGrey3
			});
			position++;
		});
	}

	return (
		<FloatingAction
			onPressMain={onPressMain}
			showBackground={!onPressMain}
			distanceToEdge={paddingFAB}
			color={brandInfo}
			floatingIcon={mainIcon}
			actions={floatingActions}
			onPressItem={key => {
				const { callback } = actions[key];
				if (callback) {
					callback();
				}
			}}
		/>
	);
};

FloatingButton.propTypes = {
	type: PropTypes.oneOf(["primary", "secondary", "default"])
};

export default FloatingButton;
