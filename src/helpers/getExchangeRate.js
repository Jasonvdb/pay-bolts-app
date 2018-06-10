import axios from "axios";

import { getCacheCallback, setCache } from "./localcache";

export default (onSuccess, onError) => {
	//TODO get from settings
	const fiatSymbol = "USD";
	const coin = "BTC";

	//Get from storage first
	getCacheCallback(
		"exchangeRate",
		exchangeRate => {
			onSuccess(exchangeRate);
		},
		() => {}
	);

	axios
		.get(`https://min-api.cryptocompare.com/data/price`, {
			params: { fsym: coin, tsyms: fiatSymbol }
		})
		.then(response => {
			const { data } = response;
			const exchangeRate = {
				value: data[fiatSymbol],
				symbol: fiatSymbol
			};

			setCache("exchangeRate", exchangeRate);
			onSuccess(exchangeRate);
		})
		.catch(errorResult => {
			const { response } = errorResult;
			if (response.data && response.data.error && response.data.error.message) {
				onError(response.data.error.message);
			} else {
				onError("Failed fetching latest exchange rate");
			}
		});
};
