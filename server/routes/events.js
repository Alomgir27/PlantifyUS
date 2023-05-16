const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Event } = require('../models');


// @route   POST api/events
// @desc    Create an event
// @access  Private


// const eventSchema = new Schema({
//     title: String,
//     description: String,
//     date: {
//         type: Date,
//         default: Date.now
//     },
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

router.post('/', async (req, res) => {
    const formData = req.body;
    console.log(req.body);
    return res.json({  success: true });
});





module.exports = router;