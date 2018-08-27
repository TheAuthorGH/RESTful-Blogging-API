const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	userName: {type: String, required: true, lowercase: true, unique: true}
});

authorSchema.methods.serialize = function() {
	return {
		id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		userName: this.userName
	};
};

const Authors = mongoose.model('Author', authorSchema);

module.exports = {Authors};