"use strict"

var route = require('koa-route');
var parse = require('co-body');
var koa   = require('koa');
var serve = require('koa-static');
var exec  = require('child_process').exec;

var app = koa();

var render    = require('./lib/render');
var cpuUsage  = require('./lib/cpuUsage');
var memUsage  = require('./lib/memUsage');
var diskUsage = require('./lib/diskUsage');
var services  = require('./lib/services');

app.use(serve('./static'));

//##################### ROUTES ######################

app.use(route.get('/api/cpuUsage', getCpuUsage));
app.use(route.get('/api/memTotal', getMemTotal));
app.use(route.get('/api/memUsed',  getMemUsed));
app.use(route.get('/api/diskUsed', getDiskUsed));
app.use(route.get('/api/services', getServices));
app.use(route.get('/api/poweroff', poweroff));
app.use(route.get('/api/reboot',   reboot));

//################## API FUNCTIONS ##################

function *poweroff() {
    var cmd = 'sudo poweroff';
    exec(cmd, function(error, stdout, stderr) {});
}

function *reboot() {
    var cmd = 'sudo reboot';
    exec(cmd, function(error, stdout, stderr) {});
}

function *getCpuUsage() {
    this.body = JSON.stringify(cpuUsage.usage());
}

function *getMemTotal() {
    this.body = JSON.stringify(memUsage.total());
}

function *getMemUsed() {
    this.body = JSON.stringify(memUsage.used());
}

function *getDiskUsed() {
    this.body = JSON.stringify(diskUsage.usage());
}

function *getServices() {
    this.body = JSON.stringify(services.services());
}

//###################### LISTEN ######################

app.listen(3000);
console.log('listening on port 3000');
