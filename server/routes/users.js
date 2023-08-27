const express = require('express');
const router = express.Router();

const { User } = require('../models');



//@route POST api/users/login
//@desc Login a user
//@access Public
router.post('/login', async (req, res) => {
    const { email, password, pushToken } = req.body;
    console.log(req.body);

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            if (user.password !== password) {
                return res.status(400).json({ success: false, message: 'Incorrect password' });
            }

            user.pushToken = pushToken;
            user.save()
                .then(user => res.status(200).json({ success: true, user, message: 'User logged in successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to login', error: err }));

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

    if(!id) {
        return res.status(400).json({ success: false, message: 'User could not be retrieved', error: err });
    }

    User.findById(id)
        .then(user => res.status(200).json({ success: true, user, message: 'User retrieved successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'User could not be retrieved', error: err }));
});

// @route   GET api/users/getProfileUser/:id
// @desc    Get a user
// @access  Public
router.get('/getProfileUser/:id', async (req, res) => {
    const { id } = req.params;

    if(!id) {
        return res.status(400).json({ success: false, message: 'User could not be retrieved', error: err });
    }

    User.findById(id)
        .populate('friends')
        .populate('eventsAttending')
        .populate('posts')
        .populate('badges')
        .then(user => res.status(200).json({ success: true, user, message: 'User retrieved successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'User could not be retrieved', error: err }));
});

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
    const { page, user } = req.query;
    const limit = 5;
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
        .limit(parseInt(limit) || 5)
        .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
});

// @route   POST api/users/recommend
// @desc    Recommend users to follow based on friends of friends and location (if provided) all conditions are or conditions not contains ids users
// @access  Public
router.post('/recommend', async (req, res) => {
    const { user, location, ids} = req.body;

    console.log(req.body);


    const limit = 10;

    if(ids.length === 0 || !ids){
        User.find()
        .limit(limit)
        .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
    } else {

    if(!user) {
        if(location) {
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
                    $and: [
                      { _id: { $nin: ids } },
                      { location: { $geoWithin: { $centerSphere: [[parseFloat(location.longitude), parseFloat(location.latitude)], 100000 / 6371] } } }
                    ]
                  }
                },
                {
                  $skip: 0
                },
                {
                  $limit: limit
                }
                
            ])
            .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
            .catch(err => {
                console.error('Error fetching users:', err);
                res.status(400).json({ success: false, message: 'Unable to fetch users', error: err });
            }
            );
        } else {
            User.find({ _id: { $nin: ids } })
                .limit(limit)
                .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
        }
    } else {
    
    User.findOne({ _id: user })
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }
            //find friends if user array friends contains user id
            User.find({ _id: { $in: user.friends } })
                .then(friends => {
                    const friendsOfFriends = friends.map(friend => friend.friends);
                    const flattenedFriendsOfFriends = [].concat.apply([], friendsOfFriends);
                    const uniqueFriendsOfFriends = [...new Set(flattenedFriendsOfFriends)];
                    const recommendedUsers = uniqueFriendsOfFriends.filter(friend => !user.friends.includes(friend) && friend !== user._id);
                  if(!location) {
                    User.find({ _id: { $in: recommendedUsers } })
                        .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
                    } else {
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
                            $or : [
                                { $and : [{ _id: { $in: recommendedUsers } }, { _id: { $nin: ids } }] },
                                { $and : [{ location: { $geoWithin: { $centerSphere: [[parseFloat(location.longitude), parseFloat(location.latitude)], 100000 / 6371] } } }, { _id: { $nin: ids } }] }
                            ]
                            }
                        },
                        {
                            $skip: 0
                        },
                        {
                            $limit: limit
                        }
                        ])
                        .then(users => res.status(200).json({ success: true, users, message: 'Users fetched successfully' }))
                        .catch(err => {
                            res.status(400).json({ success: false, message: 'Unable to fetch users', error: err });
                     });
                    }
                          
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch users', error: err }));
    }
  }
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

                    if (user.friends.includes(friend._id)) {
                        return res.status(400).json({ success: false, message: 'Already following this user' });
                    }

                    user.friends.push(friend._id);
                    user.save()
                        .then(user => res.status(200).json({ success: true, user, message: 'User followed successfully' }))
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

                    if (!user.friends.includes(friend._id)) {
                        return res.status(400).json({ success: false, message: 'Not following this user' });
                    }
                    // console.log(friend.friends, user._id);
                    user.friends.pull(friend._id);
                    user.save()
                        .then(user => res.status(200).json({ success: true, user, message: 'User unfollowed successfully' }))
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));

                    
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to unfollow user', error: err }));
});


// @route   GET api/users/friends/:id
// @desc    Get friends of a user
// @access  Public

router.get('/friends/:id', async (req, res) => {
    const { id } = req.params;

    User.findOne({ _id: id })
        .populate('friends')
        .then(user => {
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' });
            }

            res.status(200).json({ success: true, friends: user.friends, message: 'Friends fetched successfully' });
        }
        )
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch friends', error: err }));
});

          

router.delete('/test', async (req, res) => {
    User.find()
        .then(users => {
            users.forEach(user => {
                user.friends = [];
                user.save()
                    .then(user => console.log(user))
                    .catch(err => console.log(err));
            });
            res.status(200).json({ success: true, message: 'Users updated successfully' });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update users', error: err }));
});




module.exports = router;