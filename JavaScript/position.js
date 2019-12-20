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
    currLat = 33.772518;
    currLon = -84.393860;
    currAlt = 280;
    // currLat = position.coords.latitude;
    // currLon = position.coords.longitude;
    // currAlt = position.coords.altitude;
    tempLat = currLat;
    tempLon = currLon;
    tempAlt = currAlt;
    if (currLat == null || currLon == null || currAlt == null) {
        demo.innerHTML = "Lat, Lon, or Alt isn't storing";
    }
    currHeading = 70;
    // calculateHeading();
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
    cam.setAttribute('camera', 'near', .1);
    cam.setAttribute('camera', 'far', 10000000);
    if (currLat != null && currLon != null && currAlt != null)
        // createObject(33.779345, -84.404800, 291, "./Assets/scoreboardFRAMES.glb"); //West Village
        // createObject(33.779345, -84.404800, 291, "./Assets/Buzz.glb"); //West Village
        // createObject(33.774595, -84.397339, 283, "./Assets/scoreboardFRAMES.glb"); //Tech Green
        // createObject(33.774595, -84.397339, 283, "./Assets/Buzz.glb"); //Tech Green
        createObject(33.772518, -84.392860, 280, "./Assets/scoreboardFRAMES.glb");//Stadium
        createObject(33.772518, -84.392860, 280, "./Assets/Buzz.glb"); //Stadium
}


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
}

async function createObject(objLatitude, objLongitude, objAltitude, fileName) {
    let positioned = init;
    if (positioned) {
        let distance = calculateDistance(currLat, objLatitude, currLon, objLongitude);
        if (distance < 12500000000) {
            let bearing = currHeading + calculateBearing(currLat, objLatitude, currLon, objLongitude);
            let x = distance * Math.sin(toRadians(bearing));
            let y = objAltitude;
            let z = distance * -1 * Math.cos(toRadians(bearing));
            let sceneEl = document.querySelector('a-scene');

            if (fileName == "./Assets/scoreboardFRAMES.glb") {
                let screen = document.getElementById("gamescreen");
                let board = document.getElementById("board");
                screen.setAttribute('position', {
                    x: x,
                    y: y,
                    z: z
                });
                board.setAttribute('position', {
                    x: x,
                    y: y,
                    z: z
                });
                screen.setAttribute('visible', true);
                board.setAttribute('visible', true);
                screen.setAttribute('scale', {x: 5, y: 5, z: 5});
                board.setAttribute('scale', {x: 5, y: 5, z: 5});
            } else if (fileName == "./Assets/Buzz.glb") {
                let el = document.createElement('a-entity');
                let elChild1 = document.createElement('a-entity');
                el.id = "scoreboard";
                elChild1.setAttribute('gltf-model', fileName);
                el.setAttribute('position', {
                    x: x,
                    y: y - 50,
                    z: z
                });
                el.setAttribute('animation-mixer', 'clip:');
                el.appendChild(elChild1);
                el.setAttribute('scale', {x: 5, y: 5, z: 5});
                sceneEl.appendChild(el);
            }
        }
    }
}




