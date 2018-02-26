var Bleacon = require('bleacon');
var async = require('async');

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
