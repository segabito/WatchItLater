// ==UserScript==
// @name        Onmyoji-2015
// @namespace   NICOVIDEO
// @description 動画プレイヤーがホラーに切り替わるのを防止する
// @include     http://www.nicovideo.jp/*
// @match       http://www.nicovideo.jp/*
// @version     2015.2
// @grant       none
// ==/UserScript==

(function() { return;

  var taisan = function() {
    var HorrorInitializer = require('watchapp/init/HorrorInitializer');
    HorrorInitializer.horror._isHorror = function() { return false; };
    HorrorInitializer.horror._update();
  };


  if (location.pathname.indexOf('/watch/') === 0) {
    (function() {
      var watchInfoModel = require('watchapp/model/WatchInfoModel').getInstance();
      if (watchInfoModel.initialized) {
        taisan();
      } else {
        var onReset = function() {
          watchInfoModel.removeEventListener('reset', onReset);
          window.setTimeout(function() {
            watchInfoModel.removeEventListener('reset', onReset);
            taisan();
          }, 0);
        };
        watchInfoModel.addEventListener('reset', onReset);
      }
    })();
 } else {
    (function() {
      var $ = window.jQuery;
      $('#horror2015header, [title^="閲覧注意な呼び声"]').remove();
    })();
 }

})();
