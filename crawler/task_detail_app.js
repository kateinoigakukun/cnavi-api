var Login = require('./login');
var TaskDetail = require('./task_detail');
var system = require('system');
var args = system.args;

var email      = args[1];
var password   = args[2];
var subject_id = args[3]


var login = new Login(email, password);
var taskDetail = new TaskDetail(login, subject_id);

login.callback(function() {
    taskDetail.perform();
});
taskDetail.callback(function(section) {
    console.log(section);
    phantom.exit();
});
login.perform();
