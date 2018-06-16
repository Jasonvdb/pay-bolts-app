import { AsyncStorage } from "react-native";

//Cache data locally for quicker response
export const setCache = async (key, dataObj, onError) => {
	const dataString = JSON.stringify(dataObj);
	try {
		await AsyncStorage.setItem(key, dataString);
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
		return data;
	} catch (error) {
		if (onError) {
			onError(error);
		}
		console.log(error);
	}
};

export const removeCache = async (key, onError) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (error) {
		if (onError) {
			onError(error);
		}
		console.log(error);
	}
};

export const getCacheCallback = async (key, onSuccess, onError) => {
	try {
		const dataString = await AsyncStorage.getItem(key);
		if (!dataString) {
			return onError("Missing value");
		}

		const data = JSON.parse(dataString);
		onSuccess(data);
	} catch (error) {
		if (onError) {
			onError(error);
		}
		console.log(error);
	}
};
