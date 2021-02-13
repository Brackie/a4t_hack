function ShowOddQ(text){
	if ((text.match('/Q/g').length )% 2 !== 0) {
		console.log("The string has odd number of Qs");
		return;
	}
	console.log("The string has even number of Qs");
}