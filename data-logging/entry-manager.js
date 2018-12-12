
let loggedCityNames = [];
let loggedCityData = {};

module.exports = {

    "logEntry": (entryData) => {

        if (loggedCityNames.indexOf(entryData.cityName) === -1) {

            console.log("Creating new city entry . . .");
            loggedCityData[entryData.cityName] = [];
        }

        console.log("Logging to city: " + entryData.cityName);
        loggedCityData[entryData.cityName].push(entryData);
    },


}