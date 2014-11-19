// ==UserScript==
// @name        NicoGamepad
// @namespace   https://github.com/segabito/
// @description ゲームパッドで操作するやつ
// @include     http://www.nicovideo.jp/watch/*
// @include     http://www.nicovideo.jp/my/video*
// @version     1.0.0
// @grant       none
// ==/UserScript==

(function() {

  var monkey = function() {
    if (!window.navigator.getGamepads) {
      window.console.log('%cGamepad APIがサポートされていません', 'background: red; color: yellow;');
      return;
    }

    var require = window.require || function() {};
    var define = window.define || function() {};
    var _ = require('lodash');
    var emitter = require('cjs!emitter');
    var inherit = require('cjs!inherit');

    var debugMode = true;
    var console = debugMode ? window.console : {log: _.noop, time: _.noop, timeEnd: _.noop, trace: _.noop};

    define('nicogamepad/config', [], function() {
      var config = {
      };
//      var PREFIX = 'NicoGamepad_';
      var get = function(name) {
        return config.hasOwnProperty(name) ? config[name] : null;
      };
      var set = function(name, value) {
        if (config.hasOwnProperty(name)) {
          config[name] = value;
        }
      };
      return {
        get: get,
        set: set
      };
    });

    define('nicogamepad/PollingTimer', ['lodash'], function(_) {
      var id = 0;
      var PollingTimer = function(callback, interval) {
        this._id = id++;
        this.initialize(callback, interval);
      };
      _.assign(PollingTimer.prototype, {
        initialize: function(callback, interval) {
          this._timer = null;
          this._callback = callback;
          if (typeof interval === 'number') {
            this.changeInterval(interval);
          }
        },
        changeInterval: function(interval) {
          if (this._timer) {
            if (this._currentInterval === interval) {
              return;
            }
            window.clearInterval(this._timer);
          }
          console.log('%cupdate Interval:%s', 'background: lightblue;', interval);
          this._currentInterval = interval;
          this._timer = window.setInterval(this._callback, interval);
        },
        pause: function() {
          window.clearInterval(this._timer);
          this._timer = null;
        },
        start: function() {
          if (typeof this._currentInterval !== 'number') {
            return;
          }
          this.changeInterval(this._currentInterval);
        }
      });
      return PollingTimer;
    });

    define('nicogamepad/GamepadModel',
      ['jquery', 'cjs!emitter', 'cjs!inherit', 'WatchApp'],
      function($, emitter, inherit, WatchApp) {

      var GamepadModel = function(gamepadStatus) {
        this._gamepadStatus = gamepadStatus;
        this._buttons = [];
        this._axes = [];
        this.initialize(gamepadStatus);
      };
      inherit(GamepadModel, emitter);

      _.assign(GamepadModel.prototype, {
        initialize: function(gamepadStatus) {
          this._buttons.length = gamepadStatus.buttons.length;
          this._axes.length = gamepadStatus.axes.length;
          this._id = gamepadStatus.id;
          this._index = gamepadStatus.index;
          this.reset();
        },
        reset: function() {
          var i, len;

          for (i = 0, len = this._gamepadStatus.buttons.length; i < len; i++) {
            this._buttons[i] = 0;
          }
          for (i = 0, len = this._gamepadStatus.axes.length; i < len; i++) {
            this._axes[i] = 0;
          }
        },
        update: function(gp) {
          var gamepadStatus = gp || this._gamepadStatus, buttons = gamepadStatus.buttons, axes = gamepadStatus.axes;
          if (gp) { this._gamepadStatus = gp; }
          var i, len;

          for (i = 0, len = this._buttons.length; i < len; i++) {
            var buttonStatus = buttons[i].pressed ? 1 : 0;
            if (this._buttons[i] !== buttonStatus) {
              var eventName = (buttonStatus === 1) ? 'onButtonDown' : 'onButtonUp';
//              console.log('%cbutton%s:%s', 'background: lightblue;', i, buttonStatus, 0);
              this.emit(eventName, i, 0);
              this.emit('onButtonStatusChange', i, buttonStatus);
            }
            this._buttons[i] = buttonStatus;
          }
          for (i = 0, len = this._axes.length; i < len; i++) {
            var axis = Math.round(axes[i] * 1000) / 1000;
            if (Math.round(Math.abs(axis - this._axes[i])) >= 1) {
//              console.log('%c%s %s', 'background: lightblue;', 'onAxisChange', i, axis, 0);
              this.emit('onAxisChange', i, axis);
              if (axis <= 0.05) {
                this.emit('onAxisRelease', i);
                this.emit('onAxisRelease', i);
              }
              this._axes[i] = axis;
            }
          }
        },
        dump: function() {
          var gamepadStatus = this._gamepadStatus, buttons = gamepadStatus.buttons, axes = gamepadStatus.axes;
          var i, len, btmp = [], atmp = [];
          for (i = 0, len = axes.length; i < len; i++) {
            atmp.push('ax' + i + ': ' + axes[i]);
          }
          for (i = 0, len = buttons.length; i < len; i++) {
            btmp.push('bt' + i + ': ' + (buttons[i].pressed ? 1 : 0));
          }
          return atmp.join('\n') + '\n' + btmp.join(', ');
        },
        getX: function() {
          return this._axes.length > 0 ? this._axes[0] : 0;
        },
        getY: function() {
          return this._axes.length > 1 ? this._axes[1] : 0;
        },
        getZ: function() {
          return this._axes.length > 2 ? this._axes[2] : 0;
        },
        getButtonCount: function() {
          return this._buttons ? this._buttons.length : 0;
        },
        getButtonStatus: function(index) {
          return this._buttons[index] || 0;
        },
        getAxisCount: function() {
          return this._axes ? this._axes.length : 0;
        },
        getAxisValue: function(index) {
          return this._axes[index] || 0;
        },
        isConnected: function() {
          return !!this._gamepadStatus.connected;
        },
        getDeviceIndex: function() {
          return this._index;
        },
        getDeviceId: function() {
          return this._id;
        },
        release: function() {
          // TODO: clear events
        }
      });

      return GamepadModel;
    });

    define('nicogamepad/gamepad',
      ['jquery', 'nicogamepad/PollingTimer', 'nicogamepad/GamepadModel'],
      function($, PollingTimer, GamepadModel)
    {
      // TODO: 複数デバイスサポート

      var primaryGamepad = null;
      var pollingTimer = null;
      var NicoGamepad = new emitter(); //function() {};
//      inherit(NicoGamepad, emitter);


      var onGamepadConnectStatusChange = function(e, isConnected) {
        if (e.gamepad.index !== 0) {
          return;
        }

        if (isConnected) {
          console.log('%cgamepad conneced id:"%s"', 'background: lightblue;', e.gamepad.id);
          detectGamepad();
        } else {
          NicoGamepad.emit('onDeviceDisconnect', primaryGamepad.getDeviceIndex());
          if (primaryGamepad) {
            primaryGamepad.release();
          }
          primaryGamepad = null;
          console.log('%cgamepad disconneced id:"%s"', 'background: lightblue;', e.gamepad.id);
        }
      };

      var detectGamepad = function() {
        if (primaryGamepad) {
          return;
        }
        var gamepads = navigator.getGamepads();
        if (gamepads.length > 0) {
          console.log('%cdetect gamepad "%s"', 'background: lightgreen;', gamepads.length);
          var gamepad = new GamepadModel(gamepads[0]);
          primaryGamepad = gamepad;

          var self = NicoGamepad;
          var onButtonDown = function(number) {
            self.emit('onButtonDown', number, gamepad.getDeviceIndex());
          };
          var onButtonUp = function(number) {
            self.emit('onButtonUp', number, gamepad.getDeviceIndex());
          };
          var onAxisChange = function(number, value) {
            self.emit('onAxisChange', number, value, gamepad.getDeviceIndex());
          };
          var onAxisRelease = function(number) {
            self.emit('onAxisRelease', number, gamepad.getDeviceIndex());
          };
          gamepad.on('onButtonDown', onButtonDown);
          gamepad.on('onButtonUp',   onButtonUp);
          gamepad.on('onAxisChange',  onAxisChange);
          gamepad.on('onAxisRelease', onAxisRelease);

          self.emit('onDeviceConnect', gamepad.getDeviceIndex(), gamepad.getDeviceId());

          pollingTimer.changeInterval(30);
        }
      };

      var initializeTimer = function() {
        var onTimerInterval = function() {
          if (!primaryGamepad) {
            detectGamepad();
          }
          if (!primaryGamepad || !primaryGamepad.isConnected) {
            return;
          }
          primaryGamepad.update();
        };
        pollingTimer = new PollingTimer(onTimerInterval, 1000);
      };

      var initializeGamepad = function() {
        console.log('%cinitializeGamepad', 'background: lightgreen;');
        window.addEventListener("gamepadconnected", function(e) { onGamepadConnectStatusChange(e, true); }, false);
        window.addEventListener("gamepaddisconnected", function(e) { onGamepadConnectStatusChange(e, false); }, false);
        if (primaryGamepad) {
          return;
        }
        window.setTimeout(detectGamepad, 1000);
      };

      var initialize = function() {
        initializeTimer();
        initializeGamepad();
      };

      _.assign(NicoGamepad, {
        getDeviceCount: function() { return primaryGamepad ? 1 : 0; },
      });

      initialize();

      return NicoGamepad;
    });

    define('nicogamepad/SettingPanel',
      ['jquery', 'lodash', 'emitter', 'inherit', 'WatchApp'],
      function($, _, emitter, inherit, WatchApp)
    {
      function SettingPanel(gamepad) {
        this._initialize(gamepad);
      }
      inherit(SettingPanel, emitter);

      var template = $([
        '<div>',
        '</div>',
      ''].join(''));

      _.assign(SettingPanel.prototype, {
        _initialize: function(gamepad) {
          this._$view = $(template)
            .toggleClass('connected', gamepad.isConnected());
          this._gamepad = gamepad;
          gamepad.on('onButtonDown',  _.bind(this._onButtonDown, this));
          gamepad.on('onButtonUp',    _.bind(this._onButtonUp,   this));
          gamepad.on('onAxisChange',  _.bind(this._onAxisChange,  this));
        },
        open: function() {
          this._isOpen = true;
          this._$view.addClass('open');
        },
        close: function() {
          this._isOpen = false;
          this._$view.removeClass('open');
        },
        isOpen: function() {
          return this._isOpen;
        },
        _onButtonDown: function(number, deviceIndex) {
          if (!this._isOpen || deviceIndex !== 0) { return; }
          this._$view.addClass('button-' + number + '-on');
        },
        _onButtonUp: function(number, deviceIndex) {
          if (!this._isOpen || deviceIndex !== 0) { return; }
          this._$view.removeClass('button-' + number + '-on');
        },
        _onAxisChange: function(number, value, deviceIndex) {
          if (!this._isOpen || deviceIndex !== 0) { return; }
          this._$view.addClass('button-' + number + '-1');
        }
      });

      return SettingPanel;
    });

    define('nicogamepad/watchController',
      ['jquery',
       'lodash',
       'watchapp/init/VideoExplorerInitializer',
       'watchapp/init/PlayerInitializer',
      ],
      function($, _) {
//    var  WatchApp = require('WatchApp'),
 //   var  watchInfoModel = require('watchapp/model/WatchInfoModel').getInstance() || {},
      var  VideoExplorerInitializer = require('watchapp/init/VideoExplorerInitializer');
      var  PlayerInitializer = require('watchapp/init/PlayerInitializer');
//    var  CommonModelInitializer = require('watchapp/init/CommonModelInitializer'),
//    var  WindowUtil = require('watchapp/util/WindowUtil'),
//    var  PlaylistInitializer = require('watchapp/init/PlaylistInitializer'),

      var nicoPlayer              = PlayerInitializer.nicoPlayerConnector || {};
      var videoExplorerController = VideoExplorerInitializer.videoExplorerController;
      var videoExplorer           = videoExplorerController.getVideoExplorer();
//    var videoExplorerContentType = require('watchapp/components/videoexplorer/model/ContentType'),
//    var WatchJsApi = w.WatchJsApi;
//
      var screen = {
        changeScreenMode: function(mode) {
          WatchJsApi.player.changePlayerScreenMode(mode);
          setTimeout(function(){$(window).resize();}, 3000);
        },
        toggleFull: function() {
          if (this.isFullScreen()) {
            this.changeScreenMode('notFull');
          } else {
            this.changeScreenMode('browserFull');
          }
        },
        isFullScreen: function() {
          return $('body').hasClass('full_with_browser') || $('body').hasClass('full_with_monitor');
        }
      };
      var videoexplorer = {
        showDeflist: function() {
          videoExplorerController.showDeflist();
        },
        toggleSearch: function() {
          if (videoExplorer.isOpen()) {
            this.closeSearch();
          } else {
            this.openSearch();
          }
        },
        openSearch: function() {
          VideoExplorerInitializer.expandButtonView.open();
        },
        closeSearch: function() {
          videoExplorer.changeState(false);
          videoExplorer.close();
        }
      };
      var player = {
        commentVisibility: function(v) {
          if (v === 'toggle') {
            return this.commentVisibility(!this.commentVisibility());
          } else
          if (typeof v === 'boolean') {
            nicoPlayer.playerConfig.set({commentVisible: v});
            return this;
          } else {
            var pc = nicoPlayer.playerConfig.get();
            return pc.commentVisible;
          }
        },
        togglePlay: function() {
          var status = $("#external_nicoplayer")[0].ext_getStatus();
          if (status === 'playing') {
            this.pause();
          } else {
            this.play();
          }
        },
        play: function() {
          nicoPlayer.playVideo();
        },
        pause: function() {
          nicoPlayer.stopVideo();
        },
        vpos: function(v) {
          if (typeof v === 'number') {
            return nicoPlayer.seekVideo(v);
          } else {
            return nicoPlayer.getVpos();
          }
        },
        mute: function(v) {
          var exp = window.document.getElementById('external_nicoplayer');

          if (v === 'toggle') {
            return this.mute(!this.mute());
          } else
          if (typeof v === 'boolean') {
            exp.ext_setMute(v);
            return this;
          } else {
            return exp.ext_isMute();
          }
        },
        volume: function(v) {
          var exp = window.document.getElementById('external_nicoplayer');

          if (typeof v === 'string' && v.match(/^[+-]\d+$/)) {
            this.volume(this.volume() + v * 1);
          } else
          if (typeof v === 'number' || (typeof v === 'string' && v.match(/^\d+$/))) {
            exp.ext_setVolume(Math.max(0, Math.min(v * 1, 100)));
          }
          return exp.ext_getVolume();
        },
        nextVideo: function() {
          return nicoPlayer.playNextVideo();
        },
        prevVideo: function() {
          return nicoPlayer.playPreviousVideo();
        }
      };

      var playlist = {
      };

      var popupMarqueeViewController =
        require('watchapp/init/PopupMarqueeInitializer').popupMarqueeViewController;
      var popup = {
        show: function(text) {
          text = text.replace(/[\n]/, '<br />');
          popupMarqueeViewController.onData(
            // Firefoxではflashの上に半透明要素を重ねられないのでとりあえず黒で塗りつぶす
            '<span style="background: black;">' + text + '</span>'
          );
        },
        alert: function(text) {
          text = text.replace(/[\n]/, '<br />');
          popupMarqueeViewController.onData(
            '<span style="background: black; color: red;">' + text + '</span>'
          );
        },
        hide: function() {
          popupMarqueeViewController.stop();
        }
      };

      return {
        videoexplorer: videoexplorer,
        screen: screen,
        player: player,
        playlist: playlist,
        popup: popup
      };
    });

    require([
        'nicogamepad/gamepad',
        'nicogamepad/SettingPanel',
        'nicogamepad/watchController'
      ],
      function(
        gamepad,
        SettingPanel,
        watchController
      )
    {
      var isButton0Down = false;

      var seekBy = function(v) {
        var vpos = watchController.player.vpos() + v;
        watchController.player.vpos(vpos);
      };
      var scrollBy = function(v) {
        var scrollTop = $(window).scrollTop() + v;
        $(window).scrollTop(scrollTop);
      };
      // ボリューム上げる時は「ちょっと上げたいな」
      // 下げる時は「うわっうるせぇ」なので下げるほうが速い
      var volumeUp = function() {
        var v = watchController.player.volume(), r;
        v = Math.max(v, 1);
        r = (v < 5) ? 1.3 : 1.1;
        v = watchController.player.volume(v * r);
      };
      var volumeDown = function() {
        var v = watchController.player.volume();
        v = watchController.player.volume(Math.floor(v / 1.2));
      };

      var onButtonDown = function(number, deviceIndex) {
        console.log('%conButtonDown: number=%s, device=%s', 'background: lightblue;', number, deviceIndex);
        switch (number) {
          case 0:
            isButton0Down = true;
            break;
        }
      };

      var onButtonUp = function(number, deviceIndex) {
        console.log('%conButtonUp: number=%s, device=%s', 'background: lightblue;', number, deviceIndex);
        switch (number) {
          case 0:
            isButton0Down = false;
            break;
          case 1:
            watchController.player.mute('toggle');
            break;
          case 2:
            watchController.player.commentVisibility('toggle');
            break;
          case 3:
            watchController.screen.toggleFull();
            break;
          case 4:
            watchController.videoexplorer.toggleSearch();
            break;
          case 5:
            break;
          case 6:
            watchController.player.prevVideo();
            break;
          case 7:
            watchController.player.nextVideo();
            break;
          case 8:
            watchController.player.togglePlay();
            break;
        }
      };

      var onAxisChange = function(number , value, deviceIndex) {
        console.log('%conAxisChange: number=%s, value=%s, device=%s', 'background: lightblue;', number, value, deviceIndex);
        switch(number) {
          case 0: // X
            if (Math.abs(value) > 0.1) {
              if (isButton0Down) {
                seekBy(100 * 10 * value);
              } else {
                seekBy(100 * 30 * value);
              }
            }
            break;
          case 1: // Y
            if (isButton0Down) {
              if (Math.abs(value) > 0.1) {
                if (value < 0) {
                  volumeUp();
                } else {
                  volumeDown();
                }
              }
            } else {
              if (Math.abs(value) > 0.1) {
                if (value < 0) {
                  scrollBy(-100);
                } else {
                  scrollBy(100);
                }
              }
            }
            break;
        }
      };

      var onDeviceConnect = function(deviceIndex, deviceId) {
        onDeviceConnect = _.noop;

        gamepad.on('onButtonDown', onButtonDown);
        gamepad.on('onButtonUp',   onButtonUp);
        gamepad.on('onAxisChange', onAxisChange);

        watchController.popup.show('<span style="color:lightgreen;">ゲームパッド "' + deviceId + '" が検出されました</span>');
      };

      if (gamepad.getDeviceCount() > 0) {
        onDeviceConnect();
      } else {
        gamepad.on('onDeviceConnect', onDeviceConnect);
      }
    });
  };

  var initialize = function() {
    var script = document.createElement("script");
    script.id = "NicoGamepadLoader";
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "UTF-8");
    script.appendChild(document.createTextNode(
      'require(["WatchApp", "lodash", "prepareapp/PlayerStartupObserver"], function() {' +
        'console.log("%cNicoGamepad: require WatchApp", "background: lightgreen;");' +
        '(' + monkey + ')();' +
      '});'
    ));
    document.body.appendChild(script);
  };

  window.require(['watchapp/model/WatchInfoModel'], function(WatchInfoModel) {
    var watchInfoModel = WatchInfoModel.getInstance();
    if (watchInfoModel.initialized) {
      window.setTimeout(initialize, 100);
    } else {
      var onReset = function() {
        watchInfoModel.removeEventListener('reset', onReset);
        window.setTimeout(initialize, 100);
      };
      watchInfoModel.addEventListener('reset', onReset);
    }
  });

})();
