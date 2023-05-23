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
    const { title, description, location, organizer, attendees, images, requirements, landsDescription } = req.body;
    console.log(req.body);

    const newEvent = new Event({
        title,
        description,
        location,
        organizer,
        attendees,
        images,
        requirements,
        landsDescription,
        status: 'pending'
    });

    newEvent.save()
        .then(event => res.status(200).json({ success: true, event, message: 'Event added successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to add this event', error: err }));
    
})




module.exports = router;