import axios from "axios";
import crypto from "crypto";

import { getCacheCallback } from "./localcache";

const createApiSignature = (message, secret) =>
	crypto
		.createHmac("sha256", secret)
		.update(message)
		.digest("hex");

const headers = (path, secret) => {
	return {
		"User-Agent": "Mozilla/4.0 (compatible; PayBoltsApp)",
		"Content-type": "application/x-www-form-urlencoded",
		apisign: createApiSignature(path, secret)
	};
};

const executeRequest = ({
	method,
	params = {},
	apiUrl,
	apiKey,
	secret,
	onSuccess,
	onError
}) => {
	let path = `/api/${method}?apiKey=${apiKey}`;

	//Append params to the uri var and don't pass them to axios so we can sign the whole path
	Object.keys(params).forEach(paramKey => {
		path += `&${paramKey}=${params[paramKey]}`;
	});

	const formattedUrl = apiUrl.replace(/\/$/, "");
	const uri = `${formattedUrl}${path}`;

	axios
		.get(uri, {
			headers: headers(path, secret)
		})
		.then(response => {
			const data = response.data || {};
			onSuccess(data);
		})
		.catch(errorResult => {
			const { response } = errorResult;
			if (response.data && response.data.error && response.data.error.message) {
				onError(response.data.error.message);
			} else {
				console.log(errorResult);
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
