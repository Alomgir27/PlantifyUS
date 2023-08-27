// const mongoose = require('mongoose');
// const faker = require('faker');
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');





// const { User } = require('../models');
// const { Tree } = require('../models');
// const { Event } = require('../models');
// const { Organizations } = require('../models');
// const { Donation } = require('../models');
// const { Favourites } = require('../models');
// const { Post } = require('../models');
// const { Notification } = require('../models');
// const { Badge } = require('../models');
// const { Progress } = require('../models');



// // Call the generateSeedUsers function to get an array of seed users

// const CLOUD_NAME = "dsojgn6j2";
// const API_KEY = "936896989398428";
// const SECRET_KEY = "kzq2LMNRPMd9Ch2faHpv_mJf1_8";

// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//     cloud_name: CLOUD_NAME,
//     api_key: API_KEY,
//     api_secret: SECRET_KEY
// });


// const folderPath = './images/Post';
// const uploadFolderPath = './uploads'; // Provide the path where you want to upload the images

// // Create the upload folder if it doesn't exist
// if (!fs.existsSync(uploadFolderPath)) {
//   fs.mkdirSync(uploadFolderPath);
// }

// // // Function to process images from a folder and upload them
// // const processImagesFromFolder = async () => {
// //   try {
// //     const imageFileNames = fs.readdirSync(folderPath);

// //     for (const fileName of imageFileNames) {
// //       const sourcePath = path.join(folderPath, fileName);
// //       const targetFileName = uuidv4() + '.jpg';
// //       const targetPath = path.join(uploadFolderPath, targetFileName);

// //       fs.copyFileSync(sourcePath, targetPath);

// //       // Upload image to cloudinary

// //       const uploadedResponse = await cloudinary.uploader.upload(targetPath);

// //       fs.unlinkSync(targetPath);

// //       console.log(uploadedResponse);

// //       const user = new User({
// //         name: faker.name.findName(),
// //         email: faker.internet.email(),
// //         password: faker.internet.password(),
// //         eventsAttending: [],
// //         friends: [],
// //         posts: [],
// //         image: uploadedResponse.url,
// //         bio: faker.lorem.sentence(),
// //         location: {
// //           type: 'Point',
// //           coordinates: [faker.address.longitude(), faker.address.latitude()]
// //         },
// //         badges: [],
// //         notifications: [],
// //         type: 'user',
// //         uuid: "",
// //         pushToken: "",
// //       });

// //       await user.save();
// //     }

// //     console.log('All images processed successfully');
// //   } catch (error) {
// //     console.error('An error occurred while processing images:', error);
// //   }
// // };


// // const treeSchema = new Schema({
// //   name: String,
// //   scientificName: String,
// //   description: String,
// //   images: [String],
// //   benefits: String,
// //   requirements: {
// //       sun: String,
// //       soil: String,
// //       water: String,
// //       temperature: String,
// //       fertilizer: String
// //   },
// //   uploadBy: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   },
// // }, { timestamps: true });


// // const processImagesFromFolder = async () => {
// //   let allUser = await User.find({});
// //   let allUserIds = allUser.map(user => user._id);

// //   try {
// //     const imageFileNames = fs.readdirSync(folderPath);

// //     for (const fileName of imageFileNames) {
// //       const sourcePath = path.join(folderPath, fileName);
// //       const targetFileName = uuidv4() + '.jpg';
// //       const targetPath = path.join(uploadFolderPath, targetFileName);

// //       fs.copyFileSync(sourcePath, targetPath);

// //       // Upload image to cloudinary

// //       const uploadedResponse = await cloudinary.uploader.upload(targetPath);

// //       fs.unlinkSync(targetPath);

// //       console.log(uploadedResponse);

// //       let sun = ["Full Sun", "Partial Sun", "Partial Shade", "Full Shade"];
// //       let soil = ["Clay", "Loam", "Sand", "Silt", "Peat", "Chalk", "Loam", "Rocky"];
// //       let water = ["Dry", "Medium", "Wet"];
// //       let temperature = ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
// //       let fertilizer = ["Low", "Medium", "High"];

