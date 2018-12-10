

(async() => {

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
    console.log(houseNumbers[houseNumbers.length - 1]);

    // for (let i = 0; i < houseNumbers.length; i++) {

    //     console.log(houseNumbers[i] + " is a real house."); 
    // }

    // for (int i = 0)
    // houses[3].click()
    // await sleep(3000);
 
    // console.log("Exiting house");
    // exitHouse(); 

    // for (let i = 0; i < houses.length; i++) {

    // }

    function exitHouse() {

        let background = document.getElementsByClassName("modal__bg")[0];
        background.click();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }    
})();