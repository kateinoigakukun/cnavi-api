var TaskDetail = function(session, subject_id) {
    this.crawler = session.crawler;
    this.page = this.crawler.page;
    this.subject_id = subject_id;
    this.init();
}

TaskDetail.prototype = {
    init: function() {
        this.crawler.handlers.push(this.handlers[0].bind(this));
        this.crawler.handlers.push(function(){  }.bind(this))
        this.crawler.handlers.push(this.handlers[1].bind(this));
        this.crawler.handlers.push(this.handlers[2].bind(this));
    },
    handlers: [
        function() {
            this.page.evaluate(function(id) {
                var subject_list = document.getElementsByClassName('wkt-block')[1]
                    .children[0].getElementsByTagName('li');

                for(var i = 0; i < subject_list.length; i++){

                    var inputs = subject_list[i].getElementsByClassName("w-col6")[0]
                    .getElementsByTagName("input");

                    var subject_id = inputs[4].value
                    if(subject_id == id) {
                        var folder_id = inputs[1].value;
                        post_submit_edit('ZX143SubCon',folder_id, '', '',subject_id,'')
                    }
                }
            }, this.subject_id);
        },
        function() {
            this.page.evaluate(function(){
                post_submit('ZX31DtlSubCon','2959744','25102881','detail', '0','','','','','0a7b9d6adfa2915e6ae0d39729c882a7');
            })
        },
        function() {
            var  = this.page.evaluate(function(){
                return document.body.innerHTML;
            });
            this.onComplete(html);
        }
    ],
    perform: function() {
        this.crawler.next()
    },
    callback: function(callback) {
        this.onComplete = callback;
    }
}
module.exports = TaskDetail

