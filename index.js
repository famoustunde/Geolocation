const express = require('express');
require("dotenv").config();
const resultFormatter = require('./src/geofunctions');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Server is running on port : ',port);
})

// define a base route
app.get('/home', (req, res) => {
  return res.json({
    'message': 'Welcome to GoZem Test API ',
    'error': false
  });
});

app.post('/api/get_distance_and_time', (req, res) => {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      'message': 'Define properties in body',
      'error': true
    });
  } else if (
    req.body.hasOwnProperty('start') &&
    req.body.hasOwnProperty('end') &&
    req.body.hasOwnProperty('units')
  ) {
    resultFormatter(req, res);
  } else {
    return res.status(400).json({
      'message': 'Verify properties',
      'error': true
    });
  }
});
