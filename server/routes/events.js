const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Event } = require('../models');




// const eventSchema = new Schema({
//     title: String,
//     description: String,
//     location: {
//         type: 'Point',
//         coordinates: [Number, Number]
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
// }, { typeKey: '$type' , timestamps: true });


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
//@desc Get all events if number of events is below 20 or fetch maximum 20
//@access Public
router.get('/', async (req, res) => {
    const { page } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    Event.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('author')
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



    

    


module.exports = router;