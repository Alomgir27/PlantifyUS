const express = require('express');
const router = express.Router();

const { Notification } = require('../models');


//@route POST api/notifications
//@desc Create a notification
//@access Private
router.post('/', async (req, res) => {
    const { _id, title, message, image, type, userId } = req.body;
    
    const notification = new Notification({
        title,
        message,
        image,
        type,
        user: userId,
        organization: type === 'organization' ? _id : null,
        event: type === 'event' ? _id : null,
        post: type === 'post' ? _id : null,
        read: false
    });

    notification.save()
    .then(notification => {
        res.status(200).json({ success: true, notification , message: 'Notification created successfully' });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});


//@route GET api/notifications/:id
//@desc Get all notifications for a user
//@access Private
router.get('/personal/:id', async (req, res) => {
    const { id } = req.params;

    console.log(id);

    Notification.find({ user: id , type: { $ne: 'organization' } })
    .limit(10)
    .sort({ createdAt: -1 })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    })
});



//@route POST api/notifications/fetchMore
//@desc Get more notifications for a user
//@access Private
router.post('/personal/fetchMore', async (req, res) => {
    const { userId, ids } = req.body;

    Notification.find({ user: userId, _id: { $nin: ids }, type: { $ne: 'organization' } })
    .limit(10)
    .sort({ createdAt: -1 })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    })
});




//@route POST api/notifications/markAsRead
//@desc Mark notifications as read
//@access Private
router.post('/markAsRead', async (req, res) => {
    const { ids } = req.body;

    Notification.updateMany({ _id: { $in: ids } }, { read: true })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});

//@route POST api/notifications/markAsRead/:id
//@desc Mark notifications as read
//@access Private
router.post('/markAsRead/:id', async (req, res) => {
    const { id } = req.params;

    Notification.findByIdAndUpdate(id, { read: true })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});

//@route POST api/notifications/delete/:id
//@desc Delete a notification
//@access Private
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    console.log(id);

    Notification.findByIdAndDelete(id)
    .then(notification => {
        res.status(200).json({ success: true, notification });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});


//@route POST api/notifications/markAsUnread/:id
//@desc Mark notifications as unread
//@access Private
router.post('/markAsUnread/:id', async (req, res) => {
    const { id } = req.params;

    Notification.findByIdAndUpdate(id, { read: false })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});

//@route POST api/notifications/org/:id
//@desc Get all notifications for an organization
//@access Private
router.get('/org/:id', async (req, res) => {
    const { id } = req.params;

    Notification.find({ user: id , type: 'organization' })
    .limit(10)
    .sort({ createdAt: -1 })
    .then(notifications => {
        let read = notifications.filter(notification => notification.read === true);
        let unread = notifications.filter(notification => notification.read === false);
        res.status(200).json({ success: true,  read, unread });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    })
});

//@route POST api/notifications/org/fetchMore
//@desc Get more notifications for an organization
//@access Private
router.post('/org/fetchMore', async (req, res) => {
    const { userId, ids } = req.body;

    Notification.find({ user: userId, _id: { $nin: ids } }, { type: 'organization' })
    .limit(10)
    .sort({ createdAt: -1 })
    .then(notifications => {
        let read = notifications.filter(notification => notification.read === true);
        let unread = notifications.filter(notification => notification.read === false);
        res.status(200).json({ success: true,  read, unread });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});





router.post('/test', async (req, res) => {
    Notification.find()
    .then(notifications => {
        notifications.forEach(notification => {
            notification.read = false;
            notification.save();
        })
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});

module.exports = router;