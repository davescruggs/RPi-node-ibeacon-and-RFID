var Bleacon = require('bleacon');
var async = require('async');
var nforce = require('nforce'); 

// the environment variables are:
// SFDC_USER SFDC_PASS SFDC_DEVTOKEN CLIENT_ID CLIENT_SECRET

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var org = nforce.createConnection({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: process.env.NODE_ENV
});



Bleacon.on('discover', function(beacon) {
    // check for local beacons: 
    console.log('discovered beacon:\n', JSON.stringify(beacon, null, 2)); 
});

Bleacon.on('found', function(beacon) {
    // check for local beacons: 
    console.log('found beacon:\n', JSON.stringify(beacon, null, 2)); 
});

Bleacon.on('updated', function(beacon) {
    // check for local beacons: 
    console.log('updated beacon:\n', JSON.stringify(beacon, null, 2)); 
});

Bleacon.on('lost', function(beacon) {
    // check for local beacons: 
    console.log('updated beacon:\n', JSON.stringify(beacon, null, 2)); 
});

Bleacon.startScanning();
