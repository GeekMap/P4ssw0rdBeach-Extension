// Copyright (c) 2014. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

var SERVER_URL = "https://api.parse.com/1/functions/checkSite";

function examinURL(url) {
    if (url.lastIndexOf("chrome://", 0) !== 0) {
        var _url = $.url(url);
        var _host = _url.attr('host');

        $.ajax({
            url: SERVER_URL,
            type: 'post',
            data: {
                host: _host
            },
            headers: {
                "X-Parse-Application-Id": 'XnAAlFezFWCLdH6JhPSwpLxHZ0RPZ0lWkPzw4vgn',
                "X-Parse-REST-API-Key": 'lU5DnlKlkfQEasqKinwjqSyOYXegHbBNB8S8qi85'
            },
            dataType: 'json',
            success: function (ret) {
                if (ret.result.plainPwd === "True") {
                    showNotification(_host, ret.result.blogLink);
                }
            }
        });
    }
}

function showNotification(siteUrl, link) {
    var opt = {
        type: "basic",
        title: "Naked Password!",
        message: "This site \"" + siteUrl + "\" store the password as plain text! ",
        iconUrl: "icon.png",
        buttons: [{"title": "Go to blog page"}],
    };

    id = "nudepwd_" + link;
    chrome.notifications.create(id, opt, null);
}

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    var id_link = notificationId.split("_");
    var id = id_link[0];
    var link = id_link[1];

    if (id == "nudepwd" && buttonIndex === 0) {
        window.open(link);
    }

    chrome.notifications.clear(notificationId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.getSelected(null, function(tab) {
            examinURL(tab.url);
        });
    }
});
