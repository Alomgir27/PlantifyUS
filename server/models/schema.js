
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    date: Date,
    location: {
        type: 'Point',
        coordinates: [Number, Number]
    },
    description: String,
    organizer: String,
    attendees: [String],
    image: [String],
    type: String
}, { typeKey: '$type' , timestamps: true });


const treeSchema = new Schema({
    name: String,
    scientificName: String,
    description: String,
    image: String,
    benefits: [String],
    requirements: {
        sun: String,
        soil: String,
        water: String,
        temperature: String
    }
}, { timestamps: true });

const donationSchema = new Schema({
    name: String,
    email: String,
    amount: Number,
    event: Schema.Types.ObjectId,
    date: Date
});

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    eventsAttending: [Schema.Types.ObjectId],
    friends: [Schema.Types.ObjectId],
    posts: [Schema.Types.ObjectId],
    image: String
});

const postSchema = new Schema({
    author: Schema.Types.ObjectId,
    text: String,
    image: [String],
    date: Date,
    likes: [Schema.Types.ObjectId],
    comments: [{author: Schema.Types.ObjectId, text: String, date: Date }],
    event: Schema.Types.ObjectId
});


const notificationSchema = new Schema({
    user: Schema.Types.ObjectId,
    text: String,
    date: Date,
    read: Boolean
});

const badgeSchema = new Schema({
    name: String,
    image: String,
    description: String,
    users: [Schema.Types.ObjectId]
});

const tipSchema = new Schema({
    title: String,
    text: String,
    image: String
});

const progressSchema = new Schema({
    event: Schema.Types.ObjectId,
    treesPlanted: Number,
    carbonSequestered: Number,
    date: Date
});

const outreachSchema = new Schema({
    name: String,
    email: String,
    organization: String,
    message: String,
    event: Schema.Types.ObjectId,
    date: Date
});

const Event = mongoose.model('Event', eventSchema);
const Tree = mongoose.model('Tree', treeSchema);
const Donation = mongoose.model('Donation', donationSchema);
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Badge = mongoose.model('Badge', badgeSchema);
const Tip = mongoose.model('Tip', tipSchema);
const Progress = mongoose.model('Progress', progressSchema);
const Outreach = mongoose.model('Outreach', outreachSchema);

module.exports = {
    Event,
    Tree,
    Donation,
    User,
    Post,
    Notification,
    Badge,
    Tip,
    Progress,
    Outreach
};
