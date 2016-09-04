(function() {
    "use strict"

    var cpuChartCfg = {
        element: 'cpuChart',
        pointSize: 0,
        hideHover: true,
        ymax: 100,
        smooth: false,
        behaveLikeLine: true,
        postUnits: '%',
        data: [],
        xkey: 'time',
    };

    var memChartCfg = {
        element: 'memChart',
        pointSize: 0,
        hideHover: true,
        smooth: false,
        behaveLikeLine: true,
        postUnits: 'kB',
        data: [],
        xkey: 'time',
        ykeys: ['memUsed'],
        labels: ['Used']
    };

    var swapChartCfg = {
        element: 'swapChart',
        pointSize: 0,
        hideHover: true,
        smooth: false,
        behaveLikeLine: true,
        postUnits: 'kB',
        data: [],
        xkey: 'time',
        ykeys: ['swapUsed'],
        labels: ['Used']
    };

    var resources = {
        index: function() {
            console.log("Resources index");
            this.updateCpuUsage();
            this.updateMemUsage();
        },

        updateCpuUsage: function() {
            resources.model.getCpuUsage()
            .done(function(data) {
                cpuChartCfg.ykeys = [];
                cpuChartCfg.labels = [];

                var i = 0;
                for(var prop in data[0]) {
                    cpuChartCfg.ykeys.push(i);
                    cpuChartCfg.labels.push('CPU ' + i)
                    ++i;
                }
                cpuChartCfg.ykeys.pop();
                cpuChartCfg.labels.pop();

                var cpuChart = Morris.Area(cpuChartCfg);

                cpuChart.setData(data);
            })
            .fail(function() {
                console.log( "Error getting CPU usage" );
            });
        },

        updateMemUsage: function() {
            resources.model.getMemTotal()
                .done(function(data) {
                    memChartCfg.ymax = data.memTotal;
                    swapChartCfg.ymax = data.swapTotal;
                    var memChart  = Morris.Area(memChartCfg);
                    var swapChart = Morris.Area(swapChartCfg);

                    resources.model.getMemUsage()
                        .done(function(data) {
                            memChart.setData(data);
                            swapChart.setData(data);
                        })
                        .fail(function() {
                            console.log( "Error getting memory usage" );
                        });
                })
                .fail(function() {
                    console.log( "Error getting total memory" );
                });
        },
    };

    window.app.controller.resources = resources;
})();
