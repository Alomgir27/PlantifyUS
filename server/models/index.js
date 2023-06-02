
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collectedFunds: Number,
    upvotes: [String],
    downvotes: [String],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isVerified: Boolean,
    type: String
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
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    type: String,
    trees: Number
}, { timestamps: true });

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    eventsAttending: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    image: String,
    bio: String,
    location: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    badges: [{
        type: Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: 'Favourite'
    }],
    type: String,
    uuid: String
}, { timestamps: true });

const organizationSchema = new Schema({
    name: String,
    volunteers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    images: [String],
    bio: String,
    location: {
        type: { type: String, default: 'Point'},
        coordinates: { type: [Number], default: [0, 0] }
    },
    badges: [{
        type: Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    isVerified: Boolean,
    type: String
}, { timestamps: true });

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    images: [String],
    tags: [String],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, text: String, date: Date }],
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    isVerified: Boolean
}, { timestamps: true });

const favouriteSchema = new Schema({
    type : String,
    Id: Schema.Types.ObjectId
}, { timestamps: true });


const notificationSchema = new Schema({
    text: String,
    read: Boolean,
    type: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const badgeSchema = new Schema({
    name: String,
    image: String,
    description: String,
    type: String
}, { timestamps: true});



const progressSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    type : String,
    treesPlanted: Number,
    moneyCollected: Number,
    moneyNeeds: Number,
    volunteers: Number,
    treesNeeds: Number,
    
}, { timestamps: true });

const commentSchema = new Schema({
    text: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
   
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
