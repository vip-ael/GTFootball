var currLat;
var currLon;
var currAlt;
var tempLat;
var tempLon;
var tempAlt;
var currHeading;
var currX = 0;
var currZ = 0;
var initLat;
var initLon;
var initAlt;
var initHeading;
var init = false;

var rig = document.getElementById("rig");
var cam = document.getElementById("camera");
var demo = document.getElementById("demo");


//Storing Position i.e. starting AR world
async function getLocation() {
    let promise = new Promise(resolve => {
        let exists = false;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(storePosition);
            if (currLat != null && currLon != null && currAlt != null) {
                exists = true;
            }
        } else {
            demo.innerHTML = "Geolocation is not supported by this browser.";
        }
        setTimeout(() => resolve(exists), 500); // resolve
    });

    // wait for the promise to resolve
    let value = await promise;
    return value;
}
function storePosition(position) {

    currLat = 33.773331;
    currLon = -84.392848;
    currAlt = 288;
    // currLat = position.coords.latitude;
    // currLon = position.coords.longitude;
    // currAlt = position.coords.altitude;

    console.log(currLat);
    console.log(currLon);
    console.log(currAlt);
    tempLat = currLat;
    tempLon = currLon;
    tempAlt = currAlt;
    if (currLat == null || currLon == null || currAlt == null) {
        demo.innerHTML = "Lat, Lon, or Alt isn't storing";
    }
    currHeading = 0;
    //calculateHeading();
    if (init === false) {
        initLat = currLat;
        initLon = currLon;
        initAlt = currAlt;
        initHeading = currHeading;
        init = true;
    }

    rig.setAttribute('position', {
        x: currX,
        y: currAlt,
        z: currZ
    });
    cam.setAttribute('camera', 'active', true);
    console.log(currLat);
    console.log(currLon);
    console.log(currAlt);
    createObject(33.772532, -84.392842, 288, "TESTING");
}
//setInterval(function() {updatePosition(); }, 3000);
//Updating the Position - Occurs every 3 seconds and only updates if you move more than 7 meters
function updatePosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePositionHelper);
    } else {
        demo.innerHTML = "Geolocation cannot be updated.";
    }
}
function updatePositionHelper(position) {
    tempLat = currLat;
    tempLon = currLon;
    //tempLat = position.coords.latitude;
    //tempLon = position.coords.longitude;
    //tempAlt = position.coords.altitude;
    let changeInXDistance = calculateDistance(tempLat, currLat, tempLon, currLon);
    let changeInYDistance = tempAlt - currAlt;
    let changeInTotalDistance = Math.sqrt(Math.pow(changeInXDistance, 2) + Math.pow(changeInYDistance, 2));
    if (changeInTotalDistance > 5) {
        currLat = tempLat;
        currLon = tempLon;
        currAlt = tempAlt;
        let changeInBearing = calculateBearing(tempLat, currLat, tempLon, currLon);
        currX = currX + changeInXDistance * Math.sin(toRadians(changeInBearing));
        currZ = currZ + changeInXDistance * -1 * Math.cos(toRadians(changeInBearing));
        cam.setAttribute('position', {
            x: currX,
            y: currAlt,
            z: currZ
        });
    }
}



//Sets current heading as the difference between North and user heading.
function calculateHeading() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function (event) {
            if ('ondeviceorientationabsolute' in window) {
                window.ondeviceorientationabsolute = function(event) {
                    currHeading = event.alpha;
                    return true;
                };
            } else if(event.webkitCompassHeading) {
                var compass = event.webkitCompassHeading;
                handleOrientationEvent(compass);
                return true;
            } else if (event.absolute == true) {
                var compass = event.alpha;
                handleOrientationEvent(compass);
                return true;
            } else {
                demo.innerHTML = "<br>Compass Heading Not Working";
                return false;
            }
        }, true);
    } else {
        demo.innerHTML = "<br>Compass Heading Not Working";
        return false;
    }
}
function handleOrientationEvent(compass) {
    currHeading = compass;
}

function teleport() {
    let lat = parseFloat(document.getElementById("teleLat").value);
    let lon = parseFloat(document.getElementById("teleLon").value);
    let changeInBearing = calculateBearing(lat, currLat, lon, currLon);
    let changeInXDistance = calculateDistance(lat, currLat, lon, currLon);
    currX = currX + changeInXDistance * Math.sin(toRadians(changeInBearing));
    currZ = currZ + changeInXDistance * Math.cos(toRadians(changeInBearing));
    console.log(currX);
    console.log(currZ);
    rig.setAttribute('position', {
        x: -currX,
        y: currAlt,
        z: currZ
    });
    currLat = lat;
    currLon = lon;
    console.log(currLat);
    console.log(currLon);
}


async function createObject(objLatitude, objLongitude, objAltitude, fileName) {
    let positioned = init;
    console.log("here");
    if (positioned) {
        console.log("here");
        let distance = calculateDistance(currLat, objLatitude, currLon, objLongitude);
        if (distance < 12500000000) {
            let bearing = currHeading + calculateBearing(currLat, objLatitude, currLon, objLongitude);
            let x = distance * Math.sin(toRadians(bearing));
            let y = objAltitude;
            let z = distance * -1 * Math.cos(toRadians(bearing));
            let el = document.createElement('a-entity');
            el.setAttribute('gltf-model', "./Assets/scoreboard1.glb");
            el.setAttribute('position', {
                x: x,
                y: y,
                z: z
            });
            el.setAttribute('scale', {x: 10, y: 10, z: 10});
            let sceneEl = document.querySelector('a-scene');
            sceneEl.appendChild(el);
        }
    }
}



