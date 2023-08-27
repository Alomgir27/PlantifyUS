const express = require('express');
const router = express.Router();


const { Event } = require('../models');
const { Organizations } = require('../models');



//@route POST api/events/new
//@desc Create an event
//@access Private
router.post('/new', async (req, res) => {
    const { title, description, location, attendees, images, requirements, landsDescription, author,  organization } = req.body;
    console.log(req.body);

    const newEvent = new Event({
        title,
        description,
        location,
        attendees,
        images,
        requirements,
        author,
        landsDescription,
        organization,
        status: 'pending',
        collectedFunds: 0,
        upvotes: [],
        downvotes: [],
        comments: [],
        isVerified: false,
        type: 'event',
        hostDetails: {}
    });

    newEvent.save()
        .then(event => res.status(200).json({ success: true, event, message: 'Event added successfully' }))
        .catch(err => {
            console.log(err);
            res.status(400).json({ success: false, message: 'Unable to add event', error: err })
        });
    
})


//@route GET api/events/initial
//@desc Get all events if number of events is below 20 or fetch maximum 20 events and give priority to events with more upvotes
//@access Public
router.get('/initial', async (req, res) => {
    Event.find({ isVerified: true })
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .sort({ upvotes: -1 })
        .limit(5)
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})

        


//@route GET api/events/search
//@desc Search events by title or description and do string regex match
//@access Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;


    Event.find({ $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }], isVerified: true })
        .limit(parseInt(limit) || 5)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})


//@route PUT api/events/upvote
//@desc First delete downvote if it exists and then add upvote
//@access Private
router.put('/upvote', async (req, res) => {
    const { eventId, userId } = req.body;

    Event.findById(eventId)
        .populate({ 
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(event => {
            if (event.downvotes.includes(userId)) {
                event.downvotes.pull(userId);
            }
            // make sure user has not already upvoted
            if (event.upvotes.includes(userId)) {
                return res.status(400).json({ success: false, message: 'You have already upvoted this event' });
            }
            
            event.upvotes.push(userId);
            event.save()
                .then(event => res.status(200).json({ success: true, event, message: 'Upvoted successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to upvote', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to upvote', error: err }));
})


//@route PUT api/events/downvote
//@desc First delete upvote if it exists and then add downvote
//@access Private
router.put('/downvote', async (req, res) => {
    const { eventId, userId } = req.body;

    Event.findById(eventId)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(event => {
            if (event.upvotes.includes(userId)) {
                event.upvotes.pull(userId);
            }
            // make sure user has not already downvoted
            if (event.downvotes.includes(userId)) {
                return res.status(400).json({ success: false, message: 'You have already downvoted this event' });
            }
            event.downvotes.push(userId);
            event.save()
                .then(event => res.status(200).json({ success: true, event, message: 'Downvoted successfully' }))
                .catch(err => res.status(400).json({ success: false, message: 'Unable to downvote', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to downvote', error: err }));
})



//@route GET api/events/:id
//@desc Get event by id
//@access Public
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    Event.findById(id)
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(event => res.status(200).json({ success: true, event, message: 'Event fetched successfully' }))   
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch event', error: err }));
})
        


//@route POST api/events/fetchMore
//@desc Fetch more events
//@access Public
router.post('/fetchMore', async (req, res) => {
    const { ids } = req.body;

    console.log(ids);

    Event.find({ _id: { $nin: ids }, isVerified: true })
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .sort({ upvotes: -1 })
        .limit(10)
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})



//@route GET api/events/getRequestedEvents/:id
//@desc Get all events that the organization is a part of only check joinRequests array
//@access Public
router.get('/getRequestedEvents/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id, 'id');

    Event.find({ organization: id, isVerified: false })
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));

});


//@route POST api/events/approve
//@desc Approve an event
//@access Private
router.post('/approve', async (req, res) => {
    const { eventId, organizationId , year, month, day, startHour, length, userId, text } = req.body;

    Organizations.findById(organizationId)
        .then(organization => {
            if (organization.events.includes(eventId)) {
                return res.status(400).json({ success: false, message: 'Event already exists in organization' });
            }
            organization.events.push(eventId);
            organization.save()
                .then(organization => {
                    Event.findById(eventId)
                        .populate({
                            path: 'author',
                            select: '_id name image type pushToken'
                        })
                        .populate({
                            path: 'organization',
                            select: '_id name images bio'
                        })
                        .then(event => {
                            event.isVerified = true;
                            event.status = 'approved';
                            event.whoVerified = userId;
                            event.hostDetails = {
                                day,
                                month,
                                year,
                                length,
                                startTime: startHour,
                                message: 'Event hosted by ' + organization.name + ' on ' + day + '/' + month + '/' + year + ' at ' + startHour + ' for ' + length + ' hours',
                                text
                            }
                            event.save()
                                .then(event => res.status(200).json({ success: true, event, message: 'Event approved successfully' }))
                                .catch(err => res.status(400).json({ success: false, message: 'Unable to approve event', error: err }));
                        })
                        .catch(err => res.status(400).json({ success: false, message: 'Unable to approve event', error: err }));
                })
                .catch(err => res.status(400).json({ success: false, message: 'Unable to approve event', error: err }));
        })
        .catch(err => res.status(400).json({ success: false, message: 'Unable to approve event', error: err }));
})



//@route POST api/events/getEvents
//@desc Get all events except the ones in the ids array and if userId is favourites array element 
//@access Public
router.post('/getEvents', async (req, res) => {
    const { ids, userId } = req.body;
    console.log(ids, userId);

    Event.find({ favourites: userId, _id: { $nin: ids }, isVerified: true })
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .sort({ upvotes: -1 })
        .limit(10)
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})


//@route DELETE api/events/reject/:id
//@desc Reject an event
//@access Private
router.delete('/reject/:id', async (req, res) => {
    const { id } = req.params;
    Event.findOneAndDelete({ _id: id })
        .then(event => res.status(200).json({ success: true, event, message: 'Event rejected successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to reject event', error: err }));
})



//@route GET api/events/getAllEvents
//@desc Get all events
//@access Public
router.post('/getAllEvents', async (req, res) => {
    console.log('Hello  ')
    Event.find({})
        .populate({
            path: 'author',
            select: '_id name image type pushToken'
        })
        .populate({
            path: 'organization',
            select: '_id name images bio'
        })
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})



module.exports = router;