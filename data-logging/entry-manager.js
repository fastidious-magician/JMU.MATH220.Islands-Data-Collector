const CsvWriter = require('./csv_writer');

let loggedCityNames = [];
let loggedCityData = {};

module.exports = {

    "logEntry": (entryData) => {

        let cityName = entryData.cityName;

        if (loggedCityNames.indexOf(cityName) === -1) {

            console.log("Creating new city entry . . .");
            loggedCityData[cityName] = [];
            loggedCityNames.push(cityName);
        }

        console.log("Logging to city: " + entryData.cityName);
        loggedCityData[entryData.cityName].push(entryData);
    },

    "writeLogFiles": (cityName) => {

        let csvLines = [];
        for (let city in loggedCityData) {

            for (let idx = 0; idx < city.length; idx++) {

                // push to csv lines
            }

        }
    }

}