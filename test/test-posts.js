'use strict';

const mongoose = require('mongoose');
const faker = require('faker');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;

const {Posts} = require('../model-posts');
const {Authors} = require('../model-authors');
const {app, startServer, stopServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

function fakeAuthor() {
	return {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		userName: faker.internet.userName()
	};
}

function fakePost(authorId) {
	return {
		title: faker.lorem.words(),
		content: faker.lorem.paragraph(),
		author: authorId,
		comments: []
	};
}

function populateDb() {
	return Authors.create(fakeAuthor())
		.then(author => {
			const data = [];
			for(let i = 0; i < 10; i++)
				data.push(fakePost(author._id));
			return data;
		})
		.then(data => {
			return Posts.insertMany(data);
		});
}

function dropDb() {
	return mongoose.connection.dropDatabase();
}

describe('blog post API', function() {

	before(function() {
		return startServer(TEST_DATABASE_URL);
	});
	beforeEach(function() { 
		return populateDb();
	});
	afterEach(function() { 
		return dropDb();
	});
	after(function() {
		return stopServer();
	});

	describe('GET endpoint', function() {

		it('should return all posts when no id is provided', function() {
			let res;
			return chai.request(app)
				.get('/posts')
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.have.keys(['posts']);
					for(let p of res.body.posts)
						expect(p).to.have.keys(['id', 'title', 'content', 'author', 'created']);
					return Posts.countDocuments();
				})
				.then(function(count) { 
					expect(res.body.posts).to.have.lengthOf(count);
				});
		});

		it('should return a single post when an id is provided', function() {
			let post;
			return Posts.findOne()
				.then(function(_post) {
					post = _post;
					return chai.request(app)
						.get('/posts/' + post._id);
				})
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res.body).to.have.keys(['id', 'title', 'content', 'author', 'created', 'comments']);
					expect(res.body.id).to.equal(post._id.toString());
					expect(res.body.title).to.equal(post.title);
					expect(res.body.content).to.equal(post.content);
				});
		});

	});

	describe('POST endpoint', function() {
		
		it('should create a new post', function() {
			let post;
			return Authors.findOne()
				.then(function(author) {
					post = fakePost(author._id);
					post.author_id = post.author;
					delete post.author;
					return chai.request(app)
						.post('/posts')
						.send(post);
				})
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res.body.title).to.equal(post.title);
					expect(res.body.content).to.equal(post.content);
				});
		});

	});

	describe('PUT endpoint', function() {
		const toUpdate = {
			title: faker.lorem.words(),
			content: faker.lorem.paragraph()
		};
		it('should update the fields of the post with the provided id', function() {
			return Posts.findOne()
				.then(function(post) {
					toUpdate.id = post._id;
					return chai.request(app)
						.put('/posts/' + post._id)
						.send(toUpdate)
				})
				.then(function(res) {
					expect(res).to.have.status(200);
					return Posts.findById(toUpdate.id);
				})
				.then(function(post) {
					expect(post.title).to.equal(toUpdate.title);
					expect(post.content).to.equal(toUpdate.content);
				});
		});

	});

	describe('DELETE endpoint', function() {

		it('should delete the post with the provided id', function() {
			let post;
			return Posts.findOne()
				.then(function(_post) {
					post = _post;
					return chai.request(app)
						.delete('/posts/' + post.id);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return Posts.findById(post._id);
				})
				.then(function(_post) {
					expect(_post).to.be.null;
				});
		});

	});

});