// ==UserScript==
// @name        DontSetupLazy
// @namespace   https://github.com/segabito/
// @description 動画のロードを待たずに初期化する
// @include     http://www.nicovideo.jp/watch/*
// @version     0.4
// @grant       none
// ==/UserScript==

(function() {

  if (window.WatchJsApi) {
    var require = window.require;
    require(['watchapp/model/WatchInfoModel', 'lodash', 'prepareapp/PlayerStartupObserver'], function(WatchInfoModel, _, pso) {
      var watchInfoModel = WatchInfoModel.getInstance();
      if (!watchInfoModel.initialized) {
        console.log('%cinitialize Immediately', 'background: lightgreen;');

        window.setTimeout(function() {
          if (pso._executed) {
            return;
          }
          console.time('initialize Immediately');
          pso._executed = true;
          pso._dispatch();
          console.timeEnd('initialize Immediately');
        }, 0);
      }
    });
  }
 })();