// //       const  tree = new Tree({
// //         name: faker.name.findName(),
// //         scientificName: faker.lorem.sentence(),
// //         description: faker.lorem.sentence(),
// //         images: [uploadedResponse.url],
// //         benefits: faker.lorem.sentence(),
// //         requirements: {
// //           sun: sun[Math.floor(Math.random() * sun.length)],
// //           soil: soil[Math.floor(Math.random() * soil.length)],
// //           water: water[Math.floor(Math.random() * water.length)],
// //           temperature: temperature[Math.floor(Math.random() * temperature.length)] + "°C",
// //           fertilizer: fertilizer[Math.floor(Math.random() * fertilizer.length)],
// //         },
// //         uploadBy: allUserIds[Math.floor(Math.random() * allUserIds.length)],
// //       });

// //       await tree.save();

     
// //     }

// //     console.log('All images processed successfully');
// //   } catch (error) {
// //     console.error('An error occurred while processing images:', error);
// //   }
// // }


// // const organizationSchema = new Schema({
// //   name: String,
// //   volunteers: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   events: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'Event'
// //   }],
// //   admin: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   },
// //   moderators: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   joinRequests: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   images: [String],
// //   bio: String,
// //   location: {
// //       type: { type: String, default: 'Point'},
// //       coordinates: { type: [Number], default: [0, 0] }
// //   },
// //   badges: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'Badge'
// //   }],
// //   notifications: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'Notification'
// //   }],
// //   isVerified: Boolean,
// //   type: String
// // }, { timestamps: true });


// // const processImagesFromFolder = async () => {
// //   const allUser = await User.find({});
// //   const allUserIds = allUser.map(user => user._id);
// //   let previousUploadedImages = [];

// //   try {
// //     const imageFileNames = fs.readdirSync(folderPath);

// //     for (const fileName of imageFileNames) {
// //       const sourcePath = path.join(folderPath, fileName);
// //       const targetFileName = uuidv4() + '.jpg';
// //       const targetPath = path.join(uploadFolderPath, targetFileName);

// //       fs.copyFileSync(sourcePath, targetPath);

// //       // Upload image to cloudinary

// //       const uploadedResponse = await cloudinary.uploader.upload(targetPath);

// //       fs.unlinkSync(targetPath);

// //       console.log(uploadedResponse);

// //       const organizationName = ['WeBuildGreenWorldTogether', 'GreenWorld', 'GreenWorldTogether', 'GreenWorldCommunity', 'GreenWorldSociety', 'GreenWorldOrganization', 'GreenWorldGroup', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute',
// //       'GreenWorldTogether', 'GreenWorldCommunity', 'GreenWorldSociety', 'GreenWorldOrganization', 'GreenWorldGroup', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 
// //       'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 
// //       'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague',
// //        'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 
// //        'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 
// //        'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute', 'GreenWorldSociety', 'GreenWorldAssociation', 'GreenWorldUnion', 'GreenWorldFoundation', 'GreenWorldClub', 'GreenWorldNetwork', 'GreenWorldLeague', 'GreenWorldAlliance', 'GreenWorldFederation', 'GreenWorldCoalition', 'GreenWorldConfederation', 'GreenWorldSyndicate', 'GreenWorldGuild', 'GreenWorldSociety', 'GreenWorldOrder', 'GreenWorldCorporation', 'GreenWorldCompany', 'GreenWorldIncorporated', 'GreenWorldConglomerate', 'GreenWorldPartnership', 'GreenWorldTrust', 'GreenWorldAgency', 'GreenWorldBoard', 'GreenWorldBureau', 'GreenWorldCouncil', 'GreenWorldCenter', 'GreenWorldInstitute']

// //        previousUploadedImages.push(uploadedResponse.url);

// //        let images = [];

// //        for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //          images.push(previousUploadedImages[Math.floor(Math.random() * previousUploadedImages.length)]);
// //        }
      
// //        const type = ['pending', 'approved', 'rejected'];

// //        let selectedType = type[Math.floor(Math.random() * type.length)];
// //        let isVerified = selectedType === 'approved' ? true : false;

// //        let volunteers = [];
// //        let moderators = [];

// //        for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //           volunteers.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
// //         }

// //         for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //           moderators.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
// //         }

