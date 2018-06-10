export default (satoshis, satoshisDecimal = null) => {
	let btcValue = satoshis / 100000000;

	//Milli satoshis?
	if (satoshisDecimal === "m") {
		return btcValue / 100;
	}

	return btcValue;
};
