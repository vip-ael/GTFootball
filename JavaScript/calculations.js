const radius = 6371e3; // Radius of Earth in Meters
function calculateDistance(lat1, lat2, lon1, lon2) {
    let lat1radians = toRadians(lat1);
    let lat2radians = toRadians(lat2);
    let deltaLat = toRadians(lat2-lat1);
    let deltaLon = toRadians(lon2-lon1);
    let a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(lat1radians) * Math.cos(lat2radians) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let latlondistance = radius * c;
    return latlondistance;
}
//Calculates angle between user's location and object's location
function calculateBearing(latB1, latB2, lonB1, lonB2) {
    let dLon = (lonB2 - lonB1);
    let y = Math.sin(toRadians(dLon))* Math.cos(toRadians(latB2));
    let x = Math.cos(toRadians(latB1))*Math.sin(toRadians(latB2)) - Math.sin(toRadians(latB1))*Math.cos(toRadians(latB2))*Math.cos(toRadians(dLon));
    let brng = toDegrees((Math.atan2(y, x)));
    return brng;
}


function calcLatLon(brng, d) {
    //Bearing is converted to radians.
    // Distance in m
    let lat2;
    let lon2;
    brng = toRadians(brng);
    let lat1 = toRadians(initLat); //Current lat point converted to radians
    let lon1 = toRadians(initLon); //Current long point converted to radians
    lat2 = Math.asin(Math.sin(lat1) * Math.cos(d/radius) + Math.cos(lat1) * Math.sin(d/radius) * Math.cos(brng));
    lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d/radius) * Math.cos(lat1), Math.cos(d/radius) - Math.sin(lat1) * Math.sin(lat2));
    lat2 = toDegrees(lat2);
    lon2 = toDegrees(lon2);
    return [lat2, lon2];
}

//Math functions
function toDegrees(radians) {
    return radians * (180/Math.PI);
}
function toRadians(degrees) {
    return degrees * (Math.PI/180);
}