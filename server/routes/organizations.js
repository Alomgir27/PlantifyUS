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

    const newOrganization = new Organizations({
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
    const skip = (parseInt(page) - 1) * limit;

    Organizations.find()
        .skip(skip)
        .limit(limit)
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});



//@route GET api/organizations/search
//@desc Search for organizations by name or bio and do regex search
//@access Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;


    Organizations.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { bio: { $regex: search, $options: 'i' } }] })
        .limit(parseInt(limit) || 10)
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});

//@route GET api/organizations/exist/{name}
//@desc Check if organization name exists
//@access Public

router.get('/exist/:name', async (req, res) => {
    const { name } = req.params;
    console.log(name, 'name');
   
    // name and find name should be same length and name should be same as find name
    Organizations.find({ $and: [{ name: { $regex: name, $options: 'i' } }, { name: { $regex: `^${name}$`, $options: 'i' } }] })
        .then(organizations => {
            if (organizations.length > 0) {
                res.status(200).json({ success: true, message: 'Organization name exists' });
            } else {
                res.status(400).json({ success: false, message: 'Organization name does not exist' });
            }
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
  
});
   



module.exports = router;