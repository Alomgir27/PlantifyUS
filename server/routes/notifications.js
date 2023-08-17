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
        post: type === 'post' ? _id : null
    });

    notification.save()
    .then(notification => {
        res.status(200).json({ success: true, notification , message: 'Notification created successfully' });
    })
    .catch(err => {
        res.status(500).json({ success: false, message: err.message });
    })
});








































module.exports = router;