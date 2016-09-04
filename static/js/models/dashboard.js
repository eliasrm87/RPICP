(function() {
    "use strict"

    var dashboard = {
        poweroff: function() {
            $.ajax({
                dataType: "html",
                cache: false,
                url: dashboard.app.apiUri + "/api/poweroff"
            });
        },

        reboot: function() {
            $.ajax({
                dataType: "html",
                cache: false,
                url: dashboard.app.apiUri + "/api/reboot"
            });
        },
    }

    window.app.model.dashboard = dashboard;
})();
