// ==UserScript==
// @name        EnqueteOkotowari
// @namespace   https://github.com/segabito/
// @description アンケートおことわり
// @include     http://www.nicovideo.jp/*
// @include     http://live.nicovideo.jp/*
// @include     http://seiga.nicovideo.jp/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
  var timer = null;
  var timeoutCounter = 0;

  var onTimer = function() {
    timeoutCounter++;
    if (window.enquete) {
      var enquete = window.enquete;

      enquete.openNotification = enquete.insertNotification = enquete.openEnqueteDirectly = enquete.notifyLater;
      enquete.getRemainingMilliSecond = function() { return 0; };
      enquete.openEnqueteDirectly = enquete.notifyLater
      enquete.notifyLater();

      window.clearInterval(timer);
    } else 
    if (timeoutCounter >= 1000) {
      window.clearInterval(timer);
    }
  };

  timer = window.setInterval(onTimer, 100);

})();