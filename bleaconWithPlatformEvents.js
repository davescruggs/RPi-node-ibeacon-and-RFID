//'use strict'
// disabling strict mode
var Bleacon = require('bleacon');
var async = require('async');
var nforce = require('nforce');
var oauth; 

// the environment variables are:
// SFDC_USER SFDC_PASS SFDC_DEVTOKEN CLIENT_ID CLIENT_SECRET

if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').load();
}

var org = nforce.createConnection({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    environment: 'production',
    autoRefresh: true
});

var postAssetEvent = function (beacon) {
    console.log('sending beacon signal to SFDC');
    var event = nforce.createSObject('ACC_Event__e');
    event.set('Auto_Bay_UID__c', 'FFEE99AA44');
    event.set('Part_UID__c', Bleacon.uuid);
    event.set('Part_Major__c', Bleacon.major);
    event.set('Part_Minor__c', Bleacon.minor);
    event.set('Proximity__c', Bleacon.proximity);
    event.set('RSSI__c', Bleacon.rssi);
    event.set('Accuracy__c', Bleacon.accuracy);
    event.set('measuredPower__c', Bleacon.measuredPower);
    org.insert({
        sobject: event, oauth: oauth
    }, err => {
        if (err) {
            console.error('ACC_Event__e failed to send');
            console.error(JSON.stringify(err));
        } else {
            console.log("ACC_Event__e published");
        }
    });

};

org.authenticate({
    username: process.env.SFDC_USER,
    password: process.env.SFDC_PASS,
    securityToken: process.env.SFDC_DEVTOKEN
}, function (err, authResp) {
    if (err) return console.log(err);

    console.log('--> authenticated!');
    oauth = authResp;

    Bleacon.on('discover', function (beacon) {
        // check for local beacons: 
        console.log('discovered beacon:\n', JSON.stringify(beacon, null, 2));
        postAssetEvent(beacon);
    });

    Bleacon.on('found', function (beacon) {
        // check for local beacons: 
        console.log('found beacon:\n', JSON.stringify(beacon, null, 2));
        postAssetEvent(beacon);
    });

    Bleacon.on('updated', function (beacon) {
        // check for local beacons: 
        console.log('updated beacon:\n', JSON.stringify(beacon, null, 2));
        postAssetEvent(beacon);
    });

    Bleacon.on('lost', function (beacon) {
        // check for local beacons: 
        console.log('updated beacon:\n', JSON.stringify(beacon, null, 2));
        postAssetEvent(beacon);
    });

    Bleacon.startScanning();

});