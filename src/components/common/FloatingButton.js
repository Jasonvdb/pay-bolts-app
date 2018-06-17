import React from "react";
import PropTypes from "prop-types";
import { FloatingAction } from "react-native-floating-action";
import Icon from "react-native-vector-icons/Ionicons";

import { colors, spaces } from "../../styles/brand";

const { paddingFAB } = spaces;
const { brandInfo, brandGrey3 } = colors;

const icons = {
	scan: (
		<Icon
			style={{ marginTop: 3 }}
			name={"ios-qr-scanner"}
			size={30}
			color={colors.brandLight}
		/>
	),
	list: <Icon name={"ios-arrow-back"} size={30} color={colors.brandLight} />,
	arrows: <Icon name={"ios-arrow-back"} size={30} color={colors.brandLight} />,
	edit: (
		<Icon name={"ios-create-outline"} size={30} color={colors.brandLight} />
	),

	//ios-download-outline
	invoice: (
		<Icon
			name={"ios-arrow-dropdown-outline"}
			size={30}
			color={colors.brandLight}
		/>
	)
};

const FloatingButton = ({ actions, actionIcon, position }) => {
	const color = brandInfo;

	let floatingActions = [];
	let index = 1;

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
				index,
				textColor: brandGrey3
			});
			index++;
		});
	}

	return (
		<FloatingAction
			position={position || "right"}
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
	type: PropTypes.oneOf(["primary", "secondary", "default"]),
	actions: PropTypes.object.isRequired,
	actionIcon: PropTypes.string,
	position: PropTypes.string
};

export default FloatingButton;
