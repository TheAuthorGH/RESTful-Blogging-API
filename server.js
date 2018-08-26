'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {PORT, DATABASE_URL} = require('./config');

// Persistence
mongoose.Promise = global.Promise;

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

function startServer(dbUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(dbUrl, err => {
			if(err)
				return reject(err);
			server = app
				.listen(port, () => { 
					console.log('Blogging API listening on port ' + port); 
					resolve(server);
				})
				.on('error', err => {
					console.log(err);
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function stopServer() {
	return new Promise((resolve, reject) => {
		server.close(err => {
			if(err)
				reject(err);
			else {
				resolve();
				mongoose.disconnect();
			}
		});
	});
}

if(require.main === module)
	startServer(DATABASE_URL).catch(e => console.log(err));

module.exports = {app, startServer, stopServer};