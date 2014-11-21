// ==UserScript==
// @name        NicoRequire
// @namespace   NICOVIDEO
// @description 広告ブロックやタイムアウトが発生しててもとりあえず動くようになる(かも)
// @include     http://www.nicovideo.jp/watch/*
// @version     1.0.7
// @grant       none
// @run-at      document-start
// ==/UserScript==

(function() {
  var now = Date.now();
  var past = function() { return Date.now() - now; };

  var Ads = {
    Advertisement: function() {
      return {set: function() {}};
    },
    SwitchView: function() {
    }
  };
  window.Ads = Ads;
  var enquete = {
    getRemainingMilliSecond: function() { return 0; },
    notifyLater: function() {},
    openEnqueteDirectly: function() {},
    removeNotification: function() {},
    insertNotification: function() {},
    cookie: {get: function() { return '';}, set: function() {}},
    errorLog: function() {},
    emitter: {
      on: function() {}
    }
  };
  window.enquete = enquete;

  setTimeout(function() {
    window.requirejs.config({
      waitSeconds: 120
    });

    var require = window.require || function() {};
    try {
      require(['Ads'], function() {
        console.log('%cAds required! %smsec', 'background: lightblue;', past());
      });
      require(['channel'], function() {
        console.log('%cchannel required! %smsec', 'background: lightblue;', past());
      });
//      require(['enquete'], function() {
//        console.log('%cenquete required! %smsec', 'background: lightblue;', past());
//      });
      require(['jquery.ui.datepicker-ja'], function() {
        console.log('%cdatepicker-ja required! %smsec', 'background: lightblue;', past());
      });
    } catch (e) {
      console.log('Exception!', e);
    }
  }, 1000);


  setTimeout(function() {
    var require = window.require || function() {};
    var define  = window.define || function() {};
    console.log('%cAds defined? %s', 'background: lightblue;', require.defined('Ads'));
    if (!require.defined('Ads')) {
      window.Ads = Ads;
      define('Ads', [], function() {
        window.Ads = Ads;
        return window.Ads;
      });
    }

    console.log('%cchannel defined? %s', 'background: lightblue;', require.defined('channel'));
    if (!require.defined('channel')) {
//      window.channel = {};
      define('channel', [], function() {
        return window.channel;
      });
    }

    console.log('%cenquete defined? %s', 'background: lightblue;', require.defined('enquete'));
    if (!require.defined('enquete')) {
      window.enquete = enquete;
      define('enquete', [], function() {
        window.enquete = enquete;
        return window.enquete;
      });
    }

    console.log('%cjquery.ui.datepicker-ja defined? %s', 'background: lightblue;', require.defined('jquery.ui.datepicker-ja'));
    if (!require.defined('jquery.ui.datepicker-ja')) {
      define('jquery.ui.datepicker-ja', [], function() {
        return undefined;
      });
    }

    enquete.openNotification = enquete.openEnqueteDirectly = enquete.notifyLater;
    enquete.getRemainingMilliSecond = function() { return 0; };
    enquete.openEnqueteDirectly = enquete.notifyLater

  }, 3000);

})();
