'use strict';

const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();

const BlogPosts = require('./model').BlogPosts;

// Util

function handleError(e, res) {
	console.log(e);
	res.status(500).send('Internal server error');
}

function objHasFields(obj, fields) {
	if(!obj || !fields)
		return false;
	for(let f of fields) {
		if(obj[f] === undefined)
			return false;
	}
	return true;
}

// Functions

router.get('/', (req, res) => {
	BlogPosts.find()
		.then(posts => {
			res.json({
				blogPosts: posts.map(p => p.serialize())
			});
		})
		.catch(e => handleError(e, res));
});

router.get('/:id', (req, res) => {
	BlogPosts.findById(req.params.id)
		.then(post => {
			if(post)
				res.json(post.serialize());
			else
				res.status(404).send('Post not found.');
		})
		.catch(e => handleError(e, res));
});

router.post('/', jsonParser, (req, res) => {
	if(!objHasFields(req.body, ['title', 'author', 'content']) 
		|| !objHasFields(req.body.author, ['firstName', 'lastName']))
		res.status(400).send('invalid post data.');
	else
		BlogPosts.create(req.body)
			.then(p => res.status(201).json(p.serialize()));
});

router.put('/:id', jsonParser, (req, res) => {
	if(!req.body.id || req.params.id != req.body.id)
		res.status(400).send('invalid id information!');
	const updatable = ['title', 'author', 'content'];
	let toUpdate = {};
	for(let i of Object.keys(req.body))
		if(updatable.includes(i))
			toUpdate[i] = req.body[i];
	BlogPosts.findByIdAndUpdate(req.body.id, {$set: toUpdate})
		.then(p => res.status(200).json(p))
		.catch(e => handleError(e, res));
})

router.delete('/:id', (req, res) => {
	BlogPosts.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(e => handleError(e, res));
});

module.exports = router;