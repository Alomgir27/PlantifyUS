const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Tree } = require('../models');


// const treeSchema = new Schema({
//     name: String,
//     scientificName: String,
//     description: String,
//     images: [String],
//     benefits: String,
//     requirements: {
//         sun: String,
//         soil: String,
//         water: String,
//         temperature: String,
//         fertilizer: String
//     }
// }, { timestamps: true });



//@route api/plants/new
//@desc Create a new plant
//@access Public
router.post('/new', async (req, res) => {
    const { name, scientificName, description, images, benefits, requirements } = req.body;
    console.log(req.body)

    const newTree = new Tree({
        name,
        scientificName,
        description,
        images,
        benefits,
        requirements
    })

    newTree.save()
        .then(tree => res.status(200).json({ success: true, tree, message: 'Tree added successfully.' }))
        .catch(error => res.status(400).json({ success: false, message: 'Unable to added tree.', error }));
})


//@route api/plants
//@desc Get all plants if number of plants is below 20 or fetch maximum 20
//@access Public
router.get('/', async (req, res) => {
    const { page } = req.query;
    const limit = 20
    const skip = (parseInt(page) - 1) * limit;

    Tree.find()
        .skip(skip)
        .limit(limit)
        .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
})


//@route api/plants/search
//@desc Search for a plant
//@access Public
router.get('/search', async (req, res) => {
    const { search, limit } = req.query;

    Tree.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { scientificName: { $regex: search, $options: 'i' } }] })
        .limit(parseInt(limit) || 20)
        .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
})

module.exports = router;