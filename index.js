import { AppRegistry } from "react-native";
import App from "./src/components/App";

import "./shim.js";

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
	"Warning: isMounted(...) is deprecated",
	"Module RCTImageLoader",
	"Module RNRandomBytes requires main queue setup since it overrides `constantsToExport` but doesn't implement `requiresMainQueueSetup`."
]);

AppRegistry.registerComponent("PayBoltsApp", () => App);