// //         for(let i = 0; i < volunteers.length; i++) {
// //           if(!moderators.includes(volunteers[i])) {
// //             moderators.push(volunteers[i]);
// //           }
// //         }

// //       const organization = new Organizations({
// //         name: organizationName[Math.floor(Math.random() * organizationName.length)],
// //         volunteers: volunteers,
// //         events: [],
// //         admin: allUserIds[Math.floor(Math.random() * allUserIds.length)],
// //         moderators: moderators,
// //         joinRequests: [],
// //         images: images,
// //         bio: faker.lorem.sentence(),
// //         location: {
// //           type: 'Point',
// //           coordinates: [faker.address.longitude(), faker.address.latitude()]
// //         },
// //         badges: [],
// //         notifications: [],
// //         isVerified: isVerified,
// //         type: selectedType,
// //       });


// //       await organization.save();

// //       previousUploadedImages.push(uploadedResponse.url);
// //     }

// //     console.log('All images processed successfully');
// //   }
// //   catch (error) {
// //     console.error('An error occurred while processing images:', error);
// //   }
// // }






// // const eventSchema = new Schema({
// //   title: String,
// //   description: String,
// //   location: {
// //       type: { type: String, default: 'Point'},
// //       coordinates: { type: [Number], default: [0, 0] }
// //   },
// //   attendees: [String],
// //   images: [String],
// //   requirements:{
// //       trees: String,
// //       volunteers: String,
// //       funds: String
// //   },
// //   landsDescription: String,
// //   status: {
// //       type: String,
// //       enum: ['pending', 'approved', 'rejected', 'completed'],
// //       default: 'pending'
// //   },
// //   author: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   },
// //   favourites: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   organization: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'Organizations'
// //   },
// //   collectedFunds: Number,
// //   upvotes: [String],
// //   downvotes: [String],
// //   comments: [String],
// //   isVerified: Boolean,
// //   type: String,
// //   whoVerified: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   },
// //   hostDetails: {
// //       day: String,
// //       month: String,
// //       year: String,
// //       length: String,
// //       startTime: String,
// //       text: String,
// //       message: String,
// //   },
// // }, { timestamps: true });



// // const processImagesFromFolder = async () => {
// //   let allUser = await User.find({});
// //   let allUserIds = allUser.map(user => user._id);
// //   let allOrganization = await Organizations.find({})
// //   let allOrganizationIds = allOrganization.map(org => org._id)
// //   //delete all event

// //   let imagesAll = [];


// //   try {
// //     const imageFileNames = fs.readdirSync(folderPath);

// //     for (const fileName of imageFileNames) {
// //       const sourcePath = path.join(folderPath, fileName);
// //       const targetFileName = uuidv4() + '.jpg';
// //       const targetPath = path.join(uploadFolderPath, targetFileName);

// //       fs.copyFileSync(sourcePath, targetPath);

// //       // Upload image to cloudinary

// //       const uploadedResponse = await cloudinary.uploader.upload(targetPath);

// //       fs.unlinkSync(targetPath);

// //       console.log(uploadedResponse);

// //       imagesAll.push(uploadedResponse.url);

// //       let images = [];

// //        for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //          images.push(imagesAll[Math.floor(Math.random() * imagesAll.length)]);
// //        }

// //       let trees = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
// //       let volunteers = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
// //       let funds = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];

// //       let status = ["pending", "approved", "rejected", "completed"];

// //       let selectedStatus = status[Math.floor(Math.random() * status.length)];
// //       let isVerified = selectedStatus === 'approved' ? true : selectedStatus === 'completed' ? true : false

// //       let type = 'organization'

// //       let selectedType = type;

// //       let whoVerified = (selectedStatus === 'approved' ||  selectedStatus === 'completed') ? allUserIds[Math.floor(Math.random() * allUserIds.length)] : null;

// //       let organization = allOrganizationIds[Math.floor(Math.random() * allOrganizationIds.length)];

// //       let author = allUserIds[Math.floor(Math.random() * allUserIds.length)];

// //       let attendees = [];

// //       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //         attendees.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
// //       }

// //       let favourites = [];

// //       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //         favourites.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
// //       }

// //       let upvotes = [];

// //       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
// //         upvotes.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
// //       }

