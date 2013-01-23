// ==UserScript==
// @name           WatchItLater
// @namespace      https://github.com/segabito/
// @description    動画を見る前にマイリストに登録したいGreasemonkey (Chrome/Fx用)
// @include        http://www.nicovideo.jp/*
// @include        http://ext.nicovideo.jp/thumb/*
// @exclude        http://ads*.nicovideo.jp/*
// @exclude        http://live*.nicovideo.jp/*
// @exclude        http://dic.nicovideo.jp/*
// @exclude        http://www.upload.nicovideo.jp/*
// @exclude        http://upload.nicovideo.jp/*
// @match          http://www.nicovideo.jp/*
// @match          http://*.nicovideo.jp/*
// @match          http://ext.nicovideo.jp/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @version        1.130124
// ==/UserScript==

// TODO: プレイリスト拡張メニュー

// * ver 1.130124
// - 投稿者一覧のソート順おかしい問題が直ってたので、こっちで勝手にやっていた修正コードを削除
// - 細かい調整

// * ver 1.130118
// - 検索画面で高解像度版サムネイルを表示する機能を追加 (ポップアップ機能を切ってると表示されません)

// * ver 1.130117
// - 謎の技術によって、ニコレポにあがった動画を検索画面に表示 (ニコレポの情報は再生数や動画長がないため表示できません)
// - 動画のサムネをダブルクリックするとポップアップで高解像度版サムネを表示する隠しコマンドを追加 (高解像度版があるのは新しめの動画だけ)
// - 設定メニューのボタンを目立たない色に
// - CSSの細部調整

// * ver 1.130111
// - いじわるな位置に追加された広告に暫定対応
// - 検索画面の:visitedの色が変わらない不具合が本家側で修正されたので、こっちで勝手にやっていた修正を削除

// * ver 1.130110
// - プレイリストのランダム再生ボタンをShift+ダブルクリックするとリストをシャッフルする隠し機能
//   (自分以外は誰もいらないと思う裏コマンド)
//   ランダム再生に対する利点は、
//    - 次に何が再生されるのか、何件再生して何件残ってるのかがわかりやすい。 リストの状態≒視聴履歴になる
//    - ドラッグによるリスト編集機能や動画選択の「次に再生」ボタンと共存できる

// * ver 1.130108
// - マイリストから外す時のフェードを調整

// * ver 1.130106
// - お気に入りマイリストのリロードボタンが効かなくなったりするのを修正

// * ver 1.130103
// - 謎の技術によって、検索画面で自分のマイリストから動画を外す機能を追加 (確認ダイアログは出ないので注意)
//   デフォルトはOFFなので、必要な人だけ設定パネルで有効にしてください
// - 細かい表示の不具合修正

// * ver 1.130101
// - 「あなたにオススメの動画」が最大128件まで蓄積されるようにした
// - Qwatchが新バージョンになってから検索画面の視聴済と未視聴の区別がつかなくなってるので、わかるようにした
// - コメントパネルが空っぽになる現象を無理矢理直す(検索画面時)

// * ver 1.121231b
// - 謎の技術によって、検索画面にコメントパネルを表示できるようにした
// - 検索画面のランキング表示の並びを整理してを見やすく
// - 検索画面のサムネを4:3にする設定を追加 (上下がカットされなくなる)

// * ver 1.121231
// - 謎の技術によって、検索画面に「あなたにオススメの動画」と動画ランキングを表示
// - 動画再生時に自動で検索画面にする設定を追加

// * ver 1.121226
// - 検索画面で視聴履歴を表示できるようにした

// * ver 1.121225b
// - ポップアップの反応が微妙におかしくなっていたのを修正
// - 検索画面でスクロールがバタバタするのを軽減

// * ver 1.121221b
// - とりあえずマイリストを追加(忘れてた)と、若干のレスポンス改善

// * ver 1.121221
// - 動画検索画面は自分のマイリストが16個以上あるとダルいので、左のリストからすぐ開けるようにした。

// * ver 1.121220
// - 新しくなった検索画面に仮対応。 個人的にかなり快適だけど、ちょっと重い
// - 新機能と干渉しないように左パネルをタブ化
//   ニコニコ市場がさらに遠くなったので、左パネルのタブに市場出張所を追加

// * ver 1.121206
// - 12/5のQwatch側の更新で、検索のソート順を記憶する機能が効かなくなったのを修正

// * ver 1.121205
// - 検索画面の投稿動画一覧の並び順がおかしい(例: sm1000 -> sm2000 -> sm999 文字列ソート!)のを、
//   投稿が新しい順に出てくるようにしてみるテスト

// * ver 1.121130
// - ニコニコニュースが上表示の時に履歴が勝手に開く事がある問題を修正

// * ver 1.121129
// - ニコニコニュースのレイアウト変更に対応

// * ver 1.121127
// - 小バグ修正

// * ver 1.121126
// - 11/26のQwatch更新に対応
// - 「@ジャンプ」キャンセラーの副作用なし正式版
// - 「ウィンドウがアクティブの時だけ自動再生する」機能を追加
//    自動再生ONだけど別タブで開く時は再生したくないって人に地味に便利
// - お気に入りマイリストが新しい動画のある順に並ぶようにした
//   お気に入りマイリストが２０件以上あると取得できなかった問題を修正
// - タグ検索・マイリスト検索のソートを記憶するようにした
//   毎回「コメントの新しい順」にリセットされてウゼーと思ってた人におすすめ

// * ver 1.121119
// - 検索のデフォルトパラメータ指定機能
// - マイナーなバグ修正

// * ver 1.121116
// - 全画面時、動画が切りかわったら左下にタイトルと再生数をポップアップ表示する機能

// * ver 1.121115
// - 左パネルのファーストビューで投稿者アイコンが大きく出すように工夫
//   投稿者あってのニコニコ動画

// * ver 1.121114
// - ESCまたはXキーでポップアップが消えるようにした

// * ver 1.121113b
// - お気に入りマイリストの表示に対応。 これで気になるシリーズの新着が素早く確認できる！
// - お気に入りタグの表示がやっつけだったのを修正

// * ver 1.121112
// - 自動全画面化オンの設定でも、ユーザーニコ割があるときは全画面化しない設定を追加
//   ユーザーニコ割を見逃したくない人のため。

// * ver 1.121111
// - ニコニコニュースの履歴表示機能

// * ver 1.121109
// - ポップアップからの検索でも小画面化可能に

// * ver 1.121108
// - タグが2行以内の時は自動で高さ調節(※ピン留め時しかうまくいかない)

// * ver 1.121107
// - 動画検索画面に、お気に入りタグを出せるようにした

// * ver 1.121106
// - タグ検索ページ・キーワード検索ページでのポップアップが出る位置を調整
// - マイリスト登録成功時のポップアップに、マイリスト編集ページへのリンク追加(QWatch)

// * ver 1.121103b
// - 動画リンクのポップアップも切れるようにした

// * ver 1.121103
// - 設定パネルの追加
// - マイリストボタンのスタイル調整
// - dic.nicovideo.jpを除外
// - @ジャンプキャンセラー (副作用あるかも)

// * ver 1.121029
// - ニコニコ市場へのクイックアクセスボタン

// * ver 1.121027
// - 検索ワード入力欄で上下キーを押すと、タグ検索/キーワード検索を切り替える
// - てれびちゃんメニューを押すとランダム画像(原宿の左上にあるアレ)が出現


// * ver 1.121026
// - 設定パネルと検索画面が被るのを修正
// - 左パネルに「この投稿者の関連動画を見る」とチャンネルアイコンを追加


// * ver 1.121024
// - 左パネルに投稿日付も欲しくなったので追加
// - 誤操作を減らすため、とりマイだけ色を変えた
// - http://www.nicovideo.jp/mylist/xxxxx の動画をマイリスト出来なかったのを修正

