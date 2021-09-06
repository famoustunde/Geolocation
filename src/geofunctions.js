
const getCountry = (latitude, longitude, callback) => {
    
    let geocoding = new require('reverse-geocoding-google');
    let result = 'null';
    let params = {
      latitude: latitude,
      longitude: longitude,
      //due to .env not being shipped to the git
      key: process.env.API_KEY || "AIzaSyBrRh0NjtrSopoOrG-4_W3OP0nmzSDQK-M",
    };
    geocoding.location(params, function (err, data) {
      if (err) {
        return callback(null, err);
      } else {
        //   console.log(data.results[0].address_components);
        const address_components = data.results[0].address_components;
        res = address_components[address_components.length - 2].long_name;
        result = res;
        console.log("location : " + result);
        return callback(result);
      }
    });
};

  
const getTimeZoneDetails = (latitude, longitude, callback) => {
    
    let result = 'null';
    let timezone = require('node-google-timezone');
    let timestamp = Date.now() / 1000;
    timezone.key(process.env.API_KEY);
    timezone.data(latitude, longitude, timestamp, function (err, tz) {
        if (err) {
            return callback(err);
        } else {
            let date = new Date(tz.local_timestamp * 1000);
            let utc = '';
            utcValue = tz.raw_response.rawOffset / 3600;
            // console.log(dateResult);
            if (utcValue == 0) {
                utc = 'GMT+' + ("1");
            }else if (utcValue < 0) {
                utc = 'GMT-' + (-utcValue - 1);
            } else {
                utc = 'GMT+' + (utcValue);
            }
            res = { utc: utc , heure: date.getUTCHours()};
            result = res;

            console.log("timezone : " + result.utc)
            return callback(result);
        }
    });
};

/**
 * Converts degrees to radians.
 * 
 * @param degrees Number of degrees.
 */
 function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

/**
 * Returns the distance between 2 points of coordinates in Google Maps
 * 
 * @see https://stackoverflow.com/a/1502821/4241030
 * @param lat1 Latitude of the point A
 * @param lng1 Longitude of the point A
 * @param lat2 Latitude of the point B
 * @param lng2 Longitude of the point B
 */
function getDistanceBetweenPoints(lat1, lng1, lat2, lng2){
    // The radius of the planet earth in meters
    let R = 6378137;
    let dLat = degreesToRadians(lat2 - lat1);
    let dLong = degreesToRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2)
            *
            Math.sin(dLat / 2) 
            +
            Math.cos(degreesToRadians(lat1)) 
            * 
            Math.cos(degreesToRadians(lat1)) 
            *
            Math.sin(dLong / 2) 
            * 
            Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    return distance;
}

const getDistance = (origin, destination, cb) => {

    let result = 'null';
    let originsLat = origin[0];
    let destinationsLat = destination[0];
    let originsLong = origin[1];
    let destinationsLong = destination[1];
    result = getDistanceBetweenPoints(originsLat, originsLong, destinationsLat, destinationsLong) * 0.001;

    return result;
};
  
const resultFormatter = (req, res) => {
    
    start = req.body.start;
    end = req.body.end;
    
    getCountry(start.lat, start.lng, function (startCountry) {
    
        getCountry(end.lat, end.lng, function (endCountry) {
    
            getTimeZoneDetails(start.lat, start.lng, function (startTz) {
    
                getTimeZoneDetails(end.lat, end.lng, function (endTz) {
    
                    origins = [start.lat, start.lng];
                    dest = [end.lat, end.lng];
    
                    let distanceReturned = getDistance(origins, dest);

                    result_start = {
                        country: startCountry,
                        timezone: startTz.utc,
                        location: { lat: start.lat, lng: start.lng }
                    };
                    result_end = {
                        country: endCountry,
                        timezone: endTz.utc,
                        location: { lat: end.lat, lng: end.lng }
                    };
                    result_distance = { value: distanceReturned, units: 'km' };
                    result_timedif = {
                        value: Math.abs(endTz.heure - startTz.heure),
                        units: 'hours'
                    };
                    result = {
                        start: result_start,
                        end: result_end,
                        distance: result_distance,
                        time_diff: result_timedif
                    };
                    console.log(result);
                    res.send(result);
                });
            });
        });
    });
};

module.exports = resultFormatter;
  