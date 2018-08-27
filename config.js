'use strict';

module.exports.PORT = process.env.PORT || 8080;
module.exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blogging-api';
module.exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/bloggingapi-testing';