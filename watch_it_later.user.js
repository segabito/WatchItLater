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
// @version        1.120825
// ==/UserScript==




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
      autoClosePlaylistInFull: true // 全画面時にプレイリストを自動で閉じる
    };

  //===================================================
  //===================================================
  //===================================================


    if (!isNativeGM) {
      this.GM_getValue=function (key, def) {
        if (window.localStorage[key] === undefined) return def;
        return JSON.parse(window.localStorage.getItem(key));
      };
      this.GM_setValue=function (key,value) {
        return window.localStorage.setItem(key, JSON.stringfy(value));
      };
      this.GM_addStyle = function (styles){ 
        var S = document.createElement('style');
        S.type = 'text/css';
        var T = ''+styles+'';
        T = document.createTextNode(T)
        S.appendChild(T);
        var head = document.getElementsByTagName('head');
        head = head[0]
        head.appendChild(S);
        return;
      }
      this.GM_xmlhttpRequest = function(options) {
        try {
          var req = new XMLHttpRequest();
          var method = options.method || 'GET';
          req.onreadystatechange = function() {
            if (req.readyState == 4) {
              if (typeof options.onload == "function") options.onload(req);
            }
          }
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
      }
    }


    conf.save = function() {
     try {
       for (var v in conf) {
         if (typeof conf[v] == 'function') continue;
         GM_setValue(v, conf[v]);
       }
     } catch (e) {
     }
    }
    conf.load = function() {
      try {
        for (var v in conf) {
          if (typeof conf[v] == 'function') continue;
          conf[v] = GM_getValue(v, conf[v]);
        }
      } catch (e) {
      }
    }
    conf.reset = (function(conf_def) {
      return function() {
        for (var v in conf) {
          if (typeof conf[v] == 'function') continue;
          conf[v] = conf_def[v];
        }
        conf.save();
      }
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
    }



	/**
	 *	動画タグ取得とポップアップ
	 *
	 */
  var VideoTags = (function(){
    var VideoTags = function() {
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
    }
    
    pt.hidePopup = function() {
      if (lastPopup) {
        lastPopup.style.display = 'none';
      }
    }
    
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
        popup.style.position = 'absolute';
        popup.className = 'tagItemsPopup';
        popup.style.minWidth = '150px';
        popup.style.fontSize = '10pt';
        popup.style.background = '#ccf';
        popup.style.border = '1px solid #99c';
        popup.style.zIndex = 2000000;
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
        dic.href = 'http://dic.nicovideo.jp/a/' + encodeURIComponent(text);
        dic.target = '_blank';
        dic.style.marginRight = '4px';
        var icon = document.createElement('img');
        icon.style.width = '17px';
        icon.style.height = '15px';
        icon.src = tag.dic ? 'http://res.nimg.jp/img/watch_zero/icon_dic.png' : 'http://res.nimg.jp/img/watch_zero/icon_disable_dic.png';
        dic.appendChild(icon);
        return dic;
			}
    }
    
    return new VideoTags();
  })();









  /**
   *  マイリスト登録API
   *
   *  (9)の頃は、iframeを作ってその中にマイリスト登録のポップアップウィンドウを開くという手抜きを行っていたが、
   *  ポップアップウィンドウは評判が悪いし、そのうち廃止されるだろうなと思うので、
   *  真面目にAPIを叩くようにした。 (マイリストの新規作成機能は省略)
   *
   *  …と思っていたのだが、(9)からZeroになった今でもポップアップウィンドウは廃止されないようだ。
   */
  var Mylist = (function(){
    var mylistlist = [];
    var initialized = false;
    var defListItems = [];
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var token = '';//

    function Mylist(){
      this.initialize();
    };
    
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
    }
    
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
    }
    
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
    }
    
    pt.findDefListByWatchId = function(watchId) {
      for (var i = 0, len = defListItems.length; i < len; i++) {
        var item = defListItems[i], wid = item.item_data.watch_id;
        if (wid == watchId) return item;
      }
      return null;
    }
    
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
    }
    
    pt.addDefList = function(watchId, callback) {
      var self = this;
      var url = 'http://' + host + '/api/deflist/add';

      // 例えば、とりマイの300番目に登録済みだった場合に「登録済みです」と言われても探すのがダルいし、
      // 他の動画を追加していけば、そのうち押し出されて消えてしまう。
      // なので、重複時にエラーを出すのではなく、「消してから追加」することによって先頭に持ってくる。
      // 要望掲示板にこっそり書いたりしたけど相手にされないので自分で書いた。
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
    }
    
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
    }
    
    /**
     *  マイリスト登録パネルを返す
     */
    pt.getPanel = function(watchId, videoId) {
      if (isNativeGM || host == location.host) {
        return this.getNativePanel(watchId, videoId);
      } else {
        return this.getIframePanel(watchId, videoId);
      }
    }
    
    pt.getNativePanel = function(watchId, videoId){
      var self = this;
      var _watchId = watchId, _videoId = videoId || watchId;
      var body = document.createElement('div');
      body.style.height = '24px';
      body.style.zIndex = 10000;
      body.style.border = '1px solid silver';
      body.style.padding = 0;
      body.style.margin  = 0;
      body.style.overflow = 'hidden';
      body.style.display = 'inline-block';
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
          return body;
        }
        return _watchId;
      };
      
      body.addExtElement = function(elm) {
        extArea.appendChild(elm);
      }
      body.clearExtElement = function() {
        extArea.innerHTML = '';
      }
      body.show = function() {
				body.style.display = '';
			}
      body.hide = function() {
				body.style.display = 'none';
			}
      
      function createSelector() {
        var sel = document.createElement('select');
        sel.style.width    = '64px';
        sel.style.margin   = 0;
        sel.style.padding  = 0;
        sel.style.fontSize = '90%';
        sel.style.whiteSpace = 'nowrap';
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
        btn.style.margin  = 0;
        btn.style.color = 'green';
        btn.style.fontWeight = 'bolder';
        btn.style.cursor = 'pointer';
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
        btn.style.margin  = 0;
        btn.style.cursor = 'pointer';
        btn.style.color = 'red';
        btn.style.display = 'none';
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
        btn.style.margin  = 0;
        btn.style.cursor = 'pointer';
        btn.style.color = 'blue';
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
				btn.style.color = 'red';
				btn.style.padding = 0;
				btn.style.margin = 0;
				btn.href = 'javascript:;';
				btn.style.fontSize = '80%';
				btn.innerHTML = '[x]';
				btn.addEventListener('click', function(e) {
					body.hide();
				}, false);
				return btn;
			}

      
      var sel = createSelector(mylistlist);
      nobr.appendChild(sel);

      var submit = createSubmitButton(sel);
      nobr.appendChild(submit);

      var deleteDef = createDeleteDeflistButton();
      nobr.appendChild(deleteDef);

      var tagBtn = createTagListButton();
      nobr.appendChild(tagBtn);

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
      }
      body.clearExtElement = function() {}
      
      body.show = function() {
				body.style.display = '';
			}
      body.hide = function() {
				body.style.display = 'none';
			}
			
      
      return body;
    };
    
    return new Mylist();
  })();

	/**
	 *	左下に出るポップアップメッセージ
	 *
	 */
  var Popup = (function(){
    var Popup = function() {
    }
    Popup.show = function(text) {
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          '<span>' + text + '</span>'
        );
      }
    }
    Popup.alert = function(text) {
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          '<span style="color: red;">' + text + '</span>'
        );
      } else {
        w.alert(text);
      }
    }
    return Popup;
  })();


	  /**
	   *  リンクのマウスオーバーに仕込む処理
	   *  ここの表示は再考の余地あり
	   */
	var AnchorHoverPopup = (function() {
    var mylistPanel = Mylist.getPanel('');
    mylistPanel.style.position = 'absolute';
    mylistPanel.style.zIndex = 1000000;
    mylistPanel.style.display = 'none';
    mylistPanel.style.background = '#ccc';
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
    
    
    var videoReg = /(\?cc_video_id=|\?cc_id=|watch\/)([a-z0-9]+)/
    var excludeReg = /(news|live|seiga)\..*?nicovideo\.jp/

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
              var o = w.jQuery(e).offset();
              showPanel(watchId, o.left, o.top);
            } else {
              showPanel(watchId, mx + 8, my + 8);
            }
            addlink(mylistPanel, e, watchId);
          }, 500);
        }, false);
        e.addEventListener('mouseout', out = function() {
          e.mouse_timer = setTimeout(function() {
            e.mouse_in = false;
            if (e.mouse_timer) {
              clearTimeout(e.mouse_timer);
            }
          }, 300);
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
      }
      w.window.alert = function()
      {
        document.write('<span style="position:absolute;top:0;left:0;font-size:8pt;color:red;">' +
                 arguments[0] + '</span>');
      }
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

    function onWindowResize() {
//      $('#searchResult').css({height: '400px', overflowY: 'auto'});
      function expandSearchResult(px) {
        var elms = ['#searchResult', '#resultContainer', '#searchResultContainer', '#searchResultExplorer', '#searchResultHeader', '#resultlist'];
        for (var v in elms) {
          var $e = $(elms[v]);
          $e.width($e.width() + px);
        }
      }
      expandSearchResult($('body').innerWidth() - $('#searchResultExplorer').outerWidth());
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

    function onVideoChange(newVideoId) {
    }
    
    function setVideoCounter(watchInfoModel) {
      var vc = $('li.#videoCounter');
      if (vc.length < 1) {
        var li = $('<li></li>')[0];
        li.id = 'videoCounter';
        $(li).css({color: '#ff9', fontSize: '70%' });
        $('#siteHeaderLeftMenu').after(li);
        vc = $('li.#videoCounter');
      }
      var h = [
        'v:', watchInfoModel.viewCount,
        ' m:', watchInfoModel.mylistCount,
        ' c:', watchInfoModel.commentCount,
      ].join('');
      vc.html(h);
    }
    
    function onVideoInitialized() {
      watch = WatchApp.namespace.init;
      AnchorHoverPopup.hidePopup().updateNow();
      tagv = watch.TagInitializer.tagViewController;
      pim  = watch.PlayerInitializer.playerInitializeModel;
      npc  = watch.PlayerInitializer.nicoPlayerConnector;
      newVideoId = watch.CommonModelInitializer.watchInfoModel.id;
      newWatchId = watch.CommonModelInitializer.watchInfoModel.v;
      iframe.watchId(newVideoId, newWatchId);

      setVideoCounter(watch.CommonModelInitializer.watchInfoModel);

      console.log("onVideoInitialized: " + newVideoId);
      scrollToVideoPlayer();
      if (conf.autoBrowserFull) setTimeout(function() {
        changePlayerScreenMode("browserFull");
        //$(window).resize();
        onWindowResize();
      }, 100);


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
      $('#searchResultExplorer').css({zIndex: 1});
      $('#content').css({zIndex: 2});
      var m = $('#content').offset().top + $('#content').outerHeight() - $('#openSearchResultExplorer').offset().top;
      $('#openSearchResultExplorer').css({marginTop: m + 'px'});
      //scrollToVideoPlayer();
    }
    
    function onWatchInfoReset(w) {
    }

    function onScreenModeChange(sc) {
      AnchorHoverPopup.hidePopup().updateNow();
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
        		$('#content .browserFullPlaylistOption .browserFullPlaylistClose').is(':visible')) {
          $('#content .browserFullPlaylistOption .browserFullPlaylistClose').click();
        } 
      }, 500);
    }

    function initIframe() {
      iframe.id = "mylyst_add_frame";
      $(iframe).css({position: 'fixed', right: 0, bottom: 0});
      w.document.body.appendChild(iframe);
    }
    
    function initIchiba() {
      // 市場パネル無くなった。。。
    }
    
    function initPager() {
      if (conf.topPager) {
        $("#resultPagination").insertBefore($("#resultlist")); // 検索窓のページャーを上に (好み次第)
//        $("#resultPagination").css({position: 'fixed'});
      }
      // ページャーの字が小さくてクリックしにくいよね
      $("#resultPagination").css({padding: '5px', marginTop: '-64px'});
      $("#resultPagination").css({fontWeight: 'bolder', border: '1px dotted silver', fontSize: '130%'});
      
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
    }
    

    function hideAds() {
			return;
    }

    try
    {
      initIframe();
      initIchiba();
      initEvents();
      initPager();
      initOther();

      onWindowResize();
      setTimeout(function() {
        $('#content').css({zIndex: 2});
        $('#searchResultExplorer').css({zIndex: 1});
      }, 3000);

    } catch(e) {
      w.alert(e);
    }
  })();


  /**
   *  原宿プレイヤーでのあれこれ
   *
   *	マイリストパネルだけ追加
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
