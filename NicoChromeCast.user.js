// ==UserScript==
// @name        NicoChromeCast
// @namespace   https://github.com/segabito/
// @description GINZAwatchをChromeCast表示用に調整する
// @include     http://www.nicovideo.jp/watch/*
// @version     0.1
// @grant       none
// ==/UserScript==

(function() {
  var monkey = (function(){
    'use strict';
    var $ = window.jQuery;


    window.NicoChromeCast = {
      initialize: function() {
        if (window.name === 'NicoChromeCastFrame') {
          this.initializeSlaveFrame();
        } else {
          this.initializeMasterFrame();
        }
      },
      initializeMasterFrame: function() {
        this.initializeCss();
        this.initializeMenu();
      },
      initializeSlaveFrame: function() {
        var baseUrl = location.href;
        var watchInfoModel = WatchApp.ns.model.WatchInfoModel.getInstance();
        watchInfoModel.addEventListener('reset', function() {
          var watchId = watchInfoModel.id;
          parent.location.replace(baseUrl + '#!' + watchId);
          //parent.window.history.replaceState('', '', '/watch/' + watchId);
        });
        parent.window.addEventListener('beforeunload', function() {
          top.window.history.replaceState('', '', 'http://www.nicovideo.jp/watch/' + watchInfoModel.id);
        });

      },
      initializeMenu: function() {
        var $menu =
          this._$menu = $('<li class="NicoChromeCastMenu"><a href="javascript:;" title="NicoChromeCastモードに移行">NicoChromeCast</a></li>');
        var $iframe =
          this._$iframe = $('<iframe class="NicoChromeCastFrame" name="NicoChromeCastFrame" allowFullScreen="on"/>');
        var $openButton =
          this._$openButton =  $('<button class="openButton">フルスクリーン</button>');
        var $body = $('body');

        var onMenuClick = $.proxy(function(e) {
          e.preventDefault();
          e.stopPropagation();

          this._$menu.remove();
          this.open();
        }, this);

        var onOpenButtonClick = $.proxy(function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.fullScreen.request(this._$iframe[0]);
        }, this);

        $menu.on('click', 'a', onMenuClick);
        $openButton.on('click', onOpenButtonClick);


        $('#siteHeaderRightMenuFix').after($menu);
        $body.append($iframe);
      },
      open: function() {
        $('body>*:not(.NicoChromeCastFrame)').remove('');
        $('body').addClass('NicoChromeCastOpen')
          .append(this._$openButton);

        this._$iframe[0].contentWindow.location.replace(location.href);

        this.fullScreen.request(this._$iframe[0]);
      },
      addStyle: function(styles, id) {
        var elm = document.createElement('style');
        elm.type = 'text/css';
        if (id) { elm.id = id; }

        var text = styles.toString();
        text = document.createTextNode(text);
        elm.appendChild(text);
        var head = document.getElementsByTagName('head');
        head = head[0];
        head.appendChild(elm);
        return elm;
      },
      fullScreen: {
        now: function() {
          if (document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen) {
            return true;
          }
          return false;
        },
        request: function(target) {
          var elm = typeof target === 'string' ? document.getElementById(target) : target;
          if (!elm) { return; }
          if (elm.requestFullScreen) {
            elm.requestFullScreen();
          } else if (elm.webkitRequestFullScreen) {
            elm.webkitRequestFullScreen();
          } else if (elm.mozRequestFullScreen) {
            elm.mozRequestFullScreen();
          }
        },
        cancel: function() {
          if (document.exitFullScreen) {
            document.exitFullScreen();
          } else if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          }
        }
      },
      initializeCss: function() {
        var __common_css__ = (function() {/*
          .NicoChromeCastSettingMenu a {
            font-weight: bolder; color: darkblue !important;
            white-space: nowrap;
          }
          #NicoChromeCastSettingPanel {
            position: fixed;
            bottom: 2000px; right: 8px;
            z-index: -1;
            width: 500px;
            background: #f0f0f0; border: 1px solid black;
            padding: 8px;
            transition: bottom 0.4s ease-out;
            text-align: left;
          }
          #NicoChromeCastSettingPanel.open {
            display: block;
            bottom: 8px;
            box-shadow: 0 0 8px black;
            z-index: 10000;
          }
          #NicoChromeCastSettingPanel .close {
            position: absolute;
            cursor: pointer;
            right: 8px; top: 8px;
          }
          #NicoChromeCastSettingPanel .panelInner {
            background: #fff;
            border: 1px inset;
            padding: 8px;
            min-height: 300px;
            overflow-y: scroll;
            max-height: 500px;
          }
          #NicoChromeCastSettingPanel .panelInner .item {
            border-bottom: 1px dotted #888;
            margin-bottom: 8px;
            padding-bottom: 8px;
          }
          #NicoChromeCastSettingPanel .panelInner .item:hover {
            background: #eef;
          }
          #NicoChromeCastSettingPanel .windowTitle {
            font-size: 150%;
          }
          #NicoChromeCastSettingPanel .itemTitle {
          }
          #NicoChromeCastSettingPanel label {
            margin-right: 12px;
          }
          #NicoChromeCastSettingPanel small {
            color: #666;
          }
          #NicoChromeCastSettingPanel .expert {
            margin: 32px 0 16px;
            font-size: 150%;
            background: #ccc;
          }
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

        var __css__ = (function() {/*
          .NicoChromeCastMenu a {
            font-weight: bolder; color: darkorange !important;
            white-space: nowrap;
          }
          .NicoChromeCastFrame {
            position: fixed;
            width: 1280px;
            height: 720px;
            top: -9999px;
            left: -9999px;
            display: none;
          }
          .NicoChromeCastOpen .NicoChromeCastFrame {
            display: block;
            left: calc(50% - 640px);
            top:  calc(50% - 360px);
          }
          .openButton {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
          }
          .NicoChromeCastOpen .openButton {
            display: block;
            cursor: pointer;
            font-size: 24pt;
          }
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');


          this.addStyle(__common_css__);
          this.addStyle(__css__);
      },
      initializeUserConfig: function() {
        var prefix = 'NicoChromeCast_';
        var conf = {
        };

        this.config = {
          get: function(key) {
            try {
              if (window.localStorage.hasOwnProperty(prefix + key)) {
                return JSON.parse(window.localStorage.getItem(prefix + key));
              }
              return conf[key];
            } catch (e) {
              return conf[key];
            }
          },
          set: function(key, value) {
            window.localStorage.setItem(prefix + key, JSON.stringify(value));
          }
        };
      },
      initializeOther: function() {
      },
      initializeSettingPanel: function() {
        var $menu   = $('<li class="NicoChromeCastSettingMenu"><a href="javascript:;" title="NicoChromeCastの設定変更">NicoChromeCast設定</a></li>');
        var $panel  = $('<div id="NicoChromeCastSettingPanel" />');//.addClass('open');
        var $button = $('<button class="toggleSetting playerBottomButton">設定</botton>');

        $button.on('click', function(e) {
          e.stopPropagation(); e.preventDefault();
          $panel.toggleClass('open');
        });

        var config = this.config;
        $menu.find('a').on('click', function() { $panel.toggleClass('open'); });

        var __tpl__ = (function() {/*
          <div class="panelHeader">
          <h1 class="windowTitle">NicoChromeCastの設定</h1>
          <p>設定はリロード後に反映されます</p>
          <button class="close" title="閉じる">×</button>
          </div>
          <div class="panelInner">
            <!--<div class="item" data-setting-name="topUserInfo" data-menu-type="radio">
              <h3 class="itemTitle">投稿者情報を右上に移動 </h3>
              <label><input type="radio" value="true" > する</label>
              <label><input type="radio" value="false"> しない</label>
            </div>-->
          </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
        $panel.html(__tpl__);
        $panel.find('.item').on('click', function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = JSON.parse($this.find('input:checked').val());
          console.log('seting-name', settingName, 'value', value);
          config.set(settingName, value);
        }).each(function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = config.get(settingName);
          $this.addClass(settingName);
          $this.find('input').attr('name', settingName).val([JSON.stringify(value)]);
        });
        $panel.find('.close').click(function() {
          $panel.removeClass('open');
        });

        $('#siteHeaderRightMenuFix').after($menu);
        $('body').append($panel);
      }
   };


    if (window.PlayerApp) {
      (function() {
        var watchInfoModel = WatchApp.ns.model.WatchInfoModel.getInstance();
        if (watchInfoModel.initialized) {
          window.NicoChromeCast.initialize();
        } else {
          var onReset = function() {
            watchInfoModel.removeEventListener('reset', onReset);
            window.setTimeout(function() {
              watchInfoModel.removeEventListener('reset', onReset);
              window.NicoChromeCast.initialize();
            }, 0);
          };
          watchInfoModel.addEventListener('reset', onReset);
        }
      })();
    }


  });

  var script = document.createElement("script");
  script.id = "NicoChromeCastLoader";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("charset", "UTF-8");
  script.appendChild(document.createTextNode("(" + monkey + ")()"));
  document.body.appendChild(script);

})();
