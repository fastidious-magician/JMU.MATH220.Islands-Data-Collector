

const getIslanderConsent = async () => {

    
    let el = document.getElementById("t3tab");
    el.click();

    await sleep(1000);
    console.log("I waited some seconds");

    let consentButton = document.getElementById("detail");
    consentButton.click();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

