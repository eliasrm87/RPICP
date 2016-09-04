(function() {
    "use strict"

    var resources = {
        fields: {
//             cpuUsage: {
//                 defaultVal: [],
//                 getter: 'getCpuUsage',
//             },
//             memTotal: {
//                 defaultVal: {},
//                 getter: 'getMemTotal',
//             },
//             memUsage: {
//                 defaultVal: [],
//                 getter: 'getMemUsage',
//             },
            diskUsage: {
                defaultVal: [],
                getter: 'getDiskUsage',
            }
        },

        getCpuUsage: function(){
            return $.ajax({
                type: "GET",
                dataType: 'json',
                url: resources.app.apiUri + "/api/cpuUsage",
                context: resources.fields.cpuUsage,
                data: { }
            });
        },

        getMemTotal: function(){
            return $.ajax({
                type: "GET",
                dataType: 'json',
                url: resources.app.apiUri + "/api/memTotal",
                context : resources.fields.memTotal,
                data: { }
            });
        },

        getMemUsage: function(){
            return $.ajax({
                type: "GET",
                dataType: 'json',
                url: resources.app.apiUri + "/api/memUsed",
                context : resources.fields.memUsage,
                data: { }
            });
        },

        getDiskUsage: function(){
            return $.ajax({
                type: "GET",
                dataType: 'json',
                url: resources.app.apiUri + "/api/diskUsed",
                context : resources.fields.diskUsage,
                data: { }
            });
        },
    }

    window.app.model.resources = resources;
})();
