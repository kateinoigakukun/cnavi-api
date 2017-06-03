var express = require('express');
var phantomjs = require('phantomjs');
var router = express.Router();
var execSync = require('child_process').execSync;
var php_escapeshellarg = require('php-escape-shell').php_escapeshellarg;

/* GET home page. */
router.get('/subjects.json', function(req, res, next) {
    var cmd = phantomjs.path + " "
            + './crawler/subject_app.js' + " "
            + php_escapeshellarg(req.query.email) + " "
            + php_escapeshellarg(req.query.password);
    var subjects = execSync(cmd);
    if(subjects == "") return;
    res.json(JSON.parse(subjects));
});

router.get('/subjects/:id.json', function(req, res, next) {
    var cmd = phantomjs.path + " "
            + './crawler/subject_detail_app.js' + " "
            + php_escapeshellarg(req.query.email) + " "
            + php_escapeshellarg(req.query.password) + " "
            + php_escapeshellarg(req.params.id);
    var subject_detail = execSync(cmd);
    if(subject_detail == "") return;
    res.json(JSON.parse(subject_detail));
});

module.exports = router;