// //       const title = ['WeNeedTreePlantation', 'PlantTrees', 'PlantTreesTogether', 'PlantTreesCommunity', 'PlantTreesSociety', 'PlantTreesOrganization', 'PlantTreesGroup', 'PlantTreesAssociation', 'PlantTreesUnion', 'PlantTreesFoundation', 'PlantTreesClub', 'PlantTreesNetwork', 'PlantTreesLeague', 'PlantTreesAlliance', 'PlantTreesFederation', 'PlantTreesCoalition', 'PlantTreesConfederation', 'PlantTreesSyndicate', 'PlantTreesGuild', 'PlantTreesSociety', 'PlantTreesOrder', 'PlantTreesCorporation', 'PlantTreesCompany', 'PlantTreesIncorporated', 'PlantTreesConglomerate', 'PlantTreesPartnership', 'PlantTreesTrust', 'PlantTreesAgency', 'PlantTreesBoard', 'PlantTreesBureau', 'PlantTreesCouncil', 'PlantTreesCenter', 'PlantTreesInstitute', 'PlantTreesSociety', 'PlantTreesAssociation', 'PlantTreesUnion', 'PlantTreesFoundation', 'PlantTreesClub', 'PlantTreesNetwork', 'PlantTreesLeague', 'PlantTreesAlliance', 'PlantTreesFederation', 'PlantTreesCoalition', 'PlantTreesConfederation', 'PlantTreesSyndicate', 'PlantTreesGuild', 'PlantTreesSociety', 'PlantTreesOrder', 'PlantTreesCorporation', 'PlantTreesCompany', 'PlantTreesIncorporated', 'PlantTreesConglomerate', 'PlantTreesPartnership', 'PlantTreesTrust', 'PlantTreesAgency', 'PlantTreesBoard', 'PlantTreesBureau', 'PlantTreesCouncil', 'PlantTreesCenter', 'PlantTreesInstitute',
// //       'Our Villages Need Tree Plantations', 'TreeNeedIsOurArea', 'WeHopeYouAllHostAndEvent', 'SaveUSPlantTree', 'WeNeedTree', 'Our land so dry', 'Please Help US!', 'Hey, We need Trees', 
// //       "Our Villages Need Tree Plantations",
// //       "TreeNeedIsOurArea",
// //       "WeHopeYouAllHostAndEvent",
// //       "SaveUSPlantTree",
// //       "WeNeedTree",
// //       "Our land so dry",
// //       "Please Help US!",
// //       "Hey, We need Trees",
// //       "Plant a Tree, Grow a Future",
// //       "Join Us in Re-greening Our Earth",
// //       "Empower the Earth with Every Tree",
// //       "Trees: Nature's Gift to Humanity",
// //       "One Tree at a Time, One Earth Saved",
// //       "Green Earth, Healthy Life",
// //       "Rooting for a Greener Tomorrow",
// //       "Nurture Nature, Plant a Tree",
// //       "Arbor Day: Celebrate Trees, Celebrate Life",
// //       "Breathe Easy, Plant More Trees",
// //       "A Greener Earth Starts with You",
// //       "Let's Leaf a Legacy of Trees",
// //       "Branching Out for a Sustainable Future",
// //       "Grow Trees, Grow Hope",
// //       "Be a Tree Hero, Save the Planet"]

// //       const bangladeshLocations = [
// //         [90.4125, 23.8103], // Dhaka
// //         [91.8291, 22.3314], // Chittagong
// //         [89.1579, 23.6850], // Khulna
// //         [88.6115, 24.3636], // Rajshahi
// //         [90.4202, 23.8103], // Narayanganj
// //         [88.6228, 24.0984], // Gazipur
// //         [89.2396, 22.7010], // Barisal
// //         [89.2354, 23.2365], // Sylhet
// //         [91.1194, 23.6159], // Comilla
// //         [90.3889, 24.3636], // Bogura
// //         [91.1789, 23.6850], // Feni
// //         [91.8123, 22.6922], // Cox's Bazar
// //         [90.2994, 24.0908], // Tangail
// //         [88.5965, 22.3569], // Jessore
// //         [90.7159, 23.5761], // Munshiganj
// //         [89.1800, 22.9696], // Patuakhali
// //         [89.8786, 24.2468], // Satkhira
// //         [90.2405, 23.0313], // Narsingdi
// //         [88.8466, 24.8949], // Naogaon
// //         [90.4297, 24.4949], // Mymensingh
// //         [89.6859, 25.1263], // Rangpur
// //         [89.5715, 25.7538], // Dinajpur
// //         [90.4043, 24.9265], // Sherpur
// //         [89.2250, 25.9320], // Kurigram
// //         [88.6093, 26.1004], // Lalmonirhat
// //         [89.2335, 24.1631], // Jhalokathi
// //         [89.8338, 24.3980], // Bagerhat
// //         [89.3356, 25.1053], // Thakurgaon
// //         [90.2180, 25.7439], // Panchagarh
// //         [90.9503, 24.0440], // Brahmanbaria
// //       ];
      
