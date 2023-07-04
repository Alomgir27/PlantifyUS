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
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    console.log(req.query);

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

// @route   GET api/users/recommend
// @desc    Recommend users to follow based on friends of friends and location (if provided) all conditions are or conditions
// @access  Public
router.get('/recommend', async (req, res) => {
    const { user, location, page } = req.query;

    console.log(req.query);

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    User.findOne({ _id: user })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }
            User.find({ _id: { $in: user.friends } })
                .then(friends => {
                    const friendsOfFriends = friends.map(friend => friend.friends);
                    const flattenedFriendsOfFriends = [].concat.apply([], friendsOfFriends);
                    const uniqueFriendsOfFriends = [...new Set(flattenedFriendsOfFriends)];
                    const recommendedUsers = uniqueFriendsOfFriends.filter(friend => !user.friends.includes(friend) && friend !== user._id);
                    if (location) {
                        User.aggregate([
                            {
                              $geoNear: {
                                near: {
                                  type: 'Point',
                                  coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)]
                                },
                                distanceField: 'distance',
                                spherical: true
                              }
                            },
                            {
                              $match: {
                                $or: [
                                  { _id: { $in: recommendedUsers } },
                                  { location: { $geoWithin: { $centerSphere: [[parseFloat(location.longitude), parseFloat(location.latitude)], 100000 / 6371] } } }
                                ]
                              }
                            },
                            {
                              $skip: skip
                            },
                            {
                              $limit: limit
                            }
                          ])
                          .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                          .catch(err => {
                            console.error('Error fetching users:', err);
                            res.status(400).json({ success: false, message: 'Unable to fetch users', error: err });
                          });
                          
                          
                    } else {
                        User.find({ _id: { $in: recommendedUsers } })
                            .skip(skip)
                            .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
                    }
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
});


// @route   PUT api/users/follow
// @desc    Follow a user
// @access  Public
router.put('/follow', async (req, res) => {
    const { user, friend } = req.body;


    User.findOne({ _id: user })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            User.findOne({ _id: friend })
                .then(friend => {
                    if (!friend) {
                        return res.status(400).json({ success: false, message: 'Friend does not exist' });
                    }

                    if (friend.friends.includes(user._id)) {
                        return res.status(400).json({ success: false, message: 'Already following this user' });
                    }

                    friend.friends.push(user._id);
                    friend.save()
                        .then(friend => res.status(200).json({ success: true, user: friend, message: 'User followed successfully' }))
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to follow user', error: err }));
                   
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to follow user', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to follow user', error: err }));
});


// @route   PUT api/users/unfollow
// @desc    Unfollow a user
// @access  Public

router.put('/unfollow', async (req, res) => {
    const { user, friend } = req.body;

    User.findOne({ _id: user })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            User.findOne({ _id: friend })
                .then(friend => {
                    if (!friend) {
                        return res.status(400).json({ success: false, message: 'Friend does not exist' });
                    }

                    if (!friend.friends.includes(user._id)) {
                        return res.status(400).json({ success: false, message: 'Not following this user' });
                    }
                    console.log(friend.friends, user._id);
                    friend.friends.pull(user._id);
                    friend.save()
                        .then(friend => res.status(200).json({ success: true, user: friend, message: 'User unfollowed successfully' }))
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));

                    
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));
});




module.exports = router;