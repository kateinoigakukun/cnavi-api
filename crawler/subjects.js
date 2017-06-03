// parameters: session: Login
var Subjects = function(session) {
    this.crawler = session.crawler;
    this.page = this.crawler.page;

    this.init()
}
Subjects.prototype = {
    init: function() {
        this.crawler.handlers.push(this.parseSubject.bind(this));
    },
    parseSubject: function() {
        var self = this;

        var subject_info = self.page.evaluate(function() {
            var subject_list = document.getElementsByClassName('wkt-block')[1]
                .children[0].getElementsByTagName('li');

            var subject_info = [];

            for(var i = 0; i < subject_list.length; i++){

                var inputs = subject_list[i].getElementsByClassName("w-col6")[0]
                    .getElementsByTagName("input");

                var info = {
                    folder_id:    inputs[1].value,
                    subject_name: inputs[2].value,
                    subject_id:   inputs[4].value
                };
                subject_info.push(info);
            }
            return JSON.stringify(subject_info);
        });
        self.onComplete(subject_info);
    },
    perform: function() {
        this.crawler.next()
    },
    callback: function(callback) {
        this.onComplete = callback;
    }
}

module.exports = Subjects
