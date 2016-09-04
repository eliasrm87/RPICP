var libfs = require( 'fs' );

var readStat = function(cb) {
    libfs.readFile( "/proc/stat", function(err, data) {
        cb(data.toString());
    });
}

function cpuUsage(freq, cb) {

    if( typeof freq == 'function' ) {
        cb = freq;
        freq = 1000;
    }

    var prevTotal = [];
    var prevIdle  = [];
    var prevLoad  = [];

    setInterval(function() {
        readStat(function(data) {
            var lines = data.match(/cpu\d.*/g);
            for (i = 0; i < lines.length; i++) {
                var dRaw = lines[i].split(' ');

                var d = [];
                var idx = 1;
                var count = 0;
                while( count < 4 ) {
                    var t = parseInt(dRaw[idx]);
                    if(t) {
                        count++;
                        d.push(t);
                    }
                    idx++;
                }

                var idle  = d[3];
                var total = d[0] + d[1] + d[2];
                var load  = 0;

                if(prevTotal[i] != 0) {
                    load = Math.round((total - prevTotal[i]) / (total + idle - prevTotal[i] - prevIdle[i]) * 100);
                }

                prevLoad[i]  = load || 0;
                prevTotal[i] = total;
                prevIdle[i]  = idle;
            }

            if(cb)
                cb(prevLoad);

        });
    }, freq || 1000);
};

module.exports = cpuUsage;
