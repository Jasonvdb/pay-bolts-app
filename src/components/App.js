import React, { Component } from "react";

import Onboarding from "./routes/Onboarding";
import AuthedTab from "./routes/AuthedTab";
import LoadingScreen from "./common/LoadingScreen";
import { setCache, getCache } from "../helpers/localcache";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSetup: null
		};
	}

	componentDidMount() {
		this.loadFromCache();
		this.cacheInterval = setInterval(() => {
			this.loadFromCache();
		}, 2000);
	}

	stopInterval() {
		if (this.cacheInterval) {
			clearInterval(this.cacheInterval);
		}
	}

	async loadFromCache() {
		const apiUrl = await getCache("apiUrl");
		const apiKey = await getCache("apiKey");
		const secret = await getCache("secret");

		if (apiUrl && apiKey && secret) {
			this.setState({ isSetup: true });
			this.stopInterval();
		} else {
			this.setState({ isSetup: false });
		}
	}

	render() {
		const { isSetup } = this.state;

		if (isSetup === true) {
			return <AuthedTab />;
		} else if (isSetup === false) {
			return <Onboarding />;
		}

		return <LoadingScreen />;
	}
}

export default App;
