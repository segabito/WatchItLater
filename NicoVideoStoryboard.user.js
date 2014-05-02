// ==UserScript==
// @name           NicovideoStoryboard
// @namespace      https://github.com/segabito/
// @description    シークバーに出るサムネイルを並べて表示
// @match          http://www.nicovideo.jp/watch/*
// @match          http://flapi.nicovideo.jp/api/getflv*
// @match          http://*.nicovideo.jp/smile*
// @grant          none
// @author         segabito macmoto
// @version        1.0.0
// ==/UserScript==

(function() {
  var monkey = function() {
    var DEBUG = !true;
    var $ = window.jQuery, _ = window._;

    var __css__ = (function() {/*
      .xDomainLoaderFrame {
        position: fixed;
        top: -999px;
        left: -999px;
        width: 1px;
        height: 1px;
        border: 0;
      }

      .storyboardContainer {
        position: fixed;
        bottom: -300px;
        left: 0;
        right: 0;
        width: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        background: #999;
        border: 2px outset #000;
        z-index: 9005;
        overflow: visible;
        border-radius: 10px 10px 0 0;
        border-width: 2px 2px 0;
        box-shadow: 0 -2px 2px #666;

        transition: bottom 0.5s ease-in-out;
      }

      .storyboardContainer.show {
        bottom: 0;
      }

      .storyboardContainer.clicked *{
        cursor: wait;
      }

      .storyboardContainer .storyboardInner {
        display: none;
        position: relative;
        text-align: center;
        overflow-x: scroll;
        white-space: nowrap;
        background: #222;
        margin: 4px 12px;
        border-style: inset;
        border-width: 2px 4px;
        border-radius: 10px 10px 0 0;
      }

      .storyboardContainer.success .storyboardInner {
        display: block;
      }

      .storyboardContainer .storyboardInner .boardList {
        overflow: hidden;
      }

      .storyboardContainer .boardList .board {
        display: inline-block;
        cursor: pointer;
        background-color: #101010;
      }
      .storyboardContainer .boardList .board.lazyImage {
        background-color: #ccc;
      }
      .storyboardContainer .boardList .board.loadFail {
        background-color: #c99;
      }
      .storyboardContainer .boardList .board.lazyImage {
        cursor: wait;
      }

      .storyboardContainer .boardList .board > div {
        white-space: nowrap;
      }
      .storyboardContainer .boardList .board .border {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        border-style: solid;
        border-color: #000 #333 #000 #999;
        border-width: 0     2px    0  2px;
        display: inline-block;
      }
      .storyboardContainer .boardList .board:hover .border {
        display: none; {* クリックできなくなっちゃうので苦し紛れの対策 もうちょっとマシな方法を考える *}
      }

      .storyboardContainer .storyboardHeader {
        position: relative;
        width: 100%;
      }
      .storyboardContainer .pointer {
        position: absolute;
        bottom: -15px;
        left: 50%;
        width: 32px;
        margin-left: -16px;
        color: #333;
        z-index: 9010;
        text-align: center;
      }

      .storyboardContainer .cursorTime {
        display: none;
        position: absolute;
        bottom: -30px;
        left: -999px;
        font-size: 10pt;
        border: 1px solid #000;
        z-index: 9010;
        background: #ffc;
      }
      .storyboardContainer:hover .cursorTime {
        display: block;
      }

      .storyboardContainer .setToDisable {
        position: absolute;
        display: inline-block;
        left: 250px;
        bottom: -32px;
        transition: bottom 0.3s ease-in-out;
      }
      .storyboardContainer:hover .setToDisable {
        bottom: 0;
      }

      .storyboardContainer .setToDisable button,
      .setToEnableButtonContainer button {
        background: none repeat scroll 0 0 #999;
        border-color: #666;
        border-radius: 18px 18px 0 0;
        border-style: solid;
        border-width: 2px 2px 0;
        width: 200px;
        overflow: auto;
        white-space: nowrap;
        cursor: pointer;
        box-shadow: 0 -2px 2px #666;
      }

      .full_with_browser .setToEnableButtonContainer button {
        box-shadow: none;
        color: #888;
        background: #000;
      }

      .full_with_browser .storyboardContainer .setToDisable,
      .full_with_browser .setToEnableButtonContainer {
        background: #000; {* Firefox対策 *}
      }

      .setToEnableButtonContainer button {
        width: 200px;
      }

      .storyboardContainer .setToDisable button:hover,
      .setToEnableButtonContainer:not(.loading):not(.fail) button:hover {
        background: #ccc;
        transition: none;
      }

      .storyboardContainer .setToDisable button.clicked,
      .setToEnableButtonContainer.loading button,
      .setToEnableButtonContainer.fail button,
      .setToEnableButtonContainer button.clicked {
        border-style: inset;
        box-shadow: none;
      }

      .setToEnableButtonContainer {
        position: fixed;
        z-index: 9003;
        left: 250px;
        bottom: 0px;
        transition: bottom 0.5s ease-in-out;
      }
      .setToEnableButtonContainer.loadingVideo {
        bottom: -50px;
      }

      .setToEnableButtonContainer.loading *,
      .setToEnableButtonContainer.loadingVideo *{
        cursor: wait;
        font-size: 80%;
      }
      .setToEnableButtonContainer.fail {
        color: #999;
        cursor: default;
        font-size: 80%;
      }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var storyboardTemplate = [
      '<div id="storyboardContainer" class="storyboardContainer">',
        '<div class="storyboardHeader">',
          '<div class="setToDisable"><button>▼　閉じる　</button></div>',
          '<div class="pointer">▼</div>',
          '<div class="cursorTime"></div>',
        '</div>',

        '<div class="storyboardInner"></div>',
        '<div class="failMessage">',
        '</div>',
      '</div>',
      '',
    ''].join('');

 // マスコットキャラクターのサムネーヨちゃん
    var noThumbnailAA = (function() {/*
　∧ ∧　 　 　┌─────────────
　( ´ー｀)　　 ＜　サムネーヨ
 　＼　< 　　　 └───/|────────
　　　＼.＼＿＿＿＿__／/
　　　　 ＼　　　　　　　／
　　　　　　∪∪‾∪∪
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var EventDispatcher = (function() {

      function AsyncEventDispatcher() {
        window.WatchApp.extend(
          this,
          AsyncEventDispatcher,
          window.WatchApp.ns.event.EventDispatcher);
      }

      window.WatchApp.mixin(AsyncEventDispatcher.prototype, {
//        addEventListener: function(name, func) {
//          console.log('%caddEventListener: ', 'background: red; color: white;', name, func);
//          if (!func) {
//            console.trace();
//          }
//          AsyncEventDispatcher.__super__.addEventListener.call(this, name, func);
//        },
        dispatchAsync: function() {
          var args = arguments;

          window.setTimeout($.proxy(function() {
            try {
              this.dispatchEvent.apply(this, args);
            } catch (e) {
              console.log(e);
            }
          }, this), 0);
        }
      });
      return AsyncEventDispatcher;
    })();

    window.NicovideoStoryboard =
      (function() {
        return {
          api: {},
          model: {},
          view: {},
          controller: {},
          external: {},
          eventDispatcher: new EventDispatcher()
        };
      })();

//    var console =
//      (function(debug) {
//        var n = window._.noop;
//        return debug ? window.console : {log: n, trace: n, time: n, timeEnd: n};
//      })(DEBUG);
    var console = window.console;

    window.NicovideoStoryboard.external.watchController = (function() {
      var root = window.WatchApp.ns;
      var nicoPlayerConnector = root.init.PlayerInitializer.nicoPlayerConnector;
      var watchInfoModel      = root.model.WatchInfoModel.getInstance();
      var viewerInfoModel     = root.init.CommonModelInitializer.viewerInfoModel;
      var playerAreaConnector = root.init.PlayerInitializer.playerAreaConnector;
      var externalNicoplayer;

      var watchController = new EventDispatcher();

      var getVpos = function() {
        return nicoPlayerConnector.getVpos();
      };
      var setVpos = function(vpos) {
        nicoPlayerConnector.seekVideo(vpos);
      };

      var _isPlaying = undefined;
      var isPlaying = function() {
        if (_isPlaying !== undefined) {
          return _isPlaying;
        }
        if (!externalNicoplayer) {
          externalNicoplayer = $("#external_nicoplayer")[0];
        }
        var status = externalNicoplayer.ext_getStatus();
        return status === 'playing';
      };
      var play = function() {
        nicoPlayerConnector.playVideo();
      };
      var pause = function() {
        nicoPlayerConnector.stopVideo();
      };

      var isPremium = function() {
        return !!viewerInfoModel.isPremium;
      };

      var getWatchId = function() {// スレッドIDだったりsmXXXXだったり
        return watchInfoModel.v;
      };
      var getVideoId = function() {// smXXXXXX, soXXXXX など
        return watchInfoModel.id;
      };

      var popupMarquee = root.init.PopupMarqueeInitializer.popupMarqueeViewController;
      var popup = {
        message: function(text) {
          popupMarquee.onData(
            '<span style="background: black;">' + text + '</span>'
          );
        },
        alert: function(text) {
          popupMarquee.onData(
            '<span style="background: black; color: red;">' + text + '</span>'
          );
        }
      };

      playerAreaConnector.addEventListener('onVideoPlayed', function() {
        console.log('onVideoPlayed');
        _isPlaying = true;
        watchController.dispatchEvent('onVideoPlayed');
      });
      playerAreaConnector.addEventListener('onVideoStopped', function() {
        console.log('onVideoStopped');
        _isPlaying = false;
        watchController.dispatchEvent('onVideoStopped');
      });

      playerAreaConnector.addEventListener('onVideoStarted', function() {
        console.log('onVideoStarted');
        _isPlaying = true;
        watchController.dispatchEvent('onVideoStarted');
      });
      playerAreaConnector.addEventListener('onVideoEnded', function() {
        console.log('onVideoEnded');
        _isPlaying = false;
        watchController.dispatchEvent('onVideoEnded');
      });

      playerAreaConnector.addEventListener('onVideoSeeked', function() {
        console.log('onVideoSeeked');
        watchController.dispatchEvent('onVideoSeeked');
      });


      window.WatchApp.mixin(watchController, {
        getVpos: getVpos,
        setVpos: setVpos,

        isPlaying: isPlaying,
        play:  play,
        pause: pause,

        isPremium: isPremium,

        getWatchId: getWatchId,
        getVideoId: getVideoId,

        popup: popup
      });

      return watchController;
    })();


    window.NicovideoStoryboard.api.getflv = (function() {
      var BASE_URL = 'http://flapi.nicovideo.jp/api/getflv?v=';
      var loaderFrame, loaderWindow, cache = {};
      var eventDispatcher = window.NicovideoStoryboard.eventDispatcher;
      var getflv = new EventDispatcher();

      var parseInfo = function(q) {
        var info = {}, lines = q.split('&');
        $.each(lines, function(i, line) {
          var tmp = line.split('=');
          var key = window.unescape(tmp[0]), value = window.unescape(tmp[1]);
          info[key] = value;
        });
        return info;
      };

      var onMessage = function(data, type) {
        if (type !== 'getflv') { return; }
        var info = parseInfo(data.info), url = data.url;

        cache[url] = info;
        //console.log('getflv.onGetflvLoad', info);
        getflv.dispatchAsync('onGetflvLoad', info);
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize getflv', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'getflvLoader';
        loaderFrame.className = DEBUG ? 'xDomainLoaderFrame debug' : 'xDomainLoaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage', onMessage);
      };

      var load = function(watchId) {
        initialize();
        var url = BASE_URL + watchId;
        //console.log('getflv: ', url);

        getflv.dispatchEvent('onGetflvLoadStart', watchId);
        if (cache[url]) {
          //console.log('%cgetflv cache exist', 'background: cyan', url);
          getflv.dispatchAsync('onGetflvLoad', cache[url]);
        } else {
          loaderWindow.location.replace(url);
        }
      };

      window.WatchApp.mixin(getflv, {
        load: load
      });

      return getflv;
    })();

   window.NicovideoStoryboard.api.thumbnailInfo = (function() {
      var getflv = window.NicovideoStoryboard.api.getflv;
      var loaderFrame, loaderWindow, cache = {};
      var eventDispatcher = window.NicovideoStoryboard.eventDispatcher;
      var thumbnailInfo = new EventDispatcher();

      var onGetflvLoad = function(info) {
        //console.log('thumbnailInfo.onGetflvLoad', info);
        if (!info.url) {
          thumbnailInfo.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'サムネイル情報の取得に失敗しました'}
            );
          return;
        } else
        if (info.url.indexOf('http://') !== 0) { // rtmpe:～など
          thumbnailInfo.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'この配信形式には対応していません'}
            );
          return;
        }

        var url = info.url + '&sb=1';

        thumbnailInfo.dispatchEvent('onThumbnailInfoLoadStart');
        if (cache[url]) {
          //console.log('%cthumbnailInfo cache exist', 'background: cyan', url);
          thumbnailInfo.dispatchAsync('onThumbnailInfoLoad', cache[url]);
          return;
        }
        loaderWindow.location.replace(url);
      };

      var onMessage = function(data, type) {
        if (type !== 'storyboard') { return; }
        //console.log('thumbnailInfo.onMessage: ', data, type);

        var url = data.url;
        var xml = data.xml, $xml = $(xml), $storyboard = $xml.find('storyboard');

        if ($storyboard.length < 1) {
          eventDispatcher.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'この動画にはサムネイルがありません'}
            );
          return;
        }
        var info = {
          status:   'ok',
          message:  '成功',
          url:      data.url,
          movieId:  $xml.find('movie').attr('id'),
          duration: $xml.find('duration').text(),
          thumbnail:{
            width:    $storyboard.find('thumbnail_width').text(),
            height:   $storyboard.find('thumbnail_height').text(),
            number:   $storyboard.find('thumbnail_number').text(),
            interval: $storyboard.find('thumbnail_interval').text()
          },
          board: {
            rows:   $storyboard.find('board_rows').text(),
            cols:   $storyboard.find('board_cols').text(),
            number: $storyboard.find('board_number').text()
          }
        };

        cache[url] = info;
        thumbnailInfo.dispatchAsync('onThumbnailInfoLoad', info);
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize thumbnailInfo', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'StoryboardLoader';
        loaderFrame.className = DEBUG ? 'xDomainLoaderFrame debug' : 'xDomainLoaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage', onMessage);
        getflv.addEventListener('onGetflvLoad', onGetflvLoad);
      };

      var load = function(watchId) {
        initialize();
        getflv.load(watchId);
      };


      window.WatchApp.mixin(thumbnailInfo, {
        load: load
      });

      return thumbnailInfo;
    })();

    window.NicovideoStoryboard.model.StoryboardModel = (function() {

      function StoryboardModel(params) {
        this._eventDispatcher = params.eventDispatcher;
        this._thumbnailInfo   = params.thumbnailInfo;
        this._watchController = params.watchController;
        this._isEnabled       = params.isEnabled;

        window.WatchApp.extend(this, StoryboardModel, EventDispatcher);
      }

      window.WatchApp.mixin(StoryboardModel.prototype, {
        initialize: function(info) {
          console.log('%c initialize StoryboardModel', 'background: lightgreen;');

          this.update(info);
        },
        update: function(info) {
          if (info.status !== 'ok') {
            window.WatchApp.mixin(info, {
              url: '',
              width: 1,
              height: 1,
              duration: 1,
              thumbnail: {
                width: 1,
                height: 1,
                number: 1,
                interval: 1
              },
              board: {
                rows: 1,
                cols: 1
              }
            });
          }
          this._info = info;

          this.dispatchEvent('update');
        },

        reset: function() {
          if (this.isEnabled()) {
            window.setTimeout($.proxy(function() {
              this.load();
            }, this), 1000);
          }
          this.dispatchEvent('reset');
        },

        load: function(watchId) {
          watchId = watchId || this._watchController.getWatchId();
          this._isEnabled = true;
          this._thumbnailInfo.load(watchId);
        },

        unload: function() {
          this._isEnabled = false;
          this.dispatchEvent('unload');
        },

        isEnabled: function() {
          return this._isEnabled;
        },

        getStatus:   function() { return this._info.status; },
        getMessage:  function() { return this._info.message; },
        getUrl:      function() { return this._info.url; },
        getDuration: function() { return parseInt(this._info.duration, 10); },

        getWidth:    function() { return parseInt(this._info.thumbnail.width, 10); },
        getHeight:   function() { return parseInt(this._info.thumbnail.height, 10); },
        getInterval: function() { return parseInt(this._info.thumbnail.interval, 10); },
        getCount:    function() {
          return Math.max(
            Math.ceil(this.getDuration() / Math.max(0.01, this.getInterval())),
            parseInt(this._info.thumbnail.number, 10)
          );
        },
        getRows:   function() { return parseInt(this._info.board.rows, 10); },
        getCols:   function() { return parseInt(this._info.board.cols, 10); },
        getPageCount: function() { return parseInt(this._info.board.number, 10); },
        getTotalRows: function() {
          return Math.ceil(this.getCount() / this.getCols());
        },

        getPageWidth:    function() { return this.getWidth()  * this.getCols(); },
        getPageHeight:   function() { return this.getHeight() * this.getRows(); },
        getCountPerPage: function() { return this.getRows()   * this.getCols(); },

        /**
         *  nページ目のURLを返す。 ゼロオリジン
         */
        getPageUrl: function(page) {
          page = Math.max(0, Math.min(this.getPageCount(), page)) + 1;
          return this.getUrl() + '&board=' + page;
        },

        /**
         * vposに相当するサムネは何番目か？を返す
         */
        getIndex: function(vpos) {
          // msec -> sec
          var v = Math.floor(vpos / 1000);
          v = Math.max(0, Math.min(this.getDuration(), v));

          // サムネの総数 ÷ 秒数
          // Math.maxはゼロ除算対策
          var n = this.getCount() / Math.max(1, this.getDuration());

          return parseInt(Math.floor(v * n), 10);
        },

        /**
         * Indexのサムネイルは何番目のページにあるか？を返す
         */
        getPageIndex: function(thumbnailIndex) {
          var perPage   = this.getCountPerPage();
          var pageIndex = parseInt(thumbnailIndex / perPage, 10);
          return Math.max(0, Math.min(this.getPageCount(), pageIndex));
        },

        /**
         *  vposに相当するサムネは何ページの何番目にあるか？を返す
         */
        getThumbnailPosition: function(vpos) {
          var thumbnailIndex = this.getIndex(vpos);
          var pageIndex      = this.getPageIndex(thumbnailIndex);

          var mod = thumbnailIndex % this.getCountPerPage();
          var row = Math.floor(mod / Math.max(1, this.getCols()));
          var col = mod % this.getRows();

          return {
            page: pageIndex,
            index: thumbnailIndex,
            row: row,
            col: col
          };
        },

        /**
         * nページ目のx, y座標をvposに変換して返す
         */
        getPointVpos: function(x, y, page) {
          var width  = Math.max(1, this.getWidth());
          var height = Math.max(1, this.getHeight());
          var row = Math.floor(y / height);
          var col = Math.floor(x / width);
          var mod = x % width;


          // 何番目のサムネに相当するか？
          var point =
            page * this.getCountPerPage() +
            row  * this.getCols()         +
            col +
            (mod / width) // 小数点以下は、n番目の左端から何%あたりか
            ;

          // 全体の何%あたり？
          var percent = point / Math.max(1, this.getCount());
          percent = Math.max(0, Math.min(100, percent));

          // vposは㍉秒単位なので1000倍
          return Math.floor(this.getDuration() * percent * 1000);
        },
      });

      return StoryboardModel;
    })();


    window.NicovideoStoryboard.view.SetToEnableButtonView = (function() {

      var TEXT = {
        DEFAULT:   '▲ サムネイルを開く ',
        LOADING:   '動画を読み込み中...',
        GETFLV:    '動画情報を読み込み中...',
        THUMBNAIL: 'サムネイル情報を読み込み中...'
      };


      function SetToEnableButtonView(params) {
        this._storyboard      = params.storyboard;
        this._eventDispatcher = params.eventDispatcher;

        this.initialize();
      }

      window.WatchApp.mixin(SetToEnableButtonView.prototype, {
        initialize: function() {
          console.log('%cinitialize SetToEnableButtonView', 'background: lightgreen;');
          this._$view = $([
              '<div class="setToEnableButtonContainer loadingVideo">',
                '<button>', TEXT.DEFAULT, '</button>',
              '</div>',
              '',
              '',
            ''].join(''));
          this._$button = this._$view.find('button');
          this._$button.on('click', $.proxy(this._onButtonClick, this));

          var sb = this._storyboard;
          sb.addEventListener('reset',  $.proxy(this._onStoryboardReset, this));
          sb.addEventListener('update', $.proxy(this._onStoryboardUpdate, this));

          var evt = this._eventDispatcher;
          evt.addEventListener('getFlvLoadStart',
            $.proxy(this._onGetflvLoadStart, this));
          evt.addEventListener('onThumbnailInfoLoadStart',
            $.proxy(this._onThumbnailInfoLoadStart, this));
          evt.addEventListener('onWatchInfoReset',
            $.proxy(this._onWatchInfoReset, this));

          $('body').append(this._$view);
        },
        reset: function() {
          this._$view.attr('title', '');
          if (this._storyboard.isEnabled()) {
            this._$view.removeClass('loadingVideo getflv thumbnailInfo fail success').addClass('loading');
            this._setText(TEXT.GETFLV);
          } else {
            this._$view.removeClass('loadingVideo getflv thumbnailInfo fail success loading');
            this._setText(TEXT.DEFAULT);
          }
        },
        _setText: function(text) {
          this._$button.text(text);
        },
        _onButtonClick: function(e) {
          if (
            this._$view.hasClass('loading') ||
            this._$view.hasClass('loadingVideo') ||
            this._$view.hasClass('fail')) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();

          var $view = this._$view.addClass('loading clicked');
          this._eventDispatcher.dispatchEvent('onEnableStoryboard');
          window.setTimeout(function() {
            $view.removeClass('clicked');
            $view = null;
          }, 1000);
        },
        _onStoryboardReset: function() {
          this.reset();
        },
        _onStoryboardUpdate: function() {
          var storyboard = this._storyboard;

          if (storyboard.getStatus() === 'ok') {
            window.setTimeout($.proxy(function() {
              this._$view
              .removeClass('loading getflv thumbnailInfo')
              .addClass('success')
              .attr('title', '');
              this._setText(TEXT.DEFAULT);
            }, this), 3000);
          } else {
            this._$view
              .removeClass('loading')
              .addClass('fail')
              .attr('title', DEBUG ? noThumbnailAA : '');
            this._setText(storyboard.getMessage());
          }
        },
        _onGetflvLoadStart: function() {
          this._$view.addClass('loading getflv');
          this._setText(TEXT.GETFLV);
        },
        _onThumbnailInfoLoadStart: function() {
          this._$view.addClass('loading thumbnailInfo');
          this._setText(TEXT.THUMBNAIL);
        },
        _onWatchInfoReset: function() {
          this._$view.addClass('loadingVideo');
          this._setText(TEXT.LOADING);
        }
      });

      return SetToEnableButtonView;
    })();

    window.NicovideoStoryboard.view.StoryboardView = (function() {
      var TIMER_INTERVAL = 33;
      var VPOS_RATE = 10;

      function StoryboardView(params) {
        this.initialize(params);
      }

      window.WatchApp.mixin(StoryboardView.prototype, {
        initialize: function(params) {
          console.log('%c initialize StoryboardView', 'background: lightgreen;');

          this._watchController = params.watchController;
          var evt = this._eventDispatcher = params.eventDispatcher;
          var sb  = this._storyboard = params.storyboard;

          this._isHover = false;
          this._currentUrl = '';
          this._lazyImage = {};
          this._lastPage = -1;
          this._lastVpos = 0;
          this._lastGetVpos = 0;
          this._timerCount = 0;
          this._scrollLeft = 0;

          this._enableButtonView =
            new window.NicovideoStoryboard.view.SetToEnableButtonView({
              storyboard:      sb,
              eventDispatcher: this._eventDispatcher
            });

          evt.addEventListener('onWatchInfoReset', $.proxy(this._onWatchInfoReset, this));

          sb.addEventListener('update', $.proxy(this._onStoryboardUpdate, this));
          sb.addEventListener('reset',  $.proxy(this._onStoryboardReset,  this));
          sb.addEventListener('unload', $.proxy(this._onStoryboardUnload, this));
        },
        _initializeStoryboard: function() {
          this._initializeStoryboard = _.noop;
          console.log('%cStoryboardView.initializeStoryboard', 'background: lightgreen;');

          var $view = this._$view = $(storyboardTemplate);

          var $inner = this._$inner = $view.find('.storyboardInner');
          this._$failMessage   = $view.find('.failMessage');
          this._$cursorTime    = $view.find('.cursorTime');
          this._$disableButton = $view.find('.setToDisable button');

          var self = this;
          $view
            .on('click', '.board', $.proxy(function(e) {
              var $board = $(e.target), offset = $board.offset();
              var y = $board.attr('data-top') * 1;
              var x = e.pageX - offset.left;
              var page = $board.attr('data-page');
              var vpos = this._storyboard.getPointVpos(x, y, page);
              if (isNaN(vpos)) { return; }

              $view.addClass('clicked');
              window.setTimeout(function() { $view.removeClass('clicked'); }, 100);
              this._eventDispatcher.dispatchEvent('onStoryboardSelect', vpos);

              if ($board.hasClass('lazyImage')) { this._lazyLoadImage(page); }
            }, this))
            .on('mousemove', '.board', $.proxy(function(e) {
              var $board = $(e.target), offset = $board.offset();
              var y = $board.attr('data-top') * 1;
              var x = e.pageX - offset.left;
              var page = $board.attr('data-page');
              var vpos = this._storyboard.getPointVpos(x, y, page);
              if (isNaN(vpos)) { return; }
              var sec = Math.floor(vpos / 1000);

              var time = Math.floor(sec / 60) + ':' + ((sec % 60) + 100).toString().substr(1);
              this._$cursorTime.text(time).css({left: e.pageX});

              if ($board.hasClass('lazyImage')) { this._lazyLoadImage(page); }
            }, this))
            .on('mousewheel', $.proxy(function(e, delta) {
              e.preventDefault();
              e.stopPropagation();
              var left = this.scrollLeft();
              this.scrollLeft(left - delta * 140);
            }, this))
            .hover(
              function() {
                self._isHover = true;
              },
              function() {
                self._isHover = false;
              });

          $inner
            .on('scroll', _.throttle(function() {
              self._onScroll();
            }, 500));

          this._watchController.addEventListener('onVideoSeeked', function() {
            if (!self._storyboard.isEnabled()) {
              return;
            }
            if (self._storyboard.getStatus() !== 'ok') {
              return;
            }
            var vpos  = self._watchController.getVpos();
            var index = self._storyboard.getIndex(vpos);
            var page  = self._storyboard.getPageIndex(index);

            self._lazyLoadImage(page);
            self._onVposUpdate(vpos);
          });

          this._$disableButton.on('click',
            $.proxy(this._onDisableButtonClick, this));

          $('body').append($view);
        },
        update: function() {
          this.disableTimer();

          this._initializeStoryboard();
          this._$view.removeClass('show success');
          if (this._storyboard.getStatus() === 'ok') {
            this._updateSuccess();
          } else {
            this._updateFail();
          }
        },
        scrollLeft: function(left) {
          if (left === undefined) {
            return this._scrollLeft;
          } else
          if (left === 0 || Math.abs(this._scrollLeft - left) > 1) {
            this._$inner.scrollLeft(left);
            this._scrollLeft = left;
          }
        },
        _updateSuccess: function() {
          var url = this._storyboard.getUrl();
          if (this._currentUrl === url) {
            this._$view.addClass('show success');
            this.enableTimer();
          } else {
            this._currentUrl = url;
            this._updateSuccessFull();
          }
        },
        _updateSuccessFull: function() {
          var storyboard = this._storyboard;
          var pages      = storyboard.getPageCount();
          var pageWidth  = storyboard.getPageWidth();
          var height     = storyboard.getHeight();
          var rows       = storyboard.getRows();

          var $borders =
            this._createBorders(storyboard.getWidth(), storyboard.getHeight(), storyboard.getCols());

          var totalRows = storyboard.getTotalRows();
          var rowCnt = 0;
          var $list = $('<div class="boardList"/>')
            .css({
              width: storyboard.getCount() * storyboard.getWidth(),
              paddingLeft: '50%',
              paddingRight: '50%',
              height: height
            });

          for (var i = 0; i < pages; i++) {
            var src = storyboard.getPageUrl(i);
            for (var j = 0; j < rows; j++) {
              var $img =
                $('<div class="board"/>')
                  .css({
                    width: pageWidth,
                    height: height,
                    backgroundPosition: '0 -' + height * j + 'px'
                  })
                  .attr({
                    'data-src': src,
                    'data-page': i,
                    'data-top': height * j + height / 2
                  })
                  .append($borders.clone());

              if (i === 0) { // 1ページ目だけ遅延ロードしない
                $img.css('background-image', 'url(' + src + ')');
              } else {
                $img.addClass('lazyImage page-' + i);
              }
              $list.append($img);
              rowCnt++;
              if (rowCnt >= totalRows) {
                break;
              }
            }
          }

          this._$innerList = $list;

          this._$inner.empty().append($list).append(this._$pointer);
          this._$view.removeClass('fail').addClass('success');

          window.setTimeout($.proxy(function() {
            this._$view.addClass('show');
          }, this), 100);

          this.scrollLeft(0);
          this.enableTimer();
        },
        _createBorders: function(width, height, count) {
          var $border = $('<div class="border"/>').css({
            width: width,
            height: height
          });
          var $div = $('<div />');
          for (var i = 0; i < count; i++) {
            $div.append($border.clone());
          }
          return $div;
        },
        _lazyLoadImage: function(pageNumber) {
          var className = 'page-' + pageNumber;

          if (pageNumber < 1 || this._lazyImage[className]) {
            return;
          }
          this._lazyImage[className] = true;

          var src = this._storyboard.getPageUrl(pageNumber);
          var $target = this._$inner.find('.' + className);

          //console.log('%c set lazyLoadImage', 'background: cyan;', 'page: ' + pageNumber, '  url: ' + src);
          $target
            .css('background-image', 'url(' + src + ')')
            .removeClass('lazyImage ' + className);
          $target = null;

        },
        _updateFail: function() {
          this._$view.removeClass('success').addClass('fail');
          this.disableTimer();
        },
        clear: function() {
          if (this._$view) {
            this._$inner.empty();
          }
          this.disableTimer();
        },
        _clearTimer: function() {
          if (this._timer) {
            window.clearInterval(this._timer);
            this._timer = null;
          }
        },
        enableTimer: function() {
          this._clearTimer();
          this._timer = window.setInterval($.proxy(this._onTimerInterval, this), TIMER_INTERVAL);
        },
        disableTimer: function() {
          this._clearTimer();
        },
        _onTimerInterval: function() {
          if (this._isHover) { return; }
          if (!this._storyboard.isEnabled()) { return; }

          var div = VPOS_RATE;
          var mod = this._timerCount % div;
          this._timerCount++;

          var vpos;

          //  getVposが意外に時間を取るので回数を減らす
          // そもそもコメントパネルがgetVpos叩きまくってるんですがそれは
          if (this._watchController.isPlaying()) {
            if (mod === 0) {
              vpos = this._watchController.getVpos();
           } else {
              vpos = this._lastVpos;
            }
          } else {
            return;
          }


          this._onVposUpdate(vpos);
        },
        _onVposUpdate: function(vpos) {
          var storyboard = this._storyboard;
          var duration = Math.max(1, storyboard.getDuration());
          var per = vpos / (duration * 1000);
          var width = storyboard.getWidth();
          var boardWidth = storyboard.getCount() * width;
          var targetLeft = boardWidth * per + width / 2;
          var currentLeft = this.scrollLeft();
          var leftDiff = Math.floor((targetLeft - currentLeft) / VPOS_RATE);

          this._lastVpos = vpos;

          this.scrollLeft(currentLeft + leftDiff);

        },
        _onScroll: function() {
          var storyboard = this._storyboard;
          var scrollLeft = this.scrollLeft();
          var page = Math.round(scrollLeft / (storyboard.getPageWidth() * storyboard.getRows()));
          this._lazyLoadImage(Math.min(storyboard.getPageCount() - 1, page));
        },
        reset: function() {
          this._lastVpos = -1;
          this._lastPage = -1;
          this._currentUrl = '';
          this._timerCount = 0;
          this._lazyImage = {};
          if (this._$view) {
            this._$view.removeClass('show');
            this._$inner.empty();
          }
        },
        _onDisableButtonClick: function(e) {
          e.preventDefault();
          e.stopPropagation();

          var $button = this._$disableButton;
          $button.addClass('clicked');
          window.setTimeout(function() {
            $button.removeClass('clicked');
          }, 1000);

          this._eventDispatcher.dispatchEvent('onDisableStoryboard');
        },
        _onStoryboardUpdate: function() {
          this.update();
        },
        _onStoryboardReset:  function() {
        },
        _onStoryboardUnload: function() {
          if (this._$view) {
            this._$view.removeClass('show');
          }
        },
        _onWatchInfoReset:  function() {
          this.reset();
        }
      });

      return StoryboardView;
    })();

    window.NicovideoStoryboard.controller.StoryboardController = (function() {

      function StoryboardController(params) {
        this.initialize(params);
      }

      window.WatchApp.mixin(StoryboardController.prototype, {
        initialize: function(params) {
          console.log('%c initialize StoryboardController', 'background: lightgreen;');

          this._thumbnailInfo   = params.thumbnailInfo;
          this._watchController = params.watchController;
          this._config          = params.config;

          var evt = this._eventDispatcher = params.eventDispatcher;

          evt.addEventListener('onVideoInitialized',
            $.proxy(this._onVideoInitialized, this));

          evt.addEventListener('onWatchInfoReset',
            $.proxy(this._onWatchInfoReset, this));

          evt.addEventListener('onStoryboardSelect',
            $.proxy(this._onStoryboardSelect, this));

          evt.addEventListener('onEnableStoryboard',
            $.proxy(this._onEnableStoryboard, this));

          evt.addEventListener('onDisableStoryboard',
            $.proxy(this._onDisableStoryboard, this));

          evt.addEventListener('onGetflvLoadStart',
            $.proxy(this._onGetflvLoadStart, this));

          evt.addEventListener('onThumbnailInfoLoadStart',
            $.proxy(this._onThumbnailInfoLoadStart, this));

          evt.addEventListener('onThumbnailInfoLoad',
            $.proxy(this._onThumbnailInfoLoad, this));

          this._initializeStoryboard();
        },

        _initializeStoryboard: function() {
          this._initializeStoryboard = _.noop;

          if (!this._storyboardModel) {
            var nsv = window.NicovideoStoryboard;
            this._storyboardModel = new nsv.model.StoryboardModel({
              eventDispatcher: this._eventDispatcher,
              thumbnailInfo:   this._thumbnailInfo,
              watchController: this._watchController,
              isEnabled:       this._config.get('enabled') === true
            });
          }
          if (!this._storyboardView) {
            this._storyboardView = new window.NicovideoStoryboard.view.StoryboardView({
              watchController: this._watchController,
              eventDispatcher: this._eventDispatcher,
              storyboard: this._storyboardModel
            });
          }
        },

        load: function(watchId) {
          watchId = watchId || this._watchController.getWatchId();
          this._storyboardModel.load(watchId);
        },

        unload: function() {
          if (this._storyboardModel) {
            this._storyboardModel.unload();
          }
        },

        _onVideoInitialized: function() {
          this._initializeStoryboard();
          this._storyboardModel.reset();
        },

        _onWatchInfoReset: function() {
        },

        _onThumbnailInfoLoad: function(info) {
          //console.log('StoryboardController._onThumbnailInfoLoad', info);

          this._storyboardModel.update(info);
        },

        _onStoryboardSelect: function(vpos) {
          //console.log('_onStoryboardSelect', vpos);
          this._watchController.setVpos(vpos);
        },

        _onEnableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this._config.set('enabled', true);
            this.load();
          }, this), 0);
        },

        _onDisableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this._config.set('enabled', false);
            this.unload();
          }, this), 0);
        },

        _onGetflvLoadStart: function() {
        },

        _onThumbnailInfoLoadStart: function() {
        }
      });

      return StoryboardController;
    })();


    window.WatchApp.mixin(window.NicovideoStoryboard, {
      _addStyle: function(styles, id) {
        var elm = document.createElement('style');
        window.setTimeout(function() {
          elm.type = 'text/css';
          if (id) { elm.id = id; }

          var text = styles.toString();
          text = document.createTextNode(text);
          elm.appendChild(text);
          var head = document.getElementsByTagName('head');
          head = head[0];
          head.appendChild(elm);
        }, 0);
        return elm;
      },
      initialize: function() {
        console.log('%c initialize NicovideoStoryboard', 'background: lightgreen;');
        this.initializeUserConfig();

        var root = window.WatchApp.ns;
        this._playerAreaConnector =
          root.init.PlayerInitializer.playerAreaConnector;
        this._watchInfoModel =
          root.model.WatchInfoModel.getInstance();

        this._getflv          = window.NicovideoStoryboard.api.getflv;
        this._thumbnailInfo   = window.NicovideoStoryboard.api.thumbnailInfo;
        this._watchController = window.NicovideoStoryboard.external.watchController;

        if (!this._watchController.isPremium()) {
          this._watchController.popup.alert('プレミアムの機能を使っているため、一般では動きません');
          return;
        }

        this._storyboardController = new window.NicovideoStoryboard.controller.StoryboardController({
          thumbnailInfo:       this._thumbnailInfo,
          watchController:     this._watchController,
          eventDispatcher:     this.eventDispatcher,
          config:              this.config
        });

        this.initializeEvent();

        this._addStyle(__css__, 'NicovideoStoryboardCss');
      },
      initializeEvent: function() {
        console.log('%c initializeEvent NicovideoStoryboard', 'background: lightgreen;');

        var eventDispatcher = window.NicovideoStoryboard.eventDispatcher;

        var onMessage = function(event) {
          if (event.origin.indexOf('nicovideo.jp') < 0) return;
          try {
            var data = JSON.parse(event.data);
            if (data.id !== 'NicovideoStoryboard') { return; }

            eventDispatcher.dispatchEvent('onMessage', data.body, data.type);
          } catch (e) {
            console.log(
              '%cNicoVideoStoryboard.Error: window.onMessage  - ',
              'color: red; background: yellow',
              e
            );
            console.log('%corigin: ', 'background: yellow;', event.origin);
            console.log('%cdata: ',   'background: yellow;', event.data);
            console.trace();
          }
        };
        window.addEventListener('message', onMessage);

        this._watchInfoModel.addEventListener('reset', function() {
          eventDispatcher.dispatchEvent('onWatchInfoReset');
        });

        this._playerAreaConnector.addEventListener('onVideoInitialized', function() {
          eventDispatcher.dispatchEvent('onVideoInitialized');
        });

        this._getflv.addEventListener('onGetflvLoadStart', function() {
          eventDispatcher.dispatchEvent('onGetflvLoadStart');
        });
        this._getflv.addEventListener('onGetflvLoad', function(info) {
          eventDispatcher.dispatchEvent('onGetflvLoad', info);
        });

        this._thumbnailInfo.addEventListener('onThumbnailInfoLoadStart', function() {
          eventDispatcher.dispatchEvent('onThumbnailInfoLoadStart');
        });
        this._thumbnailInfo.addEventListener('onThumbnailInfoLoad', function(info) {
          eventDispatcher.dispatchEvent('onThumbnailInfoLoad', info);
        });

      },
      initializeUserConfig: function() {
        var prefix = 'NicoStoryboard_';
        var conf = {
          enabled: true,
          autoScroll: true
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
      load: function(watchId) {
        // 動画ごとのcookieがないと取得できないので指定できてもあまり意味は無い
        watchId = watchId || this._watchController.getWatchId();
        this._storyboardController.load(watchId);
      }

    });


    //======================================
    //======================================
    //======================================

    (function() {
      var watchInfoModel = window.WatchApp.ns.model.WatchInfoModel.getInstance();
      if (watchInfoModel.initialized) {
        console.log('%c initialize', 'background: lightgreen;');
        window.NicovideoStoryboard.initialize();
      } else {
        var onReset = function() {
          watchInfoModel.removeEventListener('reset', onReset);
          window.setTimeout(function() {
            watchInfoModel.removeEventListener('reset', onReset);
            console.log('%c initialize', 'background: lightgreen;');
            window.NicovideoStoryboard.initialize();
          }, 0);
        };
        watchInfoModel.addEventListener('reset', onReset);
      }
    })();

  };

  var flapi = function() {
    if (window.name.indexOf('getflvLoader') < 0 ) { return; }

    var resp    = document.documentElement.textContent;
    var origin  = 'http://' + location.host.replace(/^.*?\./, 'www.');

    try {
      parent.postMessage(JSON.stringify({
          id: 'NicovideoStoryboard',
          type: 'getflv',
          body: {
            url: location.href,
            info: resp
          }
        }),
        origin);
    } catch (e) {
      alert(e);
      console.log('err', e);
    }
  };


  var smileapi = function() {
    if (window.name.indexOf('StoryboardLoader') < 0 ) { return; }

    var resp    = document.getElementsByTagName('smile');
    var origin  = 'http://' + location.host.replace(/^.*?\./, 'www.');
    var xml = '';

    if (resp.length > 0) {
      xml = resp[0].outerHTML;
    }

    try {
      parent.postMessage(JSON.stringify({
          id: 'NicovideoStoryboard',
          type: 'storyboard',
          body: {
            url: location.href,
            xml: xml
          }
        }),
        origin);
    } catch (e) {
      console.log('err', e);
    }
  };



  var host = window.location.host || '';
  if (host === 'flapi.nicovideo.jp') {
    flapi();
  } else
  if (host.indexOf('smile-') >= 0) {
    smileapi();
  } else {
    var script = document.createElement('script');
    script.id = 'NicoVideoStoryboard';
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.appendChild(document.createTextNode("(" + monkey + ")()"));
    document.body.appendChild(script);
  }

})();
