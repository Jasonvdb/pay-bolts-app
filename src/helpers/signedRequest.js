import axios from "axios";

import { getCacheCallback } from "./localcache";

const executeRequest = ({
	method,
	params = {},
	apiUrl,
	apiKey,
	secret,
	onSuccess,
	onError
}) => {
	//TODO sign the URL with the secret and place that hash in the header
	axios
		.get(`${apiUrl}api/${method}`, {
			params: { ...params, apiKey }
		})
		.then(response => {
			const { data } = response;
			onSuccess(data);
		})
		.catch(errorResult => {
			const { response } = errorResult;
			if (response.data && response.data.error && response.data.error.message) {
				onError(response.data.error.message);
			} else {
				onError("An API error occured");
			}
		});
};

export default values => {
	const { apiUrl, apiKey, secret, onError } = values;

	//If we're getting these values don't look for them in storage
	if (apiUrl && apiKey && secret) {
		executeRequest({ ...values, apiUrl, apiKey, secret });
	} else {
		getCacheCallback(
			"apiUrl",
			apiUrl => {
				getCacheCallback(
					"apiKey",
					apiKey => {
						getCacheCallback(
							"secret",
							secret => {
								executeRequest({ ...values, apiUrl, apiKey, secret });
							},
							() => onError("Failed to get secret from storage")
						);
					},
					() => onError("Failed to get API Key from storage")
				);
			},
			() => onError("Failed to get API URL from storage")
		);
	}
};
