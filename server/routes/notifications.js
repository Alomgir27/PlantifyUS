const express = require('express');
const router = express.Router();
const axios = require('axios');

const { Notification } = require('../models');


// const notificationSchema = new Schema({
//     title: String,
//     message: String,
//     read: Boolean,
//     type: String,
//     user: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     event: {
//         type: Schema.Types.ObjectId,
//         ref: 'Event'
//     },
//     organization: {
//         type: Schema.Types.ObjectId,
//         ref: 'Organization'
//     },
//     post: {
//         type: Schema.Types.ObjectId,
//         ref: 'Post'
//     },
//     image: String
// }, { timestamps: true });

// const sendPushNotification = async (expoPushToken: string, title: string, message: string, _id: any, image: string, type: string, userId: any) => {

//     if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//         });
//     }

//     const messageData = {
//         to: expoPushToken,
//         sound: 'default',
//         title: title,
//         body: message,
//         data: { _id, image, type, userId },
//     };

//     await axios.post(`${API_URL}/notifications`, { _id, title, message, image, type, userId })
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     })

//     await axios.post('https://exp.host/--/api/v2/push/send', messageData)
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     })

// }

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
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    console.log(id);

    Notification.find({ user: id })
    .populate('user')
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
router.post('/fetchMore', async (req, res) => {
    const { userId, ids } = req.body;

    Notification.find({ user: userId, _id: { $nin: ids } })
    .populate('user')
    .sort({ createdAt: -1 })
    .then(notifications => {
        res.status(200).json({ success: true, notifications });
    })
    .catch(err => {
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