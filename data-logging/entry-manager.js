const fs = require('fs');

let loggedCityNames = [];
let loggedCityData = {};

/**
 * @author Matthew Routon
 * @version 12-12-18
 * @type {{logEntry: module.exports.logEntry, writeLogFiles: module.exports.writeLogFiles}}
 */
module.exports = {

    logEntry: (entryData) => {

        let cityName = entryData.cityName;

        if (loggedCityNames.indexOf(cityName) === -1) {

            console.log("Creating new city entry . . .");
            loggedCityData[cityName] = [];
            loggedCityNames.push(cityName);
        }

        console.log("Logging to city: " + entryData.cityName);
        loggedCityData[entryData.cityName].push(entryData);
    },

    writeLogFiles: (cityName) => {

        const csvHeader = "HOUSE_NUMBER,CITY_NAME,NUM_RESIDENTS";

        for (let city in loggedCityData) {

            let csvLines = "";
            csvLines += csvHeader + "\r\n";
            let data = loggedCityData[city];

            for (let idx = 0; idx < data.length; idx++) {

                let line = data[idx].houseNumber + ',"' + data[idx].cityName + '",' + data[idx].numOccupants;
                csvLines += line + "\r\n";
            }

            let outputDir = `./results`;
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            fs.writeFile(`./results/${city}.csv`, csvLines, (err) => {
                if (err) {
                    return console.log(err);
                }

                console.log("Results file for " + city + " created.");
            });
        }
    }

}