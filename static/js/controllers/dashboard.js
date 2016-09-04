(function() {
    "use strict"

    var dashboard = {
        index: function() {
            console.log("Dashboard index");
            $("#poweroff i").click(this.model.poweroff);
            $("#reboot i").click(this.model.reboot);
        },
    };

    window.app.controller.dashboard = dashboard;
})();
