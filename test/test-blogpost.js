'use strict';

const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

const {app, startServer, stopServer} = require('../server');

const modelPost = {
	title: 'foobar',
	content: 'nonfiction',
	author: {
		firstName: "Sally",
		lastName: "Student"
	}
}

describe('BlogPost API', function() {
	// must remake tests!
});