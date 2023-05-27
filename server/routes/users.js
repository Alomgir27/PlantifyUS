const express = require('express');
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



//@route POST api/users/login
//@desc Login a user
//@access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            if (user.password !== password) {
                return res.status(400).json({ success: false, message: 'Incorrect password' });
            }

            return res.status(200).json({ success: true, user, message: 'User logged in successfully' });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to login', error: err }));
});



// @route   POST api/users/register
// @desc    Create a user
// @access  Public
router.post('/register', async (req, res) => {
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


// @route   GET api/users/get/:id
// @desc    Get a user
// @access  Public
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .then(user => res.status(200).json({ success: true, user, message: 'User retrieved successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'User could not be retrieved', error: err }));
});


// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
    const { page, user } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    //fetch all users if _id is present in friends array
    if (user) {
        User.findOne({ _id: user })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ success: false, message: 'User does not exist' });
                }

                User.find({ _id: { $in: user.friends } })
                    .skip(skip)
                    .limit(limit)
                    .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                    .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
            })
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
    } else {
        User.find()
            .skip(skip)
            .limit(limit)
            .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
    }
});


// @route   GET api/users/search
// @desc    Search for users
// @access  Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;

    User.find({ name: { $regex: search, $options: 'i' } })
        .limit(parseInt(limit) || 10)
        .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
});




module.exports = router;