// //       console.log(bangladeshLocations);
      


// //       const description = ['WeNeedTreePlantation', 'PlantTrees', 'PlantTreesTogether', 'PlantTreesCommunity', 'PlantTreesSociety', 'PlantTreesOrganization', 'PlantTreesGroup', 'PlantTreesAssociation', 'PlantTreesUnion', 'PlantTreesFoundation', 'PlantTreesClub', 'PlantTreesNetwork', 'PlantTreesLeague', 'PlantTreesAlliance', 'PlantTreesFederation', 'PlantTreesCoalition', 'PlantTreesConfederation', 'PlantTreesSyndicate', 'PlantTreesGuild', 'PlantTreesSociety', 'PlantTreesOrder', 'PlantTreesCorporation', 'PlantTreesCompany', 'PlantTreesIncorporated', 'PlantTreesConglomerate', 'PlantTreesPartnership', 'PlantTreesTrust', 'PlantTreesAgency', 'PlantTreesBoard', 'PlantTreesBureau', 'PlantTreesCouncil', 'PlantTreesCenter', 'PlantTreesInstitute', 'PlantTreesSociety', 'PlantTreesAssociation', 'PlantTreesUnion', 'PlantTreesFoundation', 'PlantTreesClub', 'PlantTreesNetwork', 'PlantTreesLeague', 'PlantTreesAlliance', 'PlantTreesFederation', 'PlantTreesCoalition', 'PlantTreesConfederation', 'PlantTreesSyndicate', 'PlantTreesGuild', 'PlantTreesSociety', 'PlantTreesOrder', 'PlantTreesCorporation', 'PlantTreesCompany', 'PlantTreesIncorporated', 'PlantTreesConglomerate', 'PlantTreesPartnership', 'PlantTreesTrust', 'PlantTreesAgency', 'PlantTreesBoard', 'PlantTreesBureau', 'PlantTreesCouncil', 'PlantTreesCenter', 'PlantTreesInstitute', 'PlantTreesSociety', 'PlantTreesAssociation', 'PlantTreesUnion', 'PlantTreesFoundation', 'PlantTreesClub', 'PlantTreesNetwork', 'PlantTreesLeague', 'PlantTreesAlliance', 'PlantTreesFederation', 'PlantTreesCoalition', 'PlantTreesConfederation', 'PlantTreesSyndicate', 'PlantTreesGuild', 'PlantTreesSociety', 'PlantTreesOrder', 'PlantTreesCorporation', 'PlantTreesCompany', 'PlantTreesIncorporated', 'PlantTreesConglomerate', 'PlantTreesPartnership', 'PlantTreesTrust', 'PlantTreesAgency', 'PlantTreesBoard', 'PlantTreesBureau', 'PlantTreesCouncil', 'PlantTreesCenter', 'PlantTreesInstitute']

