const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Event } = require('../models');




// const eventSchema = new Schema({
//     title: String,
//     description: String,
//     location: {
//         type: { type: String, default: 'Point'},
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     organizer: String,
//     attendees: [String],
//     images: [String],
//     requirements:{
//         trees: Number,
//         volunteers: Number,
//         funds: Number
//     },
//     landsDescription: String,
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected', 'completed'],
//         default: 'pending'
//     },
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     collectedFunds: Number,
//     upvotes: [String],
//     downvotes: [String],
//     comments: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Comment'
//     }],
//     isVerified: Boolean,
//     type: String
// }, { timestamps: true });


//@route POST api/events/new
//@desc Create an event
//@access Private
router.post('/new', async (req, res) => {
    const { title, description, location, organizer, attendees, images, requirements, landsDescription, author } = req.body;
    console.log(req.body);

    const newEvent = new Event({
        title,
        description,
        location,
        organizer,
        attendees,
        images,
        requirements,
        author,
        landsDescription,
        status: 'pending'
    });

    newEvent.save()
        .then(event => res.status(200).json({ success: true, event, message: 'Event added successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to add this event', error: err }));
    
})


//@route GET api/events
//@desc Get all events if number of events is below 20 or fetch maximum 20 events and give priority to events with more upvotes
//@access Public
router.get('/', async (req, res) => {
    const { page } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    Event.find()
        .sort({ upvotes: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'author',
            select: 'name image type'
        })
        .sort({ upvotes: -1 })
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})

        


//@route GET api/events/search
//@desc Search events by title or description and do string regex match
//@access Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;


    Event.find({ $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] })
        .limit(parseInt(limit) || 20)
        .then(events => res.status(200).json({ success: true, events, message: 'Events fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch events', error: err }));
})


//@route PUT api/events/upvote
//@desc First delete downvote if it exists and then add upvote
//@access Private
router.put('/upvote', async (req, res) => {
    const { eventId, userId } = req.body;

    Event.findById(eventId)
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


   




module.exports = router;