/**
 * Run this on a town's page. Iterates through the houses on that page and
 * sends data back to a local logging server.
 *
 * @author Matthew Routon
 * @version 12-12-18
 */
(async () => {

    let cityName = getCityName();
    let possibleHouseEls = document.getElementsByClassName("house"); // automatically excludes empty houses
    const POPULATION_PROPORTION = 0.07;

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

    await clickFirstHouse();

    let visitedHouseNumbers = [];
    let numHousesToSurvey = Math.floor(houseNumbers.length * POPULATION_PROPORTION);
    console.log("Num houses to survey: " + numHousesToSurvey);
    for (let houseIdx = 0; houseIdx < numHousesToSurvey; houseIdx++) {

        let currentHouseNumber = getNextHouseNumber(houseNumbers, visitedHouseNumbers);
        visitedHouseNumbers.push(currentHouseNumber); // don't visit the same house twice

        console.log("Looking for info on house #: " + currentHouseNumber);

        // open the house modal
        getHouse(currentHouseNumber - 1);

        await sleep(1500);
        let modalHasLoadedNextHouseInfo = false;
        while (!modalHasLoadedNextHouseInfo) {

            let houseInfoEl = document.getElementById('houseinfo');
            let currentHouseOnModal = houseInfoEl.getElementsByTagName('h4')[0].innerHTML;
            let currentHouseNumberOnModal = parseInt(currentHouseOnModal.split(' ')[1]);

            let houseTableEl = houseInfoEl.getElementsByClassName("residents")[0];

            let rows = houseTableEl.getElementsByTagName("tr");

            let numResidents = 0;
            console.log("Got " + rows.length + " rows");
            if (rows.length === 1) {

                let singleRowContent = rows[0].innerHTML;
                if (singleRowContent.indexOf("empty") > -1) {

                    console.log("This is an empty row.");
                }
                console.log(singleRowContent);
            }
            else {

                let residentLinks = houseTableEl.getElementsByTagName('a');
                for (let resIdx = 0; resIdx < residentLinks.length; resIdx++) {

                    console.log("Found resident: " + residentLinks[resIdx].innerHTML);
                    numResidents++;
                }
            }

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

            await sleep(250);
        }
    }

    console.log("Done collecting house data.");

    function sendHouseData(houseNumber, numOccupants, cityName) {

        let url = "http://127.0.0.1:8080/send_house_data";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = () => {
            console.log("Server accepted data.");
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
     *  Randomly select the next house number.
     *
     * @param houseNumbers all possible house numbers.
     * @param visitedHouseNumbers will not return value on this list.
     * @returns {int} number of next house to visit.
     */
    function getNextHouseNumber(houseNumbers, visitedHouseNumbers) {

        let nextHouseNumber = houseNumbers[0];

        const doSelection = () => {

            let selectedIdx = randomlySelectIdx(0, houseNumbers.length - 1);
            nextHouseNumber = houseNumbers[selectedIdx];
            console.log("Getting another random index . . .");
        };

        doSelection();

        // do not go back to an already visited house.
        while (visitedHouseNumbers.indexOf(nextHouseNumber) > -1) {
            doSelection();
        }

        return nextHouseNumber;
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