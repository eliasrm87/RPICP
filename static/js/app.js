"use strict"

window.app.apiUri = "http://192.168.0.10:3000";

// Load all controllers and then call main function
$.when(
    window.app.requiere("dashboard"),
    window.app.requiere("resources")
).done(function () {
    //Main function

    //Menu callbacks
    $("#mnuResources").click(function() {
        window.app.render("#mainContent", "resources");
    });
    $("#mnuDashboard").click(function() {
        window.app.render("#mainContent", "dashboard");
    });

    //Render dashboard
    window.app.render("#mainContent", "dashboard");
});
