const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const { mongoURI } = require('./config/keys.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


mongoose
    .connect(mongoURI, { useNewUrlParser: true,  useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Connect to MongoDB and create/use database as configured db name should be PlantifyUs (same as Atlas cluster name)
const db = mongoose.connection.useDb('PlantifyUs');

// // Routes
// app.use('/api/users', require('./routes/api/users'));
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/events', require('./routes/api/events'));
// app.use('/api/plants', require('./routes/api/plants'));
// app.use('/api/requests', require('./routes/api/requests'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



