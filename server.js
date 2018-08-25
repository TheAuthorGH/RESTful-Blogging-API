const express = require('express');
const app = express();

// Manage initial posts
const BlogPosts = require('./model').BlogPosts;
BlogPosts.create('model book', 'fiction', 'TheAuthor', '8/23/2018');
BlogPosts.create('other model book', 'nonfiction', 'TheAuthor', '8/23/2018');

// Logging
app.use(require('morgan')('common'));
app.use(function(err, req, res, next) {
	console.error(err);
	return res.status(500).json({error: 'An error occurred.'});
});

// Public
app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

// Main Router
const bloggingRouter = require('./bloggingRouter');
app.use('/blog-posts', bloggingRouter);

let server;

function startServer() {
	return new Promise((resolve, reject) => {
		const port = process.env.PORT || 8080;
		server = app
			.listen(port, () => { 
				console.log('Blogging API listening on port ' + port); 
				resolve(server);
			})
			.on('error', err => {
				console.log(err);
				reject(err);
			});
	});
}

function stopServer() {
	return new Promise((resolve, reject) => {
		server.close(err => {
			if(err)
				reject(err);
			else
				resolve();
		});
	});
}

if(require.main === module)
	startServer().catch(e => console.log(err));

module.exports = {app, startServer, stopServer};