// //       const newEvent = new  Event({
// //         title: title[Math.floor(Math.random() * title.length)],
// //         description: description[Math.floor(Math.random() * description.length)],
// //         location: {
// //           type: 'Point',
// //           coordinates: bangladeshLocations[Math.floor(Math.random() * bangladeshLocations.length)]
// //         },
// //         attendees: attendees,
// //         images: images,
// //         requirements:{
// //           trees: trees[Math.floor(Math.random() * trees.length)],
// //           volunteers: volunteers[Math.floor(Math.random() * volunteers.length)],
// //           funds: funds[Math.floor(Math.random() * funds.length)],
// //         },
// //         landsDescription: faker.lorem.sentence(),
// //         status: selectedStatus,
// //         author: author,
// //         favourites: favourites,
// //         organization: organization,
// //         collectedFunds: 0,
// //         upvotes: upvotes,
// //         downvotes: [],
// //         comments: [],
// //         isVerified: isVerified,
// //         type: selectedType,
// //         whoVerified: whoVerified,
// //         hostDetails: {
// //           day: faker.date.future().getDate(),
// //           month: faker.date.future().getMonth(),
// //           year: faker.date.future().getFullYear(),
// //           length: "2",
// //           startTime: "10:00",
// //           text: faker.lorem.sentence(),
// //           message: faker.lorem.sentence(),
// //         },
// //       });

// //       await newEvent.save();

// //     }

// //     console.log('All images processed successfully');
// //   }
// //   catch (error) {
// //     console.error('An error occurred while processing images:', error);
// //   }

// // }


// // const postSchema = new Schema({
// //   author: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   },
// //   text: String,
// //   images: [String],
// //   tags: [String],
// //   upvotes: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   downvotes: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   comments: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'Comment'
// //   }],
// //   event: {
// //       type: Schema.Types.ObjectId,
// //       ref: 'Event'
// //   },
// //   favourites: [{
// //       type: Schema.Types.ObjectId,
// //       ref: 'User'
// //   }],
// //   isVerified: Boolean
// // }, { timestamps: true });

// const processImagesFromFolder = async () => {
//   let allUser = await User.find({});
//   let allUserIds = allUser.map(user => user._id);
//   let allEvent = await Event.find({})
//   let allEventIds = allEvent.map(event => event._id)

//   let imagesAll = [];

//   try {
//     const imageFileNames = fs.readdirSync(folderPath);

//     for (const fileName of imageFileNames) {
//       const sourcePath = path.join(folderPath, fileName);
//       const targetFileName = uuidv4() + '.jpg';
//       const targetPath = path.join(uploadFolderPath, targetFileName);

//       fs.copyFileSync(sourcePath, targetPath);

//       // Upload image to cloudinary

//       const uploadedResponse = await cloudinary.uploader.upload(targetPath);

//       fs.unlinkSync(targetPath);

//       console.log(uploadedResponse);

//       imagesAll.push(uploadedResponse.url);

//       let images = [];

//        for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
//          images.push(imagesAll[Math.floor(Math.random() * imagesAll.length)]);
//        }

//       let tags = ["PlantTree", "SaveEarth", "SaveWorld", "SaveEnvironment", "SaveNature", "SaveOurPlanet", "SaveOurEarth", "SaveOurWorld", "SaveOurEnvironment", "SaveOurNature", "SaveOurMotherEarth", "SaveOurMotherNature", "SaveOurMotherWorld", "SaveOurMotherEnvironment", "SaveOurMotherPlanet", "SaveOurMother", "SaveOurMotherLand", "Save"]
//       let someTags = [];

//       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
//         someTags.push(tags[Math.floor(Math.random() * tags.length)]);
//       }

//       let isVerified = false;

//       let author = allUserIds[Math.floor(Math.random() * allUserIds.length)];

//       let upvotes = [];

//       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
//         upvotes.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
//       }

//       let event = allEventIds[Math.floor(Math.random() * allEventIds.length)];

//       let favourites = [];

//       for (let i = 0; i < Math.max(1, Math.floor(Math.random() * 5)); i++) {
//         favourites.push(allUserIds[Math.floor(Math.random() * allUserIds.length)]);
//       }

//       const newPost = new Post({
//         author: author,
//         text: faker.lorem.sentence(),
//         images: images,
//         tags: someTags,
//         upvotes: upvotes,
//         downvotes: [],
//         comments: [],
//         event: event,
//         favourites: favourites,
//         isVerified: isVerified,
//       });

//       await newPost.save();

//     }

//     console.log('All images processed successfully');
//   }

//   catch (error) {
//     console.error('An error occurred while processing images:', error);
//   }
// }


  


// module.exports = async () => {
//   await processImagesFromFolder();

//   console.log('Seed users created successfully');
// }
