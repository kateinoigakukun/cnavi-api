var Login    = require('./login');
var Subjects = require('./subjects');
var system   = require('system');
var args     = system.args;

var email    = args[1];
var password = args[2];

var login    = new Login(email, password);
var subjects = new Subjects(login);

login.callback(function() {
    subjects.perform();
});
subjects.callback(function(sbj) {
    console.log(sbj);
    phantom.exit();
});
login.perform();
