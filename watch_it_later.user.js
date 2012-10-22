// ==UserScript==
// @name           WatchItLater
// @namespace      niconico
// @description    動画を見る前にマイリストに登録したいGreasemonkey (Chrome/Fx用)
// @include        http://www.nicovideo.jp/*
// @include        http://ext.nicovideo.jp/thumb/*
// @exclude        http://ads*.nicovideo.jp/*
// @exclude        http://live*.nicovideo.jp/*
// @match          http://www.nicovideo.jp/*
// @match          http://*.nicovideo.jp/*
// @match          http://ext.nicovideo.jp/*
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @grant          GM_getValue
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @version        1.121023
// ==/UserScript==

// * ver 1.121023
// - QWatch上でのみ、新しいウィンドウで開くためのリンク追加
// - プレイリストの吹き出しとポップアップが被らないよう調整


// * ver 1.121021
// - プレイリストの開閉(デフォルトは閉)
// - cssの調整

// * ver 1.121018
// - 「動画をもっと見る」が時々行方不明になるのを修正
// - 空っぽになった左になんか表示してみる

// * ver 1.121018
// - QWatchに対応
// - コメントパネルを広く
// （＾ω＾）…



// TODO: GM_addStyleを活用


(function() {
  var isNativeGM = true;
  var monkey = 
  (function(isNativeGM){
    var w;
    try { w = unsafeWindow || window; } catch (e) { var w = window;}
    var document = w.document;

    function addlink(e, video_id) {







//      var eco    = document.createElement('a');
//      eco.innerHTML = '&nbsp;eco';
//      eco.title = 'エコノミーで視聴';
//      eco.href   = e.href.replace(/\?.+$/, '') + '?eco=1';
//      eco.className = 'itemEcoLink';
//      panel.addExtElement(eco);

    }

    var conf = {
      autoBrowserFull: false,
      autoNotFull: true, // 再生完了時にフルスクリーン解除(原宿と同じにする)
      autoTagPin: false,
      topPager: true, // 検索ボックスのページャを上にする
      fxInterval: 40, // アニメーションのフレームレート 40 = 25fps
      hideLeftIchiba: false,
      autoClosePlaylistInFull: true, // 全画面時にプレイリストを自動で閉じる
      hideNewsInFull: true, // 全画面時にニュースを閉じる
      wideCommentPanel: true // コメントパネルをワイドにする
    };

  //===================================================
  //===================================================
  //===================================================


    if (!isNativeGM) {
      this.GM_getValue = function(key, def) {
        if (window.localStorage[key] === undefined) return def;
        return JSON.parse(window.localStorage.getItem(key));
      };
      this.GM_setValue = function(key,value) {
        return window.localStorage.setItem(key, JSON.stringfy(value));
      };
      this.GM_addStyle = function(styles) {
        var S = document.createElement('style');
        S.type = 'text/css';
        var T = ''+styles+'';
        T = document.createTextNode(T)
        S.appendChild(T);
        var head = document.getElementsByTagName('head');
        head = head[0]
        head.appendChild(S);
        return;
      };
      this.GM_xmlhttpRequest = function(options) {
        try {
          var req = new XMLHttpRequest();
          var method = options.method || 'GET';
          req.onreadystatechange = function() {
            if (req.readyState == 4) {
              if (typeof options.onload == "function") options.onload(req);
            }
          };
          req.open(method, options.url, true);
          if (options.headers) {
            for (var h in options.headers) {
              req.setRequestHeader(h, options.headers[h]);
            }
          }
          
          req.send(options.data || null);
        } catch (e) {
          console.log(e);
        }
      };
    }



  (function() {
    var style = [
    // 動画タグのポップアップ
      '.tagItemsPopup {',
        'position: absolute; ',
        'min-width: 150px; ',
        'font-Size: 10pt; ',
        'background: #eef; ',
        'z-index: 2000000; ',
        'box-shadow: 2px 2px 2px #888;',
      '}\n',
      '.tagItemsPopup ul,.tagItemsPopup ul li {',
        'position: relative; ',
        'list-style-type: none; ',
        'margin: 0; padding: 0; ', 
      '}\n',
      '.tagItemsPopup li a{',
      '}\n',
      '.tagItemsPopup .nicodic {',
        'margin-right: 4px;; ',
      '}',
      '.tagItemsPopup .icon{',
        'width: 17px; ',
        'height: 15px; ',
        '',
      '}\n',
    // マイリスト登録パネル
      '.mylistPopupPanel {',
        'height: 24px; ',
        'z-index: 10000; ',
        'border: 1px solid silver;',
        'border-radius: 3px; ',
        'padding: 0;',
        'margin: 0;',
        'overflow: hidden; ',
        'display: inline-block; ',
        'background: #eee; ',
      '}\n',
      // マウスホバーで出るほうのマイリスト登録パネル
      '.mylistPopupPanel.popup {',
        'position: absolute; ',
        'z-index: 1000000;',
        'box-shadow: 2px 2px 2px #888;',
      '}\n',
      // マイリスト登録パネルの中の各要素
      '.mylistPopupPanel .mylistSelect {',
        'width: 64px; ',
        'margin: 0;',
        'padding: 0;',
        'font-size: 80%; ',
        'white-space: nowrap; ',
        'background: #eee; ',
        'border: 1px solid silver;',
      '}\n',
      '.mylistPopupPanel button {',
        'margin: 0; ',
        'font-weight: bolder; ',
        'cursor: pointer;  ',
      '}\n',
      '.mylistPopupPanel button:active, .playlistToggle:active {',
        'border:1px inset !important',
      '}\n',
      '.mylistPopupPanel button:hover, .playlistToggle:hover {',
        'border:1px outset',
      '}\n',
      '.mylistPopupPanel .mylistAdd {',
        'border:1px solid #d7dada; border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f4f5f5;',
        ' background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9dddd), color-stop(100%, #c6c3c3));',
        ' background-image: -webkit-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -moz-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -ms-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -o-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: linear-gradient(top, #d9dddd, #c6c3c3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d9dddd, endColorstr=#c6c3c3);',

      '}\n',
      '.mylistPopupPanel .deflistRemove{',
        'border:1px solid #ebb7b7; border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f7e3e3;',
        ' background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f7e3e3), color-stop(100%, #ffd7d7));',
        ' background-image: -webkit-linear-gradient(top, #f7e3e3, #ffd7d7);',
        ' background-image: -moz-linear-gradient(top, #f7e3e3, #ffd7d7);',
        ' background-image: -ms-linear-gradient(top, #f7e3e3, #ffd7d7);',
        ' background-image: -o-linear-gradient(top, #f7e3e3, #ffd7d7);',
        ' background-image: linear-gradient(top, #f7e3e3, #ffd7d7);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#f7e3e3, endColorstr=#ffd7d7);',

      '}\n',
      '.mylistPopupPanel .tagGet{',
        'border:1px solid #d7dada; border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f4f5f5;',
        ' background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9dddd), color-stop(100%, #c6c3c3));',
        ' background-image: -webkit-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -moz-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -ms-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: -o-linear-gradient(top, #d9dddd, #c6c3c3);',
        ' background-image: linear-gradient(top, #d9dddd, #c6c3c3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d9dddd, endColorstr=#c6c3c3);',

      '}\n',
      '.mylistPopupPanel .closeButton{',
        'color: #339; ',
        'padding: 0;',
        'margin: 0;',
        'font-size: 80%;',
        'text-decoration: none;', 
      '}\n',
      '.mylistPopupPanel .newTabLink{',
        'padding: 0 2px; text-decoration: underline; text-shadow: -1px -1px 0px #442B2B;', 
      '}\n',
      '.mylistPopupPanel.fixed .newTabLink, .mylistPopupPanel.fixed .closeButton {',
        'display: none;',
      '}\n',
      '',
      
      

      // 全画面時にタグとプレイリストを表示しない時
      'body.full_and_mini.full_with_browser #playerContainerSlideArea{',
        'margin-bottom: 0 !important;',
      '}\n',
      'body.full_and_mini.full_with_browser #playlist{',
        'z-index: auto;',
      '}\n',
      'body.full_and_mini.full_with_browser .generationMessage{',
        'display: inline-block;',
      '}\n',
      // 全画面時にタグとプレイリストを表示する時
      'body.full_with_browser #playlist{',
        'z-index: 100;',
      '}\n',
      'body.full_with_browser .generationMessage{',
        'display: none;',
      '}\n',
      'body.full_with_browser .browserFullOption{',
        'padding-right: 200px;', // マイリストパネルの下に隠れるのでずらす
      '}\n',
      // 全画面時にニュースを隠す時
      'body.full_with_browser.hideNewsInFull #playerContainerSlideArea{',
        'margin-bottom: -45px;',
      '}\n',
      // 少しでも縦スクロールを減らすため、動画情報を近づける。人によっては窮屈に感じるかも
      '#outline {',
        'margin-top: -64px;',
      '}\n',
      '#outline #feedbackLink{',
        'margin-top: 64px;',
      '}\n',
      // ヘッダに表示する再生数
      '#videoCounter {',
        'color: #ff9; font-size: 70%;',
      '}\n',
      // 左に表示する動画情報
      '#ichibaPanel.leftVideoInfo {',
        'background: #bbb; text-Align: left; overflow-Y: auto;', 
      '}\n',
      '#ichibaPanel.leftVideoInfo .userIconContainer{',
        'background: #ccc; width: 100%;', 
      '}\n',
      
      
      // プレイリスト出したり隠したり
      'body.w_notFull #playlist{',
        'position: absolute; top: -9999px;', 
      '}\n',
      'body.w_notFull #playlist.w_show{',
        'position: relative; top: 0;', 
      '}\n',
      '#content .playlistToggle {',
        'cursor: pointer;position: absolute; bottom: 0;', 
        'border:1px solid #7d99ca; border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 0px 0px 0px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #a5b8da;',
        ' background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #a5b8da), color-stop(100%, #7089b3));',
        ' background-image: -webkit-linear-gradient(top, #a5b8da, #7089b3);',
        ' background-image: -moz-linear-gradient(top, #a5b8da, #7089b3);',
        ' background-image: -ms-linear-gradient(top, #a5b8da, #7089b3);',
        ' background-image: -o-linear-gradient(top, #a5b8da, #7089b3);',
        ' background-image: linear-gradient(top, #a5b8da, #7089b3);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#a5b8da, endColorstr=#7089b3);',
      '}\n',
      
      
      // ページャーの字が小さくてクリックしにくいよね
      '#resultPagination {',
        'padding: 5px; font-weight: bolder; border: 1px dotted silter; font-size: 130%;',
      '}\n',
       
      '#playlistContainer #playlistContainerInner .playlistItem .balloon {\n',
        'bottom: auto; top: -2px; padding: auto;\n',
      '}\n',
    ''].join('');
    GM_addStyle(style);
  })();


    conf.save = function() {
     try {
       for (var v in conf) {
         if (typeof conf[v] == 'function') continue;
         GM_setValue(v, conf[v]);
       }
     } catch (e) {
     }
    };
    conf.load = function() {
      try {
        for (var v in conf) {
          if (typeof conf[v] == 'function') continue;
          conf[v] = GM_getValue(v, conf[v]);
        }
      } catch (e) {
      }
    };
    conf.reset = (function(conf_def) {
      return function() {
        for (var v in conf) {
          if (typeof conf[v] == 'function') continue;
          conf[v] = conf_def[v];
        }
        conf.save();
      };
    })(conf);
    conf.load();

    w.WatchItLater = {
      setConf: function(k, v) {
        conf[k] = v;
        conf.save();
      },
      showConf: function() {
        console.log(conf);
      }
    };


  /**
   *  動画タグ取得とポップアップ
   *
   */
  var VideoTags = (function(){
    function VideoTags() {
    }
    
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var pt = VideoTags.prototype;
    var lastPopup = null;


    function nicoSearch(word, search_type) {
      search_type = search_type || 'tag';
      w.WatchApp.ns.init.ComponentInitializer.videoSelection.searchVideo(word, search_type);
      AnchorHoverPopup.hidePopup();
      setTimeout(function() {
        w.WatchApp.ns.util.WindowUtil.scrollFitMinimum('#searchResultExplorer', 300);
        $('.searchText input').focus();
      }, 500);
    }

    pt.get = function(watchId, callback) {
      var url = 'http://' + host + '/tag_edit/' + watchId + '/?res_type=json&cmd=tags';
      //http://www.nicovideo.jp/tag_edit/sm9/?res_type=json&cmd=tags
      var req = {
        method: 'GET',
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (typeof callback == "function") callback(result.status, result);
        }
      };
      GM_xmlhttpRequest(req);
    };
    
    pt.hidePopup = function() {
      if (lastPopup) {
        lastPopup.style.display = 'none';
      }
    };
    
    var uniq = null, $history = null;
    pt.popupItems = function(watchId, baseX, baseY) {
      var self = this;
      this.get(watchId, function(status, resp) {
        if (status == 'ok') {
          var tags = resp.tags;
          self.hidePopup();
          if (tags.length > 0) {
            lastPopup = createPopup(tags, baseX, baseY);
          } else {
            Popup.show('この動画のタグはありません');
          }
        } else {
          Popup.alert(resp.error_message);
        }
      });
      
      function createPopup(tags, baseX, baseY) {
        var popup = createDOM(tags, baseX, baseY);
        document.body.appendChild(popup);
        popup.style.right = null;
        popup.style.left = baseX + 'px';
        popup.style.top = Math.max(baseY - popup.offsetHeight, 0, document.body.scrollTop, document.documentElement.scrollTop) + 'px';
        if (popup.offsetLeft + popup.offsetWidth > document.body.clientWidth) {
          popup.style.left = null;
          popup.style.right = 0;
        }

        return popup;
      }
      
      function createDOM(tags) {
        var items = document.createElement('ul');
        for (var i = 0, len = tags.length; i < len; i++) {
          items.appendChild(createItemDOM(tags[i]));
        }
        var popup = createPopupDOM();

        popup.appendChild(items);
        return popup;
      }
      
      function createPopupDOM() {
        var popup = document.createElement('div');
        popup.className        = 'tagItemsPopup';
        popup.addEventListener('click', function(e) {
          popup.style.display = 'none';
        });
        return popup;
      }


      function appendTagHistory(dom, text, dic) {
        var $ = w.$;
        if (uniq === null) {
          uniq = {};
          $history = $('<div><p>タグ履歴</p></div>');
          $history.css({width: $('#searchResultNavigation').width(), height: '300px', overflowY: 'auto'});
          $('#searchResultNavigation').append($history);
        }
        if (!uniq[text]) {
          var a = $(dom).clone().css({marginRight: '8px', fontSize: '80%'}).click(function(e) {
            nicoSearch(text);
            e.preventDefault();
          });
          dic.style.marginRight = '0';
          $history.find('p').after(a).after(dic);
        }
        uniq[text] = 1;
      }

      function createItemDOM(tag) {
        var text = tag.tag;
        var li  = document.createElement('li');


        var dic = createDicIconDOM(tag, text);
        li.appendChild(dic);

        var a = document.createElement('a');
        a.appendChild(document.createTextNode(text));
        a.href = 'http://' + host + '/tag/' + encodeURIComponent(text);
        a.addEventListener('click', function(e) {
          if (e.button != 0 || e.metaKey) return;
          if (w.WatchApp) {
            nicoSearch(text);
            e.preventDefault();
            appendTagHistory(a, text, dic);
          }
          return false;
        });
        li.appendChild(a);

        return li;
      }
      
      function createDicIconDOM(tag, text) {
        var dic = document.createElement('a');
        dic.className = 'nicodic';
        dic.href = 'http://dic.nicovideo.jp/a/' + encodeURIComponent(text);
        dic.target = '_blank';
        var icon = document.createElement('img');
        icon.className = 'icon';
        icon.src = tag.dic ? 'http://res.nimg.jp/img/watch_zero/icon_dic.png' : 'http://res.nimg.jp/img/watch_zero/icon_disable_dic.png';
        dic.appendChild(icon);
        return dic;
      }
    };
    
    return new VideoTags();
  })();









  /**
   *  マイリスト登録API
   *
   *  (9)の頃は、iframeを作ってその中にマイリスト登録のポップアップウィンドウを開くという手抜きを行っていたが、
   *  ポップアップウィンドウは評判が悪いし、そのうち廃止されるだろうなと思うので、
   *  真面目にAPIを叩くようにした。 (マイリストの新規作成機能は省略)
   *
   *  …と思っていたのだが、(9)からQになった今でもポップアップウィンドウは廃止されないようだ。
   */
  var Mylist = (function(){
    var mylistlist = [];
    var initialized = false;
    var defListItems = [];
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var token = '';//

    function Mylist(){
      this.initialize();
    }
    
    function getToken() {
      if (!isNativeGM && host != location.host) return; // 
      var _token = (w.NicoAPI) ? w.NicoAPI.token : (w.WatchApp ? w.WatchApp.ns.init.CommonModelInitializer.watchInfoModel.csrfToken : '');
      if (_token != '') {
        return _token;
      }
      var url = 'http://' + host + '/mylist_add/video/sm9'; // マイリスト登録ウィンドウから強引にtoken取得
//      var url = 'http://' + host + '/my/mylist'; // マイリスト登録ウィンドウから強引にtoken取得
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = resp.responseText;
          if (result.match(/NicoAPI\.token = "([a-z0-9\-]+)";/)) {
            token = RegExp.$1;
          }
        }
      });
      return _token;
    }
    
    var pt = Mylist.prototype;
    
    pt.getUserId = function() {
      if (document.cookie.match(/user_session_(\d+)/)) {
        return RegExp.$1;
      } else {
        return false;
      }
    };
    
    pt.initialize = function() {
      if (initialized) return;
      var uid = this.getUserId();
      if (!uid) {
        console.log('userid unknown');
        return;
      }
      if (!isNativeGM && host != location.host) {
        initialized = true;
        return;
      }
      token = getToken();
      var url = 'http://' + host + '/api/watch/uservideo?user_id=' + uid;
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (result.status == "ok" && result.list) {
            mylistlist = result.list;
            initialized = true;
          }
        }
      });
      this.reloadDefList();
    };
    
    pt.reloadDefList = function(callback) {
      var url = 'http://' + host + '/api/deflist/list';
      var self = this;
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (result.status == "ok" && result.mylistitem) {
            defListItems = result.mylistitem;
            if (typeof callback == "function") callback(resp);
          }
        }
      });
    };
    
    pt.findDefListByWatchId = function(watchId) {
      for (var i = 0, len = defListItems.length; i < len; i++) {
        var item = defListItems[i], wid = item.item_data.watch_id;
        if (wid == watchId) return item;
      }
      return null;
    };
    
    // おもに参考にしたページ
    // http://uni.res.nimg.jp/js/nicoapi.js
    // http://d.hatena.ne.jp/lolloo-htn/20110115/1295105845
    // http://d.hatena.ne.jp/aTaGo/20100811/1281552243
    pt.deleteDefList = function(watchId, callback) {
      var item = this.findDefListByWatchId(watchId);
      if (!item) return false;
      var item_id = item.item_id;
      var url = 'http://' + host + '/api/deflist/delete';
      var data = 'id_list[0][]=' + item_id + '&token=' + token;
      var req = {
        method: 'POST',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // これを忘れて小一時間はまった
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (typeof callback == "function") callback(result.status, result);
        }
      };
      GM_xmlhttpRequest(req);
      return true;
    };
    
    pt.addDefList = function(watchId, callback) {
      var self = this;
      var url = 'http://' + host + '/api/deflist/add';

      // 例えば、とりマイの300番目に登録済みだった場合に「登録済みです」と言われても探すのがダルいし、
      // 他の動画を追加していけば、そのうち押し出されて消えてしまう。
      // なので、重複時にエラーを出すのではなく、「消してから追加」することによって先頭に持ってくる。
      // 「重複してたら先頭に持ってきて欲しいな～」って要望掲示板にこっそり書いたりしたけど相手にされないので自分で実装した。
      var data = "item_id=" + watchId + "&token=" + token;

      var _add = function(status, resp) {
        var req = {
          method: 'POST',
          data: data,
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded' }, // これを忘れて小一時間はまった
          onload: function(resp) {
            var result = JSON.parse(resp.responseText);
            if (typeof callback == "function") callback(result.status, result);
          }
        };
        GM_xmlhttpRequest(req);
      }
      // とりあえずマイリストにある場合はdeleteDefList()のcallbackで追加、ない場合は即時追加
      if (!this.deleteDefList(watchId, _add)) _add();
    };
    
    pt.addMylist = function(watchId, groupId, callback) {
      var self = this;
      var url = 'http://' + host + '/api/mylist/add';
      var data = ['item_id=', watchId, 
                  '&group_id=', groupId,
                  '&item_type=', 0, // video=0 seiga=5
                  '&description=', '', 
                  '&token=', token,
      ].join('');
      // 普通のマイリストのほうは重複しても「消してから追加」という処理を行っていない。
      // とりあえずマイリストと違って登録の順番に意味があるのと、
      // 古いのが押し出される心配がないため。
      var _add = function() {
        var req = {
          method: 'POST',
          data: data,
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded' }, // これを忘れて小一時間はまった
          onload: function(resp) {
            var result = JSON.parse(resp.responseText);
            if (typeof callback == "function") callback(result.status, result);
          }
        };
        GM_xmlhttpRequest(req);
      }
      // 普通のマイリストに入れたら、とりあえずマイリストからは削除(≒移動)
      if (!this.deleteDefList(watchId, _add)) _add();
    };
    
    /**
     *  マイリスト登録パネルを返す
     */
    pt.getPanel = function(watchId, videoId) {
      if (isNativeGM || host == location.host) {
        return this.getNativePanel(watchId, videoId);
      } else {
        return this.getIframePanel(watchId, videoId);
      }
    };
    
    pt.getNativePanel = function(watchId, videoId) {
      var self = this;
      var _watchId = watchId, _videoId = videoId || watchId;
      var body = document.createElement('div');
      body.className = 'mylistPopupPanel';
      var nobr = document.createElement('nobr');
      body.appendChild(nobr);
      
      var extArea = document.createElement('span');
      
      body.watchId = function(w, v) {
        if (w) {
          _watchId = w;
          _videoId = v || w;
          this.clearExtElement();
          if (self.findDefListByWatchId(w)) {
            deleteDef.style.display = '';
          } else {
            deleteDef.style.display = 'none';
          }
          if (newTabLink) {
            newTabLink.href = 'http://nico.ms/' + _watchId; // QWatchに乗っ取られないようにnico.msをかます(せこい)
          }
          return body;
        }
        return _watchId;
      };
      
      body.addExtElement = function(elm) {
        extArea.appendChild(elm);
      };
      body.clearExtElement = function() {
        extArea.innerHTML = '';
      };
      body.show = function() {
        body.style.display = '';
      };
      body.hide = function() {
        body.style.display = 'none';
      };
      
      function createSelector() {
        var sel = document.createElement('select');
        sel.className = 'mylistSelect';
        function appendO(sel, text, value) {
          var opt = document.createElement('option');
          opt.appendChild(document.createTextNode(text));
          opt.value = value;
          sel.appendChild(opt);
          return opt;
        }
        appendO(sel, 'とりマイ', 'default');
        sel.selectedIndex = 0;
        setTimeout(function() {
          for (var i = 0, len = mylistlist.length; i < len; i++) {
            var mylist = mylistlist[i];
            appendO(sel, mylist.name, mylist.id);
          }
        }, initialized ? 0 : 3000);
        return sel;
      }
      
      function createSubmitButton(sel) {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('マ'));
        btn.className = 'mylistAdd';
        btn.title = 'マイリストに追加';
        btn.addEventListener('click', function() {
          btn.disabled = true;
          setTimeout(function() {btn.disabled = false;}, 1000);
          var groupId = sel.value, name = sel.options[sel.selectedIndex].textContent;
          if (groupId == 'default') {
            self.addDefList(_watchId, function(status, result) {
              self.reloadDefList();
              if (status != "ok") {
                Popup.alert('とりあえずマイリストの登録に失敗: ' + result.error.description);
              } else {
                Popup.show('とりあえずマイリストに登録しました');
              }
            });
          } else {
            self.addMylist(_watchId, groupId, function(status, result) {
              self.reloadDefList();
              if (status == 'ok') {
                Popup.show( name + 'に登録しました');
              } else {
                Popup.alert(name + 'の登録に失敗: ' + result.error.description);
              }
            });
          }
        } ,false);
        
        return btn;
      }

      function createDeleteDeflistButton(sel) {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('消'));
        btn.className = 'deflistRemove';
        btn.title = 'とりあえずマイリストから削除';
        btn.addEventListener('click', function() {
          btn.disabled = true;
          self.deleteDefList(_watchId, function(status, result) {
            self.reloadDefList();
            btn.style.display = 'none';
            setTimeout(function() {btn.disabled = false;}, 1000);
            if (status != "ok") {
              Popup.alert('とりあえずマイリストから削除に失敗: ' + result.error.description);
            } else {
              Popup.show('とりあえずマイリストから削除しました');
            }
          });
        } ,false);
        return btn;
      }

      function createTagListButton() {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('tag'));
        btn.className = 'tagGet';
        btn.title = 'タグ取得';
        btn.addEventListener('click', function(e) {
          btn.disabled = true;
          setTimeout(function() {btn.disabled = false;}, 1000);
          if (w.jQuery) {
            var $btn = w.jQuery(btn), o = $btn.offset();
            VideoTags.popupItems(_videoId, o.left, o.top + $btn.outerHeight());
          } else {
            VideoTags.popupItems(_videoId, e.pageX, e.pageY);
          }
        } ,false);
        return btn;
      }
      
      function createCloseButton() {
        var btn = document.createElement('a');
        btn.className = 'closeButton';
        btn.href = 'javascript:;';
        btn.innerHTML = '[x]';
        btn.addEventListener('click', function(e) {
          body.hide();
        }, false);
        return btn;
      }
      
      function createNewTabLink() {
        var a = document.createElement('a');
        a.className = 'newTabLink';
        a.target = '_blank';
        a.title = 'この動画を新しいウィンドウで開く';
        a.innerHTML = '▲';
        return a;
      }

      var newTabLink = createNewTabLink();
      if (w.WatchApp) {
        nobr.appendChild(newTabLink);
      }

      
      var sel = createSelector(mylistlist);
      nobr.appendChild(sel);

      var submit = createSubmitButton(sel);
      nobr.appendChild(submit);

      var tagBtn = createTagListButton();
      nobr.appendChild(tagBtn);

      var deleteDef = createDeleteDeflistButton();
      nobr.appendChild(deleteDef);
      

      var closeBtn = createCloseButton();
      nobr.appendChild(closeBtn);


      nobr.appendChild(extArea);

      body.watchId(_watchId, _videoId);
      return body;
    };
    
    // XHRでクロスドメインを超えられない場合はこちら
    // 将来マイリストのポップアップウィンドウが廃止されたら使えない
    // (マイページから強引に生成するか？)
    pt.getIframePanel = function(watchId) {
      var self = this;
      var _watchId = watchId;
      var body = document.createElement('iframe');
      body.style.width = '140px';
      body.style.height = '24px';
      body.style.zIndex = 10000;
      body.style.border = '1px solid silver';
      body.style.padding = 0;
      body.style.margin  = 0;
      body.style.overflow = 'hidden';
      body.watchId = function(w) {
        if (w) {
          _watchId = w;
          body.contentWindow.location.replace("http:/" + "/www.nicovideo.jp/mylist_add/video/" + w);
          return body;
        }
        return _watchId;
      };
      if (watchId != '') {
        body.src = "http:/" + "/www.nicovideo.jp/mylist_add/video/" + _watchId;
      }

      // ダミーメソッド
      body.addExtElement = function(elm) {
        //var insertAfter = function(parent, node, referenceNode) { parent.insertBefore(node, referenceNode.nextSibling);}
      };
      body.clearExtElement = function() {};
      
      body.show = function() {
        body.style.display = '';
      };
      body.hide = function() {
        body.style.display = 'none';
      };
      
      
      return body;
    };
    
    return new Mylist();
  })();

  /**
   *  左下に出るポップアップメッセージ
   *
   */
  var Popup = (function(){
    function Popup() {
    }
    Popup.show = function(text) {
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          '<span>' + text + '</span>'
        );
      }
    };
    Popup.alert = function(text) {
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          '<span style="color: red;">' + text + '</span>'
        );
      } else {
        w.alert(text);
      }
    };
    return Popup;
  })();


  /**
   *  リンクのマウスオーバーに仕込む処理
   *  ここの表示は再考の余地あり
   */
  var AnchorHoverPopup = (function() {
    var mylistPanel = Mylist.getPanel('');
    mylistPanel.className = 'mylistPopupPanel popup';
    mylistPanel.style.display    = 'none';
    document.body.appendChild(mylistPanel);

    function showPanel(watchId, baseX, baseY) {
      VideoTags.hidePopup();

      mylistPanel.style.display = '';
      mylistPanel.watchId(watchId);
      mylistPanel.style.right = null;
      mylistPanel.style.left = (baseX) + 'px';
      mylistPanel.style.top = Math.max(baseY - mylistPanel.offsetHeight, 0, document.body.scrollTop, document.documentElement.scrollTop) + 'px';

      if (mylistPanel.offsetLeft + mylistPanel.offsetWidth > document.body.clientWidth) {
        mylistPanel.style.left = null;
        mylistPanel.style.right = 0;
      }
      
    }
    
    
    var videoReg = /(\?cc_video_id=|\?cc_id=|watch\/)([a-z0-9]+)/;
    var excludeReg = /(news|live|seiga)\..*?nicovideo\.jp/;

    function bind(force) {
      function each(e, watchId) {
        e.mylist_add = "/mylist_add/video/" + watchId;
        var over, out;
        var mx = 0, my = 0;

        if (!w.jQuery) {
          e.addEventListener('mousemove', function(ev) {
            mx = ev.pageX;
            my = ev.pageY;
          });
        }
        e.addEventListener('mouseover', over = function(ev) {
          e.mouse_in = true;
          e.mouse_timer = setTimeout(function() {
            if (!e.mouse_in) return;
            if (w.jQuery) {
              var $e = w.jQuery(e);
              var t = $e.text();
              var o = t != "" ? $e.offset() : $e.find('*').offset();
              showPanel(watchId, o.left, o.top);
            } else {
              showPanel(watchId, mx + 8, my + 8);
            }
            addlink(mylistPanel, e, watchId);
          }, 400);
        }, false);
        e.addEventListener('mouseout', out = function() {
          e.mouse_in = false;
          if (e.mouse_timer) {
            clearTimeout(e.mouse_timer);
          }
        }, false);
        e.added = 1;
      };

      //var a = document.getElementsByTagName("A");
      var a = document.links;
        for (var i = 0, len = a.length; i < len; i++) {
          var e = a[i];
          try {
            var m;// = videoReg.test(e.href);
            if (
              !e.added && 
              e.href && 
              (m = videoReg.exec(e.href)) != null &&
              !excludeReg.test(e.href) &&
  //            e.className != "itemLink" && 
  //            e.className != "itemVideoTitle" && 
              e.className != "itemEcoLink" && 
  //            e.parentNode.className != "thumbContainer" &&
              true
            ) {
              each(e, m[2]);
            }
          } catch (ex) {
            console.log(ex);
          }
        }


    }

    if (location.host == "ext.nicovideo.jp") {
      bind();
    } else {
      bind();
      setInterval(
        function() { bind(); }, 3000
      );
      //w.Event.observe(w, 'load', function() { add_btn('a[href*="watch/"]'); }, false);
    }

    return {
      hidePopup: function() {
        VideoTags.hidePopup();
        mylistPanel.hide();
        return this;
      },
      updateNow: function() {
        bind();
        setTimeout(function() { bind();}, 1000);
        return this;
      }
    };
  })();





  //===================================================
  //===================================================
  //===================================================


  /**
   *  マイリスト登録のポップアップウィンドウを乗っ取る処理
   *
   *  iframeの子ウィンドウ内に開かれた時に実行される
   */
  (function(){ // mylist window
    var h, $ = w.$, $$ = w.$$;
    if (!(w.location.href.match(/\/mylist_add\//) && w.name != "nicomylistadd")) return;

      var $ = w.jQuery;
      $('body,table,img,td').css({border:0, margin:0, padding:0, background: "transparent", overflow: 'hidden'});

      $('td').css({padding: 0});

      // 「マイリストに登録しました」
      $('.mb8p4:last').show();
      $('.mb8p4:last h1').css({fontSize : "8pt"});

      $('table:first').css({width :"200px"});
      $('table:first td.main_frm_bg').css({height :"20px"});
      $('table:first table:first').hide();


      $('select').css({width: "100px",position:"absolute", top:0, left:0});
      $('select')[0].selectedIndex = $('select')[0].options.length - 1;
      
      var submit = document.createElement("input");
      submit.type = "submit";
      submit.value = "登録";
      $(submit).css({position: 'absolute', top: 0, left: '100px', width: '40px'});
      $('select')[0].parentNode.appendChild(submit);

      var dt = new Date();
      $('#edit_description')[0].value = dt.getFullYear() + "/" + 
                        (dt.getMonth() + 1) + "/" + 
                        dt.getDate() + " " + 
                        dt.getHours() + ":" + 
                        dt.getMinutes() + ":" + 
                        dt.getSeconds() +
                        "";
      
      w.document.documentElement.scrollTop  = 0;
      w.document.documentElement.scrollLeft = 0;
      
      
      $($.browser.safari ? 'body' : 'html').scrollTop(0);
      
      w.window.close = function()
      {
        return;
      };
      w.window.alert = function()
      {
        document.write('<span style="position:absolute;top:0;left:0;font-size:8pt;color:red;">' +
                 arguments[0] + '</span>');
      };
  })();





  //===================================================
  //===================================================
  //===================================================


  /**
   *  ZeroWatch上でのあれこれ
   *
   *  watch.jsを解析すればわかる
   *
   */
  (function() { // Zero Watch
    var h, $ = w.$, $$ = w.$$;
    if (!w.WatchApp) return;

    $.fx.interval = conf.fxInterval;

    var video_id = '', watch_id = '';
    var iframe = Mylist.getPanel(''), tv_chan = $('.videoMenuToggle')[0];
    var WatchApp = w.WatchApp, WatchJsApi = w.WatchJsApi;
    var isFixedHeader = !$('body').hasClass('nofix');
    var watch = WatchApp.namespace.init;
    var tagv = watch.TagInitializer.tagViewController;
    var pim  = watch.PlayerInitializer.playerInitializeModel;
    var npc  = watch.PlayerInitializer.nicoPlayerConnector;
    var pac  = watch.PlayerInitializer.playerAreaConnector;
    var vs   = watch.ComponentInitializer.videoSelection;
    var isSearchOpen = false;
  //  var flashVars = pim.playerInitializeModel.flashVars;
  //  flashVars.isBackComment = 0;

    function changePlayerScreenMode(mode) {
      WatchJsApi.player.changePlayerScreenMode(mode);
      setTimeout(function(){$(window).resize();}, 3000);
    }

    var initialExplorerWidth = null;
    function onWindowResize() {
      function expandSearchResult(target) {
        var elms = ['#searchResult', '#resultContainer', '#searchResultContainer', '#searchResultExplorer', '#searchResultHeader', '#resultlist'];
        if (!initialExplorerWidth) {
          initialExplorerWidth = {};
          for (var v in elms) {
            initialExplorerWidth[elms[v]] = $(elms[v]).width();
          }
        }
        var px = target - initialExplorerWidth['#searchResultExplorer'];
        for (var v in elms) {
          $(elms[v]).width(initialExplorerWidth[elms[v]] + px);
        }
      }
      expandSearchResult($('body').innerWidth());
    }
    
    function watchVideoStatus() {
      var video_length = WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.length
      var current_sec = npc.getVpos() / 1000;
      watchVideoId();
    }

    function watchVideoId() {
      var newVideoId = w.WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.id;
      var newWatchId = w.WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.v;
      if (video_id != newVideoId) {
//        console.log("video_id=" + newVideoId);
        onVideoChange(newVideoId, newWatchId);
        video_id = newVideoId;
      }
    }

    function scrollToVideoPlayer() {
      var head = (isFixedHeader ? $("#siteHeader").outerHeight() : 0);
      if ($(window).height() >= 700 ) {
        head = $("#videoTagContainer").offset().top - head;
      } else {
        head = $("#playerContainer").offset().top - head;
      }
      $("html, body").animate({scrollTop: head}, 600);
    }

    function onVideoChange(newVideoId, newWatchId) {
    }
    
    function setVideoCounter(watchInfoModel) {
      var vc = $('li.#videoCounter');
      if (vc.length < 1) {
        var li = $('<li></li>')[0];
        li.id = 'videoCounter';
        $('#siteHeaderLeftMenu').after(li);
        vc = $('li.#videoCounter');
      }
      var h = [
        'v:', watchInfoModel.viewCount,
        ' c:', watchInfoModel.commentCount,
        ' m:', watchInfoModel.mylistCount
      ].join('');
      vc.html(h);
    }
    
    function onVideoInitialized() {
      watch = WatchApp.namespace.init;
      AnchorHoverPopup.hidePopup().updateNow();
      tagv = watch.TagInitializer.tagViewController;
      pim  = watch.PlayerInitializer.playerInitializeModel;
      npc  = watch.PlayerInitializer.nicoPlayerConnector;
      var newVideoId = watch.CommonModelInitializer.watchInfoModel.id;
      var newWatchId = watch.CommonModelInitializer.watchInfoModel.v;
      iframe.watchId(newVideoId, newWatchId);
      iframe.show();

      setVideoCounter(watch.CommonModelInitializer.watchInfoModel);

      scrollToVideoPlayer();
      if (conf.autoBrowserFull) setTimeout(function() {
        changePlayerScreenMode("browserFull");
        //$(window).resize();
        onWindowResize();
      }, 100);

    // - 空っぽになった左になんか表示してみる
    var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
    var $leftPanel = $('#ichibaPanel').addClass('leftVideoInfo'), h = $leftPanel.innerHeight() - 100;
      panelSVC.innerLeftElements = [$('#ichibaPanel')];  
      panelSVC.refresh();
      $leftPanel.empty()
        .append($('#videoThumbnailImage').clone(true).css({margin: 'auto'}))
        .append(
          $('.videoDescription').clone(true)
            .append($('#userProfile .userIconContainer').clone(true)
            .append('<span>' + $('#videoInfo .userName').text() + '</span>'))
        );
      resetSearchExplorerPos();
    }

    function onVideoStopped() {
      console.log("video stopped");
    }

    function onVideoEnded() {
      AnchorHoverPopup.hidePopup().updateNow();
      console.log("video ended");
      // 原宿までと同じように、動画終了時にフルスクリーンを解除したい 
      if (conf.autoNotFull) { 
        changePlayerScreenMode("notFull");
      }

      return;
    }

    function onVideoSelectPanelOpened() {
      isSearchOpen = true;
      AnchorHoverPopup.hidePopup().updateNow();
    }

    function onVideoSelectPanelOpening() {
      isSearchOpen = true;
      $('#searchResultExplorer').css({zIndex: 600});
    }


    function onVideoSelectPanelClosed() {
      isSearchOpen = false;
      AnchorHoverPopup.hidePopup().updateNow();
//      setTimeout(function() {
        $('#searchResultExplorer').css({zIndex: 1});
        $('#content').css({zIndex: 2});
        resetSearchExplorerPos();
//      }, 500);
      //scrollToVideoPlayer();
    }
    
    function resetSearchExplorerPos() {
      $('#searchResultExplorer').css({
        top: ($('#nicoplayerContainerInner').offset().top + $('#nicoplayerContainerInner').outerHeight()) + 'px'
      });
      if (isSearchOpen) return;

      $('#openSearchResultExplorer').css({marginTop: '0px'});
      var m = $('#content').offset().top + $('#content').outerHeight() - $('#openSearchResultExplorer').offset().top;
      $('#openSearchResultExplorer').css({marginTop: m + 'px'});
    }
    
    function onWatchInfoReset(w) {
    }

    function onScreenModeChange(sc) {
      $('body').toggleClass('w_notFull', sc.mode != 'browserFull');

      AnchorHoverPopup.hidePopup().updateNow();
      if (conf.hideNewsInFull) { $('body').addClass('hideNewsInFull'); }
      setTimeout(function() {
        $('#content').css({zIndex: 2});
        //$('#searchResultExplorer').css({top: $('#textMarquee').offset().top + 'px'});
        $('#searchResultExplorer').css({
          top: ($('#nicoplayerContainerInner').offset().top + $('#nicoplayerContainerInner').outerHeight()) + 'px'
        });
        $('#openSearchResultExplorer').css({marginTop: 0});
        if (!isSearchOpen) {
          var m = $('#content').offset().top + $('#content').outerHeight() - $('#openSearchResultExplorer').offset().top;
          $('#openSearchResultExplorer').css({marginTop: m + 'px'});
        }

        // フル画面時プレイリストを閉じる
        if (conf.autoClosePlaylistInFull && 
          $('#content .browserFullPlaylistClose').is(':visible')) {
          $('#content .browserFullPlaylistClose').click();
        }

        if (sc.mode == 'browserFull') {
        } else {
            resetSearchExplorerPos();
        }
      }, 500);
    }

    function initIframe() {
      iframe.id = "mylyst_add_frame";
      iframe.className += " fixed";
      $(iframe).css({position: 'fixed', right: 0, bottom: 0});
      w.document.body.appendChild(iframe);
      iframe.hide(); // ページの初期化が終わるまでは表示しない
    }
    
    function initSidePanel() {
      function wideCommentPanel(px) {
        var elms = [
          '#playerCommentPanelOuter', 
          '#playerCommentPanel',
          '#playerCommentPanel .commentTable', 
          '#playerCommentPanel .commentTable .commentTableContainer'
        ];
        for (var v in elms) {
          var $e = $(elms[v]);
          $e.width($e.width() + px);
        }
        $('#playerCommentPanelOuter').css({'right': - $('#playerCommentPanelOuter').outerWidth() + 'px'});
      }
      if (conf.wideCommentPanel) {
//      完全に横スクロール不要にしたい場合はこっち
//        var tarinaiWidth = $('#commentDefault .commentTableContainer').innerWidth() - $('#commentDefault .commentTableContainerInner').outerWidth();
//        wideCommentPanel(tarinaiWidth - 10);
        wideCommentPanel(420 - $('#playerCommentPanelOuter').outerWidth());
      }

    }

    function initPager() {
      if (conf.topPager) {
        $("#resultPagination").insertBefore($("#resultlist")); // 検索窓のページャーを上に (好み次第)
//        $("#resultPagination").css({position: 'fixed'});
      }
      
      $("#resultPagination, #searchResultSortOptions, #searchResultNavigation").mousedown(function() {
        AnchorHoverPopup.hidePopup();
      });
      
    }
    
    function initEvents() {
      pac.addEventListener("onVideoInitialized", watchVideoId);
      pac.addEventListener("onVideoInitialized", onVideoInitialized);
      pac.addEventListener("onVideoEnded", onVideoEnded);
      pac.addEventListener("onVideoStopped", onVideoStopped);

      watch.CommonModelInitializer.watchInfoModel.addEventListener("reset", onWatchInfoReset);
      watch.PlayerInitializer.playerScreenMode.addEventListener("change", onScreenModeChange);

      vs.addEventListener("videoSelectPanelOpeningEvent", onVideoSelectPanelOpening);
      vs.addEventListener("videoSelectPanelClosedEvent", onVideoSelectPanelClosed);
      vs.panelOPC.addEventListener("videoSelectPanelOpenedEvent", onVideoSelectPanelOpened);

      // メモ
      // とりあえずマイリストのオープン
      //watch.ComponentInitializer.videoSelection.contentsAreaVC.addEventListener('deflistFolderClickedEvent', function(){ })

      $('body').dblclick(function(){
        scrollToVideoPlayer();
      });
      w.$(window).resize(onWindowResize);

    }
    
    function initOther() {
      //$('#videoInformation').css({position: 'relative', top: '-85px'});

      if (conf.autoTagPin) {
        tagv.isPinned = true;
        tagv.onMouseOverTagContainer();
      }
      $('#siteHeaderInner').width(
        $('#siteHeaderInner').width() + 200
      );

      resetSearchExplorerPos();

      var btn = $('<button alt="プレイリスト表示/非表示">playlist</button>');
      btn.addClass('playlistToggle');
      $('#playerContainerWrapper').append(btn);
      btn.click(function() {
        $('#playlist').toggleClass('w_show');
        AnchorHoverPopup.hidePopup();
        resetSearchExplorerPos();
      })
    }
    

    function hideAds() {
      return;
    }

    try
    {
      initIframe();
      initSidePanel();
      initEvents();
      initPager();
      initOther();

      onWindowResize();
      setTimeout(function() {
        $('#content').css({zIndex: 2});
        $('#searchResultExplorer').css({zIndex: 1});
      }, 3000);

      $('#videoMenuTopList').append('<li style="position:absolute;top:50px;left:-80px;"><a href="https://github.com/segabito/WatchItLater" target="_blank" style="color:black;">（＾ω＾）</a><a href="/watch/sm18845030" style="color: black;" class="itemEcoLink">…</a></li>'); // （＾ω＾） …
      
    } catch(e) {
      w.alert(e);
    }
  })();


  /**
   *  原宿プレイヤーでのあれこれ
   *
   *  マイリストパネルだけ追加
   *
   */
  (function() {
    if (!w.Video) return;
    var Video = w.Video, watchId = Video.v, videoId = Video.id;
    var iframe = Mylist.getPanel('');
    iframe.id = "mylyst_add_frame";
    iframe.style.position = 'fixed';
    iframe.style.right = 0;
    iframe.style.bottom = 0;
    document.body.appendChild(iframe);
    iframe.watchId(watchId, videoId);
  })();

  //===================================================
  //===================================================
  //===================================================


  }); // end of monkey();


  // Chromeに対応させるための処理
  // いったん<script>として追加してから実行する
  try {
    if (!this.GM_getValue || this.GM_getValue.toString().indexOf("not supported")>-1) {
      isNativeGM = false;
      var inject = document.createElement("script");
      inject.id = "monkey";
      inject.setAttribute("type", "text/javascript");
      inject.appendChild(document.createTextNode("(" + monkey + ")(false)"));

      document.body.appendChild(inject);
    } else {
      // やや古いFirefoxはここらしい
      monkey(true);
    }
    
  } catch(e) {
    // 最近のFirefoxはここに飛んでくる
    monkey(true);
  }
})();


/*
  メモ
  
  WatchApp.ns.init.SidePanelInitializer.panelSlideViewController.innerLeftElements = [$('#ichibaPanel')];  
  WatchApp.ns.init.SidePanelInitializer.panelSlideViewController.refresh();
  $('#ichibaPanel').append($('#videoThumbnailImage').clone(true).css({float: 'right'}));
//  $("#ichibaPanel").append('<iframe scrolling="no" width="312" height="176" frameborder="0" src="http://ext.nicovideo.jp/thumb/sm9" class="nicovideo"></iframe>');

*/
