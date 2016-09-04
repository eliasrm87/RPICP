"use strict"

var exec  = require('child_process').exec;

var diskUsage = [];

function process(error, stdout, stderr) {
    var lines = stdout.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var col = lines[i].split(/[\s,]+/);
        if (col.length == 6) {
            diskUsage[i] = {
                dev:   col[0],
                size:  col[1],
                used:  col[2],
                avail: col[3],
                use:   col[4],
                mount: col[5]
            };
        }
    }
}

exec('df | grep "^/dev/"', process);

setInterval(function() {
    exec('df | grep "^/dev/"', process);
}, 3600000);

module.exports = {
    usage: function() {
        return diskUsage;
    }
};
