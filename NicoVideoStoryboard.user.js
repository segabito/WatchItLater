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
    var DEBUG = true;
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

      .xDomainLoaderFrame.debug {
        position: static;
        width: 512px;
        height: 384px;
        border: 2px inset ;
      }

      .storyboardContainer {
        position: fixed;
        bottom: -300px;
        left: 0;
        right: 0;
        width: 100%;
        background: #ccc;
        border: 2px outset #000;
        z-index: 9000;
        overflow: visible;

        transition: bottom 0.5s ease;
      }

      .storyboardContainer.show {
        bottom: 0;
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
      }
      .storyboardContainer.success .storyboardInner {
        display: block;
      }

      .storyboardContainer .failMessage {
        display: none;
      }
      .storyboardContainer.fail .failMessage {
        display: block;
      }

      .storyboardContainer .storyboardInner .boardList {
        overflow: hidden;
      }

      .storyboardContainer .boardList .board {
        display: inline-block;
        cursor: pointer;
      }
      .storyboardContainer.debug .boardList .board {
      }

      .storyboardContainer .boardList .board > div {
        white-space: nowrap;
      }
      .storyboardContainer .boardList .board .border {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        border-style: solid;
        border-color: #006;
        border-width: 0 2px 0 2px;
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
        bottom: -10px;
        left: 50%;
        width: 32px;
        margin-left: -16px;
        color: #006;
        z-index: 9010;
        text-align: center;
      }

      .storyboardContainer .cursorTime {
        display: none;
        position: absolute;
        bottom: -20px;
        font-size: 10pt;
        border: 1px solid #000;
        z-index: 9010;
        background: #ffc;

      }
      .storyboardContainer:hover .cursorTime {
        display: block;
      }

      .storyboardContainer .turnDisable {
        position: absolute;
        display: inline-block;
        left: 150px;
        bottom: -32px;
        transition: bottom 0.3s ease-out;
      }
      .storyboardContainer:hover .turnDisable {
        bottom: 0;
      }
      .storyboardContainer .turnDisable button {
        background: none repeat scroll 0 0 #CCCCCC;
        border-color: #333333;
        border-radius: 18px 18px 0 0;
        border-style: solid;
        border-width: 2px 2px 0;
        width: 137px;
        cursor: pointer;
      }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var storyboardTemplate = [
            '<div id="storyboardContainer" class="storyboardContainer">',
              '<div class="storyboardHeader">',
                '<div class="turnDisable"><button>閉じる</button></div>',
                '<div class="pointer">▼</div>',
                '<div class="cursorTime"></div>',
              '</div>',
              '<div class="storyboardInner">',
              '</div>',
              '<div class="failMessage">',
              '</div>',
            '</div>',
            '',
          ''].join('');

    var EventDispatcher = (function() {
      // TODO: extend
      return window.WatchApp.ns.event.EventDispatcher;
    })();
    var eventDispatcher = new EventDispatcher();

    window.NicovideoStoryboard =
      (function() {
        return {api: {}, model: {}, view: {}, controller: {}, external: {}};
      })();

    var console =
      (function(debug) {
        var n = window._.noop;
        return debug ? window.console : {log: n, trace: n, time: n, timeEnd: n};
      })(DEBUG);

    window.NicovideoStoryboard.external.watchController = (function() {
      var root = window.WatchApp.ns;
      var nicoPlayerConnector = root.init.PlayerInitializer.nicoPlayerConnector;
      var watchInfoModel      = root.model.WatchInfoModel.getInstance();
      var viewerInfoModel     = root.init.CommonModelInitializer.viewerInfoModel;
      var externalNicoplayer;

      var getVpos = function() {
        return nicoPlayerConnector.getVpos();
      };
      var setVpos = function(vpos) {
        nicoPlayerConnector.seekVideo(vpos);
      };

      var isPlaying = function() {
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

      return {
        getVpos: getVpos,
        setVpos: setVpos,

        isPlaying: isPlaying,
        play:  play,
        pause: pause,

        isPremium: isPremium,

        getWatchId: getWatchId,
        getVideoId: getVideoId,

        popup: popup
      };
    })();


    window.NicovideoStoryboard.api.getflv = (function() {
      var BASE_URL = 'http://flapi.nicovideo.jp/api/getflv?v=';
      var loaderFrame, loaderWindow, cache = {};

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
        console.log('getflv.onGetflvLoad', info);
        eventDispatcher.dispatchEvent('onGetflvLoad', info);
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize getflv', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'getflvLoader';
        loaderFrame.className = DEBUG ? 'xDomainloaderFrame debug' : 'xDomainloaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage', onMessage);
      };

      var load = function(videoId) {
        initialize();
        var url = BASE_URL + videoId;
        console.log('getflv: ', url);

        eventDispatcher.dispatchEvent('onGetflvLoadStart', videoId);
        if (cache[url]) {
          eventDispatcher.dispatchEvent('onGetflvLoad', cache[url]);
        } else {
          loaderWindow.location.replace(url);
        }
      };

      return {
        load: load
      };
    })();

   window.NicovideoStoryboard.api.thumbnailInfo = (function() {
      var getflv = window.NicovideoStoryboard.api.getflv;
      var loaderFrame, loaderWindow, cache = {};

      var onGetflvLoad = function(info) {
        console.log('thumbnailInfo.onGetflvLoad', info);
        if (!info.url) {
          eventDispatcher.dispatchEvent(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'サムネイル情報の取得に失敗しました'}
            );
          return;
        }

        eventDispatcher.dispatchEvent('onThumbnailInfoLoadStart', info.url);
        if (cache[info.url]) {
          eventDispatcher.dispatchEvent('onThumbnailInfoLoad', cache[info.url]);
          return;
        }
        loaderWindow.location.replace(info.url + '&sb=1');
      };

      var onMessage = function(data, type) {
        if (type !== 'storyboard') { return; }
        console.log('thumbnailInfo.onMessage: ', data, type);

        var url = data.url;
        var xml = data.xml, $xml = $(xml), $storyboard = $xml.find('storyboard');

        if ($storyboard.length < 1) {
          eventDispatcher.dispatchEvent(
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
        eventDispatcher.dispatchEvent('onThumbnailInfoLoad', info);
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize thumbnailInfo', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'StoryboardLoader';
        loaderFrame.className = DEBUG ? 'xDomainloaderFrame debug' : 'xDomainloaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage',    onMessage);
        eventDispatcher.addEventListener('onGetflvLoad', onGetflvLoad);
      };

      var load = function(videoId) {
        initialize();
        getflv.load(videoId);
      };

      return {
        load: load
      };
    })();

    window.NicovideoStoryboard.model.StoryboardModel = (function() {

      function StoryboardModel(params) {
        this._watchController = params.watchController;
        this._eventDispatcher = params.eventDispatcher;
        this._thumbnailInfo   = params.thumbnailInfo;
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

          if (!this._view) {
            this._view = new window.NicovideoStoryboard.view.StoryboardView({
              watchController: this._watchController,
              eventDispatcher: this._eventDispatcher,
              storyboard: this
            });
          }
          this._view.update();
        },

        reset: function() {
          if (this._view) {
            this._view.reset();
          }
        },

        load: function(videoId) {
          this._thumbnailInfo.load(videoId);
        },

        unload: function() {
          if (this._view) {
            this._view.reset();
          }
        },

        getStatus:   function() { return this._info.status; },
        getMessage:  function() { return this._info.message; },
        getUrl:      function() { return this._info.url; },
        getDuration: function() { return parseInt(this._info.duration, 10); },

        getWidth:  function() { return parseInt(this._info.thumbnail.width, 10); },
        getHeight: function() { return parseInt(this._info.thumbnail.height, 10); },
        getCount:  function() { return parseInt(this._info.thumbnail.number, 10); },
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
          var mod = col % width;


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

    window.NicovideoStoryboard.view.TurnOnButton = (function() {

      var DEFAULT_TEXT = 'サムネイルを表示する';

      function TurnOnButton(params) {
        this._eventDispatcher = params.eventDispatcher;
        this.initialize();
      }

      window.WatchApp.mixin(TurnOnButton.prototype, {
        initialize: function() {
          this._$view = $([
              '<div class="turnEnableButtonContainer">',
                '<button>', DEFAULT_TEXT, '</button>',
              '</div>',
              '',
              '',
            ''].join(''));
          this._$button = this._$view.find('button');

          this._$button.on('click', $.proxy(function(e) {
            e.preventDefault();
            e.stopPropagation();

            this._$view.addClass('loading');
            this._eventDispatcher.dispatchEvent('onEnableStoryboard');
          }, this));

          $('body').append(this._$view);
        },
        disable: function() {
          this._$view
            .removeClass('loading')
            .addClass('disable');
          this._$button.text('この動画では表示できません');
        },
        reset: function() {
          this._$view.removeClass('loading disable');
          this._$button.text(DEFAULT_TEXT);
        }
      });

      return TurnOnButton;
    })();

    window.NicovideoStoryboard.view.StoryboardView = (function() {
      var VPOS_INTERVAL = 100;

      function StoryboardView(params) {
        this.initialize(params);
      }

      window.WatchApp.mixin(StoryboardView.prototype, {
        initialize: function(params) {
          console.log('%c initialize StoryboardView', 'background: lightgreen;');

          this._watchController = params.watchController;
          this._storyboard      = params.storyboard;
          this._eventDispatcher = params.eventDispatcher;

          this._isHover = false;
        },
        _initializeStoryboard: function() {
          this._initializeStoryboard = _.noop;
          console.log('%cStoryboardView.initializeStoryboard', 'background: lightgreen;');

          var $view = this._$view = $(storyboardTemplate);

          var $inner = this._$inner = $view.find('.storyboardInner');
          this._$failMessage = $view.find('.failMessage');
          this._$cursorTime = $view.find('.cursorTime');

          $view
            .on('click', '.board', $.proxy(function(e) {
              var $board = $(e.target), offset = $board.offset();
              var y = $board.attr('data-top') * 1;
              var x = e.pageX - offset.left;
              var page = $board.attr('data-page');
              var vpos = this._storyboard.getPointVpos(x, y, page);
              if (isNaN(vpos)) { return; }

              eventDispatcher.dispatchEvent('onStoryboardSelect', vpos);
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

            }, this))
            .on('mousewheel', $.proxy(function(e, delta) {
              e.preventDefault();
              e.stopPropagation();
              var left = $inner.scrollLeft();
              $inner.scrollLeft(left - delta * 180);

            }, this))
            .hover(
              $.proxy(function() {
                this._isHover = true;
              }, this),
              $.proxy(function() {
                this._isHover = false;
              }, this));

          $('body').append($view);
        },
        update: function() {
          this.disableTimer();

          this._initializeStoryboard();
          if (this._storyboard.getStatus() === 'ok') {
            this._updateSuccess();
          } else {
            this._updateFail();
          }
        },
        _updateSuccess: function() {
          var storyboard = this._storyboard;
          var pages = storyboard.getPageCount();
          var pageWidth  = storyboard.getPageWidth();
          var height = storyboard.getHeight();
          var rows  = storyboard.getRows();

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
                    background: 'url(' + src + ')',
                    backgroundPosition: '0 -' + height * j + 'px'
                  })
                  .addClass('page-', i)
                  .attr({
                    'data-src': src,
                    'data-page': i,
                    'data-top': height * j + height / 2,
                    'data-left': pageWidth * rowCnt,
                    'src': src
                  })
                  .append($borders.clone());
              $list.append($img);
              rowCnt++;
              if (rowCnt >= totalRows) {
                break;
              }
            }
          }

          this._$innerList = $list;

          this._$inner.empty().append($list).append(this._$pointer);
          this._$view.addClass('show success');
          this._$inner.scrollLeft(0);
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
        _updateFail: function() {
          this._$view.addClass('fail');
          this.disableTimer();
          this._watchController.popup.alert(this._storyboard.getMessage());
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
          this._timer = window.setInterval($.proxy(this._onTimerInterval, this), VPOS_INTERVAL);
        },
        disableTimer: function() {
          this._clearTimer();
        },
        _onTimerInterval: function() {
          if (this._isHover) { return; }
          var vpos = this._watchController.getVpos();
          if (this._lastVpos === vpos) { return; }
          this._lastVpos = vpos;
          this._onVposUpdate(vpos);
        },
        _onVposUpdate: function(vpos) {
          if (!this._$view.hasClass('success')) {
            return;
          }

          var storyboard = this._storyboard;
          var duration = Math.max(1, storyboard.getDuration());
          var per = vpos / (duration * 1000);
          var width = storyboard.getWidth();
          var boardWidth = storyboard.getCount() * width;
          var left = boardWidth * per + width / 2;

          this._$inner.scrollLeft(left);
        },
        reset: function() {
          this._lastVpos = -1;
          this._lastPage = -1;
          if (this._$view) {
            this._$view.removeClass('show success fail');
            this._$inner.empty();
          }
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
          console.log('%c initialize StoryboardController', 'background: lightgreen;', params);

          this._thumbnailInfo   = params.thumbnailInfo;
          this._watchController = params.watchController;
          this._config          = params.config;

          var evt = this._eventDispatcher = params.eventDispatcher;

          evt.addEventListener('onVideoInitialized',
            $.proxy(this._onVideoInitialized, this));

          evt.addEventListener('onWatchInfoReset',
            $.proxy(this._onWatchInfoReset, this));

          evt.addEventListener('onThumbnailInfoLoad',
            $.proxy(this._onThumbnailInfoLoad, this));

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
        },

        load: function(videoId) {
          this._initializeStoryboardModel();
          videoId = videoId || this._watchController.getVideoId();
          this._storyboardModel.load(videoId);
        },

        unload: function() {
          if (this._storyboardModel) {
            this._storyboardModel.unload();
          }
        },

        _initializeStoryboardModel: function() {
          if (!this._storyboardModel) {
            var nsv = window.NicovideoStoryboard;
            this._storyboardModel = new nsv.model.StoryboardModel({
              watchController: this._watchController,
              eventDispatcher: this._eventDispatcher,
              thumbnailInfo:   this._thumbnailInfo
            });
          }
        },

        _onVideoInitialized: function() {
          this._initializeStoryboardModel();
          if (this._storyboardModel) {
            this._storyboardModel.reset();
          }

          if (this._config.get('enabled') === true) {
            window.setTimeout($.proxy(function() {
              this.load();
            }, this), 1000);
          }
        },

        _onWatchInfoReset: function() {
          console.log('onWatchInfoReset');
          if (this._storyboardModel) {
            this._storyboardModel.reset();
          }
        },

        _onThumbnailInfoLoad: function(info) {
          console.log('StoryboardController._onThumbnailInfoLoad', info);

          this._initializeStoryboardModel();
          this._storyboardModel.update(info);
        },

        _onStoryboardSelect: function(vpos) {
          console.log('_onStoryboardSelect', vpos);
          this._watchController.setVpos(vpos);
        },

        _onEnableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this.config.set('enabled', true);
            this.load();
          }, this), 0);
        },

        _onDisableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this.config.set('enabled', false);
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


        this.eventDispatcher = eventDispatcher;

        var root = window.WatchApp.ns;
        this._playerAreaConnector =
          root.init.PlayerInitializer.playerAreaConnector;
        this._watchInfoModel =
          root.model.WatchInfoModel.getInstance();

        this._thumbnailInfo   = window.NicovideoStoryboard.api.thumbnailInfo;
        this._watchController = window.NicovideoStoryboard.external.watchController;

        this._storyboardController = new window.NicovideoStoryboard.controller.StoryboardController({
          thumbnailInfo:       this._thumbnailInfo,
          watchController:     this._watchController,
          eventDispatcher:     this.eventDispatcher,
          config:              this.config
        });

        console.log('%c initialize NicovideoStoryboard', 'background: lightgreen;');

        this.initializeEvent();

        this._addStyle(__css__, 'NicovideoStoryboardCss');
      },
      initializeEvent: function() {
        console.log('%c initializeEvent NicovideoStoryboard', 'background: lightgreen;');

        var onMessage = function(event) {
          if (event.origin.indexOf('nicovideo.jp') < 0) return;
          try {
            var data = JSON.parse(event.data);
            if (data.id !== 'NicovideoStoryboard') { return; }

            eventDispatcher.dispatchEvent('onMessage', data.body, data.type);
          } catch (e) {
            console.log(
              '%cError: window.onMessage - ',
              'color: red; background: yellow',
              e, event.origin, event.data);
          }
        };

        this._watchInfoModel.addEventListener('reset', $.proxy(function() {
          this.eventDispatcher.dispatchEvent('onWatchInfoReset');
        }, this));

        this._playerAreaConnector.addEventListener('onVideoInitialized', $.proxy(function() {
          this.eventDispatcher.dispatchEvent('onVideoInitialized');
        }, this));

        window.addEventListener('message', onMessage);
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
      load: function(videoId) {
        // 動画ごとのcookieがないと取得できないので指定できてもあまり意味は無い
        videoId = videoId || this._watchController.getVideoId();
        this._storyboardController.load(videoId);
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
  if (host.indexOf('smile') >= 0) {
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
