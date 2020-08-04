const express = require('express');
const dotenv = require('dotenv');

const estates = require('./routes/estates');

dotenv.config({path: './config/config.env'});

const app = express();

app.use('/real_estate_ad/estates', estates);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
    )
);
