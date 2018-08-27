'use strict';

const express = require('express');
const {objHasFields, handleError} = require('./util');

const router = express.Router();
const jsonParser = require('body-parser').json();

const {Authors} = require('./model-authors');
const {Posts} = require('./model-posts');

router.get('/', (req, res) => {
	Authors.find()
		.then(authors => res.json(authors.map(a => a.serialize())))
		.catch(e => handleError(e, res));
});

router.get('/:id', (req, res) => {
	Authors.findById(req.params.id)
		.then(author => {
			if(author)
				res.json(author.serialize());
			else
				res.status(404).send('Author not found.');
		})
		.catch(e => handleError(e, res));
});

router.post('/', jsonParser, (req, res) => {
	if(!objHasFields(req.body, ['firstName', 'lastName', 'userName']))
		res.status(400).send('invalid post data.');
	else
		Authors.countDocuments({userName: req.body.userName}, (err, count) => {
			if(err) {
				handleError(err);
				return;
			}
			if(count > 0) {
				res.status(400).send('username is already in use!');
				return;
			}
			Authors.create(req.body)
				.then(a => res.status(201).json(a.serialize()))
				.catch(e => handleError(e, res));
		});
});

router.put('/:id', jsonParser, (req, res) => {
	if(!req.body.id || req.params.id != req.body.id)
		res.status(400).send('invalid id information!');
	const updatable = ['firstName', 'lastName', 'userName'];
	let toUpdate = {};
	for(let i of Object.keys(req.body))
		if(updatable.includes(i))
			toUpdate[i] = req.body[i];
		
	Authors.countDocuments({userName: req.body.userName}, (err, count) => {
		if(err) {
			handleError(err);
			return;
		}
		if(count > 0) {
			res.status(400).send('username is already in use!');
			return;
		}
		Authors.findByIdAndUpdate(req.body.id, {$set: toUpdate})
			.then(a => res.status(200).json(a.serialize()))
			.catch(e => handleError(e, res));
	});
});

router.delete('/:id', (req, res) => {
	Authors.findByIdAndRemove(req.params.id)
		.then(() => Posts.deleteMany({author: req.params.id}))
		.then(() => res.status(204).end())
		.catch(e => handleError(e, res));
	;
});

module.exports = router;