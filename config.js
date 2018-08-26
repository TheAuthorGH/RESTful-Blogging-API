'use strict';

module.exports.PORT = process.env.PORT || 8080;
module.exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blogapi-db';
module.exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/blogapi-db-testing';