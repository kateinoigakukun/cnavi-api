var Crawler = function(handlers) {
    this.handlers = handlers;
    this.page = require('webpage').create();
    this.init()
};
Crawler.prototype = {
    init: function() {
        var self = this;
        this.page.onInitialized = function() {
            self.page.evaluate(function() {
                document.addEventListener('DOMContentLoaded', function() {
                    window.callPhantom('DOMContentLoaded');
                }, false);
            });
        };
        this.page.onCallback = function(data){
            if (data === 'DOMContentLoaded') self.next();
        }
        this.page.onConsoleMessage = function(msg) {
            console.log(msg);
        }
    },
    next: function() {
        var func = this.handlers.shift();
        if (func !== undefined) {
            func();
        } else {
            this.page.onCallback = function(){};
        }
    },
    page: function() {
        this.init();
        return this.page
    }
};

module.exports = Crawler
