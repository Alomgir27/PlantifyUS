const express = require('express');
const router = express.Router();


const { User, Event, Post, Comment } = require('../models');

// const favouriteSchema = new Schema({
//     type : String,
//     event: {
//         type: Schema.Types.ObjectId,
//         ref: 'Event'
//     },
//     tree: {
//         type: Schema.Types.ObjectId,
//         ref: 'Tree'
//     },
//     organization: {
//         type: Schema.Types.ObjectId,
//         ref: 'Organization'
//     },
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     post: {
//         type: Schema.Types.ObjectId,
//         ref: 'Post'
//     }
// }, { timestamps: true });


//@route    POST api/favourites/add
//@desc     Add a favourite
//@access   Public
router.post('/add', async (req, res) => {
    const { type, id,  user } = req.body;


    if (type === "event") {
        Event.findById(id)
           .populate({
                path: 'author',
                select: 'name image type'
           })
            .then((event) => {
                if(event.favourites.includes(user)) {
                    return res.status(200).json({ success: true, event: event,  message: "Favourite already exists" })
                }
                event.favourites.push(user);
                event.save()
                    .then((event) => {
                        return res.status(200).json({ success: true, event: event,  message: "Favourite added successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message })
        })
    } else if (type === "post") {
        Post.findById(id)
           .populate({
                path: 'author',
                select: 'name image type'
             })
            .then((post) => {
                if(post.favourites.includes(user)) {
                    return res.status(200).json({ success: true, post: post,  message: "Favourite already exists" })
                }
                post.favourites.push(user);
                post.save()
                    .then((post) => {
                        return res.status(200).json({ success: true, post: post,  message: "Favourite added successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message })
        })
    }
})

//@route    POST api/favourites/remove
//@desc     Remove a favourite
//@access   Public
router.post('/remove', async (req, res) => {
    const { type, id,  user } = req.body;

    if (type === "event") {
        Event.findById(id)
           .populate({
                path: 'author',
                select: 'name image type'
           })
            .then((event) => {
                if(!event.favourites.includes(user)) {
                    return res.status(200).json({ success: true, event: event,  message: "Favourite doesn't exist" })
                }
                event.favourites.pull(user);
                event.save()
                    .then((event) => {
                        return res.status(200).json({ success: true, event: event,  message: "Favourite removed successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message })
        })
    }
    else if (type === "post") {
        Post.findById(id)
           .populate({
                path: 'author',
                select: 'name image type'
             })
            .then((post) => {
                if(!post.favourites.includes(user)) {
                    return res.status(200).json({ success: true, post: post,  message: "Favourite doesn't exist" })
                }
                post.favourites.pull(user);
                post.save()
                    .then((post) => {
                        return res.status(200).json({ success: true, post: post,  message: "Favourite removed successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message })
        })
    }
})

module.exports = router;