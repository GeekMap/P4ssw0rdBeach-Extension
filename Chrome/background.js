// Copyright (c) 2014. All rights reserved.
// Use of this source code is governed by a MIT license that can be
// found in the LICENSE file.

var SERVER_URL = "SERVER_URL?";

function examinURL(url) {
    if (url.lastIndexOf("chrome://", 0) !== 0) {
        var _url = $.url(url);
        var _host = _url.attr('host');

        $.get(SERVER_URL + _host, function(ret){
            if (ret.result === "True") {
                showNotification(_host, ret.blogLink);
            }
        }, 'json');
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
    chrome.notifications.create('', opt, function(id) {});
    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
        if (buttonIndex === 0) {
            window.open(link);
        }
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.getSelected(null, function(tab) {
            examinURL(tab.url);
        });
    }
});
