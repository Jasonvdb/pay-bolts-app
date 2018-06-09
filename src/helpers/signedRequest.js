import axios from "axios";

import { getCacheCallback } from "./localcache";

export default ({ method, params = {}, onSuccess, onError }) => {
	getCacheCallback(
		"apiUrl",
		apiUrl => {
			axios
				.get(`${apiUrl}api/${method}`, {
					params
				})
				.then(response => {
					const { data } = response;
					onSuccess(data);
				})
				.catch(errorResult => {
					const { response } = errorResult;
					if (
						response.data &&
						response.data.error &&
						response.data.error.message
					) {
						onError(response.data.error.message);
					} else {
						onError("An API error occured");
					}
				});
		},
		() => onError("Failed to get API URL from storage")
	);
};
