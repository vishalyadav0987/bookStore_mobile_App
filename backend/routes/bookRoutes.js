const express = require('express');
const {authUser} = require('../middleware/authMiddleware')
const router = express.Router();
const { createPost, deletePost, getAllPost, getAllPostOfUser } = require('../controllers/bookController')

// Create a new book post
router.post('/create', authUser, createPost);

// Delete a post by ID
router.delete('/:id', authUser, deletePost);

// Get all book posts
router.get('/', getAllPost);

// Get all posts by a specific user
router.get('/user/:userId', getAllPostOfUser);

module.exports = router;
