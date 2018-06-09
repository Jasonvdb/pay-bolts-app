import { AsyncStorage } from "react-native";

//Cache data locally for quicker response
export const setCache = async (key, dataObj, onError) => {
	const dataString = JSON.stringify(dataObj);
	try {
		await AsyncStorage.setItem(key, dataString);
		console.log(`SET ${key}`);
	} catch (error) {
		if (onError) {
			onError(onError);
		}
		console.log(error);
	}
};

export const getCache = async (key, onError) => {
	try {
		const dataString = await AsyncStorage.getItem(key);
		if (!dataString) {
			return undefined;
		}

		const data = JSON.parse(dataString);
		console.log(`GET ${key}`);
		return data;
	} catch (error) {
		if (onError) {
			onError(onError);
		}
		console.log(error);
	}
};
