const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

const {app, startServer, stopServer} = require('../server');

const modelPost = {
	title: 'foobar',
	content: 'nonfiction',
	author: 'anonymous',
	publishDate: '8/24/2018'
}

describe('BlogPost API', function() {
	before(startServer);
	after(stopServer);

	it('should return blog posts on GET', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
			});
	});

	it('should create new blog post on POST', function() {
		return chai
			.request(app)
			.post('/blog-posts')
			.send(Object.create(modelPost))
			.then(function(res) {
				expect(res).to.have.status(201);
			})
	});

	it('should delete blog post on DELETE', function() {
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai
					.request(app)
					.delete('/blog-posts/' + res.body[0].id)
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});

	it('should update blog post on PUT', function() {
		const post = Object.create(modelPost);
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res) {
				post.id = res.body[0].id;
				return chai
					.request(app)
					.put('/blog-posts/' + post.id)
					.send(post);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
			});
	});
});