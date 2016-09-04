"use strict"

var libfs = require( 'fs' );

var memTotal = {};
var memUsed  = [];

function process(data) {
    memUsed.push({
        time:     new Date().getTime(),
        memUsed:  memTotal.memTotal  - data.match(/MemAvailable: *(\d+) +kB/)[1],
        swapUsed: memTotal.swapTotal - data.match(/SwapFree: *(\d+) +kB/)[1]
    });

    if (memUsed.length > 60) {
        memUsed.shift();
    }
}

function readMemInfo(cb) {
    libfs.readFile( "/proc/meminfo", function(err, data) {
        cb(data.toString());
    });
}

readMemInfo(function(data) {
    memTotal = {
        memTotal:     data.match(/MemTotal: *(\d+) +kB/)[1],
        swapTotal:    data.match(/SwapTotal: *(\d+) +kB/)[1]
    };

    process(data);
});

setInterval(function() {
    readMemInfo(process);
}, 10000);

module.exports = {
    total: function() {
        return memTotal;
    },
    used: function() {
        return memUsed;
    }
};
