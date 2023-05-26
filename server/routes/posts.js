const express = require('express');
const axios = require('axios');
const geolib = require('geolib');

const router = express.Router();


const { Post, User } = require('../models');


// const postSchema = new Schema({
//     author: Schema.Types.ObjectId,
//     text: String,
//     images: [String],
//     likes: [Schema.Types.ObjectId],
//     comments: [{author: Schema.Types.ObjectId, text: String, date: Date }],
//     event: Schema.Types.ObjectId,
// }, { timestamps: true });

// const userSchema = new Schema({
//     name: String,
//     email: String,
//     password: String,
//     eventsAttending: [Schema.Types.ObjectId],
//     friends: [Schema.Types.ObjectId],
//     posts: [Schema.Types.ObjectId],
//     image: String,
//     bio: String,
//     location: {
//         type: { type: String, default: 'Point'},
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     badges: [Schema.Types.ObjectId],
//     notifications: [Schema.Types.ObjectId],
//     favourites: [Schema.Types.ObjectId],
//     type: String,
//     uuid: String
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

    //fetch all users posts if author _id is present in friends array
    if (!user) {
        User.findOne({ _id: user })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ success: false, message: 'User does not exist' });
                }

                Post.find({ author: { $in: user.friends } })
                    .skip(skip)
                    .limit(limit)
                    .populate({
                        path: 'author',
                        select: 'name image type'
                    })
                    .populate({
                        path: 'event',
                        select: 'title images status location'
                    })
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
                select: 'title images status location'
            })
            .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
    }
})


//@route GET api/posts/search
//@desc Search posts by query and do regex match on text
//@access Public
router.get('/search', async (req, res) => {
    const { search , limit } = req.query;

    Post.find({ text: { $regex: search, $options: 'i' } })
        .limit(parseInt(limit) || 20)
        .populate({
            path: 'author',
            select: 'name image type'
        })
        .populate({
            path: 'event',
            select: 'title images status location'
        })
        .then(posts => res.status(200).json({ success: true, posts, message: 'Posts fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch posts', error: err }));
})




module.exports = router;