function handleError(e, res) {
	console.log(e);
	res.status(500).send('Internal server error');
}

function objHasFields(obj, fields) {
	if(!obj || !fields)
		return false;
	for(let f of fields) {
		if(obj[f] === undefined)
			return false;
	}
	return true;
}

module.exports = {handleError, objHasFields};