// * ver 1.121023
// - QWatch上でのみ、新しいウィンドウで開くためのリンク追加
// - プレイリストの吹き出しとポップアップが被らないよう調整
// - 少しでも縦スクロールを減らすため、動画検索部分の余白を詰めた。横1366あれば二段に納まるかも


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
      autoBrowserFull: false, // 再生開始時に自動全画面化
      disableAutoBrowserFullIfNicowari: false, // ユーザーニコ割があるときは自動全画面化しない
      autoNotFull: true, // 再生完了時にフルスクリーン解除(原宿と同じにする)
      autoTagPin: false,
      topPager: true, // 検索ボックスのページャを上にする
      hideLeftIchiba: false,
      autoClosePlaylistInFull: true, // 全画面時にプレイリストを自動で閉じる
      autoOpenSearch: false, // 再生開始時に自動検索画面
      autoScrollToPlayer: true, // プレイヤー位置に自動スクロール(自動全画面化オフ時)
      hideNewsInFull: true, // 全画面時にニュースを閉じる
      wideCommentPanel: true, // コメントパネルをワイドにする
      leftPanelJack: true, // 左パネルに動画情報を表示
      headerViewCounter: false, // ヘッダに再生数コメント数を表示
      popupViewCounter: 'full', // 動画切り替わり時にポップアップで再生数を表示
      ignoreJumpCommand: false, // @ジャンプ無効化
      doubleClickScroll: true, // 空白部分ををダブルクリックで動画の位置にスクロールする
      hidePlaylist: true, // プレイリストを閉じる
      hidariue: true, // てれびちゃんメニュー内に、原宿以前のランダム画像復活
      videoExplorerHack: true, // 検索画面を乗っ取る
      squareThumbnail: false, // 検索画面のサムネを4:3にする
      enableFavTags: false, // 動画検索画面にお気に入りタグを表示
      enableFavMylists: false, // 動画検索画面にお気に入りマイリストを表示
      enableMylistDeleteButton: false, // 動画検索画面で、自分のマイリストから消すボタンを追加する
      enableHoverPopup: true, // 動画リンクのマイリストポップアップを有効にする
      enableAutoTagContainerHeight: false, // タグが2行以内なら自動で高さ調節(ピン留め時のみ
      autoSmallScreenSearch: false, // ポップアップからのタグ検索でもプレイヤーを小さくする
      enableNewsHistory: false, // ニコニコニュースの履歴を保持する
      defaultSearchOption: '', // 検索時のデフォルトオプション
      autoPlayIfWindowActive: 'no', // 'yes' = ウィンドウがアクティブの時だけ自動再生する

      enableSlideEffect: false, // 動画切り替え時にスライドするエフェクト(ただのお遊び)

      lastLeftTab: 'videoInfo',
      enableSortTypeMemory: true, // 検索のソート順を記憶する
      searchSortType: 'n', //
      searchSortOrder: 'd', // 'd'=desc 'a' = asc
      fxInterval: 40, // アニメーションのフレームレート 40 = 25fps
      debugMode: false
    };


  //===================================================
  //===================================================
  //===================================================

    function addStyle(styles, id) {
       var elm = document.createElement('style');
       elm.type = 'text/css';
       if (id) { elm.id = id; }

       var text = styles.toString();
       text = document.createTextNode(text)
       elm.appendChild(text);
       var head = document.getElementsByTagName('head');
       head = head[0];
       head.appendChild(elm);
       return elm;
    }

    if (!isNativeGM) {
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
          conf.debugMode && console.log(e);
        }
      };
    }

  (function() {
    var style = [
    '\
    /* 動画タグのポップアップ */\n\
      .tagItemsPopup {\n\
        position: absolute; \n\
        min-width: 150px; \n\
        font-Size: 10pt; \n\
        background: #eef; \n\
        z-index: 2000000; \n\
        box-shadow: 2px 2px 2px #888;\n\
      }\n\n\
      .tagItemsPopup ul,.tagItemsPopup ul li {\n\
        position: relative; \n\
        list-style-type: none; \n\
        margin: 0; padding: 0; \n\
      }\n\n\
      .tagItemsPopup li a{\n\
      }\n\n\
      .tagItemsPopup .nicodic {\n\
        margin-right: 4px; \n\
      }\n\
      .tagItemsPopup .icon{\n\
        width: 17px; \n\
        height: 15px; \n\
        \n\
      }\n\n\
    /* マイリスト登録パネル */\
      .mylistPopupPanel {\n\
        height: 24px; \n\
        z-index: 10000; \n\
        border: 1px solid silver;\n\
        border-radius: 3px; \n\
        padding: 0;\n\
        margin: 0;\n\
        overflow: hidden; \n\
        display: inline-block; \n\
        background: #eee; \n\
      }\n\n\
    /* マウスホバーで出るほうのマイリスト登録パネル */\
      .mylistPopupPanel.popup {\n\
        position: absolute; \n\
        z-index: 1000000;\n\
        box-shadow: 2px 2px 2px #888;\n\
      }\n\
    /* マイリスト登録パネルの中の各要素 */\
      .mylistPopupPanel .mylistSelect {\n\
        width: 64px; \n\
        margin: 0;\n\
        padding: 0;\n\
        font-size: 80%; \n\
        white-space: nowrap; \n\
        background: #eee; \n\
        border: 1px solid silver;\n\
      }\n\
    /* 誤操作を減らすため、とりマイの時だけスタイルを変える用 */\
      .mylistPopupPanel.deflistSelected button {\n\
      }\n\n\
      .mylistPopupPanel.mylistSelected  button {\n\
        color: #ccf; \n\
      }\n\n\
      .mylistPopupPanel button {\n\
        margin: 0; \n\
        font-weight: bolder; \n\
        cursor: pointer;  \n\
      }\n\n\
      .mylistPopupPanel button:active, #content .playlistToggle:active, #content .quickIchiba:active, #content .openConfButton:active {\n\
        border:1px inset !important\n\
      }\n\n\
      .mylistPopupPanel button:hover, #content .playlistToggle:hover, #content .quickIchiba:hover, #content .openConfButton:hover {\n\
        border:1px outset\n\
      }\n\n\
\
      .mylistPopupPanel .mylistAdd, .mylistPopupPanel .tagGet, #content .playlistToggle, #content .quickIchiba, #content .openConfButton {\
        border:1px solid #b7b7b7; cursor: pointer; -webkit-border-radius: 3px; -moz-border-radius: 3px;border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #d3d3d3;\
        background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d3d3d3), color-stop(100%, #707070));\
        background-image: -webkit-linear-gradient(top, #d3d3d3, #707070);\
        background-image: -moz-linear-gradient(top, #d3d3d3, #707070);\
        background-image: -ms-linear-gradient(top, #d3d3d3, #707070);\
        background-image: -o-linear-gradient(top, #d3d3d3, #707070);\
        background-image: linear-gradient(top, #d3d3d3, #707070);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d3d3d3, endColorstr=#707070);\
        }\n\
        .mylistPopupPanel.deflistSelected {\
          color: #ff9;\
        }\n\
        .mylistPopupPanel .deflistRemove{\
          border:1px solid #ebb7b7; border-radius: 3px;font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f7e3e3;\
           background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f7e3e3), color-stop(100%, #ffd7d7));\
           background-image: -webkit-linear-gradient(top, #f7e3e3, #ffd7d7);\
           background-image: -moz-linear-gradient(top, #f7e3e3, #ffd7d7);\
           background-image: -ms-linear-gradient(top, #f7e3e3, #ffd7d7);\
           background-image: -o-linear-gradient(top, #f7e3e3, #ffd7d7);\
           background-image: linear-gradient(top, #f7e3e3, #ffd7d7);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#f7e3e3, endColorstr=#ffd7d7);\
        }\n\
        .mylistPopupPanel.mylistSelected .deflistRemove {\
          display: none; \
        }\n\
        .mylistPopupPanel .closeButton{\
          color: #339; \
          padding: 0;\
          margin: 0;\
          font-size: 80%;\
          text-decoration: none;\
        }\n\
        .mylistPopupPanel .newTabLink{\
          padding: 0 2px; text-decoration: underline; text-shadow: -1px -1px 0px #442B2B;\
        }\n\
        .mylistPopupPanel.fixed .newTabLink, .mylistPopupPanel.fixed .closeButton {\
          display: none;\
        }\n\
\
\
\
\
      /* 全画面時にタグとプレイリストを表示しない時*/\
      body.full_and_mini.full_with_browser #playerContainerSlideArea{\n\
        margin-bottom: 0 !important;\n\
      }\n\n\
      body.full_and_mini.full_with_browser #playlist{\n\
        z-index: auto;\n\
      }\n\n\
      body.full_and_mini.full_with_browser .generationMessage{\n\
        display: inline-block;\n\
      }\n\
      /* 全画面時にタグとプレイリストを表示する時 */\
      body.full_with_browser #playlist{\n\
        z-index: 100;\n\
      }\n\n\
      body.full_with_browser .generationMessage{\n\
        display: none;\n\
      }\n\n\
      body.full_with_browser .browserFullOption{\n\
        padding-right: 200px;\n\
      }\n\
      /* 全画面時にニュースを隠す時 */\
      body.full_with_browser.hideNewsInFull #playerContainerSlideArea{\
        \margin-bottom: -45px;\
      }\n\
      /* 少しでも縦スクロールを減らすため、動画情報を近づける。人によっては窮屈に感じるかも */\
      #outline {\n\
        margin-top: -20px;\n\
      }\n\n\
      #outline #feedbackLink{\n\
        \n\
      }\n\n\
      #outline .videoEditMenuExpand{\n\
        position: absolute;right: 0;top: 26px; z-index: 1;\n\
      }\n\n\
      /* ヘッダに表示する再生数 */\
      #videoCounter {\n\
        color: #ff9; font-size: 70%;\n\
      }\n\n\
      /* 左に表示する動画情報 */\
      #leftPanel .leftVideoInfo, #leftPanel .leftIchibaPanel {\n\
        padding: 0px 0px 0 0px; width: 196px; height: 100%;\n\
        position:absolute; top:0; right:0;\
        border-radius: 4px; display:none; \
      }\n\n\
      #leftPanel .leftVideoInfo {\n\
        background: #bbb; text-Align: left; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;\n\
      }\n\n\
      #leftPanel .leftIchibaPanel {\n\
        background: #eee; text-Align: center; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;\n\
      }\n\n\
      #leftPanel .leftVideoInfo .leftVideoInfoInner {\n\
        padding: 0 4px; position: relative;\n\
      }\n\n\
      #leftPanel .leftVideoInfo .videoTitleContainer{\n\
        background: #ccc; text-align: center;  color: #000; border-radius: 4px 4px 0 0;margin: 6px 0 0;\n\
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoTitleContainer{\n\
          margin-left: 134px; border-radius: 0 4px 0 0 ; background: #999; \
          \
        }\n\n\
      #leftPanel .leftVideoInfo .videoThumbnailContainer{\n\
        background: #ccc; text-align: center; color: #000; margin: 0; cursor: pointer;\n\
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoThumbnailContainer{\n\
          position: absolute; width: 130px; top: 0; \
        }\n\n\
      #leftPanel .leftVideoInfo .videoTitle{\n\
        \
      }\n\n\
      #leftPanel .leftVideoInfo .videoPostedAt{\n\
        color: #333;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoStats{\n\
        font-size:90%;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoStats li{\n\
        display: inline-block; margin: 0 2px;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoStats li span{\n\
        font-weight: bolder;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoStats .ranking{\n\
        display: none !important;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoInfo{\n\
        background: #ccc; text-align: center; \
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoInfo{\n\
          background: #999; border-radius: 0 0 4px 0;\
        }\n\n\
      #leftPanel .leftVideoInfo .videoDescription{\n\
        overflow-x: hidden; text-align: left;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoDescriptionInner{\n\
        padding: 0 4px;\
      }\n\n\
      #leftPanel .leftVideoInfo .videoDetails{\n\
        background: #bbb;\
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoDetails{\n\
          border-left: 130px solid #ccc; padding-left: 4px; min-height: 250px;\
        }\n\n\
      #leftPanel .leftVideoInfo .videoDetails a{\n\
        margin: auto 4px;\
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoOwnerInfoContainer{\n\
          position: absolute; width: 130px; top: 120px;\
        }\n\n\
      #leftPanel .leftVideoInfo .userIconContainer a, #leftPanel .leftVideoInfo .ch_profile a{\n\
        display: block;\
      }\n\n\
      #leftPanel .leftVideoInfo .userIconContainer, #leftPanel .leftVideoInfo .ch_profile{\n\
        background: #ccc; width: 100%; text-align: center; border-radius: 0 0 4px 4px; float: none;\n\
      }\n\n\
        body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .userIconContainer, body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .ch_profile{\n\
          background: #ccc; width: 130px; float: none;\n\
        }\n\n\
      #leftPanel .leftVideoInfo .userIconContainer .usericon, #leftPanel .leftVideoInfo .ch_profile img{\n\
        max-width: 130px; width: auto; height: auto; border: 0;\n\
      }\n\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem {\
        width: 180px; display:inline-block; vertical-align: top;\
        margin: 4px 3px; border 1px solid silver; border-radius: 8px\
      }\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .thumbnail span {\
        font-size: 60px;\
      }\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem>div>dt {\
        height: 50px;position: relative;\
      }\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonUe {\
        position: absolute;width: 100%;\
      }\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonUe {\
        position: absolute;\
      }\n\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonShita {\
        position: absolute;\
      }\n\
\
      #leftPanel.videoInfo, #leftPanel.ichiba{\
        background: none;\
      }\
\
      #leftPanel.videoInfo  #leftVideoInfo{\
        /*box-shadow: -2px 0 4px black;*/\
      }\
\
      #leftPanel.videoInfo  #leftPanelContent {\
        display: none;\
      }\
      #leftPanel.ichiba     #leftPanelContent {\
        display: none;\
      }\
      #leftPanel.videoInfo  #leftVideoInfo,    #leftPanel.ichiba     #leftIchibaPanel  {\
        display: block;\
      }\
\
      #leftPanelTabContainer {\
        display:none; background: #666; position: absolute; right: 0; top: -27px; list-style-type: none; padding: 4px 6px 3px 60px; height: 20px; border-radius: 4px 4px 0px 4px;\
      }\
      #leftPanel:hover #leftPanelTabContainer{\
        display:block;\
      }\
      #leftPanelTabContainer .tab {\
        display: inline-block; cursor: pointer; background: #999; padding: 2px 4px 0px; border-radius: 4px 4px 0px 0px; border-width: 1px 1px 0px; \
      }\
      #leftPanel.nicommend .tab.nicommend{\
        background: #dfdfdf; border-style: outset;\
      }\
      #leftPanel.videoInfo .tab.videoInfo {\
        background: #bbb;    border-style: outset;\
      }\
      #leftPanel.ichiba .tab.ichiba {\
        background: #eee;    border-style: outset;\
      }\
\n\
      #leftIchibaPanel .ichibaPanelInner {\
        margin:0; color: #666;\
      }\
      #leftIchibaPanel .ichibaPanelHeader .logo{\
        text-shadow: 1px 1px 1px #666; cursor: pointer; padding: 4px 0px 4px; font-size: 125%;\
      }\
      #leftIchibaPanel .ichibaPanelFooter{\
        text-align: center;\
      }\
      #leftIchibaPanel .ichiba_mainitem {\
        margin: 0 0 8px 0; background: white; border-bottom : 1px dotted #ccc;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem a:hover{\
        background: #eef;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem>div {\
        max-width: 266px; margin: auto; text-align: center;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .blomagaArticleNP {\
        background: url("http://ichiba.dev.nicovideo.jp/embed/zero/img/bgMainBlomagaArticleNP.png") no-repeat scroll 0 0 transparent;\
        height: 170px;\
        margin: 0 auto;\
        width: 180px;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .blomagaLogo {\
        color: #FFFFFF;font-size: 9px;font-weight: bold;padding-left: 10px;padding-top: 8px;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .blomagaLogo span{\
        background: none repeat scroll 0 0 #AAAAAA;padding: 0 3px;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .blomagaText {\
        color: #666666;font-family: \'HGS明朝E\',\'ＭＳ 明朝\';font-size: 16px;height: 100px;padding: 7px 25px 0 15px;text-align: center;white-space: normal;word-break: break-all;word-wrap: break-word;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .blomagaAuthor {\
        color: #666666; font-size: 11px;padding: 0 20px 0 10px;text-align: right;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .balloonUe{\
        bottom: 12px; display: block; max-width: 266px; \
      }\n\
      #leftIchibaPanel .ichiba_mainitem .balloonUe a{\
        background: url("/img/watch_zero/ichiba/imgMainBalloonUe.png") no-repeat scroll center top transparent;\
        color: #666666 !important;\
        display: block;\
        font-size: 108%;\
        line-height: 1.2em;\
        margin: 0 auto;\
        padding: 8px 15px 3px;\
        text-align: center;\
        text-decoration: none;\
        word-wrap: break-word;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .balloonShita{\
        height: 12px; bottom: 0; left: 0;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .balloonShita img{\
        vertical-align: top !important; \
      }\n\
      #leftIchibaPanel .ichiba_mainitem .ichibaMarquee {\
        display: none;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .thumbnail span {\
        font-size: 22px; color: #0066CC;\
        font-family: \'ヒラギノ明朝 Pro W3\',\'Hiragino Mincho Pro\',\'ＭＳ Ｐ明朝\',\'MS PMincho\',serif;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .action {\
        font-size: 85%;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .action .buy {\
        font-weight: bolder; color: #f60;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .itemname {\
        font-weight: bolder;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .maker {\
        font-size: 77%; margin-bottom: 2px;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .price {\
        \
      }\n\
      #leftIchibaPanel .ichiba_mainitem .action .click {\
        font-weight: bolder;\
      }\n\
      #leftIchibaPanel .ichiba_mainitem .goIchiba {\
        font-size: 77%; margin: 5px 0;\
      }\n\
      #leftIchibaPanel .addIchiba, #leftIchibaPanel .reloadIchiba {\
        cursor: pointer;\
      }\n\
      #leftIchibaPanel .noitem {\
        cursor: pointer;\
      }\n\
\n\
      #content .bottomAccessContainer {\n\
        position: absolute; bottom: 0;\n\
      }\n\n\
      body.w_searchOpen .bottomAccessContainer, body.w_searchOpen #content .openConfButton{\
        display: none;\
      }\
      /* プレイリスト出したり隠したり */\
      body.w_notFull #playlist{\n\
        position: absolute; top: -9999px;\n\
      }\n\n\
      body.w_notFull #playlist.w_show{\n\
        position: relative; top: 0;\n\
      }\n\n\
      #content .playlistToggle:after {\
        content: "▼";\
      }\
      #content .playlistToggle.w_show:after {\
        content: "▲";\
      }\
\
\
      /* ページャーの字が小さくてクリックしにくいよね */\
      #resultPagination {\n\
        padding: 5px; font-weight: bolder; border: 1px dotted silter; font-size: 130%;\n\
      }\n\n\
\
      #playlistContainer #playlistContainerInner .playlistItem .balloon {\n\n\
        bottom: auto; top: -2px; padding: auto;\n\n\
      }\n\n\
\
      body.w_channel #leftPanel .userIconContainer{\n\
        display: none;\n\
      }\n\n\
      /* QWatch設定パネル */\
      #watchItLaterConfigPanel {\n\
        position: fixed; bottom:0; right:0; z-index: 10001; display: none;\n\
        width: 400px; padding: 4px;\n\
        background: #eff; border: 1px outset; color: black;\n\
        \n\
      }\n\n\
      #watchItLaterConfigPanel .inner{\n\
        margin: 0 12px; padding: 4px;\n\
        max-height: 300px; overflow-y: auto;\n\
        border: 1px inset\n\
      }\n\n\
      #watchItLaterConfigPanel li{\n\
        margin: 4px auto;\n\
      }\n\n\
      #watchItLaterConfigPanel li:hover{\n\
        background: #dff;\
      }\n\n\
      #watchItLaterConfigPanel li.buggy{\n\
        color: #888;\n\
      }\n\n\
      #watchItLaterConfigPanel .description{\n\
      }\n\n\
      #watchItLaterConfigPanel label{\n\
        margin: 0 5px;\n\
      }\n\n\
      #watchItLaterConfigPanel label:hober{\n\
      }\n\n\
      #watchItLaterConfigPanel .bottom {\n\
        text-align: right;padding: 0 12px; \n\
      }\n\
      #watchItLaterConfigPanel .closeButton{\n\
        cursor: pointer; border: 1px solid;\n\
      }\n\n\
      #watchItLaterConfigPanel.autoBrowserFull_false .disableAutoBrowserFullIfNicowari {\
        color: #ccc;\
      }\
      #watchItLaterConfigPanel.autoBrowserFull_true .autoScrollToPlayer, #watchItLaterConfigPanel.autoBrowserFull_true .autoOpenSearch {\
        color: #ccc;\
      }\
      #content .openConfButton {\n\
        position: absolute; bottom:0; right: 0;\n\
      }\n\
      #watchItLaterConfigPanel .section {\n\
        font-size: 120%; font-weight: bolder; margin: 16px 0;\
      }\
\
\
      /* 動画検索画面に出るお気に入りタグ・お気に入りマイリスト */\
      #favoriteTagsMenu.open, #favoriteMylistsMenu.open, #mylistListMenu.open, #videoRankingMenu.open,\
      #favoriteTagsMenu.opening, #favoriteMylistsMenu.opening, #mylistListMenu.opening, #videoRankingMenu.opening {\
        background: -moz-linear-gradient(center top , #D1D1D1, #FDFDFD) repeat scroll 0 0 transparent !important;\
        background: -webkit-gradient(linear, left top, left bottom, from(#D1D1D1), to(#FDFDFD)) !important;\
        border-bottom: 0 !important;\
      }\
      #searchResultNavigation .slideMenu{\
        width: 100%; height: auto !important;\
        overflow-x: hidden;\
        overflow-y: auto;\
        padding: 0;\
        background: #fdfdfd;\
        /*display: none; */\
        border-top: 0 !important;\
      }\
      #searchResultNavigation .slideMenu.open{\
        display: block;\
      }\
      #searchResultNavigation #favoriteTagsMenu a:after,       #searchResultNavigation #favoriteMylistsMenu a:after,\
      #searchResultNavigation #mylistListMenu   a:after,       #searchResultNavigation #videoRankingMenu a:after{\
        content: "▼"; position: absolute; background: none; top: 0px; right: 10px;\
      }\n\
      #searchResultNavigation #favoriteTagsMenu.open a:after,  #searchResultNavigation #favoriteMylistsMenu.open a:after,\
      #searchResultNavigation #mylistListMenu.open   a:after,  #searchResultNavigation #videoRankingMenu.open a:after{\
        content: "▲";\
      }\n\
      #searchResultNavigation .slideMenu ul{\
      }\n\
      #searchResultNavigation .slideMenu ul li{\
        background: #fdfdfd; padding: 0; border: 0;font-size: 90%; height: auto !important;\
      }\n\
      #searchResultNavigation .slideMenu ul li a{\
        line-height: 165% !important; background: none\
      }\n\
        #searchResultNavigation .slideMenu ul li a:before{\
          background: url("http://uni.res.nimg.jp/img/zero_my/icon_folder_default.png") no-repeat scroll 0 0 transparent;\
          display: inline-block; height: 14px; margin: -4px 4px 0 0; vertical-align: middle; width: 18px; content: ""\
        }\n\
        #searchResultNavigation .slideMenu ul li          a.defMylist:before{ background-position: 0 -253px;}\n\
        #searchResultNavigation .slideMenu ul li.folder0  a:before{ background-position: 0 0;}\n\
        #searchResultNavigation .slideMenu ul li.folder1  a:before{ background-position: 0 -23px;}\n\
        #searchResultNavigation .slideMenu ul li.folder2  a:before{ background-position: 0 -46px;}\n\
        #searchResultNavigation .slideMenu ul li.folder3  a:before{ background-position: 0 -69px;}\n\
        #searchResultNavigation .slideMenu ul li.folder4  a:before{ background-position: 0 -92px;}\n\
        #searchResultNavigation .slideMenu ul li.folder5  a:before{ background-position: 0 -115px;}\n\
        #searchResultNavigation .slideMenu ul li.folder6  a:before{ background-position: 0 -138px;}\n\
        #searchResultNavigation .slideMenu ul li.folder7  a:before{ background-position: 0 -161px;}\n\
        #searchResultNavigation .slideMenu ul li.folder8  a:before{ background-position: 0 -184px;}\n\
        #searchResultNavigation .slideMenu ul li.folder9  a:before{ background-position: 0 -207px;}\n\
\
        #searchResultNavigation .slideMenu ul li.g_ent2 a:before     {  background-position: 0 -23px;}\n\
        #searchResultNavigation .slideMenu ul li.g_life2 a:before    {  background-position: 0 -46px;}\n\
        #searchResultNavigation .slideMenu ul li.g_politics a:before {  background-position: 0 -69px;}\n\
        #searchResultNavigation .slideMenu ul li.g_tech a:before     {  background-position: 0 -92px;}\n\
        #searchResultNavigation .slideMenu ul li.g_culture2 a:before {  background-position: 0 -115px;}\n\
        #searchResultNavigation .slideMenu ul li.g_other a:before    {  background-position: 0 -138px;}\n\
        #searchResultNavigation .slideMenu ul li.r18 a:before        {  background-position: 0 -207px;}\n\
        #searchResultNavigation .slideMenu ul li.all        a.all,\
        #searchResultNavigation .slideMenu ul li.g_ent2     a.g_ent2,\
        #searchResultNavigation .slideMenu ul li.g_life2    a.g_life2,\
        #searchResultNavigation .slideMenu ul li.g_politics a.g_politics,\
        #searchResultNavigation .slideMenu ul li.g_tech     a.g_tech,\
        #searchResultNavigation .slideMenu ul li.g_culture2 a.g_culture2,\
        #searchResultNavigation .slideMenu ul li.g_other    a.g_other,\
        #searchResultNavigation .slideMenu ul li.r18        a.r18 \
        { font-weight: bolder; border-top: 1px dotted #ccc; }\n\
\
\
      #searchResultNavigation .slideMenu ul li a:after{\
        background: none !important;\
      }\n\
      #searchResultNavigation .slideMenu ul li a:hover{\
        background: #f0f0ff;\
      }\n\
      #searchResultNavigation .slideMenu ul .reload{\
        cursor: pointer; border: 1px solid; padding: 0;\
      }\n\
\
      #searchResultNavigation .tagSearchHistory {\
        border-radius: 4px; margin-top: 4px; padding: 4px; background: #ccc;\
      }\
\
\
\
      /* 動画タグが1行以下の時 */\
      body.w_notFull #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.oneLine {\
        height: 12px;\
      }\
      body.w_notFull #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.oneLine .toggleText{\
        display: none;\
      }\
      /* 動画タグが2行以下の時 */\
      body.w_notFull #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.twoLines {\
        height: 36px;\
      }\
      /* タグ領域とプレイヤーの隙間をなくす */\
      body.w_notFull #videoTagContainer, body.w_notFull #videoHeader .videoMenuToggle {\
        margin-bottom: -10px;\
      }\
      #videoHeaderMenu .searchContainer .searchText {\
        margin-top: -8px;\
      }\
\
      body.w_small #playerContainerWrapper {\
        padding: 0;\
      }\
\
      /* ニュース履歴 */\
      body.w_searchOpen #textMarquee .openNewsHistory, body.w_searchOpen #textMarquee .newsHistory {\
        display: none;\
      }\
      #textMarquee .openNewsHistory {\
        position: absolute; width: 30px;\
        font-size: 13px; padding: 0; margin: 0; height: 28px;\
        cursor: pointer;\
        bottom: 0;\
        background: none repeat scroll 0 0 transparent;\
        border: 1px none;\
        border-radius: 2px 2px 2px 2px;\
        cursor: pointer;\
        right: 18px;\
        z-index: 200;\
      }\
      #textMarquee .newsHistory {\
        position: absolute;\
        bottom: 0px; right: 0px; width: 100%;\
        max-height: 132px;\
        min-height: 40px;\
        overflow-y: auto;\
        overflow-x: hidden;\
        z-index: 1;\
        padding: 4px;\
        display: none;\
        background: #333;\
        text-align: left;\
        font-size: 14px;\
        padding: 0;\
      }\
      #textMarquee .newsHistory li{\
        padding: 0 2px;\
      }\
      #textMarquee .newsHistory li:nth-child(odd){\
        background: #444;\
      }\
      #textMarquee .newsHistory li:nth-child(even){\
        background: #333;\
      }\
      body.full_with_browser.hideNewsInFull #textMarquee .newsHistory {\
        display: none !important;\
      }\
      body #popupMarquee {\
        width: 360px;\
      }\
      /* 半透明だとflashの上に来ると描画されないので強制的に黒にする(Chromeは平気) */\
      body.full_with_browser #popupMarquee.popupMarqueeBottomLeft {\
        background: #000 !important;left: 8px; bottom: 8px; width: 400px; opacity: 1;\
      }\
      body.full_with_browser #playerContainer {\
        margin-left: 0 !important;\
      }\
      body.w_notFull #playerContainer/*.upside*/, body.w_notFull #content.narrowBorder #playerContainer{\
        top: -8px;\
      }\
      body.full_with_browser #playerContainer/*.upside*/, body.w_small #playerContainer/*.upside*/{\
        top: auto;\
      }\
      body.full_with_browser.no_setting_panel #searchResultExplorerContentWrapper {\
        display:none;\
      }\
\
      #content.narrowBorder #playerCommentPanelOuter{\
        /*right: -412px !important;*/\
        /*margin-right: 10px !important;\*/\
      }\
      #content.narrowBorder #playerCommentPanelOuter #playerCommentPanel{\
        border-radius: 0 4px 4px 0; padding: 4px 1px;\
      }\n\
      #content.narrowBorder #leftPanel{\
        left: -256px; border-radius: 4px 0 0 4px ; \
      }\n\
\n\n\n\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultContainer {\
        width: 592px; padding-left: 0; min-width: 592px; max-width: auto;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultContainer .resultContentsWrap, body.videoSelection #searchResultExplorer.w_adjusted #resultContainer .resutContentsWrap {\
        width: 592px; padding: 16px 0px;\
      }\n\
      body.videoSelection.no_setting_panel.size_small #content.w_adjusted #searchResultNavigation ul li,  body.videoSelection #content.w_adjusted #searchResultExplorerExpand {\
        height: 26px;\
      }\n\
      body.videoSelection.no_setting_panel.size_small #content.w_adjusted #searchResultNavigation ul li a,body.videoSelection #content.w_adjusted #searchResultExplorerExpand a{\
        line-height: 26px; font-size: 100%;\
      }\n\
      body.videoSelection #searchResultNavigation > ul > li a:after, body.videoSelection #content.w_adjusted #searchResultExplorerExpand a#closeSearchResultExplorer:after {\
        top: 8px;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted {\
        background: #333333;\
      }\n\
      body.videoSelection .openOuter #searchResultExplorerContentWrapper {\
        display: none;\
      }\n\
      body.videoSelection .openOuter #outline {\
        display: block;\
      }\n\
      body.videoSelection #footer.w_adjusted {\
        display: none;\
      }\n\
\
    /* 1列表示の時、動画タイトルの横の空白部分にまでクリック判定があるのはVistaのエクスプローラみたいで嫌なので、文字部分だけにしたい */\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist.column1 .videoInformationOuter .create_time {\
        display: block;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist.column1 .videoInformationOuter a{\
        display: inline;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist.column1 .videoInformationOuter a p {\
        display: inline;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist .videoItem a:visited{\
        color: #099EF9;\
      }\n\
\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist.column1 .commentBlank {\
        width: 96%;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultlist.column4 .commentBlank {\
        width: 24%;\
      }\n\
\
      body.videoSelection #resultlist.column4 .videoItem .balloon {\
        bottom: auto; top: 10px;\
      }\n\
\
      body.videoSelection #resultContainer.dummyMylist #searchResultContainer .favMylistEditContainer,\
      body.videoSelection #resultContainer.dummyMylist #searchResultMylistSortOptions,\
      body.videoSelection #resultContainer.dummyMylist #searchResultHeader {\
        display: none !important;\
      }\n\
\
      #resultlist .videoItem .thumbnailHoverMenu {\
        position: absolute; padding: 0; box-shadow: 1px 1px 2px black;\
        display: none;\
      }\
      body.videoSelection #searchResultExplorer #resultContainer #resultlist .videoItem .columnVertical     .thumbnailHoverMenu {\
        bottom:  4px; left: 4px;\
      }\
      body.videoSelection #searchResultExplorer #resultContainer #resultlist .videoItem .columnHorizontal   .thumbnailHoverMenu {\
        bottom: 75px; left: 5px;\
      }\
      #resultlist .videoItem .deleteFromMyMylist {\
        cursor: pointer; font-size: 70%; border: 1px solid #ccc; padding: 0;\
        display: none;\
      }\
      #resultlist .videoItem .showLargeThumbnail {\
        cursor: pointer; font-size: 70%; border: 1px solid #ccc;; \
      }\
      body.videoSelection #searchResultExplorer #resultContainer #resultlist .showLargeThumbnail {\
        padding: 0 4px;\
      }\
      body.videoSelection #searchResultExplorer #resultContainer #resultlist .videoItem:hover .thumbnailHoverMenu {\
        display: block;\
      }\n\
      body.videoSelection #searchResultExplorer #resultContainer.enableMylistDeleteButton.mylist.isMine #resultlist .videoItem:hover .deleteFromMyMylist {\
        display: inline-block;\
      }\n\
      body.videoSelection #searchResultExplorer.w_adjusted #resultContainer #searchResultContainer {\
        background: #fff;\
      }\n\
\
      body.videoSelection #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap {\
        margin-right: -290px; padding: 0; transition: margin-right .2s; -webkit-transition: margin-right .2s;\
      }\
      body.videoSelection #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap:hover {\
        margin-right: -0px; z-index: 1020;\
      }\
      body.videoSelection.content-fix #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap {\
        display: none;\
      }\
      body.videoSelection.content-fix #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap:hover {\
      }\
\
      body.videoSelection #popupMarquee {  \
        z-index: 1020; /* #contentがz-index: 1010なのでそれより上げる */\
      }\n\
      ',
    ''].join('');
    addStyle(style, 'watchItLater');
  })();

  conf.load = function() {
    try {
      function loadStorage(key, def) {
        if (window.localStorage[key] === undefined) return def;
        return JSON.parse(window.localStorage.getItem(key));
      }

      for (var v in conf) {
        if (typeof conf[v] == 'function') continue;
        conf[v] = loadStorage('watchItLater_' + v, conf[v]);
      }
    } catch (e) {
    }
  };

  conf.getValue = function(varName) {
    return conf[varName];
  };
  conf.setValue = function(k, v) {
    conf[k] = v;
    window.localStorage.setItem('watchItLater_' + k, JSON.stringify(v));
  };
  conf.load();

  var ConfigPanel = (function(conf, w) {
    var pt = function(){};
    var $panel = null;
    var menus = [
      {title: '動画再生開始・終了時の設定'},
      {title: 'プレイヤーを自動で全画面化', varName: 'autoBrowserFull',
        values: {'する': true, 'しない': false}},
      {title: '自動全画面化オンでも、ユーザーニコ割のある動画は', varName: 'disableAutoBrowserFullIfNicowari',
        values: {'全画面化しない': true, '全画面化する': false}},
      {title: 'プレイヤーを自動で検索画面にする(自動全画面化オフ時)', varName: 'autoOpenSearch',
        values: {'する': true, 'しない': false}},
      {title: 'プレイヤー位置に自動スクロール(自動全画面化オフ時)', varName: 'autoScrollToPlayer',
        values: {'する': true, 'しない': false}},
      {title: '動画終了時に全画面化を解除(原宿と同じにする)', varName: 'autoNotFull',
        values: {'する': true, 'しない': false}},
      {title: 'ウィンドウがアクティブの時だけ自動再生する', varName: 'autoPlayIfWindowActive',
        description: 'QWatch側の設定パネルの自動再生はオフにしてください。\n\n■こんな人におすすめ\n・自動再生ONにしたいけど別タブで開く時は自動再生したくない\n・複数タブ開いたままブラウザ再起動したら全部のタブで再生が始まって「うるせー！」という経験のある人',
        values: {'する': 'yes', 'しない': 'no'}},
      {title: '動画が切り替わる時、ポップアップで再生数を表示', varName: 'popupViewCounter',
        values: {'する': 'always', '全画面時のみ': 'full', 'しない': 'none'}},

      {title: '動画プレイヤーの設定'},
      {title: 'コメントパネルのワイド化', varName: 'wideCommentPanel',
        values: {'する': true, 'しない': false}},
      {title: '左のパネルに動画情報を表示', varName: 'leftPanelJack',
        values: {'する': true, 'しない': false}},
      {title: 'ヘッダに再生数表示', varName: 'headerViewCounter',
        values: {'する': true, 'しない': false}},
      {title: 'てれびちゃんメニュー内に、原宿以前のランダム画像復活', varName: 'hidariue',
        values: {'する': true, 'しない': false}},
      {title: 'タグが2行以内なら自動で高さ調節(ピン留め時のみ)', varName: 'enableAutoTagContainerHeight',
        values: {'する': true, 'しない': false}},
      {title: 'ニコニコニュースの履歴を保持する', varName: 'enableNewsHistory',
        values: {'する': true, 'しない': false}},

      {title: '動画検索画面の設定'},
      {title: 'プレイヤーをできるだけ大きくする (コメントやシークも可能にする)', varName: 'videoExplorerHack',
        description: '便利ですがちょっと重いです',
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りタグを表示', varName: 'enableFavTags',
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りマイリストを表示', varName: 'enableFavMylists',
        values: {'する': true, 'しない': false}},
      {title: 'サムネを4:3にする', varName: 'squareThumbnail',
        values: {'する': true, 'しない': false}},
      {title: 'マイリストから外すボタンを追加(テスト中)', varName: 'enableMylistDeleteButton',
        description: 'マイリストの整理に便利。\n ※ 消す時に確認ダイアログは出ないので注意',
        values: {'する': true, 'しない': false}},

      {title: 'その他の設定'},
      {title: '動画リンクへのポップアップを有効にする', varName: 'enableHoverPopup',
        values: {'する': true, 'しない': false}},
      {title: '背景ダブルクリックで動画の位置にスクロール', varName: 'doubleClickScroll',
        values: {'する': true, 'しない': false}},
      {title: '検索時のデフォルトパラメータ', varName: 'defaultSearchOption', type: 'text',
       description: '常に指定したいパラメータ指定するのに便利です\n例: 「-グロ -例のアレ」とすると、その言葉が含まれる動画が除外されます'},
      {title: '「@ジャンプ」を無効化', varName: 'ignoreJumpCommand',
        values: {'する': true, 'しない': false}}

    ];

    var listener = [];
    function dispatchEvent(name, value, lastValue) {
      for (var i = 0; i < listener.length; i++) {
        (listener[i])(name, value, lastValue);
      }
    }

    pt.createPanelDom = function() {
      if ($panel == null) {
        $panel = w.jQuery('<div id="watchItLaterConfigPanel"><h2>WatchItLater設定</h2><div class="inner"><ul></ul></div></div>');
        var $ul = $panel.find('ul');
        for (var i = 0, len = menus.length; i < len; i++) {
          if (menus[i].varName) {
            var $item = this.createMenuItem(menus[i]);
            $ul.append($item);
          } else {
            $ul.append('<li class="section">'+ menus[i].title + '</li>');
          }
        }
        var $close = w.jQuery('<p class="bottom">項目によっては再読み込みが必要です<button class="closeButton">閉じる</button></p>'), self = this;
        $close.click(function() {
          self.close();
        });
        $panel.append($close);
        w.jQuery('body').append($panel);
      }
    };
    pt.createMenuItem = function(menu) {
      if (menu.type === 'text') {
        return this.createTextMenuItem(menu);
      } else {
        return this.createRadioMenuItem(menu);
      }
    };
    pt.createRadioMenuItem = function(menu) {
      var title = menu.title, varName = menu.varName, values = menu.values;
      var $menu = w.jQuery('<li><p class="title">' + title + '</p></li>');
      if (menu.className) { $menu.addClass(menu.className);}
      if (menu.description) { $menu.attr('title', menu.description); }
      var currentValue = conf.getValue(varName);
      $menu.addClass(menu.varName);
      $panel.addClass(menu.varName + '_' + currentValue);
      for (var k in values) {
        var v = values[k];
        var $label = w.jQuery('<label></label>');
        var $chk = w.jQuery('<input>');
        $chk.attr({type: 'radio', name: varName, value: JSON.stringify(v)});

        if (currentValue == v) {
          $chk.attr('checked', 'checked');
        }
        $chk.click(function() {
          var newValue = JSON.parse(this.value), oldValue = conf.getValue(varName);
          if (oldValue !== newValue) {
            $panel.removeClass(menu.varName + '_' + oldValue).addClass(menu.varName + '_' + newValue);
            conf.setValue(menu.varName, newValue);
            if (typeof menu.onchange === 'function') {
              menu.onchange(newValue, oldValue);
            }
            dispatchEvent(menu.varName, newValue, oldValue);
          }
        });
        $label.append($chk).append(w.jQuery('<span>' + k + '</span>'));
        $menu.append($label);
      }
      return $menu;
    };
    pt.createTextMenuItem = function(menu) {
      var title = menu.title, varName = menu.varName, values = menu.values;
      var $menu = w.jQuery('<li><p class="title">' + title + '</p></li>');
      if (menu.className) { $menu.addClass(menu.className);}
      if (menu.description) { $menu.attr('title', menu.description); }
      var currentValue = conf.getValue(varName);
      var $input = w.jQuery('<input type="text" />');
      $input.val(currentValue);
      $input.change(function() {
        var newValue = $input.val(), oldValue = conf.getValue(varName);
        if (oldValue !== newValue) {
          conf.setValue(varName, newValue);
          if (typeof menu.onchange === 'function') {
            menu.onchange(newValue, oldValue);
          }
          dispatchEvent(menu.varName, newValue, oldValue);
        }
      });
      $menu.append($input);
      return $menu;
    };


    pt.addChangeEventListener = function(callback) {
      listener.push(callback);
    };
    pt.open = function() { $panel.show(200); };
    pt.close = function() { $panel.hide(200); };
    pt.toggle = function() {
      this.createPanelDom();
      if ($panel.is(':visible')) {
        this.close();
      } else {
        this.open();
      }
    };

    return pt;
  })(conf, w);

  /**
   * 通信用
   */
  w.WatchItLater = {};

  /**
   *  動画タグ取得とポップアップ
   *
   */
  var VideoTags = (function(conf, w){

    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var isWatch = w.WatchApp ? true : false;
    var pt = function(){};
    var lastPopup = null;



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
          if (e.button != 0 || e.shiftKey || e.ctrlKey || e.altKey || e.target.className === 'icon' || e.target.tagName === 'A') {
            return;
          }
          this.style.display = 'none';
          e.preventDefault();
        });
        return popup;
      }


      function appendTagHistory(dom, text, dic) {
        var $ = w.$;
        if (uniq === null) {
          uniq = {};
          $history = $('<div class="tagSearchHistory"><h3 class="title">タグ検索履歴</h3></div>');
          $history.css({width: $('#searchResultNavigation').width() - 12, maxHeight: '300px', overflowY: 'auto'});
          $('#searchResultNavigation').append($history);
        }
        if (!uniq[text]) {
          var a = $(dom).clone().css({marginRight: '8px', fontSize: '80%'}).click(function(e) {
            if (e.button != 0 || e.metaKey) return;
            WatchController.nicoSearch(text);
            e.preventDefault();
          });
          dic.style.marginRight = '0';
          $history.find('.title').after(a).after(dic);
        }
        uniq[text] = 1;
      }

      function createItemDOM(tag) {
        var text = tag.tag;
        var li  = document.createElement('li');
        li.className = 'popupTagItem';

        var dic = createDicIconDOM(tag, text);
        li.appendChild(dic);

        var a = document.createElement('a');
        a.appendChild(document.createTextNode(text));

        var href = text;
        if (conf.defaultSearchOption && conf.defaultSearchOption != '' && !text.match(/(sm|nm|so)\d+/)) {
          href += ' ' + conf.defaultSearchOption;
        }
        var sortOrder = '?sort=' + conf.searchSortType + '&order=' + conf.searchSortOrder;
        a.href = 'http://' + host + '/tag/' + encodeURIComponent(href) + sortOrder;
        a.addEventListener('click', function(e) {
          if (e.button != 0 || e.metaKey) return;
          if (w.WatchApp) {
            WatchController.nicoSearch(text);
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

    return pt;
  })(conf, w);









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
    var defListItems = [], mylistItems = {};
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var token = '';//

    function Mylist(){
      this.initialize();
    }

    function getToken() {
      if (!isNativeGM && host != location.host) return null; //
      var _token = (w.NicoAPI) ? w.NicoAPI.token : (w.WatchApp ? w.WatchApp.ns.init.CommonModelInitializer.watchInfoModel.csrfToken : '');
      if (_token === null && w.FavMylist && w.FavMylist.csrf_token) _token = w.FavMylist.csrf_token;
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

    var pt = Mylist.prototype, events = {defMylistUpdate: [], mylistUpdate: []};

    function dispatchEvent(name) {
      var e = events[name];
      for (var i =0, len = e.length; i < len; i++) {
        e[i].apply(null, Array.prototype.slice.call(arguments, 1));
      }
    }

    pt.onDefMylistUpdate = function(callback) {
      events.defMylistUpdate.push(callback);
    };

    pt.onMylistUpdate = function(callback) {
      events.mylistUpdate.push(callback);
    };

    pt.getUserId = function() {
      if (document.cookie.match(/user_session_(\d+)/)) {
        return RegExp.$1;
      } else {
        return false;
      }
    };

    var onInitialized = [];
    pt.initialize = function() {
      if (initialized) return;
      var uid = this.getUserId();
      if (!uid) {
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
            for (var i = 0; i < onInitialized.length; i++) {
              onInitialized[i](mylistlist);
            }
          }
        }
      });
      this.reloadDefList();
    };

    pt.loadMylistList = function(callback) {
      if (initialized) {
          callback(mylistlist);
      } else {
          onInitialized.push(callback);
      }
    };

    pt.isMine = function(id) {
      if (!initialized) { return false;}
      for (var i = 0, len = mylistlist.length; i < len; i++) {
        if (mylistlist[i].id == id) { return true; }
      }
      return false;
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
            if (typeof callback == "function") callback(defListItems);
          }
        }
      });
    };

    pt.loadMylist = function(groupId, callback) {
      if (mylistItems[groupId]) {
        callback(mylistItems[groupId]);
        return;
      }
      var url = 'http://' + host + '/api/mylist/list?group_id=' + groupId;
      var self = this;
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (result.status == "ok" && result.mylistitem) {
            mylistItems[groupId] = result.mylistitem;
            if (typeof callback == "function") callback(result.mylistitem);
          }
        }
      });
    };

    pt.clearMylistCache = function(groupId) {
      delete mylistItems[groupId];
    }

    pt.reloadMylist = function(groupId, callback) {
      this.clearMylistCache(groupId);
      return this.loadMylist(groupId, callback);
    };


    pt.findDefListByWatchId = function(watchId) {
      for (var i = 0, len = defListItems.length; i < len; i++) {
        var item = defListItems[i], wid = item.item_data.watch_id;
        if (wid == watchId) return item;
      }
      return null;
    };

    pt.findMylistByWatchId = function(watchId, groupId) {
      var items = mylistItems[groupId];
      if (!items) { return null; }
      for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i], wid = item.item_data.watch_id;
        if (wid == watchId) return item;
      }
      return null;
    };

    // おもに参考にしたページ
    // http://uni.res.nimg.jp/js/nicoapi.js
    // http://d.hatena.ne.jp/lolloo-htn/20110115/1295105845
    // http://d.hatena.ne.jp/aTaGo/20100811/1281552243
    pt.deleteDefListItem = function(watchId, callback) {
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
          dispatchEvent('defMylistUpdate');
        }
      };
      GM_xmlhttpRequest(req);
      return true;
    };

    pt.addDefListItem = function(watchId, callback) {
      var self = this;
      var url = 'http://' + host + '/api/deflist/add';

      // 例えば、とりマイの300番目に登録済みだった場合に「登録済みです」と言われても探すのがダルいし、
      // 他の動画を追加していけば、そのうち押し出されて消えてしまう。
      // なので、重複時にエラーを出すのではなく、「消してから追加」することによって先頭に持ってくる。
      // 「重複してたら先頭に持ってきて欲しいな～」って要望掲示板にこっそり書いたりしたけど相手にされないので自分で実装した。
      var data = "item_id=" + watchId + "&token=" + token, replaced = true;

      var _add = function(status, resp) {
        var req = {
          method: 'POST',
          data: data,
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded' }, // これを忘れて小一時間はまった
          onload: function(resp) {
            var result = JSON.parse(resp.responseText);
            if (typeof callback == "function") callback(result.status, result, replaced);
          }
        };
        GM_xmlhttpRequest(req);
      }
      // とりあえずマイリストにある場合はdeleteDefListItem()のcallbackで追加、ない場合は即時追加
      if (!this.deleteDefListItem(watchId, _add)) {
        replaced = false;
        _add();
        dispatchEvent('defMylistUpdate');
      }
    };

    pt.addMylistItem = function(watchId, groupId, callback) {
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
          headers: {'Content-Type': 'application/x-www-form-urlencoded' },
          onload: function(resp) {
            var result = JSON.parse(resp.responseText);
            if (typeof callback == "function") callback(result.status, result);
            dispatchEvent('mylistUpdate', {action: 'add', groupId: groupId, watchId: watchId});
            self.clearMylistCache(groupId);
          },
          error: function(resp) {
            Popup.alert('ネットワークエラー');
          }
        };
        GM_xmlhttpRequest(req);
      }
      // 普通のマイリストに入れたら、とりあえずマイリストからは削除(≒移動)
      if (!this.deleteDefListItem(watchId, _add)) _add();
    };

    pt.deleteMylistItem = function(watchId, groupId, callback) {
      var self = this;
      this.loadMylist(groupId, function() {
        var item = self.findMylistByWatchId(watchId, groupId);
        if (!item) {
          Popup.alert('マイリスト中に該当する動画がみつかりませんでした');
          return;
        }
        var
          item_id = item.item_id,
          url = 'http://' + host + '/api/mylist/delete';
          data = [
            'id_list[0][]=', item_id,
            '&group_id=',    groupId,
            '&token=',       token
          ].join(''),
          req = {
            method: 'POST',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: url,
            onload: function(resp) {
              var result = JSON.parse(resp.responseText);
              if (typeof callback == "function") callback(result.status, result);
              dispatchEvent('mylistUpdate', {action: 'delete', groupId: groupId, watchId: watchId});
            },
            error: function(resp) {
              Popup.alert('ネットワークエラー');
            }
          };

        GM_xmlhttpRequest(req);
      });
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
      body.className = 'mylistPopupPanel deflistSelected';
      var nobr = document.createElement('nobr');
      body.appendChild(nobr);

      var extArea = document.createElement('span');

      body.watchId = function(w, v) {
        if (w) {
          _watchId = w;
          _videoId = v || w;
          this.clearExtElement();
          deleteDef.disabled = false;
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
        sel.addEventListener('change', function() {
          // jQueryは全てのページにあるわけではないので気をつける
          if (sel.selectedIndex == 0) {
            body.className = body.className.replace('mylistSelected', 'deflistSelected');
          } else {
            body.className = body.className.replace('deflistSelected', 'mylistSelected');
          }
        });
        if (w.jQuery) {
          w.jQuery(body).dblclick(ondblclick);
        } else {
          body.addEventListener('dblclick', ondblclick);
        }
        function ondblclick() {
          sel.selectedIndex = 0;
          body.className = body.className.replace('mylistSelected', 'deflistSelected');
        };
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
            self.addDefListItem(_watchId, function(status, result, replaced) {
              self.reloadDefList();
              if (status != "ok") {
                Popup.alert('とりあえずマイリストの登録に失敗: ' + result.error.description);
              } else {
                var torimai = '<a href="/my/mylist">とりあえずマイリスト</a>';
                Popup.show(
                  torimai +
                  (replaced ? 'の先頭に移動しました' : 'に登録しました')
                );
              }
            });
          } else {
            self.addMylistItem(_watchId, groupId, function(status, result) {
              self.reloadDefList();
              if (status == 'ok') {
                Popup.show( '<a href="/my/mylist/#/' + groupId + '">' + name + '</a>に登録しました');
              } else {
                Popup.alert(name + 'の登録に失敗: ' + result.error.description);
              }
            });
          }
        } ,false);

        return btn;
      }

      function createDeleteDeflistItemButton(sel) {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('消'));
        btn.className = 'deflistRemove';
        btn.title = 'とりあえずマイリストから削除';
        btn.addEventListener('click', function() {
          btn.disabled = true;
          setTimeout(function() {btn.disabled = false;}, 1000);
          self.deleteDefListItem(_watchId, function(status, result) {
            self.reloadDefList();
            btn.style.display = 'none';
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

      var deleteDef = createDeleteDeflistItemButton();
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

  var FavMylists = (function() {
    var lastUpdate = 0;
    var favMylistList = [];
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var $ = w.$;
    /**
     *  お気に入りマイリストの取得。 jQueryのあるページでしか使えない
     *  マイページを無理矢理パースしてるので突然使えなくなるかも
     */
    var self = {
      load: function(callback) {
        if (!w.jQuery) return; //
        var now = Date.now();
        if (now - lastUpdate < 3 * 60 * 1000) {
          do_callback();
          return;
        }
        lastUpdate = now;

        var
          baseUrl = 'http://' + host + '/my/fav/mylist',
          url = baseUrl,
          maxPage = 1;

        request(1);

        function request(page) {
          url = baseUrl + '?page=' + page;
          GM_xmlhttpRequest({
            url: url,
            onload: function(resp) {
              var $result = $(resp.responseText).find('#favMylist');

              if ($result.length >= 1) {
                updateMaxPage($result);

                if (page === 1) { favMylistList = []; }

                $result.find('.outer').each(function() {
                  favMylistList.push(readBlock(this));
                });
              }

              if (page < maxPage) {
                setTimeout(function() {
                  page++;
                  request(page);
                }, 500);
              } else {
                sort();
                do_callback();
              }
            }
          });
        }

        function readBlock(elm) {
          var
            $elm         = $(elm),
            $a           = $elm.find('h5 a'), $desc = $elm.find('.mylistDescription'),
            iconType     = $elm.find('.folderIcon').attr('class').split(' ')[1],
            id           = ($a.attr('href').split('/').reverse())[0],
            $postTime    = $elm.find('.postTime span'),
            postTime     = $.trim($postTime.text()),
            postTimeData = $postTime.data(),
            $videoLink   = $elm.find('.videoTitle a'),
            videoTitle   = $videoLink.text(),
            videoHref    = $videoLink.attr('href'),
            videoId      = videoHref ? (videoHref.split('/').reverse()[0]) : '';
          return {
            id: id,
            name: $a.text(),
            description: $desc.text(),
            iconType: iconType,
            lastVideo: {
              title: videoTitle,
              videoId: videoId,
              postedAt: postTime,
              postTimeData: postTimeData
            }
          };
        }

        function updateMaxPage($result) {
          var $paging = $result.find('.pagerWrap:first .pager:first a');
          maxPage = Math.min(Math.max($paging.length, 1), 3);
        }
        function sort() {
          favMylistList.sort(function(a, b) {
              return (a.lastVideo.postedAt < b.lastVideo.postedAt) ? 1 : -1;
          });
        }
        function do_callback() {
          if (typeof callback === 'function') { callback(favMylistList); }
        }
      }
    };
    return self;
  })();


  var FavTags = (function() {
    var lastUpdate = 0;
    var favTagList = [];
    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
    var $ = w.$;
    var pt = function(){};
    pt.load = load;

    /**
     *  お気に入りタグの取得。 jQueryのあるページでしか使えない
     *  マイページを無理矢理パースしてるので突然使えなくなるかも
     */
    function load(callback) {
      if (!w.jQuery) return; //
      var now = Date.now();
      if (now - lastUpdate < 60 * 1000) {
        if (typeof callback === 'function') { callback(favMylistList); }
        return;
      }
      lastUpdate = now;

      var url = 'http://' + host + '/my/fav/tag';
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var $result = $(resp.responseText).find('#favTag');
          if ($result.length >= 1) {
            favMylistList = [];
            $result.find('.outer').each(function() {
              var $a = $(this).find('h5 a');
              favTagList.push({href: $a.attr('href'), name: $a.text()});
            });
          }
          if (typeof callback === 'function') { callback(favTagList); }
        }
      });
    }
    return pt;
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
    Popup.hide = function() {
      if (w.WatchApp) {
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.stop();
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
    mylistPanel.className += ' popup';
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
          } else
          if (e.getBoundingClientRect) {
            var o = (e.firstChild && e.firstChild.tagName == 'IMG') ? e.firstChild.getBoundingClientRect() : e.getBoundingClientRect();
            var top = Math.max(w.document.documentElement.scrollTop, w.document.body.scrollTop),
                left = Math.max(w.document.documentElement.scrollLeft, w.document.body.scrollLeft);
            showPanel(watchId, left + o.left, top + o.top);
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

    function bind(force, target) {
      if (!conf.enableHoverPopup) { return; }

      var a = document.links;
        for (var i = 0, len = a.length; i < len; i++) {
          var e = a[i];
          try {
            var m, href= e.href;
            if (
              href &&
              !e.added &&
              (m = videoReg.exec(href)) != null &&
              !excludeReg.test(href) &&
              e.className != "itemEcoLink" &&
              true
            ) {
              each(e, m[2]);
            }
          } catch (ex) {
            conf.debugMode && console.log(ex);
          }
        }


    }

    var lastUpdate = 0;
    var timer = null, linksCount = document.links.length,
      bindLoop = function(nextTime) {
        var now = Date.now();
        var updateInterval = w.document.hasFocus() ? 3000 : 15000;
        if (now - lastUpdate < updateInterval) {
          var len = document.links.length;
          if (linksCount == len) {
            return;
          }
          linksCount = len;
        }
        bind();
        lastUpdate = now;
      };

    var self = {
      hidePopup: function() {
        VideoTags.hidePopup();
        mylistPanel.hide();
        return this;
      },
      updateNow: function() {
        bind();
        lastUpdate -= 1500;
        return this;
      }
    };

    if (location.host == "ext.nicovideo.jp") {
      bind();
    } else {
      var thumbnailReg = /\.smilevideo\.jp\/smile\?i=(\d+)/;
      if (location.host == 'ch.nicovideo.jp' && w.jQuery) {
        w.jQuery('.lazyimage, .thumb_video.thumb_114.wide img').each(function() {
          var $e = w.jQuery(this).text(' ');
          var src = $e.attr('data-original') || $e.attr('src');
          if (typeof src === 'string' && thumbnailReg.test(src)) {
            each(this, 'so' + RegExp.$1);
          }
        });
      }
      bind();
      setInterval(bindLoop, 500);
    }
    return self;
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
    var h, $$ = w.$$;
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

  var WatchController = (function(w) {
    var WatchApp = w.WatchApp,
      watch = (WatchApp && WatchApp.ns.init) || {},
      $ = w.$, WatchJsApi = w.WatchJsApi;
    return {
      isZeroWatch: function() {
        return (WatchApp) ? true : false;
      },
      isQwatch: function() {
        return this.isZeroWatch();
      },
      nicoSearch: function(word, search_type) {
        search_type = search_type || 'tag';
        // こっちだと勝手にスクロールしてしまうようになったので
        //watch.ComponentInitializer.videoSelection.searchVideo(word, search_type);
        //
        watch.ComponentInitializer.videoSelection._searchVideo(
          word,
          WatchApp.ns.components.selection.type.SearchType.valueOf(search_type)
        );
        AnchorHoverPopup.hidePopup();
        setTimeout(function() {
        //  $('#searchResultExplorer .searchText input').focus();
        }, 500);
      },
      showMylist: function(mylistId) {
        watch.ComponentInitializer.videoSelection.showMylistgroup(mylistId);
      },
      clearDeflistCache: function() {
        watch.ComponentInitializer.videoSelection.loaderAgent.deflistVideoLoader.clearCache();
      },
      clearMylistCache: function(id) {
        if (id) {
          watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader._cache.deleteElement({'id': id.toString()});
        } else {
          watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader._cache.clearCache();
        }
      },
      showDefMylist: function() {
        watch.ComponentInitializer.videoSelection.showDefMylist();
      },
      changeScreenMode: function(mode) {
        WatchJsApi.player.changePlayerScreenMode(mode);
        setTimeout(function(){$(window).resize();}, 3000);
      },
      isFixedHeader: function() {
        return !$('body').hasClass('nofix');
      },
      // ヘッダー追従かどうかを考慮したscrollTop
      scrollTop: function(top, dur) {
        var header = (this.isFixedHeader() ? $("#siteHeader").outerHeight() : 0);

        if (top != undefined) {
          return $(window).scrollTop(top - header, dur);
        } else {
          return $(window).scrollTop() + header;
        }
      },
      scrollToVideoPlayer: function(force) {
        // 縦解像度がタグ+プレイヤーより大きいならタグの開始位置、そうでないならプレイヤーの位置にスクロール
        // ただし、該当部分が画面内に納まっている場合は、勝手にスクロールするとかえってうざいのでなにもしない
        var isContentFix = $('body').hasClass('content-fix')
        $('body').removeClass('content-fix');
        var h = $('#playerContainer').outerHeight() + $('#videoTagContainer').outerHeight();
        var top = $(window).height() >= h ? '#videoTagContainer, #playerContainer' : '#playerContainer';


        if (force) {
          // 要素が画面内に納まっている場合でも、その要素の位置までスクロール
          WatchApp.ns.util.WindowUtil.scrollFit(top, 600);
        } else {
          // 要素が画面内に収まっている場合はスクロールしない
          WatchApp.ns.util.WindowUtil.scrollFitMinimum(top, 600);
        }
        $('body').toggleClass('content-fix', isContentFix);
      },
      changeCommentPanelWidth: function(target) {
        var px = target - $('#playerCommentPanelOuter').outerWidth();
        var elms = [
          '#playerCommentPanelOuter',
          '#playerCommentPanel',
          '#playerCommentPanel .commentTable',
          '#playerCommentPanel .commentTable .commentTableContainer',
          '#commentDefaultHeader'
        ];
        for (var v in elms) {
          var $e = $(elms[v]);
          $e.width($e.width() + px);
        }
        $('#playerCommentPanelOuter').css({'right': - $('#playerCommentPanelOuter').outerWidth() + 'px'});
      },
      play: function() {
        watch.PlayerInitializer.nicoPlayerConnector.playVideo();
      },
      pause: function() {
        watch.PlayerInitializer.nicoPlayerConnector.pauseVideo();
      },
      openSearch: function() {
        watch.ComponentInitializer.videoSelection.panelOPC.open();
      },
      closeSearch: function() {
        watch.ComponentInitializer.videoSelection.panelOPC.close();
      },
      getMyNick: function() {
        return watch.CommonModelInitializer.viewerInfoModel.nickname;
      },
      getMyUserId: function() {
        return watch.CommonModelInitializer.viewerInfoModel.userId;
      },
      shufflePlaylist: function() {
        var x = watch.PlaylistInitializer.playlist.items;
        x = x.map(function(a){return {weight:Math.random(), value:a}})
          .sort(function(a, b){return a.weight - b.weight})
          .map(function(a){return a.value});
        var items = [];
        for (var i = 0; i < x.length; i++) {
          if (x[i]._isPlaying) {
            items.unshift(x[i]);
          } else {
            items.push(x[i]);
          }
        }
        watch.PlaylistInitializer.playlist.reset(
          items,
          watch.PlaylistInitializer.playlist.type,
          watch.PlaylistInitializer.playlist.option
        );
      }
    }
  })(w);

  var Util = (function() {
    var Cache = {
      storage: {},
      get: function(key) {
        if (!this.storage[key]) {
          conf.debugMode && console.log('no cache');
          return false;
        } else
        if (this.storage[key].cachedUntil <= Date.now()){
          conf.debugMode && console.log('cache timeout');
          delete this.storage[key];
          return false;
        } else {
          conf.debugMode && console.log('cache exist');
          return this.storage[key].data;
        }
      },
      set: function(key, data, cacheTimeMs) {
        cacheTimeMs = cacheTimeMs || 1000 * 60 * 10;
        conf.debugMode && console.log('set cache', key, cacheTimeMs);
        this.storage[key] = {
          data: data,
          cachedUntil: Date.now() + cacheTimeMs
        }
        return data;
      }
    };



    var self = {
      Cache: Cache
    };
    return self;
  })();

  var NicoNews = (function() {
    var WatchApp = null, watch = null, $ = null, WatchJsApi = null, initialized = false;
    var $button = null, $history = null, $ul = null, deteru = {}, $textMarqueeInner;
    var isHover = false;

    function onNewsUpdate(news) {
      var id = news.data.id, type = news.data.type, $current = null,
          newsText = $textMarqueeInner.find('.categoryOuter:last').text() +
                     $textMarqueeInner.find('.item .title, .item .header, .item .bannertext, .item .text').text(),
          newsHref = $textMarqueeInner.find('a').attr('href');
      if (deteru[newsHref]) {
        $current = deteru[newsHref].remove();
      } else {
        $current = deteru[newsHref] = makeTopic(newsText, newsHref, type);
      }
      $ul.append($current);
      $current.show(200, scrollToBottom);
    }
    function makeTopic(title, url, type) {
      return $([
        '<li style="display: none;">',
        '<a href="', url , '" target="_blank" class="', type, ' title="', escape(title),'">', title, '</a>',
        '</li>',
      ''].join(''));
    }
    function scrollToBottom() {
      if (!isHover) {
        $history.animate({scrollTop: $('.newsHistory ul').innerHeight()}, 200);
      }
    }

    var self = {
      initialize: function(w) {
        WatchApp = w.WatchApp;
        if (!WatchApp || initialized) { return; }
        watch = WatchApp.ns.init;
        $ = w.$;
        WatchJsApi = w.WatchJsApi;
        $textMarqueeInner = $('#textMarquee').find('.textMarqueeInner');

        watch.TextMarqueeInitializer.textMarqueeViewController.scheduler.addEventListener(
          'schedule',
          onNewsUpdate);

        $button = $('<button class="openNewsHistory" title="ニコニコニュースの履歴を開く">▲</button>');
        $history = $('<div class="newsHistory" style="display: none;"><ul></ul></div>');
        $history.hover(
          function() { isHover = true; },
          function() { isHover = false; }
        );
        $ul = $history.find('ul');
        $button.click(function() { self.toggle(); });

        $('#textMarquee').append($button).append($history);
        initialized = true;
      },
      open: function() {
        $history.show(200, function() {
          scrollToBottom();
          WatchApp.ns.util.WindowUtil.scrollFitMinimum('.newsHistory', 200);
        });
      },
      close: function() {
        $history.hide(200);
        isHover = false;
      },
      toggle: function() {
        if ($history.is(':visible')) {
          $button.text('▲');
          this.close();
        } else {
          $button.text('▼');
          this.open();
        }
      }
    };
    return self;
  })();


  /**
   *  動画視聴履歴をマイリストAPIと互換のある形式で返すことで、ダミーマイリストとして表示してしまう作戦
   */
  var VideoWatchHistory = (function(w, Util){
    function load(callback) {
      try{
        var
          watch = w.WatchApp.ns.init, $ = w.$, url = '/my/history',
          myNick = WatchController.getMyNick(), myId = WatchController.getMyUserId();
      } catch (e) {
        conf.debugMode && console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }

      var CACHE_KEY = 'videohistory', CACHE_TIME = 1000 * 60 * 1, cacheData = Util.Cache.get(CACHE_KEY);
      if (cacheData) {
        callback(cacheData);
        return;
      }

      var result = {
        banner: '',
        id: '-1',
        sort: '0',
        isDeflist: -1,
        isWatchngCountFull: false,
        isWatchngThisMylist: false,
        itemCount: 0,
        items: [],
        rawData: {
          name: myNick + 'の視聴履歴',
          user_id: myId,
          user_name: 'ニコニコ動画'
        },
        sort: '1' // $('searchResultMylistSortOptions select').val()
      };
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var $dom = $(resp.responseText), $list = $dom.find('#historyList');
          $list.find('.outer').each(function() {
            var
              $item = $(this), $meta = $item.find('.metadata'), $title = $item.find('.section h5 a'),
              id = $title.attr('href').split('/').reverse()[0], title = $title.text(),
              duration = $item.find('.videoTime').text(),
              viewCnt   = $meta.find('.play')   .text().split(':')[1].replace(/,/g, ''),
              resCnt    = $meta.find('.comment').text().split(':')[1].replace(/,/g, ''),
              mylistCnt = $meta.find('.mylist') .text().split(':')[1].replace(/,/g, ''),
              postedAt  = '20' + $meta.find('.posttime').text().replace(/(年|月)/g, '-').replace(/(日| *投稿)/g, ''),
              thumbnail = $item.find('.thumbContainer a .video').attr('src'),
              hoge
            ;

            var item = {
              id: id,
              length: duration,
              mylist_counter: mylistCnt,
              view_counter: viewCnt,
              num_res: resCnt,
              first_retrieve: postedAt,
              thumbnail_url: thumbnail,
              title: title,
              type: 'video',
              description_short: $item.find('.section .posttime span').text(),
              getType:        function() { return this.type; },
              getInfo:        function() { return this;},
              getName:        function() { return this.title;},
              getId:          function() { return this.id; },
              getDescription: function() { return ''},

              // マイリストAPIの応答にあるけど使ってなさそう？なので未実装
              length_seconds: 0, // TODO:
              create_time: parseInt(Date.now() / 1000, 10),  // TODO:
              thread_update_time: '2000-01-01 00:00:00', // TODO:
              mylist_comment: ''

            };
            result.items.push(item);
          });
          result.page = 1;
          result.itemCount = result.items.length;
          result.rawData = {
            list: result.items,
            name: '視聴履歴',
            status: 'ok',
            description: '',
            is_watching_count_full: false,
            is_watching_this_mylist: false,
            user_nickname: myNick,
            user_id: myId,
            sort: '8'
          };
          callback(Util.Cache.set(CACHE_KEY, result, CACHE_TIME))
        },
        onerror: function() {
          Popup.alert('視聴履歴の取得に失敗しました');
        }
      });

    }
    var self = {
      load : load
    };
    return self;
  })(w, Util);

  var VideoRecommendations = (function(w, Util){
    var histories = {};
    function request(callback) {
      try{
        var
          watch = w.WatchApp.ns.init, $ = w.$, url = '/recommendations',
          myNick = WatchController.getMyNick(), myId = WatchController.getMyUserId();
      } catch (e) {
        conf.debugMode && console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }
      var CACHE_KEY = 'recommend', CACHE_TIME = 1000 * 60 * 1, cacheData = Util.Cache.get(CACHE_KEY);
      if (cacheData) {
        callback(cacheData);
        return;
      }

      var result = {
        banner: '',
        id: '-2',
        sort: '0',
        isDeflist: -1,
        isWatchngCountFull: false,
        isWatchngThisMylist: false,
        itemCount: 0,
        items: [],
        rawData: {
          name: 'あなたにオススメの動画',
          user_id: myId,
          user_name: 'ニコニコ動画'
        },
        sort: '1' // $('searchResultMylistSortOptions select').val()
      };
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var text = resp.responseText, lines = text.split(/[\r\n]/), found = false, data;
          for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            if (line.indexOf('var Nico_RecommendationsParams') >= 0 &&
                lines[i + 5] && lines[i + 5].indexOf('first_data') >= 0) {
              data = JSON.parse(lines[i + 5].replace(/^.*?:/, ''));
              if (data && data.videos) {
                found = true;
                break;
              }
            }
          }
          if (!found) {
            throw { message: '取得に失敗しました', status: 'fail'};
          }
          for (var i = 0, len = data.videos.length; i < len; i++) {
            var video = data.videos[i];
            if (histories[video.id]) {
              delete histories[video.id];
            }
            var item = {
              id: video.id,
              length: video.length,
              mylist_counter: video.mylist_counter,
              view_counter:   video.view_counter,
              num_res:        video.num_res,
              first_retrieve: video.first_retrieve,
              thumbnail_url:  video.thumbnail_url,
              title:          video.title_short,
              type:           'video',
              description_short: '関連タグ: ' + video.recommend_tag,
              getType: function() { return this.type; },
              getInfo: function() { return this;},

              // APIの応答みると必要そうだけど未実装
              length_seconds: 0, // TODO:
              create_time: parseInt(Date.now() / 1000, 10),  // TODO:
              thread_update_time: '2000-01-01 00:00:00', // TODO:
              mylist_comment: ''

            };
            histories[video.id] = item;
            //result.items.push(item);
          }
          for (var v in histories) {
            result.items.unshift(histories[v]);
          }
          result.items = result.items.slice(0, 128);
          result.itemCount = result.items.length;
          result.rawData.list = result.items;
          callback(Util.Cache.set(CACHE_KEY, result, CACHE_TIME));
        },
        onerror: function() {
          throw { message: '取得に失敗しました', status: 'fail'};
        }
     });

    }
    function load(callback, param) {
      request(function(result) {
        var viewPage = (param && typeof param.page === 'number') ? param.page : 1;
        result.page  = param.viewPage;
        result.items = result.rawData.list.slice(viewPage * 32 - 32, viewPage * 32);
        callback(result);
      });
    }
    var self = {
      load : load
    };
    return self;
  })(w, Util);

  var NicorepoVideo = (function(w, Util) {
    function getNicorepoTitle(type) {
      var base = '【ニコレポ】';
      if (type === 'all') {
        return base + 'すべての動画';
      } else
      if (type === 'chcom') {
        return base + 'お気に入りチャンネル&コミュニティの動画';
      } else
      if (type === 'mylist') {
        return base + 'お気に入りマイリストの動画';
      }
      return base + 'お気に入りユーザーの動画';
    }

    var CACHE_TIME = 1000 * 60 * 10;
    function request(callback, param) {
      try{
        var
          watch = w.WatchApp.ns.init, $ = w.$, url = '/recommendations',
          myNick = WatchController.getMyNick(), myId = WatchController.getMyUserId(),
          type = param.type ? param.type : 'user',
          baseUrl = '/my/top/' + type + '?innerPage=1&mode=next_page';

      } catch (e) {
        conf.debugMode && console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        callback(cacheData);
        return;
      }

      var
        last_timeline = false,
        uniq = {},
        result = {
          banner: '',
          id: '-10',
          sort: '0',
          isDeflist: -1,
          isWatchngCountFull: false,
          isWatchngThisMylist: false,
          itemCount: 0,
          items: [],
          rawData: {
            name: getNicorepoTitle(type),
            user_id: myId,
            user_name: 'ニコニコ動画'
          },
          sort: '1' // $('searchResultMylistSortOptions select').val()
        };
      function req(callback, param, pageCount, maxPageCount) {
        var WatchApp = w.WatchApp, watch = WatchApp.ns.init, $ = w.$, url = baseUrl;
        url += last_timeline ? ('&last_timeline=' + last_timeline) : '';
        conf.debugMode && console.log(url);

        GM_xmlhttpRequest({
          url: url,
          onload: function(resp) {
            var $dom = $(resp.responseText), $list = $dom.find('.timeline'), $nextPageLink = $dom.find('.next-page-link'), hasNextPage = $nextPageLink.length > 0;

            $list.find([
              '.log-user-mylist-add',
              '.log-user-uad-advertise',
              '.log-user-video-upload',
              '.log-mylist-added-video',
              '.log-community-video-upload',
              '.log-user-video-round-number-of-view-counter',
              '.log-user-video-round-number-of-mylist-counter'
            ].join(', ')).each(function() {
              var
                $item = $(this), $meta = $item.find('.metadata'), $title = $item.find('.log-content .log-target-info a'),
                id = $title.attr('href').split('/').reverse()[0].replace(/\?.*$/, ''), title = $title.text(),
                duration = '--:--',
                viewCnt   = '-',
                resCnt    = '-',
                mylistCnt = '-',
                postedAt  = WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M:%S', new Date($item.find('.log-footer-date time').attr('datetime'))),
                thumbnail = $item.find('.log-target-thumbnail .video').attr('data-src'),
                hoge
              ;

              if (uniq[id]) { return; }
              uniq[id] = true;

              var item = {
                id: id,
                length: duration,
                mylist_counter: mylistCnt,
                view_counter: viewCnt,
                num_res: resCnt,
                first_retrieve: postedAt,
                thumbnail_url: thumbnail,
                title: title,
                type: 'video',
                description_short: $item.find('.log-body').text(),
                getType:        function() { return this.type; },
                getInfo:        function() { return this;},
                getName:        function() { return this.title;},
                getId:          function() { return this.id; },
                getDescription: function() { return ''},

                // マイリストAPIの応答にあるけど使ってなさそう？なので未実装
                length_seconds: 0, // TODO:
                create_time: parseInt(Date.now() / 1000, 10),  // TODO:
                thread_update_time: '2000-01-01 00:00:00', // TODO:
                mylist_comment: ''

              };
              result.items.push(item);
            });
            result.page = 1;
            result.itemCount = result.items.length;
            result.rawData = {
              list: result.items,
              name: getNicorepoTitle(type),
              status: 'ok',
              description: '',
              is_watching_count_full: false,
              is_watching_this_mylist: false,
              user_nickname: myNick,
              user_id: myId,
              sort: '8'
            };

            var lastTimelineReg = /last_timeline=(\d+)/;
            if (hasNextPage && ++pageCount <= maxPageCount) {
             var href = $nextPageLink.attr('href');
             if (lastTimelineReg.test(href)) {
               last_timeline = RegExp.$1;
               setTimeout(function() {
                   req(callback, param, pageCount, maxPageCount);
                 }, 500);
               } else {
                callback(Util.Cache.set(baseUrl, result, CACHE_TIME));
               }
            } else {
                callback(Util.Cache.set(baseUrl, result, CACHE_TIME));
            }
          },
          onerror: function() {
            Popup.alert('ニコレポの取得に失敗しました'); // setTimeoutかましてるので例外投げてもcatchできない
          }
       });
      }
      req(callback, param, 1, 3);
    }
    function load(callback, param) {
      request(function(result) {
        var viewPage = (param && typeof param.page === 'number') ? param.page : 1;
        result.page  = param.viewPage;
        result.items = result.rawData.list.slice(viewPage * 32 - 32, viewPage * 32);
        callback(result);
      }, param);
    }

    var self = {
      load: load,
      REPO_ALL:    -10,
      REPO_USER:   -11,
      REPO_CHCOM:  -12,
      REPO_MYLIST: -13,
      loadAll:    function(callback, p) {
        p = p || {};
        p.type = 'all';
        self.load(callback, p);
      },
      loadUser:   function(callback, p) {
        p = p || {};
        p.type = 'user';
        self.load(callback, p);
      },
      loadChCom:  function(callback, p) {
        p = p || {};
        p.type = 'chcom';
        self.load(callback, p);
      },
      loadMylist: function(callback, p) {
        p = p || {};
        p.type = 'mylist';
        self.load(callback, p);
      }
    };
    return self;
  })(w, Util);



  /**
   *  ランキングのRSSをマイリストAPIと互換のある形式に変換することで、ダミーマイリストとして表示してしまう作戦
   */
  var VideoRanking = (function(w, Util) {
    var $ = w.jQuery, WatchApp = w.WatchApp;

    var
      genreIdTable = {
        all:        -100,
        g_ent2:     -110,
          ent:        -111,
          music:      -112,
          sing:       -113,
          play:       -114,
          dance:      -115,
          vocaloid:   -116,
          nicoindies: -117,
        g_life2:    -120,
          animal:     -121,
          cooking:    -122,
          nature:     -123,
          travel:     -124,
          sport:      -125,
          lecture:    -126,
          drive:      -127,
          history:    -128,
        g_politics: -130,
        g_tech:     -140,
          science:    -141,
          tech:       -142,
          handcraft:  -143,
          make:       -144,
        g_culture2: -150,
          anime:      -151,
          game:       -152,
          toho:       -153,
          imas:       -154,
          radio:      -155,
          draw:       -156,
        g_other:    -160,
          are:        -161,
          diary:      -162,
          other:      -163,
        r18:        -170
      },
      genreNameTable = {
        all:        'カテゴリ合算',
        g_ent2:     'エンタメ・音楽',
          ent:        'エンターテイメント',
          music:      '音楽',
          sing:       '歌ってみた',
          play:       '演奏してみた',
          dance:      '踊ってみた',
          vocaloid:   'VOCALOID',
          nicoindies: 'ニコニコインディーズ',
        g_life2:    '生活・一般・スポ',
          animal:     '動物',
          cooking:    '料理',
          nature:     '自然',
          travel:     '旅行',
          sport:      'スポーツ',
          lecture:    'ニコニコ動画講座',
          drive:      '車載動画',
          history:    '歴史',
        g_politics: '政治',
        g_tech:     '科学・技術',
          science:    '科学',
          tech:       'ニコニコ技術部',
          handcraft:  'ニコニコ手芸部',
          make:       '作ってみた',
        g_culture2: 'アニメ・ゲーム・絵',
          anime:      'アニメ',
          game:       'ゲーム',
          toho:       '東方',
          imas:       'アイドルマスター',
          radio:      'ラジオ',
          draw:       '描いてみた',
        g_other:    'その他',
          are:        '例のアレ',
          diary:      '日記',
          other:      'その他',
        r18:        'R-18'
      },
      termIdTable = {
        'hourly':      0,
        'daily':   -1000,
        'weekly':  -2000,
        'monthly': -3000,
        'total':   -4000
      },
      termNameTable = {
        'hourly':      '(毎時)',
        'daily':       '(24時間)',
        'weekly':      '(週間)',
        'monthly':     '(月間)',
        'total':       '(合計)'
      },
      idTermTable = {},
      idGenreTable = {}
    ;
    for (var genre in genreIdTable) { idGenreTable[genreIdTable[genre]] = genre;}
    for (var term in termIdTable)   { idTermTable [termIdTable [term ]] = term; }

    /**
     *  ニコニコ動画ランキングのRSSをマイリストAPI互換のデータ形式に変換
     */
    function rss2mylist(xml) {
      var
        $x = $(xml),
        title = $x.find('channel title:first').text(),
        $items = $x.find('channel item'),
        result = {
          banner: '',
          id: '-100',
          name: title,
          sort: '0',
          isDeflist: -1,
          isWatchngCountFull: false,
          isWatchngThisMylist: false,
          itemCount: 0,
          items: [],
          rawData: {
          }
        };
      $items.each(function() {
        var video = parseRssItem($(this));
        var item = {
          id: video.id,
          length: video.duration,
          mylist_counter: video.mylistCnt,
          view_counter: video.viewCnt,
          num_res: video.resCnt,
          first_retrieve: video.postedAt,
          thumbnail_url: video.thumbnail,
          title: video.title,
          type: 'video',
          description_short: video.description.substring(0, 50),
          getType: function() { return this.type; },
          getInfo: function() { return this;},

          // APIの応答みると必要そうだけど未実装
          length_seconds: 0, // TODO:
          create_time: parseInt(Date.now() / 1000, 10),  // TODO:
          thread_update_time: '2000-01-01 00:00:00', // TODO:
          mylist_comment: ''
        };
        result.items.push(item);
        result.itemCount++;
      });
      return result;
    }

    function parseRssItem($item) {
      var
        desc_cdata = $item.find('description')[0].innerHTML.replace(/^<!--\[CDATA\[/, '').replace(/ *\]\]&gt;$/, ''),
        $desc      = $('<div>' + desc_cdata + '</div>');
      return {
        title       : $item.find('title')                  .text(),
        id          : $item.find('guid')                   .text().split('/').reverse()[0],
        duration    : $desc.find('.nico-info-length')      .text(),
        viewCnt     : $desc.find('.nico-info-total-view')  .text().replace(/,/g, ''),
        resCnt      : $desc.find('.nico-info-total-res')   .text().replace(/,/g, ''),
        mylistCnt   : $desc.find('.nico-info-total-mylist').text().replace(/,/g, ''),
        postedAt    : $desc.find('.nico-info-date')        .text()
          .replace(/(年|月)/g, '-')
          .replace(/：/g, ':')
          .replace(/(日)/g, ''),
        description : $desc.find('.nico-description')      .text(),
        thumbnail   : $desc.find('.nico-thumbnail img').attr('src')
      };
    }

    function xhr(callback, url) {
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          if (typeof callback === 'function') {
            callback(resp);
          }
        },
        onerror: function() {
          Popup.alert('取得に失敗しました');
        }
      });
    };

    var CACHE_TIME = 1000 * 60 * 30;
    function request(baseUrl, rssPage, maxRssPage, callback) {

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        callback(cacheData);
        return;
      }

      var result = {
        banner: '',
        id: '-100',
        sort: '0',
        isDeflist: -1,
        isWatchngCountFull: false,
        isWatchngThisMylist: false,
        itemCount: 0,
        items: [],
        rawData: {
          status: 'ok',
          list: [],
          name: '総合ランキング',
          description: '',
          is_watching_count_full:  false,
          is_watching_this_mylist: false,
          user_nickname: WatchController.getMyNick(),
          user_id:       WatchController.getMyUserId(),
          sort: '8'
        }
      };

      function req(rssPage, maxRssPage, callback) {
        var url = baseUrl + '&page=' + rssPage;
        xhr(
          function(resp) {
            var res = rss2mylist(resp.responseText);
            for (var i = 0, len = res.items.length; i < len; i++) {
              result.items.push(res.items[i]);
            }
            if (rssPage >= maxRssPage) {
              result.itemCount    = result.items.length;
              result.rawData.name = res.name;
              result.rawData.list = result.items;

              callback(Util.Cache.set(baseUrl, result, CACHE_TIME));
            } else {
              setTimeout(function() {
                req(rssPage + 1, maxRssPage, callback);
              }, 500);
            }
          },
          url
        );
      }
      req(rssPage, maxRssPage, callback);
    }

    function parseParam(param) {
      var
        id = parseInt(param.id || -100, 10),
        genreId  = getGenreId(id),
        termId   = getTermId(id),
        category = idGenreTable[genreId] || 'all', type = 'fav', term = 'daily', lang= 'ja-jp',
        viewPage = (param && typeof param.page === 'number') ? param.page : 1,
        maxRssPage = 1;
        term = idTermTable[termId] || idTermTable[0];
        maxRssPage = (category === 'all' && term !== 'hourly') ? 3 : 1;

      return {
        genreId: genreId,
        category: category,
        type: type,
        term: term,
        lang: lang,
        viewPage: viewPage,
        maxRssPage: maxRssPage,
        baseUrl: '/ranking/'+ type +'/'+ term + '/'+ category +'?rss=2.0&lang=' + lang
      }
    }

    function loadRanking(callback, param) {
      var p = parseParam(param);

      request(p.baseUrl, 1, p.maxRssPage, function(result) {
        conf.debugMode && console.log(result);
        result.page  = p.viewPage;
        result.items = result.rawData.list.slice(p.viewPage * 32 - 32, p.viewPage * 32);
        if (typeof callback === 'function') {
          callback(result);
        }
      });
    }

    function load(onload, p) {
      loadRanking(onload, p);
    }
    function getTermId(t) {
      if (typeof t === 'string') {
        return termIdTable[t] || 0;
      } else
      if (typeof t === 'number'){
        return (t - (t % 1000)) % 10000;
      }
      return 0;
    }
    function getGenreId(g, term) {
      if (typeof g === 'string') {
        return (genreIdTable[g] || 0) + getTermId(term);
      } else
      if (typeof g === 'number'){
        return g % 1000;
      } else {
        return genreIdTable;
      }
    }
    function getGenreName(g) {
      if (typeof g === 'number') {
        g = g % 1000;
        var genre = idGenreTable[g];
        return genreNameTable[genre];
      } else
      if (typeof g === 'string') {
        return genreNameTable[g];
      } else {
        return genreNameTable;
      }
    }
    function getCategory(g) {
      if (typeof g === 'number') {
        g = g % 1000;
        return idGenreTable[g - (g %10)];
      } else
      if (typeof g === 'string') {
        g  = genreIdTable[g];
        return idGenreTable[g - (g %10)];
      } else {
        return 'all';
      }
    }
    var self = {
      load: load,
      getTermId: getTermId,
      getGenreId: getGenreId,
      getGenreName: getGenreName,
      getCategory: getCategory
    };
    return self;
  })(w, Util);



  /**
   *  QWatch上でのあれこれ
   *  無計画に増築中
   *
   *  watch.jsを解析すればわかる
   *
   */
  (function() { // Zero Watch
    var h, $ = w.$, $$ = w.$$;
    if (!w.WatchApp) return;

    $.fx.interval = conf.fxInterval;

    var
      video_id = '', watch_id = '',
      iframe = Mylist.getPanel(''), tv_chan = $('.videoMenuToggle')[0],
      WatchApp = w.WatchApp, WatchJsApi = w.WatchJsApi,
      isFixedHeader = !$('body').hasClass('nofix'),
      watch = WatchApp.ns.init,
      tagv = watch.TagInitializer.tagViewController, pim = watch.PlayerInitializer.playerInitializeModel, npc = watch.PlayerInitializer.nicoPlayerConnector,
      pac  = watch.PlayerInitializer.playerAreaConnector, vs = watch.ComponentInitializer.videoSelection, isSearchOpen = false,
      $leftPanel     = $('#leftPanel'),
      $leftInfoPanel = $('#leftPanelContent').clone().empty().attr({'id': 'leftVideoInfo',   'class': 'leftVideoInfo'}),
      $ichibaPanel   = $('#leftPanelContent').clone().empty().attr({'id': 'leftIchibaPanel', 'class': 'leftIchibaPanel'}),
      $rightPanel = $('#playerCommentPanelOuter');
  //  var flashVars = pim.playerInitializeModel.flashVars;

    var initialExplorerWidth = null, resizeWatchTimer = null;
    function onWindowResize() {
      if (resizeWatchTimer != null) {
        clearTimeout(resizeWatchTimer);
      }
      AnchorHoverPopup.hidePopup();
      resizeWatchTimer = setTimeout(function() {
        var narrow = $(window).innerWidth() < 1350,r = - $('#playerCommentPanelOuter').outerWidth();
        /*$('#content').toggleClass('narrowBorder', narrow);
        if (narrow) { r += 10; }
        $('#playerCommentPanelOuter').css({'right': r + 'px'});
        */
        resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
        adjustSmallVideoSize();
      }, 1000);
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
        onVideoChange(newVideoId, newWatchId);
        video_id = newVideoId;
      }
    }

    /**
     *  デフォルトの市場貼付ボタンはなぜかページの一番上までスクロールするという意地悪な仕様だが、
     *  こっちはがんばって見やすい位置に調整して開く
     */
    function ichibaSearch(word, shopCode) {
      var wait = 10, opened = false;
      //shopCode = shopCode || 'az'; // az = amazon
      var search = function() {
        if ($('#ichibaConsole').is(':visible')) {
          setTimeout(function() {
            w.WatchApp.ns.util.WindowUtil.scrollFitMinimum('#ichibaConsole', 300);
          }, 1000);
          if (!word) {
            return;
          }
          if ($('#ichiba_search_form_query').is(':visible')) {
              $('#ichiba_search_form_query').val(word);
              w.ichiba.search(shopCode, 0, 'all');
            setTimeout(function() {$('#ichiba_search_form_query').focus()}, 1000);
          } else {
            if (!opened) {
              if(shopCode) { w.ichiba.showRelatedTagItems(shopCode, 0, 'all'); }
              opened = true;
            }
            if (wait-- > 0) setTimeout(search, 1000);
          }
        } else {
          if (wait-- > 0) setTimeout(search, 1000);
        }
      }
      search();
      w.ichiba.showConsole();
    }

    function onVideoChange(newVideoId, newWatchId) {
    }

    function setVideoCounter(watchInfoModel) {
      var h = [
        '再生: ', watchInfoModel.viewCount,
        ' | コメント: ', watchInfoModel.commentCount,
        ' | マイリスト: ', watchInfoModel.mylistCount
      ].join('');
      if ((conf.popupViewCounter === 'always') ||
          (conf.popupViewCounter === 'full' && $('body').hasClass('full_with_browser'))
      ) {
        Popup.show(
          $('<div/>')
            .append(
              $('<a/>')
              .text(WatchApp.ns.util.StringUtil.unescapeHTML(watchInfoModel.title))
              .attr('href', 'http://nico.ms/' + watchInfoModel.v)
            )
            .html() +
          '<br/><span style="margin-left:10px; font-size: 90%;">'+ h + '</span>'
        );
      }
      if (conf.headerViewCounter) {
        var vc = $('#videoCounter');
        if (vc.length < 1) {
          var li = $('<li></li>')[0];
          li.id = 'videoCounter';
          $('#siteHeaderLeftMenu').after(li);
          vc = $('#videoCounter');
        }
        vc.html(h);
      }
    }

    var isFirst = true;
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
//      $('body').toggleClass('w_channel', watch.CommonModelInitializer.watchInfoModel.isChannelVideo());
//      setVideoCounter(watch.CommonModelInitializer.watchInfoModel);

      if (conf.autoBrowserFull) {
        setTimeout(function() {
          if ($('body').hasClass('up_marquee') && conf.disableAutoBrowserFullIfNicowari) {
            // ユーザーニコ割があるときは自動全画面にしない
            return;
          }
          WatchController.changeScreenMode('browserFull');
          onWindowResize();
        }, 100);
      } else {
        if (conf.autoOpenSearch && !$('body').hasClass('videoSelection')) {
          $('#openSearchResultExplorer').click();
        }
        if (conf.autoScrollToPlayer) {
          // 初回のみ、プレイヤーが画面内に納まっていてもタグの位置まで自動スクロールさせる。(ファーストビューを固定するため)
          // 二回目以降は説明文や検索結果からの遷移なので、必要最小限の動きにとどめる
          if (!$('body').hasClass('videoSelection') || isFirst) {
            WatchController.scrollToVideoPlayer(isFirst);
          }
        }
      }

      leftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
      resetHidariue();
      onTagReset();
      if (!isFirst) {
      } else {
        if (conf.autoPlayIfWindowActive === 'yes' && w.document.hasFocus()) {
          // ウィンドウがアクティブの時だけ自動再生する。 複数タブ開いてるときは便利
          setTimeout(function() { WatchController.play();}, 2000);
        }
      }
      isFirst = false;
    }


    function onVideoChangeStatusUpdated(f) {
      AnchorHoverPopup.hidePopup();
      if (!isFirst) {
        if (conf.enableSlideEffect) {
          var dur = 500, width = $(window).innerWidth() * 0.5,
              $panel = $leftInfoPanel,
              baseLeft = -$panel.outerWidth(),
              left = -($panel.offset().left - baseLeft * 2);
          if (f) {
            $panel.animate({left: left + 'px'}, dur, 'swing', function() { $leftInfoPanel.empty(); });
          } else {
            setTimeout(function() {
              $panel.animate({left: baseLeft + 'px'}, dur * 2, 'swing');
            }, dur);
          }
        } else {
          if (f) {
            var $description = $leftInfoPanel.find('.videoDetails');
            if ($('body').hasClass('videoSelection')) {
                  $leftInfoPanel.find('.leftVideoInfoInner')
                    .animate({opacity: 0}, 800,
                      function() { }
                    );
              return;
              $description.css({maxHeight: Math.max(150, $description.outerHeight()), minHeight: 0})
                .animate({maxHeight: 150}, 800, function() {
                  $description.empty();
                  $leftInfoPanel.find('.leftVideoInfoInner')
                    .animate({opacity: 0}, 800,
                      function() { }
                    )
                });
            } else {
              $description.css({maxHeight: $description.outerHeight(), minHeight: 0})
                .animate({maxHeight: 0}, 800, function() {
                  $description.empty();
                  $leftInfoPanel.find('.leftVideoInfoInner')
                    .animate({opacity: 0}, 800,
                      function() { }
                    )
                });
            }
          }
        }
      }
    }

    // - 左パネル乗っ取る
    var leftInfoPanelInitialized = false, $leftPanelTemplate = null;
    function resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
        if (!conf.leftPanelJack) { return; }
        var maxWidth = Math.max(
          Math.min(
            266,
            $leftPanel.width(),
            $(window).innerWidth() - $('#playerCommentPanelOuter').width() - $('#nicoplayerContainer').width() - 20
          ),
          196
        );
        $leftInfoPanel.width((maxWidth - 0) + 'px');
        $ichibaPanel.width((maxWidth - 0) + 'px');
    }
    function initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
      if (!conf.leftPanelJack) { return; }
      if (!leftInfoPanelInitialized) {
        var $tab = $('<ul id="leftPanelTabContainer"><li class="tab nicommend" data-selection="nicommend">ニコメ</li><li class="tab ichiba" data-selection="ichiba">市場</li><li class="tab videoInfo" data-selection="videoInfo">情報</li></ul>');
        $leftPanel.append($leftInfoPanel);
        $leftPanel.append($tab).append($ichibaPanel);

        resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);

        $tab.click(function(e) {
          AnchorHoverPopup.hidePopup();
          var selection = $(e.target).attr('data-selection');
          if (typeof selection === 'string') {
            conf.setValue('lastLeftTab', selection);
            changeTab(selection);
          }
        });

        var leftPanelMap = {
          nicommend: [$leftPanel],
          videoInfo: [$leftInfoPanel],
          ichiba:    [$ichibaPanel]
        };
        function changeTab(selection) {
          $leftPanel.removeClass('videoInfo nicommend ichiba').addClass(selection);
          var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
          panelSVC.contentSlider.left = panelSVC.innerLeftElements = leftPanelMap[selection];
          if (selection === 'ichiba') {
            resetLeftIchibaPanel($ichibaPanel, false);
          }
        }
        $leftInfoPanel.dblclick(function(e) {
          $leftInfoPanel.animate({scrollTop: 0}, 600);
        });

        changeTab(conf.lastLeftTab);

        $leftPanelTemplate = $([
          '<div class="leftVideoInfoInner">',
            '<div class="videoTitleContainer"></div>',
            '<div class="videoThumbnailContainer">',
              '<img class="videoThumbnailImage">',
            '</div>',
            '<div class="videoDetails">',
              '<div class="videoInfo videoPostedAt">',
              '</div>',
              '<div class="videoDescription">',
                '<div class="videoDescriptionInner">',
                '</div>',
              '</div>',
            '</div>',
            '<div class="videoOwnerInfoContainer">',
            '</div>',
          '</div>',
        ''].join(''));

        leftInfoPanelInitialized = true;
        // 検索中のスクロールのガタガタ感を軽減
          WatchApp.ns.util.WindowUtil.scrollForDisplayPlayer_org = WatchApp.ns.util.WindowUtil.scrollForDisplayPlayer;
          WatchApp.ns.util.WindowUtil.scrollForDisplayPlayer = function(dur) {
            if($('body').hasClass('content-fix')) {
              // 検索モードかつ動画情報上表示の時だとなぜかページの一番上まで飛ばされる
              return;
            } else {
              WatchApp.ns.util.WindowUtil.scrollForDisplayPlayer_org(dur);
            }
          };
          watch.ComponentInitializer.videoSelection.scrollUp = function(dur) {
            var target = '#playlistReplaceButton';/*, '#searchResultContent'*/
            dur = dur || 200;
            if ($(target).offset().top < WatchController.scrollTop()) {
              WatchApp.ns.util.WindowUtil.scrollFitMinimum(target, dur);
            }
          };
