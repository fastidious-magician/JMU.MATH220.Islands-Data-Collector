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

        let csvLines = "";

        // TODO: Write header line.

        for (let city in loggedCityData) {

            let data = loggedCityData[city];

            for (let idx = 0; idx < data.length; idx++) {

                let line = "";

                // push to csv lines
                test = 1;
            }

        }

        // CsvWriter.writeLogFiles()
    }

}