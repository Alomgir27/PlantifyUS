const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Organizations } = require('../models');


// const organizationSchema = new Schema({
//     name: String,
//     volunteers: [Schema.Types.ObjectId],
//     events: [Schema.Types.ObjectId],
//     admin: Schema.Types.ObjectId,
//     moderators: [Schema.Types.ObjectId],
//     images: [String],
//     bio: String,
//     location: {
//         type: { type: String, default: 'Point'},
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     badges: [Schema.Types.ObjectId],
//     notifications: [Schema.Types.ObjectId],
//     isVerified: Boolean,
//     type: String
// }, { timestamps: true });



//@route POST api/organizations/new
//@desc Create a new organization
//@access Public
router.post('/new', async (req, res) => {
    const { name, admin, bio, type, location, images } = req.body;

    const newOrganization = new Organizations.create({
        name,
        admin,
        bio,
        type,
        location,
        images,
        volunteers: [],
        events: [],
        moderators: [],
        badges: [],
        notifications: [],
        isVerified: false
    });

    newOrganization.save()
        .then(organization => res.status(200).json({ success: true, organization, message: 'Organization added successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to add this organization', error: err }));

});


//@route GET api/organizations
//@desc Get all organizations but maximum 20
//@access Public
router.get('/', async (req, res) => {
    const { page } = req.query;
    const limit = 20
    const skip = (page - 1) * limit

    Organizations.find()
        .skip(skip)
        .limit(limit)
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});



module.exports = router;