const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { v4: uuidv4 } = require('uuid');

// tree identification api
const Api_Key = process.env.API_KEY;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
// reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
    } else {
    cb(null, false);
    }
};

const uploadImage = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});





// @route   POST api/identify
// @desc    Identify tree
// @access  Public
router.post('/', uploadImage.single('image'), async (req, res) => {
    try {
        const image = req.file;
        const imageFile = fs.readFileSync(image.path);
        const encodedImage = Buffer.from(imageFile).toString('base64');
        const url = 'https://api.plant.id/v2/identify';
        const params = {
            api_key: Api_Key,
            images: [encodedImage],
            modifiers: ["crops_fast", "similar_images"],
            plant_language: "en",
            plant_details: ["common_names",
                "url",
                "name_authority",
                "wiki_description",
                "taxonomy",
                "synonyms",
                "genus",
                "family_common_name",
                "image_url",
                "genus_id",
                "family"],
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        const { data } = await axios.post(url, params, headers);
        const { suggestions } = data;
        const results = suggestions.map((suggestion) => {
            const { id, plant_name, plant_details, probability } = suggestion;
            const { common_names, url, wiki_description, taxonomy } = plant_details;
            const { family, genus } = taxonomy;
            return {
                id,
                name: plant_name,
                commonName: common_names.length > 0 ? common_names[0] : null,
                url,
                description: wiki_description.value,
                family,
                genus,
                probability
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
    }
}
);

module.exports = router;