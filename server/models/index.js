
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: String,
    description: String,
    location: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    organizer: String,
    attendees: [String],
    images: [String],
    requirements:{
        trees: Number,
        volunteers: Number,
        funds: Number
    },
    landsDescription: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },

}, { timestamps: true });


const treeSchema = new Schema({
    name: String,
    scientificName: String,
    description: String,
    images: [String],
    benefits: String,
    requirements: {
        sun: String,
        soil: String,
        water: String,
        temperature: String,
        fertilizer: String
    }
}, { timestamps: true });

const donationSchema = new Schema({
    name: String,
    email: String,
    amount: Number,
    event: Schema.Types.ObjectId,
    type: String,
    trees: Number
}, { timestamps: true });

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    eventsAttending: [Schema.Types.ObjectId],
    friends: [Schema.Types.ObjectId],
    posts: [Schema.Types.ObjectId],
    image: String,
    bio: String,
    location: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    badges: [Schema.Types.ObjectId],
    notifications: [Schema.Types.ObjectId],
    favourites: [Schema.Types.ObjectId],
    type: String
}, { timestamps: true });

const organizationSchema = new Schema({
    name: String,
    volunteers: [Schema.Types.ObjectId],
    events: [Schema.Types.ObjectId],
    admin: Schema.Types.ObjectId,
    moderators: [Schema.Types.ObjectId],
    images: [String],
    bio: String,
    location: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    badges: [Schema.Types.ObjectId],
    notifications: [Schema.Types.ObjectId],
    isVerified: Boolean,
    type: String
}, { timestamps: true });

const postSchema = new Schema({
    author: Schema.Types.ObjectId,
    text: String,
    images: [String],
    likes: [Schema.Types.ObjectId],
    comments: [{author: Schema.Types.ObjectId, text: String, date: Date }],
    event: Schema.Types.ObjectId
}, { timestamps: true });

const favouriteSchema = new Schema({
    type : String,
    Id: Schema.Types.ObjectId
}, { timestamps: true });


const notificationSchema = new Schema({
    text: String,
    read: Boolean,
    type: String,
    user: Schema.Types.ObjectId
}, { timestamps: true });

const badgeSchema = new Schema({
    name: String,
    image: String,
    description: String,
    type: String
}, { timestamps: true});



const progressSchema = new Schema({
    event: Schema.Types.ObjectId,
    type : String,
    treesPlanted: Number,
    moneyCollected: Number,
    moneyNeeds: Number,
    volunteers: Number,
    treesNeeds: Number,
    
}, { timestamps: true });





const Event = mongoose.model('Event', eventSchema);
const Organizations = mongoose.model('Organizations', organizationSchema);
const Tree = mongoose.model('Tree', treeSchema);
const Donation = mongoose.model('Donation', donationSchema);
const User = mongoose.model('User', userSchema);
const Favourites = mongoose.model('Favourites', favouriteSchema);
const Post = mongoose.model('Post', postSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Badge = mongoose.model('Badge', badgeSchema);
const Progress = mongoose.model('Progress', progressSchema);

Event.createIndexes({ location: '2dsphere' });
User.createIndexes({ location: '2dsphere' });
Organizations.createIndexes({ location: '2dsphere' });

module.exports = {
    Event,
    Tree,
    Donation,
    User,
    Post,
    Notification,
    Badge,
    Progress,
    Organizations,
    Favourites
};
