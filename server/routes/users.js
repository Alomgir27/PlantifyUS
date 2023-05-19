const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { User } = require('../models');

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

// @route   POST api/users
// @desc    Create a user
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, password, image, location, eventsAttending, friends, posts, bio, uuid } = req.body;
    console.log(req.body);

    const newUser = new User({
        name,
        email,
        password,
        image,
        location,
        eventsAttending,
        friends,
        posts,
        bio,
        badges: [],
        notifications: [],
        favourites: [],
        type: 'user',
        uuid
    });

    newUser.save()
        .then(user => res.status(200).json({ success: true, user, message: 'User created successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'User could not be created', error: err }));
});






module.exports = router;