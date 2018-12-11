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

    await clickFirstHouse()

    for (let i = 0; i < houseNumbers.length; i++) {

        let currentHouseNumber = houseNumbers[i];
        console.log("Looking for info on house #: " + currentHouseNumber);

        // open the modal
        getHouse(currentHouseNumber - 1);

        await sleep(2500);
        let modalHasLoadedNextHouseInfo = false;
        while (!modalHasLoadedNextHouseInfo) {

            let houseInfoEl = document.getElementById('houseinfo');
            let currentHouseOnModal = houseInfoEl.getElementsByTagName('h4')[0].innerHTML;
            let currentHouseNumberOnModal = parseInt(currentHouseOnModal.split(' ')[1]);
            let rows = houseInfoEl.getElementsByTagName("tr");
            let numResidents = rows.length;

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


        // todo: collect info

        // todo: exit house
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

    function exitHouse() {

        let background = document.getElementsByClassName("modal__bg")[0];
        background.click();
    }

    function getCityName() {

        let titleEl = document.getElementById('title');
        return titleEl.innerHTML;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();