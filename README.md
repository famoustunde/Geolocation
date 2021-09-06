# Geolocation
## Gozem Test

## requierment
npm ; express ; mocha

## How to start the App
- Clone this repo [Default branch]

```$ gh repo clone famoustunde/Geolocation```

- Change Dir - install dependencies
```
$ cd geolocation 
$ npm install 
$ node index.js
```

## Unit Testing
### Open another terminal while running the service and run the following command
```
$ mocha
```

### API Testing

Send a post request to the route /api/distance_and_time with the payload : 
>{
>  start: { lat: 33.58831, lng: -7.61138 },
>  end: { lat: 35.6895, lng: 139.69171 },
>  units: "metric"
>}