//          watch.ComponentInitializer.videoSelection.scroll = function(dur) {
//            var target = '#playlistReplaceButton'/*, '#searchResultContent'*/, dur = dur || 200;
//            WatchApp.ns.util.WindowUtil.scrollFitMinimum(target, dur);
//          };

      }
    }
    function leftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
      if (!conf.leftPanelJack) { return; }

      initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);

      var watchInfoModel = watch.CommonModelInitializer.watchInfoModel;
      var uploaderId = watchInfoModel.uploaderInfo.id;
      var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
      var h = $leftInfoPanel.innerHeight() - 100, $inner = $('<div/>');

      var addComma = WatchApp.ns.util.StringUtil.addComma;
      var $template = $leftPanelTemplate.clone();

      $template.css('opacity', 0);

      var $videoTitleContainer = $template.find('.videoTitleContainer');
      $videoTitleContainer.append($('#videoTitle').clone().attr('id', null));

      var $videoThumbnailContainer = $template.find('.videoThumbnailContainer');//.css({maxHeight: 0});
      $videoThumbnailContainer.append($('#videoThumbnailImage').clone(true).attr('id', null)).click(function() {
        var src = $(this).find('img:last').attr('src');
        showLargeThumbnail(src);
      });

      var $videoDetails = $template.find('.videoDetails');
      $videoDetails.css({maxHeight: 0, overflowY: 'hidden', minHeight: 0});
      var $videoInfo = $videoDetails.find('.videoInfo');
      var $counter = $([
        '<ul class="videoStats">',
          '<li>再生: <span>'      , addComma(watchInfoModel.viewCount),    '</span></li>',
          '<li>コメント: <span>'  , addComma(watchInfoModel.commentCount), '</span></li>',
          '<li>マイリスト: <span>', addComma(watchInfoModel.mylistCount),  '</span></li>',
        '</ul>',
      ''].join(''));
      $videoInfo.empty()
        .append($('<span/>').text($('.videoPostedAt:last').text()))
        .append($counter);


      var $videoDescription = $template.find('.videoDescription');
      $videoDescription.find('.videoDescriptionInner').append($('.videoDescription:first').clone(true));
      $videoDescription.find('.watch').unbind('click');


      var $videoOwnerInfoContainer = $template.find('.videoOwnerInfoContainer');
      $videoOwnerInfoContainer
        .append(
          $('#userProfile').find('.userIconContainer').clone(true)
            .append(
              $('<span class="userName">' + $('#videoInfo').find('.userName').text() + '</span><br/>'))
            .append(
              $('#userProfile').find('.showOtherVideos').clone(true).text('関連動画').attr('href', '/user/' + uploaderId + '/video')
            )
        ).append(
          $('#ch_prof').clone(true).attr('id', null)
            .addClass('ch_profile').find('a').attr('target', '_blank')
        );

      $leftInfoPanel.empty().scrollTop(0);

      $leftInfoPanel.append($template);
      // なんのためのアニメーション？ → 最初に投稿者アイコンをよく見せるため
      if ($('body').hasClass('videoSelection')) {
        var vc = $template.find('.videoOwnerInfoContainer').outerHeight() - $template.find('.videoTitleContainer').outerHeight();
        $videoDetails.css({maxHeight: vc, minHeight: vc});
        $videoOwnerInfoContainer.css({top: 0});
        $template.animate({opacity: 1}, 800, function() {
          var mh = $leftPanel.innerHeight() - $template.outerHeight() - 16;
            $videoDetails
              .animate({maxHeight: 500, minHeight: 250}, 1000,
                function() { $videoDetails.css({maxHeight: ''}); }
              );
          $videoOwnerInfoContainer.animate({
            top: 120
          }, 1000);

        });
      } else {
        $template.animate({opacity: 1}, 800, function() {
          var mh = $leftPanel.innerHeight() - $template.outerHeight() - 16;
            $videoThumbnailContainer.css({maxHeight: ''});
            $videoDetails
              .animate({maxHeight: 500, minHeight: mh}, 1000,
                function() { $videoDetails.css({maxHeight: ''}); }
              );
        });
      }

      if ($ichibaPanel.is(':visible')) {
        resetLeftIchibaPanel($ichibaPanel, true);
      }
    }

    var lastIchibaVideoId = 0;
    function resetLeftIchibaPanel($ichibaPanel, force) {
      if (!conf.leftPanelJack) { return; }
      var watchInfoModel = watch.CommonModelInitializer.watchInfoModel;
      var videoId = watchInfoModel.id;
      if (lastIchibaVideoId == videoId && !force) {
        return;
      }
      lastIchibaVideoId = videoId;

      $ichibaPanel.scrollTop(0);
      $ichibaPanel.empty();
      var $inner = $('<div class="ichibaPanelInner" />');
      var $header = $('<div class="ichibaPanelHeader"><p class="logo">ニコニコ市場出張所</p></div>');
      $header.find('.logo').click(function() {
        WatchApp.ns.util.WindowUtil.scrollFitMinimum('#nicoIchiba', 250);
      });
      $ichibaPanel.dblclick(function(e) {
        $ichibaPanel.animate({scrollTop: 0}, 600);
      });
      $inner.append($header);


      var items = [];
      $('#ichibaMain').find('.ichiba_mainitem>div').each(function() {
        var $item = $(this).clone().attr('id', null);
        var $dl = $('<dl class="ichiba_mainitem" />').append($item);
        $item.find('.thumbnail span').css({fontSize: ''});
        // 誤クリックしやすいのでサムネはリンクを外す
        $item.find('.thumbnail a img, .blomagaThumbnail, .blomagaText').parent().attr('href', null).attr('style', null).css({'text-decoration': 'none'});
        $item.find('a').attr('onclick', null);
        items.push($dl);
        $inner.append($dl);
      });
      if (items.length > 0) {
        for (var i = items.length -1; i >= 0; i--) {
          $inner.find('#watch' + i + '_mq').attr('id', null).addClass('ichibaMarquee');
        }
      } else {
        //$inner.append('<div class="noitem">市場に商品がありません</div>');
      }
      $inner.find('.nicoru').remove();

      var $footer = $('<div class="ichibaPanelFooter"></div>');

      var $addIchiba = $('<button class="addIchiba">商品を貼る</button>');
      $addIchiba.click(function() {
        AnchorHoverPopup.hidePopup();
        ichibaSearch();
      });
      $footer.append($addIchiba);

      var $reloadIchiba = $('<button class="reloadIchiba">リロード</button>');
      $reloadIchiba.click(function() {
        resetLeftIchibaPanel($ichibaPanel, true);
      });
      $footer.append($reloadIchiba);

      $inner.append($footer);
      $inner.hide();
      $ichibaPanel.append($inner);
      $inner.fadeIn();
    }

    var hidariue = null;
    function resetHidariue() {
      if (!conf.hidariue) { return; }
      var dt = new Date();
      if (dt.getMonth() < 1 && dt.getDate() <=1) {
        $('#videoMenuTopList').append('<li style="position:absolute;left:300px;font-size:50%">　＼　│　／<br>　　／￣＼　　 ／￣￣￣￣￣￣￣￣￣<br>─（ ﾟ ∀ ﾟ ）＜　しんねんしんねん！<br>　　＼＿／　　 ＼＿＿＿＿＿＿＿＿＿<br>　／　│　＼</li>');
      }
      if (!hidariue) {
        $('#videoMenuTopList').append('<li style="position:absolute;top:21px;left:0px;"><a href="http://userscripts.org/scripts/show/151269" target="_blank" style="color:black;"><img id="hidariue"></a><p id="nicodou" style="padding-left: 4px; display: inline-block"><a href="http://www.nicovideo.jp/video_top" target="_top"><img src="http://res.nimg.jp/img/base/head/logo/q.png" alt="ニコニコ動画:Q"></a></p><a href="http://nico.ms/sm18845030" class="itemEcoLink">…</a></li>');
        hidariue = $('#hidariue')[0];
      }
      hidariue.src = 'http://res.nimg.jp/img/base/head/icon/nico/' +
              (1000 + Math.floor(Math.random() * 1000)).toString().substr(1) + '.gif';
    }


    function loadFavMylists() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>お気に入りマイリスト</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul'),
            $reload = $('<li><button class="reload">リロード</button></li>'),
            $reloadButton = $reload.find('button');
        $toggle.attr('id','favoriteMylistsMenu');
        $a.attr('href', '/my/fav/mylist').click(function(e) {
          if (e.button != 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 1000 )}, 500, function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          });
        });
        $popup.addClass('slideMenu').css('max-height', 0);
        $toggle.append($a);//.append($popup)
        $('#searchResultNavigation').find('ul:first li:first').after($popup).after($toggle);

        load();

        function reload() {
          $reloadButton.unbind('click');
          $ul.hide(300, function() { $ul.empty().show()});
          setTimeout(function() {
            load();
          }, 500);
        }

        function load() {
          FavMylists.load(function(mylists) {
            if (mylists.length < 1) {
              $ul.append($reload);
              return;
            }
            $reloadButton.click(reload);
            for (var i = 0, len = mylists.length; i < len; i++) {
              var mylist = mylists[i], lastVideo = mylist.lastVideo, $li = $('<li/>'),
                title = [
                  '/mylist/', mylist.id, '\n',
                  mylist.description, '\n\n',
                  '最新動画: ', lastVideo.title, '\n',
                  '投稿日時: ', lastVideo.postedAt, '\n',
                ''].join(''),
                $a = $('<a/>')
                .attr({href: '/mylist/' + mylist.id, title: title})
                .text(mylist.name)
                .addClass('favoriteMylist')
                .click(
                  (function(id) {
                    return function(e) {
                      if (e.button != 0 || e.metaKey) return;
                      e.preventDefault();
                      WatchController.showMylist(id);
                    };
                  })(mylist.id)
                );
              $ul.append($li.addClass(mylist.iconType).append($a));
            }
            $ul.append($reload);
            $toggle.fadeIn(500);
          });
        }

      }, 100);
    }



    function loadFavTags() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>お気に入りタグ</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
        $toggle.attr('id', 'favoriteTagsMenu');
        $a.attr('href', '/my/fav/tag').click(function(e) {
          if (e.button != 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 1000 )}, 500, function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          });
        });
        $popup.addClass('slideMenu').css('max-height', 0);
        $toggle.append($a);
        $('#searchResultNavigation').find('ul:first li:first').after($popup).after($toggle);

        FavTags.load(function(tags) {
          if (tags.length < 1) {
            $toggle.remove();
            return;
          }
          var sortOrder = '?sort=' + conf.searchSortType + '&order=' + conf.searchSortOrder;
          for (var i = 0, len = tags.length; i < len; i++) {
            var tag = tags[i], $li = $('<li/>'),
              $a = $('<a/>')
              .attr({href: '/tag/' + encodeURIComponent(tag.name + ' ' + conf.defaultSearchOption) + sortOrder})
              .text(tag.name)
              .addClass('favoriteTag')
              .click(function(e) {
                if (e.button != 0 || e.metaKey) return;
                e.preventDefault();
                WatchController.nicoSearch($(this).text());
              });
            $ul.append($li.append($a));
          }
          $toggle.fadeIn(500);
        });
      }, 100);
    }



    function loadMylistList() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>マイショートカット</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
        $toggle.attr('id', 'mylistListMenu');
        $a.attr('href', '/my/mylist').click(function(e) {
          if (e.button != 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 1000 )}, 500, function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          });
        });
        $popup.addClass('slideMenu').css('max-height', 0);
        $toggle.append($a);
        $('#searchResultNavigation').find('ul:first li:first').after($popup).after($toggle);
