const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});
const PORT= process.env.PORT || 5000;

const app = express();

app.get('/api/v1/properties', (req, res) => {
    res.status(200).json({sucess: true, msg: "Show all properties"});
})

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

