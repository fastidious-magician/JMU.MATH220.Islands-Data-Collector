/**
 * Run this on a town's page. Iterates through the houses on that page and
 * sends data back to a local logging server.
 *
 * @author Matthew Routon
 * @version 12-12-18
 */
(async () => {

    let cityName = getCityName();
    let possibleHouseEls = document.getElementsByClassName("house");

    let houseNumbers = [];
    for (let i = 0; i < possibleHouseEls.length; i++) {
        let houseIdCollection = possibleHouseEls[i].getElementsByClassName("houseid");
        if (houseIdCollection.length > 0) {

            let idText = houseIdCollection[0].innerHTML;
            if (!isNaN(idText)) {

                let houseNum = parseInt(idText);
                houseNumbers.push(houseNum);
            }
        }
        else {
            console.log("This is not a house.");
        }
    }

    console.log("Got " + possibleHouseEls.length + " possible houses.");
    console.log("Got " + houseNumbers.length + " real houses.");
    // console.log(houseNumbers[houseNumbers.length - 1]);

    console.log(houseNumbers);

    await clickFirstHouse();


    let numHousesToSurvey = Math.floor(houseNumbers.length * 0.25); // TODO: calculate this proportionally to the town size.
    for (let i = 0; i < numHousesToSurvey; i++) {

        let currentHouseNumber = houseNumbers[i];
        // TODO: fn getNextHouseNumber return random unvisited value.
        console.log("Looking for info on house #: " + currentHouseNumber);

        // open the modal
        getHouse(currentHouseNumber - 1);

        await sleep(2500);
        let modalHasLoadedNextHouseInfo = false;
        while (!modalHasLoadedNextHouseInfo) {

            let houseInfoEl = document.getElementById('houseinfo');
            let currentHouseOnModal = houseInfoEl.getElementsByTagName('h4')[0].innerHTML;
            let currentHouseNumberOnModal = parseInt(currentHouseOnModal.split(' ')[1]);

            let houseTableEl = houseInfoEl.getElementsByClassName("residents")[0];

            let rows = houseTableEl.getElementsByTagName("tr");

            // if this house isn't empty
            let numResidents = rows.length;
            // else resident count = 0

            console.log("Current house on modal: " + currentHouseOnModal);
            console.log("Current house number on modal: " + currentHouseNumberOnModal);
            console.log("Number of residents: " + numResidents);

            if (currentHouseNumberOnModal === currentHouseNumber) {
                modalHasLoadedNextHouseInfo = true;
                console.log("modal has loaded info for target house");

                console.log("Submitting data to server . . .");
                sendHouseData(currentHouseNumber, numResidents, cityName);
            }
            else {
                console.log("Not yet loaded.");
            }

            // this is the number of residents at this house.

            await sleep(1500);
        }
    }

    function sendHouseData(houseNumber, numOccupants, cityName) {

        let url = "http://127.0.0.1:8080/send_house_data";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                console.log(json); // response
            }
        };

        let data = {
            "houseNumber": houseNumber,
            "numOccupants": numOccupants,
            "cityName": cityName
        };
        xhr.send(JSON.stringify(data));
    }

    /**
     * Required to make the modal load at first.
     */
    function clickFirstHouse() {
        return new Promise(async (resolve, reject) => {
            let imgs = document.getElementsByTagName('img');
            imgs[0].click();
            await (2500);
            exitHouse();

            resolve();
        });
    }

    /**
     * Click on the backgroud to make the modal close.
     */
    function exitHouse() {

        let background = document.getElementsByClassName("modal__bg")[0];
        background.click();
    }

    /**
     * Read the page to get the city name.
     * @returns {string}
     */
    function getCityName() {

        let titleEl = document.getElementById('title');
        return titleEl.innerHTML;
    }

    /**
     * Randomly select the next house number to survey.
     * @param houseNumbers
     * @returns {int} next house number
     */
    function getNextHouseNumber(houseNumbers) {

        let idxOfNextHouse = randomlySelectIdx(0, houseNumbers.length - 1);

        return houseNumbers[idxOfNextHouse];
    }

    /**
     * Select a random int between firstIdx and lastIdx.
     * @param firstIdx
     * @param lastIdx
     * @returns {number}
     */
    function randomlySelectIdx(firstIdx, lastIdx) // min and max included
    {
        return Math.floor(Math.random() * (lastIdx - firstIdx + 1) + firstIdx);
    }

    /**
     * Return a promise and sleep the script.
     * @param ms milliseconds to wait.
     * @returns {Promise<void>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();