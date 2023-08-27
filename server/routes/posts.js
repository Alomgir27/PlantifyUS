const express = require('express');
const axios = require('axios');
const geolib = require('geolib');

const router = express.Router();


const { Post, User, Comment, Event, Notification } = require('../models');

//@route POST api/posts/new
//@desc Create a new post
//@access Public
router.post('/new', async (req, res) => {
    const { author, text, images, event, tags } = req.body;
    console.log(req.body);

    const newPost = new Post({
        author,
        text,
        images,
        event,
        tags,
        likes: [],
        comments: [],
        isVerified: false
    });

    newPost.save()
     .then(post => res.status(200).json({ success: true, post, message: 'Post added successfully.'}))
     .catch(error => res.status(400).json({ success: false, message: 'Unable to added post.', error }));
})


//@route GET api/posts
//@desc Get posts by page and _id
//@access Public
router.get('/initial', async (req, res) => {
    const { user } = req.query;
    const limit = 5;

    //fetch all users posts if author _id is present in friends array and user is logged in
    if (user) {
        User.findOne({ _id: user })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ success: false, message: 'User does not exist' });
                }

                Post.find({ $or: [{ author: { $in: user.friends } }, { author: user._id }] })
                    .limit(limit)
                    .populate({
                        path: 'author',
                        select: '_id name image type pushToken'
                    })
                    .populate({
                        path: 'event',
                        select: '_id title images status location createdAt author requirements',
                        populate: {
                            path: 'author',
                            select: '_id name image type pushToken'
                        }
                    })
                    .sort({ createdAt: -1 })
                    .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
                    .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
            })
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    } else {
        Post.find()
            .limit(limit)
            .populate({
                path: 'author',
                select: '_id name image type pushToken'
            })
            .populate({
                path: 'event',
                select: '_id title images status location createdAt author requirements',
                populate: {
                    path: 'author',
                    select: '_id name image type pushToken'
                }
            })
            .sort({ createdAt: -1 })
            .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    }
})


//@route GET api/posts/search
//@desc Search posts by query and do regex match on text field or tags array
//@access Public
router.get('/search', async (req, res) => {
    const { search , limit } = req.query;

    Post.find({ $or: [{ text: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }] })
        .limit(parseInt(limit) || 5)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'event',
            select: '_id title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: '_id name image type pushToken'
            }
        })
        .sort({ createdAt: -1 })
        .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
})


//@route PUT api/posts/upvote
//@desc Upvote a post
//@access Public
router.put('/upvote', async (req, res) => {
    const { postId, userId } = req.body;


    Post.findById(postId)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'event',
            select: '_id title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: '_id name image type pushToken'
            }
        })
        .then(post => {
            console.log(post);
            if (!post) {
                return res.status(400).json({ success: false, message: 'Post does not exist' });
            }

            if(post.downvotes.includes(userId)) {
                post.downvotes.pull(userId);
            }

            if(post.upvotes.includes(userId)) {
                return res.status(400).json({ success: false, message: 'Post already upvoted' });
            }

            post.upvotes.push(userId);
            post.save()
                .then(post => res.status(200).json({ success: true, post, message: 'Post upvoted successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to upvote post', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to upvote post', error: err }));
})


//@route PUT api/posts/downvote
//@desc Downvote a post
//@access Public
router.put('/downvote', async (req, res) => {
    const { postId, userId } = req.body;

    Post.findById(postId)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'event',
            select: '_id title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: '_id name image type pushToken'
            }
        })
        .then(post => {
            if (!post) {
                return res.status(400).json({ success: false, message: 'Post does not exist' });
            }

            if(post.upvotes.includes(userId)) {
                post.upvotes.pull(userId);
            }

            if(post.downvotes.includes(userId)) {
                return res.status(400).json({ success: false, message: 'Post already downvoted' });
            }

            post.downvotes.push(userId);
            post.save()
                .then(post => res.status(200).json({ success: true, post, message: 'Post downvoted successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to downvote post', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to downvote post', error: err }));
})


//@route GET api/posts/:id
//@desc Get post by id
//@access Public
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    Post.findById(id)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'event',
            select: '_id title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: '_id name image type pushToken'
            }
        })
        .then(post => res.status(200).json({ success: true, post, message: 'Post fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch post', error: err }));
})


//@route POST api/posts/fetchMore
//@desc Fetch more posts
//@access Public
router.post('/fetchMore', async (req, res) => {
    const { ids, userId } = req.body;
    if(userId) {
        User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            Post.find({ $and: [{ _id: { $nin: ids } }, { $or: [{ author: { $in: user.friends } }, { author: user._id }] }] })
                .populate({
                    path: 'author',
                    select: '_id name image type pushToken'
                })
                .populate({
                    path: 'event',
                    select: '_id title images status location createdAt author requirements',
                    populate: {
                        path: 'author',
                        select: '_id name image type pushToken'
                    }
                })
                .sort({ createdAt: -1 })
                .limit(10)
                .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    } else {
        Post.find({ _id: { $nin: ids } })
            .populate({
                path: 'author',
                select: '_id name image type pushToken'
            })
            .populate({
                path: 'event',
                select: '_id title images status location createdAt author requirements',
                populate: {
                    path: 'author',
                    select: '_id name image type pushToken'
                }
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    }
})

//@route POST api/posts/getPosts
//@desc Get posts by ids and userId must be present in favourites array
//@access Public
router.post('/getPosts', async (req, res) => {
    const { ids, userId } = req.body;

    Post.find({ favourites: userId, _id: { $nin: ids } })
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'event',
            select: '_id title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: '_id name image type pushToken'
            }
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
})


//@route DELETE api/posts/:id
//@desc Delete a post
//@access Public
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    Post.findByIdAndDelete(id)
        .populate('comments')
        .then(post => {
            if (!post) {
                return res.status(400).json({ success: false, message: 'Post does not exist' });
            }
            post.comments.forEach(comment => {
                comment.replyTo.forEach(reply => {
                    Comment.findByIdAndDelete(reply)
                        .then(reply => console.log('Reply deleted successfully'))
                        .catch(err => console.log('Unable to delete reply', err));
                })
                Comment.findByIdAndDelete(comment._id)
                    .then(comment => console.log('Comment deleted successfully'))
                    .catch(err => console.log('Unable to delete comment', err));
            })
            res.status(200).json({ success: true, message: 'Post deleted successfully' });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to delete post', error: err }));
})





module.exports = router;