//        $('#searchResultNavigation ul:first li:first').after($toggle);

        Mylist.loadMylistList(function(mylistList) {
          $ul.append(
            $('<li/>').append(
              $('<a/>')
                .attr({href: '/my/mylist'})
                .text('とりあえずマイリスト')
                .addClass('mylistList')
                .addClass('defMylist')
                .click(function(e) {
                  if (e.button != 0 || e.metaKey) return;
                  e.preventDefault();
                  WatchController.showDefMylist();
              })
            )
          );
          var items = [
            {id:  -1, href: '/my/history',      title: '視聴履歴'},
            {id:  -2, href: '/recommendations', title: 'あなたにオススメの動画'},
            {id: NicorepoVideo.REPO_ALL,    href: '/my/top/all',    title: '【ニコレポ】すべての動画'},
            {id: NicorepoVideo.REPO_USER,   href: '/my/top/user',   title: '【ニコレポ】お気に入りユーザー'},
            {id: NicorepoVideo.REPO_CHCOM,  href: '/my/top/chcom',  title: '【ニコレポ】チャンネル&コミュニティ'},
            {id: NicorepoVideo.REPO_MYLIST, href: '/my/top/mylist', title: '【ニコレポ】お気に入りマイリスト'}
          ];
          function createItemDom(item) {
            return  $('<li/>').append(
              $('<a/>')
                .attr({href: item.href})
                .text(item.title)
                .addClass('mylistList')
                .addClass('defMylist')
                .click(function(e) {
                  if (e.button != 0 || e.metaKey) return;
                  e.preventDefault();
                  WatchController.showMylist(item.id);
                })
            );
          }
          for (var v in items) {
            $ul.append(createItemDom(items[v]));
          }
          for (var i = 0, len = mylistList.length; i < len; i++) {
            var mylist = mylistList[i], $li = $('<li/>'),
              $a = $('<a/>')
              .attr({href: '/my/mylist/#/' + mylist.id})
              .text(mylist.name)
              .addClass('mylistList')
              .click(
                (function(id) {
                  return function(e) {
                    if (e.button != 0 || e.metaKey) return;
                    e.preventDefault();
                    WatchController.showMylist(id);
                  };
                })(mylist.id)
              );
            $ul.append($li.append($a));
          }
          $toggle.fadeIn(500);
        });
      }, 100);
    }

    function loadVideoRanking() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>動画ランキング</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
        $toggle.attr('id', 'videoRankingMenu');
        $a.attr('href', '/ranking').click(function(e) {
          if (e.button != 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 1000 )}, 500, function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          });
        });
        $popup.addClass('slideMenu').css('max-height', 0);
        $toggle.append($a);
        $('#searchResultNavigation').find('ul:first li:first').after($popup).after($toggle);

        var genreId = VideoRanking.getGenreId();

        // TODO: マジックナンバーを
        $ul.append(createMenu($, 'all',  -100, 'カテゴリ合算(毎時)',   'all', 'hourly'));
        $ul.append(createMenu($, 'all', -1100, 'カテゴリ合算(24時間)', 'all', 'daily'));
        $ul.append(createMenu($, 'all', -4100, 'カテゴリ合算(合計)',   'all', 'total'));

        for (var genre in genreId) {
          if (genre === 'all') { continue;}
          var
            id = genreId[genre], name = VideoRanking.getGenreName(genre), category = VideoRanking.getCategory(id);
            $ul.append(createMenu($, genre, id, name, category, 'hourly'));
        }
        $toggle.show();

        function createMenu($, genre, id, name, category, term) {
          var $a =
            $('<a/>')
              .attr({href: '/ranking/fav/' + term + '/' + genre})
              .text(name)
              .addClass('videoRanking')
              .addClass(genre)
              .click(function(e) {
                if (e.button != 0 || e.metaKey) return;
                e.preventDefault();
                WatchController.showMylist(id);
              });
          return $('<li/>').addClass(category).append($a)
       }
      }, 100);
    }


    var isMylistHacked = false;
    function mylistHackInit() {
      if (isMylistHacked) { return; }
      var currentMylistId = 0;

      watch.ComponentInitializer.videoSelection._show_org =
        watch.ComponentInitializer.videoSelection._show;
      watch.ComponentInitializer.videoSelection._show = function(a, b) {
        currentMylistId = 0;
        $('#resultContainer').removeClass('dummyMylist').removeClass('mylist').removeClass('isMine');
        watch.ComponentInitializer.videoSelection._show_org(a, b);
      }

      watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader.load_org =
        watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader.load;
      watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader.load = function (p, onload, onerror) {
        var self = watch.ComponentInitializer.videoSelection.loaderAgent.mylistVideoLoader;
        currentMylistId = p.id;
        if (p.id >= 0) {
          $('#resultContainer').removeClass('dummyMylist').addClass('mylist').toggleClass('isMine', Mylist.isMine(p.id));
          self.load_org(p, onload, onerror);
        } else {
          // マイリストIDに負の数字(通常ないはず)が来たら乗っ取るサイン
            $('#resultContainer').addClass('dummyMylist').removeClass('mylist').removeClass('isMine');
            setTimeout(function() {
              try {
                // TODO: マジックナンバーを
                if (p.id ==  -1) {
                  VideoWatchHistory.load(onload, p);
                } else
                if (p.id ==  -2) {
                  VideoRecommendations.load(onload, p);
                } else
                if (p.id == NicorepoVideo.REPO_ALL) {
                  NicorepoVideo.loadAll(onload, p);
                } else
                if (p.id == NicorepoVideo.REPO_USER) {
                  NicorepoVideo.loadUser(onload, p);
                } else
                if (p.id == NicorepoVideo.REPO_CHCOM) {
                  NicorepoVideo.loadChCom(onload, p);
                } else
                if (p.id == NicorepoVideo.REPO_MYLIST) {
                  NicorepoVideo.loadMylist(onload, p);
                } else
                if (typeof VideoRanking.getGenreName(p.id) === 'string') {
                  VideoRanking.load(onload, p);
                }
              } catch(e) {
                if (e.message && e.status) {
                  onerror(e);
                } else {
                  conf.debugMode && console.log(e);
                  onerror({message: 'エラーが発生しました', status: 'fail'});
                }
              }
            }, 0);
        }
      };

      var menu =
        '<div class="thumbnailHoverMenu">' +
        '<button class="showLargeThumbnail" onclick="WatchItLater.onShowLargeThumbnailClick(this);" title="大きいサムネイルを表示">＋</button>' +
        '<button class="deleteFromMyMylist" onclick="WatchItLater.onDeleteFromMyMylistClick(this);">マイリスト外す</button>' +
        '</div>';

      watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.$videoContentTemplate.find('.videoItem .columnVertical   .thumbContainer').append(
        menu
      );
      watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.$videoContentTemplate.find('.videoItem .columnHorizontal .balloon').before(
        menu
      );

      function onDeleteFromMyMylistClick(elm) {
        var
          $videoItem = $(elm).parent().parent(),
          watchId    = $videoItem.find('.itemLink').attr('href').split('/').reverse()[0];
        if (currentMylistId <= 0 || !Mylist.isMine(currentMylistId)) {
          return;
        }
        setTimeout(function() {
          try {
            Mylist.deleteMylistItem(watchId, currentMylistId, function(status, result) {
              if (status != "ok") {
                Popup.alert('削除に失敗: ' + result.error.description);
              } else {
                $videoItem.parent().animate({opacity: 0.3}, 500);
              }
            });
          } catch (e) {
            if (e.message) { Popup.alert(e.message); }
            else {
              conf.debugMode && console.log(e);
              throw e;
            }
          }
        }, 0);
      }

      function onShowLargeThumbnailClick(elm) {
        var
          $videoItem = $(elm).parent().parent(),
          src        = $videoItem.find('.itemThumbnail').attr('src');
        conf.debug && console.log(src);
        if (!src) {
          return;
        }
        showLargeThumbnail(src);
      }

      w.WatchItLater.onDeleteFromMyMylistClick = onDeleteFromMyMylistClick;
      w.WatchItLater.onShowLargeThumbnailClick = onShowLargeThumbnailClick;

      isMylistHacked = true;

    }

    function showLargeThumbnail(baseUrl) {
      var
        baseUrl,
        html = [
          '<div onmousedown="if (event.button == 0) { $(\'#popupMarquee\').hide(); event.preventDefault(); }" style="background:#000;">',
          '<img src="', baseUrl, '.L" style="width: 360px; height: 270px; position: absolute; display: none; z-index: 3;" onload="this.style.display = \'\';">',
          '<img src="', baseUrl, '"   style="width: 360px; height: 270px; z-index: 2;">',
          '</div>',
        ''].join('');
      Popup.show(html);
    }


    function onVideoStopped() {
    }

    function onVideoEnded() {
      AnchorHoverPopup.hidePopup().updateNow();
      // 原宿までと同じように、動画終了時にフルスクリーンを解除したい
      if (conf.autoNotFull) {
        WatchController.changeScreenMode('notFull');
      }

      return;
    }

    var videoSelectOpenCount = 0;
    function onVideoSelectPanelOpened() {
      if (videoSelectOpenCount++ == 0) {
       loadVideoRanking();
        if (conf.enableFavTags) {
          loadFavTags();
        }
        if (conf.enableFavMylists) {
          loadFavMylists();
        }
       loadMylistList();
      }
       adjustSmallVideoSize();
       if (conf.videoExplorerHack) {
        setTimeout(function() {
          watch.PlayerInitializer.nicoPlayerConnector.updatePlayerConfig({playerViewSize: ''})
        }, 100);
       }

      isSearchOpen = true;
      AnchorHoverPopup.hidePopup().updateNow();
    }

    function onVideoSelectPanelOpening() {
      isSearchOpen = true;
      $('body').addClass('w_searchOpen');
    }

    function onVideoSelectPanelClosed() {
      isSearchOpen = false;
      AnchorHoverPopup.hidePopup().updateNow();
      $('body').removeClass('w_searchOpen');
    }

    /**
     *  検索中の動画サイズを無理矢理でっかくするよ。かなり重いし不安定かも
     *
     */
    var $smallVideoStyle = undefined, lastAvailableWidth = 0, lastBottomHeight = 0;
    function adjustSmallVideoSize() {
      if (!conf.videoExplorerHack || !$('body').hasClass('videoSelection')) { return; }

      $('#leftVideoInfo').find('.videoDetails').attr('style', '');
      $('#searchResultExplorer, #content').addClass('w_adjusted');
      var
        rightAreaWidth = $('#resultContainer').outerWidth(),
        availableWidth = $(window).innerWidth() - rightAreaWidth,
        commentInputHeight = $('#playerContainer').hasClass('oldTypeCommentInput') ? 46 : 0, controlPanelHeight = $('#playerContainer').hasClass('controll_panel') ? 46 : 0;
      if (availableWidth <= 0) { return; }
      //var flashVars = watch.PlayerInitializer.playerInitializeModel.flashVars, isWide = flashVars.isWide === "1"; // 4:3対応しても額縁になるだけだった
      var
        defPlayerWidth = 300,
        defPlayerHeight = defPlayerWidth/16*9/*isWide ? defPlayerWidth/16*9 : defPlayerWidth/4*3 /* 144 */,
        ratio = availableWidth / defPlayerWidth , availableHeight = defPlayerHeight * ratio + commentInputHeight + controlPanelHeight,
        xdiff = (availableWidth - defPlayerWidth - 20), windowHeight = $(window).innerHeight(),
        bottomHeight = windowHeight - availableHeight - (WatchController.isFixedHeader() ? $('#siteHeader').outerHeight() : 0);
      if (ratio < 1) { return; }

      if (availableWidth <= 0 || bottomHeight <= 0 || (lastAvailableWidth === availableWidth && lastBottomHeight === bottomHeight)) { return; }

      lastAvailableWidth = availableWidth;
      lastBottomHeight   = bottomHeight;
      if ($smallVideoStyle) {
        $smallVideoStyle.remove();
      }
      // コメントパネル召喚
      var commentPanelWidth = $('#playerCommentPanelOuter').outerWidth();

      var css = ['<style type="text/css" id="explorerHack">',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerContainerWrapper, \n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerContainerSlideArea, \n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerContainer, \n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #nicoplayerContainer ,\n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #external_nicoplayer \n',
        '{',
          'width: ', availableWidth, 'px !important; height: ', availableHeight, 'px !important;padding: 0; margin: 0; ',
        '}\n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #searchResultExplorerContentWrapper { ',
          'margin-top: ',  availableHeight, 'px !important; left: ', xdiff, 'px; ',
          'max-height: ', bottomHeight + 'px; overflow-y: auto; overflow-x: hidden; height: auto;',
        '}\n',
        'body.size_small.no_setting_panel.videoSelection #searchResultExplorer.w_adjusted #resultContainerWrapper             { margin-left: ', availableWidth,  'px !important; }\n',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playlist { padding-left: ', xdiff, 'px; }\n',
        'body.size_small.no_setting_panel.videoSelection #searchResultExplorer.w_adjusted { min-height: ', (windowHeight + 200) ,'px !important; }\n',

        // かなり 無理矢理 左パネルを 召喚するよ 不安定に なっても 知らない
        // 破滅！
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #leftPanel {',
          ' display: block; top: ', availableHeight, 'px !important; max-height: ', bottomHeight, 'px !important; width: ', (xdiff - 4), 'px !important; left: 0;',
          ' height:', (Math.min(bottomHeight, 600) - 2) , 'px !important;',
        '}',
          'body.size_small.content-fix.no_setting_panel.videoSelection #content.w_adjusted #leftPanel {',
          '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted .videoDetails, ',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #searchResultNavigation {',
          // タグ領域三行分 スクロール位置をタグの場所にしてる時でも末端までスクロールできるようにするための細工
          // (四行以上あるときは表示しきれないが)
          'padding-bottom: 72px; ',
        '}',
          'body.size_small.content-fix.no_setting_panel.videoSelection #content.w_adjusted .videoDetails, ',
          'body.size_small.content-fix.no_setting_panel.videoSelection #content.w_adjusted #searchResultNavigation {',
            'padding-bottom: 0; ',
          '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted .leftVideoInfo, body.size_small.no_setting_panel.videoSelection #content.w_adjusted .leftIchibaPanel {',
          'width: ', (xdiff - 4), 'px !important;',
        '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted .nicommendContentsOuter {',
          'width: ', (xdiff - 18), 'px !important;',
        '}',
        // かなり 無理矢理 コメントパネルを 召喚するよ 不安定に なっても 知らない
        // 破滅！
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #nicoplayerContainer {',
          'z-index: 100;',
        '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerCommentPanelOuter {',
          'right: -16px !important; top: 0px !important; height: 50px !important; background: #dfdfdf; border: 2px outset; border-radius: 4px;',
          'z-index: 99;',
          'transition: right 0.3s ease-out, height 0.3s ease-out;  -webkit-transition: right 0.3s ease-out, height 0.3s ease-out;',
        '}',
          'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerCommentPanelOuter:hover {',
            'right: -',(commentPanelWidth), 'px !important; top: 0 !important; height: ', availableHeight, 'px !important; background: transparent; border: 0;',
          '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerCommentPanelOuter #playerCommentPanel {',
          'display: none;',
        '}',
          'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerCommentPanelOuter:hover #playerCommentPanel {',
            'height: ', (availableHeight - 20 /* padding+borderの10x2pxを引く */), 'px !important; ',
            'display: block; background: #dfdfdf; border: 2px outset;',
          '}',
        'body.size_small.no_setting_panel.videoSelection #content.w_adjusted #playerCommentPanelOuter #playerCommentPanel .panelClickHandler{',
          'display: none !important;',
        '}',
      '</style>'].join('');
      // コメントパネルが白いままになるバグを対策
      var $cp = $('#playerCommentPanelOuter');
      $cp.unbind('mouseenter', refreshCommentPanelHeight);
      $cp.bind(  'mouseenter', refreshCommentPanelHeight);

      $smallVideoStyle = $(css);
      $('head').append($smallVideoStyle);
    }

    var refreshCommentPanelTimer = null;
    function refreshCommentPanelHeight() {
      if (!$('body').hasClass('videoSelection')) {
        return;
      }
      if (refreshCommentPanelTimer != null) {
        clearTimeout(refreshCommentPanelTimer);
      }
      refreshCommentPanelTimer =
        setTimeout(function() {
          watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
        }, 500);
    }


    function onWatchInfoReset(watchInfo) {
      $('body').toggleClass('w_channel', watchInfo.isChannelVideo());
      setVideoCounter(watchInfo);
    }

    function onScreenModeChange(sc) {
      $('body').toggleClass('w_notFull', sc.mode != 'browserFull');
      $('body').toggleClass('w_small',   sc.mode == 'small');
      if (conf.hideNewsInFull) { $('body').addClass('hideNewsInFull'); }
      setTimeout(function() {
        AnchorHoverPopup.hidePopup();
//        $('#content').css({zIndex: 2});
        $('body').toggleClass('w_setting',   $('#playerSettingPanel').is(':visible'));

        // フル画面時プレイリストを閉じる
        if (conf.autoClosePlaylistInFull &&
          $('#content').find('.browserFullPlaylistClose').is(':visible')) {
          $('#content').find('.browserFullPlaylistClose').click();
        }
        if (sc.mode == 'small' && $('body').hasClass('videoSelection')) {
          //WatchApp.ns.util.WindowUtil.scrollFit('#playerContainerWrapper', 300);
          onVideoSelectPanelOpened();
        }

        if (sc.mode == 'browserFull') {
        } else {
        }
      }, 500);
    }




    var $videoHeaderTagEditLinkArea = null, $toggleTagEditText = null, baseTagHeight = 0;
    function onTagReset() {

      // タグが2行以下だったら自動的に狭くする処理
      if (conf.enableAutoTagContainerHeight) {
        if (baseTagHeight === 0) { baseTagHeight = watch.TagInitializer.tagViewController.defaultHeightInNormal;}
        var h = Math.min(baseTagHeight, $('#videoTagContainer').find('.tagInner').innerHeight());

        if (watch.TagInitializer.tagViewController.defaultHeightInNormal != h) {
          var $toggle = $('#videoTagContainer').find('.toggleTagEdit');
          watch.TagInitializer.tagViewController.defaultHeightInNormal = h;
          $toggle.removeClass('oneLine').removeClass('twoLines');

          if (h < 36) { // 1行以下の時
            if (!$videoHeaderTagEditLinkArea) {
              $videoHeaderTagEditLinkArea = $('.toggleTagEditInner .videoHeaderTagEditLinkArea');
              $('.toggleTagEdit').append($videoHeaderTagEditLinkArea);
              $toggleTagEditText = $('<span class="toggleText">' + $('.toggleTagEditInner').text() + '</span>');
              $('.toggleTagEditInner').empty().append($toggleTagEditText).append($videoHeaderTagEditLinkArea);
            }
            $toggle.addClass('oneLine');
          } else {
            if (h <= 60) { // 2行以下の時
              $toggle.addClass('twoLines');
            }
          }
          watch.TagInitializer.tagViewController.fitTagAreaAndVideoHeader();
        }
      }
    }


    function initIframe() {
      iframe.id = "mylyst_add_frame";
      iframe.className += " fixed";
      $(iframe).css({position: 'fixed', right: 0, bottom: 0});
      w.document.body.appendChild(iframe);
      iframe.hide(); // ページの初期化が終わるまでは表示しない
    }

    function initSidePanel() {
      if (conf.wideCommentPanel) {
//      完全に横スクロール不要にしたい場合はこっち
//        var tarinaiWidth = $('#commentDefault .commentTableContainer').innerWidth() - $('#commentDefault .commentTableContainerInner').outerWidth();
//      WatchController.changeCommentPanelWidth(tarinaiWidth - 10);
        WatchController.changeCommentPanelWidth(420);
        $rightPanel.css('right', 2000);
      }

    }

    function initPager() {

      $("#resultPagination, #searchResultSortOptions, #searchResultNavigation").mousedown(function() {
        AnchorHoverPopup.hidePopup();
      });

    }

    function initEvents() {
      pac.addEventListener("onVideoInitialized", watchVideoId);
      pac.addEventListener("onVideoInitialized", onVideoInitialized);
      pac.addEventListener("onVideoEnded", onVideoEnded);
      pac.addEventListener("onVideoStopped", onVideoStopped);
      pac.addEventListener('onVideoChangeStatusUpdated', onVideoChangeStatusUpdated);
      // pac.addEventListener('onSystemMessageFatalErrorSended', onSystemMessageFatalErrorSended);
      // watch.WatchInitializer.watchModel.addEventListener('error', function() {console.log(arguments);});


      watch.CommonModelInitializer.watchInfoModel.addEventListener('reset', onWatchInfoReset);
      watch.PlayerInitializer.playerScreenMode.addEventListener('change', onScreenModeChange);

      vs.addEventListener("videoSelectPanelOpeningEvent", onVideoSelectPanelOpening);
      vs.addEventListener("videoSelectPanelClosedEvent", onVideoSelectPanelClosed);
      vs.panelOPC.addEventListener("videoSelectPanelOpenedEvent", onVideoSelectPanelOpened);

      // メモ
      // とりあえずマイリストのオープン
      function updatePopup() {
        AnchorHoverPopup.hidePopup().updateNow();
      }
      var cvc = watch.ComponentInitializer.videoSelection.contentsAreaVC;
      cvc.addEventListener('deflistFolderClickedEvent', function(){
        watch.ComponentInitializer.videoSelection.loaderAgent.deflistVideoLoader._cache.deleteElement({}); // キャッシュクリア
        updatePopup();
      });
      cvc.addEventListener('uploadedFolderClickedEvent', updatePopup);
      cvc.addEventListener('mylistFolderClickedEvent'  , updatePopup);
      cvc.addEventListener('paginationClickedEvent'    , updatePopup);

      watch.TagInitializer.tagList.addEventListener('reset', onTagReset);

      $('body').dblclick(function(e){
        var tagName = e.target.tagName, cls = e.target.className || '';
        if (tagName === 'SELECT' || tagName === 'INPUT' ||  tagName === 'BUTTON' || cls.match(/mylistPopupPanel/)) {
          return;
        }
        AnchorHoverPopup.hidePopup();
        if (conf.doubleClickScroll) {
          WatchController.scrollToVideoPlayer(true);
        }
      });

      $(window).resize(onWindowResize);

      Mylist.onDefMylistUpdate(function() {
        WatchController.clearDeflistCache();
      });
      Mylist.onMylistUpdate(function(info) {
        WatchController.clearMylistCache(info.groupId);
      });

    }

    function initAdditionalButtons() {
      var $div = $('<div></div>');

      $div.addClass('bottomAccessContainer');
      var $playlistToggle = $('<button alt="プレイリスト表示/非表示">playlist</button>');
      $playlistToggle.addClass('playlistToggle');

      $('#playlist').toggleClass('w_show', !conf.hidePlaylist);
      $playlistToggle.toggleClass('w_show', $('#playlist').hasClass('w_show'));
      $playlistToggle.click(function() {
        $('#playlist').toggleClass('w_show');
        conf.setValue('hidePlaylist', !$('#playlist').hasClass('w_show'));
        $playlistToggle.toggleClass('w_show', $('#playlist').hasClass('w_show'));
        AnchorHoverPopup.hidePopup();
      });
      $div.append($playlistToggle);
      $('#playerContainerWrapper').append($div);


      $('.searchText input:first').keydown(function(e){
        if (e.which == 38 || e.which == 40) { toggleSearchType(':first'); }
      });
//      $('.searchText input:last').keydown(function(e){
//        if (e.which == 38 || e.which == 40) { toggleSearchType(':last'); }
//      });

      var $conf = $('<button alt="WatchItLaterの設定">config</button>');
      $conf.addClass('openConfButton');
      $conf.click(function() {
        AnchorHoverPopup.hidePopup();
        ConfigPanel.toggle();
      });
      $('#playerContainerWrapper').append($conf);
    }

    function toggleSearchType(suffix) {
      if ($('.searchText a' + suffix).hasClass('searchKeywordIcon')) {
        $('.searchTag a' + suffix).click();
      } else {
        $('.searchKeyword a ' + suffix).click();
      }
      $('.searchOption').hide();
    }

    function initSearchOption() {
      var sort = conf.searchSortType || 'n', order = conf.searchSortOrder || 'd';
      $('#searchResultSortOptions').find('select').change(function() {
        var v = $(this).val().split('&');
        sort  = v[0].split('=')[1];
        order = v[1].split('=')[1];
        conf.setValue('searchSortType',  sort);
        conf.setValue('searchSortOrder', order);
      });
      var org = watch.ComponentInitializer.videoSelection.stateHistory["MenuType.search"];
      org.reset = function () {
        org._searchWord = "";
        org._searchType = undefined;
        org._sortType   = sort;
        org._orderType  = order;
        org._pageIndex  = 1;
        return org;
      };
      org.update_org = org.update;
      org.update = function(p) {
        if (typeof p.sortType  !== 'string') { p.sortType  = sort; }
        if (typeof p.orderType !== 'string') { p.orderType = order; }
        org.update_org(p);
      };
    }

    var isSquareCssInitialized = false;
    function initSquareThumbnail() {
      var isSquare = !!conf.squareThumbnail;
      if (isSquare && !isSquareCssInitialized) {
        var squareCss = [
          'body.videoSelection #resultlist.squareThumbnail li.gold   .videoItem .thumbContainer{',
            'background: #e9d7b4;',
          '}',
          'body.videoSelection #resultlist.squareThumbnail li.silver .videoItem .thumbContainer{',
            'background: #cecece;',
          '}',
          'body.videoSelection #resultlist.squareThumbnail .videoItem .thumbContainer {',
            'width: 130px; height: 100px;',
          '}',
          'body.videoSelection #resultlist.squareThumbnail .videoItem .thumbContainer .itemLink {',
            'width: 130px; height: 100px;',
          '}',
          'body.videoSelection #resultlist.squareThumbnail .videoItem .thumbContainer img {',
            'max-width: 130px; top: 0; left: 0;',
          '}',
          'body.videoSelection #resultlist.squareThumbnail .videoItem .thumbContainer img.playingIcon {',
            'top: 50%; left: 50%;',
          '}',
          'body.videoSelection #searchResultExplorer #resultContainer #resultlist.squareThumbnail .videoItem .columnHorizontal .thumbnailHoverMenu {',
            'bottom: 47px;',
          '}',
        ''].join('\n');
        addStyle(squareCss, 'squareCss');
        isSquareCssInitialized = true;
      }
      WatchApp.$('#resultlist').toggleClass('squareThumbnail', isSquare);
    }

    function initOther() {
      if (conf.leftPanelJack) {
        var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
      }

      $('#siteHeaderInner').width(
        $('#siteHeaderInner').width() + 200
      );

      initAdditionalButtons();
      initSquareThumbnail();


      $('.showVideoInfoButton').click(function() { // 「動画情報をもっと見る」クリック時
        WatchController.closeSearch();
      });

      $('#playlistContainer').find('a').click(function() {
        AnchorHoverPopup.hidePopup();
      });
      if (conf.enableNewsHistory) {NicoNews.initialize(w);}

      if (conf.defaultSearchOption && conf.defaultSearchOption != '') {
        var vs = watch.ComponentInitializer.videoSelection;
        vs._searchVideo_org = vs._searchVideo;
        vs._searchVideo = function(word, type, callback) {
          AnchorHoverPopup.hidePopup();
          if (word.indexOf(conf.defaultSearchOption) < 0 && !word.match(/(sm|nm|so)\d+/)) {
            word += " " + conf.defaultSearchOption;
          }
          vs._searchVideo_org(word, type, callback);
        }
      }

      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        //console.log('conf changed', name, newValue, oldValue);
        if (name === 'squareThumbnail') {
          initSquareThumbnail();
        } else
        if (name === 'enableAutoTagContainerHeight') {
          if (newValue) { watch.TagInitializer.tagViewController.setIsPinned(true); }
        } else
        if (name === 'enableMylistDeleteButton') {
          $('#resultContainer').toggleClass('enableMylistDeleteButton', newValue);
        }
      });

      $('#resultContainer').toggleClass('enableMylistDeleteButton', conf.enableMylistDeleteButton);


      WatchJsApi.nicos.addEventListener('nicoSJump', function(e) {
        if (conf.ignoreJumpCommand) {
          e.cancel();
          Popup.show('「@ジャンプ」コマンドをキャンセルしました');
        }
      });

      onWatchInfoReset(watch.CommonModelInitializer.watchInfoModel);


      $('.randomPlayback').dblclick(function(e) {
        if (e.shiftKey) {
          WatchController.shufflePlaylist();
        }
      });

      mylistHackInit();

    }


    function hideAds() {
      $('#content').removeClass('panel_ads_shown');
      $('playerBottomAd').hide();
    }

    try
    {
      initIframe();
      initSidePanel();
      initEvents();
      initPager();
      initSearchOption();
      initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
      initOther();

      onWindowResize();
      setTimeout(function() {
        if (conf.videoExplorerHack) {
          $('#searchResultExplorer, #content, #footer').addClass('w_adjusted');
          $('#nicommendPanelCreateOpen').mousedown(function() {
            if ($('body').hasClass('videoSelection')) { // ガックガックするけど動かないよりはマシ
              WatchController.closeSearch();
              setTimeout(function() {
                WatchApp.ns.util.WindowUtil.scrollFit('#nicommendCreateStart', 200);
              }, 1000);
            }
          });
        }

      }, 3000);

    } catch(e) {
      conf.debugMode && console.log(e);
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


  /**
   *  キーボードイベント他
   *
   */
  (function() {
    w.document.body.addEventListener('keydown', function(e) {
      if (e.keyCode === 27 || e.keyCode === 88) { // ESC or x
        AnchorHoverPopup.hidePopup();
        Popup.hide();
      }
    });
    w.document.body.addEventListener('click', function(e) {
      var tagName = e.target.tagName, className = e.target.className;
      //console.log(tagName, className);
      if (tagName !== 'BUTTON' && tagName !== 'SELECT' && tagName !== 'OPTION' && className !== 'popupTagItem' && className.indexOf('mylistPopupPanel') < 0) {
        AnchorHoverPopup.hidePopup();
      } else {
      }
    });

//    w.document.body.addEventListener('dblclick', function(e) {var tagName = e.target.tagName, className = e.target.className;console.log(tagName, className);});

  })(w);

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

