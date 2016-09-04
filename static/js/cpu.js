$(function() {

    var ykeys = [];
    var labels = [];

    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "./cpuusage",
        data: { }
        })
        .done(function(data) {
            var i = 0;
            for(var prop in data[0]) {
                ykeys.push(i);
                labels.push('CPU ' + i)
                ++i;
            }
            ykeys.pop();
            labels.pop();
        })
        .fail(function() {
            console.log( "Error getting CPU usage" );
    });


    var chart = Morris.Area({
        element: 'topchart',
        pointSize: 0,
        hideHover: true,
        ymax: 100,
        smooth: false,
        behaveLikeLine: true,
        postUnits: '%',
        data: [],
        xkey: 'time',
        ykeys: ykeys,
        labels: labels
    });

    function getCpuUsage(){
        var query = $.ajax({
        type: "GET",
        dataType: 'json',
        url: "./cpuusage",
        data: {}
        })
        .done(function(data) {
            setTimeout(function(){getCpuUsage();}, 10000);
            console.log(data);
            chart.setData(data);
        })
        .fail(function() {
            console.log( "Error getting CPU usage" );
        });
    }

    getCpuUsage();

});
