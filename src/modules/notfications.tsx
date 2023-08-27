import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_URL } from '../constants';
import axios from 'axios';



const sendPushNotification = async (expoPushToken: string, title: string, message: string, type: string, _id: any, image: string, userId: any) => {

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const messageData = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: message,
        data: { type, _id, image, userId },
    };

    await axios.post(`${API_URL}/notifications`, { title, message, type, _id, image, userId })
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })

    console.log(messageData);

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
}


export default sendPushNotification;



