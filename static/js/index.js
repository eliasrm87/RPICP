"use strict"

$(document).ready(function() {

    function _initController(controller, name, parent) {
        var root   = false;
        var active = false;

        if (!parent) {
            parent = app;
            root = true;
        } else {
            active = parent.active;
        }

        controller.app    = window.app;
        controller.name   = name;
        controller.root   = root;
        controller.active = active;
        controller.parent = parent;
        controller.model  = app.model[name];
        controller.index  = controller.index || function(){};
    }

    function _initModel(model, name) {
        model.app    = window.app;
        model.name   = name;
        model.data   = {};
        model.fields = model.fields || {};
    }

    function _render(htmlContainer, controller) {
        $.templates[controller.name].link(htmlContainer, controller.model.data);
        controller.htmlContainer = htmlContainer;

        if (app.activeController) {
            app.activeController.active = false;
        }
        app.activeController = controller;
        controller.active = true;

        console.log('Loading ' + controller.name + " model fields...")
        for(var name in controller.model.fields) {
            var field = controller.model.fields[name];
            field.name = name;
            field.data = controller.model.data;
            controller.model[field.getter]().done(function(data) {
                console.log(this.name + ' loaded.');
                $.observable(this.data).setProperty(this.name, data);
            });
        }

        controller.index();
    }

    var app = {
        session: {},
        controller: {},
        model: {},
        activeController: {},

        requiere: function(name, parent) {
            var deferred = $.Deferred();

            if (app.controller[name]) {
                console.log("Controller '" + name + "' allready available.");
                deferred.resolve();
            } else {
                console.log("Loading model '" + name + "'...")
                $.ajax({
                    dataType: "script",
                    cache: true,
                    url: "/js/models/" + name + ".js"
                }).done(function() {
                    console.log("Model '" + name + "' loaded.");
                    _initModel(app.model[name], name);
                    console.log("Loading controller '" + name + "'...")
                    $.ajax({
                        dataType: "script",
                        cache: true,
                        url: "/js/controllers/" + name + ".js"
                    }).done(function() {
                        console.log("Controller '" + name + "' loaded.");
                        _initController(app.controller[name], name, parent);
                        deferred.resolve();
                    });
                });
            }

            return deferred.promise();
        },

        render: function(htmlContainer, controller, parent) {
            var deferred = $.Deferred();

            var parent = parent || app;
            controller = parent.controller[controller];

            if ($.templates[controller.name]) {
                console.log("Template '" + controller.name + "' allready available.");
                _render(htmlContainer, controller);
                deferred.resolve();
            } else {
                console.log("Loading template '" + controller.name + "'...")
                $.ajax({
                    dataType: "html",
                    cache: true,
                    url: "/views/" + controller.name + ".html"
                }).done(function(data) {
                    console.log("Template '" + controller.name + "' loaded.");
                    $.templates(controller.name, data);
                    _render(htmlContainer, controller);
                    deferred.resolve();
                });
            }

            return deferred.promise();
        },
    };

    window.app = app;

    //Load APP
    console.log("Loading app...");
    $.ajax({
        dataType: "script",
        cache: true,
        url: "/js/app.js"
    }).done(function(data) {
        console.log("App loaded.");
    });

});
