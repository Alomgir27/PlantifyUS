const express = require('express');
const axios = require('axios');
const router = express.Router();


const { Tree } = require('../models');



//@route api/plants/new
//@desc Create a new plant
//@access Public
router.post('/new', async (req, res) => {
    const { name, scientificName, description, images, benefits, requirements, userId } = req.body;
    console.log(req.body)

    const newTree = new Tree({
        name,
        scientificName,
        description,
        images,
        benefits,
        requirements,
        uploadBy: userId
    })

    newTree.save()
        .then(tree => res.status(200).json({ success: true, tree, message: 'Tree added successfully.' }))
        .catch(error => res.status(400).json({ success: false, message: 'Unable to added tree.', error }));
})


//@route api/plants
//@desc Get all plants if number of plants is below 20 or fetch maximum 20
//@access Public
router.get('/initial', async (req, res) => {
    console.log('initial')
    Tree.find({})
        .limit(5)
        .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
})

//@route api/plants
//@desc Get all plants if number of plants is below 20 or fetch maximum 20 except the ones in the ids array
//@access Public

router.post('/', async (req, res) => {
    const { ids } = req.body;

    if(ids.length === 0 || ids.length === undefined) {
        Tree.find({})
        .limit(5)
        .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
    }
    else {
        Tree.find({ _id: { $nin: ids } })
            .populate('uploadBy')
            .limit(10)
            .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
            .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
    }
})

//@route api/plants/:id
//@desc Get a plant by id
//@access Public
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    Tree.findById(id)
        .populate('uploadBy')
        .then(tree => res.status(200).json({ success: true, tree, message: 'Tree fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch tree', error: err }));
})



//@route api/plants/search
//@desc Search for a plant
//@access Public
router.get('/search', async (req, res) => {
    const { search } = req.query;

    Tree.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { scientificName: { $regex: search, $options: 'i' } }] })
        .limit(5)
        .then(trees => res.status(200).json({ success: true, trees, message: 'Trees fetched successfully' }))
        .catch(err => res.status(400).json({ success: false, message: 'Unable to fetch trees', error: err }));
})

module.exports = router;