var Login = require('./login');
var Subjects = require('./subjects');

var login = new Login('YOUR_EMAIL', 'YOUR_PASSWORD');
var subjects = new Subjects(login);

login.callback(function() {
    subjects.perform();
});
subjects.callback(function(sbj) {
    console.log(sbj);
    phantom.exit();
});
login.perform();
