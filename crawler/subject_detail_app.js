var Login = require('./login');
var SubjectDetail = require('./subject_detail');
var system = require('system');
var args = system.args;

var email      = args[1];
var password   = args[2];
var subject_id = args[3];


var login = new Login(email, password);
var subjectDetail = new SubjectDetail(login, subject_id);

login.callback(function() {
    subjectDetail.perform();
});
subjectDetail.callback(function(section) {
    console.log(section);
    phantom.exit();
});
login.perform();
