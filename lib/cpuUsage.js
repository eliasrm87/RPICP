"use strict"

var libfs = require( 'fs' );

var cpuUsage  = [];

var prevTotal = [];
var prevIdle  = [];
var prevLoad  = [];

function process(data) {
    var lines = data.match(/cpu\d.*/g);
    for (var i = 0; i < lines.length; i++) {
        var dRaw = lines[i].split(' ');

        var idle  = parseInt(dRaw[4]);
        var total = parseInt(dRaw[1]) + parseInt(dRaw[2]) + parseInt(dRaw[3]);
        var load  = 0;

        if(prevTotal[i] != 0) {
            load = Math.round((total - prevTotal[i]) / (total + idle - prevTotal[i] - prevIdle[i]) * 100);
        }

        prevLoad[i]  = load || 0;
        prevTotal[i] = total;
        prevIdle[i]  = idle;
    }

    var usage = {};
    var time = new Date().getTime();
    for (var i = 0; i < prevLoad.length; i++) {
        usage['time'] = time;
        usage[i] = prevLoad[i];
    };

    cpuUsage.push(usage);
    if (cpuUsage.length > 60) {
        cpuUsage.shift();
    }
}

function readStat(cb) {
    libfs.readFile( "/proc/stat", function(err, data) {
        cb(data.toString());
    });
}

readStat(process);

setInterval(function() {
    readStat(process);
}, 10000);

module.exports = {
    usage: function() {
        return cpuUsage;
    }
};
