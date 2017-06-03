var Subjects = require("./subjects");
var SubjectDetail = function(session, subject_id) {
    this.crawler = session.crawler;
    this.page = this.crawler.page;
    this.subject_id = subject_id
    this.init();
}

SubjectDetail.prototype = {
    init: function() {
        this.crawler.handlers.push(this.handlers[0].bind(this));
        this.crawler.handlers.push(function(){
        }.bind(this))
        this.crawler.handlers.push(this.handlers[1].bind(this));
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
            var sections = this.page.evaluate(this.parseData);
            this.onComplete(sections);
        }
    ],
    parseData: function() {

        String.prototype.removeln = function() {
            return this.replace(/\\n/g, "").replace(/\n/g, "")
        }

        var subject_id = document.getElementsByName("hidPankuzuSessionKey")[0].value;
        var sections = function(subject_id) {
            var list = document.getElementById("pattern").children;
            var sections = [];
            for(var i = 0; i < list.length; i++) {
                if(list[i].nodeName != "DIV") continue;
                var ul = list[i].getElementsByTagName("ul");
                var section = {
                    title: list[i].getElementsByClassName("ta1col-left")[0].title.removeln(),
                    subject_id: subject_id,
                    tasks: []
                }
                sections.push(section);
                if(ul.length == 0) continue;
                var tasks = ul[1].children;
                for(var l = 0; l < tasks.length; l++) {
                    var task = {
                        element: tasks[l]
                    }
                    section.tasks.push(task);
                }
            }
            return sections
        }(subject_id)

        function processAttTask(task) {
            task.title = task.element.getElementsByClassName("ta1col-left")[0].innerText.removeln();
            if(task.title.indexOf("添付ファイル") != -1) {
                var attachments = task.element.getElementsByClassName("c-explan-l")[0]
                .getElementsByClassName("c-attfile");
                task.isAtt = true;
                task.content = null;
                task.atts = [];
                for(var t = 0; t < attachments.length; t++) {
                    var argument = (attachments[t].onclick + '').replace(/\n/g,"")
                    .replace(/.+mncn201302009_submit\((.+)\);}/,'$1').split(',');
                    var att = {
                        control:     argument[0],
                        folder_id:   argument[1],
                        contents_id: argument[2],
                        file_id:     argument[3],
                        toolbar:     argument[4],
                        file_name:   decodeURIComponent(argument[5]),
                        admission:   argument[6]
                    };
                    task.atts.push(att);
                }
            }else if(task.title.indexOf("講義概要") != -1){
                var content = task.element.getElementsByClassName("c-tedit")[0].innerText;
                task.content = content;
                task.atts = null;
                task.isAtt = false;
            }
        }

        function processTask(task) {
            if(task.element.children.length == 1) {
                processAttTask(task)
                delete task['element'];
            } else {
                var aTag = task.element.getElementsByTagName("a")[0];
                if(!aTag) {
                    var title = task.element.getElementsByClassName("ta1col-left")[0].title;
                    task.title = title;
                    delete task['element'];
                    return;
                }
                task.trans = aTag.onclick;
                task.title = aTag.innerText.removeln();

                var metaData = task.element.getElementsByClassName("ta1col-right")[0]
                .getElementsByTagName("span");
                task.teacher = metaData[0].innerText.removeln();
                task.period  = metaData[1].innerText.removeln();
                var argument = (aTag.onclick + '')
                .replace(/\n/g,"")
                .replace(/.+post_submit\((.+)\);}/,'$1')
                .split(',');
                task.control        = argument[0];
                task.folder_id      = argument[1];
                task.contents_id    = argument[2];
                task.list_mode      = argument[3];
                task.new_flg        = argument[4];
                task.page_clear_flg = argument[5];
                task.func_type      = argument[6];
                task.toolbar        = argument[7];
                task.simple_type    = argument[8];
                task.admission      = argument[9];
                delete task['element'];
            }
        }

        for(var i = 0; i < sections.length; i++) {
            var section = sections[i];
            for(var l = 0; l < section.tasks.length; l++) {
                var task = section.tasks[l];
                task.subject_id = subject_id;
                processTask(task)
            }
        }
        return JSON.stringify(sections);
    },
    perform: function() {
        this.crawler.next()
    },
    callback: function(callback) {
        this.onComplete = callback;
    }
}
module.exports = SubjectDetail
