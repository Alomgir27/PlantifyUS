const express = require('express');
const axios = require('axios');
const geolib = require('geolib');

const router = express.Router();


const { Post, User } = require('../models');

// const postSchema = new Schema({
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     text: String,
//     images: [String],
//     tags: [String],
//     likes: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     comments: [{author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }, text: String, date: Date }],
//     event: {
//         type: Schema.Types.ObjectId,
//         ref: 'Event'
//     },
//     isVerified: Boolean
// }, { timestamps: true });

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
router.get('/', async (req, res) => {
    const { page, user } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    //fetch all users posts if author _id is present in friends array and user is logged in
    if (user) {
        User.findOne({ _id: user })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ success: false, message: 'User does not exist' });
                }

                Post.find({ $or: [{ author: { $in: user.friends } }, { author: user._id }] })
                    .skip(skip)
                    .limit(limit)
                    .populate({
                        path: 'author',
                        select: 'name image type'
                    })
                    .populate({
                        path: 'event',
                        select: 'title images status location createdAt author requirements',
                        populate: {
                            path: 'author',
                            select: 'name image type'
                        }
                    })
                    .sort({ createdAt: -1 })
                    .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
                    .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
            })
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    } else {
        Post.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'author',
                select: 'name image type'
            })
            .populate({
                path: 'event',
                select: 'title images status location createdAt author requirements',
                populate: {
                    path: 'author',
                    select: 'name image type'
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
        .limit(parseInt(limit) || 20)
        .populate({
            path: 'author',
            select: 'name image type'
        })
        .populate({
            path: 'event',
            select: 'title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: 'name image type'
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
            select: 'name image type'
        })
        .populate({
            path: 'event',
            select: 'title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: 'name image type'
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
            select: 'name image type'
        })
        .populate({
            path: 'event',
            select: 'title images status location createdAt author requirements',
            populate: {
                path: 'author',
                select: 'name image type'
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

            



module.exports = router;