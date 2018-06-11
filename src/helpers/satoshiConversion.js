export default (satoshis, satoshisDecimal = null) => {
	//Milli satoshis?
	if (satoshisDecimal === "m") {
		return satoshis * 0.00000000001;
	} else {
		return satoshis * 0.00000001;
	}
};
