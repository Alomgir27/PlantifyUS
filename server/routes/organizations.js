const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Organizations } = require('../models');
const { User } = require('../models');


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

    console.log(req.body, 'req.body');
    const newOrganization = new Organizations({
        name,
        admin,
        bio,
        type: type || 'pending',
        location,
        images,
        volunteers: [admin],
        events: [],
        moderators: [],
        badges: [],
        notifications: [],
        isVerified: false,
        joinRequests: []
    });

    newOrganization.save()
        .then(organization => res.status(200).json({ success: true, organization, message: 'Organization added successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to add this organization', error: err }));

});



//@route GET api/organizations/search
//@desc Search for organizations by name or bio and do regex search
//@access Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;


    Organizations.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { bio: { $regex: search, $options: 'i' } }], isVerified: true })
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
    //if last character is a space, remove it
    if (name[name.length - 1] === ' ') {
        name = name.slice(0, name.length - 1);
    }
   
    // name and find name should be same length and name should be same as find name and should be isVerified true
    Organizations.find({ name: { $regex: name, $options: 'i', $eq: name }, isVerified: true })
        .then(organizations => {
            console.log(organizations, 'organizations');
            if (organizations.length > 0) {
                res.status(200).json({ success: true, message: 'Organization name exists' });
            } else {
                res.status(400).json({ success: false, message: 'Organization name does not exist' });
            }
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
  
});



//@route POST api/organizations/getAll
//@desc POST all organizations except the ones in the ids array and isVerified is true
//@access Public
router.post('/getAll', async (req, res) => {
    const { ids } = req.body;
    console.log(ids, 'ids get all');
    Organizations.find({ _id: { $nin: ids }, isVerified: true })
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image', options: { limit: 2 } })
        .limit(5)
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});

   
//@route GET api/organizations/getMy/${user?._id}
//@desc Get all organizations that the user is a part of only check if id has inside volunteers array
//@access Public
router.get('/getMy/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');
    Organizations.find({ volunteers: id, isVerified: true })
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image', options: { limit: 2 } })
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});

//@route GET api/organizations/getPending
//@desc Get all organizations that the user is a part of not in ids array and isVerified is false
//@access Public
router.post('/getPending', async (req, res) => {
    const { ids } = req.body;
    console.log(ids, 'ids get pending');
    Organizations.find({ _id: { $nin: ids }, isVerified: false })
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image', options: { limit: 2 } })
        .limit(10)
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});


//@route GET api/organizations/getRequested/${user?._id}
//@desc Get all organizations that the user is a part only check joinRequests array
//@access Public
router.get('/getRequested/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');
    Organizations.find({ joinRequests: id, isVerified: true })
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image', options: { limit: 2 } })
        .then(organizations => res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organizations', error: err }));
});


//@route POST api/organizations/joinRequest
//@desc Add user to joinRequests array of organization
//@access Public
router.post('/joinRequest', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            if(organization.joinRequests.includes(userId)) {
                organization.joinRequests.pull(userId);
            } else {
                organization.joinRequests.push(userId);
            }
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});



//@route POST api/organizations/verifyRequest
//@desc Add user to volunteers array of organization and remove user from joinRequests array
//@access Public
router.post('/verifyRequest', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.isVerified = true;
            organization.type = 'approved';
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});


//@route GET api/organizations/getOne/${organization?._id}
//@desc Get one organization by id
//@access Public
router.get('/getOne/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');
    Organizations.findById(id)
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image' })
        .populate({ path: 'joinRequests', select: '_id name image' })
        .populate({ path: 'events', select: '_id title images isVerified status hostDetails description whoVerified' })
        .populate({ path: 'moderators', select: '_id name image' })
        .populate({ path: 'badges', select: '_id name image' })
        .then(organization => res.status(200).json({ success: true, organization, message: 'Organization fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch organization', error: err }));
});





//@route POST api/organizations/approveJoinRequest
//@desc Add user to volunteers array of organization and remove user from joinRequests array
//@access Public
router.post('/approveJoinRequest', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.joinRequests.pull(userId);
            organization.volunteers.push(userId);
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});





//@route POST api/organizations/rejectJoinRequest
//@desc Remove user from joinRequests array of organization
//@access Public
router.post('/rejectJoinRequest', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.joinRequests.pull(userId);
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});

//@route POST api/organizations/addModerator
//@desc Add user to moderators array of organization
//@access Public
router.post('/addModerator', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.moderators.push(userId);
            organization.save()
                .then(organization => {
                    User.findById(userId)
                        .then(user => {
                            user.save()
                                .then(user => res.status(200).json({ success: true, organization, user, message: 'Organization updated successfully' }))
                                .catch(err => res.status(400).json({ success: false, message: 'Unable to update user', error: err }))
                        })
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to update user', error: err }))
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});


//@route POST api/organizations/removeModerator
//@desc Remove user from moderators array of organization
//@access Public
router.post('/removeModerator', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.moderators.pull(userId);
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});

//@route POST api/organizations/removeVolunteer
//@desc Remove user from volunteers array of organization
//@access Public
router.post('/removeVolunteer', async (req, res) => {
    const { userId, organizationId } = req.body;
    console.log(req.body, 'req.body');

    Organizations.findById(organizationId)
        .then(organization => {
            organization.volunteers.pull(userId);
            organization.moderators.pull(userId);
            organization.save()
                .then(organization => res.status(200).json({ success: true, organization, message: 'Organization updated successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organization', error: err }));
});


router.put('/test', async (req, res) => {
    Organizations.find()
        .populate('admin', '_id name image')
        .populate({ path: 'volunteers', select: '_id name image' })
        .populate({ path: 'joinRequests', select: '_id name image' })
        .populate({ path: 'events', select: '_id title images hostDetails' })
        .then(organizations => {
            res.status(200).json({ success: true, organizations, message: 'Organizations fetched successfully' });
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to update organizations', error: err }));
});

module.exports = router;