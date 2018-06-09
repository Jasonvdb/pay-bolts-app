export default (satoshis, symbol = "BTC") => {
	if (symbol === "BTC") {
		return satoshis * 0.00000001;
	}

	return "-";
};
