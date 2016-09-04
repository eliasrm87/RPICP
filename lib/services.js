"use strict"

var exec  = require('child_process').exec;

var services = [];

function process(error, stdout, stderr) {
    var lines = stdout.split('\n');
    services = [];
    for (var i = 0; i < lines.length; i++) {
        var col = lines[i].split(/[\[\]\s]+/);
        if (col.length == 3) {
            services[i] = {
                status: col[1],
                name:   col[2]
            };
        }
    }
}

var cmd = 'service --status-all';
exec(cmd, process);

setInterval(function() {
    exec(cmd, process);
}, 3600000);

module.exports = {
    services: function() {
        return services;
    }
};
