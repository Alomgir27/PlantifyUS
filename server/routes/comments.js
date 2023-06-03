const express = require('express');
const router = express.Router();

const { User, Event, Post, Comment } = require('../models');

// const commentSchema = new Schema({
//     text: String,
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     replyTo: {
//         type: Schema.Types.ObjectId,
//         ref: 'Comment'
//     },
//     upvotes: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     downvotes: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
   
// }, { timestamps: true });



//@route    GET api/comments
//@desc     Get all comments which are inside comments array
//@access   Public
router.get('/', async (req, res) => {
    const { comments, page } = req.query

    console.log(comments, page);
    
    Comment.find({ _id: { $in: comments } })
        .populate('author')
        .populate('replyTo')
        .populate('upvotes')
        .populate('downvotes')
        .skip((page - 1) * 10)
        .limit(10)
        .then((comments) => {
            return res.status(200).json({ success: true, comments: comments, message: "Comments fetched successfully" })
        })
        .catch((err) => {
            return res.status(500).json({ success: false, message: err.message })
        }
    )
})

//@route    PUT api/comments/upvote
//@desc     Upvote a comment
//@access   Public
router.put('/upvote', async (req, res) => {
    const { commentId, userId } = req.body;

    Comment.findById(commentId)
        .then((comment) => {
            // Check if user has already downvoted the comment
            if (comment.downvotes.includes(userId)) {
                // Remove user from downvotes
                comment.downvotes.pull(userId);
            }

            if (comment.upvotes.includes(userId)) {
                return res.status(200).json({ success: true, message: "Comment already upvoted" })
            } else {
                comment.upvotes.push(userId);
                comment.save()
                    .then((comment) => {
                        return res.status(200).json({ success: true, comment: comment, message: "Comment upvoted successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        }
    )
})

//@route    PUT api/comments/downvote
//@desc     Downvote a comment
//@access   Public
router.put('/downvote', async (req, res) => {
    const { commentId, userId } = req.body;

    Comment.findById(commentId)
        .then((comment) => {
            // Check if user has already upvoted the comment
            if (comment.upvotes.includes(userId)) {
                // Remove user from upvotes
                comment.upvotes.pull(userId);
            }

            if (comment.downvotes.includes(userId)) {
                return res.status(200).json({ success: true, message: "Comment already downvoted" })
            } else {
                comment.downvotes.push(userId);
                comment.save()
                    .then((comment) => {
                        return res.status(200).json({ success: true, comment: comment, message: "Comment downvoted successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        }
    )
})

//@route    POST api/comments
//@desc     Create a comment
//@access   Public
router.post('/', async (req, res) => {
    const { type, id, comment, user } = req.body;

    const newComment = new Comment({
        text: comment,
        author: user
    })

    if (type === "event") {
        Event.findById(id)
            .then((event) => {
                event.comments.push(newComment._id);
                event.save()
                    .then((event) => {
                        newComment.save()
                            .then((comment) => {
                                return res.status(200).json({ success: true, comment: comment, event: event,  message: "Comment created successfully" })
                            })
                            .catch((err) => {
                                return res.status(500).json({ success: false, message: err.message })
                            })
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
            .then((post) => {
                post.comments.push(newComment._id);
                post.save()
                    .then((post) => {
                        newComment.save()
                            .then((comment) => {
                                return res.status(200).json({ success: true, comment: comment, post: post,  message: "Comment created successfully" })
                            })
                            .catch((err) => {
                                return res.status(500).json({ success: false, message: err.message })
                            })
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

//@route    DELETE api/comments
//@desc     Delete a comment
//@access   Public
router.delete('/', async (req, res) => {
    const { type, id, comment, user } = req.query;

    if (type === "event") {
        Event.findById(id)
            .then((event) => {
                event.comments.pull(comment);
                event.save()
                    .then((event) => {
                        Comment.findByIdAndDelete(comment)
                            .then((comment) => {
                                return res.status(200).json({ success: true, comment: comment, message: "Comment deleted successfully" })
                            })
                            .catch((err) => {
                                return res.status(500).json({ success: false, message: err.message })
                            })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
    }
    else if (type === "post") {
        Post.findById(id)
            .then((post) => {
                post.comments.pull(comment);
                post.save()
                    .then((post) => {
                        Comment.findByIdAndDelete(comment)
                            .then((comment) => {
                                return res.status(200).json({ success: true, comment: comment, message: "Comment deleted successfully" })
                            })
                            .catch((err) => {
                                return res.status(500).json({ success: false, message: err.message })
                            })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            }
        )
    }
})

//@route    PUT api/comments
//@desc     Edit a comment
//@access   Public
router.put('/', async (req, res) => {
    const { id, newComment, user } = req.body;

    Comment.findById(id)
        .then((comment) => {
            if (comment.author == user) {
                comment.text = newComment;
                comment.save()
                    .then((comment) => {
                        return res.status(200).json({ success: true, comment: comment, message: "Comment edited successfully" })
                    })
                    .catch((err) => {
                        return res.status(500).json({ success: false, message: err.message })
                    })
            } else {
                return res.status(401).json({ success: false, message: "You are not authorized to edit this comment" })
            }
        }
    )
})





module.exports = router;


