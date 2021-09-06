
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
        const address_components = data.results[0].address_components;
        res = address_components[address_components.length - 1].long_name;
        result = res;
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
            let dateResult = new Date(tz.local_timestamp * 1000);
            let utc = '';
            utcValue = tz.raw_response.rawOffset / 3600;
            if (utcValue < 0) {
                utc = 'GMT-' + (-utcValue - 1);
            } else {
                utc = 'GMT+' + (utcValue - 1);
            }
            res = { utc: utc, heure: dateResult.getUTCHours() };
            result = res;
            return callback(result);
        }
    });
};

const getDistance = (origin, destination, units, callback) => {

    let result = 'null';
    let distance = require('google-distance-matrix');
    let origins = [origin];
    let destinations = [destination];
    distance.key(process.env.API_KEY);
    distance.units(units);
    distance.matrix(origins, destinations, function (err, distances) {
        if (err) {
            return callback(err);
        } else {
            // console.log(distances);
            result = distances.rows[0].elements[0].distance.text;
            return callback(result);
        }
    });
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
    
                    getDistance(origins, dest, req.body.units, function (distance) {
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
                        result_distance = { value: distance.split('km')[0], units: 'km' };
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
                        res.send(result);
                    });
                });
            });
        });
    });
};

module.exports = resultFormatter;
  