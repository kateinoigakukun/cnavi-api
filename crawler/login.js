var Crawler = require('./crawler');

var Login = function(email, password) {
    this.email = email;
    this.password = password;
    this.crawler = new Crawler([]);
    this.page = this.crawler.page;

    this.init()
};

Login.prototype = {
    init: function() {
        var self = this;
        this.crawler.handlers = [
            function() {
                self.page.open('https://cnavi.waseda.jp/');
            },
            function() {
                var account = {
                    email: self.email,
                    password: self.password
                }
                self.page.evaluate(function(account) {
                    document.getElementsByName('id')[0].value = account.email;
                    document.getElementsByName('password')[0].value = account.password;
                    document.querySelector('form').submit();
                }, account);
            },
            function() {
            },
            function() {
                self.page.evaluate(function() {
                   // tab_submit('ZX14SubCon','list');
                });
                self.onComplete()
            }
        ]
    },
    perform: function() {
        this.crawler.next()
    },
    callback: function(callback) {
        this.onComplete = callback;
    }
}

module.exports = Login
