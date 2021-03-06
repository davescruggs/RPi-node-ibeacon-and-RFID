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
    event.set('Auto_Bay_UID__c', '1N6DD26T24C419049'); // Vehicle 100 000
    event.set('Part_UID__c', beacon.uuid);
    event.set('Part_Major__c', beacon.major);
    event.set('Part_Minor__c', beacon.minor);
    event.set('Proximity__c', beacon.proximity);
    event.set('RSSI__c', beacon.rssi);
    event.set('Accuracy__c', beacon.accuracy);
    event.set('measuredPower__c', beacon.measuredPower);
    if( beacon.uuid == '2f234454cf6d4a0fadf2f4911ba9ffa6') {
       console.log('vehicle entering bay');
       event.set('VIN__c', '1N6DD26T24C419049'); // otherwise VIN is not set;
    } else {
       event.set('VIN__c', ''); // otherwise VIN is not set;
       console.log('tire detected');
    }
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
