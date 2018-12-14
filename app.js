'use strict';

const process = require('process');
const body_parser = require('body-parser');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const app = express();

let EntryManager = require('./data-logging/entry-manager');

app.enable('trust proxy');
app.use(body_parser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", "" +
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

app.get('/', (req, res, next) => {

    res.send("Welcome to the Island data collector.");
});

app.post('/send_house_data', (req, res, next) => {

    console.log("Received new house data: ");

    let data = req.body;
    let numOccupants = data.numOccupants;
    let houseNumber = data.houseNumber;
    let cityName = data.cityName;

    console.log("Occupants in House #: " + houseNumber + " : " + numOccupants + ", in city: " + cityName);

    EntryManager.logEntry({
        "numOccupants": numOccupants,
        "houseNumber": houseNumber,
        "cityName": cityName
    });

    console.log(req.body);
    res.sendStatus(200);
});

app.get('/write_log_files', (req, res, next) => {

    console.log("Logging results to CSVs");
    EntryManager.writeLogFiles();
    res.send(200);
});

module.exports = app;