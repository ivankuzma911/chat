define(["../frontend/scripts/libs/mustache.js", "../frontend/scripts/libs/jquery.js"], function (Mustache) {
    return {
        settings: {
            messageArea: $("#messagesArea"),
            template: $('#template').html(),
            moreButton: $("#moreButton"),
            sayButton: $("#sayButton"),
            inputText: $("#newMessage"),
            path: '../backend/request.php',
            lastId: 0,
            prevId: 0,
            username: ""
        },

        init: function () {
            this.settings.username = prompt("Your username");
            this.getMessages();
            this.makeEventListeners()
        },

        /*
         * Gets last 5 messages from db
         */
        getMessages: function () {
            var self = this;
            $.get(self.settings.path + '?getMessages=true', function (data) {
                self.settings.messageArea.append(Mustache.render(self.settings.template, JSON.parse(data)));
                self.checkId(JSON.parse(data));
            });
            window.setInterval(function () {
                self.newMessage()
            }, 1000);
        },

        /*
         * Applies event listeners for more button and say button
         */
        makeEventListeners: function () {
            var self = this;
            self.settings.moreButton.click(function () {
                $.get(self.settings.path + '?getMessages=' + self.settings.prevId, function (data) {
                    self.settings.messageArea.append(Mustache.render(self.settings.template, JSON.parse(data)));
                    self.checkId(JSON.parse(data));
                });
            });

            self.settings.sayButton.click(function () {
                $.post(self.settings.path, {
                    username: self.settings.username,
                    text: self.settings.inputText.val()
                });
                self.settings.inputText.val("");
            });
        },

        /*
         * Checks for new message in db
         */
        newMessage: function () {
            var self = this;
            $.get(self.settings.path + "?newMessage=" + self.settings.lastId, function (data) {
                if (data != "false") {
                    self.settings.messageArea.prepend(Mustache.render(self.settings.template, JSON.parse(data)));
                    self.checkId(JSON.parse(data));
                }
            });

        },

        /*
         * sets module's params depending on loaded messages
         */
        checkId: function (data) {
            data = data['messages'];
            var self = this;
            for (var i = 0; i < data.length; i++) {
                if (self.settings.lastId < data[i].id) {
                    self.settings.lastId = data[i].id;
                }
                if (self.settings.prevId == 0) {
                    self.settings.prevId = data[i].id;
                }
                if (self.settings.prevId > data[i].id) {
                    self.settings.prevId = data[i].id;
                }
            }
        }
    }
});
