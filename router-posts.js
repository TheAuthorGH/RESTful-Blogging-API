'use strict';

const express = require('express');
const mongoose = require('mongoose');
const {objHasFields, handleError} = require('./util');

const router = express.Router();
const jsonParser = require('body-parser').json();

const {Posts} = require('./model-posts');
const {Authors} = require('./model-authors');

// Posts

router.get('/', (req, res) => {
	Posts.find()
		.then(posts => {
			res.json({
				posts: posts.map(p => p.serialize())
			});
		})
		.catch(e => handleError(e, res));
});

router.get('/:id', (req, res) => {
	Posts.findById(req.params.id)
		.then(post => {
			if(post)
				res.json(post.serialize(true));
			else
				res.status(404).send('Post not found.');
		})
		.catch(e => handleError(e, res));
});

router.post('/', jsonParser, (req, res) => {
	if(!objHasFields(req.body, ['title', 'content', 'author_id']))
		res.status(400).send('invalid post data.');
	else
		Authors.countDocuments({_id: req.body.author_id}, (err, count) => {
			if(err) {
				res.status(400).send('Invalid id.');
				return;
			}
			if(count < 1) {
				res.status(400).send('Author id not found.');
				return;
			}
			req.body.author = mongoose.Types.ObjectId(req.body.author_id);
			Posts.create(req.body)
				.then(p => res.status(201).json(p.serialize()))
				.catch(e => handleError(e, res));
		});
});

router.put('/:id', jsonParser, (req, res) => {
	if(!req.body.id || req.params.id != req.body.id) {
		res.status(400).send('invalid id information!');
		return;
	}
	const updatable = ['title', 'content'];
	let toUpdate = {};
	for(let i of Object.keys(req.body))
		if(updatable.includes(i))
			toUpdate[i] = req.body[i];
	Posts.findByIdAndUpdate(req.body.id, {$set: toUpdate})
		.then(p => res.status(200).json(p.serialize()))
		.catch(e => handleError(e, res));
});

router.delete('/:id', (req, res) => {
	Posts.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(e => handleError(e, res));
});

module.exports = router;