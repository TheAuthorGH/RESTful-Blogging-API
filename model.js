'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: String,
		lastName: String
	}
});

postSchema.virtual('authorString').get(function() {
	return this.author.firstName + ' ' + this.author.lastName;
});

postSchema.methods.serialize = function() {
	return {
		id: this._id,
		title: this.title,
		author: this.authorString,
		created: "0"
	};
};

const BlogPosts = mongoose.model('BlogPost', postSchema, 'blog-posts');

module.exports = {BlogPosts}