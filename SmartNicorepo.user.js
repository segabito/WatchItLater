// ==UserScript==
// @name        SmartNicorepo
// @namespace   https://github.com/segabito/
// @description ニコレポの「投稿」以外をデフォルトで折りたたむ ＆ お気に入りユーザーに最終更新を表示
// @include     http://www.nicovideo.jp/my/*
// @include     http://www.nicovideo.jp/user/*
// @include     http://www.nicovideo.jp/my/fav/user
// @include     http://www.nicovideo.jp/mylist/*
// @version     2.2.0
// @grant       none
// ==/UserScript==

(function() {
  var monkey =
  (function() {
    var $ = window.jQuery;

    function addStyle(styles, id) {
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
    }

    var __nicorepocss__ = (function() {/*
      .nicorepo .log.log-user-video-upload {
        background: #ffe;
      }
      .nicorepo .log.log-user-video-upload .log-target-thumbnail ,.nicorepo .log.log-user-seiga-image-upload .log-target-thumbnail {
        width: auto; margin-left: -30px;
      }
      .nicorepo .log.log-user-video-upload .video , .nicorepo .log.log-user-seiga-image-upload .seiga_image {
        height: auto !important; width: 130px !important; margin-top: 0px;
        margin-bottom: 0 !important; margin-left: 0 !important;
      }
      #nicorepo .timeline > .log {
        max-height: 500px;
        transition: max-height 0.4s ease-in-out;
      }
      #nicorepo.show-upload-only .timeline > .log:not(.log-user-video-upload):not(.log-user-seiga-image-upload):not(.log-user-register-chblog) {
        max-height: 22px;
        overflow: hidden;
      }
      #nicorepo .timeline > .log:not(.log-user-video-upload):not(.log-user-seiga-image-upload):not(.log-user-register-chblog):hover {
        max-height: 500px;
        overflow: hidden;
        transition: max-height 0.4s ease-in-out 0.8s;
      }
      .toggleUpload {
        position: absolute; top: 32px; right: 32px; font-weight: bolder; cursor: pointer; color: #888; padding: 8px;
        z-index: 1000;
        box-shadow: 2px 2px 2px #333;
      }
      .toggleUpload.bottom {
        top: auto; right: 32px; bottom: 32px;
      }
      .show-upload-only .toggleUpload {
        color: red;
      }
      .toggleUpload:after {
        content: ': OFF';
      }
      .show-upload-only .toggleUpload:after {
        content: ': ON';
      }

      .togglePagerize {
        position: fixed;
        bottom: 0;
        right: 0;
        color: #888;
        font-weight: bolder;
        cursor: pointer;
        border: 2px solid #666;
      }
      .togglePagerize.enable {
        color: red;
      }
      .togglePagerize:after {
        content: ': OFF';
      }
      .togglePagerize.enable:after {
        content: ': ON';
      }

     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var __favusercss__ = (function() {/*

      #favUser .outer.updating {
      }
      #favUser .outer.updating * {
        cursor: wait;
      }
      #favUser .outer.done .showNicorepo {
        display: none;
      }

      #favUser .nicorepo {
        color: #800;
        clear: both;
        margin-bottom: 24px;
      }
      #favUser .uploadVideoList, #favUser .seigaUserPage {
        font-size: 80%;
        margin-left: 16px;
      }

      #favUser .nicorepo.fail {
        color: #800;
        clear: both;
        margin-left: 64px;
      }


      #favUser .nicorepo.success {
        padding: 8px;
        overflow: auto;
        border: 1px inset;
        max-height: 300px;
      }

      .nicorepo .log-target-thumbnail,
      .nicorepo .log-target-info {
        display: inline-block;
        vertical-align: middle;
      }
      .nicorepo .log-target-thumbnail .imageContainer {
        width: 64px;
        height: 48px;
        background-color: #fff;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transition: 0.2s width ease 0.4s, 0.2s height ease 0.4s;
      }
      .nicorepo .log-target-thumbnail .imageContainer:hover {
        width: 128px;
        height: 96px;
      }
      .nicorepo .log-target-info .time {
        display: block;
        font-size: 80%;
        color: black;
      }
      .nicorepo .log-target-info .logComment {
        display: block;
        font-size: 80%;
        color: black;
      }
      .nicorepo .log-target-info .logComment:before {
        content: '「';
      }
      .nicorepo .log-target-info .logComment:after {
        content: '」';
      }
      .nicorepo .log-target-info a {
        display: inline-block;
        min-width: 100px;
      }
      .nicorepo .log-target-info a:hover {
        background: #ccf;
      }


      .nicorepo .log.log-user-video-round-number-of-view-counter {
        display: none;
      }

      .nicorepo .log-content {
        margin: 4px 8px;
        position: relative;
      }
      .nicorepo .log-footer {
        position: absolute;
        top: 0;
        left: 138px;
      }
      .nicorepo .log-footer a {
        font-size: 80%;
        color: black;
      }

      .nicorepo .log .time:after {
        background: #888;
        color: #fff;
        border-radius: 4px;
        display: inline-block;
        padding: 2px 4px;
      }
      .nicorepo .log.log-user-register-chblog    .time:after,
      .nicorepo .log.log-user-video-upload       .time:after,
      .nicorepo .log.log-user-seiga-image-upload .time:after {
        content: '投稿';
        background: #866;
      }

      .nicorepo .log.log-user-mylist-add-blomaga .time:after,
      .nicorepo .log.log-user-mylist-add         .time:after  {
        content: 'マイリスト';
      }
      .nicorepo .log.log-user-live-broadcast     .time:after  {
        content: '放送';
      }
      .nicorepo .log.log-user-seiga-image-clip   .time:after  {
        content: 'クリップ';
      }
      .nicorepo .log.log-user-video-review       .time:after  {
        content: 'レビュー';
      }
      .nicorepo .log.log-user-uad-advertise      .time:after  {
        content: '広告';
      }

      .nicorepo .log.log-user-video-upload {
        background: #ffe;
      }

      .nicorepo .log.log-user-video-upload .log-target-thumbnail,
      .nicorepo .log.log-user-seiga-image-upload .log-target-thumbnail {
      }
      .nicorepo .log.log-user-video-upload .video,
      .nicorepo .log.log-user-seiga-image-upload .seiga_image {
      }


      .nicorepo .log-author,
      .nicorepo .log-body,
      .nicorepo .log-res,
      .nicorepo .log-comment,
      .nicorepo .log-footer {
        display: none !important;
      }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var __large_thumbnail_css__ = (function() {/*

       .largeThumbnailLink {
         display: inline-block;
       }

       .largeThumbnailLink::after {
         position: fixed;
         bottom: -400px;
         left: 24px;
         opacity: 0;
         transition:
           bottom     0.5s ease 0.5s,
           z-index    0.5s ease,
           box-shadow 0.5s ease 0.5s,
           opacity    0.5s ease 0.5s;
         z-index: 100000;
       }

       #PAGEBODY .largeThumbnailLink::after {
         left: auto;
         right: 24px;
       }

       .largeThumbnailLink:hover::after {
         position: fixed;
         bottom: 24px;
         opacity: 1;
         box-shadow: 4px 4px 4px #333;
         transition:
           bottom     0.2s ease,
           z-index    0.2s ease,
           box-shadow 0.2s ease,
           opacity    0.2s ease;
         z-index: 100100;
       }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');


    var initializeLargeThumbnail = function(type, container, selector) {
      console.log('%cinitializeLargeThumbnail: type=%s', 'background: lightgreen;', type);
      addStyle(__large_thumbnail_css__);

      // 大サムネが存在する最初の動画ID。 ソースはちゆ12歳
      // ※この数字以降でもごく稀に例外はある。
      var threthold = 16371888;
      var hasLargeThumbnail = function(videoId) { // return true;
        var cid = videoId.substr(0, 2);
        if (cid !== 'sm') { return false; }

        var fid = videoId.substr(2) * 1;
        if (fid < threthold) { return false; }

        return true;
      };

      var onLoadImageError = function() {
        console.log('%c large thumbnail load error!', 'background: red;', this);
        this.src = this.src.replace('.L', '');
        $(this)
          .removeClass('largeThumbnail')
          .closest('a')
          .removeClass('largeThumbnailLink');
      };

      var updatedItems = [];
      var each = function(i, v) {
        try{
          //console.log(i, v); //return;
          var href = v.href;
          if (typeof href !== 'string' || href.toString().indexOf('/watch/sm') < 0) {
            return;
          }

          var videoId = href.replace(/^.+(sm\d+).*$/, '$1');

          if (!hasLargeThumbnail(videoId)) {
            return;
          }

          var $this = $(v);
          var $thumbnail = $this.find('img');
          var src = $thumbnail.attr('src');
          var org = $thumbnail.attr('data-original');
          var attr = org ? 'data-original' : 'src';
          src = org ? org : src;

          //console.log('', attr, src, org);

          if (src && src.indexOf('.L') < 0 && src.indexOf('/smile?i=') > 0) {
            var url = src + '.L';
            $thumbnail
              .on('error', onLoadImageError)
              .addClass('largeThumbnail ' + videoId)
              .attr(attr, url);

            $this.addClass('largeThumbnailLink ' + videoId);
            updatedItems.push([videoId, url]);
          }
        } catch (e) {
          console.error(e);
        }
      };

      var cssAdded = {};
      var updateCss = function(items) {
        if (items.length < 1) { return; }
        var css = [];
        for (var i = 0, len = items.length; i < len; i++) {
          var videoId = items[i][0], src = items[i][1];
          if (cssAdded[videoId]) {
            continue;
          }
          cssAdded[videoId] = true;
          css.push([
            '.largeThumbnailLink.', videoId, '::after {',
            '  content: url(', src, ');',
            '}',
          ''].join(''));
        }
        if (css.length > 0) {
          addStyle(css.join(''));
        }
      };

      var timer;
      var update = function() {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(function() {
          console.log('%cupdate large thumbnail', 'background: lightgreen;');
          updatedItems = [];
          $(selector).each(each);
          updateCss(updatedItems);
          timer = null;
        }, 500);
      };

      update();

      $(container).on('DOMNodeInserted', update);
    };



     window.SmartNicorepo = {
       model: {},
       util: {},
       initialize: function() {
         this.initializeUserConfig();
         if (location.pathname === '/my/fav/user') {
           this.initializeFavUser();
         } else {
           this.initializeNicorepo();
           this.initializeAutoPageRize();
         }
       },
       initializeUserConfig: function() {
         var prefix = 'SmartNicorepo_';
         var conf = {
            showUploadOnly: false,
            autoPagerize: true
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
             //console.log('%cupdate config {"%s": "%s"}', 'background: cyan', key, value);
             window.localStorage.setItem(prefix + key, JSON.stringify(value));
           }
         };
       },
       initializeNicorepo: function() {
         addStyle(__nicorepocss__, 'nicorepoCss');

         var config = this.config;
         var toggle = $.proxy(function() {
           $nicorepo.toggleClass('show-upload-only');
           config.set('showUploadOnly', $nicorepo.hasClass('show-upload-only'));
         }, this);

         var $nicorepo = $('#nicorepo').dblclick(toggle);
         var $button = $('<button class="toggleUpload">投稿だけ表示</button>').click(toggle);

         $nicorepo.toggleClass('show-upload-only', config.get('showUploadOnly'));


         $('.timeline>*:first').before($button);
         $('.timeline>*:last').before($button.clone(true).addClass('bottom'));
       },
       initializeFavUser: function() {
         addStyle(__favusercss__, 'favUserCss');
//         this.loadFavUserList()
//           .then($.proxy(function(watchitems) {
//              console.log('%c ok:',   'background: #8f8;', watchitems.length);
//
//              this._itemList = new window.SmartNicorepo.model.WatchItemList(watchitems);
//
//              console.log('item list', this._itemList.getSortedItems());
//
//           }, this));
          $('.posRight .arrow').each(function(i, elm) {
            var $elm = $(elm), $lnk = $elm.clone();
            $lnk
              .html('<span></span> ニコレポを表示&nbsp;')
              .addClass('showNicorepo');
            $elm.before($lnk);
          });

          $('.outer .section a').each(function(i, elm) {
            var $elm = $(elm), href = $elm.attr('href');
            if (href.match(/\/(\d+)$/)) {
              var userId = RegExp.$1;
              var $video = $('<a class="uploadVideoList">動画一覧</a>')
                .attr('href', '/user/' + userId + '/video');
              var $seiga = $('<a class="seigaUserPage">静画一覧</a>')
                .attr('href', 'http://seiga.nicovideo.jp/user/illust/' + userId);
              $elm.after($seiga).after($video);
            }
          });

          var getClearBusy = function($elm) {
            return function() {
              $elm.removeClass('updating').addClass('done');
            };
          };

          $('#favUser .showNicorepo').off().on('click', $.proxy(function(e) {
            if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            var $elm = $(e.target);
            var userId = $elm.attr('data-nico-nicorepolistid');
            if (!userId) { return; }
            var $outer = $elm.closest('.outer');
            if ($outer.hasClass('updating')) {
              return;
            }

            var clearBusy = getClearBusy($outer);
            $outer.addClass('updating');
            window.setTimeout(clearBusy, 3000);

            this.loadNicorepo(userId, $outer).then(clearBusy, clearBusy);

          }, this));
       },
       initializeAutoPageRize: function() {
         if (!window._) { return; }
         var config = this.config;
         var $button = $('<button class="togglePagerize">自動読込</button>');
         var timer = null;

         var onButtonClick = function(e) {
           toggle();
           updateView();
         };
         var toggle = $.proxy(function() {
           this._isAutoPagerizeEnable = !this._isAutoPagerizeEnable;
           config.set('autoPagerize', this._isAutoPagerizeEnable);
           if (this._isAutoPagerizeEnable) {
             bind();
           } else {
             unbind();
           }
         }, this);
         var updateView = $.proxy(function() {
           $button.toggleClass('enable', this._isAutoPagerizeEnable);
         }, this);
         var onWindowScroll = _.debounce($.proxy(this._onWindowScroll, this), 100);
         var bind = $.proxy(function() {
           $(window).on('scroll', onWindowScroll);
           timer = window.setInterval($.proxy(this._autoPagerize, this), 1000);
         }, this);
         var unbind = $.proxy(function() {
           $(window).off('scroll', onWindowScroll);
           window.clearInterval(timer);
         }, this);


         $button.click(onButtonClick);
         $('body').append($button);

         this._isAutoPagerizeEnable = config.get('autoPagerize');
         if (this._isAutoPagerizeEnable) { bind(); }

         updateView();

       },
       _onWindowScroll: function() {
         this._autoPagerize();
       },
       _autoPagerize: function() {
         if (!this._isAutoPagerizeEnable) { return; }

         // TODO: キャッシュする
         var $nextPage = $('.next-page');
         var $window = $(window);

         var isLoading = function() {
           return $nextPage.hasClass('loading');
         };

         var isScrollIn = function() {
            var bottom =
              $window.scrollTop() + $window.innerHeight() - $nextPage.offset().top;
            return bottom > 100;
         };

         if (isScrollIn() && !isLoading()) {
           this._$nextPage = null;
           $nextPage.find('.next-page-link').click();
         }
       },
       loadNicorepo: function(userId, $container) {
         // http://www.nicovideo.jp/user/[userId]/top?innerPage=1
         var url = 'http://www.nicovideo.jp/user/' + userId + '/top?innerPage=1';

         var fail = function(msg) {
           var $fail = $('<div class="nicorepo fail">' + msg + '</div>');
           $container.append($fail);
           autoScrollIfNeed($fail);
         };

         // ニコレポが画面の一番下よりはみ出していたら見える位置までスクロール
         var autoScrollIfNeed = function($target) {
            var
              scrollTop = $('html').scrollTop(),
              targetOffset = $target.offset(),
              clientHeight = $(window).innerHeight(),
              clientBottom = scrollTop + clientHeight,
              targetBottom = targetOffset.top + $target.outerHeight();

            if (targetBottom > clientBottom) {
              $('html').animate({
                scrollTop: scrollTop + $target.outerHeight()
              }, 500);
            }
         };

         var success = function($dom, $logBody) {
            var $result = $('<div class="nicorepo success" />');
            var $img = $logBody.find('img'), $log = $logBody.find('.log');
            $img.each(function() {
              var $this = $(this), $parent = $this.parent();
              var lazyImg = $this.attr('data-original');
              if (lazyImg) {
                var $imageContainer = $('<div class="imageContainer"/>');
                $imageContainer.css('background-image', 'url(' + lazyImg + ')');
                $this.before($imageContainer);
                $this.remove();
              }
              if (window.WatchItLater) {
                var href = $parent.attr('href');
                if (href) {
                  $parent.attr('href', href.replace('http://www.nicovideo.jp/watch/', 'http://nico.ms/'));
                }
              }
            });
            $logBody.each(function() {
              var $this = $(this), time = $this.find('time:first').text(), logComment = $this.find('.log-comment').text();

              $this.find('.log-target-info>*:first')
                .before($('<span class="time">' + time + '</span>'));
              if (logComment) {
                $this.find('.log-target-info')
                  .append($('<span class="logComment">' + logComment + '</span>'));
              }
            });

            $result.append($logBody);
            $container.append($result);
            $result.scrollTop(0);

            autoScrollIfNeed($result);
         };

         return $.ajax({
           url: url,
           timeout: 30000
         }).then(
          function(resp) {
            var
              $dom = $(resp),
              // 欲しいのはそのユーザーの「行動」なので、
              // xx再生やスタンプみたいなのはいらない
              $logBody = $dom.find('.log:not(.log-user-video-round-number-of-view-counter):not(.log-user-action-stamp):not(.log-user-live-video-introduced)');
            if ($logBody.length < 1) {
              fail('ニコレポが存在しないか、取得に失敗しました');
            } else {
              success($dom, $logBody);
            }
          },
          function() {
            fail('ニコレポの取得に失敗しました');
          });

      },
      loadFavUserList: function() {
         var def = new $.Deferred();
         // このAPIのupdate_timeが期待していた物と違ったのでボツ
         // create_timeとupdate_timeはどちらも同じ値が入ってるだけだった。(なんのためにあるんだ?)
         //
         $.ajax({
           url: 'http://www.nicovideo.jp/api/watchitem/list',
           timeout: 30000,
           complete: function(resp) {
             var json;
             try {
               json = JSON.parse(resp.responseText);
             } catch (e) {
               console.log('%c parse error: ', 'background: #f88', e);
               return def.reject('json parse error');
             }

             if (json.status !== 'ok') {
               console.log('%c status error: ', 'background: #f88', json.status);
               return def.reject('status error', json.status);
             }
             return def.resolve(json.watchitem);
           },
           error: function(req, status, thrown) {
             if (status === 'parsererror') {
               return;
             }
             console.log('%c ajax error: ' + status, 'background: #f88', thrown);
             return def.reject(status);
           }
         });
         return def.promise();
       }

     };


     window.SmartNicorepo.model.WatchItem = function() { this.initialize.apply(this, arguments); };
     window.SmartNicorepo.model.WatchItem.prototype = {
       initialize: function(seed) {
         this._seed = seed;
         this.itemType = seed.item_type || '1';
         this.itemId   = seed.item_id || '';
         if (typeof seed.item_data === 'object') {
           var data = seed.item_data;
           this.userId       = data.id;
           this.nickname     = data.nickname;
           this.thumbnailUrl = data.thumbnail_url;
         }
         var now = (new Date()).getTime();
         this.createTime = new Date(seed.create_time ? seed.create_time * 1000 : now);
         this.updateTime = new Date(seed.update_time ? seed.update_time * 1000 : now);
       }
     };

     window.SmartNicorepo.model.WatchItemList = function() { this.initialize.apply(this, arguments); };
     window.SmartNicorepo.model.WatchItemList.prototype = {
       initialize: function(watchItems) {
         this._seed = watchItems;
         this._items = {};
         this._itemArray = [];
         for (var i = 0, len = watchItems.length; i < len; i++) {
           var item = new window.SmartNicorepo.model.WatchItem(watchItems[i]);
           this._items[item.userId] = item;
           this._itemArray.push(item);
         }
       },
       getItem: function(userId) {
         return this._items[userId];
       },
       getSortedItems: function() {
         var result = this._itemArray.concat();
         result.sort(function(a, b) {
           return (a.updateTime < b.updateTime) ? 1 : -1;
         });
         return result;
       }
     };


     window.Nico.onReady(function() {
       console.log('%cNico.onReady', 'background: lightgreen;');
       if (location.pathname.indexOf('/my/top') === 0) {
         initializeLargeThumbnail('nicorepo', '.nicorepo', '.log-target-thumbnail a:not(.largeThumbnail)');
       } else
       if (location.pathname.indexOf('/my/mylist') === 0) {
         initializeLargeThumbnail('mylist', '#mylist', '.thumbContainer a:not(.largeThumbnail)');
       } else
       if (location.pathname.indexOf('/my/video') === 0) {
         initializeLargeThumbnail('video', '#video', '.thumbContainer a:not(.largeThumbnail)');
       } else
       if (location.pathname.indexOf('/mylist') === 0) {
         initializeLargeThumbnail('openMylist', '#PAGEBODY', '.SYS_box_item a:not(.watch):not(.largeThumbnail):visible');
       } else
       if (location.pathname.match(/\/user\/\d+\/video/)) {
         initializeLargeThumbnail('video', '#video', '.thumbContainer a:not(.largeThumbnail)');
       } else
       if (location.pathname.match(/\/user\/\d+\/top/)) {
         initializeLargeThumbnail('nicorepo', '.nicorepo', '.log-target-thumbnail a:not(.largeThumbnail)');
       }
     });

     if (location.pathname.indexOf('/mylist') < 0) {
       window.SmartNicorepo.initialize();
     }

   }); // end of monkey

    var gm = document.createElement('script');
    gm.id = 'smartNicorepoScript';
    gm.setAttribute("type", "text/javascript");
    gm.setAttribute("charset", "UTF-8");
    gm.appendChild(document.createTextNode("(" + monkey + ")(window)"));
    document.body.appendChild(gm);

})();
