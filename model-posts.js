'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
	content: {type: String, required: true}
});

const postSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
	comments: [commentSchema]
});

function populateAuthor(next) {
	this.populate('author');
	next();
}

postSchema.pre('findOne', populateAuthor);
postSchema.pre('find', populateAuthor);

postSchema.virtual('authorString').get(function() {
	return this.author.firstName + ' ' + this.author.lastName;
});

postSchema.methods.serialize = function(comments = false) {
	const post = {
		id: this._id,
		title: this.title,
		author: this.authorString,
		content: this.content,
		created: "1481322758429" // hardcoded, not a real value
	};
	if(comments)
		post.comments = this.comments;
	return post;
};

const Posts = mongoose.model('Post', postSchema);

module.exports = {Posts}