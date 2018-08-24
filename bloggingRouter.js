const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();

const BlogPosts = require('./model').BlogPosts;

function validateObj(obj, requiredFields) {
	if(!obj || !requiredFields)
		return false;
	for(let f of requiredFields) {
		if(obj[f] === undefined)
			return false;
	}
	return true;
}

router.get('/', (req, res) => {
	console.log('HERE!');
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const post = req.body;
	if(validateObj(post, ['title', 'content', 'author', 'publishDate']))
		res.status(201).json(BlogPosts.create(post.title, post.content, post.author, post.publishDate));
	else
		res.status(400).send('Invalid blog post!');
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const post = req.body;
	if(validateObj(post, ['title', 'content', 'author', 'publishDate', 'id'])) {
		if(req.params.id != post.id)
			res.status(400).send("Post ids don't match!");
		try {
			BlogPosts.update(post);
		} catch(e) {
			res.status(404).send('Post id not found.');
		}
		res.status(204).end();
	} else {
		res.status(400).send('Invalid blog post!');
	}
});

module.exports = router;