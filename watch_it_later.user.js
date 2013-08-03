// ==UserScript==
// @name           WatchItLater
// @namespace      https://github.com/segabito/
// @description    動画を見る前にマイリストに登録したいGreasemonkey (Chrome/Fx用)
// @include        http://www.nicovideo.jp/*
// @include        http://ch.nicovideo.jp/*
// @include        http://ext.nicovideo.jp/thumb/*
// @exclude        http://ads*.nicovideo.jp/*
// @exclude        http://live*.nicovideo.jp/*
// @exclude        http://dic.nicovideo.jp/*
// @exclude        http://www.upload.nicovideo.jp/*
// @exclude        http://upload.nicovideo.jp/*
// @exclude        http://ch.nicovideo.jp/tool/*
// @match          http://www.nicovideo.jp/*
// @match          http://ch.nicovideo.jp/*
// @match          http://*.nicovideo.jp/*
// @match          http://ext.nicovideo.jp/*
// @match          http://search.nicovideo.jp/*
// @grant          GM_xmlhttpRequest
// @version        1.130804
// ==/UserScript==

/**
 * 7/25のバージョンアップに対応できていない所
 *
 * ・まだ細かい動作が不安定な感じ  なんかしっくりこない
 * ・コメントパネルを広くする(廃止するかも)
 * ・フラットになったデザインに合わせる
 *
 * やりたい事・アイデア
 * ・左パネル消滅で不要になったコードをいろいろ整理する
 * ・検索画面にコミュニティ動画一覧を表示 (チャンネルより難しい。力技でなんとかする)
 * ・シークバーのサムネイルを並べて表示するやつ   (単体スクリプトのほうがよさそう)
 * ・キーワード検索/タグ検索履歴の改修
 * ・検索画面のメニューにある簡易入力欄をもっと賢くする
 * ・検索画面でのコメントパネル表示をもっと賢くする
 * ・ユーザーの投稿動画一覧に「xxさんのニコレポ」という架空のマイリストフォルダを出す
 * ・動画ランキングを「ニコニコ動画さん」という架空ユーザーの公開マイリストにする
 * ・「ニコニコチャンネルさん」という架空ユーザーを作って各ジャンルの新着を架空マイリストにする
 * ・横スクロールを賢くする
 * ・マイリスト外すUIととりまい外すUIが統一されてないのをどうにかする
 * ・お気に入りユーザーの時は「@ジャンプ」許可
 * ・軽量化
 * ・綺麗なコード
 */

// * ver 1.130804
// - 検索画面のメニューの所にある入力欄を少しだけ賢く&サジェスト対応


// * ver 1.130803
// - 動画終了時に自動でニコメンドを開かない・または中身がある時だけ開くようにする設定を追加

// * ver 1.130801
// - タグ・キーワード検索にniconico新検索βを組み込んでみた

// * ver 1.130731
// - 関連タグの取得はもっといいAPIがあった
// - ニコニコ新検索を使うようにするための布石

// * ver 1.130730
// - キーワード/タグ検索時結果に関連タグが出るようにしてみた(リアルタイムの表示はできない)
// - ニコニコ新検索を使うようにするための布石

// * ver 1.130729
// - プレイリスト消えないモードの挙動改善

// * ver 1.130728
// - プレイリストメニューが一部機能しなくなっていたのを対応
// - ニコレポなどが出るポップアップをいじった。クリックですぐ消えるように ＆ Firefoxでもプレイヤーの上に表示できるように(まだデフォルトではオフ)
// - ニコメンドが空かどうかクリックするまでもなくわかるよう、グレーにする
// - タグ表示のポップアップからniconico新検索(http://search.nicovideo.jp/)に飛べるようにした

// * ver 1.130727
// - ダミーマイリスト系のソートがおかしい問題を解決
// - マイリスト・とりあえずマイリストを100件ずつ表示にしてみた
// - 検索画面から「次に再生」した時に動画時間が入るようにした

// * ver 1.130726
// - 本家の更新に暫定対応。まだ不安定だったり動かない機能もあります。
// - チャンネルのアイコンをクリックしたらチャンネル動画一覧を表示。ただし最新20件のみ

// * ver 1.130720
// - 画面右上の検索フォームに accesskey="@" をつけてみた

// * ver 1.130716
// - 本家側のプレイリストの仕様変更で発生した細かい不具合を修正
// - 右下のマイリスト選択メニューにaccesskey=":"を追加

// * ver 1.130709
// - プレイリストの内部仕様変更に対応

// * ver 1.130708
// - コメントの盛り上がり状態をグラフ表示する機能を追加

// * ver 1.130704
// - 設定パネルが長くなったので折りたたむようにした

// * ver 1.130701
// - フルスクリーンメニューを改良。タグも出るようにした

// * ver 1.130630
// - フルスクリーン時にホイールを回すとメニュー・コメントパネルを出せるようにした

// * ver 1.130624
// - フルスクリーン時はプレイリストのどこでもホイールで回せるようにした

// * ver 1.130621
// - 全画面表示時に右下のマイリストメニューを消すor目立たなくする設定を追加

// * ver 1.130620
// - ハードウェアアクセラレーションへの対応 (ショートカットキー等)
// - 一部エフェクトをCSS3アニメーションに移行して軽量化

// * ver 1.130611
// - 投稿者のニコレポから投稿者の動画一覧に遷移できるようにした

// * ver 1.130609
// - 細かな不具合修正

// * ver 1.130606
// - 動画ヘッダにもコメント数・再生数・マイリスト数増減表示

// * ver 1.130604
// - リンクに触れてからメニューが出るまでの時間(秒)の設定を追加

// * ver 1.130603
// - コメント数・再生数・マイリスト数がリアルタイム更新をわかりやすく

// * ver 1.130603
// - コメント数・再生数・マイリスト数がリアルタイム更新されるようにした
// - レイアウトの微調整

// * ver 1.130529
// - 海外版でレイアウトが崩れるのを修正

// * ver 1.130528
// - 右パネルに動画情報・市場・レビューを表示する設定を追加(実験中)
// - 省スペースモード時、動画タイトルの無駄なスペースをより省けるように調整

// * ver 1.130527
// - プレイヤー下の要素をまとめて消す設定を追加
// - プレイリストの内部仕様変更に対応

// * ver 1.130518
// - 「@ジャンプ」によるシークの無効化または回数制限を追加。無限ループ動画の回数を制限できます

// * ver 1.130511
// - ニコレポにもマイリストコメントが出るようにした
// - 投稿者アイコンをクリックした時は、その投稿者のニコレポが出るようにした

// * ver 1.130504
// - 検索画面の動画ランキングのソートを変更できるようにした。 ランキングの新作動画を探すのに便利
// - ch.nicovideo.jpでもマイリスト登録できるように修正＆調整 (Chromeは制限あり)

// * ver 1.130429
// - 関連動画(オススメ)を開くショートカットキー追加 (「あなたにオススメの動画」とは違います)
// - プレイリストのヘッダ部分をダブルクリックすると、現在の動画の位置にスクロールするようにした
// - プレイリストのドラッグ中またはプレイリストの左右ボタン上でホイールを回すと左右移動できるようにした

// * ver 1.130409
// - 省スペースモードの調整

// * ver 1.130409
// - ショートカットキー「コメントの背面表示ON/OFF」
// - 省スペースモード時に市場が崩れる事があるのを修正


// * ver 1.130406
// - 小さいモニターむけの調整

// * ver 1.130404
// - 省スペースモードの微調整

// * ver 1.130403
// - 「省スペース化の設定」項目を追加。 原宿ぐらいの密度になります。
// - 設定ボタン・プレイリスト開閉ボタンの位置変更
// -


(function() {
  var isNativeGM = true;
  var monkey =
  (function(isNativeGM){
    var w;
    try { w = unsafeWindow || window; } catch (e) { w = window;}
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
      wideCommentPanel: false, // コメントパネルをワイドにする
      removeLeftPanel: true, // 左パネルを消滅させる
      leftPanelJack: false, // 左パネルに動画情報を表示
      rightPanelJack: true, // 右パネルに動画情報を表示
      headerViewCounter: false, // ヘッダに再生数コメント数を表示
      popupViewCounter: 'full', // 動画切り替わり時にポップアップで再生数を表示
      ignoreJumpCommand: false, // @ジャンプ無効化
      nicoSSeekCount: -1, // @ジャンプによるシーク(ループなど)を許可する回数 -1=無限 0以上はその回数だけ許可
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
      enableYukkuriPlayButton: false, // スロー再生ボタンを表示する
      noNicoru: false, // ニコるボタンをなくす
      enoubleTouchPanel: false, // タッチパネルへの対応を有効にする
      mouseClickWheelVolume: 0, // マウスボタン+ホイールで音量調整を有効にする 1 = 左ボタン 2 = 右ボタン
      enableQTouch: false, // タッチパネルモード有効
      commentVisibility: 'visible', // 'visible', 'hidden', 'lastState'
      lastCommentVisibility: 'visible',
      controllerVisibilityInFull: '', // 全画面時に操作パネルとコメント入力欄を出す設定
      enableTrueBrowserFull: false, // フチなし全画面モードにする (Chromeは画面ダブルクリックで切り替え可能)
      enableSharedNgSetting: false, //
      hideNicoNews: false, // ニコニコニュースを消す
      hashPlaylistMode: 0,    // location.hashにプレイリストを保持 0 =無効 1=連続再生時 2=常時
      storagePlaylistMode: '', // localStorageにプレイリストを保持
      compactVideoInfo: true, //
      hoverMenuDelay: 0.4, // リンクをホバーした時のメニューが出るまでの時間(秒)
      enableFullScreenMenu: true, // 全画面時にホイールでメニューを出す
      enableHeatMap: false, //
      heatMapDisplayMode: 'hover', // 'always' 'hover'
      replacePopupMarquee: true, // 'always' 'hover'
      enableRelatedTag: true, // 関連タグを表示するかどうか
      playerTabAutoOpenNicommend: 'enable', // 終了時にニコメンドを自動で開くかどうか 'enable' 'auto' 'disable'

      searchEngine:              'normal', // 'normal' 'sugoi'
      searchStartTimeRange:      '', //
      searchLengthSecondsRange:  '', //
      searchMusicDlFilter:       false, //

      hideVideoExplorerExpand: true, // 「動画をもっと見る」ボタンを小さくする
      nicommendVisibility: 'visible', // ニコメンドの表示 'visible', 'underIchiba', 'hidden'
      ichibaVisibility:    'visible', // 市場の表示 '',   'visible', 'hidden'
      reviewVisibility:    'visible', // レビューの表示   'visible', 'hidden'
      bottomContentsVisibility: 'hidden', // 動画下のコンテンツ表示表示非表示
      hideMenuInFull: 'hide', // 全画面時にマイリストメニューを隠す '', 'hide' = 目立たなくする, 'hideAll' = 完全非表示

      flatDesignMode: '',  // 'on' グラデーションや角丸をなくす

      shortcutDefMylist:          {char: 'M', shift: true,  ctrl: false, alt: false, enable: false}, // とりマイ登録のショートカット
      shortcutMylist:             {char: 'M', shift: false, ctrl: true , alt: false, enable: false}, // マイリスト登録のショートカット
      shortcutOpenSearch:         {char: 'S', shift: true,  ctrl: false, alt: false, enable: false}, // 検索オープンのショートカット
      shortcutOpenDefMylist:      {char: 'D', shift: true,  ctrl: false, alt: false, enable: false}, // とりマイオープンのショートカット
      shortcutOpenRecommend:      {char: 'R', shift: true,  ctrl: false, alt: false, enable: false}, // 関連動画(オススメ)を開くショートカット
      shortcutCommentVisibility:  {char: 'V', shift: true,  ctrl: false, alt: false, enable: false}, // コメント表示ON/OFFのショートカット
      shortcutScrollToNicoPlayer: {char: 'P', shift: true,  ctrl: false, alt: false, enable: false}, // プレイヤーまでスクロールのショートカット
      shortcutShowOtherVideo:     {char: 'U', shift: true,  ctrl: false, alt: false, enable: false}, // 投稿者の関連動画表示のショートカット
      shortcutMute:               {char: 'T', shift: true,  ctrl: false, alt: false, enable: false}, // 音量ミュートのショートカット
      shortcutDeepenedComment:    {char: 'B', shift: true,  ctrl: false, alt: false, enable: false}, // コメント背面表示
      shortcutToggleStageVideo:   {char: 'H', shift: true,  ctrl: false, alt: false, enable: false}, // ハードウェアアクセラレーション(StageVideo)のショートカット


      watchCounter: 0, // お前は今までに見た動画の数を覚えているのか？をカウントする
      forceEnableStageVideo: false,
      forceExpandStageVideo: false,
      enableAutoPlaybackContinue: false, // 一定時間操作しなかくても自動再生を続行
      lastLeftTab: 'videoInfo',
      lastRightTab: 'w_videoInfo',
      lastRightTabInExplorer: 'comment',
      lastControlPanelPosition: '',
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
      text = document.createTextNode(text);
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
            if (req.readyState === 4) {
              if (typeof options.onload === "function") options.onload(req);
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
          if (conf.debugMode) console.log(e);
        }
      };
    }

  (function() { // 各ページ共通
    var __css__ = (function() {/*
      .tagItemsPopup {
        background: #eef;
      }
      .tagItemsPopup, .playlistMenuPopup {
        position: absolute;
        min-width: 200px;
        font-Size: 12pt;
        z-index: 2000000;
        box-shadow: 2px 2px 2px #888;
      }
      .tagItemsPopup ul,.tagItemsPopup ul li, .playlistMenuPopup ul, .playlistMenuPopup ul li  {
        position: relative;
        list-style-type: none;
        margin: 0; padding: 0;
        white-space: nowrap;
      }
      .tagItemsPopup li a{
      }
      .tagItemsPopup .nicodic, .tagItemsPopup .newsearch {
        margin: 1px 4px 1px 1px;
      }
      .tagItemsPopup .nicodic:hover, .tagItemsPopup .newsearch:hover {
        margin: 0px 3px 0px 0px;
        border: 1px outset;
      }
      .tagItemsPopup .icon{
        width: 17px;
        height: 15px;
      }
    {* マイリスト登録パネル *}
      .mylistPopupPanel {
        height: 24px;
        z-index: 10000;
        {*border: 1px solid silver;
        border-radius: 3px; *}
        padding: 0;
        margin: 0;
        overflow: hidden;
        display: inline-block;
        background: #eee;
      }
      .mylistPopupPanel.fixed {
        position: fixed; right: 0; bottom: 0;
        transition: right 0.1s ease-out;
      }
      .mylistPopupPanel.fixed>* {
        transition: opacity 0.1s ease-out;
      }
      .mylistPopupPanel>*>* {
        transition: background 0.5s ease 0.5s, color 0.5s ease 0.5s;
      }
        .full_with_browser .mylistPopupPanel{
          background: #000; border: 0;
        }
        body.full_with_browser .mylistPopupPanel *{
          background: #000; color: #888; border-color: #333;
        }
        .full_with_browser .mylistPopupPanel.hideAllInFull{
          display: none;
        }
        .full_with_browser .mylistPopupPanel.hideInFull.fixed:not(:hover) {
          right: -100px;
          transition: right 0.8s ease-in-out 0.5s;
        }
        .full_with_browser .mylistPopupPanel.hideInFull:not(:hover)>*{
          opacity: 0;
          transition: opacity 0.3s ease-out 1s;
        }
      .mylistPopupPanel.w_touch {
        height: 40px;
      }
      iframe.popup {
        position: absolute;
      }
    {* マウスホバーで出るほうのマイリスト登録パネル *}
      .mylistPopupPanel.popup {
        position: absolute;
        z-index: 1000000;
        box-shadow: 2px 2px 2px #888;
      }
    {* マイリスト登録パネルの中の各要素 *}
      .mylistPopupPanel .mylistSelect {
        width: 64px;
        margin: 0;
        padding: 0;
        font-size: 80%;
        white-space: nowrap;
        background: #eee;
        border: 1px solid silver;
      }
        .mylistSelect:focus {
          border-style: outset;
        }
    {* 誤操作を減らすため、とりマイの時だけスタイルを変える用 *}
      .mylistPopupPanel.w_touch button {
        padding: 8px 18px;
      }
      .mylistPopupPanel.w_touch .mylistSelect {
        font-size: 170%; width: 130px; border: none;
      }
      .mylistPopupPanel.w_touch .mylistSelect:focus {
        border: 1px dotted;
      }
      .mylistPopupPanel.deflistSelected button {
      }
      .mylistPopupPanel.mylistSelected  button {
        color: #ccf;
      }
      .mylistPopupPanel button {
        margin: 0;
        font-weight: bolder;
        cursor: pointer;
      }
      .mylistPopupPanel button:active, #outline .playlistToggle:active, #outline .openVideoExplorer:active, #content .openConfButton:active {
        border:1px inset !important
      }
      .mylistPopupPanel button:hover, #outline .playlistToggle:hover, #outline .openVideoExplorer:hover, #outline .openConfButton:hover, #yukkuriPanel .yukkuriButton:hover {
        border:1px outset
      }
      .mylistPopupPanel .mylistAdd, .mylistPopupPanel .tagGet, #yukkuriPanel .yukkuriButton {
        border:1px solid #777; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #eee; background-color: #888; margin: 0;
      }
      .mylistPopupPanel .mylistAdd:focus, .mylistPopupPanel .tagGet:focus, #yukkuriPanel .yukkuriButton:focus {
        border-style: outset; color: orange;
      }
      .mylistPopupPanel.deflistSelected {
        color: #ff9;
      }
      .mylistPopupPanel .deflistRemove, #yukkuriPanel .yukkuriButton.active{
        border:1px solid #ebb7b7; font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f7e3e3;
      }
      .mylistPopupPanel.deflistSelected {
        color: #ff9;
      }
      .mylistPopupPanel .deflistRemove, #yukkuriPanel .yukkuriButton.active{
        border:1px solid #ebb7b7; font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3); text-align: center; color: #FFFFFF; background-color: #f7e3e3;
      }
      .mylistPopupPanel.mylistSelected .deflistRemove {
        display: none;
      }
      .mylistPopupPanel .closeButton{
        color: #339;
        padding: 0;
        margin: 0;
        font-size: 80%;
        text-decoration: none;
      }
      .mylistPopupPanel .newTabLink{
        padding: 0 2px; text-decoration: underline; text-shadow: -1px -1px 0px #442B2B;
      }
      .mylistPopupPanel.fixed .newTabLink, .mylistPopupPanel.fixed .closeButton {
        display: none;
      }
      .w_fullScreenMenu .mylistPopupPanel.fixed { bottom: 2px; }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
        .replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
     addStyle(__css__, 'watchItLaterCommonStyle');
 })(); // end of commoncss




  (function() { // watchページだけのstyle
    if (!w.WatchApp) { return; }
    var __css__ = (function() { /*
    {* 動画タグとプレイリストのポップアップ *}
      #videoTagPopupContainer {
      }
      #videoTagPopupContainer.w_touch {
        line-height: 200%; font-size: 130%;
      }
      #videoTagPopupContainer.w_touch .nicodic{
        margin: 4px 14px;
      }
      .playlistMenuPopup {
        background: #666; color: white; padding: 4px 8px;
      }
      .playlistMenuPopup.w_touch {
        line-height: 250%;
      }
      #playlistSaveDialog {
        display: none;
      }
      #playlistSaveDialog.show {
        display: block;
      }
      #playlistSaveDialog.show .shadow{
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: #000; opacity: 0.5;
        z-index: 30000;
      }
      #playlistSaveDialog.show .formWindow{
        position: fixed;
        margin: 0 auto;
        text-align: center;
        width: 100%;
        top: 45%;
        z-index: 30001;
      }
      #playlistSaveDialog      .formWindow .formWindowInner{
        -webkit-transition: opacity 1s ease-out;
        transition: opacity 1s ease-out;
        opacity: 0;
      }
      #playlistSaveDialog.show .formWindow .formWindowInner{
        text-align: left;
        opacity: 1;
        margin: 0 auto;
        background: #f4f4f4;
        width: 500px;
        padding: 8px;
        border: 1px solid;
      }
      #playlistSaveDialog.show .formWindow .formWindowInner a{
        font-weight: bolder;
      }
      #playlistSaveDialog.show .formWindow .formWindowInner a:hover{
        text-decoration: underline; background: white;
      }
      #playlistSaveDialog.show .formWindow .formWindowInner label{
        margin: 8px;
      }
      #playlistSaveDialog.show .formWindow .formWindowInner input{

      }
      #playlistSaveDialog.show .formWindow .formWindowInner .desc{
        font-size: 80%;
      }
      .playlistMenuPopup ul li {
        cursor: pointer;
      }
      .playlistMenuPopup ul li.savelist {
        color: #aaa;
      }
      .playlistMenuPopup ul li:hover {
        text-decoration: underline; background: #888;
      }
      #yukkuriPanel .yukkuriButton.active {
        border:1px inset
      }

      #content .openConfButton {
        border:1px solid #bbb; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 4px; text-shadow: 1px 1px 0 rgba(0,0,0,0.3); text-align: center; color: #444; background-color: #ccc; margin: 0;
      }
      #outline .playlistToggle, #outline .openVideoExplorer, #outline .openConfButton {
        border:1px solid #444; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; box-shadow: 1px 1px 0 rgba(0,0,0,0.3); text-align: center; color: #444; background-color: #ccc; margin: 0;
        height: 24px; border-radius: 0 0 8px 8px;
      }
      #outline .openConfButton { padding: 0 8px; letter-spacing: 4px; width: 60px; }

      {* 全画面時にタグとプレイリストを表示しない時*}
      body.full_and_mini.full_with_browser #playerAlignmentArea{
        margin-bottom: 0 !important;
      }
      body.full_and_mini.full_with_browser #playlist{
        z-index: auto;
      }
      body.full_and_mini.full_with_browser .generationMessage{
        display: inline-block;
      }
      {* 全画面時にタグとプレイリストを表示する時 *}
      body.full_with_browser #playlist{
        z-index: 100;
      }
      body.full_with_browser .generationMessage{
        display: none;
      }
      body.full_with_browser .browserFullOption{
        padding-right: 200px;
      }
      {* 全画面時にニュースを隠す時 *}
      body.full_with_browser.hideNewsInFull #playerAlignmentArea{
        margin-bottom: -37px;
      }
      {* 少しでも縦スクロールを減らすため、動画情報を近づける。人によっては窮屈に感じるかも *}
      #outline {
        margin-top: -16px;
      }
      #outline #feedbackLink{

      }
      #outline .videoEditMenuExpand{
        position: absolute;right: 0;top: 26px; z-index: 1;
      }
      {* ヘッダに表示する再生数 *}
      #videoCounter {
        color: #ff9; font-size: 70%;
      }
      {* 右に表示する動画情報 *}
      .sidePanel .sideVideoInfo, .sidePanel .sideIchibaPanel, .sidePanel .sideReviewPanel  {
        padding: 0px 0px 0 0px; width: 196px; height: 100%; z-index: 10;
        position:absolute; top:0; right:0;
        display:none; overflow-x: visible; overflow-y: auto;
      }
      {* 右に表示する動画情報 *}
      #playerTabWrapper.sidePanel .sideVideoInfo, #playerTabWrapper.sidePanel .sideIchibaPanel, #playerTabWrapper.sidePanel .sideReviewPanel  {
        padding: 0px 0px 0 0px; width: 280px; height: 100%;
        position: absolute; top: 0; right:0;
      }
      {*#playerTabWrapper.w_wide .sideVideoInfo, #playerTabWrapper.w_wide .sideIchibaPanel, #playerTabWrapper.w_wide .sideReviewPanel,*}
      .videoExplorer #playerTabWrapper .sideVideoInfo, .videoExplorer #playerTabWrapper .sideIchibaPanel, .videoExplorer #playerTabWrapper .sideReviewPanel {
        width: 420px; z-index: 10030;
      }
      #playerTabWrapper.w_videoInfo #appliPanel, #playerTabWrapper.w_ichiba #appliPanel, #playerTabWrapper.w_review #appliPanel  {
        top: -9999px;
      }
      #content:not(.w_flat) .sidePanel .sideVideoInfo, #content:not(.w_flat) .sidePanel .sideIchibaPanel, #content:not(.w_flat) .sidePanel .sideReviewPanel  {
        border-radius: 4px;
      }
      .sidePanel .sideVideoInfo {
        background: #bbb; text-Align:   left; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;
      }
      .sidePanel .sideIchibaPanel, .sidePanel .sideReviewPanel  {
        background: #f4f4f4; text-Align: center; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;
      }
      .sidePanel .sideVideoInfo .sideVideoInfoInner {
        padding: 0 4px; position: relative;
      }
      .sidePanel .sideVideoInfo .videoTitleContainer {
        background: #ccc; text-align: center;  color: #000; margin: 6px 0 0;
      }
      #content:not(.w_flat) .sidePanel .sideVideoInfo .videoTitleContainer {
        border-radius: 4px 4px 0 0;
      }
      .sidePanel .sideVideoInfo .videoThumbnailContainer {
        background: #ccc; text-align: center; color: #000; margin: 0;
      }
      .sidePanel .sideVideoInfo .videoThumbnailContainer img {
        cursor: pointer;
      }
      .sidePanel .sideVideoInfo .videoTitle {

      }
      .sidePanel .sideVideoInfo .videoPostedAt {
        color: #333;
      }
      .sidePanel .sideVideoInfo .videoStats{
        font-size:90%;
      }
      .sidePanel .sideVideoInfo .videoStats li{
        display: inline-block; margin: 0 2px;
      }
      .sidePanel .sideVideoInfo .videoStats li span{
        font-weight: bolder;
      }
      .sidePanel .sideVideoInfo .videoStats .ranking{
        display: none !important;
      }
      .sidePanel .sideVideoInfo .videoInfo{
        background: #ccc; text-align: center; padding: 4px;
      }
      .sideVideoInfo .sideVideoInfoInner{
        -webkit-transition: opacity 1s ease-out, color 3s ease-out;
        transition: opacity 1s ease-out, color 3s ease-out;
        opacity: 0;
      }
      .sideVideoInfo.show .sideVideoInfoInner{
        opacity: 1;
      }
      .videoCount.blink {
        color: #ccc;
      }
      .sidePanel .videoCountDiff {
        position: absolute; color: white; right: 0; opacity: 0; z-index: 100; text-shadow: 1px 1px 0 orange;
      }
      .sidePanel .videoCountDiff.blink {
        opacity: 1; color: white;
      }
      #siteHeader .videoCount, #siteHeader .videoCountDiff {
        min-width: 32px; text-align: right; display: inline-block;
      }
      #siteHeader .videoCountDiff, #trueBrowserFullShield .videoCountDiff {
        position: absolute; color: yellow; opacity: 0; font-weight: bolder; text-shadow: 1px 1px 0 red;
      }
      #siteHeader .videoCountDiff.blink, #trueBrowserFullShield .videoCountDiff.blink {
        opacity: 1; color: yellow;
      }
      #trueBrowserFullShield .blink, #videoCounter .blink {
        color: #000;
      }
      .videoCountDiff:before      {content: '+';}
      .videoCountDiff.down:before {content: ''; }
      #popupMarquee .videoCountDiff {display: none;}
      .sidePanel .sideVideoInfo .videoDescription{
        overflow-x: hidden; text-align: left;
      }
      .sidePanel .sideVideoInfo .videoDescriptionInner{
        margin: 0 4px;
      }
      .sidePanel .sideVideoInfo .videoDetails{
        min-width: 150px;
      }
      .sidePanel .sideVideoInfo .videoDetails a{
        margin: auto 4px;
      }
      .sideVideoInfo .userName, .sideVideoInfo .channelName{
        display: block;
      }
      .sideVideoInfo .userIconContainer, .sideVideoInfo .channelIconContainer {
        background: #ccc; width: 100%; text-align: center; float: none;
      }
      #content:not(.w_flat) .sideVideoInfo .userIconContainer, #content:not(.w_flat) .sideVideoInfo .channelIconContainer{
        border-radius: 0 0 4px 4px;
      }
      .sidePanel .userIcon, .sidePanel .channelIcon{
        min-width: 128px; max-width: 150px; width: auto; height: auto; border: 0;
      }
      .sidePanel .sideVideoInfo .descriptionThumbnail {
        text-align: left; font-size: 90%; padding: 4px; background: #ccc;{*box-shadow: 2px 2px 2px #666;*}
        min-height: 60px; margin-bottom: 4px; font-weight: normal; color: black;
      }
      #content:not(.w_flat) .sidePanel .sideVideoInfo .descriptionThumbnail {
        border-radius: 4px;
      }
      .sidePanel .sideVideoInfo .descriptionThumbnail.video img{
        height: 50px; cursor: pointer; float: left;
      }
      .sidePanel .sideVideoInfo .descriptionThumbnail.mylist img{
        height: 40px; cursor: pointer;
      }
      .sidePanel .sideVideoInfo .descriptionThumbnail.illust img{
        height: 60px; cursor: pointer; float: left;
      }
      .sidePanel .sideVideoInfo a.otherSite {
        font-weight: bolder; text-decoration: underline;
      }
      body:not(.videoExplorer) #leftPanel.removed {
        display: none; left: 0px;
      }
      body:not(.videoExplorer) #leftPanel.removed .sideVideoInfo {
        display: none; width: 0px !important; border: none; margin: 0; padding: 0; right: auto;
      }
      .sideVideoInfo .userIconContainer.isUserVideoPublic .notPublic { display: none; }
      .sideVideoInfo .userIconContainer                    .isPublic { display: none; }
      .sideVideoInfo .userIconContainer.isUserVideoPublic  .isPublic { display: inline; }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem,
      .sidePanel .sideIchibaPanel .ichiba_mainitem {
        width: 180px; display:inline-block; vertical-align: top;
        margin: 4px 3px; border 1px solid silver;
      }
      body.videoExplorer #content.w_adjusted:not(.w_flat) .sideIchibaPanel .ichiba_mainitem {
        border-radius: 8px
      }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem .thumbnail span {
        font-size: 60px;
      }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem>div>dt {
        height: 50px;position: relative;
      }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem .balloonUe {
        position: absolute;width: 100%;
      }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem .balloonUe {
        position: absolute;
      }
      body.videoExplorer #content.w_adjusted .sideIchibaPanel .ichiba_mainitem .balloonShita {
        position: absolute;
      }

      .sidePanel.videoInfo, .sidePanel.ichiba{
        background: none;
      }

      .sideVideoInfo.isFavorite .userName:after, .sideVideoInfo.isFavorite.isChannel .videoOwnerInfoContainer .channelName:after{
        content: ' ★ '; color: gold; text-shadow: 1px 1px 1px black;
      }

      .sidePanel.videoInfo  #leftPanelContent, .sidePanel.ichiba  #leftPanelContent {
        display: none;
      }
      .sidePanel.videoInfo    .sideVideoInfo,
      .sidePanel.ichiba       .sideIchibaPanel,
      .sidePanel.w_videoInfo  .sideVideoInfo,
      .sidePanel.w_ichiba     .sideIchibaPanel,
      .sidePanel.w_review     .sideReviewPanel {
        display: block;
      }

      #leftPanelTabContainer {
        display:none; background: #666; position: absolute; right: 4px; top: -27px; list-style-type: none; padding: 4px 6px 3px 60px; height: 20px;
      }
      #sidePanelTabContainer {
        display: none;
        position: absolute; list-style-type: none;
        padding: 5px 10px 0; right: -408px; top: 0; width: 350px; height: 34px;
                transform: rotate(90deg);         transform-origin: 0 0 0;
        -webkit-transform: rotate(90deg); -webkit-transform-origin: 0 0 0;
      }
      .full_with_browser #sidePanelTabContainer { background: #000; }
      body:not(.videoExplorer) #sidePanelTabContainer.left {
        background: #000 {* firefoxはこれがないと欠ける *}; right: auto; left: -375px; padding: 0; height: 25px;
                transform: rotate(-90deg);         transform-origin: 100% 0 0;
        -webkit-transform: rotate(-90deg); -webkit-transform-origin: 100% 0 0;
      }
      #content:not(.w_flat) #leftPanelTabContainer {
        border-radius: 4px 4px 0px 0px;
      }
      #leftPanelTabContainer.w_touch {
        top: -40px; height: 33px;
      }
      .sidePanel:hover #sidePanelTabContainer, .sidePanel:hover #leftPanelTabContainer {
        display:block;
      }
      #leftPanelTabContainer .tab{
        display: inline-block; cursor: pointer; background: #999; padding: 2px 4px 0px; border-width: 1px 1px 0px;
      }
        #leftPanelTabContainer.w_touch .tab, #sidePanelTabContainer.w_touch .tab {
          padding: 8px 12px 8px;
        }
      #sidePanelTabContainer .tab {
        background: none repeat scroll 0 0 #999999; border-width: 1px 1px 0; cursor: pointer;
        display: inline-block; font-size: 13px; padding: 5px 10px 8px;
        border-radius: 8px 8px 0px 0px;
      }
      #sidePanelTabContainer.left .tab {
        display: inline-block; font-size: 13px; padding: 5px 10px 0px;
      }
      #leftPanel.videoInfo .tab.videoInfo {
        background: #bbb;    border-style: outset;
      }
      #leftPanel.ichiba .tab.ichiba {
        background: #eee;    border-style: outset;
      }
      #playerTabWrapper.w_comment   .tab.comment,
      #playerTabWrapper.w_videoInfo .tab.videoInfo,
      #playerTabWrapper.w_ichiba    .tab.ichiba,
      #playerTabWrapper.w_review    .tab.review
      {
        background: #dfdfdf; border-style: outset;
      }
      body.videoExplorer .sidePanel:not(:hover) .sidePanelInner {
        overflow: hidden;
      }
      #playerTabWrapper.w_videoInfo #playerCommentPanel,
      #playerTabWrapper.w_ichiba #playerCommentPanel,
      #playerTabWrapper.w_review #playerCommentPanel {
        {*display: none;*} top: -9999px;
      }
      {*body.videoExplorer #sidePanelTabContainer { display: none; }*}
      .sidePanel.ichibaEmpty  .tab.ichiba, .sidePanel.reviewEmpty .tab.review {
        color: #ccc;
      }
      #playerTabWrapper.nicommendEmpty .playerTabHeader .playerTabItem.nicommend {
        opacity: 0.5;
      }

      .sideIchibaPanel .ichibaPanelInner {
        margin:0; color: #666;
      }
      .sideIchibaPanel .ichibaPanelHeader .logo{
        text-shadow: 1px 1px 1px #666; cursor: pointer; padding: 4px 0px 4px; font-size: 125%;
      }
      .sideIchibaPanel .ichibaPanelFooter{
        text-align: center;
      }
      .sideIchibaPanel .ichiba_mainitem {
        margin: 0 0 8px 0; background: white; border-bottom : 1px dotted #ccc;
      }
      .sideIchibaPanel .ichiba_mainitem a:hover{
        background: #eef;
      }
      .sideIchibaPanel .ichiba_mainitem>div {
        max-width: 266px; margin: auto; text-align: center;
      }
      .sideIchibaPanel .ichiba_mainitem .blomagaArticleNP {
        background: url("http://ichiba.nicovideo.jp/embed/zero/img/bgMainBlomagaArticleNP.png") no-repeat scroll 0 0 transparent;
        height: 170px;
        margin: 0 auto;
        width: 180px;
      }
      .sideIchibaPanel .ichiba_mainitem .blomagaLogo {
        color: #FFFFFF;font-size: 9px;font-weight: bold;padding-left: 10px;padding-top: 8px;
      }
      .sideIchibaPanel .ichiba_mainitem .blomagaLogo span{
        background: none repeat scroll 0 0 #AAAAAA;padding: 0 3px;
      }
      .sideIchibaPanel .ichiba_mainitem .blomagaText {
        color: #666666;font-family: 'HGS明朝E','ＭＳ 明朝';font-size: 16px;height: 100px;
        padding: 7px 25px 0 15px;text-align: center;white-space: normal;word-break: break-all;word-wrap: break-word;
      }
      .sideIchibaPanel .ichiba_mainitem .blomagaAuthor {
        color: #666666; font-size: 11px;padding: 0 20px 0 10px;text-align: right;
      }
      .sideIchibaPanel .ichiba_mainitem .balloonUe{
        bottom: 12px; display: block; max-width: 266px;
      }
      .sideIchibaPanel .ichiba_mainitem .balloonUe a{
        background: url("/img/watch_zero/ichiba/imgMainBalloonUe.png") no-repeat scroll center top transparent;
        color: #666666 !important;
        display: block;
        font-size: 108%;
        line-height: 1.2em;
        margin: 0 auto;
        padding: 8px 15px 3px;
        text-align: center;
        text-decoration: none;
        word-wrap: break-word;
      }
      .sideIchibaPanel .ichiba_mainitem .balloonShita{
        height: 12px; bottom: 0; left: 0;
      }
      .sideIchibaPanel .ichiba_mainitem .balloonShita img{
        vertical-align: top !important;
      }
      .sideIchibaPanel .ichiba_mainitem .ichibaMarquee {
        display: none;
      }
      .sideIchibaPanel .ichiba_mainitem .thumbnail span {
        font-size: 22px; color: #0066CC;
        font-family: 'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','ＭＳ Ｐ明朝','MS PMincho',serif;
      }
      .sideIchibaPanel .ichiba_mainitem .action {
        font-size: 85%;
      }
      .sideIchibaPanel .ichiba_mainitem .action .buy {
        font-weight: bolder; color: #f60;
      }
      .sideIchibaPanel .ichiba_mainitem .itemname {
        font-weight: bolder;
      }
      .sideIchibaPanel .ichiba_mainitem .maker {
        font-size: 77%; margin-bottom: 2px;
      }
      .sideIchibaPanel .ichiba_mainitem .price {
      }
      .sideIchibaPanel .ichiba_mainitem .action .click {
        font-weight: bolder;
      }
      .sideIchibaPanel .ichiba_mainitem .goIchiba {
        font-size: 77%; margin: 5px 0;
      }
      .sideIchibaPanel .addIchiba, .sideIchibaPanel .reloadIchiba {
        cursor: pointer;
      }
      .sideIchibaPanel .noitem {
        cursor: pointer;
      }

      #outline .bottomAccessContainer {
        position: absolute; top: 12px;
      }
      #outline .bottomConfButtonContainer {
        position: absolute; top: 12px; right: 0px;
      }
      body.videoExplorer .bottomAccessContainer{
        display: none;
      }
      #outline.under960 .bottomAccessContainer{
        right: 60px;
      }
      #outline .sidebar {
        -webkit-transition: margin-top 0.3s ease-out;
        transition:         margin-top 0.3s ease-out;
      }
      #outline.under960 .sidebar {
        margin-top: 24px;
      }
      #videoHeader.menuClosed .watchItLaterMenu, #videoHeader.menuClosed .hidariue { display: none; }
      #videoHeader .watchItLaterMenu {
        position: absolute; width: 100px; left: -55px; top: 32px;
      }
      {* プレイリスト出したり隠したり *}
      #playlist>* {
        -webkit-transition: opacity 0.6s; transition: opacity 0.6s;
      }
      body:not(.full_with_browser):not(.videoExplorer) #playlist.w_closing>* {
        opacity: 0;
      }
      body:not(.full_with_browser):not(.videoExplorer) #playlist:not(.w_show){
        position: absolute; top: -9999px;
      }
      #playlist.w_show{
        {*max-height: 180px;*}
      }
      .playlistToggle:after {
        content: "▼";
      }
      .playlistToggle.w_show:after {
        content: "▲";
      }
      #content #playlist .playlistInformation  .generationMessage{
        {* 「連続再生ボタンとリスト名は左右逆のほうが安定するんじゃね？ 名前の長さによってボタンの位置がコロコロ変わらなくなるし」という対応。*}
        {* ついに本家のほうもボタンが左になったよ！ *}
        {* position: absolute; margin-left: 90px; *}
      }
      body.videoExplorer #content #playlist .playlistInformation  .generationMessage{
        max-width: 350px;
      }
      #playlistContainerInner .thumbContainer, #playlistContainerInner .balloon{
        cursor: move;
      }


      {* ページャーの字が小さくてクリックしにくいよね *}
      #resultPagination {
        padding: 5px; font-weight: bolder; border: 1px dotted silter; font-size: 130%;
      }

      #playlistContainer #playlistContainerInner .playlistItem .balloon {
        bottom: auto; top: -2px; padding: auto;
      }

      body.w_channel #leftPanel .userIconContainer{
        display: none;
      }
      {* WatchItLater設定パネル *}
      #watchItLaterConfigPanel {
        position: fixed; bottom: 0px; right: 16px; z-index: 10001;
        width: 460px; padding: 0;
        transition: transform 0.4s ease-in-out; -webkit-transition: -webkit-transform 0.4s ease-in-out;
        transform-origin: 50% 0; -webkit-transform-origin: 50% 0;
        transform: scaleY(0);  -webkit-transform: scaleY(0);
      }
      #watchItLaterConfigPanel.open {
        transform: scaleY(1); -webkit-transform: scaleY(1);
      }
      #watchItLaterConfigPanelShadow {
        position: fixed; bottom: 16px; right: 16px; z-index: 10000;
        width: 460px; height: 559px; padding: 0;
        background: #000; {*box-shadow: 0 0 2px black; border-radius: 8px;*} -webkit-filter: opacity(70%);
        transition: transform 0.4s ease-in-out; -webkit-transition: -webkit-transform 0.4s ease-in-out;
        transform-origin: 50% 0; -webkit-transform-origin: 50% 0;
        transform: scaleY(0); -webkit-transform: scaleY(0);
      }
      #watchItLaterConfigPanelShadow.open {
        transform: scaleY(1); -webkit-transform: scaleY(1);
      }
      #watchItLaterConfigPanelShadowTop {
        position: fixed; bottom: 563px; right:0px; z-index: 10000; background: #333;
        width: 492px; height: 20px; padding: 0; border-radius: 32px; -webkit-filter: opacity(90%); display: none;
      }
      #watchItLaterConfigPanelOverShadow {
        position: fixed; bottom: 575px; right: 0px; width: 488px; height: 8px;
        box-shadow: 0 4px 16px #333;z-index: 10002; display: none;
      }
      #watchItLaterConfigPanel .head {
        background-color: #CCCCCC;border-radius: 0;color: black;height: 50px;
        overflow: hidden;padding: 5px 0 0 16px;position: relative;
      }
      #watchItLaterConfigPanel .head h2 {
        font-size: 135%;
      }
      #watchItLaterConfigPanel .inner{
        height: 500px; overflow-y: auto;border-width: 4px 16px 16px 16px; border-radius: 0 0 16px 16px;
        border-style: solid;border-color: #ccc;
      }
      #watchItLaterConfigPanel ul{
        border-style: inset; border-color: #ccc; border-width: 0 1px 0;
      }
      #watchItLaterConfigPanel ul.shortcutContainer{
        border-width: 0 1px 1px;
      }
      #watchItLaterConfigPanel ul.videoStart{
        border-width: 1px 1px 0;
      }
      #watchItLaterConfigPanel li{
      }
      #watchItLaterConfigPanel li:hover{
        {*background: #ddd;*}
      }
      #watchItLaterConfigPanel li.buggy{
        color: #888;
      }
      #watchItLaterConfigPanel label{
        margin: 0 5px;
      }
      #watchItLaterConfigPanel label:hover{
      }
      #watchItLaterConfigPanel .foot {
        text-align: right; padding: 0 12px;
      }
      #watchItLaterConfigPanel .closeButton{
        border: 0 none;border-radius: 0 0 4px 4px;box-shadow: 0 1px 2px white;color: #666; border: 1px solid #999;
        cursor: pointer;float: right;margin-top: 8px;position: absolute;right: 16px;
        text-shadow: 0 1px 0 white;top: -10px; width: 60px;
      }
      #watchItLaterConfigPanel.autoBrowserFull_false .disableAutoBrowserFullIfNicowari,
      #watchItLaterConfigPanel.autoBrowserFull_true .autoScrollToPlayer,
      #watchItLaterConfigPanel.autoBrowserFull_true .autoOpenSearch,
      #watchItLaterConfigPanel.removeLeftPanel_true .leftPanelJack  {
        color: #ccc; text-shadow: -1px -1px 0 #888;
      }
      #watchItLaterConfigPanel .reload .title:after {
        content: ' (※)'; font-size: 80%; color: #900;
      }
      #watchItLaterConfigPanel .debugOnly {
        display: none;
      }
      #watchItLaterConfigPanel.debugMode .debugOnly {
        display: block; background: #888;
      }
      #watchItLaterConfigPanel .section {
        border-style: solid;border-width: 10px 12px 10px 12px;color: white; font-size: 135%; position: relative;
        font-weight: bolder; cursor: pointer; {*text-shadow: 2px 2px 1px #000000;*}
        transition: border-width 0.2s ease-in-out 0.4s, color 0.3s; -webkit-transition: border-width 0.2s ease-in-out 0.4s, color 0.4s;
      }
      #watchItLaterConfigPanel .open .section {
        border-width: 20px 12px 12px 12px;
        transition: border-width 0.2s ease-in-out     ; -webkit-transition: border-width 0.2s ease-in-out     ;
      }
      #watchItLaterConfigPanel .section:hover:after {
        content: '▼';
        position: absolute; top: 0px; right: 10px; font-size: 150%;
        transition: transform 0.2s ease-in-out 0.4s; -webkit-transition: -webkit-transform 0.2s ease-in-out 0.4s;
      }
      #watchItLaterConfigPanel .open .section:after {
        content: '▼';
        position: absolute; top: 0px; right: 10px; font-size: 150%;
        transform: rotate(180deg); -webkit-transform: rotate(180deg);
        transition: transform 0.2s ease-in-out     ; -webkit-transition: -webkit-transform 0.2s ease-in-out;
      }
      #watchItLaterConfigPanel .section > div {
        padding: 8px 0 8px 12px; box-shadow: 0 0 4px black;
      }
      #watchItLaterConfigPanel .section > div > span {
        {*background: #333;*}
      }
      #watchItLaterConfigPanel li:not(.section) {
        background: #fff; border-width: 0px 0px 0px 24px; border-style: solid; border-color: #fff;
        max-height: 0px; overflow: hidden;
        transition: max-height 0.4s ease-in-out     , border-width 0.4s ease-in-out;
      }
       #watchItLaterConfigPanel .open li:not(.section) {
        max-height: 100px; border-width: 4px 0px 4px 24px;
        transition: max-height 0.4s ease-in-out 0.2s, border-width 0.4s ease-in-out 0.2s;
      }
      #watchItLaterConfigPanel .section .description{
        display: block; font-size: 80%;;
      }
      #watchItLaterConfigPanel .shortcutSetting:not(.enable) span :not(.enable){
        color: #silver;
      }
      #watchItLaterConfigPanel .shortcutSetting .enable {
        cursor: pointer; margin: auto 10px;
      }
      #watchItLaterConfigPanel .shortcutSetting        .enable:before {
        content: '○ ';
      }
      #watchItLaterConfigPanel .shortcutSetting.enable .enable:before {
        content: '㋹ '; color: blue;
      }
      #watchItLaterConfigPanel .shortcutSetting      .ctrl, #watchItLaterConfigPanel .shortcutSetting     .alt, #watchItLaterConfigPanel .shortcutSetting       .shift {
        cursor: pointer; border: 2px outset; margin: 4px 4px; padding: 2px 4px; width: 180px; border-radius: 4px;background: #eee;
      }
      #watchItLaterConfigPanel .shortcutSetting.ctrl .ctrl, #watchItLaterConfigPanel .shortcutSetting.alt .alt, #watchItLaterConfigPanel .shortcutSetting.shift .shift {
        border: 2px inset; color: blue;
      }
      #watchItLaterConfigPanel .hoverMenuDelay input {
        width: 50px; ime-mode: disabled; text-align: center;
      }


      {* 動画検索画面に出るお気に入りタグ・お気に入りマイリスト *}
      .videoExplorerMenu .watchItLaterMenu.open,
      .videoExplorerMenu .watchItLaterMenu.opening {
        background: -moz-linear-gradient(center top , #D1D1D1, #FDFDFD) repeat scroll 0 0 transparent !important;
        background: -webkit-gradient(linear, left top, left bottom, from(#D1D1D1), to(#FDFDFD)) !important;
        border-bottom: 0 !important;
      }
      .videoExplorerMenu .watchItLaterMenu {
        position: relative;
        {*background: -moz-linear-gradient(center top , whitesmoke 0%, #E1E1E1 100%) repeat scroll 0 0 transparent;*}
        {*box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.1) inset;*}
        {*background: #f5f5f5;*}
        border-bottom: 1px solid #CCCCCC;
      }
      .videoExplorerMenu .watchItLaterMenu:hover{
        background: #dbdbdb;
      }
      .videoExplorerMenu .watchItLaterMenu {
        padding: 0 12px; display: block; color: black;
      }
      .videoExplorerMenu .slideMenu{
        width: 100%; height: auto !important;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0;
        background: #fdfdfd;
        border-top: 0 !important;
        display: block;
        max-height: 0;
        transition: max-height 0.5s ease-in-out;
      }
      .videoExplorerMenu .slideMenu.open {
        max-height: 2000px;
        transition: max-height   1s ease-in-out;
      }
      .videoExplorerMenu #favoriteTagsMenu a,             .videoExplorerMenu #favoriteMylistsMenu a,
      .videoExplorerMenu #mylistListMenu   a,             .videoExplorerMenu #videoRankingMenu a{
        color: black; display: block;
      }
      .videoExplorerMenu #favoriteTagsMenu a:after,       .videoExplorerMenu #favoriteMylistsMenu a:after,
      .videoExplorerMenu #mylistListMenu   a:after,       .videoExplorerMenu #videoRankingMenu a:after{
        content: "▼"; position: absolute; background: none; top: 0px; right: 10px; color: #ccc;
      }
      .videoExplorerMenu #favoriteTagsMenu.open a:after,  .videoExplorerMenu #favoriteMylistsMenu.open a:after,
      .videoExplorerMenu #mylistListMenu.open   a:after,  .videoExplorerMenu #videoRankingMenu.open a:after{
        content: "▲";
      }
      .videoExplorerMenu .slideMenu ul{
      }
      .videoExplorerMenu .slideMenu ul li{
        background: #fdfdfd; padding: 0; border: 0;font-size: 90%; height: auto !important;
      }
      .videoExplorerMenu .slideMenu ul li a{
        line-height: 165%; background: none; display: block;
      }
      .videoExplorerMenu.w_touch .slideMenu ul li a{
        line-height: 300%; font-size: 120%; color: black;
      }
        .videoExplorerMenu .slideMenu ul li a:before{
          background: url("http://uni.res.nimg.jp/img/zero_my/icon_folder_default.png") no-repeat scroll 0 0 transparent;
          display: inline-block; height: 14px; margin: -4px 4px 0 0; vertical-align: middle; width: 18px; content: ""
        }
        .videoExplorerMenu .slideMenu ul li          a.defMylist:before{ background-position: 0 -253px;}
        .videoExplorerMenu .slideMenu ul li.folder0  a:before{ background-position: 0 0;}
        .videoExplorerMenu .slideMenu ul li.folder1  a:before{ background-position: 0 -23px;}
        .videoExplorerMenu .slideMenu ul li.folder2  a:before{ background-position: 0 -46px;}
        .videoExplorerMenu .slideMenu ul li.folder3  a:before{ background-position: 0 -69px;}
        .videoExplorerMenu .slideMenu ul li.folder4  a:before{ background-position: 0 -92px;}
        .videoExplorerMenu .slideMenu ul li.folder5  a:before{ background-position: 0 -115px;}
        .videoExplorerMenu .slideMenu ul li.folder6  a:before{ background-position: 0 -138px;}
        .videoExplorerMenu .slideMenu ul li.folder7  a:before{ background-position: 0 -161px;}
        .videoExplorerMenu .slideMenu ul li.folder8  a:before{ background-position: 0 -184px;}
        .videoExplorerMenu .slideMenu ul li.folder9  a:before{ background-position: 0 -207px;}

        .videoExplorerMenu .slideMenu ul li.g_ent2 a:before     {  background-position: 0 -23px;}
        .videoExplorerMenu .slideMenu ul li.g_life2 a:before    {  background-position: 0 -46px;}
        .videoExplorerMenu .slideMenu ul li.g_politics a:before {  background-position: 0 -69px;}
        .videoExplorerMenu .slideMenu ul li.g_tech a:before     {  background-position: 0 -92px;}
        .videoExplorerMenu .slideMenu ul li.g_culture2 a:before {  background-position: 0 -115px;}
        .videoExplorerMenu .slideMenu ul li.g_other a:before    {  background-position: 0 -138px;}
        .videoExplorerMenu .slideMenu ul li.r18 a:before        {  background-position: 0 -207px;}
        .videoExplorerMenu .slideMenu ul li.all        a.all,
        .videoExplorerMenu .slideMenu ul li.g_ent2     a.g_ent2,
        .videoExplorerMenu .slideMenu ul li.g_life2    a.g_life2,
        .videoExplorerMenu .slideMenu ul li.g_politics a.g_politics,
        .videoExplorerMenu .slideMenu ul li.g_tech     a.g_tech,
        .videoExplorerMenu .slideMenu ul li.g_culture2 a.g_culture2,
        .videoExplorerMenu .slideMenu ul li.g_other    a.g_other,
        .videoExplorerMenu .slideMenu ul li.r18        a.r18
        { font-weight: bolder; border-top: 1px dotted #ccc; }


      .videoExplorerMenu .slideMenu ul li a:after{
        background: none !important;
      }
      .videoExplorerMenu .slideMenu ul li a:hover{
        background: #f0f0ff;
      }
      .videoExplorerMenu .slideMenu ul .reload{
        cursor: pointer; border: 1px solid; padding: 0;
      }

      .videoExplorerMenu .tagSearchHistory {
        border-radius: 0px; margin-top: 2px; padding: 4px; background: #ccc;
      }
      .videoExplorerMenu .itemList > li, #videoExplorerExpand {
        background: #f5f5f5;
      }
      .videoExplorerMenu .itemList ul > li:hover {
        background: #e7e7e7;
      }
      .videoExplorerMenu .itemList ul > li.active {
        background: #343434;
      }


      {* 動画タグが1行以下の時 *}
      body:not(.full_with_browser) .tag1Line  #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit {
        height: 12px; padding: 6px 4px 2px;
      }
      body:not(.full_with_browser) .tag1Line  #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit .toggleText{
        display: none;
      }
      {* 動画タグが2行以下の時 *}
      body:not(.full_with_browser) .tag2Lines #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit {
        height: 36px;
      }
      {* タグ領域とプレイヤーの隙間をなくす *}
      body:not(.full_with_browser) #videoTagContainer, body:not(.full_with_browser) #videoHeader .videoMenuToggle {
        margin-bottom: -10px;
      }
      #videoHeaderMenu .searchContainer .searchText {
        margin-top: -8px;
      }

      body.size_small #playerContainerWrapper {
        padding: 0;
      }

      {* ニュース履歴 *}
      body.videoExplorer #textMarquee .openNewsHistory, body.videoExplorer #textMarquee .newsHistory {
        display: none;
      }
      #textMarquee .openNewsHistory {
        position: absolute; width: 30px;
        font-size: 13px; padding: 0; margin: 0; height: 28px;
        cursor: pointer;
        bottom: 0;
        background: none repeat scroll 0 0 transparent;
        border: 1px none;
        border-radius: 2px 2px 2px 2px;
        cursor: pointer;
        right: 18px;
        z-index: 200;
      }
      #textMarquee .newsHistory {
        position: absolute;
        bottom: 0px; right: 0px; width: 100%;
        max-height: 132px;
        min-height: 40px;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 1;
        padding: 4px;
        display: none;
        background: #333;
        text-align: left;
        font-size: 14px;
        padding: 0;
      }
      #textMarquee .newsHistory li{
        padding: 0 2px;
      }
      #textMarquee .newsHistory li:nth-child(odd){
        background: #444;
      }
      #textMarquee .newsHistory li:nth-child(even){
        background: #333;
      }
      body.full_with_browser.hideNewsInFull #textMarquee .newsHistory {
        display: none !important;
      }
      body #popupMarquee {
        width: 360px;
      }
      {* 半透明だとflashの上に来ると描画されないので強制的に黒にする(Chromeは平気) *}
      body.full_with_browser #popupMarquee.popupMarqueeBottomLeft {
        background: #000 !important;left: 8px; bottom: 8px; width: 400px; opacity: 1;
      }
      body.full_with_browser #playerContainer {
        margin-left: 0 !important;
      }
      body:not(.full_with_browser) #playerContainer {
        {*top: -8px;*}
      }
      body:not(.full_with_browser) #playerContainerWrapper {
        padding: 0px;
      }
      body.full_with_browser #playerContainer, body.size_small #playerContainer {
        top: auto;
      }
      body.full_with_browser.no_setting_panel .videoExplorerMenu {
        display:none;
      }


      body:not(.videoExplorer) #content.w_hideSearchExpand #videoExplorerExpand {
        display: none;
      }
      #outline .openVideoExplorer {
        display: none;
      }
      #outline.w_hideSearchExpand .openVideoExplorer {
        display: inline-block;
      }

      {* 1列表示の時、動画タイトルの横の空白部分にまでクリック判定があるのはVistaのエクスプローラみたいで嫌なので、文字部分だけにしたい *}
      #videoExplorer .videoExplorerBody .videoExplorerContent.column1 .contentItemList .video .column1 .videoInformationOuter .title,
      #videoExplorer .videoExplorerBody .videoExplorerContent .suggestVideo .video .column1 .videoInformationOuter .title {
        display: inline;
      }
      .videoExplorerMenu .quickSearchInput {
        background: none repeat scroll 0 0 #F4F4F4;
        border: 1px inset silver;
        left: 60px;
        padding-left: 4px;
        position: absolute;
        top: 2px;
        width: 180px;
      }
      .videoExplorerMenu.w_touch .quickSearchInput {
        top: 4px; font-size: 20px;
      }

      .videoExplorerContent .contentItemList                 .column4 .balloon {
        bottom: auto; top: 10px;
      }
      #videoExplorer .videoExplorerBody .videoExplorerContent.column1 .thumbnailContainer .balloon {
        top: -20px; {* 一列の時に「再生リストに追加しました」が上の動画に被るのを防ぐ *}
      }
      .videoExplorerContent .contentItemList                 .column1 .itemMylistComment {
        font-size: 85%; color: #666; border: 1px solid silver; border-radius: 8px; padding: 4px; margin: 0 2px; display: none;
      }
      .videoExplorerContent .contentItemList                 .column1 .nicorepoOwnerIconContainer {
        display: none;
      }
      .videoExplorerContent .contentItemList .nicorepoResult .column1 .nicorepoOwnerIconContainer {
        float: right; display: block;
        padding: 3px; border: 1px solid silver;
      }
      .videoExplorerContent .contentItemList                 .column1 .nicorepoOwnerIconContainer img {
        height: 48px;
      }

      .videoExplorerBody.dummyMylist #searchResultContainer .favMylistEditContainer,
      .videoExplorerBody.dummyMylist:not(.ranking) #searchResultMylistSortOptions,
      .videoExplorerBody.dummyMylist .favMylistEditContainer,
      .videoExplorerBody.dummyMylist:not(.ownerNicorepo) #searchResultHeader {
        display: none !important;
      }

      .videoExplorerContent .contentItemList .thumbnailHoverMenu {
        position: absolute; padding: 0; box-shadow: 1px 1px 2px black;
        display: none;
      }
      .videoExplorerContent .contentItemList .column1 .thumbnailHoverMenu {
        bottom:  4px; left: 4px;
      }
      .videoExplorerContent .contentItemList .column4 .thumbnailHoverMenu {
        bottom: 75px; left: 5px;
      }
      .videoExplorerContent .contentItemList .deleteFromMyMylist {
        cursor: pointer; font-size: 70%; border: 1px solid #ccc; padding: 0;
        display: none;
      }
      .videoExplorerContent .contentItemList .showLargeThumbnail {
        cursor: pointer; font-size: 70%; border: 1px solid #ccc;;
      }
      .videoExplorerContent .contentItemList .showLargeThumbnail {
        padding: 0 4px;
      }
      .videoExplorerContent .contentItemList .item:hover .thumbnailHoverMenu {
        display: block;
      }
      .videoExplorerContent .contentItemList .log-user-video-upload {
        background: #ffe; border-radius: 4px;
      }
      .videoExplorerContent .contentItemList .nicorepoResult .itemVideoDescription, .videoExplorerContent .contentItemList .nicorepoResult .videoTitle{
      }
      #videoExplorer.w_mylist .videoExplorerBody.enableMylistDeleteButton.isMine .videoExplorerContent .contentItemList .item:hover .deleteFromMyMylist {
        display: inline-block;
      }

      #playlist .generationMessage {
        cursor: pointer;
      }
      #playlist .generationMessage:hover {
        text-decoration: underline;
      }
      #playlist .generationMessage:after {
        content: "▼";
      }

      #yukkuriPanel {
        position: fixed; z-index: 1500; bottom: 0; left: 0; display: inline-block;
      }
      body.w_noNicoru .nicoru-button{
        left: -9999; display: none !important;
      }
      body.w_noNicoru .menuOpened #videoMenuTopList li.videoMenuListNicoru{
        display: none;
      }
      body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li {
        margin: 0 18px 4px 0;
      }
      body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li .tagControlContainer, body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li .tagControlEditContainer {
        padding: 1px 0;
      }

      .userProfile.w_touch {
        font-size: 150%; line-height: 120%;
      }
      .resultPagination.w_touch {
        font-size: 200%;
      }
      .resultPagination.w_touch li{
        padding: 4px 16px;
      }
      select.w_touch {
        font-size: 200%;
      }
      {* 真・browserFullモード *}
      body.full_with_browser.hideCommentInput #nicoplayerContainerInner {
        {* コメント入力欄は動画上表示にするのではなく、画面外に押し出す事によって見えなくする *}
        margin-top: -10px; margin-bottom: -36px;
      }
      body.full_with_browser.trueBrowserFull #nicoplayerContainerInner:not(.stageVideo) {
        margin-left: -2.5%; width: 105% !important;
      }
      body.full_with_browser.trueBrowserFull #playerContainerWrapper {
        margin: 0 !important;
      }
      body.full_with_browser.trueBrowserFull #playlist {
        display: none;
      }
      body.full_with_browser.trueBrowserFull:not(.w_fullScreenMenu) .mylistPopupPanel.fixed,body.full_with_browser.trueBrowserFull .yukkuriButton { display:none; }
      #trueBrowserFullShield {
        -webkit-transition: opacity 0.2s ease-out;
        position:absolute;
        display: none;
      }
      body.full_with_browser #trueBrowserFullShield {
        background: black;
        display: block;
        bottom: 100px;
        right:  50px;
        z-index: 10000;
        min-width: 400px;
        cursor: nw-resize;
        opacity: 0;
        color: white;
        box-shadow: 2px 2px 2px silver;
        border-radius: 4px;
      }
      body.full_with_browser #trueBrowserFullShield .title {
        color: #ffc; font-size: 120%;
      }
      body.full_with_browser #trueBrowserFullShield .ownerIcon {
        float: left; height: 55px; padding: 8px;
      }
      body.full_with_browser #trueBrowserFullShield:hover, body.full_with_browser #trueBrowserFullShield.active, body.w_fullScreenMenu #trueBrowserFullShield {
        opacity: 1;
      }
      body:not(.full_with_browser) #trueBrowserFullShield { display: none; }

      #sharedNgSettingContainer {
        display: inline-block; font-size: 80%; position: absolute; top: 0; left: 85px;
      }
      #sharedNgSetting {
        background: #ddd; border: 1px solid silver;
      }
      {* ニュース消す *}
      #content.noNews #textMarquee {
        display: none !important;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerTabWrapper {
        height: auto !important; position: absolute; bottom: 18px;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews              #playerTabContainer {
        bottom: -17px;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews .appli_panel #playerTabContainer {
        bottom:  20px;
      }
      #playerTabWrapper.w_videoInfo #playerTabContainer, #playerTabWrapper.w_ichiba #playerTabContainer, #playerTabWrapper.w_review #playerTabContainer {
        bottom: 0px !important;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerTabWrapper.w_videoInfo,
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerTabWrapper.w_ichiba,
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerTabWrapper.w_review
      {
        height: auto !important; position: absolute; bottom: 2px;
      }
     {* body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #leftPanel {
        height: auto !important; position: absolute; bottom: 2px;
      }*}
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerCommentPanel {
        height: 100% !important;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerContainer.appli_panel #appliPanel {
        bottom: -18px !important;
      }
      body:not(.videoExplorer):not(.setting_panel):not(.full_with_browser) #content.noNews #playerContainer {
        height: auto;
      }
      #outline.noNicommend #nicommendContainer, #outline.noIchiba  #nicoIchiba, #outline.noReview  #videoReviewPanel{
        display: none;
      }
      #bottomContentTabContainer.noBottom .outer, #bottomContentTabContainer.noBottom #pageFooter {
        display: none;
      }
      #bottomContentTabContainer.noBottom #outline {
        background: #141414; padding-top: 0; padding-bottom: 35px;
      }

      #content.w_flat #playerContainerWrapper, #content.w_flat #playlist .playlistInformation {
        background: #444;
      }
      #content.w_flat #leftPanel, #content.w_flat #playerCommentPanel {
        background: #ddd; border-radius: 0;
      }
      #content.w_flat .sideVideoInfo {
        border-radius: 0;
      }
     #content.w_flat #videoExplorerExpand a {
        text-shadow: none;
      }
      #content.w_flat #playerCommentPanel .section .commentTable .commentTableHeaderWrapper {
        background: gray;
      }

      body:not(.full_with_browser) #content.w_compact #videoHeader {
        width: 960px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact #videoHeader {
        width: 1186px;
      }
      .videoMenuToggle {
        -webkit-transform-origin: 100% 100%; -webkit-transition: -webkit-transform 0.4s;
        transform-origin: 100% 100%; transition: transform 0.4s;
        z-index: 1000;
      }
      #content.w_compact .videoHeaderTitle {
        letter-spacing: -1px;
      }
      #content.w_compact .videoDetailExpand .arrow {
        position: absolute; top: 8px; right: -24px;
      }
      #content.w_compact .tag1Line  .videoMenuToggle {
        transform: scale(0.8, 0.41); -webkit-transform: scale(0.8, 0.41);
      }
      #content.w_compact .tag2Lines .videoMenuToggle {
        transform: scale(0.8); -webkit-transform: scale(0.8);
      }
      #content.w_compact #topVideoInfo .parentVideoInfo {
        margin-top: -9px; margin-bottom: 9x;
      }
      #content.w_compact #topVideoInfo .parentVideoInfo .cct{
        margin-bottom: 0;
      }
      #content.w_compact #topVideoInfo .parentVideoInfo .videoThumb{
        margin-top: 4px;
      }
      #content.w_compact #topVideoInfo .ch_prof, #content.w_compact #topVideoInfo .userProfile {
        min-width: 297px; margin-top: -1px; border: 1px solid #e7e7e7;
      }
      #content.w_compact #videoHeaderDetail .videoDetailExpand{
        height: auto; padding: 0;
      }
      #content.w_compact #topVideoInfo .videoDescription.description {
        background: #fff; margin: 10px 0 0;padding: 4px ;width: 952px; {*font-size: 90%;*}
      }
      .size_normal #content.w_compact #videoDetailInformation .description {
        width: 1178px
      }
      #content.w_compact #topVideoInfo .videoMainInfoContainer{
        padding: 0;
      }
      #content.w_compact #videoDetailInformation{
        border-top: 0;
      }
      #content.w_compact #videoHeaderMenu .searchContainer {
        top: -16px;
      }
      #content.w_compact .videoInformation{
        margin: -4px 0 ;
      }
      #content.w_compact #topVideoInfo .videoStats {
        margin-bottom: 2px;
      }
      body:not(.full_with_browser) #content.w_compact #videoTagContainer{
        width: 900px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact #videoTagContainer{
        width: 1123px;
      }
      body:not(.full_with_browser) #content.w_compact #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit {
        width: 72px;
      }
      body:not(.full_with_browser) #content.w_compact #videoTagContainer .tagInner #videoHeaderTagList {
        padding-left: 85px;
      }
      body.full_with_browser #videoHeaderTagList { background: #fafafa; }
      #content.w_compact #topVideoInfo {
        margin: 4px 0 4px;
      }
      #content.w_compact #topVideoInfo .videoShareLinks .socialLinks {
        margin-top: -6px;
      }
      #outline.w_compact  #videoInfoHead{
        margin: 0 ;
      }
      #outline.w_compact .videoInformation #videoTitle {
        margin: -4px 0 0;
      }
      #outline.w_compact .videoInformation #videoStats  {
        margin-top: -4px;
      }
      #outline.w_compact .videoInformation #videoStats .ranking {
        margin: 0 0 4px;
      }
      #outline.w_compact #videoShareLinks {
        margin: 0;
      }
      #outline.w_compact #bottomVideoDetailInformation {
        margin: -18px 0 0;
      }
      #outline.w_compact .infoHeadOuter .videoEditMenuExpand {
        position: absolute; top: 0;
      }
      #outline.w_compact .videoEditMenu {
        margin: 0;
      }
      #outline.w_compact .videoDescription {
        font-size: 90%; margin-top: -8px; padding: 0 0 4px 4px;
      }
      #outline.w_compact #videoComment {
        margin: 0px; border: 1px solid silver; border-radius: 4px 4px 4px 4px; padding: 0 4px;
      }
      #outline.w_compact #videoComment h4{
        padding-left: 4px;
      }
      #outline.w_compact .videoMainInfoContainer {
        border-bottom: 0; margin-bottom: 0;
      }
      #outline.w_compact {
        border-bottom: 0; margin-bottom: 0;
      }
      #outline.w_compact #nicommendList {
        margin-top: 4px;
      }
      #outline.w_compact .sidebar { width: 300px; }

      #outline.w_compact .outer {
        {* 左パネルを隠した標準サイズのプレイヤーに合わせる *}
        width: 960px;
      }
      #outline.w_compact #ichibaMain dl.ichiba_mainitem {
        margin: 0 22px 30px 0;
      }
      #footer     { z-index: 1; }

      body.en-us #playerAlignmentArea, body.zh-tw #playerAlignmentArea {
        {*padding-right: 0;*}
      }
      #footer .toggleBottom {
        cursor: pointer; text-align: center; width: 200px; padding: 0px 12px; margin: auto; border-radius: 16px 16px 0 0;
        border: 1px solid #333; background: #666; transition: background 0.4s ease-out, box-shadow 0.4s;
      }
      #footer:hover .toggleBottom {
        border: 1px outset; background: #ccc;
      }
      #footer .toggleBottom:hover {
        box-shadow: 0px 0px 8px #fff;
      }
      #footer.noBottom .toggleBottom {
        border-radius: 0 0 16px 16px;
      }
      #footer .toggleBottom .openBottom, #footer.noBottom .toggleBottom .closeBottom  {
        display: none;
      }
      #footer.noBottom .toggleBottom .openBottom {
        display: block;
      }
      #footer .toggleBottom>div {
        -webkit-transform: scaleX(3); transform: scaleX(3);
      }
      #footer .toggleBottom {
        cursor: pointer; text-align: center; width: 200px; padding: 0px 12px; margin: auto; border-radius: 16px 16px 0 0;
        border: 1px solid #333; background: #666; transition: background 0.4s ease-out, box-shadow 0.4s;
      }
      #footer:hover .toggleBottom {
        border: 1px outset; background: #ccc;
      }
      #footer .toggleBottom:hover {
        box-shadow: 0px 0px 8px #fff;
      }

      #foot_inner { width: 960px; }
      .size_normal #foot_inner { width: 1186px; }
      #footer.noBottom #foot_inner { padding: 0; }
      #footer.noBottom a:nth-of-type(3):after, #footer.noBottom a:nth-of-type(6):after  {
        content: ' | '; color: white;
      }
      #footer.noBottom br { display: none; }
       html { background: #141414; }
      .animateBlink {
        -webkit-transition: 1s ease-in; transition: 1s ease-in;
      }

      .w_compact .toggleDetailExpand, .w_compact .shortVideoInfo {
        display: none;
      }
      .videoDetailToggleButton {
        cursor: pointer;
      }
      #leftPanel {
        {*border-radius: 4px 4px 4px 4px;*}
        display: none; padding: 0; position: absolute; text-align: left; top: 0; z-index: 101;
      }
      body.ja-jp #leftPanel { display: none; }
      body:not(.videoExplorer) #leftPanel { display: none; }


      body.full_with_browser #playerTabWrapper, body.full_with_browser:not(.videoExplorer) #playerTabWrapper.w_wide {
        top: auto !important; bottom: 3000px !important; right: 50px !important;
        transition: bottom 0.2s ease-out; max-height: 500px;
      }
      body.full_with_browser.w_fullScreenMenu:not(.videoExplorer) #playerTabWrapper {
        top: auto !important; bottom:  200px !important; right: 50px !important;
      }

      #fullScreenMenuContainer { display: none; }
      body.full_with_browser #fullScreenMenuContainer {
        display: block; position: absolute; bottom: 3000px; left: 50px; z-index: 1;
        background: #fff; cursor: pointer; transition: bottom 0.2s ease-out;
      }
      body.full_with_browser.w_fullScreenMenu #fullScreenMenuContainer {
        bottom: 100px;
      }

      #fullScreenMenuContainer .button {
        cursor: pointer; transition: color 0.4s ease-out;
      }
      #fullScreenMenuContainer .modeStatus { display: none; font-weight: bolder; }
      body.trueBrowserFull       #fullScreenMenuContainer .fullScreenModeSwitch { color: blue; }
      body:not(.trueBrowserFull) #fullScreenMenuContainer .fullScreenModeSwitch .mode_normal,
      body.trueBrowserFull       #fullScreenMenuContainer .fullScreenModeSwitch .mode_noborder { display: inline; }

      #nicoplayerContainerInner.stageVideo       #fullScreenMenuContainer .stageVideoSwitch { color: blue; }
      #nicoplayerContainerInner:not(.stageVideo) #fullScreenMenuContainer .stageVideoSwitch .mode_off,
      #nicoplayerContainerInner.stageVideo       #fullScreenMenuContainer .stageVideoSwitch .mode_on { display: inline; }


      body.full_with_browser.w_fullScreenMenu .videoHeaderOuter {
        position: absolute; z-index: 1000; width: 100%;
      }
      body.full_with_browser.w_fullScreenMenu #videoTagContainer { width: 100%; }

      .popupMarqueeContent {
        background: black;
      }

      #videoExplorer, #playlist {
        transition: margin-left 0.2s ease-in-out;
      }

      .dummyMylist .editFavorite, .dummyMylist .mylistDetail .mylistNameContainer {
        display: none;
      }

      {* 不要な時まで横スクロールバーが出てしまうので *}
      #songrium_inline { overflow: hidden; }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]
        .replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
    addStyle(__css__, 'watchItLaterStyle');
  })(); // end of watchItLaterStyle





  conf.load = function() {
    try {
      function loadStorage(key, def) {
        if (window.localStorage[key] === undefined) { return def; }
        return JSON.parse(window.localStorage.getItem(key));
      }

      for (var v in conf) {
        if (typeof conf[v] === 'function') { continue; }
        conf[v] = loadStorage('watchItLater_' + v, conf[v]);
      }
    } catch (e) {
    }
  };

  conf.getValue = function(varName) {
    return conf[varName];
  };
  conf.setValue = function(k, v) {
    var lastValue = conf[k];
    if (lastValue !== v) {
      conf[k] = v;
      window.localStorage.setItem('watchItLater_' + k, JSON.stringify(v));
      EventDispatcher.dispatch('on.config.' + k, v, lastValue);
    }
  };
  conf.load();

  var ConfigPanel = (function(conf, w) {
    var pt = function(){};
    var $panel = null, $shadow = null;
    var menus = [
      {title: '再生開始・終了時の設定', className: 'videoStart'},
      {title: '自動で全画面モードにする', varName: 'autoBrowserFull',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: '自動全画面化オンでも、ユーザーニコ割のある動画は', varName: 'disableAutoBrowserFullIfNicowari',
        values: {'全画面化しない': true, '全画面化する': false}},
      {title: '自動で検索画面にする(自動全画面化オフ時)', varName: 'autoOpenSearch',
        values: {'する': true, 'しない': false}},
      {title: '動画の位置に自動スクロール(自動全画面化オフ時)', varName: 'autoScrollToPlayer',
        values: {'する': true, 'しない': false}},
      {title: '終了時に全画面モードを解除(原宿と同じにする)', varName: 'autoNotFull',
        values: {'する': true, 'しない': false},
        description: '連続再生中は解除しません'},
      {title: 'ウィンドウがアクティブの時だけ自動再生する', varName: 'autoPlayIfWindowActive',
        description: 'QWatch側の設定パネルの自動再生はオフにしてください。\n■こんな人におすすめ\n・自動再生ONにしたいけど別タブで開く時は自動再生したくない\n・複数タブ開いたままブラウザ再起動したら全部のタブで再生が始まって「うるせー！」という経験のある人',
        values: {'する': 'yes', 'しない': 'no'}},
      {title: '動画が切り替わる時、ポップアップで再生数を表示', varName: 'popupViewCounter',
        description: '全画面状態だと再生数がわからなくて不便、という時に',
        values: {'する': 'always', '全画面時のみ': 'full', 'しない': 'none'}},
      {title: '終了時に自動でニコメンドを開く', varName: 'playerTabAutoOpenNicommend',
        values: {'開かない': 'disable', '中身がある時だけ開く': 'auto', '開く': 'enable'}},

      {title: 'プレイヤーの設定', className: 'playerSetting'},
//      {title: 'コメントパネルを広くする', varName: 'wideCommentPanel',
//        values: {'する': true, 'しない': false}},
      {title: 'コメントパネルにNG共有設定を表示', varName: 'enableSharedNgSetting',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: 'コメントの表示', varName: 'commentVisibility',
        values: {'オフ': 'hidden', '最後の状態を記憶': 'lastState', 'オン': 'visible'}},
      {title: '右のパネルに動画情報・市場・レビューを表示', varName: 'rightPanelJack', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'ページのヘッダに再生数表示', varName: 'headerViewCounter', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'ニコニコニュースの履歴を保持する', varName: 'enableNewsHistory', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'ニコニコニュースを消す', varName: 'hideNicoNews',
        values: {'消す': true, '消さない': false}},
      {title: 'コメントの盛り上がりをグラフ表示', varName: 'enableHeatMap', reload: true,
        description: '動画のどのあたりが盛り上がっているのか、わかりやすくなります',
        values: {'する': true, 'しない': false}},
      {title: 'プレイリスト消えないモード(実験中)', varName: 'storagePlaylistMode', reload: true,
        description: '有効にすると、リロードしてもプレイリストが消えなくなります。',
        values:
          (conf.debugMode ?
            {'ウィンドウを閉じるまで': 'sessionStorage', 'ずっと保持': 'localStorage', 'しない': ''} :
            {'有効(ウィンドウを閉じるまで)': 'sessionStorage', '無効': ''})
      },

      {title: '検索モードの設定', className: 'videoExplorer'},
      {title: 'プレイヤーをできるだけ大きくする (コメントやシークも可能にする)', varName: 'videoExplorerHack', reload: true,
        description: '便利ですがちょっと重いです。\n大きめのモニターだと快適ですが、小さいといまいちかも',
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りタグを表示', varName: 'enableFavTags', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りマイリストを表示', varName: 'enableFavMylists', reload: true,
        description: '更新のあったリストが上に来るので、新着動画のチェックに便利です。',
        values: {'する': true, 'しない': false}},
      {title: 'サムネを4:3にする', varName: 'squareThumbnail',
        description: '上下がカットされなくなり、サムネの全体が見えるようになります。',
        values: {'する': true, 'しない': false}},
      {title: '「マイリストから外す」ボタンを表示', varName: 'enableMylistDeleteButton',
        description: 'マイリストの整理に便利。\n ※ 消す時に確認ダイアログは出ないので注意',
        values: {'する': true, 'しない': false}},
      {title: '検索時に関連タグを表示する', varName: 'enableRelatedTag',
        values: {'する': true,  'しない': false}},
      {title: 'niconico新検索βを使う', varName: 'searchEngine',
        description: '投稿期間や動画長による絞り込みができるようになります',
        values: {'使う': 'sugoi',  '使わない': 'normal'}},

      {title: '全画面モードの設定', className: 'fullScreen'},
      {title: '操作パネルとコメント入力欄を隠す', varName: 'controllerVisibilityInFull',
        description: '全画面の時は少しでも動画を大きくしたい場合に便利',
        values: {'隠す': 'hidden', '隠さない': ''}},
      {title: '右下のマイリストメニュー', varName: 'hideMenuInFull',
        values: {'完全に消す': 'hideAll', '色だけ変える': '', '目立たなくする': 'hide'}},
      {title: 'ホイールを回したら動画情報を出す', varName: 'enableFullScreenMenu',
        description: 'ホイールを大きく下に回すとメニューが出ます。タッチパネルも対応',
        values: {'する': true, 'しない': false}},

      {title: 'ページ下半身の設定', className: 'playerBottom'},
      {title: 'ニコメンドの位置', varName: 'nicommendVisibility',
        values: {'非表示': 'hidden', '市場の下': 'underIchiba', '市場の上(標準)': 'visible'}},
      {title: 'ニコニコ市場の表示', varName: 'ichibaVisibility',
        values: {'非表示': 'hidden', '表示': 'visible'}},
      {title: 'レビューの表示', varName: 'reviewVisibility',
        values: {'非表示': 'hidden', '表示': 'visible'}},

      {title: '省スペース設定', className: 'compact'},
      {title: 'タグが2行以内の時に高さを詰める(ピン留め時のみ)', varName: 'enableAutoTagContainerHeight', reload: true,
        values: {'詰める': true, '詰めない': false}},
      {title: '動画情報の空きスペースを詰める', varName: 'compactVideoInfo',
        description: '原宿ぐらいの密度になります。ちょっと窮屈かも',
        values: {'詰める': true, '詰めない': false}},
      {title: 'グラデーションや角の丸みをなくす', varName: 'flatDesignMode',
        description: '軽い表示になります',
        values: {'なくす': 'on', 'なくさない': ''}},
      {title: '「ニコる」をなくす', varName: 'noNicoru',
        description: '画面上から見えなくなります。',
        values: {'なくす': true, 'なくさない': false}},

      {title: 'その他の設定', className: 'otherSetting'},
      {title: '動画リンクにカーソルを重ねたらメニューを表示', varName: 'enableHoverPopup', reload: true,
        description: 'マウスカーソルを重ねた時に出るのが邪魔な人はオフにしてください',
        values: {'する': true, 'しない': false}},
      {title: '動画リンクにカーソルを重ねてからメニューが出るまでの時間(秒)', varName: 'hoverMenuDelay',
       type: 'text', description: '単位は秒。 標準は0.4です'},
      {title: 'ニコレポのポップアップを置き換える(実験中)',       varName: 'replacePopupMarquee', reload: true,
        description: '画面隅に出るポップアップの不可解な挙動を調整します',
        values: {'する': true, 'しない': false}},
      {title: 'ゆっくり再生(スロー再生)ボタンを表示', varName: 'enableYukkuriPlayButton',
        values: {'する': true, 'しない': false}},
      {title: '検索時のデフォルトパラメータ', varName: 'defaultSearchOption', type: 'text',
       description: '常に指定したいパラメータ指定するのに便利です\n例: 「-グロ -例のアレ」とすると、その言葉が含まれる動画が除外されます'},
      {title: '「@ジャンプ」を無効化', varName: 'ignoreJumpCommand', reload: true,
        description: '勝手に他の動画に飛ばされる機能を無効化します。',
        values: {'する': true, 'しない': false}},
      {title: '「@ジャンプ」によるシーク無効化(無限ループなど)', varName: 'nicoSSeekCount', reload: true,
        description: '完全に無効にする以外に、一動画あたりの回数を指定できます',
        values: {'2回まで有効': 2, '1回まで有効': 1, '完全無効化': 0, 'しない': -1}},
      {title: 'タッチパネル向けモード(画面を右フリックで開始)', varName: 'enableQTouch',
        description: '指で操作しやすいように、一部のボタンやメニューが大きくなります',
        values: {'使う': true, '使わない': false}},

      {title: 'マウスとキーボードの設定', description: '※Chromeはコメント入力中も反応してしまいます', className: 'shortcut'},
      {title: '背景ダブルクリックで動画の位置にスクロール', varName: 'doubleClickScroll',
        description: 'なにもない場所をダブルクリックすると、動画の位置にスクロールします。\n 市場を見てからプレイヤーに戻りたい時などに便利',
        values: {'する': true, 'しない': false}},
      {title: 'マウスのボタン＋ホイールでどこでも音量調整', varName: 'mouseClickWheelVolume',
        description: 'とっさに音量を変えたい時に便利',
        values: {'左ボタン＋ホイール': 1, '右ボタン＋ホイール': 2, '使わない': 0}},
      {title: 'とりあえずマイリスト登録',       varName: 'shortcutDefMylist',          type: 'keyInput'},
      {title: 'マイリスト登録',                 varName: 'shortcutMylist',             type: 'keyInput',
        description: '右下で選択中のマイリストに登録'},
      {title: 'とりあえずマイリストを開く',           varName: 'shortcutOpenDefMylist',      type: 'keyInput'},
      {title: '動画投稿者の関連動画を開く',           varName: 'shortcutShowOtherVideo',     type: 'keyInput'},
      {title: '検索画面を開く',                       varName: 'shortcutOpenSearch',         type: 'keyInput'},
      {title: '関連動画(オススメ)を開く',             varName: 'shortcutOpenRecommend',      type: 'keyInput'},
      {title: 'コメント表示ON/OFF',                   varName: 'shortcutCommentVisibility',  type: 'keyInput'},
      {title: 'プレイヤーの位置までスクロール',       varName: 'shortcutScrollToNicoPlayer', type: 'keyInput'},
      {title: 'ミュート',                             varName: 'shortcutMute',               type: 'keyInput'},
      {title: 'コメントの背面表示ON/FF',              varName: 'shortcutDeepenedComment',    type: 'keyInput'},
      {title: 'ハードウェアアクセラレーションON/FF',  varName: 'shortcutToggleStageVideo',   type: 'keyInput'},


      {title: '実験中の設定', debugOnly: true, className: 'forDebug'},
      {title: 'プレイリスト消えないモード(※実験中)',       varName: 'hashPlaylistMode', debugOnly: true, reload: true,
        values: {'有効(連続再生中のみ)': 1, '有効(常時)': 2, '無効': 0}}

    ];

    var listener = [];
    function dispatchEvent(name, value, lastValue) {
      for (var i = 0; i < listener.length; i++) {
        (listener[i])(name, value, lastValue);
      }
    }
    pt.createPanelDom = function() {
      if ($panel === null) {
        $panel = w.jQuery([
          '<div id="watchItLaterConfigPanel">',
          '<div class="head"><button class="closeButton" title="閉じる">▲</button><h2>WatchItLaterの設定</h2>(※)のつく項目は、リロード後に反映されます</div>',
          '<div class="inner"></div></div>'
        ].join(''));

        var scrollTo = function() {
          var $target = this;
          var isOpen = $target.parent().toggleClass('open').hasClass('open');
          if (isOpen) {
            setTimeout(function() {
              var $inner = $('#watchItLaterConfigPanel .inner');
              $inner.animate({
                scrollTop: $inner.scrollTop() + $target.parent().position().top - 50
              }, 400);
            }, 200);
          }
        };

        var $ul = null, $inner = $panel.find('.inner'), $item; //$panel.find('ul'), $item;
        for (var i = 0, len = menus.length; i < len; i++) {
          if (menus[i].varName) {
            $item = this.createMenuItem(menus[i]);
          } else {
            if (menus[i].description) {
             $item = $('<li class="section ' +menus[i].className + '"><div><span>'+ menus[i].title + '</span><span class="description">'+ menus[i].description + '</span></div></li>');
            } else {
              $item = $('<li class="section ' +menus[i].className + '"><div><span>'+ menus[i].title + '</span></div></li>');
            }
            if ($ul) $inner.append($ul);
            $ul =$('<ul class="sectionContainer"/>').addClass(menus[i].className + 'Container');
            $item.click($.proxy(scrollTo, $item));
          }
          $item.toggleClass('debugOnly', menus[i].debugOnly === true).toggleClass('reload', menus[i].reload === true);
          if ($ul) $ul.append($item);
        }
        if ($ul) $inner.append($ul);
        $panel.toggleClass('debugMode', conf.debugMode);
        var $bottom = w.jQuery('<div class="foot"></div>'), self = this;
        $panel.append($bottom);
        $panel.find('.closeButton').click(function() {
          self.close();
        });
        if ($shadow === null) {
          $shadow = $('<div id="watchItLaterConfigPanelShadow" /><div id="watchItLaterConfigPanelShadowTop"/><div id="watchItLaterConfigPanelOverShadow"/>');
        }
      }
    };

    pt.refresh = function() {
      var isVisible = $panel.hasClass('open');
      $panel.remove().empty();
      $panel = null;
      this.createPanelDom();
      if (isVisible) { $panel.show(); }
    };

    pt.createMenuItem = function(menu) {
      if (menu.type === 'text') {
        return this.createTextMenuItem(menu);
      } else
      if (menu.type === 'keyInput') {
        return this.createKeyInputMenuItem(menu);
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
      if (menu.addClass) { $panel.addClass(menu.varName + '_' + currentValue);}
      for (var k in values) {
        var v = values[k];
        var $label = w.jQuery('<label></label>');
        var $chk = w.jQuery('<input>');
        $chk.attr({type: 'radio', name: varName, value: JSON.stringify(v)});

        if (currentValue === v) {
          $chk.attr('checked', 'checked');
        }
        $chk.click(function() {
          var newValue = JSON.parse(this.value), oldValue = conf.getValue(varName);
          if (oldValue !== newValue) {
            if (menu.addClass) {
              $panel.removeClass(menu.varName + '_' + oldValue).addClass(menu.varName + '_' + newValue);
            }
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
      var title = menu.title, varName = menu.varName;
      var $menu = w.jQuery('<li><p class="title">' + title + '</p></li>');
      if (menu.className) { $menu.addClass(menu.className);}
      if (menu.description) { $menu.attr('title', menu.description); }
      var currentValue = conf.getValue(varName);
      var $input = w.jQuery('<input type="text" />');
      $menu.addClass(menu.varName);
      if (menu.addClass) { $panel.addClass(menu.varName + '_' + currentValue);}
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

    pt.createKeyInputMenuItem = function(menu) {
      var title = menu.title, varName = menu.varName;
      var currentValue = conf.getValue(varName), currentKey = currentValue.char;

      function update() {
        var newValue = {char: $sel.val(), ctrl: $menu.hasClass('ctrl'), alt: $menu.hasClass('alt'), shift: $menu.hasClass('shift'), enable: $menu.hasClass('enable')};
        conf.setValue(varName, newValue);
        if (typeof menu.onchange === 'function') {
          menu.onchange(newValue);
        }
        dispatchEvent(menu.varName, newValue, conf.getValue(varName));
      }

      var $menu = w.jQuery('<li class="shortcutSetting"><p class="title">' + title + '</p></li>');
      var sel = ['<select>'], $sel;
      for (var v = 48; v <= 90; v++) {
        if (v >= 0x3c && v <= 0x3f) continue;
        var c = String.fromCharCode(v);
        var op = ['<option value="', c, '">', c, '</option>'  ].join('');
        sel.push(op);
      }
      sel.push('</select>');
      $sel = w.jQuery(sel.join(''));
      var $meta = w.jQuery('<span class="enable" data-meta="enable">有効</span><span class="ctrl" data-meta="ctrl">ctrl</span><span class="alt" data-meta="alt">alt</span><span class="shift" data-meta="shift">shift</span>').on('click', function(e) {
          var meta = w.jQuery(e.target).attr('data-meta');
          $menu.toggleClass(meta);
          update();
      });
      $sel.change(update);

      $menu.toggleClass('enable', currentValue.enable).toggleClass('ctrl', currentValue.ctrl).toggleClass('alt', currentValue.alt).toggleClass('shift', currentValue.shift);
      $sel.val(currentKey);

      if (menu.className) { $menu.addClass(menu.className);}
      if (menu.description) { $menu.attr('title', menu.description); }

      $menu.append(w.jQuery('<span/>').append($meta).append($sel));

      return $menu;
    };

    pt.toggleOpenSection = function(sectionName, toggle) {
      $('#watchItLaterConfigPanel .'+ sectionName + 'Container').toggleClass('open', toggle);
      $('#watchItLaterConfigPanel .inner').scrollTop($('#watchItLaterConfigPanel .' + sectionName).position().top - 50);
    };

    pt.addChangeEventListener = function(callback) {
      listener.push(callback);
    };
    pt.open = function()  {
      w.jQuery('body').append($shadow).append($panel);
      setTimeout(function() {
        $shadow.addClass('open'); $panel.addClass('open');
      }, 50);
      setTimeout(function() {
        if (WatchController.isFullScreen()) {
          pt.toggleOpenSection('fullScreen', true);
        }
      }, 1000);
    };
    pt.close = function() {
      $shadow.removeClass('open'); $panel.removeClass('open');
      setTimeout(function() {
        $shadow.detach(); $panel.detach();
      }, 800);
    };
    pt.toggle = function() {
      this.createPanelDom();
      if ($panel.hasClass('open')) {
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
  var WatchItLater = {
    config: {
      get: function(varName) {
        return conf.getValue(varName);
      },
      set: function(varName, value) {
        conf.setValue(varName, value);
      }
    },
    test: {
      assert: function(v, m) {
        if (v === true) {
          console.log('%c OK: ',  'color: black; background: lime;',  m);
        } else {
          console.log('%cFail: ', 'color: white; background: red;',   m);
          throw {message: 'Fail'};
        }
      },
      expect: function(a) {
        try {
          var assert = WatchItLater.test.assert, exp = {
            toBeTrue:    function(   desc) { assert(a === true      , desc); },
            toBeFalse:   function(   desc) { assert(a === false     , desc); },
            toEqual:     function(b, desc) { assert(a === b         , desc); },
            toBeNull:    function(   desc) { assert(a === null      , desc); },
            toBeNotNull: function(   desc) { assert(a !== null      , desc); },
            toBeDefined: function(   desc) { assert(a !== undefined , desc); },
            toBeTruthy:  function(   desc) { assert(a ? true : false, desc); }
          };
          return exp;
        } catch(e) {
          console.log('%c', a);
        }
      },
      spec: {},
      run: function(name) {
        if (name) {
          console.log('%c run : ' + name, 'background: #8ff;');
          $.proxy(this.spec[name], this)();
          return;
        }
        for(var v in this.spec) {
          if (!v.match(/^test/)) continue;
          try {
            $.proxy(this.spec[v], this)();
          } catch (e) {
            console.log('%cException: test=' + v + ';', 'color: white; background: red;', e);
            console.trace();
          }
        }
      }
    }
  };
  w.WatchItLater = WatchItLater;


  var EventDispatcher = (function(conf, w) {
    var events = {};

    function addEventListener(name, callback) {
      name = name.toLowerCase();
      if (!events[name]) {
        events[name] = [];
      }
      events[name].push(callback);
    }

    function _dispatch(name) {
      name = name.toLowerCase();
      if (!events[name]) { return; }
      var e = events[name];
      for (var i =0, len = e.length; i < len; i++) {
        try {
          e[i].apply(null, Array.prototype.slice.call(arguments, 1));
        } catch (ex) {
          console.log('%c' + name, 'background:red; color: white;', i, e[i], ex);
        }
      }
    }
     function dispatch(name) {
      if (conf.debugMode) console.log('%cevent:', 'background: blue; color: white;', name, arguments);
      _dispatch.apply(null, arguments);
    }
    return {
      addEventListener: addEventListener,
      dispatch: dispatch,
      _dispatch: _dispatch // コンソール汚したくない用
    };
  })(conf, w);
  WatchItLater.event = EventDispatcher;

  /*
  * 通算視聴回数をカウント。 カウントしても意味はないけど、どれだけ無駄な時間を費やしたかを知りたくて実装。
  */
  var WatchCounter = (function(conf, w) {
    var key = 'watchItLater_watchCounter';
    function get() {
      return JSON.parse(w.localStorage.getItem(key));
    }
    function add() {
      var v = get() + 1;
      w.localStorage.setItem(key, JSON.stringify(v));
      if (conf.debugMode) console.log('%cwatchCounter: %c%d', 'color: orange;', 'font-weight: bolder;', v);
      return v;
    }
    var self ={
      get: get,
      add: add
    };
    return self;
  })(conf, w);
  WatchItLater.counter = WatchCounter;

  /**
   *  動画タグ取得とポップアップ
   *
   */
  var VideoTags = (function(conf, w){

    var host = location.host.replace(/^([\w\d]+)\./, 'www.');
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
          if (typeof callback === "function") callback(result.status, result);
        }
      };
      GM_xmlhttpRequest(req);
    };

    pt.hidePopup = function() {
      if (lastPopup) {
        lastPopup.style.display = 'none';
      }
    };

    var uniq = null, $history = null, popupContainer = null;
    pt.popupItems = function(watchId, baseX, baseY) {
      var self = this;
      popupContainer.innerHTML = '';
      this.get(watchId, function(status, resp) {
        if (status === 'ok') {
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
        popupContainer.appendChild(popup);
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
          if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey || e.target.className === 'icon' || e.target.tagName === 'A') {
            return;
          }
          this.style.display = 'none';
          e.preventDefault();
          e.stopPropagation();
        }, false);
        return popup;
      }


      function appendTagHistory(dom, text, dic) {
        var $ = w.$;
        if (uniq === null) {
          uniq = {};
          $history = $('<div class="tagSearchHistory"><h3 class="title">タグ検索履歴</h3></div>');
          $history.css({width: $('.videoExplorerMenu').width() - 8, maxHeight: '300px', overflowY: 'auto'});
          $('.videoExplorerMenu').append($history);
        }
        if (!uniq[text]) {
          var a = $(dom).clone().css({marginRight: '8px', fontSize: '80%'}).click(function(e) {
            if (e.button !== 0 || e.metaKey) return;
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

        // 大百科アイコン
        var dic = createDicIconDOM(tag, text);
        li.appendChild(dic);

        // 新検索(search.nicovideo.jp)へのリンク
        var newSearchIcon = createNewSearchIconDOM(tag, text);
        li.appendChild(newSearchIcon);

        // 本文リンク
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(text));

        var href = text;
        if (conf.defaultSearchOption && conf.defaultSearchOption !== '' && !text.match(/(sm|nm|so)\d+/)) {
          href += ' ' + conf.defaultSearchOption;
        }
        var sortOrder = '?sort=' + conf.searchSortType + '&order=' + conf.searchSortOrder;
        a.href = 'http://' + host + '/tag/' + encodeURIComponent(href) + sortOrder;
        a.addEventListener('click', function(e) {
          if (e.button !== 0 || e.metaKey) return;
          if (w.WatchApp) {
            WatchController.nicoSearch(text);
            e.preventDefault();
            appendTagHistory(a, text, dic);
          }
          return false;
        }, false);
        li.appendChild(a);

        return li;
      }

      function createNewSearchIconDOM(tag, text) {
        var link = document.createElement('a');
        link.className = 'newsearch';
        link.title     = 'niconico新検索で開く';

        // TODO: パラメータの対応表作ってあわせる
        var newSortOrder = '';
        link.href = 'http://search.nicovideo.jp/video/search/' + encodeURIComponent(text) + newSortOrder;
        if (location.host !== 'search.nicovdieo.jp') {
          link.target = '_blank';
        }

        var icon = document.createElement('img');
        icon.className = 'icon';
        icon.src = 'http://uni.res.nimg.jp/img/favicon.ico';
        link.appendChild(icon);

        return link;
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
    popupContainer = document.createElement('div');
    popupContainer.id = 'videoTagPopupContainer';
    document.body.appendChild(popupContainer);

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
      if (!isNativeGM && host !== location.host) return null; //
      var _token = (w.NicoAPI) ? w.NicoAPI.token : (w.WatchApp ? w.WatchApp.ns.init.CommonModelInitializer.watchInfoModel.csrfToken : '');
      if (_token === null && w.FavMylist && w.FavMylist.csrf_token) _token = w.FavMylist.csrf_token;
      if (_token !== '') {
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
      if (!isNativeGM && host !== location.host) {
        initialized = true;
        return;
      }
      token = getToken();
      var url = 'http://' + host + '/api/watch/uservideo?user_id=' + uid;
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (result.status === "ok" && result.list) {
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
        //console.log('mylist.ismine?', mylistlist[i].id, id);
        if (mylistlist[i].id == id) { return true; }
      }
      return false;
    };

    pt.reloadDefList = function(callback) {
      var url = 'http://' + host + '/api/deflist/list';
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          try {
            JSON.parse(resp.responseText);
          } catch (e) {
            console.log(e);
            console.log(resp.responseText);
          }
          if (!resp.responseText) return;
          var result = JSON.parse(resp.responseText);
          if (result.status === "ok" && result.mylistitem) {
            defListItems = result.mylistitem;
            if (typeof callback === "function") callback(defListItems);
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
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var result = JSON.parse(resp.responseText);
          if (result.status === "ok" && result.mylistitem) {
            mylistItems[groupId] = result.mylistitem;
            if (typeof callback === "function") callback(result.mylistitem);
          }
        }
      });
    };

    pt.clearMylistCache = function(groupId) {
      delete mylistItems[groupId];
    };

    pt.reloadMylist = function(groupId, callback) {
      this.clearMylistCache(groupId);
      return this.loadMylist(groupId, callback);
    };


    pt.findDefListByWatchId = function(watchId) {
//      if (/^[0-9]+$/.test(watchId)) return watchId; // スレッドIDが来た

      for (var i = 0, len = defListItems.length; i < len; i++) {
        var item = defListItems[i], wid = item.item_data.watch_id;
        if (wid == watchId) return item;
      }
      return null;
    };

    pt.findMylistByWatchId = function(watchId, groupId) {
//      if (/^[0-9]+$/.test(watchId)) return watchId; // スレッドIDが来た
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
          if (typeof callback === "function") callback(result.status, result);
          dispatchEvent('defMylistUpdate');
        }
      };
      GM_xmlhttpRequest(req);
      return true;
    };

    pt.addDefListItem = function(watchId, callback, description) {
      var url = 'http://' + host + '/api/deflist/add';

      // 例えば、とりマイの300番目に登録済みだった場合に「登録済みです」と言われても探すのがダルいし、
      // 他の動画を追加していけば、そのうち押し出されて消えてしまう。
      // なので、重複時にエラーを出すのではなく、「消してから追加」することによって先頭に持ってくる。
      // 「重複してたら先頭に持ってきて欲しいな～」って要望掲示板にこっそり書いたりしたけど相手にされないので自分で実装した。
      var data = "item_id=" + watchId + "&token=" + token, replaced = true;
      if (description) {
        data += '&description='+ encodeURIComponent(description);
      }

      var _add = function(status, resp) {
        var req = {
          method: 'POST',
          data: data,
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded' }, // これを忘れて小一時間はまった
          onload: function(resp) {
            var result = JSON.parse(resp.responseText);
            if (typeof callback === "function") callback(result.status, result, replaced);
          }
        };
        GM_xmlhttpRequest(req);
      };
      // とりあえずマイリストにある場合はdeleteDefListItem()のcallbackで追加、ない場合は即時追加
      if (!this.deleteDefListItem(watchId, _add)) {
        replaced = false;
        _add();
        dispatchEvent('defMylistUpdate');
      }
    };

    pt.addMylistItem = function(watchId, groupId, callback, description) {
      var self = this;
      var url = 'http://' + host + '/api/mylist/add';
      var data = ['item_id=', watchId,
                  '&group_id=', groupId,
                  '&item_type=', 0, // video=0 seiga=5
                  '&description=', (typeof description === 'string') ? encodeURIComponent(description) : '',
                  '&token=', token
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
            if (typeof callback === "function") callback(result.status, result);
            dispatchEvent('mylistUpdate', {action: 'add', groupId: groupId, watchId: watchId});
            //self.clearMylistCache(groupId);
          },
          error: function() {
            Popup.alert('ネットワークエラー');
          }
        };
        GM_xmlhttpRequest(req);
      };
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
          url = 'http://' + host + '/api/mylist/delete',
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
              if (typeof callback === "function") callback(result.status, result);
              dispatchEvent('mylistUpdate', {action: 'delete', groupId: groupId, watchId: watchId});
            },
            error: function() {
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
      if (isNativeGM || host === location.host) {
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
          var isThreadId = (/^[0-9]+$/.test(w));

          this.clearExtElement();
          deleteDef.disabled = false;
          if (self.findDefListByWatchId(w)) {
            deleteDef.style.display = '';
          } else {
            deleteDef.style.display = 'none';
          }
          if (isThreadId) {
            tagBtn.style.display = 'none'; // スレッドIDから動画IDを取る手段がないためタグ取得が難しい
          } else {
            tagBtn.style.display = '';
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
        appendO(sel, '0:とりマイ', 'default');
        sel.selectedIndex = 0;
        setTimeout(function() {
          for (var i = 0, len = mylistlist.length; i < len; i++) {
            var mylist = mylistlist[i];
            appendO(sel, (i + 1).toString(36) + ':' +  mylist.name, mylist.id);
          }
        }, initialized ? 0 : 3000);
        sel.addEventListener('change', function() {
          // jQueryは全てのページにあるわけではないので気をつける
          if (sel.selectedIndex === 0) {
            body.className = body.className.replace('mylistSelected', 'deflistSelected');
          } else {
            body.className = body.className.replace('deflistSelected', 'mylistSelected');
          }
        }, false);

        function ondblclick() {
          sel.selectedIndex = 0;
          body.className = body.className.replace('mylistSelected', 'deflistSelected');
        }
        if (w.jQuery) {
          w.jQuery(body).dblclick(ondblclick);
        } else {
          body.addEventListener('dblclick', ondblclick, false);
        }
        return sel;
      }

      function createSubmitButton() {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('my'));
        btn.className = 'mylistAdd';
        btn.title = 'マイリストに追加';
        btn.addEventListener('click', function(e) {
          var description = null;
          if (e.shiftKey) {
            description = prompt('マイリストコメントの入力');
            if (!description) return;
          }
          btn.disabled = true;
          btn.style.opacity = 0.5;
          btn.style.cursor = 'wait';
          setTimeout(function() { btn.disabled = false; btn.style.opacity = 1; btn.style.cursor = 'pointer';}, 1000);
          var groupId = sel.value, name = sel.options[sel.selectedIndex].textContent;
          if (groupId === 'default') {
            self.addDefListItem(_watchId, function(status, result, replaced) {
              self.reloadDefList();
              if (status !== "ok") {
                Popup.alert('とりあえずマイリストへの登録に失敗: ' + result.error.description);
              } else {
                var torimai = '<a href="/my/mylist">とりあえずマイリスト</a>';
                Popup.show(
                  torimai +
                  (replaced ? 'の先頭に移動しました' : 'に登録しました')
                );
              }
            }, description);
          } else {
            self.addMylistItem(_watchId, groupId, function(status, result) {
              self.reloadDefList();
              if (status === 'ok') {
                Popup.show( '<a href="/my/mylist/#/' + groupId + '">' + name + '</a>に登録しました');
              } else {
                Popup.alert(name + 'への登録に失敗: ' + result.error.description);
              }
            }, description);
          }
        } ,false);
        return btn;
      }

      function createDeleteDeflistItemButton() {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('×'));
        btn.className = 'deflistRemove';
        btn.title = 'とりあえずマイリストから外す';
        btn.addEventListener('click', function() {
          btn.disabled = true;
          setTimeout(function() {btn.disabled = false;}, 1000);
          self.deleteDefListItem(_watchId, function(status, result) {
            self.reloadDefList();
            btn.style.display = 'none';
            if (status !== "ok") {
              Popup.alert('とりあえずマイリストから削除に失敗: ' + result.error.description);
            } else {
              Popup.show('とりあえずマイリストから外しました');
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
          btn.style.opacity = 0.5;
          btn.style.cursor = 'wait';
          setTimeout(function() {btn.disabled = false; btn.style.opacity = 1; btn.style.cursor = 'pointer'; }, 1000);
          if (w.jQuery) {
            var $btn = w.jQuery(btn), o = $btn.offset();
            VideoTags.popupItems(_videoId, o.left, o.top + $btn.outerHeight());
          } else {
            VideoTags.popupItems(_videoId, e.pageX, e.pageY);
          }
        } ,false);
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


      var sel = createSelector();
      var submit = createSubmitButton(sel);
      nobr.appendChild(sel);
      nobr.appendChild(submit);
      if (w.jQuery) {
        w.jQuery(sel).keydown(function(e) {
          e.stopPropagation();
          if (e.keyCode === 13) { // ENTER
            submit.click();
          }
        });
      }

      var tagBtn = createTagListButton();
      nobr.appendChild(tagBtn);

      var deleteDef = createDeleteDeflistItemButton();
      nobr.appendChild(deleteDef);



      nobr.appendChild(extArea);

      body.watchId(_watchId, _videoId);
      return body;
    };

    // XHRでクロスドメインを超えられない場合はこちら
    // 将来マイリストのポップアップウィンドウが廃止されたら使えない
    // (マイページから強引に生成するか？)
    pt.getIframePanel = function(watchId) {
      var _watchId = watchId;
      var body = document.createElement('iframe');
      body.name = 'nicomylistaddDummy';
      body.className = 'mylistPopupPanel';
      body.style.width = '130px';
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
      if (watchId !== '') {
        body.src = "http:/" + "/www.nicovideo.jp/mylist_add/video/" + _watchId;
      }

      // ダミーメソッド
      body.addExtElement = function() {
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

  var LocationHashParser = (function(conf, w) {
    var self, dat = {};

    function initialize() {
      var hash = w.location.hash.toString();
      try {
        if (hash.indexOf('#json={') === 0) {
          dat = JSON.parse(hash.substr(6));
        }
      } catch (e) {
        try {
         dat = JSON.parse(decodeURIComponent(hash.substr(6)));
        } catch(ex) {
          console.log(ex);
        }
        console.log(e);
      }
    }
    function setValue(key, value) {
      dat[key] = value;
    }
    function getValue(key) {
      return dat[key];
    }
    function deleteValue(key) {
      delete dat[key];
    }
    function updateHash() {
      var loc = window.location.href.split('#')[0];
      location.replace(loc +  getHash());
    }
    function removeHash() {
      if (location.hash.length <= 1) { return; }
      var scrollTop = $(window).scrollTop();
      var loc = window.location.href.split('#')[0];
      location.replace(loc + '#');
      $(window).scrollTop(scrollTop);
    }
    function getHash() {
      var json = JSON.stringify(dat);
      if (json === '{}') { return ''; }
      return '#json=' + json;
    }
    function getUrl() {
      var loc = window.location.href.split('#')[0];
      return loc + getHash();
    }
    function clear() {
      dat = {};
      removeHash();
    }

    self = {
      initialize: initialize,
      setValue: setValue,
      getValue: getValue,
      deleteValue: deleteValue,
      updateHash: updateHash,
      removeHash: removeHash,
      getHash: getHash,
      getUrl: getUrl,
      clear: clear
    };
    return self;
  })(conf, w);


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

    /**
     *  お気に入りタグの取得。 jQueryのあるページでしか使えない
     *  マイページを無理矢理パースしてるので突然使えなくなるかも
     */
    function load(callback) {
      if (!w.jQuery) return; //
      var now = Date.now();
      if (now - lastUpdate < 60 * 1000) {
        if (typeof callback === 'function') { callback(favTagList); }
        return;
      }
      lastUpdate = now;

      var url = 'http://' + host + '/my/fav/tag';
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var $result = $(resp.responseText).find('#favTag');
          if ($result.length >= 1) {
            favTagList = [];
            $result.find('.outer').each(function() {
              var $a = $(this).find('h5 a');
              favTagList.push({href: $a.attr('href'), name: $a.text()});
            });
          }
          if (typeof callback === 'function') { callback(favTagList); }
        }
      });
    }

    pt.load = load;
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
      console.log('%c' + text, 'background: cyan;');
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          // Firefoxではflashの上に半透明要素を重ねられないのでとりあえず黒で塗りつぶす
          '<span style="background: black;">' + text + '</span>'
        );
      }
    };

    Popup.alert = function(text) {
      console.log('%c' + text, 'background: yellow;');
      if (w.WatchApp) {
        text = text.replace(/[\n]/, '<br />');
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.onData(
          '<span style="background: black; color: red;">' + text + '</span>'
        );
      } else {
        w.alert(text);
      }
    };

    Popup.hide = function() {
      if (w.WatchApp) {
        w.WatchApp.namespace.init.PopupMarqueeInitializer.popupMarqueeViewController.stop();
      }
    };
    return Popup;
  })();


  var KeyMatch = (function() {
    var self;

    function create(def) {
      var ch = def.char[0].toUpperCase();
      return {
        prop: {
          char: ch,
          code: typeof def.code === 'number' ? def.code : ch.charCodeAt(0),
          shift:  !!def.shift,
          ctrl:   !!def.ctrl,
          alt:    !!def.alt,
          enable: !!def.enable
        },
        test: function(event) {
          if (
            this.prop.enable === true           &&
            this.prop.shift   === event.shiftKey &&
            this.prop.ctrl    === event.ctrlKey  &&
            this.prop.alt     === event.altKey   &&
            this.prop.code    === event.which
          ) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        json: function() {
          return JSON.stringify(this.prop);
        }
      };
    }

    self = {
      create: create
    };
    return self;
  })();

  var TouchEventDispatcher = (function(target) {
    var
      self,
      touchStartEvent = null,
      touchEndEvent = null,
      events = {
      onflick: []
    };
    function dispatchEvent(name) {
      var e = events[name];
      for (var i =0, len = e.length; i < len; i++) {
        e[i].apply(null, Array.prototype.slice.call(arguments, 1));
      }
    }

    target.addEventListener('touchstart', function(e) {
      touchStartEvent = e;
    }, false);
    target.addEventListener('touchcancel', function(e) {
      touchStartEvent = null;
    }, false);
    target.addEventListener('touchend', function(e) {
      touchEndEvent = e;
      if (touchStartEvent !== null) {
        var
          sx = touchStartEvent.changedTouches[0].pageX, sy = touchStartEvent.changedTouches[0].pageY,
          ex = touchEndEvent.changedTouches[0].pageX,   ey = touchEndEvent.changedTouches[0].pageY,
          dx = (sx - ex), dy = (sy - ey), len = Math.sqrt(dx * dx + dy * dy), s;
          if (len > 150) {
            s = dy / len;
            var a = Math.abs(s), ss = Math.round(s);
            if (a <= 0.3 || a >= 0.7) {
              var d;
              if (ss < 0) { d = 'down'; } else if (ss > 0) { d = 'up'; }
              else if (dx < 0) { d = 'right';} else { d = 'left'; }
              dispatchEvent('onflick', {
                direction: d,
                distance: len,
                x: dx, y: dy,
                startEvent: touchStartEvent,
                endEvent: touchEndEvent
              });
            }
          }
      }
      touchStartEvent = touchEndEvent = null;
    }, false);

    function onflick(callback) {
      events.onflick.push(callback);
    }

    self = {
      onflick: onflick
    };
    return self;
  })(w.document);



  /**
   *  リンクのマウスオーバーに仕込む処理
   *  ここの表示は再考の余地あり
   */
  var AnchorHoverPopup = (function(w, conf,EventDispatcher) {
    var mylistPanel = Mylist.getPanel(''), hoverMenuDelay = conf.hoverMenuDelay * 1000;
    mylistPanel.className += ' popup';
    mylistPanel.style.display    = 'none';
    document.body.appendChild(mylistPanel);

    EventDispatcher.addEventListener('on.config.hoverMenuDelay', function(delay) {
      delay = parseFloat(delay, 10);
      if (isNaN(delay)) { return; }
      hoverMenuDelay = Math.abs(delay * 1000);
    });

    function showPanel(watchId, baseX, baseY, w_touch) {

      var cn = mylistPanel.className.toString();
      if (w_touch === true) {
        cn = cn.replace(' w_touch', '') + ' w_touch';
      } else {
        if (cn.indexOf('w_touch') >= 0 && mylistPanel.style.display !== 'none') {
          // フリック操作で表示したパネルが出ている間はそちらを優先し、なにもしない
          return;
        }
        cn = cn.replace(' w_touch', '');

      }
      VideoTags.hidePopup();
      if (mylistPanel.className !== cn) mylistPanel.className = cn;

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

    function each(w, watchId) {

      this.w_eventInit = false;
      this.addEventListener('mouseover', function() {
        var mx = 0, my = 0, self = this;

        self.w_mouse_in = true;
        self.w_mouse_timer = null;
        self.w_mouse_timer = setTimeout(function() {
          self.w_mouse_timer = null;
          if (!self.w_mouse_in) {
            return;
          }
          var o;
          if (w.jQuery) {
            var $e = w.jQuery(self);
            var t = $e.text();
            o = t !== "" ? $e.offset() : $e.find('*').offset();
            showPanel(watchId, o.left, o.top);
          } else
          if (self.getBoundingClientRect) {
            o = (self.firstChild && self.firstChild.tagName === 'IMG') ? self.firstChild.getBoundingClientRect() : self.getBoundingClientRect();
            var top = Math.max(w.document.documentElement.scrollTop, w.document.body.scrollTop),
                left = Math.max(w.document.documentElement.scrollLeft, w.document.body.scrollLeft);
            showPanel(watchId, left + o.left, top + o.top);
          } else {
            showPanel(watchId, mx + 8, my + 8);
          }
          addlink(mylistPanel, self, watchId);
        }, hoverMenuDelay);

        if (!this.w_eventInit) {
          this.addEventListener('mouseout', function() {
            self.w_mouse_in = false;
            if (self.w_mouse_timer) {
              clearTimeout(self.w_mouse_timer);
              self.w_mouse_timer = null;
            }
          }, false);
          if (!w.jQuery) {
            this.addEventListener('mousemove', function(ev) {
              mx = ev.pageX;
              my = ev.pageY;
            }, false);
          }
          this.w_eventInit = true;
        }
      }, false);
      this.added = 1;
    }

    function bind(force, target) {
      if (!conf.enableHoverPopup) { return; }

      var a = Array.prototype.slice.apply(document.links), vreg = videoReg, ereg = excludeReg;
        for (var i = 0, len = a.length; i < len; i++) {
          var e = a[i];
          var m, href= e.href;
          if (
            href &&
            !e.added &&
            (m = vreg.exec(href)) !== null &&
            !ereg.test(href) &&
            e.className !== "itemEcoLink" &&
            e.className !== "playlistSaveLink"
          ) {
            each.apply(e, [w, m[2]]);
          }
        }
    }
    function bindTouch() {
      TouchEventDispatcher.onflick(function(e) {
        var se = e.startEvent;
        if (e.direction === 'right' && (se.target.tagName === 'A' || se.target.parentElement.tagName === 'A')) {
          var
            a = (se.target.tagName === 'A') ? e.startEvent.target : e.startEvent.target.parentElement,
            href = a.href, vreg = videoReg, ereg = excludeReg, m, watchId;
          if (
            href &&
            (m = vreg.exec(href)) !== null &&
            !ereg.test(href) &&
            e.className !== "itemEcoLink" &&
            true
          ) {
            watchId = m[2];
             var o;
            if (w.jQuery) {
              var $a = w.jQuery(a);
              var t = $a.text();
              o = t !== "" ? $a.offset() : $a.find('*').offset();
              showPanel(watchId, o.left, o.top, true);
            } else {
              o = (a.firstChild && a.firstChild.tagName === 'IMG') ? a.firstChild.getBoundingClientRect() : a.getBoundingClientRect();
              var top  = Math.max(w.document.documentElement.scrollTop,  w.document.body.scrollTop),
                  left = Math.max(w.document.documentElement.scrollLeft, w.document.body.scrollLeft);
              showPanel(watchId, left + o.left, top + o.top, true);
            }
          }
        }
      });
    }

    var lastUpdate = 0, linksCount = document.links.length,
      bindLoop = function(nextTime) {
        var now = Date.now();
        var updateInterval = w.document.hasFocus() ? 3000 : 15000;
        if (now - lastUpdate < updateInterval) {
          var len = document.links.length;
          if (linksCount === len) {
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


    if (location.host === "ext.nicovideo.jp") {
      bind();
    } else {
      var thumbnailReg = /\.smilevideo\.jp\/smile\?i=(\d+)/;
      if (location.host === 'ch.nicovideo.jp' && w.jQuery) {
        w.jQuery('.lazyimage, .thumb_video.thumb_114.wide img, .itemset li .image a .item').each(function() {
          var $e = w.jQuery(this).text(' ');
          var src = $e.attr('data-original') || $e.attr('src');
          if (typeof src === 'string' && thumbnailReg.test(src)) {
            each.apply(this, [w, 'so' + RegExp.$1]);
          }
        });
      }
      bindTouch();
      bind();
      setInterval(bindLoop, 500);
    }
    return self;
  })(w, conf, EventDispatcher);


  //===================================================
  //===================================================
  //===================================================


  /**
   *  マイリスト登録のポップアップウィンドウを乗っ取る処理
   *
   *  iframeの子ウィンドウ内に開かれた時に実行される
   *  クロスドメインを越えられない環境ではこっちを使うしかない
   */
  (function(){ // mylist window
    var $$ = w.$$;
    if (w.location.href.indexOf('/mylist_add/') < 0 || w.name === 'nicomylistadd') return;

      var $ = w.jQuery;
      $('body,table,img,td').css({border:0, margin:0, padding:0, background: "transparent", overflow: 'hidden'});
      $('#main_frm').css({background: '#fff', paddig: 0, borderRadius: 0}).addClass('mylistPopupPanel');

      if ($('#edit_description').length < 1) {
        $('#main_frm .font12:first').css({position: 'absolute', margin: 0, top: 0, left: 0, padding: 0, color: 'red', fontSize: '8pt'});
        // ログインしてないぽい
        return;
      }

      $('#box_success').css({position: 'absolute', top: 0, left: 0});
      $('#box_success h1').css({color: 'black', fontSize: '8pt', padding: 0});
      $('td').css({padding: 0});

      // 「マイリストに登録しました」
//      $('.mb8p4:last').show();
//      $('.mb8p4:last h1').css({fontSize : "8pt"});

      $('table:first').css({width: '200px'});
      $('table:first td.main_frm_bg').css({height: '20px'});
      $('table:first table:first').hide();

      $('select')
        .css({width: '64px',position: 'absolute', top:0, left:0, margin: 0})
        .addClass('mylistSelect');
      $('select')[0].selectedIndex = $('select')[0].options.length - 1;
      $('#select_group option:last')[0].innerHTML = 'とりマイ';

      var submit = document.createElement("input");
      submit.className = 'mylistAdd';
      submit.type  = "submit";
      submit.value = "マ";
      $(submit).css({position: 'absolute', top: 0, left: '64px'});
      $('select')[0].parentNode.appendChild(submit);

      $('#edit_description').hide();

      w.document.documentElement.scrollTop  = 0;
      w.document.documentElement.scrollLeft = 0;


      $($.browser.safari ? 'body' : 'html').scrollTop(0);

      w.window.close = function()
      {
        return;
      };
      w.window.alert = function()
      {
        w.document.write('<span style="position:absolute;top:0;left:0;font-size:8pt;color:red;">' +
                 arguments[0] + '</span>');
      };
  })();





  //===================================================
  //===================================================
  //===================================================

  var WatchController = (function(w) {
    var WatchApp = w.WatchApp;
    if (!w.WatchApp) return;
    var
      watch          = (WatchApp && WatchApp.ns.init) || {},
      watchInfoModel = (watch.CommonModelInitializer && watch.CommonModelInitializer.watchInfoModel) || {},
      nicoPlayer     = (watch.PlayerInitializer && watch.PlayerInitializer.nicoPlayerConnector) || {},
      videoExplorerController = watch.VideoExplorerInitializer.videoExplorerController,
      videoExplorer           = videoExplorerController.getVideoExplorer(),
      videoExplorerContentType = WatchApp.ns.components.videoexplorer.model.ContentType,
      $ = w.$, WatchJsApi = w.WatchJsApi, exp = null;
    return {
      isZeroWatch: function() {
        return (WatchApp && WatchJsApi) ? true : false;
      },
      isQwatch: function() {
        return this.isZeroWatch();
      },
      nicoSearch: function(word, search_type) {
        if (!search_type) {
          try {
            var type = videoExplorerContentType.SEARCH;
            search_type = videoExplorer.getContentList().getContent(type).getSearchType();
          } catch(e) {
            search_type = search_type || 'tag';
          }
        }
        videoExplorerController.searchVideo(word, search_type);
        AnchorHoverPopup.hidePopup();
      },
      showMylist: function(mylistId) {
        videoExplorerController.showMylist(mylistId.toString());
      },
      clearDeflistCache: function() {
        watch.VideoExplorerInitializer.deflistVideoAPILoader._cache.clear();
      },
      clearMylistCache: function(id) {
        if (id) {
          watch.VideoExplorerInitializer.mylistVideoAPILoader._cache.deleteElement({'id': id.toString()});
        } else {
          watch.VideoExplorerInitializer.mylistVideoAPILoader._cache.clearCache();
        }
      },
      showDefMylist: function() {
        videoExplorerController.showDeflist();
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

        if (top !== undefined) {
          return $(window).scrollTop(top - header, dur);
        } else {
          return $(window).scrollTop() + header;
        }
      },
      scrollToVideoPlayer: function(force) {
        // 縦解像度がタグ+プレイヤーより大きいならタグの開始位置、そうでないならプレイヤーの位置にスクロール
        // ただし、該当部分が画面内に納まっている場合は、勝手にスクロールするとかえってうざいのでなにもしない
        var $body = $('body'), isContentFix = $body.hasClass('content-fix');
        $body.removeClass('content-fix');
        var h = $('#playerContainer').outerHeight() + $('#videoTagContainer').outerHeight();
        var top = $(window).height() >= h ? '#videoTagContainer, #playerContainer' : '#playerContainer';


        if (force) {
          // 要素が画面内に納まっている場合でも、その要素の位置までスクロール
          WatchApp.ns.util.WindowUtil.scrollFit(top, 600);
        } else {
          // 要素が画面内に収まっている場合はスクロールしない
          WatchApp.ns.util.WindowUtil.scrollFitMinimum(top, 600);
        }
        $(window).scrollLeft(0);
        $body.toggleClass('content-fix', isContentFix);
      },
      play: function() {
        nicoPlayer.playVideo();
      },
      pause: function() {
        nicoPlayer.stopVideo();
      },
      togglePlay: function() {
        var status = $("#external_nicoplayer")[0].ext_getStatus();
        if (status === 'playing') {
          this.pause();
        } else {
          this.play();
        }
      },
      nextVideo: function() {
        return nicoPlayer.playNextVideo();
      },
      prevVideo: function() {
        return nicoPlayer.playPreviousVideo();
      },
      vpos: function(v) {
        if (typeof v === 'number') {
          return nicoPlayer.seekVideo(v);
        } else {
          return nicoPlayer.getVpos();
        }
      },
      openSearch: function() {
        videoExplorer.openByCurrentCondition();
      },
      closeSearch: function() {
        videoExplorer.close();
      },
      openVideoOwnersVideo: function() {
        if (this.isChannelVideo()) {
          this.openChannelOwnersVideo();
        } else {
          this.openUpNushiVideo();
        }
      },
      openUpNushiVideo: function() {
        videoExplorerController.showOwnerVideo();
      },
      openChannelOwnersVideo: function() {
        videoExplorerController.showMylist('-3');
      },
      openUserVideo: function(userId, userNick) {
        videoExplorerController.showOtherUserVideos(userId, userNick);
      },
      openRecommend: function() {
        var
          type = videoExplorerContentType.RELATED_VIDEO,
          open = function() {
            var rel = WatchApp.ns.init.VideoExplorerInitializer.videoExplorer._menu.getItemByContentType(type);
            rel.select();
          };
        if (videoExplorer.isOpen()) {
          open();
        } else {
          this.openSearch();
          setTimeout(open, 500);
        }
      },
      getVideoExplorerCurrentItems: function(format) {
        var ac = videoExplorer._contentList.getActiveContent();
        if (!ac || !ac.getItems) return [];
        var items = ac.getItems();

        if (!format) {
          return items;
        } else
        if (format === 'playlist') {
          var result = [];
          for (var i = items.length - 1; i >= 0; i--) {
            result.unshift(
              videoExplorerController._item2playlistItem(items[i])
            );
          }
          return result;
        }
      },
      getWatchId: function() {
        return watchInfoModel.id;
      },
      getVideoId: function() {
        return watchInfoModel.v;
      },
      getMyNick: function() {
        return watch.CommonModelInitializer.viewerInfoModel.nickname;
      },
      getMyUserId: function() {
        return watch.CommonModelInitializer.viewerInfoModel.userId;
      },
      getPlaylistItems: function() {
         return watch.PlaylistInitializer.playlist.items || watch.PlaylistInitializer.playlist.currentItems;
      },
      setPlaylistItems: function(items, currentItem) {
        var playlist = watch.PlaylistInitializer.playlist;
        var isAutoPlay = playlist.isAutoPlay();
        playlist.reset(
          items,
          playlist.type,
          playlist.option
        );
        if (currentItem) { playlist.playingItem = currentItem; }
        else { playlist.playingItem = items[0]; }
        if (!isAutoPlay) { // 本家側の更新でリセット時に勝手に自動再生がONになるようになったので、リセット前の状態を復元する
          playlist.disableAutoPlay();
        }
      },
      shufflePlaylist: function(target) {
        var x = this.getPlaylistItems(), items = [], i, currentIndex = -1, currentItem = null;
          if (target === 'right') {
          for (i = 0; i < x.length;) {
            if (x[0]._isPlaying) {
              currentIndex = i;
              currentItem = x.shift();
              items.push(currentItem);
              break;
            } else {
              items.push(x.shift());
            }
          }
        }

        x = x.map(function(a){return {weight:Math.random(), value:a};})
          .sort(function(a, b){return a.weight - b.weight;})
          .map(function(a){return a.value;});
        for (i = 0; i < x.length; i++) {
          if (x[i]._isPlaying) {
            items.unshift(x[i]);
          } else {
            items.push(x[i]);
          }
        }
        var pm = WatchApp.ns.view.playlist.PlaylistManager, pv = watch.PlaylistInitializer.playlistView;
        var left = pm.getLeftSideIndex();
        this.setPlaylistItems(items, currentItem);
        pv.scroll(left);
      },
      clearPlaylist: function(target) {
        var x = this.getPlaylistItems(), items = [], i, currentItem = null;
        if (target === 'left') {
          for (i = x.length - 1; i >= 0; i--) {
            items.unshift(x[i]);
            if (x[i]._isPlaying) {
              currentItem = x[i];
              break;
            }
          }
        } else
        if (target === 'right') {
          for (i = 0; i < x.length ; i++) {
            items.push(x[i]);
            if (x[i]._isPlaying) {
              currentItem = x[i];
              break;
            }
          }
        }
        else {
          for (i = 0; i < x.length; i++) {
            if (x[i]._isPlaying) {
              currentItem = x[i];
              items.unshift(x[i]);
            }
          }
        }
        this.setPlaylistItems(items, currentItem);
      },
      appendSearchResultToPlaylist: function(mode) {
        var
          items = this.getPlaylistItems(),
          searchItems = this.getVideoExplorerCurrentItems('playlist'),
          uniq = {}, i, playingIndex = 0, c, len, currentItem = null;
        if (!searchItems || searchItems.length < 1) {
          return;
        }
        for (i = 0, len = items.length; i < len; i++) {
          uniq[items[i].id] = true;
          if (items[i]._isPlaying) { playingIndex = i; currentItem = items[i]; }
        }
        if (mode === 'next') {
          for (i = searchItems.length - 1; i >= 0; i--) {
            c = searchItems[i];
            ("undefined" === typeof c.type || "video" === c.type) && uniq[c.id] === undefined && items.splice(playingIndex + 1, 0, c);
          }
        } else {
          for (i = 0, len = searchItems.length; i < len; i++) {
            c = searchItems[i];
            ("undefined" === typeof c.type || "video" === c.type) && uniq[c.id] === undefined && items.push(c);
          }
        }
        this.setPlaylistItems(items, currentItem);
      },
      addDefMylist: function(description) {
        var watchId = watchInfoModel.id;
        setTimeout(function() {
          Mylist.addDefListItem(watchId, function(status, result, replaced) {
            Mylist.reloadDefList();
            if (status !== "ok") {
              Popup.alert('とりあえずマイリストの登録に失敗: ' + result.error.description);
            } else {
              var torimai = '<a href="/my/mylist">とりあえずマイリスト</a>';
              Popup.show(
                torimai +
                (replaced ? 'の先頭に移動しました' : 'に登録しました')
              );
            }
          }, description);
        }, 0);
      },
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
      deepenedComment: function(v) {
        if (v === 'toggle') {
          return this.deepenedComment(!this.deepenedComment());
        } else
        if (typeof v === 'boolean') {
          nicoPlayer.playerConfig.set({deepenedComment: v});
          return this;
        } else {
          var pc = nicoPlayer.playerConfig.get();
          return pc.deepenedComment;
        }
      },
      allowStageVideo: function(v) {
        var exp = w.document.getElementById('external_nicoplayer');
        if (v === 'toggle') {
          return this.allowStageVideo(!this.allowStageVideo());
        } else
        if (typeof v === 'boolean') {
          nicoPlayer.playerConfig.set({allowStageVideo: v});
          return this;
        } else {
          var pc = nicoPlayer.playerConfig.get();
          return pc.allowStageVideo;
        }
      },
      isStageVideoSupported: function() {
        try {
          var exp = w.document.getElementById('external_nicoplayer');
          return exp.isStageVideoSupported();
        } catch(e) {
          if (conf.debugMode) console.log(e);
          return false;
        }
      },
      isStageVideoAvailable: function() {
        try {
          var exp = w.document.getElementById('external_nicoplayer');
          return exp.isStageVideoAvailable();
        } catch(e) {
          if (conf.debugMode) console.log(e);
          return false;
        }
      },
      toggleStageVideo: function() {
        if (!this.isStageVideoSupported()) {
          Popup.alert('ハードウェアアクセラレーションを使用できない状態か、未対応の環境です');
          return;
        }
        var isAllowed = this.allowStageVideo(), exp = $('#external_nicoplayer')[0];
        exp.setIsForceUsingStageVideo(!isAllowed && conf.forceEnableStageVideo);
        this.allowStageVideo(!isAllowed);
        setTimeout($.proxy(function() {
          isAllowed = this.allowStageVideo();
          var isAvailable = this.isStageVideoAvailable();
          Popup.show('ハードウェアアクセラレーション:' +
            (isAllowed ? '設定ON' : '設定OFF') + ' / ' +
            (isAvailable ? '使用可能' : '使用不能')
          );
        }, this), 100);
      },
      mute: function(v) {
        var exp = w.document.getElementById('external_nicoplayer');

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
        var exp = w.document.getElementById('external_nicoplayer');
        if (typeof v === 'string' && v.match(/^[+-]\d+$/)) {
          this.volume(this.volume() + v * 1);
        } else
        if (typeof v === 'number' || (typeof v === 'string' && v.match(/^\d+$/))) {
          exp.ext_setVolume(Math.max(0, Math.min(v * 1, 100)));
        }
        return exp.ext_getVolume();
      },
      isWide: function() {
        var exp = w.document.getElementById('external_nicoplayer');
        return exp.ext_isWide();
      },
      isPlaylistActive: function() {
        return watch.PlaylistInitializer.playlist.getPlaybackMode() !== 'normal';
      },
      isPlaylistRandom: function() {
        return watch.PlaylistInitializer.playlist.isShuffle();
      },
      isPlaylistContinuous: function() {
        return watch.PlaylistInitializer.playlist.getPlaybackMode() === 'continuous';
      },
      getOwnerIcon: function() {
        try {
          return this.isChannelVideo() ? watchInfoModel.channelInfo.iconUrl : watchInfoModel.uploaderInfo.iconUrl;
        } catch (e) {
          return 'http://uni.res.nimg.jp/img/user/thumb/blank_s.jpg';
        }
      },
      getOwnerName: function() {
        try {
          return this.isChannelVideo() ? watchInfoModel.channelInfo.name    : watchInfoModel.uploaderInfo.nickname;
        } catch (e) {
          return '';
        }
      },
      getOwnerId: function() {
        try {
          return this.isChannelVideo() ? watchInfoModel.channelInfo.id      : watchInfoModel.uploaderInfo.id;
        } catch (e) {
          return '0';
        }
      },
      getOwnerType: function() {
        try {
          return this.isChannelVideo() ? 'channel' : 'user';
        } catch (e) {
          return 'channel';
        }
      },
      isFavoriteOwner: function() {
        try {
          return this.isChannelVideo() ?
            !!(watchInfoModel.channelInfo && watchInfoModel.channelInfo.isFavorited) :
            watchInfoModel.uploaderInfo.isFavorited;
        } catch (e) {
          return false;
        }
      },
      isChannelVideo: function() {
        return watchInfoModel.isChannelVideo();
      },
      getOwnerInfo: function() {
        return {
          type:       this.getOwnerType(),
          name:       this.getOwnerName(),
          icon:       this.getOwnerIcon(),
          id:         this.getOwnerId(),
          isFavorite: this.isFavoriteOwner()
        }
      },
      isSearchMode: function() {
        return videoExplorer.isOpen(); ////return $('body').hasClass('videoExplorer');
      },
      isFullScreen: function() {
        return $('body').hasClass('full_with_browser');
      },
      // フルスクリーンの時にタグとかプレイリストを表示する設定かどうか
      isFullScreenContentAll: function() {
        try {
          var content = localStorage.BROWSER_FULL_OPTIONS;
          if (typeof content !== 'string') return false;
          var isAll = JSON.parse(content).content === 'all';
          return isAll;
        } catch(e) {
          console.log('%cexception', 'background: red; color: white;', e);
          return false;
        }
      },
      // ニコメンドの中身が空っぽかどうか？
      isNicommendEmpty: function() {
        return $('#nicommendList').find('.content').length < 1;
      }
    };
  })(w);
  WatchItLater.WatchController = WatchController;

  var Util = (function() {
    var Cache = {
      storage: {},
      get: function(key) {
        if (!this.storage[key]) {
          if (conf.debugMode) console.log('no cache');
          return false;
        } else
        if (this.storage[key].cachedUntil <= Date.now()){
          if (conf.debugMode) console.log('cache timeout');
          delete this.storage[key];
          return false;
        } else {
          if (conf.debugMode) console.log('cache exist');
          return this.storage[key].data;
        }
      },
      set: function(key, data, cacheTimeMs) {
        cacheTimeMs = cacheTimeMs || 1000 * 60 * 10;
        if (conf.debugMode) console.log('set cache', key, cacheTimeMs);
        this.storage[key] = {
          data: data,
          cachedUntil: Date.now() + cacheTimeMs
        };
        return data;
      }
    };


    var self = {
      Cache: Cache,
      here: function(func) { // えせヒアドキュメント
        return func.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
      }
    };
    return self;
  })();
  WatchItLater.Util = Util;

  var NicoNews = (function() {
    var WatchApp = null, watch = null, $ = null, WatchJsApi = null, initialized = false;
    var $button = null, $history = null, $ul = null, deteru = {}, $textMarquee, $textMarqueeInner;
    var isHover = false;

    function onNewsUpdate(news) {
      var type = news.data.type, $current = null,
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
        $textMarquee = $('#textMarquee');
        $textMarqueeInner = $textMarquee.find('.textMarqueeInner');

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

        $textMarquee.append($button).append($history);
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
   *  マイリストや検索API互換形式のデータを返すやつ
   */
  var DummyMylist = function() { this.initialize.apply(this, arguments); };
  DummyMylist.prototype = {
    banner: '',
    id: '-100',
    sort: '4',
    isDeflist: -1,
    isWatchngCountFull: false,
    isWatchngThisMylist: false,
    itemCount: 0,
    items: [],
    rawData: {},
    page: 1,
    perPage: 32,
    type: 2, // 2: MYLIST_VIDEO
//
    // ver130726より新規追加 defineGetterのほうがいいかも

    status: 'ok',
    name: '',
    description: '',
    user_id: '',
    user_nickname: 'ニコニコ動画',
    default_sort: '1',
    is_watching_this_mylist: false,
    is_watching_count_full: false,
    list: [],
    // ここまで
    initialize: function(param) {
      this.rawData = {
        status: 'ok',
        list: [],
        name: '総合ランキング',
        description: '',
        is_watching_count_full:  false,
        is_watching_this_mylist: false,
        user_nickname: '',
        user_id: '',
        sort: '1'
      };
      this._baseCreateTime = Date.now();//new Date();
      this.rawData.user_nickname = param.user_nickname || WatchController.getMyNick();
      this.rawData.user_id       = param.user_id       || WatchController.getMyUserId();
      this.rawData.name          = param.name          || this.rawData.name;
      this.rawData.description   = param.description   || '';

      this.type = param.type || WatchApp.ns.components.videoexplorer.model.ContentType.MYLIST_VIDEO;
      this.sort = this.rawData.sort = param.sort || this.sort;
      this.id   = param.id || '-100';

      this.status        = this.rawData.status;
      this.list          = this.rawData.list;
      this.name          = this.rawData.name;
      this.description   = this.rawData.description;
      this.default_sort  = this.rawData.sort || this.sort;
      this.user_nickname = this.rawData.user_nickname || this.user_nickname;
      this.user_id       = this.rawData.user_id;


    },
    setName: function(name) {
      this.rawData.name = name;
    },
    getName: function() {
      return this.rawData.name || '';
    },
    setPage: function(page) {
      this.page = page;
      this.items = this.rawData.list.slice(page * this.perPage - this.perPage, page * this.perPage);
    },
    push: function(item) {
      if (!item.create_time) {
        var tm = this._baseCreateTime - 60000 * this.itemCount;
        item.create_time = tm;//WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M:%S', new Date(tm));
      }
      this.rawData.list.push(item);
      this.itemCount = this.rawData.list.length;
      this.setPage(this.page);
    },
    unshift: function(item) {
      if (!item.create_time) {
        var tm = this._baseCreateTime + 60000 * this.itemCount;
        item.create_time = tm;//WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M:%S', new Date(tm));
      }
      this.rawData.list.unshift(item);
      this.itemCount = this.rawData.list.length;
      this.setPage(this.page);
    },
    slice: function(b, e) {
      this.rawData.list = this.rawData.list.slice(b, e);
      this.itemCount    = this.rawData.list.length;
      this.setPage(this.page);
    },
    sortItem: function(sortId, force) {
      sortId = parseInt(sortId, 10);
      if (!!!force && (sortId < 0 || sortId === parseInt(this.sort, 10)) ) { return; }
      var sortKey = ([
        'create_time',        'create_time',
        'mylist_comment',     'mylist_comment',
        'title',              'title',
        'first_retrieve',     'first_retrieve',
        'view_counter',       'view_counter',
        'thread_update_time', 'thread_update_time',
        'num_res',            'num_res',
        'mylist_counter',     'mylist_counter',
        'length_seconds',     'length_seconds'
      ])[sortId],
      order = (sortId % 2 === 0) ? 'asc' : 'desc';

      if (!sortKey) { return; }
      var compare= {
        asc:   function(a, b) { return (a[sortKey]   > b[sortKey]  ) ? 1 : -1; },
        desc:  function(a, b) { return (a[sortKey]   < b[sortKey]  ) ? 1 : -1; },
        iasc:  function(a, b) { return (a[sortKey]*1 > b[sortKey]*1) ? 1 : -1; },
        idesc: function(a, b) { return (a[sortKey]*1 < b[sortKey]*1) ? 1 : -1; }
      };
      // 偶数がascで奇数がdescかと思ったら特に統一されてなかった
      if (
        sortKey === 'first_retrieve'   ||
        sortKey === 'thread_update_time'
      ) {
        order = (sortId % 2 === 1) ? 'asc' : 'desc';
      } else
      // 数値系は偶数がdesc
      if (sortKey === 'view_counter'   ||
          sortKey === 'num_res'        ||
          sortKey === 'mylist_counter' ||
          sortKey === 'length_seconds'
        ) {
        order = (sortId % 2 === 1) ? 'iasc' : 'idesc';
      }
      this.sort = this.rawData.sort = sortId.toString();
      this.rawData.list.sort(compare[order]);
      this.items = this.rawData.list.slice(0, 32);
      this.list  = this.rawData.list.slice(0);
    }
  };

  var DummyMylistVideo = function() { this.initialize.apply(this, arguments); };
  DummyMylistVideo.prototype = {
    id: 0,
    title: '',
    length: 0,
    view_counter: 0,
    num_res: 0,
    mylist_counter: 0,
    description_short: '',
    first_retrieve: null,
    thumbnail_url: null,
    mylist_comment: '',
    create_time: null,
    type: 0, //'video',
    _info: {},


    initialize: function(info) {
      this._info             = info._info || this;
      this.id                = info.id;
      this.length            = info.length;
      this.mylist_counter    = info.mylist_counter || 0;
      this.view_counter      = info.view_counter   || 0;
      this.num_res           = info.num_res        || 0;
      this.first_retrieve    = info.first_retrieve || '2000-01-01 00:00:00';
      this.create_time       = info.create_time    || null;
      this.thumbnail_url     = info.thumbnail_url  || 'http://res.nimg.jp/img/common/video_deleted_ja-jp.jpg' /* 「視聴できません」 */;
      this.title             = info.title || '';
      this.type              = info.type || 'video';
      this.description_short = info.description_short;
      this.length            = info.length         || '00:00';
      this.length_seconds    = parseInt(info.length_seconds || 0, 10);
      this._info.mylist_comment = info.mylist_comment || '';
      this.type              = info.type || WatchApp.ns.components.videoexplorer.model.ContentItemType.VIDEO;

      if (this.length_seconds === 0 && this.length && this.length.indexOf(':') >= 0) {
        var sp = this.length.split(':');
        this.length_seconds = sp[0] * 60 + sp[1] * 1;
      } else
      if (this.length === '00:00' && this.length_seconds > 0) {
        this.length = parseInt(this.length_seconds / 60, 10) + ':' + (this.length_seconds % 60);
      }
    },
    getType:        function() { return this.type; },
    getInfo:        function() { return this; }, // 手抜き
    getName:        function() { return this.title; },
    getId:          function() { return this.id; },
    getDescription: function() { return this.description_short; },


    length_seconds: 0, // TODO:
    thread_update_time: '2000-01-01 00:00:00' // TODO: 「コメントが新しい順でソート」に必要？
  };

  // 参考:
  // http://looooooooop.blog35.fc2.com/blog-entry-1146.html
  // http://toxy.hatenablog.jp/entry/2013/07/25/200645
  // http://ch.nicovideo.jp/pita/blomaga/ar297860
  var NewNicoSearch = function() { this.initialize.apply(this, arguments); };
  NewNicoSearch.API_BASE_URL  = 'http://api.search.nicovideo.jp/api/';
  NewNicoSearch.PAGE_BASE_URL = 'http://search.nicovideo.jp/video/';
  NewNicoSearch.prototype = {
    _u: '',      // 24h, 1w, 1m, ft  期間指定
    _ftfrom: '', // YYYY-MM-DD
    _ftto: '',   // YYYY-MM-DD
    _l: '',      // short long
    _m: false,   // true=音楽ダウンロード
    _sort: '',   // last_comment_time, last_comment_time_asc,
                // view_counter,      view_counter_asc,
                // comment_counter,   comment_counter_asc,
                // mylist_counter,    mylist_counter_asc,
                // upload_time,       upload_time_asc,
                // length_seconds,    length_seconds_asc
    _size: 32,   // 一ページの件数  maxは100
    _issuer: 'pc',
    _base_url: NewNicoSearch.API_BASE_URL,
    initialize: function(params) {

    },
    load: function(params, callback) {
      var url = this._base_url;
      var data = {};
      data.query   = params.query   || 'Qwatch';
      data.service = params.service || ['video']; // video video_tag
      data.search  = params.search  || ['title', 'tags', 'description'];
      data.join    = params.join    || [
        // TODO:投稿者IDを取得する方法がないか？
          'cmsid', 'title', 'description', 'thumbnail_url', 'start_time',
          'view_counter', 'comment_counter', 'mylist_counter', 'length_seconds'
        //  'user_id', 'channel_id', 'main_community_id', 'ss_adlut'
        ];
      data.filters = params.filters || [{}];
      data.sort_by = params.sort_by || 'start_time';
      data.order   = params.order   || 'desc';
      data.timeout = params.timeout || 10000;
      data.issuer  = params.issuer  || 'pc';
      data.reason  = params.reason  || 'user'; // 'watchItLater';
      data.size    = params.size    || 32;
      data.from    = params.from    || 0;

      var cache_key = JSON.stringify({url: url, data: data}), cache = Util.Cache.get(cache_key);
      if (cache) {
        setTimeout(function() { callback(null, cache); }, 0);
        return;
      }

      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
//      data: data, //JSON.stringify(data),
//      dataType: 'json',
        complete: function(result) {
          if (result.status !== 200) {
            callback('fail', 'HTTP status:' + result.status);
            return;
          }
          try {
            var lines = result.responseText.split('\n'), head = JSON.parse(lines[0]);
            var data;
            if (head.values[0].total > 0) {
              data = [head];
              for (var i = 1, len = lines.length; i < len - 1; i++) {
                data.push(JSON.parse(lines[i]));
              }
            } else {
              data = [head, JSON.parse(lines[1]), {type: 'hits', values: []}, JSON.parse(lines[2])];
            }
            Util.Cache.set(cache_key, data);
          } catch(e) {
            if (conf.debugMode) console.log('Exception: ', e, result);
            callback('fail', 'JSON syntax');
            return;
          }
          callback(null, data);
        }
      });
    }
  };



  /**
   *  niconico新検索の検索結果を既存の検索API互換形式に変換して返すやつ
   */
  var NewNicoSearchWrapper = function() { this.initialize.apply(this, arguments); };
  NewNicoSearchWrapper.prototype = {
    _search: null,
    sortTable: {f: 'start_time', v: 'view_counter', r: 'comment_counter', m: 'mylist_counter', l: 'length_seconds'},
    initialize: function(params) {
      this._search = params.search;
    },
    _buildSearchQuery: function(params) {
      var query = {filters: []};
      var sortTable = this.sortTable;
      query.query   = params.searchWord;
      query.search  = params.searchType === 'tag' ? ['tags'] : ['tags', 'title', 'description'];
      query.sort_by = params.sort && sortTable[params.sort] ? sortTable[params.sort] : 'last_comment_time';
      query.order   = params.order === 'd' ? 'desc' : 'asc';
      query.size    = params.size || 32;
      query.from    = params.page ? Math.max(parseInt(params.page, 10) - 1, 0) * query.size : 0;

      var now = Date.now();
      switch (params.u) {
        case '1h':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now -   1 *  1 * 60  * 60 * 1000)));
          break;
        case '24h': case '1d':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now -   1 * 24 * 60  * 60 * 1000)));
          break;
        case '1w':  case '7d':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now -   7 * 24 * 60  * 60 * 1000)));
          break;
        case '1m':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now -  30 * 24 * 60  * 60 * 1000)));
          break;
        case '3m':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now -  90 * 24 * 60  * 60 * 1000)));
          break;
        case '6m':
          query.filters.push(this._buildStartTimeRangeFilter(new Date(now - 180 * 24 * 60  * 60 * 1000)));
          break;
        default:
          break;
      }

      if (typeof params.userId === 'string' && params.userId.match(/^\d+$/)) {
        query.filters.push({type: 'equal', field: 'user_id',    value: params.userId});
      }
      if (typeof params.channelId === 'string' && params.channelId.match(/^\d+$/)) {
        query.filters.push({type: 'equal', field: 'channel_id', value: params.channelId});
      }

      if (params.l === 'short') { // 5分以内
        query.filters.push(this._buildLengthSecondsRangeFilter(0, 60 * 5));
      } else
      if (params.l === 'long' ) { // 20分以上
        query.filters.push(this._buildLengthSecondsRangeFilter(60 * 20));
      }

      if (params.m === true) {    // 音楽ダウンロード
        query.filters.push({type: 'equal', field: 'music_download', value: true});
      }

      // TODO: これの調査 → {field: 'ss_adult', type: 'equal', value: false}

      return query;
    },
    _buildStartTimeRangeFilter: function(from, to) {
      var format = function(date) { return WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M:%S', date); };
      var range = {field: 'start_time',     type: 'range', include_lower: true, };
      range.from = format(from);
      if (to) range.to = format(to);
      return range;
    },
    _buildLengthSecondsRangeFilter: function(from, to) {
      var range = {field: 'length_seconds', type: 'range'};
      if (to) { // xxx ～ xxx
        range.from = Math.min(from, to);
        range.to   = Math.max(from, to);
        range.include_lower = range.include_upper = true;
      } else { // xxx以上
        range.from = from;
        range.include_lower = true;
      }
      return range;
    },
    load: function(params, callback) {
      var query = this._buildSearchQuery(params);
      //console.log('searchQuery', params, query);
      this._search.load(query, $.proxy(function(err, result) {
        this.onLoad(err, result, params, query, callback);
      }, this));
    },
    onLoad: function(err, result, params, query, callback) {
      if (err) {
        if (conf.debugMode) {console.log('load fail', err, result);}
        callback('fail', {message: '通信に失敗しました1'});
        return;
      }
      var searchResult;
        searchResult = {
          status: 'ok',
          count: result[0].values[0].total,
          page: params.page,
          list: []
        };
        var pushItems = function(items) {
          var len = items.length;
          for (var i = 0; i < len; i++) {
            var item = items[i];
            searchResult.list.push({
              id:                item.cmsid,
              type:              0, // 0 = VIDEO,
              length:            item.length_seconds ?
                                   Math.floor(item.length_seconds / 60) + ':' + (item.length_seconds % 60 + 100).toString().substr(1) : '',
              mylist_counter:    item.mylist_counter,
              view_counter:      item.view_counter,
              num_res:           item.comment_counter,
              first_retrieve:    item.start_time,
              create_time:       item.start_time,
              thumbnail_url:     item.thumbnail_url,
              title:             item.title,
              description_short: item.description ? item.description.replace(/<.*?>/g, '').substr(0, 150) : '',
              length_seconds:    item.length_seconds
  //            channel_id:        item.channel_id,
  //            main_community_id: item.main_community_id
            });
          }
        };
        for (var i = 1; i < result.length; i++) {
          if (result[i].type === 'hits' && result[i].endofstream) { break; }
          if (result[i].type === 'hits' && result[i].values) {
            pushItems(result[i].values);
          }
        }
      callback(null, searchResult);
    }
  };

  // sug.search.nicovideo.jpはリアルタイムの入力補完用？ で、関連タグはhttp://api.search.nicovideo.jp/api/tag/ っぽい
  var NicoSearchSuggest = function() { this.initialize.apply(this, arguments); };
  NicoSearchSuggest.API_BASE_URL = 'http://sug.search.nicovideo.jp/'; //'/suggestion/complete';
  NicoSearchSuggest.prototype = {
    _base_url: NicoSearchSuggest.API_BASE_URL,
    initialize: function(params) {
    },
    load: function(word, callback) {
      if (typeof word !== 'string' || word.length <= 0) {
        throw Exception('wordが設定されてない！');
      }
      var url        = this._base_url + 'suggestion/complete',
          cache_key  = JSON.stringify({url: url, word: word}),
          cache_time = 60 * 1000 * 1,
          cache      = Util.Cache.get(cache_key);
      if (cache) {
        setTimeout(function() { callback(null, cache); }, 0);
        return;
      }
      $.ajax({
        url: url,
        type: 'POST',
        data: word,
        complete: function(result) {
          if (result.status !== 200) {
            callback('fail', 'HTTP status:' + result.status);
            return;
          }
          var data;
          try {
            data = JSON.parse(result.responseText);
          } catch(e) {
            if (conf.debugMode) console.log('Exception: ', e, result);
            callback('fail', 'JSON syntax');
          }
          Util.Cache.set(cache_key, data, cache_time);
          callback(null, data);
        }
      });
    }
  };

  var NicoSearchRelatedTag = function() { this.initialize.apply(this, arguments); };
  NicoSearchRelatedTag.API_BASE_URL = 'http://api.search.nicovideo.jp/';
  NicoSearchRelatedTag.prototype = {
    _base_url: NicoSearchRelatedTag.API_BASE_URL,
    initialize: function(params) {
    },
    load: function(word, callback) {
      var url        = this._base_url + 'api/tag/',
          cache_key  = JSON.stringify({url: url, word: word}),
          cache_time = 60 * 1000 * 10,
          cache      = Util.Cache.get(cache_key);
      if (cache) {
        setTimeout(function() { callback(null, cache); }, 0);
        return;
      }
      var query = {query: word, service: ['tag_video'], from: 0, size: 100, timeout: 10000, issuer: 'pc', reason: 'user'};
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(query),
        complete: function(result) {
          if (result.status !== 200) {
            callback('fail', 'HTTP status:' + result.status);
            return;
          }
          var data;
          try {
            var lines = result.responseText.split('\n');
            data = JSON.parse(lines[0]);
          } catch(e) {
            if (conf.debugMode) console.log('Exception: ', e, result);
            callback('fail', 'JSON syntax');
            return;
          }
          Util.Cache.set(cache_key, data, cache_time);
          callback(null, data);
        }
      });
    }
 };


  /**
   *  動画視聴履歴をマイリストAPIと互換のある形式で返すことで、ダミーマイリストとして表示してしまう作戦
   */
  var VideoWatchHistory = (function(w, Util){
    function load(callback) {
      var watch, $, myNick, myId, url;
      try{
          watch = w.WatchApp.ns.init;
          $ = w.$; url = '/my/history';
          myNick = WatchController.getMyNick(); myId = WatchController.getMyUserId();
      } catch (e) {
        if (conf.debugMode) console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }

      var CACHE_KEY = 'videohistory', CACHE_TIME = 1000 * 60 * 1, cacheData = Util.Cache.get(CACHE_KEY);
      if (cacheData) {
        setTimeout(function() {callback(cacheData);}, 0);
        return;
      }

      var result = new DummyMylist({
        id: '-1',
        sort: '1',
        name: myNick + 'の視聴履歴',
        user_id: myId,
        user_name: 'ニコニコ動画'
      });
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
              thumbnail = $item.find('.thumbContainer a .video').attr('src');

            var item = new DummyMylistVideo({
              id: id,
              length: duration,
              mylist_counter: mylistCnt,
              view_counter: viewCnt,
              num_res: resCnt,
              first_retrieve: postedAt,
              thumbnail_url: thumbnail,
              title: title,
              _info: {first_retrieve: postedAt},
              description_short: $item.find('.section .posttime span').text()
            });
            result.push(item);
          });
          callback(Util.Cache.set(CACHE_KEY, result, CACHE_TIME));
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
      var watch, $, url, myNick, myId;
      try{
          watch = w.WatchApp.ns.init;
          $ = w.$;
          url = '/recommendations';
          myNick = WatchController.getMyNick();
          myId = WatchController.getMyUserId();
      } catch (e) {
        if (conf.debugMode) console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }
      var CACHE_KEY = 'recommend', CACHE_TIME = 1000 * 60 * 1, cacheData = Util.Cache.get(CACHE_KEY);
      if (cacheData) {
        setTimeout(function() {callback(cacheData); }, 0);
        return;
      }

      var result = new DummyMylist({
        id: '-2',
        sort: '1',
        name: 'あなたにオススメの動画'
      });
      GM_xmlhttpRequest({
        url: url,
        onload: function(resp) {
          var text = resp.responseText, lines = text.split(/[\r\n]/), found = false, data, i, len;
          for (i = 0, len = lines.length; i < len; i++) {
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

          for (i = 0, len = data.videos.length; i < len; i++) {
            var video = data.videos[i];
            if (histories[video.id]) {
              delete histories[video.id];
            }
            var item = new DummyMylistVideo({
              id: video.id,
              length: video.length,
              mylist_counter: video.mylist_counter,
              view_counter:   video.view_counter,
              num_res:        video.num_res,
              first_retrieve: video.first_retrieve,
              thumbnail_url:  video.thumbnail_url,
              title:          video.title_short,
              _info: video,
              description_short: '関連タグ: ' + video.recommend_tag
            });
            histories[video.id] = item;
          }
          for (var v in histories) {
            result.unshift(histories[v]);
          }
          result.slice(0, 128);
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
        result.setPage(viewPage);
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
      } else
      if (type === 'owner') {
        return WatchController.getOwnerName() + 'のニコレポ';
      }
      return base + 'お気に入りユーザーの動画';
    }

    var CACHE_TIME = 1000 * 60 * 10;
    function request(callback, param) {
      var watch, $, url, myNick, myId, type, baseUrl;
      try{
          watch = w.WatchApp.ns.init;
          $ = w.$;
          url = '';
          myNick = WatchController.getMyNick();
          myId = WatchController.getMyUserId();
          type = param.type ? param.type : 'user';
          baseUrl = '/my/top/' + type + '?innerPage=1&mode=next_page';
          if (param.userId) {
            baseUrl = '/user/'+ param.userId +'/top?innerPage=1&mode=next_page';
          }
      } catch (e) {
        if (conf.debugMode) console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        setTimeout(function() {callback(cacheData); }, 0);
        return;
      }

      var
        last_timeline = false,
        result = new DummyMylist({
          id: '-10',
          sort: '1',
          default_sort: '1',
          name: getNicorepoTitle(type),
          user_id:       type === 'owner' ? WatchController.getOwnerId()   : myId,
          user_nickname: type === 'owner' ? WatchController.getOwnerName() :'ニコニコ動画'
        });
      function req(callback, param, pageCount, maxPageCount) {
        var WatchApp = w.WatchApp, $ = w.$, url = baseUrl, escapeHTML = WatchApp.ns.util.StringUtil.escapeHTML;
        url += last_timeline ? ('&last_timeline=' + last_timeline) : '';
        if (conf.debugMode) console.log(url);

        var ownerReg = /\/(community|user|channel)\/((co|ch)?\d+)\??/;
        GM_xmlhttpRequest({
          url: url,
          onload: function(resp) {
            var $dom = $(resp.responseText), $list = $dom.find('.timeline'), $nextPageLink = $dom.find('.next-page-link'), hasNextPage = $nextPageLink.length > 0;

            $list.find([
              '.log-user-mylist-add',
              '.log-user-uad-advertise',
              '.log-user-video-upload',
              '.log-user-video-review',
              '.log-mylist-added-video',
              '.log-community-video-upload',
              '.log-user-video-round-number-of-view-counter',
              '.log-user-video-round-number-of-mylist-counter'
            ].join(', ')).each(function() {
              var
                $item = $(this), $title = $item.find('.log-content .log-target-info a'),
                id = $title.attr('href').split('/').reverse()[0].replace(/\?.*$/, ''), title = $title.text(),
                duration = '--:--',
                viewCnt   = '-',
                resCnt    = '-',
                mylistCnt = '-',
                postedAt  = WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M:%S', new Date($item.find('.log-footer-date time').attr('datetime'))),
                thumbnail = $item.find('.log-target-thumbnail .video').attr('data-src'),
                description_short = $.trim($item.find('.log-body').text()).replace(/(しました|されました)。/g, ''),
                $owner = $item.find('.author-user, .author-community'),
                ownerPage  = $owner.attr('href'),
                ownerMatch = ownerReg.exec(ownerPage),
                ownerName  = $owner.text(),
                ownerId    = (ownerMatch !== null && ownerMatch.length >= 3) ? ownerMatch[2] : null,
                ownerIcon  = $item.find('.log-author img').attr('data-src'),
                mylistComment = $item.find('.log-content .log-subdetails').text()
                ;

              $item.removeClass('log').removeClass('passive').removeClass('first');
              if (this.className === 'log-mylist-added-video') {
                ownerName = $item.find('.log-body a:first').text();
                ownerPage = $item.find('.log-body a:last').attr('href');
              }

              var item = new DummyMylistVideo({
                id: id,
                length: duration,
                mylist_counter: mylistCnt,
                view_counter: viewCnt,
                num_res: resCnt,
                first_retrieve: postedAt,
                thumbnail_url: thumbnail,
                mylist_comment: mylistComment,
                title: title,
                _info: {
                  first_retrieve: postedAt,
                  nicorepo_className: this.className,
                  nicorepo_log: [escapeHTML(description_short)],
                  nicorepo_owner: {
                    id: ownerId,
                    icon: ownerIcon,
                    page: ownerPage,
                    name: ownerName
                  }
                },
                description_short: description_short
              });
              result.push(item);
            });
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
      req(function (result) {
        var uniq = {}, uniq_items = [];
        for (var i = result.rawData.list.length - 1; i >= 0; i--) {
          var item = result.rawData.list[i], id = item.id;
          if (uniq[id]) {
            uniq[id]._info.nicorepo_log.push(item.first_retrieve + '　' + item._info.nicorepo_log[0].replace(/^.*?さん(の|が)動画(が|を) ?/, ''));
          } else {
            uniq[id] = item;
          }
        }
        for (var v in uniq) {
          uniq_items.unshift(uniq[v]);
        }
        callback(result);
      }, param, 1, 3);
    }
    function load(callback, param) {
      request(function(result) {
        var viewPage = (param && typeof param.page === 'number') ? param.page : 1;
        result.sortItem(param.sort || 1, true);
        result.setPage(viewPage);
        callback(result);
      }, param);
    }

    var self = {
      load: load,
      REPO_ALL:    -10,
      REPO_USER:   -11,
      REPO_CHCOM:  -12,
      REPO_MYLIST: -13,
      REPO_OWNER:  -14,
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
      },
      loadOwner: function(callback, p) {
        p = p || {};
        p.type = 'owner';
        p.userId = WatchController.getOwnerId();
        self.load(callback, p);
      }
    };
    return self;
  })(w, Util);



  /**
   *  ランキングのRSSをマイリストAPIと互換のある形式に変換することで、ダミーマイリストとして表示してしまう作戦
   */
  var VideoRanking = (function(w, Util) {
    var $ = w.jQuery;

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
    for (var term  in termIdTable ) { idTermTable [termIdTable [term ]] = term; }

    /**
     *  ニコニコ動画ランキングのRSSをマイリストAPI互換のデータ形式に変換
     */
    function rss2mylist(xml) {
      var
        $x = $(xml),
        title = $x.find('channel title:first').text(),
        $items = $x.find('channel item'),
        result = new DummyMylist({
          name: title,
          id: '-100'
        });
      $items.each(function() {
        var video = parseRssItem($(this));
        var item = new DummyMylistVideo({
          id: video.id,
          length: video.duration,
          mylist_counter: video.mylistCnt,
          view_counter: video.viewCnt,
          num_res: video.resCnt,
          first_retrieve: video.postedAt,
          thumbnail_url: video.thumbnail,
          title: video.title.replace(/^第(\d+)位/, '第000$1位').replace(/^第\d+(\d{3})位/, '第$1位'),
          _info: {first_retrieve: video.postedAt},
          description_short: video.description.substring(0, 50)
        });
        result.push(item);
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
    }

    var CACHE_TIME = 1000 * 60 * 30;
    function request(baseUrl, rssPage, maxRssPage, callback) {

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        setTimeout(function() {callback(cacheData); }, 0);
        return;
      }

      var result = new DummyMylist({
        name: '総合ランキング',
        id: '-100'
      });

      function req(rssPage, maxRssPage, callback) {
        var url = baseUrl + '&page=' + rssPage;
        xhr(
          function(resp) {
            var res = rss2mylist(resp.responseText);
            for (var i = 0, len = res.rawData.list.length; i < len; i++) {
              result.push(res.rawData.list[i]);
            }
            if (rssPage >= maxRssPage) {
              result.setName(res.getName());

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
        genreName = genreNameTable[category] || genreNameTable['all'],
        maxRssPage = 1, sort = param.sort || '4';

        term = idTermTable[termId] || idTermTable[0];
        maxRssPage = (category === 'all' && term !== 'hourly') ? 3 : 1;
      return {
        genreId: genreId,
        genreName: genreName,
        category: category,
        type: type,
        term: term,
        lang: lang,
        viewPage: viewPage,
        sort: sort,
        maxRssPage: maxRssPage,
        baseUrl: '/ranking/'+ type +'/'+ term + '/'+ category +'?rss=2.0&lang=' + lang
      };
    }

    function loadRanking(callback, param) {
      var p = parseParam(param);
      //console.log('loadRanking', p, param);
      request(p.baseUrl, 1, p.maxRssPage, function(result) {
        //if (conf.debugMode) console.log(result);
        result.name = p.genreName;
        //if (p.sort !== '') {
        //  result.sortItem(p.sort);
        //}
        result.setPage(p.viewPage);
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
      if (typeof g === 'number' || (typeof g === 'string' && g.match(/^-?[0-9]+$/))) {
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
   *  チャンネル動画一覧をマイリストAPIと互換のある形式で返すことで、ダミーマイリストとして表示してしまう作戦
   */
  var ChannelVideoList = (function(w, Util){
    var
      load = function(callback, params) {
        var watch, $, myNick, myId, url, id, ownerName;
        try{
          id = params.id.toString().replace(/^ch/, '');
          ownerName = params.ownerName;
          watch = w.WatchApp.ns.init;
          $ = w.$; url = 'http://ch.nicovideo.jp/channel/ch'+ id + '/video';
          myNick = WatchController.getMyNick(); myId = WatchController.getMyUserId();
        } catch (e) {
          if (conf.debugMode) console.log(e);
          throw { message: 'エラーが発生しました', status: 'fail'};
        }

        var CACHE_KEY = 'ch-' + id, CACHE_TIME = 1000 * 60 * 1, cacheData = Util.Cache.get(CACHE_KEY);
        if (cacheData) {
          setTimeout(function() {callback(cacheData); }, 0);
          return;
        }

        var result = new DummyMylist({
          id: 'ch' + id,
          sort: '1',
          name: ownerName + 'の動画',
          user_id: myId,
          user_name: 'ニコニコ動画'
        });
        $.ajax({
          url: url,
          method: 'get',
          cache: true,
          success: function(html) {
            parseItems(html, result);
            callback(Util.Cache.set(CACHE_KEY, result, CACHE_TIME));
          },
          error: function(error) {
            Popup.alert('チャンネル動画の取得に失敗しました');
            throw {message: 'チャンネル動画の取得に失敗しました:' + id, status: 'fail'};
          }
        });
      },
      parseItems = function(html, result) {
        var $html = $(html), $list = $html.find('.contents_list .item');
        $list.each(function() {
          var $item = $(this);
          var id = $item.find('.title a').attr('href').split('/').reverse()[0];
          var $counts = $item.find('.counts'), first_retrieve = $item.find('.time var').attr('title');
          w.$item = $item;
          result.push(new DummyMylistVideo({
            id: id,
            length: $item.find('.length').text(),
            mylist_counter: $counts.find('.mylist  var').text().split(',').join(''),
            view_counter:   $counts.find('.view    var').text().split(',').join(''),
            num_res:        $counts.find('.comment var').text().split(',').join(''),
            first_retrieve: first_retrieve,
            thumbnail_url:  $item.find('.lazyimage').data('original'),
            title:          $item.find('.title').text().trim(),
            _info: {first_retrieve: first_retrieve, is_channel: true},
            description_short: $item.find('.description').text().trim()
          }));
        });
        return result;
      },
      loadOwnerVideo = function(callback) {
        if (!WatchController.isChannelVideo()) {
          throw {message: 'チャンネル情報の取得に失敗しました', status: 'fail'};
        }
        var watchInfoModel = WatchApp.ns.model.WatchInfoModel.getInstance();
        var params = {
          id: watchInfoModel.channelId,
          ownerName: WatchController.getOwnerName()
        };
        load(callback, params);
      };

    var self = {
      load : load,
      loadOwnerVideo: loadOwnerVideo
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
  (function(w) { // Zero Watch
    var $ = w.$, $$ = w.$$;
    if (!w.WatchApp || !w.WatchJsApi) return;

    $.fx.interval = conf.fxInterval;

    var
      video_id = '', watch_id = '',
      iframe = Mylist.getPanel(''), //tv_chan = $('.videoMenuToggle')[0],
      WatchApp = w.WatchApp, WatchJsApi = w.WatchJsApi,
      isFixedHeader = !$('body').hasClass('nofix'), isTouchActive = false,
      watch = WatchApp.ns.init,
      tagv  = watch.TagInitializer.tagViewController,
      pim   = watch.PlayerInitializer.playerInitializeModel,
      npc   = watch.PlayerInitializer.nicoPlayerConnector,
      pac   = watch.PlayerInitializer.playerAreaConnector,
      vs    = watch.VideoExplorerInitializer.videoExplorerController.getVideoExplorer(),
      videoExplorer  = vs,
      $leftPanel     = $('<div id="leftPanel" />').addClass('sidePanel'),
      $rightPanel = $('#playerTabWrapper').addClass('sidePanel');
    var watchInfoModel = WatchApp.ns.model.WatchInfoModel.getInstance();

  //  var flashVars = pim.playerInitializeModel.flashVars;

    /**
     *  ゆっくり再生(スロー再生)メニュー
     */
    var Yukkuri = (function($, conf, w) {
      var self, $content = null, $button = null, timer = null, cnt = 0, isActive = false;

      function createDom() {
        $content = $('<div id="yukkuriPanel" />');
        $button = $('<button>yu</button>').addClass('yukkuriButton').attr({title: 'ゆっくり(スロー再生)'});
        $button.click(function() {
          toggleActive();
        });
        $content.append($button);

        $('body').append($content);
      }

      function show() {
        if ($content === null) {
          createDom();
        }
        updateView();
        $content.show();
      }
      function hide() {
        $content.hide();
      }
      function updateView() {
        $button.toggleClass('active', isActive);
      }

      function start() {
        if (timer !== null) {
          clearInterval(timer);
        }
        isActive = true;
        updateView();
        timer = setInterval(function() {
          var v = cnt++ % 4;
          if (v === 0) {
            WatchController.play();
          } else
          if (v === 1) {
            WatchController.pause();
          }
        }, 20);
      }
      function stop() {
        if (timer !== null) {
          clearInterval(timer);
          timer = null;
        }
        isActive = false;
        updateView();
        WatchController.pause();
      }

      function toggleActive() {
        if (isActive) {
          stop();
        } else {
          start();
        }
        return isActive;
      }

      self = {
        show: show,
        hide: hide,
        start: start,
        stop: stop
      };
      return self;
    })($, conf, w);

    var NicommendReader = (function($, conf, w) {
      var self, dataCache = {};

      function update() {
        //console.log('nicommendreader update', $('#nicommendPanelContent').find('.nicommendItemList>.item'));// dataCache = {};
        $('#nicommendPanelContent').find('.nicommendItemList>.item').each(function() {
          var $item = $(this), url, img;
          if ($item.hasClass('video')) {
            url = $item.find('.itemThumb>a').attr('href').split('?')[0];
            url = url.replace('www.nicovideo.jp', location.host);
            dataCache[url] = {
              type: 'video',
              title: $.trim($item.find('.itemName a').text()),
              thumbnail: [$item.find('.itemThumb img').attr('src')]
            };
          } else
          if ($item.hasClass('mylist')) {
            url = $item.find('.itemThumb>a').attr('href').split('?')[0];
            img = $item.find('.itemThumb img');
            url = url.replace('www.nicovideo.jp', location.host);
            dataCache[url] = {
              type: 'mylist',
              title: $.trim($item.find('.itemName a').text()),
              count: $item.find('.itemName .value').text().replace('件', ''),
              thumbnail: []
            };
            if(img[0]) dataCache[url].thumbnail[0] = img[0].src;
            if(img[1]) dataCache[url].thumbnail[1] = img[1].src;
            if(img[2]) dataCache[url].thumbnail[2] = img[2].src;

          }
          if ($item.hasClass('illust')) {
            url = $item.find('.itemThumb>a').attr('href').split('?')[0];
            img = $item.find('.itemThumb img');
            url = url.replace('www.nicovideo.jp', location.host);
            dataCache[url] = {
              type: 'illust',
              title: $.trim($item.find('.itemName a').text()),
              thumbnail: [$item.find('.itemThumb img').attr('src')]
            };

          }
        });
        //console.log(dataCache);
      }

      function info(url) {
        return dataCache[url] || {};
      }

      self = {
        update: update,
        info: info
      };
      return self;
    })($, conf, w);

    var resizeWatchTimer = null;
    function onWindowResize() {
      if (resizeWatchTimer !== null) {
        clearTimeout(resizeWatchTimer);
        resizeWatchTimer = null;
      }
      AnchorHoverPopup.hidePopup();
      resizeWatchTimer = setTimeout(function() {
        EventDispatcher.dispatch('onWindowResize');
      }, 1000);
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
            setTimeout(function() {$('#ichiba_search_form_query').focus();}, 1000);
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
      };
      search();
      w.ichiba.showConsole();
    }

    function initVideoCounter() {
      EventDispatcher.addEventListener('onWatchInfoReset', function(watchInfoModel){
        setVideoCounter(watchInfoModel, true);
      });
      var blinkItem = function($elm) {
        $elm.removeClass('animateBlink').addClass('blink');
        setTimeout(function() {
          $elm.addClass('animateBlink').removeClass('blink');
        }, 500);
      };

      var
        playerAreaConnector = watch.PlayerInitializer.playerAreaConnector,
        counter = {mylistCount: 0, viewCount: 0, commentCount: 0};
      playerAreaConnector.addEventListener('onWatchCountUpdated', function(c) {
        var diff = c - counter.viewCount;
        if (diff === 0) return;
        counter.viewCount    = c;
        EventDispatcher.dispatch('onVideoCountUpdated', counter, 'viewCount', diff);
      });
      playerAreaConnector.addEventListener('onCommentCountUpdated', function(c) {
        var diff = c - counter.commentCount;
        if (diff === 0) return;
        counter.commentCount = c;
        EventDispatcher.dispatch('onVideoCountUpdated', counter, 'commentCount', diff);
      });
      playerAreaConnector.addEventListener('onMylistCountUpdated', function(c) {
        var diff = c - counter.mylistCount;
        if (diff === 0) return;
        counter.mylistCount  = c;
        EventDispatcher.dispatch('onVideoCountUpdated', counter, 'mylistCount', diff);
      });

      EventDispatcher.addEventListener('onVideoCountUpdated', function(c, type, diff) {
        var $target = $('.sidePanel .videoInfo, #trueBrowserFullShield, #videoCounter');
        assignVideoCountToDom($target, c);
        $target.find('.' + type + 'Diff').text(diff).toggleClass('down', diff < 0);
        blinkItem($target.find('.' + type + ', .' + type + 'Diff'));
      });

      function setVideoCounter(watchInfoModel) {
        var addComma = WatchApp.ns.util.StringUtil.addComma;
        counter.mylistCount  = watchInfoModel.mylistCount;
        counter.viewCount    = watchInfoModel.viewCount;
        counter.commentCount = watchInfoModel.commentCount;

        var $tpl = $(
          '<span>再生: <span class="viewCountDiff videoCountDiff"></span><span class="viewCount videoCount"></span> コメ: <span class="commentCountDiff videoCountDiff"></span><span class="commentCount videoCount"></span> マイ: <span class="mylistCountDiff  videoCountDiff"></span><span class="mylistCount videoCount"></span></span>'
        );
        assignVideoCountToDom($tpl, counter);

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
            '<br/><span style="margin-left:10px; font-size: 90%;">'+ $tpl.html() + '</span>'
          );
        }
        $('#trueBrowserFullShield').html([
          '<img class="ownerIcon" src="', WatchController.getOwnerIcon(), '">',
          '<div class="title">', watchInfoModel.title, '</div>',
          '<p class="postedAt">',$('.videoPostedAt:last').text(), '</p>',
          '<p class="videoCounter">', $tpl.html(), '</p>',
        ''].join(''))
          .toggleClass('favorite', WatchController.isFavoriteOwner())
          .find('img').attr('title', WatchController.getOwnerName());

        if (conf.headerViewCounter) {
          var vc = $('#videoCounter');
          if (vc.length < 1) {
            var li = $('<li></li>')[0];
            li.id = 'videoCounter';
            $('#siteHeaderLeftMenu').after(li);
            vc = $('#videoCounter');
          }
          vc.empty().append($tpl);
        }
      }
    }

    var isFirst = true;
    function onVideoInitialized() {
      watch = WatchApp.namespace.init;
      AnchorHoverPopup.hidePopup().updateNow();
      tagv = watch.TagInitializer.tagViewController;
      pim  = watch.PlayerInitializer.playerInitializeModel;
      var newVideoId = watchInfoModel.id;
      var newWatchId = watchInfoModel.v;
      iframe.watchId(newVideoId, newWatchId);
      iframe.show();
      WatchCounter.add();

      if (isFirst) {
        if (conf.autoPlayIfWindowActive === 'yes' && w.document.hasFocus()) {
          // ウィンドウがアクティブの時だけ自動再生する。 複数タブ開いてるときは便利
          setTimeout(function() { WatchController.play();}, 2000);
        }

        if (isFirst && conf.commentVisibility !== 'visible') {
          if (conf.commentVisibility === 'hidden') {
            if (conf.debugMode) console.log('comment off');
            WatchController.commentVisibility(false);
          } else {
            if (conf.debugMode) console.log('last state', conf.lastCommentVisibility);
            WatchController.commentVisibility(conf.lastCommentVisibility === 'visible');
          }
        }
        EventDispatcher.dispatch('onFirstVideoInitialized');
      }

      EventDispatcher.dispatch('onVideoInitialized', isFirst);
      isFirst = false;
    }


    function onVideoChangeStatusUpdated(isChanging) {
      AnchorHoverPopup.hidePopup();
      if (isChanging) {
        $('.sidePanel .sideVideoInfo').removeClass('show');
      }
      if (conf.enableAutoPlaybackContinue && watch.PlayerInitializer.noUserOperationController.autoPlaybackModel._isAutoPlayback) {
        watch.PlayerInitializer.noUserOperationController.autoPlaybackModel.setCount(0);
      }
      EventDispatcher.dispatch('onVideoChangeStatusUpdated', isChanging);
    }

    var $sideInfoPanelTemplate = $([
      '<div class="sideVideoInfoInner">',

        '<div class="videoTitleContainer"><h3 class="videoTitle"></h3></div>',
        '<div class="videoOwnerInfoContainer">',
         '<div class="channelIconContainer"><a target="_blank" class="channelIconLink">',
          '<img class="channelIcon"></a>',
          '<span class="channelName">提供: ',
          '<a class="showOtherVideos" target="_blank"><span class="channelNameInner"></span></a></span>',
          '</span>',
         '</div>',
         '<div class="userIconContainer"><a target="_blank" class="userIconLink">',
          '<img class="userIcon"></a>',
          '<span class="userName">投稿者: ',
           '<span class="userNameInner notPublic"></span>',
           '<span class="isPublic"><a class="showOtherVideos"><span class="userNameInner"></span></a></span>',
          '</span>',
         '</div>',
        '</div>',
        '<div class="videoInfo">',
          '<span class="videoPostedAt"></span>',
          '<ul class="videoStats">',
            '<li style="position: relative;">再生: <span       class="viewCountDiff     videoCountDiff"></span><span class="videoCount viewCount"></span></li>',
            '<li style="position: relative;">コメント: <span   class="commentCountDiff  videoCountDiff"></span><span class="videoCount commentCount"></span></li>',
            '<li style="position: relative;">マイリスト: <span class="mylistCountDiff   videoCountDiff"></span><span class="videoCount mylistCount"></span></li>',
          '</ul>',
        '</div>',


        '<div class="videoThumbnailContainer" style="display: none;">',
          '<img class="videoThumbnailImage">',
        '</div>',
        '<div class="videoDetails">',
          '<div class="videoDescription">',
            '<div class="videoDescriptionInner">',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    ''].join(''));


    // - 左パネル乗っ取る
    var leftInfoPanelInitialized = false, $leftPanelTemplate = null;
    function initLeftPanel($sidePanel) {

      if (leftInfoPanelInitialized) {
        $('#playerContainer').append($sidePanel);
        return;
      }
      leftInfoPanelInitialized = true;

      $('#playerContainer').append($sidePanel);
      var $tab = $([
          '<ul id="leftPanelTabContainer">',
          '<li class="tab ichiba"    data-selection="ichiba"   >市場</li>',
          '<li class="tab videoInfo" data-selection="videoInfo">情報</li>',
          '</ul>'].join(''));

      var
        $infoPanel   = $('<div/>').attr({'id': 'leftVideoInfo',    'class': 'sideVideoInfo   sidePanelInner'}),
        $ichibaPanel = $('<div/>').attr({'id': 'leftIchibaPanel',  'class': 'sideIchibaPanel sidePanelInner'});
      $sidePanel.append($tab).append($infoPanel).append($ichibaPanel);

      var
        onTabSelect = function(e) {
          e.preventDefault();
          AnchorHoverPopup.hidePopup();
          var selection = $(e.target).attr('data-selection');
          if (typeof selection === 'string') {
            conf.setValue('lastLeftTab', selection);
            changeTab(selection);
          }
        },
        changeTab = function(selection) {
          $sidePanel.removeClass('videoInfo ichiba').addClass(selection);
         if (selection === 'ichiba') {
            resetIchiba(false);
          }
        },
        lastIchibaVideoId = '', resetIchiba = function(force) {
          var videoId = watchInfoModel.id;
          if (lastIchibaVideoId === videoId && !force) {
            return;
          }
          lastIchibaVideoId = videoId;
          resetSideIchibaPanel($ichibaPanel, true);
        },
        resetScroll = function() {
          $(this).animate({scrollTop: 0}, 600);
        };

      $infoPanel  .on('dblclick', resetScroll);
      $ichibaPanel.on('dblclick', resetScroll);

      $tab.on('click', onTabSelect).on('touchend', onTabSelect);
      changeTab(conf.lastLeftTab);

      var $infoPanelTemplate = $sideInfoPanelTemplate;

      EventDispatcher.addEventListener('onVideoInitialized', function() {
        sidePanelRefresh($infoPanel, $ichibaPanel, $sidePanel, $infoPanelTemplate.clone());
        if ($ichibaPanel.is(':visible')) {
          resetIchiba(true);
        }
      });

    } // end of initLeftPanel

    function assignVideoCountToDom($tpl, count) {
      var addComma = WatchApp.ns.util.StringUtil.addComma;
      $tpl
        .find('.viewCount'   ).text(addComma(count.viewCount   )).end()
        .find('.commentCount').text(addComma(count.commentCount)).end()
        .find('.mylistCount' ).text(addComma(count.mylistCount ));
      return $tpl;
    }

    function sidePanelRefresh($sideInfoPanel, $ichibaPanel, $sidePanel, $template) {
      var uploaderId = watchInfoModel.uploaderInfo.id, isFavorite = WatchController.isFavoriteOwner();
      var h = $sideInfoPanel.innerHeight() - 100, $inner = $('<div/>');


      $template.find('.videoTitle').html(watchInfoModel.title);

      var $videoDetails = $template.find('.videoDetails');
      $videoDetails.css({overflowY: 'hidden', minHeight: 0});

      assignVideoCountToDom($template, watchInfoModel);
      $template.find('.videoPostedAt').text($('.videoPostedAt:last').text());

      var $videoDescription = $template.find('.videoDescription');

      $videoDescription.find('.videoDescriptionInner').append(create$videoDescription(watchInfoModel.description));
      $videoDescription.find('.watch').unbind('click');

      NicommendReader.update();

      $videoDescription.find('.videoDescriptionInner a').each(function() {
        var url = this.href, info = NicommendReader.info(url), text, $this = $(this);
        if (info.type === 'video') {
            text = $this.text();
            $this.after([
                '<div class="descriptionThumbnail video" style="">',
                '<img src="', info.thumbnail[0], '">',
                '<p>', info.title, '</p>',
                '</div>',
            ''].join(''));
        } else
        if (info.type === 'mylist') {
            text = $this.text();
            var dom = [
                '<div class="descriptionThumbnail mylist">',
                '<p>', info.title, '</p>'
            ];
            if (info.thumbnail[0]) dom.push('<img src="' + info.thumbnail[0] + '">');
            if (info.thumbnail[1]) dom.push('<img src="' + info.thumbnail[1] + '">');
            if (info.thumbnail[2]) dom.push('<img src="' + info.thumbnail[2] + '">');
            dom.push('</div>');
            $this.after(dom.join(''));
        } else
        if (info.type === 'illust') {
            text = $this.text();
            $this.after([
                '<div class="descriptionThumbnail illust" style="">',
                '<img src="', info.thumbnail[0], '">',
                '<p>', info.title, '</p>',
                '</div>',
            ''].join(''));
        }
      });

      $videoDescription.find('.descriptionThumbnail img').on('click', function() { showLargeThumbnail(this.src); });

      var $videoOwnerInfoContainer = $template.find('.videoOwnerInfoContainer');
      var $userIconContainer       = $template.find('.userIconContainer');
      var $channelIconContainer    = $template.find('.channelIconContainer');

      if (WatchController.isChannelVideo()) {
        var channelInfo = watchInfoModel.channelInfo;
        var $ch_prof = $('#ch_prof'), chUrl = $ch_prof.find('.symbol').attr('href');
        if (channelInfo.id && $ch_prof.length > 0) {
          $channelIconContainer
            .find('.channelIcon')
              .attr({'src': channelInfo.iconUrl}).end()
            .find('.channelIconLink')
              .attr({'href': chUrl})
              .on('click', function(e) {
                if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) { return; }
                e.preventDefault();
                WatchController.openChannelOwnersVideo();
             }).end()
            .find('.channelNameInner')
              .text(channelInfo.name).end()
            .find('.showOtherVideos')
              .attr({'href': chUrl})
              .on('click', function(e) {
                if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) { return; }
                e.preventDefault();
                WatchController.openChannelOwnersVideo();
             });
         }
        $userIconContainer.remove();
      } else {
        var uploaderInfo = watchInfoModel.uploaderInfo;
        if (uploaderInfo.id) { // ユーザーが退会してたりすると情報が無いのでチェックしてから
          var userPage = '/user/' + uploaderInfo.id;
          $userIconContainer
            .find('.userIcon')
              .attr({'src': uploaderInfo.iconUrl}).end()
            .find('.userIconLink')
              .attr({'href': userPage})
              .on('click', function(e) {
                if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) { return; }
                e.preventDefault();
                WatchController.showMylist(NicorepoVideo.REPO_OWNER);
              }).end()
            .find('.userNameInner')
              .text(uploaderInfo.nickname).end()
            .find('.showOtherVideos')
              .attr({'href': userPage + '/video'})
              .on('click', function(e) {
                if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) { return; }
                e.preventDefault();
                WatchController.openUpNushiVideo();
              }).end()
            .toggleClass('isUserVideoPublic', uploaderInfo.isUserVideoPublic);
          $channelIconContainer.remove();
        } else {
          $userIconContainer.remove();
          $channelIconContainer.remove();
        }

      }

      $sideInfoPanel.find('*').unbind();

      $sidePanel
        .toggleClass('ichibaEmpty',    $('#ichibaMain')   .find('.ichiba_mainitem').length < 1)
        .toggleClass('nicommendEmpty', WatchController.isNicommendEmpty());

      $sideInfoPanel
        .empty()
        .scrollTop(0)
        .toggleClass('isFavorite', isFavorite)
        .toggleClass('isChannel', WatchController.isChannelVideo())
        .append($template);

      setTimeout(function() {
        $sideInfoPanel.addClass('show');
      }, 100);

    } // end of sidePanelRefresh


    function create$videoDescription(html) {
      var linkmatch = /<a.*?<\/a>/, links = [], n;
      html = html.split('<br />').join(' <br /> ');
      while ((n = linkmatch.exec(html)) !== null) {
        links.push(n);
        html = html.replace(n, ' <!----> ');
      }
      html = html.replace(/(https?:\/\/[\x21-\x7e]+)/gi, '<a href="$1" target="_blank" class="otherSite">$1</a>');
      for (var i = 0, len = links.length; i < len; i++) {
        html = html.replace(' <!----> ', links[i]);
      }
      html = html.split(' <br /> ').join('<br />');
      var $description = $('<p class="videoDescription description">' + html + '</p>');
      $description.find('a:not(.otherSite)').each(function(i, elm) {
        if (elm.tagName === 'A') {
          if (elm.className === 'otherSite') return;
          var $elm = $(elm);
          if (elm.textContent.indexOf('mylist/') === 0) {
            $elm.addClass('mylist').attr('target', null).on('click.leftInfo', function(e) {
              if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey || e.button !== 0) return;
              e.preventDefault();
              WatchController.showMylist(this.text.split('/').reverse()[0]);
            });
          } else
          if (elm.className === 'seekTime') {
            $elm.attr('href', location.href + '?from=' + $elm.text().substr(1)).on('click.leftInfo', function(e) {
              if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey || e.button !== 0) return;
              e.preventDefault();
              var data = $(this).attr('data-seekTime').split(":");
              WatchController.vpos((data[0] * 60 + parseInt(data[1], 10)) * 1000);
            });
          }
        }
      });
      return $description;
    }

    function resetSideIchibaPanel($ichibaPanel, force) {
      var videoId = watchInfoModel.id;

      $ichibaPanel.scrollTop(0);
      $ichibaPanel.empty();
      var $inner  = $('<div class="ichibaPanelInner" />');
      var $header = $('<div class="ichibaPanelHeader"><p class="logo">ニコニコ市場出張所</p></div>');
      $inner.append($header);


      var items = [];
      $('#ichibaMain').find('.ichiba_mainitem>div').each(function() {
        var $item = $(this).clone().attr('id', null);
        var $dl = $('<dl class="ichiba_mainitem" />').append($item);
        $item.find('.thumbnail span').css({fontSize: ''});
        // 誤クリックしやすいのでサムネはリンクを外す
        $item.find('.thumbnail a img, .blomagaThumbnail, .blomagaText')
          .parent().attr('href', null).attr('style', null).css({'text-decoration': 'none'});
        $item.find('a').attr('onclick', null);
        items.push($dl);
        $inner.append($dl);
      });
      if (items.length > 0) {
        for (var i = items.length -1; i >= 0; i--) {
          $inner.find('#watch' + i + '_mq').attr('id', null).addClass('ichibaMarquee');
        }
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
        resetSideIchibaPanel($ichibaPanel, true);
      });
      $footer.append($reloadIchiba);

      $inner.append($footer);
      $inner.hide();
      $ichibaPanel.append($inner);
      $inner.fadeIn();
    }

    function initHidariue() {
      var hidariue = null;
      var resetHidariue = function() {
        var dt = new Date();
        if (dt.getMonth() < 1 && dt.getDate() <=1) {
          $('#videoMenuTopList').append('<li style="position:absolute;left:300px;font-size:50%">　＼　│　／<br>　　／￣＼　　 ／￣￣￣￣￣￣￣￣￣<br>─（ ﾟ ∀ ﾟ ）＜　しんねんしんねん！<br>　　＼＿／　　 ＼＿＿＿＿＿＿＿＿＿<br>　／　│　＼</li>');
        }
        if (!conf.hidariue) { return; }
        if (!hidariue) {
          $('#videoMenuTopList').append('<li class="hidariue" style="position:absolute;top:21px;left:0px;"><a href="http://userscripts.org/scripts/show/151269" target="_blank" style="color:black;"><img id="hidariue" style="border-radius: 8px; box-shadow: 1px 1px 2px #ccc;"></a><p id="nicodou" style="padding-left: 4px; display: inline-block"><a href="http://www.nicovideo.jp/video_top" target="_top"><img src="http://res.nimg.jp/img/base/head/logo/q.png" alt="ニコニコ動画:Q"></a></p><!--<a href="http://nico.ms/sm18845030" class="itemEcoLink">…</a>--></li>');
          hidariue = $('#hidariue')[0];
        }
        hidariue.src = 'http://res.nimg.jp/img/base/head/icon/nico/' +
                (1000 + Math.floor(Math.random() * 1000)).toString().substr(1) + '.gif';
      };
      EventDispatcher.addEventListener('onVideoInitialized', resetHidariue);
    }

    var $favMylistToggle = null, $favMylistPopup = null, loadFavMylistTimer = null;
    function loadFavMylists() {
      if ($favMylistToggle) {
        $('.videoExplorerMenu').find('ul:first li:first').after($favMylistPopup).after($favMylistToggle);
        return;
      }
      if (loadFavMylistTimer) { return; }
      loadFavMylistTimer =  setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>お気に入りマイリスト</a>'),
            $popup = $('<li><ul></ul></li>').addClass('slideMenu'), $ul = $popup.find('ul'),
            $reload = $('<li><button class="reload">リロード</button></li>'),
            $reloadButton = $reload.find('button');
        $toggle.attr('id','favoriteMylistsMenu').addClass('watchItLaterMenu');
        $a.attr('href', '/my/fav/mylist').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible);
          setTimeout(function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          }, 500);
        });
        $favMylistToggle = $toggle;
        $favMylistPopup  = $popup;
        $toggle.append($a);//.append($popup)
        $('.videoExplorerMenu').find('ul:first li:first').after($popup).after($toggle);


        function reload() {
          $reloadButton.unbind('click');
          $ul.hide(300, function() { $ul.empty().show(); });
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
                  mylist.description, '\n',
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
                      if (e.button !== 0 || e.metaKey) return;
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
        load();

      }, 100);
    }


    var $favTagToggle = null, $favTagPopup = null, loadFavTagsTimer = null;
    function loadFavTags() {
      if ($favTagToggle) {
        $('.videoExplorerMenu').find('ul:first li:first').after($favTagPopup).after($favTagToggle);
        return;
      }
      if (loadFavTagsTimer) { return; }
      loadFavTagsTimer =  setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>お気に入りタグ</a>'),
            $popup = $('<li><ul></ul></li>').addClass('slideMenu'), $ul = $popup.find('ul');
        $toggle.attr('id', 'favoriteTagsMenu').addClass('watchItLaterMenu');
        $a.attr('href', '/my/fav/tag').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $popup.toggleClass('open', !isVisible);
          setTimeout(function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          }, 500);
        });
        $favTagToggle = $toggle;
        $favTagPopup  = $popup;
        $toggle.append($a);
        $('.videoExplorerMenu').find('ul:first li:first').after($popup).after($toggle);

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
                if (e.button !== 0 || e.metaKey) return;
                e.preventDefault();
                WatchController.nicoSearch($(this).text());
              });
            $ul.append($li.append($a));
          }
          $toggle.fadeIn(500);
        });
      }, 100);
    }


    var $mylistListToggle = null, $mylistListPopup = null, loadMylistListTimer = null;
    function loadMylistList() {
      if ($mylistListToggle) {
        $('.videoExplorerMenu').find('ul:first li:first').after($mylistListPopup).after($mylistListToggle);
        return;
      }
      if (loadMylistListTimer) { return; }
      loadMylistListTimer = setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>マイショートカット</a>'),
            $popup = $('<li><ul></ul></li>').addClass('slideMenu'), $ul = $popup.find('ul');
        $toggle.attr('id', 'mylistListMenu').addClass('watchItLaterMenu');
        $a.attr('href', '/my/mylist').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible);
          setTimeout(function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          }, 500);
        });
        $toggle.append($a);
        $('.videoExplorerMenu').find('ul:first li:first').after($popup).after($toggle);
        $mylistListToggle = $toggle;
        $mylistListPopup = $popup;

        Mylist.loadMylistList(function(mylistList) {
          $ul.append(
            $('<li/>').append(
              $('<a/>')
                .attr({href: '/my/mylist'})
                .text('とりあえずマイリスト')
                .addClass('mylistList')
                .addClass('defMylist')
                .click(function(e) {
                  if (e.button !== 0 || e.metaKey) return;
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
                  if (e.button !== 0 || e.metaKey) return;
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
                    if (e.button !== 0 || e.metaKey) return;
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

    var $videoRankingToggle = null, $videoRankingPopup = null, loadVideoRankingTimer = null;
    function loadVideoRanking() {
      if ($videoRankingToggle) {
        $('.videoExplorerMenu').find('ul:first li:first').after($videoRankingPopup).after($videoRankingToggle);
        return;
      }
      if (loadVideoRankingTimer) { return; }
      loadVideoRankingTimer = setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>動画ランキング</a>'),
            $popup = $('<li><ul></ul></li>').addClass('slideMenu'), $ul = $popup.find('ul');
        function createMenu($, genre, id, name, category, term) {
          var $a =
            $('<a/>')
              .attr({href: '/ranking/fav/' + term + '/' + genre})
              .text(name)
              .addClass('videoRanking')
              .addClass(genre)
              .click(function(e) {
                if (e.button !== 0 || e.metaKey) return;
                e.preventDefault();
                WatchController.showMylist(id);
              });
          return $('<li/>').addClass(category).append($a);
        }

        $toggle.attr('id', 'videoRankingMenu').addClass('watchItLaterMenu');
        $a.attr('href', '/ranking').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible);
          setTimeout(function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          }, 500);
        });
        $toggle.append($a);
        $('.videoExplorerMenu').find('ul:first li:first').after($popup).after($toggle);
        $videoRankingToggle = $toggle; $videoRankingPopup = $popup;
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
      }, 100);
    }


    var isMylistHacked = false;
    function initMylist($) {
      if (isMylistHacked) { return; }
      isMylistHacked = true;
      var currentMylistId = 0;
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec      = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer = vec.getVideoExplorer();
      var myUserId = WatchController.getMyUserId();

      // アイコン表示のテンプレートを拡張
      var menu =
        '<div class="thumbnailHoverMenu">' +
        '<button class="showLargeThumbnail" onclick="WatchItLater.onShowLargeThumbnailClick(this);" title="大きいサムネイルを表示">＋</button>' +
        '<button class="deleteFromMyMylist" onclick="WatchItLater.onDeleteFromMyMylistClick(this);">マイリスト外す</button>' +
        '</div>', $menu = $(menu);

      var $template = $('<div/>').html(watch.VideoExplorerInitializer.videoExplorerView._contentListView._$view.find('.videoItemTemplate').html());
        $template.find('.column1 .thumbnailContainer').append($menu);
        $template.find('.column4 .balloon').before($menu.clone());
        $template.find('.column1')
          .find('.descriptionShort').after($('<p class="itemMylistComment mylistComment"/>'))
          .end().find('.createdTime').after($('<div class="nicorepoOwnerIconContainer"><a target="_blank"><img /></a></div>'));
        //console.log($template.html());
        watch.VideoExplorerInitializer.videoExplorerView._contentListView._$view.find('.videoItemTemplate').html($template.html());

      var
        onShowLargeThumbnailClick = function (elm) {
         var
           $videoItem = $(elm).parent().parent(),
           src        = $videoItem.find('.thumbnail').attr('src');
         if (!src) { return; }
         showLargeThumbnail(src);
        },
        onDeleteFromMyMylistClick = function(elm) {
          var
            $videoItem = $(elm).parent().parent(),
            watchId    = $videoItem.find('.link').attr('href').split('/').reverse()[0];
          if (currentMylistId <= 0 || !Mylist.isMine(currentMylistId)) {
            return;
          }
          setTimeout(function() {
            try {
              Mylist.deleteMylistItem(watchId, currentMylistId, function(status, result) {
                if (status !== "ok") {
                  Popup.alert('削除に失敗: ' + result.error.description);
                } else {
                  $videoItem.parent().animate({opacity: 0.3}, 500);
                }
              });
            } catch (e) {
              if (e.message) { Popup.alert(e.message); }
              else {
                if (conf.debugMode) console.log(e);
                throw e;
              }
            }
          }, 0);
        };
      WatchItLater.onDeleteFromMyMylistClick = onDeleteFromMyMylistClick;
      WatchItLater.onShowLargeThumbnailClick = onShowLargeThumbnailClick;


      var content = explorer.getContentList().getContent(ContentType.MYLIST_VIDEO);
      var loader  = content._mylistVideoAPILoader;
      var pager   = content._pager;

      pager._pageItemCount = 100;

      // マイリストデータ取得時の処理フック。 viewでやる物はいずれ分けたい
      content.refresh_org = content.refresh;
      content.refresh = $.proxy(function(params, callback) {
        currentMylistId = 0;
        $('.videoExplorerBody').removeClass('dummyMylist').removeClass('mylist').removeClass('isMine');
        this.refresh_org(params, callback);
      }, content);

      content.onLoad_org = content.onLoad;
      content.onLoad = $.proxy(function(a, b) {
        this.onLoad_org(a, b);
        var mylistOwnerUserId = parseInt(this.getUserId(), 10);
        $('.videoExplorerBody').toggleClass('isMine', mylistOwnerUserId === myUserId && currentMylistId > 0);
      }, content);

      loader.load_org = loader.load;
      loader.load = $.proxy(function(params, callback) {
        var id= params.id;
        currentMylistId = id;
        if (id < 0) {
          //console.log('mylist hack!!!', id, typeof id, VideoRanking.getGenreName(id));
          var onload  = function(result) { callback(null,    result); };
          var onerror = function(result) { callback('error', result); };
           // マイリストIDに負の数字(通常ないはず)が来たら乗っ取るサイン
           // そもそもマイリストIDはstringのようなので数字にこだわる必要なかったかも
            $('.videoExplorerBody')
              .addClass('dummyMylist')
              .removeClass('mylist')
              .removeClass('isMine')
              .removeClass('ownerNicorepo')
              .removeClass('ranking');

          try {
            if (typeof VideoRanking.getGenreName(id) === 'string') {
              if (conf.debugMode)console.log('load VideoRanking:', VideoRanking.getGenreName(id));
              VideoRanking.load(onload, {
                id: id //, sort: params.sort || '4'
              });
              return;
            }
            // TODO: マジックナンバーを
            switch (parseInt(id, 10)) {
              case -1:
                VideoWatchHistory.load(onload);
                break;
              case -2:
                VideoRecommendations.load(onload);
                break;
              case -3:
                ChannelVideoList.loadOwnerVideo(onload);
                break;
              case NicorepoVideo.REPO_ALL:
                NicorepoVideo.loadAll(onload);
                break;
              case NicorepoVideo.REPO_USER:
                NicorepoVideo.loadUser(onload);
                break;
              case NicorepoVideo.REPO_CHCOM:
                NicorepoVideo.loadChCom(onload);
                break;
              case NicorepoVideo.REPO_MYLIST:
                NicorepoVideo.loadMylist(onload);
                break;
              case NicorepoVideo.REPO_OWNER:
                NicorepoVideo.loadOwner(onload);
                break;
              default:
                throw {message: '未定義のIDです:' + id, status: 'fail'};
            }
          } catch(e) {
            // TODO: ここのエラーをちゃんと投げる
            if (e.message && e.status) {
              onerror({
                status: e.status,
                message: e.message
            });
            } else {
             if (conf.debugMode) { console.log(e); console.trace(); }
             onerror({message: 'エラーが発生しました:' + id, status: 'fail'});
            }
          }
        } else {
          $('.videoExplorerBody')
            .removeClass('dummyMylist')
            .removeClass('ranking')
            .removeClass('ownerNicorepo')
            .addClass('mylist');
            //.toggleClass('isMine', Mylist.isMine(id));
          this.load_org(params, callback);
        }
      }, loader);


      // フォルダ表示の拡張
      var itemView = WatchApp.ns.components.videoexplorer.view.content.item.AbstractVideoContentItemView;
      itemView.prototype._setView_org = itemView.prototype._setView;
      itemView.prototype._setView = function($item) {
        this._setView_org($item);
        this._$createdTime     = $item.find('.column4 .createdTime span');
        this._$createdTimeFull = $item.find('.column1 .createdTime span');
      };
      itemView.prototype._setItem_org = itemView.prototype._setItem;
      itemView.prototype._setItem = function(item) {
        this._setItem_org(item);
      };
      itemView.prototype.update_org = itemView.prototype.update;
      itemView.prototype.update = function() {
        // 動画情報表示をゴリゴリいじる場所
        var item = this._item, $item = this._$item;
        this.update_org(item);

        this._$createdTimeFull.html(
          WatchApp.ns.util.DateFormat.strftime(
            "%Y年%m月%d日 %H:%M:%S",
            new Date(item.getFirstRetrieve().replace(/-/g, '/'))
          )
        );

        this._$item.find('.deleteFromMyMylist').data('watchId', this._item.getId());
        if (item._mylistComment) { // マイリストコメント
          $item.find('.itemMylistComment').css({display: 'block'});
        }

        if (item._seed && item._seed._info) {
          var info = item._seed._info;
          if (info.nicorepo_owner) { // ニコレポ
            $item.addClass(info.nicorepo_className).addClass('nicorepoResult');
            var owner = info.nicorepo_owner;
            var $iconContainer = $item.find('.nicorepoOwnerIconContainer'), $icon = $iconContainer.find('img'), $link = $iconContainer.find('a');
            $icon.attr('src', owner.icon);
            $link.attr({'href': owner.page, 'data-ownerid': owner.id, 'title': owner.name + ' さん'});
            if (info.nicorepo_className.indexOf('log-user-') >= 0) {
              $link.attr(
                'onclick',
                'if (arguments[0].button > 0) return; arguments[0].preventDefault();' +
                'WatchApp.ns.init.VideoExplorerInitializer.videoExplorerController.showOtherUserVideos(this.dataset.ownerid, this.title);'
              );
            }
            if (info.nicorepo_log.length > 1) {
              $item.find('.descriptionShort').html(info.nicorepo_log.join('<br>'));
            }
            // ニコレポは再生数が取れないので-で埋める
            this._$viewCount   .html('-');
            this._$commentCount.html('-');
            this._$mylistCount .html('-');
          }
        }
      };

    } // end initMylist

    function showLargeThumbnail(baseUrl) {
      var largeUrl = baseUrl, size;
      if (baseUrl.indexOf('smilevideo.jp') >= 0) {
        largeUrl = baseUrl + '.L';
        size = 'width: 360px; height: 270px;max-height: 500px;';
      } else {
        largeUrl = baseUrl.replace(/z$/, 'l');
        size = 'width: 360px; max-height: 500px;';
      }
      var
        html = [
          '<div onmousedown="if (event.button == 0) { $(\'#popupMarquee\').removeClass(\'show\'); event.preventDefault(); }" style="background:#000;">',
          '<img src="', largeUrl, '" style="', size, ' z-index: 3; position: absolute; display: none;" onload="this.style.display = \'\';">',
          '<img src="', baseUrl, '"  style="', size, ' z-index: 2;">',
          '</div>',
        ''].join('');
      Popup.show(html);
    } //


    function onVideoStopped() {
      EventDispatcher.dispatch('onVideoStopped');
    }

    function onVideoEnded() {
      EventDispatcher.dispatch('onVideoEnded');
    }

    var videoExplorerOpenCount = 0;
    function onVideoExplorerOpened(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      if (videoExplorerOpenCount++ === 0) {
        EventDispatcher.dispatch('onFirstVideoExplorerOpened', content);
      }
      $('#playerTabWrapper').after($leftPanel);
      EventDispatcher.dispatch('onVideoExplorerOpened', content);

      AnchorHoverPopup.hidePopup().updateNow();
    }

    function onVideoExplorerOpening(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      EventDispatcher.dispatch('onVideoExplorerOpening', content);
    }

    function onVideoExplorerClosing(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      EventDispatcher.dispatch('onVideoExplorerClosing', content);
    }
    function onVideoExplorerClosed(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      AnchorHoverPopup.hidePopup().updateNow();
      EventDispatcher.dispatch('onVideoExplorerClosed', content);
      setTimeout(function() {
        watch.PlaylistInitializer.playlistView.resetView();
      }, 1000);
    }

    function onVideoExplorerRefreshStart(params) {
     var target = params.target, contentList = params.contentList, content = params.content;
     var
        ContentType = WatchApp.ns.components.videoexplorer.model.ContentType,
        type = content.getType(),
        $ve = $('#videoExplorer')
          .removeClass('w_user').removeClass('w_upload').removeClass('w_mylist')
          .removeClass('w_deflist').removeClass('w_related').removeClass('w_search'),
        $body = $ve.find('.videoExplorerBody').removeClass('isMine');
        className = 'w_user';
      switch (type) {
        case ContentType.USER_VIDEO:
          className = 'w_user';
          break;
        case ContentType.UPLOADED_VIDEO:
          className = 'w_uploaded';
          break;
        case ContentType.MYLIST_VIDEO:
          className = 'w_mylist';
          break;
        case ContentType.DEFLIST_VIDEO:
          className = 'w_deflist';
          break;
        case ContentType.RELATED_VIDEO:
          className = 'w_related';
          break;
        case ContentType.SEARCH:
          className = 'w_search';
          break;
      }
      $ve.addClass(className);

      EventDispatcher.dispatch('onVideoExplorerRefreshStart', content);
    }
    function onVideoExplorerRefreshEnd(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      EventDispatcher.dispatch('onVideoExplorerRefreshEnd', content);
    }
    function onVideoExplorerChangePage(params) {
      var target = params.target, contentList = params.contentList, content = params.content;
      EventDispatcher.dispatch('onVideoExplorerChangePage', content);
    }

    /**
     *  検索中の動画サイズを無理矢理でっかくするよ。
     */
    var videoExplorerStyle = null, lastAvailableWidth = 0, lastBottomHeight = 0;
    function adjustSmallVideoSize() {
      if (!conf.videoExplorerHack || !WatchController.isSearchMode()) { return; }
      $('#leftVideoInfo').find('.videoDetails').attr('style', '');
      $('#videoExplorer, #content, #bottomContentTabContainer').addClass('w_adjusted');
      var
        rightAreaWidth = $('.videoExplorerBody').outerWidth(),
        availableWidth = $(window).innerWidth() - rightAreaWidth,
        commentInputHeight = $('#playerContainer').hasClass('oldTypeCommentInput') ? 36 : 0,
        controlPanelHeight = $('#playerContainer').hasClass('controll_panel') ? 46 : 0;

      if (availableWidth <= 0) { return; }

      var
        defPlayerWidth = 300, otherPluginsHeight = 0,
        defPlayerHeight = (defPlayerWidth - 32) * 9 / 16 + 10,
        ratio = availableWidth / defPlayerWidth , availableHeight = defPlayerHeight * ratio + commentInputHeight + controlPanelHeight,
        xdiff = (availableWidth - defPlayerWidth /*- 20 */), windowHeight = $(window).innerHeight(),
        bottomHeight = windowHeight - availableHeight - (WatchController.isFixedHeader() ? $('#siteHeader').outerHeight() : 0) - otherPluginsHeight;

      if (ratio < 1 || availableWidth <= 0 || bottomHeight <= 0 || (lastAvailableWidth === availableWidth && lastBottomHeight === bottomHeight)) { return; }

      var seekbarWidth = 675, scaleX = (availableWidth) / seekbarWidth;

      lastAvailableWidth = availableWidth;
      lastBottomHeight   = bottomHeight;

      // コメントパネル召喚
      var commentPanelWidth = 420;
      var dynamic_css = [//'<style type="text/css" id="explorerHack">',
        'body.videoExplorer #content.w_adjusted #playerContainerWrapper, \n',
        'body.videoExplorer #content.w_adjusted #playerAlignmentArea, \n',
        'body.videoExplorer #content.w_adjusted #playerContainer, \n',
        'body.videoExplorer #content.w_adjusted #nicoplayerContainer ,\n',
        'body.videoExplorer #content.w_adjusted #external_nicoplayer \n',
        '{',
          'width: ', availableWidth, 'px !important; height: ', availableHeight, 'px !important;padding: 0; margin: 0; ',
        '}\n',
       'body.videoExplorer #content.w_adjusted .videoExplorerMenu { ',
          'position: absolute; width: 300px;',
          'margin-top: ',  availableHeight, 'px !important; left: ', (xdiff - 2), 'px; ',
          'max-height: ', bottomHeight + 'px; overflow-y: auto; overflow-x: hidden; height: auto;',
        '}\n',
        'body.videoExplorer #videoExplorer.w_adjusted              { margin-left: ', availableWidth,  'px !important; background: #f4f4f4;}\n',
        'body.videoExplorer #content.w_adjusted #playlist { margin-left: ', xdiff, 'px; }\n',
        'body.videoExplorer #videoExplorer.w_adjusted { min-height: ', (windowHeight + 200) ,'px !important; }\n',

        'body.videoExplorer #content.w_adjusted #nicoHeatMap {',
          '-webkit-transform: scaleX(', availableWidth / 100, ');',
          'transform: scaleX(', availableWidth / 100, ');',
        '}\n',
        'body.videoExplorer #content.w_adjusted #nicoHeatMapContainer {',
          'width: ', availableWidth, 'px;',
        '}\n',
        'body.videoExplorer #content.w_adjusted #smart_music_kiosk {',
          '-webkit-transform: scaleX(', scaleX, ');',
          'left: ', ((availableWidth - seekbarWidth) / 2) ,'px !important;',
        '}\n',
        'body.videoExplorer #content.w_adjusted #songrium_logo_mini {',
          'left: ', (availableWidth + 5) ,'px !important;',
        '}\n',
        'body.videoExplorer #content.w_adjusted #inspire_category {',
          'left: ', (availableWidth + 32) ,'px !important;',
        '}\n',


        'body.videoExplorer #content.w_adjusted #leftPanel {',
          ' display: block; top: ', (availableHeight + otherPluginsHeight), 'px !important; max-height: ', bottomHeight, 'px !important; width: ', (xdiff - 4), 'px !important; left: 0;',
          ' height:', Math.min(bottomHeight, 600), 'px !important; display: block !important; border-radius: 0;',
        '}',
        'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo, body.size_small.no_setting_panel.videoExplorer #content.w_adjusted #leftPanel .sideIchibaPanel {',
          'width: ', Math.max((xdiff -  4), 130), 'px !important; border-radius: 0;',
        '}',
//        'body.videoExplorer #content.w_adjusted .nicommendContentsOuter {',
//          'width: ', Math.max((xdiff - 18), 130), 'px !important;',
//        '}',
        ((xdiff >= 400) ?
          [
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoTitleContainer{',
              'margin-left: 154px; border-radius: 0 0 ; background: #999;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoThumbnailContainer{',
              'position: absolute; max-width: 150px; top: 0; ',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoInfo{',
              'background: #999; margin-left: 154px; border-radius: 0 0;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoDetails{',
              'margin-left: 154px; height: 100%; ',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoOwnerInfoContainer{',
              'position: absolute; width: 150px; top: 0;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .userIconContainer, body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .ch_profile{',
              'background: #ccc; max-width: 150px; float: none; border-radius: 0;',
            '}',
            'body.videoExplorer:not(.content-fix) .w_adjusted .videoDetails, ',
            'body.videoExplorer:not(.content-fix) .w_adjusted #videoExplorerMenu {',
              // タグ領域三行分 bodyのスクロール位置をタグの場所にしてる時でもパネルは文章の末端までスクロールできるようにするための細工
              // (四行以上あるときは表示しきれないが)
              'padding-bottom: 72px; ',
            '}',
            ( bottomHeight >= 250 ?
              [
//                'body.videoExplorer.content-fix #content.w_adjusted #leftPanel .sideVideoInfo .videoOwnerInfoContainer {',
//                  'position: fixed; top: auto !important; bottom: 2px;',
//                '}',
//                'body.videoExplorer.content-fix #content.w_adjusted #leftPanel .sideVideoInfo .videoThumbnailContainer{',
//                  'position: fixed; top: auto; bottom: ', (bottomHeight - 106),'px',
//                '}'
              ].join('') :
              [
              ].join('')
            )
          ].join('') :
          (
            (xdiff >= 154) ?
            [
              'body.videoExplorer #content.w_adjusted #leftPanel #leftPanelTabContainer { padding: 4px 2px 3px 2px; }',
//              'body.videoExplorer:not(.content-fix) #content.w_adjusted .videoExplorerMenu, ',
//              'body.videoExplorer:not(.content-fix) #content.w_adjusted .videoOwnerInfoContainer {padding-bottom: 72px; }'
            ].join('') :
            ['body.videoExplorer #content.w_adjusted #leftPanel { display: none !important;}'
            /*
              'body.videoExplorer #content.w_adjusted #leftPanel { min-width: 130px; padding: 0; margin: 0; left: ', (xdiff - 154), 'px !important ;}',
              'body.videoExplorer #content.w_adjusted #leftPanel:hover { left: 0px !important ;}',
              'body.videoExplorer #content.w_adjusted #leftPanel img, body.videoExplorer #content.w_adjusted #leftPanel .descriptionThumbnail { display: none; }',
              'body.videoExplorer #content.w_adjusted #leftPanel #leftPanelTabContainer { display: none; }',
              'body.videoExplorer #content.w_adjusted #leftPanel *   { padding: 0; margin: 0; }',
              'body.videoExplorer:not(.content-fix) #content.w_adjusted .videoExplorerMenu, ',
              'body.videoExplorer:not(.content-fix) #content.w_adjusted .videoOwnerInfoContainer {padding-bottom: 72px; }'
            */].join('')
          )
        ),
          'body.videoExplorer #bottomContentTabContainer.w_adjusted .videoExplorerFooterAdsContainer { width: 520px; }\n',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper:not(:hover) .leftPanelAdCloseButton { display: none; opacity: 0; }\n',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper:not(:hover) .playerTabAds { display: none; opacity: 0; }\n',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper:hover:not(.w_active),',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper.w_active {',
            'right: -',(commentPanelWidth), 'px !important; top: 0 !important; height: ', availableHeight, 'px !important; background: transparent; border: 0;  margin-top: 0px;',
          '}',
         'body.videoExplorer #content.w_adjusted #playerTabWrapper:hover:not(.w_active) #playerCommentPanel,',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper.w_active             #playerCommentPanel {',
            'height: ', (availableHeight - 18 /* padding+borderの10x2pxを引く */), 'px !important; ',
            'display: block; background: #dfdfdf; border: 1px solid;',
          '}',
      ''].join('');

      if (videoExplorerStyle) {
        videoExplorerStyle.innerHTML = dynamic_css;
      } else {
        videoExplorerStyle = addStyle(dynamic_css, 'videoExplorerStyle');
      }

    } // end adjustSmallVideoSize

    function setupVideoExplorerStaticCss() {
      var __css__ = Util.here(function() {/*
        #videoExplorer {
        transition: margin-left 0.2s ease; overflow-x: hidden;
        }
        #videoExplorer.w_adjusted .videoExplorerBody, #videoExplorer.w_adjusted .videoExplorerContent .contentItemList {
          width: 592px; padding-left: 0; min-width: 592px; max-width: auto;
        }
        #videoExplorer.w_adjusted .searchBox {
          width: 574px;\
        }
        #videoExplorer.w_adjusted .videoExplorerContent {
          width: 592px;
        }
        #videoExplorer.w_adjusted .videoExplorerBody .resultContentsWrap {
          width: 592px; padding: 16px 0px;
        }
        #content .videoExplorerMenu:not(.initialized) { display: none; }
        .videoExplorerMenu {
          transition: margin-top 0.2s ease-in-out; {*, left 0.4s ease-in-out*};
        }
        #content.w_adjusted #playlist {
          min-width: 592px;
        }
        #content.w_adjusted .videoExplorerMenu:not(.w_touch) .itemList>li,  body.videoExplorer #content.w_adjusted #videoExplorerExpand {
          height: 26px;
        }
        #content.w_adjusted .videoExplorerMenu:not(.w_touch) .itemList>li>a,body.videoExplorer #content.w_adjusted #videoExplorerExpand a{
          line-height: 26px; font-size: 100%;
        }
        .errorMessage {
          max-height: 0; line-height: 30px; overflow: hidden; text-align: center; color: #f88; cursor: pointer;
          transition: max-height 0.8s ease;
        }
        .videoErrorOccurred .errorMessage {
          max-height: 100px;
        }

        .w_adjusted .videoExplorerMenu .itemList li .arrow {
          top: 8px;
        }


        .w_adjusted .videoExplorerMenu .closeVideoExplorer {
          width: 300px; position: relative; padding: 2px 10px; background: #f5f5f5;
        }
        .w_adjusted .videoExplorerMenu .closeVideoExplorer:hover {
          background: #dbdbdb;
        }
        .w_adjusted .videoExplorerMenu .closeVideoExplorer a{
          display: block;line-height: 26px; {*color: #CC0000;*}
        }

        #searchResultNavigation > ul > li a:after, #content.w_adjusted #videoExplorerExpand a#closeSearchResultExplorer:after {
          top: 8px;
        }




        #content.w_adjusted #playerContainerWrapper { box-shadow: none; }
        #content.w_adjusted #videoExplorerExpand .arrow { display: none; }
        #videoExplorer.w_adjusted {
          {*background: #333333;*}
        }
        body.videoExplorer #footer.w_adjusted {
          display: none;
        }
        #videoExplorer.w_adjusted .uadTagRelatedContainer .itemList>li {
          width: 124px;
        }
        #videoExplorer.w_adjusted .videoExplorerContent .itemList.column1 .videoInformationOuter .link{
          display: inline;
        }
        #videoExplorer.w_adjusted .videoExplorerContent .itemList.column1 .videoInformationOuter .link .title {
          display: inline;
        }

        #videoExplorer.w_adjusted .videoExplorerContent .itemList.column1 .commentBlank {
          width: 96%;
        }
        #videoExplorer.w_adjusted .videoExplorerContent .itemList.column4 .commentBlank {
          width: 24%;
        }
        #videoExplorer.w_adjusted .videoExplorerBody #searchResultContainer {
          background: #fff;
        }



        #videoExplorer .pager { margin-right: 20px; }
        #videoExplorer .contentItemList { clear: both; }

        body.videoExplorer #content.w_adjusted #playerContainerWrapper { overflow: visible; }
        body.videoExplorer #videoExplorer.w_adjusted .videoExplorerContent { padding: 20px 0px; }
        body.videoExplorer #videoExplorer.w_adjusted .videoExplorerContentWrapper
          { margin-left: 0; padding: 20px 340px 20px 0px; }
        body.videoExplorer.playlist #videoExplorer.w_adjusted .videoExplorerContentWrapper
          { margin-left: 0; padding: 164px 340px 20px 0px; }

        {* 謎のスペーサー *}
        {*body.videoExplorer #content.w_adjusted .videoExplorerMenu>div:first *}
        {* body.videoExplorer #content.w_adjusted .videoExplorerMenu>div:not(.videoExplorerMenuInner) { display: none; } *}
        body.videoExplorer #content.w_adjusted .videoExplorerMenu>div:nth-child(1) { display: none; }

        body.videoExplorer #content.w_adjusted .videoExplorerMenu
          { width: 300px; }

        body.videoExplorer #content.w_adjusted .videoExplorerMenuInner
          { position: static !important; top: 0 !important; left: 0 !important; }

        body.videoExplorer #bottomContentTabContainer.w_adjusted { background: #333; }
        body.videoExplorer #content.w_adjusted .sidePanel .panelClickHandler {
          display: none !important;
        }
        body:not(.videoExplorer)      .videoExplorerMenu { display: none; }

        body.videoExplorer #content.w_adjusted #nicoplayerContainer {
          z-index: 100;
        }
        body.videoExplorer #content.w_adjusted #playerTabWrapper {
          top: 0px !important; height: 50px !important; background: #dfdfdf; border-radius: 4px;
          z-index: 99;
          transition: right 0.3s ease-out 0.5s; margin-top: 114px;
        }
        body.videoExplorer #content.w_adjusted #playerTabWrapper.w_touch:not(.w_active) {
          right: -60px !important;
        }
        body.videoExplorer #content.w_adjusted #playerTabWrapper:not(.w_touch) {
          right: -16px !important;
        }

        body.size_small.no_setting_panel.videoExplorer #content #videoExplorerExpand { {*「閉じる」ボタン *}
          position: static; top: auto; left: auto; margin-top: 0;',
        }
        body.videoExplorer #content.w_adjusted #playerTabWrapper #playerCommentPanel {
          display: none;
        }

        .videoExplorerMenu .item:hover {
          background: #dbdbdb; text-decoration: underline;
        }
        .videoExplorerMenu .item {
          position: relative; border-bottom: 1px solid #CCCCCC; background: #f2f2f2;
          text-decoration: none; cursor: pointer;
        }
        .videoExplorerMenu .item .arrow {
          display: block; position: absolute; top: 14px; right: 12px; width: 9px; height: 12px;
          background: url("http://res.nimg.jp/img/watch_zero/video_explorer/icon_normal.png") no-repeat 0 0;
        }
        .videoExplorerMenu .item .text {
          position: relative; width: 100%; height: 100%; display: block; text-align: left;
          text-decoration: none; padding: 0 12px; color: #000; box-sizing: border-box;
          line-height: 26px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box;
        }

        #videoExplorer .videoExplorerBody .videoExplorerContent.column1 .contentItemList .video .column1 .videoInformationOuter .title
        {
          white-space: normal;
        }

     */});
      return addStyle(__css__, 'videoExplorerStyleStatic');
    } // end setupVideoExplorerStaticCss

    function initAutoComplete($searchInput) {
      var
        $suggestList = $('<datalist id="quickSearchSuggestList"></datalist>'),
        suggestUpdateTimer = null,
        loading = false,
        val = '',
        suggestLoader = new NicoSearchSuggest({});
        update = function() {
          if (suggestUpdateTimer) {
            clearTimeout(suggestUpdateTimer);
            suggestUpdateTimer = null;
          }
          suggestUpdateTimer = setTimeout(onSuggestUpdateTimerTick, 300);
        },
        onSuggestUpdateTimerTick = function() {
          //console.log('onSuggestUpdateTimerTick');
          if (loading) {
            return;
          }
          var value = $searchInput.val();
          //console.log('val"', val, '" ', val.length);
          if (value.length >= 2 && val !== value) {
            val = $searchInput.val();
            loading = true;
            //suggestLoader.load(val.slice(0, -1), onSuggestLoaded);
            suggestLoader.load(val, onSuggestLoaded);
          } else {
            loading = false;
          }
        },
        onSuggestLoaded = function(err, result) {
          if (err) {
            return;
          }
          //console.log('load suggest result', err, result);
          if (result.candidates) {
            if (conf.debugMode) console.log(result.candidates);
            var candidates = result.candidates, suggestList = $suggestList[0];
            $suggestList.empty();
            for (var i = candidates.length - 1; i >= 0; i--) {
              var opt = document.createElement('option');
              opt.setAttribute('value', candidates[i]);
              suggestList.appendChild(opt);
            }
          }
          loading = false;
        },
        bind = function($elm) {
          $elm
            .on('focus',   update)
            .on('keydown',   update)
            .on('keyup',     update)
            .on('keypress',  update)
            .on('click',     update)
            .on('mousedown', update)
            .on('mouseup',   update)
            .attr({'autocomplete': 'on', 'list': 'quickSearchSuggestList', 'placeholder': '検索ワードを入力'});
         // try {
         //   //$elm.attr('type', 'search');
         //   //$elm[0].setAttribute('type', 'search');//.attr('type', 'search');
         // } catch (e) {
         //   console.log(e);
         // }
        };

      $('body').append($suggestList);

      bind($searchInput);
      //bind($('.searchText input'));
    }

    function initVideoExplorer($, conf, w) {
      setupVideoExplorerStaticCss();

      var
        initializer     = watch.VideoExplorerInitializer,
        controller      = initializer.videoExplorerController,
        explorer        = controller.getVideoExplorer(),
        explorerConfig  = WatchApp.ns.components.videoexplorer.config.VideoExplorerConfig,
        menu            = explorer.getMenu(),
        ContentItemType = WatchApp.ns.components.videoexplorer.model.ContentItemType,
        ContentType     = WatchApp.ns.components.videoexplorer.model.ContentType,
        playerConnector = watch.PlayerInitializer.nicoPlayerConnector,
        searchType      = 'tag',
        $menu           = $('.videoExplorerMenu'),
        $searchInput    = $('<input class="quickSearchInput" type="search" name="q" accesskey="q" required="required" />')
          .attr({'title': '検索ワードを入力', 'placeholder': '検索ワードを入力'}),
        $closeExplorer  = $('<div class="closeVideoExplorer"><a href="javascript:;">▲ 画面を戻す</a></div>'),
        $inputForm      = $('<form />').append($searchInput);

      // init search menu
      $searchInput.on('keyup', function(e) {
        $('.searchText input').val(this.value);
      }).on('click', function(e) {
        e.stopPropagation();
      });
      $inputForm.on('submit', function(e) {
        e.preventDefault();
        var val = $.trim($searchInput.val());
        if (val.length > 0) {
          if (val.match(/(sm|nm|so)\d+/)) {
            WatchController.nicoSearch(val, 'tag');
          } else {
            WatchController.nicoSearch(val, 'keyword');
          }
        }
      });
      EventDispatcher.addEventListener('onSearchStart', function(word, type) {
        searchType = type.replace(/^.*\./, '');
        $searchInput.val(word);
      });
      initAutoComplete($searchInput);

      $closeExplorer.find('a').on('click', function() {
        WatchController.closeSearch();
      });

      // メニュー拡張
      var
        detachMenuItems = function() {
          $('.watchItLaterMenu, .slideMenu').detach();
          $inputForm.detach();
          $closeExplorer.detach();
        },
        attachMenuItems = function() {
          if (conf.enableFavTags   ) { loadFavTags();    }
          if (conf.enableFavMylists) { loadFavMylists(); }
          loadVideoRanking();
          loadMylistList();


          if (conf.videoExplorerHack) {
            $('.videoExplorerMenu')
              .find('.itemList>li:first').css('position', 'relative').append($inputForm)
              .end().find('.errorMessage').after($closeExplorer);
          }
        };
      controller._refreshMenu_org = controller._refreshMenu;
      controller._refreshMenu = $.proxy(function() {
        detachMenuItems();
        this._refreshMenu_org();
        attachMenuItems();
      }, controller);

      EventDispatcher.addEventListener('onVideoExplorerOpened', function(content) {
        if (conf.videoExplorerHack) {
          $('#content').append($('.videoExplorerMenu'));
          setTimeout(function() {
            playerConnector.updatePlayerConfig({playerViewSize: ''}); // ノーマル画面モード
            $('.videoExplorerMenu').addClass('initialized');
          }, 500);
        }
        attachMenuItems();

      });
      EventDispatcher.addEventListener('onVideoExplorerRefreshEnd', function(content) {
        if (content.getType() === ContentType.USER_VIDEO) {
          var items = content.getItems();
          if (items.length === 1 && items[0].getContentItemType() !== ContentItemType.VIDEO) {
            // ユーザーの投稿動画一覧が公開マイリスト一つだけだったら自動でそれを開く
            items[0].stepIn();
          }
        }
      });
      EventDispatcher.addEventListener('onVideoExplorerOpening', function(content) {
      });
      EventDispatcher.addEventListener('onVideoExplorerClosing', function(content) {
        detachMenuItems();
        if (conf.videoExplorerHack) {
          //adjustSmallVideoSize();
          //$('#videoExplorerContentWrapper').before($('.videoExplorerMenu'));
        }
      });

      EventDispatcher.addEventListener('onBeforeVideoExplorerMenuClear', function() {
        detachMenuItems();
      });

      EventDispatcher.addEventListener('onUpdateSettingPanelVisible', function(isVisible, panel) {
        if (isVisible && WatchController.isSearchMode()) {
          setTimeout(function() {
            WatchController.closeSearch();
            setTimeout(function() {
              playerConnector.updateSettingsPanelVisible(true, panel);
            }, 800);
          }, 100);
        }
      });


      EventDispatcher.addEventListener('onWindowResize',     adjustSmallVideoSize);
      EventDispatcher.addEventListener('onVideoInitialized', adjustSmallVideoSize);


      var duration_match = /^([0-9]+):([0-9]+)/;
      controller._item2playlistItem = function (item) {
        // 動画長が入るようにする
        var length_seconds = 0, len = item.getLength ? item.getLength() : '', m;
        if (typeof len === 'string' && (m = duration_match.exec(len)) !== null) {
          length_seconds = m[1] * 60 + m[2] * 1;
        }
        return new WatchApp.ns.model.playlist.PlaylistItem({
          id            : item.getId(),
          title         : item.getTitle(),
          thumbnail_url : item.getThumbnailUrl(),
          view_counter  : item.getViewCounter(),
          num_res       : item.getNumRes(),
          mylist_counter: item.getMylistCounter(),
          mylist_comment: item.getMylistComment(),
          first_retrieve: item.getFirstRetrieve(),
          ads_counter   : item.getUadCounter(),
          length_seconds: length_seconds
        });
      };


      if (!conf.videoExplorerHack) { return; }

      $('#videoExplorer, #content, #footer').addClass('w_adjusted');
      // コメントパネルが白いままになるバグを対策 (TODO:もういらなくなった事が確認できたら消す)
//      var refreshCommentPanelTimer = null;
//      var refreshCommentPanelHeight = function() { return;// もうやらなくても大丈夫になったかも？
//        if (!WatchController.isSearchMode()) {
//          return;
//        }
//        if (refreshCommentPanelTimer !== null) {
//          clearTimeout(refreshCommentPanelTimer);
//          refreshCommentPanelTimer = null;
//        }
//        refreshCommentPanelTimer =
//          setTimeout(function() {
//            watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
//          }, 1000);
//      }
//     $('#playerTabWrapper').on('mouseenter.watchItLater', refreshCommentPanelHeight);

      // TODO: ニコメンド編集ボタンが押されたら検索画面解除
      // TODO:ユーザーの動画一覧を開いた時、マイリスト一つだけだった場合はそれを開く処理の復活
      EventDispatcher.addEventListener('onVideoExplorerUpdated', function(req) { });
    } // end initVideoExplorer


    var lastVideoOwnerJson = '';
    function onWatchInfoReset(watchInfoModel) {
      $('body').toggleClass('w_channel', watchInfoModel.isChannelVideo());
      EventDispatcher.dispatch('onWatchInfoReset', watchInfoModel);
      var owner = WatchController.getOwnerInfo(), owner_json = JSON.stringify(owner);
      if (lastVideoOwnerJson !== owner_json) {
        lastVideoOwnerJson = owner_json
        EventDispatcher.dispatch('onVideoOwnerChanged', owner);
      }
    }

    function onScreenModeChange(sc) {
      if (conf.hideNewsInFull) { $('body').addClass('hideNewsInFull'); }
      setTimeout(function() {
        EventDispatcher.dispatch('onScreenModeChange', sc);
      }, 500);
    }

    function initIframe($, conf, w) {
      iframe.id = "mylist_add_frame";
      iframe.className += " fixed";
      w.document.body.appendChild(iframe);
      iframe.hide(); // ページの初期化が終わるまでは表示しない

      $(iframe).find('.mylistSelect').attr('accesskey', ':');

      var toggleMylistMenuInFull = function(v) {
        $('.mylistPopupPanel')
          .toggleClass('hideInFull',    v === 'hide')
          .toggleClass('hideAllInFull', v === 'hideAll');
      };
      EventDispatcher.addEventListener('on.config.hideMenuInFull', toggleMylistMenuInFull);
      toggleMylistMenuInFull(conf.hideMenuInFull);
    }

    function initScreenMode() {
      EventDispatcher.addEventListener('onVideoInitialized', function(isFirst) {
        if (conf.autoBrowserFull) {
          setTimeout(function() {
            if ($('body').hasClass('up_marquee') && conf.disableAutoBrowserFullIfNicowari) {
              // ユーザーニコ割があるときは自動全画面にしない
              return;
            }
            if (WatchController.isSearchMode()) { // TODO: localStorageに直接アクセスすんな
              var settingSize = (localStorage["PLAYER_SETTINGS.LAST_PLAYER_SIZE"] === '"normal"') ? 'normal' : 'medium';
              WatchController.changeScreenMode(settingSize);
            }
            WatchController.changeScreenMode('browserFull');
            onWindowResize();
          }, 100);
        } else {
          if (conf.autoOpenSearch && !WatchController.isSearchMode() && !$('body').hasClass('full_with_browser')) {
            WatchController.openSearch();
          }
          if (conf.autoScrollToPlayer) {
            // 初回のみ、プレイヤーが画面内に納まっていてもタグの位置まで自動スクロールさせる。(ファーストビューを固定するため)
            // 二回目以降は説明文や検索結果からの遷移なので、必要最小限の動きにとどめる
            if (!WatchController.isSearchMode() || isFirst) {
              WatchController.scrollToVideoPlayer(isFirst);
            }
          }
        }
      });

      EventDispatcher.addEventListener('onVideoEnded', function() {
        // 原宿までと同じように、動画終了時にフルスクリーンを解除したい (ただし、連続再生中はやらない)
        if (conf.autoNotFull && $('body').hasClass('full_with_browser') && !WatchController.isPlaylistActive()) {
          WatchController.changeScreenMode('notFull');
        }
      });

      var lastPlayerConfig = null, lastScreenMode = '';

      function hideIfNeed() {
        if (conf.controllerVisibilityInFull === 'hidden') {
          watch.PlayerInitializer.nicoPlayerConnector.playerConfig.set({oldTypeCommentInput: true, oldTypeControlPanel: false});
          $('body').addClass('hideCommentInput');
        } else {
          var $w = $(window), iw = $w.innerWidth(), ih = $w.innerHeight();
          var controllerH = 46, inputH = 36;
        }
      }

      function restoreVisibility() {
        if (lastPlayerConfig !== null) {
          watch.PlayerInitializer.nicoPlayerConnector.playerConfig.set(
            {oldTypeCommentInput: !!lastPlayerConfig.oldTypeCommentInput, oldTypeControlPanel: !!lastPlayerConfig.oldTypeControlPanel}
          );
          $(window).resize();
        }
        $('body').removeClass('hideCommentInput');
      }

      function toggleTrueBrowserFull(v) {
        v = (typeof v === 'boolean') ? v : !$('body').hasClass('trueBrowserFull');
        $('body').toggleClass('trueBrowserFull', v);
        conf.setValue('enableTrueBrowserFull', v);
        try { $('#external_nicoplayer')[0].setIsForceExpandStageVideo(v || conf.forceExpandStageVideo);} catch(e) {console.log(e);}
        if (!v) {
          watch.PlaylistInitializer.playlistView.resetView();
        }
        return v;
      }

      function initShield() {
        var shield = $('<div id="trueBrowserFullShield" />');
        shield.click(function(e) {
          e.stopPropagation();
          toggleTrueBrowserFull();
        });
        $('#external_nicoplayer').after(shield);
        shield = null;
      }
      initShield();

      EventDispatcher.addEventListener('onScreenModeChange', function(sc) {
        var mode = sc.mode;
        $('body').removeClass('w_fullScreenMenu');
        if (mode === 'browserFull' && lastScreenMode !== mode) {
          lastPlayerConfig = watch.PlayerInitializer.nicoPlayerConnector.playerConfig.get();
          conf.setValue('lastControlPanelPosition', lastPlayerConfig.oldTypeControlPanel ? 'bottom' : 'over');
          //$('body').toggleClass('w_fullWithPlaylist', WatchController.isFullScreenContentAll());
          hideIfNeed();
          toggleTrueBrowserFull(conf.enableTrueBrowserFull);
        } else
        if (lastScreenMode === 'browserFull' && mode !== 'browserFull') {
          conf.setValue('lastControlPanelPosition', '');
          restoreVisibility();
        }
        lastScreenMode = mode;
      });

      $(window).on('beforeunload.watchItLater', function(e) {
        conf.setValue('lastControlPanelPosition', '');
        restoreVisibility();
      });

      var wheelCounter = 0, wheelTimer = null;
      EventDispatcher.addEventListener('onWheelNoButton', function(e, delta) {
        if (!conf.enableFullScreenMenu) return;
        if (e.target.tagName !== 'OBJECT' || !WatchController.isFullScreen()) return;
        if (wheelTimer) {
          wheelCounter += delta;
       } else {
          wheelCounter = 0;
          wheelTimer = setTimeout(function() {//
            wheelTimer = null;
            if (Math.abs(wheelCounter) > 3) {
              EventDispatcher
                .dispatch('onToggleFullScreenMenu',
                  $('body').toggleClass('w_fullScreenMenu', wheelCounter < 0).hasClass('w_fullScreenMenu')
              );
              AnchorHoverPopup.hidePopup();
            }
          }, 500);
        }
      });

      TouchEventDispatcher.onflick(function(e) {
        if (!conf.enableFullScreenMenu) return;
        if ((e.direction !=='up' && e.direction !=='down') || e.startEvent.target.tagName !== 'OBJECT' || !WatchController.isFullScreen()) return;
        if (wheelTimer) {
          clearTimeout(wheelTimer);
          wheelTimer = null;
        }
        EventDispatcher
          .dispatch('onToggleFullScreenMenu',
            $('body').toggleClass('w_fullScreenMenu', e.direction === 'down').hasClass('w_fullScreenMenu')
        );
        AnchorHoverPopup.hidePopup();
      });

      var $fullScreenMenuContainer = $('<div id="fullScreenMenuContainer"/>');
      var $fullScreenModeSwitch = $([
          '<button class="fullScreenModeSwitch button">',
            '画面モード: ',
            '<span class="modeStatus mode_normal">標準</span>',
            '<span class="modeStatus mode_noborder">最大化 </span>',
          '</button>'
      ].join('')).attr('title', '全画面時の表示切り替え').click(toggleTrueBrowserFull);
       var $toggleStageVideo = $([
          '<button class="stageVideoSwitch button">',
            'アクセラレーション: ',
            '<span class="modeStatus mode_off">OFF</span>',
            '<span class="modeStatus mode_on">ON</span>',
          '</button>'
      ].join('')).attr('title', 'ハードウェアアクセラレーションのON/OFF').click(function() { WatchController.toggleStageVideo(); });
      var $toggleSetting = $([
          '<button class="toggleSetting button">',
          '</button>'
      ].join('')).text('⛭設定').attr('title', '設定パネルを開閉します').click(function() { ConfigPanel.toggle();});
      $fullScreenMenuContainer.append($fullScreenModeSwitch).append($toggleStageVideo).append($toggleSetting);
      $('#nicoplayerContainerInner').append($fullScreenMenuContainer);


      if (conf.lastControlPanelPosition === 'bottom' || conf.lastControlPanelPosition === 'over') {
        EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
          if (conf.debugMode) console.log('restore oldTypeControlPanel ? ', conf.lastControlPanelPosition === 'bottom');
          watch.PlayerInitializer.nicoPlayerConnector.playerConfig.set(
            {oldTypeControlPanel: conf.lastControlPanelPosition === 'bottom'}
          );
        });
      }

    } // end initScreenMode()




    function initPlaylist($, conf, w) {
      var
        playlist = watch.PlaylistInitializer.playlist,
        blankVideoId = 'sm20353707', blankVideoUrl = 'http://www.nicovideo.jp/watch/' + blankVideoId + '?',
        items = {},
        toCenter = function() { // 表示位置調整
          var
            pm = WatchApp.ns.view.playlist.PlaylistManager,
            pv = watch.PlaylistInitializer.playlistView,
            pl = playlist,
            current = pl.getPlayingIndex(),
            cols = Math.floor($('#playlistContainerInner').innerWidth() / pm.getItemWidth()),
            center = Math.round(cols / 2);

          if (cols < 1) { return; }
          var currentLeft = pm.getLeftSideIndex();
          pv.scroll(Math.max(0, current - center + 1));
        },
        scroll = function(d) {
          var isEffectEnabled = watch.PlaylistInitializer.playlistView.isEffectEnabled;
          var left = WatchApp.ns.view.playlist.PlaylistManager.getLeftSideIndex();
          watch.PlaylistInitializer.playlistView.isEffectEnabled = false;
          watch.PlaylistInitializer.playlistView.scroll(Math.max(0, left + d));
          watch.PlaylistInitializer.playlistView.isEffectEnabled = isEffectEnabled;
        };

      $('#playlist').find('.playlistInformation').on('dblclick.watchItLater', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toCenter();
      });

      EventDispatcher.addEventListener('onVideoInitialized', function() {
        var pm = WatchApp.ns.view.playlist.PlaylistManager, pv = watch.PlaylistInitializer.playlistView, pl = watch.PlaylistInitializer.playlist;
        var current = pl.getPlayingIndex(), cols = Math.floor($('#playlistContainerInner').innerWidth() / pm.getItemWidth()), center = Math.floor(cols / 2);
        if (pm.getLeftSideIndex() + cols <= pl.getNextPlayingIndex()) { toCenter(); }
      });

      $('#playlistContainer .prevArrow, #playlistContainer .nextArrow').on('mousewheel.watchItLater', function(e, delta) {
        if (WatchController.isFullScreen()) { return; }
        e.preventDefault();
        e.stopPropagation();
        scroll(delta *-1);
      }).attr('title', 'ホイールで左右にスクロール');

      // フルスクリーン中はプレイリストのどこでもスクロールできたほうがいいね
      $('#playlist').on('mousewheel.watchItLater', function(e, delta) {
        if (WatchController.isFullScreen() || WatchController.isSearchMode() || $('#footer').hasClass('noBottom')) {
          e.preventDefault();
          e.stopPropagation();
          scroll(delta *-1);
        }
      });

      EventDispatcher.addEventListener('onWheelAndButton', function(e, delta, button) {
        if (WatchController.isFullScreen()) { return; }
        if ($('#playlist').hasClass('dragging')) {
          e.preventDefault();
          scroll(delta *-1);
        }
      });

      var
        updatePos = function() {
          if (
            conf.hashPlaylistMode === 2 || (conf.hashPlaylistMode === 1 && WatchController.isPlaylistActive())) {
            LocationHashParser.setValue('playlist', exportPlaylist());
            LocationHashParser.updateHash();
          }
          if (conf.storagePlaylistMode === 'sessionStorage' || conf.storagePlaylistMode === 'localStorage') {
            setTimeout(function() {
              w[conf.storagePlaylistMode].setItem('watchItLater_playlist', JSON.stringify(exportPlaylist()));
            }, 0);
          }

          var pos = Math.max((playlist.getPlayingIndex() + 1), 1) + '/' + Math.max(playlist.getItems().length, 1);
          $('.generationMessage').text(pos + " - \n" + $('.generationMessage').text().replace(/^.*\n/, ''));
        },
        resetView = function() {
          watch.PlaylistInitializer.playlistView.resetView();
        },
        exportPlaylist = function(option, type, continuous, shuffle) {
          var
            items = playlist.currentItems,
            list = [],
            current = 0,
            len = conf.debugMode ? Math.min(600, items.length) : Math.min(300, items.length);

          for (var i = 0; i < len; i++) {
            var item = items[i];
            if (item._isPlaying) current = i;
            list.push([
                item.id,
                parseInt(item.mylistCounter, 10).toString(36),
                parseInt(item.viewCounter,   10).toString(36),
                parseInt(item.numRes,        10).toString(36),
                (item.thumbnailUrl ? parseInt(item.thumbnailUrl.split('?i=')[1], 10).toString(36) : 'c490r'),
              ].join(',') + ':' + item.title
            );
          }
          return {
            a: (typeof continuous === 'boolean') ? continuous : WatchController.isPlaylistContinuous(),
            r: (typeof shuffle    === 'boolean') ? shuffle    : WatchController.isPlaylistRandom(),
            o: option    || playlist.option,
            t: type      || playlist.type,
            i: list,
            c: current
          };
        },
        importPlaylist = function(list) {
          var PlaylistItem = WatchApp.ns.model.playlist.PlaylistItem, newItems = [], uniq = {}, currentIndex = -1;

          WatchController.clearPlaylist();
          var currentItem = playlist.currentItems[0];
          if (!currentItem) {
            var wm = watchInfoModel;
            currentItem = new PlaylistItem({
              id:             wm.v,
              title:          wm.title,
              mylist_counter: wm.mylistCount,
              view_counter:   wm.viewCount,
              num_res:        wm.commentCount,
              thumbnail_url:  wm.thumbnail,
              first_retriee:  wm.postedAt
            });
          }

          for (var i = 0, len = list.i.length; i < len; i++) {
            var
              dat = list.i[i],
              c = dat.split(':')[0].split(','),
              title = dat.replace(/^.*:/, ''),
              id = c[0],
              thumbnailId = parseInt(c[4], 36);

            if (uniq[id] || typeof id !== 'string') { continue; }
            uniq[id] = true;
            if (id == watchInfoModel.v) {
              currentIndex = i;
              newItems.push(currentItem);
            } else {
              var item = new PlaylistItem({
                id:             id,
                title:          title.replace('<', '&lt;').replace('>', '&gt;'), // ないはずだけど一応
                mylist_counter: parseInt(c[1], 36),
                view_counter:   parseInt(c[2], 36),
                num_res:        parseInt(c[3], 36),
                thumbnail_url:  'http://tn-skr' + ((thumbnailId % 4) + 1) + '.smilevideo.jp/smile?i=' + thumbnailId,
                first_retrieve: null
              });
              newItems.push(item);
            }
          }
          // 復元するリストの中に現在の動画がなかった
          if (currentIndex === -1) {
            //console.log(list.c, list.i.length, newItems.length);
            if (typeof list.c === 'number') {
              if (list.c < newItems.length) {
                currentIndex = list.c + 1;
                newItems.splice(currentIndex, 0, currentItem);
              } else {
                currentIndex = list.length;
                newItems.push(currentItem);
              }
            } else {
              newItems.unshift(currentItem);
              currentIndex = 0;
            }
          }

          var isAutoPlay = playlist.isAutoPlay();
          playlist.reset(newItems, list.t, list.o);
          if (!isAutoPlay) { // 本家側の更新でリセット時に勝手に自動再生がONになるようになったので、リセット前の状態を復元する
            playlist.disableAutoPlay();
          }
          if (currentIndex >= 0) { playlist.playingItem = newItems[currentIndex]; }
          if (list.a) { playlist.enableAutoPlay(); }
          if (list.r) {
            if (newItems[0].id === blankVideoId) {
              setTimeout(function() {WatchController.shufflePlaylist();}, 3000);
            } else {
              playlist.enableAutoPlay();
            }
          }
        },
        $dialog = null, $savelink = null, $continuous, $shuffle,
        openSaveDialog = function() {
          function resetLink() {
            var playlist = exportPlaylist(null, null, $continuous.is(':checked'), $shuffle.is(':checked'));
            playlist.o = playlist.o || [];
            playlist.o.name = $savelink.text();
            playlist.t = 'mylist';
            LocationHashParser.setValue('playlist', playlist);
            $savelink
              .attr('href', blankVideoUrl + LocationHashParser.getHash())
              .unbind();
          }
          function closeDialog() {
            $dialog.removeClass('show');
          }

          if (!$dialog) {
            $dialog = $('<div id="playlistSaveDialog" />');
            $dialog.append($([
              '<div class="shadow"></div>',
              '<div class="formWindow"><div  class="formWindowInner">',
                '<h3>プレイリスト保存用リンク(実験中)</h3>',
                '<p class="link"><a target="_blank" class="playlistSaveLink">保存用リンク</a><button class="editButton">編集</button></p>',
                '<label><input type="checkbox" class="continuous">開始時に連続再生をONにする</label><br>',
                '<label><input type="checkbox" class="shuffle">開始時にリストをシャッフルする</label>',
                '<p class="desc">リンクを右クリックしてコピーやブックマークする事で、現在のプレイリストを保存する事ができます。</p>',
                '<button class="closeButton">閉じる</button>',
              '</div></div>',
            ''].join('')));
            $savelink   = $dialog.find('a').attr('added', 1);
            $continuous = $dialog.find('.continuous');
            $shuffle    = $dialog.find('.shuffle');
            $dialog.find('.shadow').on('click', closeDialog);
            $dialog.find('.editButton').on('click', function() {
              var newTitle = prompt('タイトルを編集', $savelink.text());
              if (newTitle) {
                $savelink.text(newTitle);
                resetLink();
              }
            });
            $continuous.on('click', resetLink);
            $shuffle   .on('click', resetLink);
            $dialog.find('.closeButton').on('click', closeDialog);

            $('body').append($dialog);
          }
          $savelink.text(
            $('#playlist .generationMessage')
              .text()
              .replace(/^.*?\n/, '')
              .replace(/^.*「/, '')
              .replace(/」.*?$/, '')
              .replace(/ *- \d{4}-\d\d-\d\d \d\d:\d\d$/, '') +
            ' - ' + WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M', new Date())
          );
          $continuous.attr('checked', WatchController.isPlaylistActive());
          $shuffle   .attr('checked', WatchController.isPlaylistRandom());
          resetLink();
          $dialog.addClass('show');
        },
        PlaylistMenu = (function($, conf, w, playlist) {
          var $popup = null, $generationMessage = $('#playlist').find('.generationMessage'), self;

          var
            enableContinuous = function() {
              if (playlist.getPlaybackMode() === 'normal') {
                playlist.setPlaybackMode('continuous');
              }
            },
            createDom = function() {
              $popup = $('<div/>').addClass('playlistMenuPopup').toggleClass('w_touch', isTouchActive);
              var $ul = $('<ul/>');
              $popup.click(function() {
                self.hide();
              });
              var $shuffle = $('<li >シャッフル: 全体</li>').click(function(e) {
                WatchController.shufflePlaylist();
                enableContinuous();
              });
              $ul.append($shuffle);
              var $shuffleR = $('<li >シャッフル: 右</li>').click(function(e) {
                WatchController.shufflePlaylist('right');
                enableContinuous();
              });
              $ul.append($shuffleR);

              var $next = $('<li>検索結果を追加： 次に再生</li>').click(function() {
                WatchController.appendSearchResultToPlaylist('next');
                enableContinuous();
              });
              $ul.append($next);

              var $insert = $('<li>検索結果を追加： 末尾</li>').click(function() {
                WatchController.appendSearchResultToPlaylist();
                enableContinuous();
              });
              $ul.append($insert);

              var $clear = $('<li>リストを消去： 全体</li>').click(function() {
                WatchController.clearPlaylist();
                watch.PlaylistInitializer.playlist.setPlaybackMode('normal');
              });
              $ul.append($clear);

              var $clearLeft = $('<li>リストを消去： 左</li>').click(function() {
                WatchController.clearPlaylist('left');
              });
              $ul.append($clearLeft);
              var $clearRight = $('<li>リストを消去： 右</li>').click(function() {
                WatchController.clearPlaylist('right');
              });
              $ul.append($clearRight);

              var $saver = $('<li>リストを保存(実験中)</li>').click(function() {
                openSaveDialog();
              });

              $ul.append($saver);
              $popup.append($ul);
              $('body').append($popup);
            },
            show = function() {
              if ($popup === null) { createDom(); }
              var offset = $generationMessage.offset(), $window = $(window) , pageBottom = $window.scrollTop() + $window.innerHeight();
              $popup.css({
                left: offset.left,
                top: Math.min(offset.top + 24, pageBottom - $popup.outerHeight())
              }).show();
            },
            hide = function() {
              if ($popup) { $popup.hide(); }
            },
            toggle = function() {
              if ($popup === null || !$popup.is(':visible')) {
                show();
              } else {
                hide();
              }
            };

          $generationMessage.click(function(e) {
            e.preventDefault();
            self.toggle();
          });

          $('body').on('click.watchItLater', function(e) {
            var tagName = e.target.tagName, className = e.target.className;
            if (className !== 'generationMessage') {
              self.hide();
            }
          });
          self = {
            show: show,
            hide: hide,
            toggle: toggle
          };
          return self;
        })($, conf, w, playlist);


      // location.hashまでサーバーに送信してしまうので除去する
//      watch.PlayerInitializer.watchPageController.getURLParams_org = watch.PlayerInitializer.watchPageController.getURLParams;
//      watch.PlayerInitializer.watchPageController.getURLParams = $.proxy(function(url) {
//        return this.getURLParams_org(url.replace(/#.*$/, ''));
//      }, watch.PlayerInitializer.watchPageController);

      var hashlist = LocationHashParser.getValue('playlist');
      if (hashlist && hashlist.i && hashlist.i.length > 0) {
        try {
          if (conf.debugMode) console.log('restore playlist!!');
          importPlaylist(hashlist);
          if (conf.hashPlaylistMode < 1) {
            LocationHashParser.removeHash();
          }
          setTimeout(function() { resetView(); } , 3000);
        } catch (e) {
          console.log(e);
          console.trace();
        }
      } else
      if ((conf.storagePlaylistMode === 'sessionStorage' || conf.storagePlaylistMode === 'localStorage') && w[conf.storagePlaylistMode]) {
        try {
          if (conf.debugMode) console.log('restore playlist:' + conf.storagePlaylistMode);
          var list = JSON.parse(w[conf.storagePlaylistMode].getItem('watchItLater_playlist'));
          if (list !== null) { importPlaylist(list); }
          setTimeout(function() { resetView(); } , 3000);
        } catch (e) {
          console.log('プレイリストの復元に失敗！', e);
        }
      } else {
        updatePos();
      }


      EventDispatcher.addEventListener('onScreenModeChange', function(sc) {
        if ($('body').hasClass('full_with_browser')) {
          // フル画面時プレイリストを閉じる
          if (conf.autoClosePlaylistInFull) { $('#content').find('.browserFullPlaylistClose:visible').click(); }
        }
      });

      EventDispatcher.addEventListener('onVideoExplorerOpened', function() {
        // 通常画面でプレイリストを表示にしてるなら、開いた状態をデフォルトにする
        if ($('#playlist').hasClass('w_show') === $('#playlist').find('.browserFullOption .browserFullPlaylistOpen').is(':visible')) {
          $('#playlist').find('.browserFullOption a:visible').click();
        }
      });

      EventDispatcher.addEventListener('on.config.hashPlaylistMode', function(v) {
        if (v === 0) {
          LocationHashParser.deleteValue('playlist');
          LocationHashParser.removeHash();
        } else
        if (v === 1 || v === 2) {
          var msg = [
            '【警告】「プレイリストが消えないモード」は実験中の機能です。',
            '',
            'この機能を使うと、ページをリロードしたりブックマークしてもプレイリストが消えなくなりますが、',
            'データを力技で保持するため、ページのURLがものすごく長く(※)なります。',
            '',
            'そのため、ブラウザのパフォーマンスが低下したり、未知の不具合が発生する可能性があります。',
            'それでもこの機能を使ってみたい！という方だけ「OK」を押してください。',
            '',
            '※ 数千～数万文字くらい！',
          ''].join('\n');
          if (confirm(msg)) {
            LocationHashParser.setValue('playlist', exportPlaylist());
            LocationHashParser.updateHash();
          } else {
            conf.setValue('hashPlaylistMode', 0);
            ConfigPanel.refresh();
          }
        }
      });

      $('#playlist .browserFullOption').on('click.bugfix', resetView);

      playlist.addEventListener('changePlaybackMode', function(mode) {
        if (conf.debugMode) console.log('changePlaybackMode', mode, conf.hashPlaylistMode);
        if (mode === 'normal' && conf.hashPlaylistMode < 2) {
          LocationHashParser.removeHash();
        } else {
          updatePos();
        }
      });

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        updatePos();
        EventDispatcher.addEventListener('onScreenModeChange', function(sc) {
          resetView();
        });
        EventDispatcher.addEventListener('onWatchInfoReset', function() {
          updatePos();
        });
        playlist.addEventListener('reset', function() {
          EventDispatcher.dispatch('onPlaylistReset');
          updatePos();
        });
        playlist.addEventListener('update', function() {
          EventDispatcher.dispatch('onPlaylistUpdate');
          updatePos();
        });
      });

    } // end initPlaylist


    function initPageHeader($, conf, w) {
      $('.videoDetailExpand h2').addClass('videoDetailToggleButton');
    } // end initPageHeader


    function initVideoTagContainer() {
      var $videoHeaderTagEditLinkArea = null, $toggleTagEditText = null, baseTagHeight = 72, currentHeight = 72;
      var tagListView = watch.TagInitializer.tagViewController.tagListView, $videoHeader = $('.videoHeaderOuter');

      tagListView.getCurrentDefaultHeight_org = tagListView.getCurrentDefaultHeight;
      tagListView.getCurrentDefaultHeight = function() {
        if ($('body').hasClass('full_with_browser')) {
          return tagListView.getCurrentDefaultHeight_org();
        }
        return currentHeight;
      };

      $videoHeaderTagEditLinkArea = $('.toggleTagEditInner .videoHeaderTagEditLinkArea');
      $('.toggleTagEdit').append($videoHeaderTagEditLinkArea);
      $toggleTagEditText = $('<span class="toggleText">' + $('.toggleTagEditInner').text() + '</span>');
      $('.toggleTagEditInner').empty().append($toggleTagEditText).append($videoHeaderTagEditLinkArea);

      function onTagReset() {
        try {
          // タグが2行以下だったら自動的に狭くする処理
          if (!conf.enableAutoTagContainerHeight) { return; }
          currentHeight = Math.min(baseTagHeight, $('#videoTagContainer').find('.tagInner').innerHeight());

          if (baseTagHeight !== currentHeight) {
            var $toggle = $('#videoTagContainer').find('.toggleTagEdit');
            $videoHeader.removeClass('tag1Line').removeClass('tag2Lines');

            if (currentHeight < 36) { // 1行以下の時
              $videoHeader.addClass('tag1Line');
            } else {
              if (currentHeight <= 60) { // 2行以下の時
                $videoHeader.addClass('tag2Lines');
              }
            }
            watch.TagInitializer.tagViewController.tagListView.fit();
          } else {
            $videoHeader.removeClass('tag1Line').removeClass('tag2Lines');
            watch.TagInitializer.tagViewController.tagListView.fit();
          }
        } catch (e) {
          console.log(e);
        }
      }
      EventDispatcher.addEventListener('onVideoInitialized', onTagReset);
      watch.TagInitializer.tagList.addEventListener('reset', onTagReset);
    } // end initVideoTagContainer

    function initRightPanel($rightPanel) {
      initRightPanelJack($rightPanel);
      initRightPanelTabHook();
      var $playerTabWrapper = $rightPanel, $playerTabWrapper = $rightPanel, wideCss = null;
      var
        createWideCommentPanelCss = function (targetWidth) {
          var px = targetWidth - $rightPanel.outerWidth();
          var elms = [
            '#playerTabWrapper', //'#playerTabWrapper',
            '#commentDefaultHeader',
            '#playerCommentPanel .commentTable',
            '#playerCommentPanel .commentTable .commentTableContainer'
          ];
          var css = [
            'body.videoExplorer #content.w_adjusted #playerTabWrapper { width: ', targetWidth,'px;}\n',
            //'#playerTabWrapper.w_wide, body.videoExplorer #content.w_adjusted #playerTabWrapper { width: ', targetWidth,'px;}\n',
            //'body:not(.videoExplorer) #playerTabWrapper.w_wide { right: -140px;}\n'
          ];
          for (var v in elms) {
            var $e = $(elms[v]), newWidth = $e.width() + px;
            css.push([
              //'#playerTabWrapper.w_wide ', elms[v],
              //' , body.videoExplorer #content.w_adjusted ',
              'body.videoExplorer #content.w_adjusted ',
              elms[v], ' { width: ', newWidth,'px !important;}\n'
            ].join(''));
          }
          wideCss = addStyle(css.join(''), 'wideCommentPanelCss');
        },
        toggleWide = function(v) {
          $rightPanel.toggleClass('w_wide', v).css('right', '');
          EventDispatcher.dispatch('onWindowResize');
        };

      var wideCommentPanelCss = Util.here(function() {/*
        body.videoExplorer #content.w_adjusted #playerTabWrapper { width: 420px;}
        body.videoExplorer #content.w_adjusted #playerTabWrapper { width: 420px !important;}
        body.videoExplorer #content.w_adjusted #commentDefaultHeader { width: 408px !important;}
        body.videoExplorer #content.w_adjusted #playerCommentPanel .commentTable { width: 406px !important;}
        body.videoExplorer #content.w_adjusted #playerCommentPanel .commentTable .commentTableContainer { width: 406px !important;}
      */});
      addStyle(wideCommentPanelCss, 'wideCommentPanelCss');

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {

        //EventDispatcher.dispatch('onWindowResize');

        var $div = $([
            '<div id="sharedNgSettingContainer" style="display: none;">NG共有レベル: ',
              '<select id="sharedNgSetting">',
                '<option value="HIGH">高</option>',
                '<option value="MIDDLE">中</option>',
                '<option value="LOW">低</option>',
                '<option value="NONE">無</option>',
              '</select>',
            '</div>',
          ''].join('')), $ngs = $div.find('select');

        $ngs
          .val(watch.PlayerInitializer.nicoPlayerConnector.playerConfig.get().ngScoringFilteringLevel)
          .on('change', function() {
            var val = this.value;
            watch.PlayerInitializer.nicoPlayerConnector.playerConfig.set({ngScoringFilteringLevel: this.value});
          });
        $('#commentDefaultHeader').append($div);

        EventDispatcher.addEventListener('on.config.enableSharedNgSetting', function(newValue, oldValue) {
          if (newValue) {
            $div.show();
          } else {
            $div.hide();
          }
        });
        if (conf.enableSharedNgSetting) { $div.show(); }
      });

    } // end initRightPanel

    function initRightPanelTabHook() {
      var playerTab = WatchApp.ns.init.PlayerInitializer.playerTab;
      // 終了時にニコメンドが勝手に開かなくするやつ
      // 連続再生中はニコメンドパネルが開かない事を利用する
      playerTab.playlist_org = playerTab.playlist;
      playerTab.playlist = {
        isContinuousPlayback: function() {
          if (conf.playerTabAutoOpenNicommend === 'disable') {
            if (conf.debugMode) console.log('ニコメンドキャンセル: "disabled"');
            // 'disable'の時は常に「連続再生中」という嘘を返す事でパネルオープンを止める
            return true;
          } else
          if (conf.playerTabAutoOpenNicommend === 'auto' && WatchController.isNicommendEmpty()) {
            if (conf.debugMode) console.log('ニコメンドキャンセル: "auto"');
            // 'auto' の時は、ニコメンドが空の時だけキャンセルする
            return true;
          } else
          if (conf.playerTabAutoOpenNicommend === 'enable') {
            return playerTab.playlist_org.isContinuousPlayback();
          }
        }
      };
    } //

    // - 右パネル乗っ取る
    var rightInfoPanelInitialized = false;
    function initRightPanelJack($sidePanel) {
      if (!conf.rightPanelJack) { return; }
      if (rightInfoPanelInitialized) { return; }
      rightInfoPanelInitialized = true;

      var $tab = $([
          '<ul id="sidePanelTabContainer">',
            '<li class="tab comment"   data-selection="w_comment"  >コメント</li>',
            '<li class="tab videoInfo" data-selection="w_videoInfo">動画情報</li>',
            '<li class="tab ichiba"    data-selection="w_ichiba"   >ニコニコ市場</li>',
            '<li class="tab review"    data-selection="w_review"   >レビュー</li>',
          '</ul>'].join(''));

      var $infoPanel   = $('<div/>').attr({'id': 'rightVideoInfo',   'class': 'sideVideoInfo   sidePanelInner'});
      var $ichibaPanel = $('<div/>').attr({'id': 'rightIchibaPanel', 'class': 'sideIchibaPanel sidePanelInner'});
      var $reviewPanel = $('<div/>').attr({'id': 'rightReviewPanel', 'class': 'sideReviewPanel sidePanelInner'});
      $sidePanel.append($tab).append($infoPanel).append($ichibaPanel).append($reviewPanel);

      var
        onTabSelect = function(e) {
          e.preventDefault();
          AnchorHoverPopup.hidePopup();
          var selection = $(e.target).attr('data-selection');
          if (typeof selection === 'string') {
            if (WatchController.isSearchMode()) {
              conf.setValue('lastRightTabInExplorer', selection);
            } else {
              conf.setValue('lastRightTab',           selection);
            }
            changeTab(selection);
          }
        },
        $videoReview = $('#videoReview'),
        toggleReview = function(f) {
          if (f) {
            $reviewPanel.append($videoReview);
          } else {
            $('#playerBottomAd').after($videoReview);
          }
        },
        changeTab = function(selection) {
          if ($sidePanel.hasClass('w_review') && selection !== 'w_review') {
            toggleReview(false);
          }
          $sidePanel.removeClass('w_videoInfo w_comment w_ichiba w_review').addClass(selection);
          if (selection === 'w_ichiba') {
            resetIchiba(false);
          } else
          if (selection === 'w_review') {
            toggleReview(true);
          } else
          if (selection === 'w_comment') {
            setTimeout(function() {
              watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
            }, 500);
          }
          return changeTab;
        },
        lastIchibaVideoId = '', resetIchiba = function(force) {
          var videoId = watchInfoModel.id;
          if (lastIchibaVideoId === videoId && !force) {
            return;
          }
          lastIchibaVideoId = videoId;
          resetSideIchibaPanel($ichibaPanel, true);
        },
        resetScroll = function() {
          $(this).animate({scrollTop: 0}, 600);
        };

      $infoPanel  .on('dblclick', resetScroll);
      $ichibaPanel.on('dblclick', resetScroll);
      $reviewPanel.on('dblclick', resetScroll);

      $tab.on('click', onTabSelect).on('touchend', onTabSelect);
      changeTab(conf.lastRightTab);

      var $infoPanelTemplate = $sideInfoPanelTemplate;

      EventDispatcher.addEventListener('onVideoExplorerOpening', function() {
        changeTab('w_comment');
      });
      EventDispatcher.addEventListener('onVideoExplorerClosing', function() {
        changeTab(conf.lastRightTab);
      });

      EventDispatcher.addEventListener('onWindowResize', function() {
        var $body = $('body'), $right = $('#playerTabWrapper');
        if (WatchController.isSearchMode() || $body.hasClass('full_with_browser')) { return; }
        var w = $('#external_nicoplayer').outerWidth(), margin = 84;
        //w += $left.is(':visible')  ? $left.outerWidth()  : 0;
        w += $right.is(':visible') ? $right.outerWidth() : 0;
        $('#sidePanelTabContainer').toggleClass('left', (window.innerWidth - w - margin < 0));
      });

      EventDispatcher.addEventListener('onVideoInitialized', function() {
        sidePanelRefresh($infoPanel, $ichibaPanel, $sidePanel, $infoPanelTemplate.clone());
        if ($ichibaPanel.is(':visible')) {
          resetIchiba(true);
        }
        setTimeout(function() {
          $sidePanel.toggleClass('reviewEmpty', $('#videoReview').find('.stream').length < 1);
        }, 2000);
      });
    } // end of initRightPanelJack




    function initVideoReview($, conf, w) {
      var __css__ = Util.here(function() {/*
        .sidePanel #videoReview { margin: 0 auto; }
        #outline.w_compact #videoReview { width: 300px; }
        #outline.w_compact textarea.newVideoReview { width: 277px; }
        #outline.w_compact #videoReviewHead { width: 283px; }
        #outline.w_compact #videoReview .stream { width: 300px; }
        #outline.w_compact #videoReview .inner { width: 300px; }
        #outline.w_compact .commentContent { width: 278px; }
        #outline.w_compact .commentContentBody { width: 232px; }
        .sidePanel.w_review #videoReview { width: 260px; }
        .sidePanel.w_review textarea.newVideoReview { width: 237px; }
        .sidePanel.w_review #videoReviewHead { width: 243px; }
        .sidePanel.w_review #videoReview .stream { width: 260px; }
        .sidePanel.w_review #videoReview .inner { width: 260px; }
        .sidePanel.w_review .commentContent { width: 238px; }
        .sidePanel.w_review .commentContentBody { width: 192px; }
        {*
          .sidePanel.w_review.w_wide #videoReview { width: 400px; }
          .sidePanel.w_review.w_wide textarea.newVideoReview { width: 377px; }
          .sidePanel.w_review.w_wide #videoReviewHead { width: 383px; }
          .sidePanel.w_review.w_wide #videoReview .stream { width: 400px; }
          .sidePanel.w_review.w_wide #videoReview .inner { width: 400px; }
          .sidePanel.w_review.w_wide .commentContent { width: 378px; }
          .sidePanel.w_review.w_wide .commentContentBody { width: 332px; }
        *}
        body.videoExplorer .sidePanel.w_review #videoReview { width: 400px; }
        body.videoExplorer .sidePanel.w_review textarea.newVideoReview { width: 377px; }
        body.videoExplorer .sidePanel.w_review #videoReviewHead { width: 383px; }
        body.videoExplorer .sidePanel.w_review #videoReview .stream { width: 400px; }
        body.videoExplorer .sidePanel.w_review #videoReview .inner { width: 400px; }
        body.videoExplorer .sidePanel.w_review .commentContent { width: 378px; }
        body.videoExplorer .sidePanel.w_review .commentContentBody { width: 332px; }

        body:not(.videoExplorer) .sidePanel .commentUserProfile, body:not(.videoExplorer) .sidePanel .panelTrigger {
          display: none !important;
        }
        body.videoExplorer .sidePanel .commentUserProfile {
          position: fixed;
          top:  36px !important;
          left: auto !important;
          right:  0 !important;
          z-index: 11000;
        }

        .sidePanel .getMoreReviewComment {
          margin-bottom: 256px;
        }
      */});
      var reviewCss = addStyle(__css__, 'videoReviewCss');

      /*
      EventDispatcher.addEventListener('onFirstVideoInitialized', function() { setTimeout(function() {
        var elms = [
          '#videoReview',
          'textarea.newVideoReview',
          '#videoReviewHead',
          '#videoReview .stream',
          '#videoReview .inner',
          '.commentContent',
          '.commentContentBody'
        ];
        var css = [], $baseElement = $('#videoReview');
        var makeCss = function (targetWidth, preSel) {
          var px = targetWidth - $baseElement.outerWidth();
          for (var v in elms) {
            var $e = $(elms[v]), newWidth = $e.width() + px;
            css.push([
              preSel, elms[v], ' { width: ', newWidth,'px; }\n'
            ].join(''));
          }
        };
        makeCss(300, '#outline.w_compact ');
        makeCss(260, '.sidePanel.w_review ');
        makeCss(400, '.sidePanel.w_review.w_wide ');
        makeCss(400, 'body.videoExplorer .sidePanel.w_review ');
        console.log(css.join(''));
        var reviewCss = addStyle(css.join(''), 'videoReviewCss');
      }, 3000);});
      */
    } // end initVideoReview

    function initNews() {
      if (conf.hideNicoNews) {
        $('#content').addClass('noNews');
      }
      EventDispatcher.addEventListener('on.config.hideNicoNews', function(value) {
        $('#content').toggleClass('noNews', value);
      });
      if (conf.enableNewsHistory) { NicoNews.initialize(w); }
    } //


    function initEvents() {
      var pac = watch.PlayerInitializer.playerAreaConnector;

      pac.addEventListener("onVideoInitialized", onVideoInitialized);
      pac.addEventListener("onVideoEnded",       onVideoEnded);
      pac.addEventListener("onVideoStopped",     onVideoStopped);
      // pac.addEventListener('onSystemMessageFatalErrorSended', onSystemMessageFatalErrorSended);
      // watch.WatchInitializer.watchModel.addEventListener('error', function() {console.log(arguments);});

      pac.addEventListener('updateSettingsPanelVisible', function(isVisible, panel) {
        EventDispatcher.dispatch('onUpdateSettingPanelVisible', isVisible, panel);
      });

      watchInfoModel.addEventListener('reset', onWatchInfoReset);
      watch.PlayerInitializer.playerScreenMode.addEventListener('change', onScreenModeChange);

      var explorer = watch.VideoExplorerInitializer.videoExplorer;
      explorer.addEventListener('openStart',    onVideoExplorerOpening);
      explorer.addEventListener('openEnd',      onVideoExplorerOpened);
      explorer.addEventListener('closeStart',   onVideoExplorerClosing);
      explorer.addEventListener('closeEnd',     onVideoExplorerClosed);
      explorer.addEventListener('refreshStart', onVideoExplorerRefreshStart);
      explorer.addEventListener('refreshEnd',   onVideoExplorerRefreshEnd);
      explorer.addEventListener('changePage',   onVideoExplorerChangePage);


      $('body').dblclick(function(e){
        var tagName = e.target.tagName, cls = e.target.className || '';
        if (tagName === 'SELECT' || tagName === 'INPUT' ||  tagName === 'BUTTON' || cls.match(/mylistPopupPanel/)) {
          return;
        }
        if (!$('body').hasClass('full_with_browser')) {
          AnchorHoverPopup.hidePopup();
          if (conf.doubleClickScroll) {
            EventDispatcher.dispatch('onScrollReset');
            WatchController.scrollToVideoPlayer(true);
          }
        }
      });

      $(window).resize(onWindowResize);

      Mylist.onDefMylistUpdate(function() {
        WatchController.clearDeflistCache();
      });
      Mylist.onMylistUpdate(function(info) {
        if (info.action === 'add') {
          WatchController.clearMylistCache(info.groupId);
        }
      });

      $(window).on('beforeunload.watchItLater', function(e) {
        conf.setValue('lastCommentVisibility', WatchController.commentVisibility() ? 'visible' : 'hidden');
      });
      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        pac.addEventListener('onVideoChangeStatusUpdated', onVideoChangeStatusUpdated);
      });

      //EventDispatcher.addEventListener('onFirstVideoExplorerOpened', function() {
        //initVideoExplorer();
      //});
    }

    function initAdditionalButtons() {
      var $div = $('<div/>');

      $div.addClass('bottomAccessContainer');
      var $playlistToggle = $('<button title="プレイリスト表示/非表示">プレイリスト</button>');
      $playlistToggle.addClass('playlistToggle');

      $('#playlist').toggleClass('w_show', !conf.hidePlaylist).toggleClass('w_closing', conf.hidePlaylist);
      $playlistToggle.toggleClass('w_show', !conf.hidePlaylist);
      $playlistToggle.on('click', function() {
        var $playlist = $('#playlist');
        var current = $playlist.hasClass('w_show');
        conf.setValue('hidePlaylist', current);
        if (current) {
          $playlist.addClass('w_closing');
          setTimeout(function() { $playlist.removeClass('w_show');}, 500);
        } else {
          $playlist.addClass('w_show').removeClass('w_closing');
        }
        //$playlist.toggleClass('w_show', current);
        $playlistToggle.toggleClass('w_show', !current);
        AnchorHoverPopup.hidePopup();
      });
      $div.append($playlistToggle);

      var $openExplorer = $('<button>検索▼</button>');
      $openExplorer.addClass('openVideoExplorer');
      $openExplorer.on('click', function() {
        WatchController.openSearch();
        if (!$('body').hasClass('content-fix')) {
          WatchController.scrollToVideoPlayer(true);
        }
      });
      $div.append($openExplorer);

      $('#outline .outer').before($div);

      var $container = $('<div class="bottomConfButtonContainer" />'), $conf = $('<button title="WatchItLaterの設定">設定</button>');
      $container.append($conf);
      $conf.addClass('openConfButton');
      $conf.click(function(e) {
        e.stopPropagation();
        AnchorHoverPopup.hidePopup();
        ConfigPanel.toggle();
      });
      $('#outline .outer').before($container);


      var $body = $('body'), $window = $(window);
      EventDispatcher.addEventListener('onWindowResize', function() {
        if (WatchController.isSearchMode() || $body.hasClass('full_with_browser')) { return; }
        var w = $div.outerWidth(), threshold = ($(window).innerWidth() - 960) / 2;
        $('#outline').toggleClass('under960', w > threshold && !$('#footer').hasClass('noBottom'));
      });
    } // end initAdditionalButtons


    function initSearchContent() {
      var ContentType      = WatchApp.ns.components.videoexplorer.model.ContentType;
      var SearchSortOrder  = WatchApp.ns.components.videoexplorer.model.SearchSortOrder;
      var View             = WatchApp.ns.components.videoexplorer.view.content.SearchContentView;
      var vec              = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer         = vec.getVideoExplorer();
      var content          = explorer.getContentList().getContent(ContentType.SEARCH);
      var relatedTag       = new NicoSearchRelatedTag({});
      var newSearch        = new NewNicoSearch({});
      var newSearchWrapper = new NewNicoSearchWrapper({search: newSearch});
      var pager            = content._pager;
      var __css__          = Util.here(function() {/*
        .newSearchOption {
          text-align: center; margin-bottom: 16px; padding: 8px;
          background: #eee;
          display: none;
        }
        .newSearchOption select, .newSearchOption label{
          margin-right: 32px;
        }
        .newSearchOption .reset{
          cursor: pointer; background: #eee;
        }
        .newSearchOption p{
          margin: 8px;
        }
        .newSearchOption .ownerName {
        }
        .w_sugoiSearch .newSearchOption {
          display: block;
        }

        .relatedTagList {
          background: #ddd; padding: 8px;
        }
        .relatedTagList p{
          display: inline-block; margin: 4px;
        }
        .relatedTagList li, .relatedTagList ul {
          display: inline-block;
          margin: 0 18px 0 0;
          list-style: none;
          word-break: break-all;
        }
      */});
      addStyle(__css__, 'searchContent');

      var RelatedTagView = function() { this.initialize.apply(this, arguments); };
      RelatedTagView.prototype = {
        _$view: null,
        _relatedTag: null,
        initialize: function(params) {
          this._relatedTag = params.relatedTag;
          this._$view       = params.$view;
          this._$list       = this._$view.find('ul');
        },
        getView: function() {
          return this._$view;
        },
        detach: function() {
          this._$view.detach();
        },
        update: function(candidates) {
          if (!candidates || candidates.length < 1) {
            this.detach();
            return;
          }
          if (candidates.length > 10) {
            candidates = candidates
              .map(function(a){return {weight:Math.random(), value:a};})
              .sort(function(a, b){return a.weight - b.weight;})
              .map(function(a){return a.value;});
          }
          var $ul = this._$list.empty();
          for (var i = 0, len = Math.min(10, candidates.length); i < len; i++) {
            $ul.append(this._create$tag(candidates[i].tag));
          }
        },
        clear: function() {
          this._$list.empty();
        },
        _create$tag: function(text) {
          var
            $a = $('<a/>')
              .html(text)
              .attr('href', 'http://search.nicovideo.jp/video/tag/' + encodeURIComponent(text))
              .on('click', function(e) {
                if (e.button !== 0 || e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) return;
                e.preventDefault();
                WatchController.nicoSearch(text);
              }),
            $tag = $('<li/>').append($a);
          return $tag;
        }
      };

      var NewSearchOptionView = function() { this.initialize.apply(this, arguments); };
      NewSearchOptionView.prototype = {
        _content: null,
        _$view: null,
        _$startTimeRange: null,
        _$lengthSecondsRange: null,
        initialize: function(params) {
          this._content             = params.content;
          this._$view               = params.$view;
          this._$startTimeRange     = this._$view.find('.startTimeRange');
          this._$lengthSecondsRange = this._$view.find('.lengthSecondsRange');
          this._$musicDlFilter      = this._$view.find('.musicDlFilter');
          this._$ownerFilter        = this._$view.find('.ownerFilter');
            this._$ownerName        = this._$view.find('.ownerName');
          this._$resetButton        = this._$view.find('.reset');

          this._$startTimeRange    .val(params.startTimeRange     || '');
          this._$lengthSecondsRange.val(params.lengthSecondsRange || '');
          this._$musicDlFilter     .attr('checked', !!params.musicDlFilter);

          this._$startTimeRange    .on('change', $.proxy(this._onStartTimeRangeSelect    , this));
          this._$lengthSecondsRange.on('change', $.proxy(this._onLengthSecondsRangeSelect, this));
          this._$musicDlFilter     .on('click',  $.proxy(this._onMusicDlFilterChange     , this));
          this._$ownerFilter       .on('click',  $.proxy(this._onOwnerFilterChange       , this));
          this._$resetButton       .on('click',  $.proxy(this.reset                      , this));

          EventDispatcher.addEventListener('onVideoOwnerChanged', $.proxy(this.onVideoOwnerChange, this));
          this._$ownerName.text(WatchController.getOwnerName());
        },
        getView: function() {
          return this._$view;
        },
        detach: function() {
          this._$view.detach();
        },
        update: function() {
        },
        onVideoOwnerChange: function(ownerInfo) {
          this._content.setOwnerFilter(false);
          this._$ownerFilter.attr('checked', false);
          this._$ownerName.text(ownerInfo.name);
        },
        _onStartTimeRangeSelect: function() {
          this._content.setStartTimeRange(this._$startTimeRange.val());
          this._content.refresh({ page: 1 });
        },
        _onLengthSecondsRangeSelect: function() {
          this._content.setLengthSecondsRange(this._$lengthSecondsRange.val());
          this._content.refresh({ page: 1 });
        },
        _onMusicDlFilterChange: function() {
          this._content.setMusicDlFilter(!!this._$musicDlFilter.attr('checked'));
          this._content.refresh({ page: 1 });
        },
        _onOwnerFilterChange: function() {
          this._content.setOwnerFilter(!!this._$ownerFilter.attr('checked'));
          this._content.refresh({ page: 1 });
        },
        reset: function() {
          var v = this._$startTimeRange.val() + this._$lengthSecondsRange.val();
          if (v !== '') {
            this._content.setStartTimeRange('');
            this._content.setLengthSecondsRange('');
            this._content.setMusicDlFilter(false);
            this._$startTimeRange.val('');
            this._$lengthSecondsRange.val('');
            this._$musicDlFilter.attr('checked', false);
            this._content.refresh({ page: 1 });
          }
        }
      };

      var relatedTagView = new RelatedTagView({
        relatedTag: relatedTag,
        $view: $('<div class="relatedTagList"><p>関連タグ: </p><ul></ul></div>')
      });
      var newSearchOptionView = new NewSearchOptionView({
        content: content,
        startTimeRange:     conf.searchStartTimeRange,
        lengthSecondsRange: conf.searchLengthSecondsRange,
        musicDlFilter:      conf.searchMusicDlFilter,
        $view: $([
          '<div class="newSearchOption">',
            '<span>投稿日時: </span>',
            '<select class="startTimeRange" name="u">',
              '<option selected="selected" value=""   >指定なし</option>',
              '<option                     value="24h">24時間以内</option>',
              '<option                     value="1w" >1週間以内</option>',
              '<option                     value="1m" >1ヶ月(30日)以内</option>',
              '<option                     value="3m" >3ヶ月(90日)以内</option>',
              '<option                     value="6m" >6ヶ月(180日)以内</option>',
            '</select>',
            '<span>再生時間: </span>',
            '<select class="lengthSecondsRange" name="l">',
              '<option selected="selected" value=""     >指定なし</option>',
              '<option                     value="short">5分以内</option>',
              '<option                     value="long" >20分以上</option>',
            '</select>',
            '<p>',
              '<label>',
                '<input type="checkbox" name="m" class="musicDlFilter">音楽DL対応のみ</input>',
              '</label>',
              '<label>',
                '<input type="checkbox" name="owner" class="ownerFilter"><span class="ownerName">この投稿者</span>&nbsp;の動画のみ</input>',
              '</label>',
            '</p>',
          '</div>',
          ''].join(''))
      });



      content._originalWord = '';
      content.refresh_org = content.refresh;
      content.refresh = $.proxy(function(params, callback) {
        var word = WatchApp.get(params, 'searchWord', 'string', '');
        var type = WatchApp.get(params, 'searchType', 'string', this.getSearchType());
        if (typeof word === 'string' && word.length > 0) {
          this._originalWord = word;

          if (conf.defaultSearchOption && conf.defaultSearchOption !== '') {
            if (word.indexOf(conf.defaultSearchOption) < 0 && !word.match(/(sm|nm|so)\d+/)) {
              params.searchWord += " " + conf.defaultSearchOption;
            }
          }
        }
        AnchorHoverPopup.hidePopup();
        EventDispatcher.dispatch('onSearchStart', this._originalWord, type);
        this.refresh_org(params, callback);
      }, content);

      // ニコニコ新検索エンジンを使うための布石
      content._searchEngineType  = conf.searchEngine;
      content._lastSearchEngineType = '';
      content.setSearchEngineType   = $.proxy(function(type) {
        this._searchEngineType = type;
        this._pager._pageItemCount = type === 'sugoi' ? 100 : 32;
      }, content);
      content.getSearchEngineType     = $.proxy(function()   {
        return this._searchEngineType === 'sugoi' ? 'sugoi' : 'normal';
      }, content);
      content.setLastSearchEngineType = $.proxy(function(type) { this._lastSearchEngineType = type; }, content);
      content.getLastSearchEngineType = $.proxy(function()     { return this._lastSearchEngineType; }, content);
      content._newSearchWrapper     = newSearchWrapper;

      content._startTimeRange       = conf.searchStartTimeRange;
      content._lengthSecondsRange   = conf.searchLengthSecondsRange;
      content._musicDlFilter        = conf.searchMusicDlFilter;
      content._ownerFilter          = false;

      content.getStartTimeRange     = $.proxy(function() { return this._startTimeRange;           }, content);
      content.getLengthSecondsRange = $.proxy(function() { return this._lengthSecondsRange;       }, content);
      content.getMusicDlFilter      = $.proxy(function() { return this._musicDlFilter;            }, content);
      content.getOwnerFilter        = $.proxy(function() { return this._ownerFilter;              }, content);
      content.setStartTimeRange     = $.proxy(function(value) {
        this._startTimeRange = value;
        conf.setValue('searchStartTimeRange', value);
      }, content);
      content.setLengthSecondsRange = $.proxy(function(value) {
        this._lengthSecondsRange = value;
        conf.setValue('searchLengthSecondsRange',value);
      }, content);
      content.setMusicDlFilter      = $.proxy(function(value) {
        this._musicDlFilter = !!value;
        conf.setValue('searchMusicDlFilter', !!value);
      }, content);
      content.setOwnerFilter        = $.proxy(function(value) {
        this._ownerFilter = !!value;
      }, content);


      content.load_org = content.load;
      content.load = $.proxy(function(callback) {
        var word = this.getSearchWord();
        if (this.getSearchEngineType() !== 'sugoi' || word.length <= 0 || word.match(/(sm|nm|so)\d+/)) {
          this.setLastSearchEngineType('normal');
          this.load_org(callback);
        } else {
          this.setLastSearchEngineType('sugoi');
          var params = {
            searchWord:  this.getSearchWord(),
            searchType:  this.getSearchType(),
            page:        this.getPage(),
            sort:        this.getSort(),
            order:       this.getOrder(),
            l:           this.getLengthSecondsRange(),
            u:           this.getStartTimeRange(),
            m:           this.getMusicDlFilter(),
            size:        this._pager._pageItemCount
          };
          if (this.getOwnerFilter()) {
            if (WatchController.isChannelVideo()) {
              params.channelId = WatchController.getOwnerId();
            } else {
              params.userId = WatchController.getOwnerId();
            }
          }

          this._newSearchWrapper.load(params, function(err, result) {
            if (conf.debugMode)console.log('%cNewNicoSearchWrapper result', 'color: green;', result);
            callback(err, result);
          });
        }
      }, content);
      content.setSearchEngineType(conf.searchEngine);

      EventDispatcher.addEventListener('on.config.searchEngine', function(type) {
        content.setSearchEngineType(type);
      });


      var
        overrideSearchSortOrder = function(proto) { // ソート順を記憶するためのフック
          proto.getSort_org  = proto.getSort;
          proto.getSort = function() {
            return conf.searchSortType;
          };

          proto.setSort_org  = proto.setSort;
          proto.setSort = function(type, sort)  {
            conf.setValue('searchSortType', sort);
            this.setSort_org(type, sort);
          };

          proto.getOrder_org = proto.getOrder;
          proto.getOrder = function() {
            return conf.searchSortOrder;
          };

          proto.setOrder_org = proto.setOrder;
          proto.setOrder = function(type, order) {
            conf.setValue('searchSortOrder', order);
            this.setOrder_org(type, order);
          };
        },
        overrideSearchContentView = function(proto, relatedTag) {
          proto._updateRelatedTag = function() {
            if (!conf.enableRelatedTag) { return; }
            var word = this._content._originalWord;
            relatedTagView.clear();

            if (typeof word === 'string' && word.length > 0) {
              this._$header.append(relatedTagView.getView());
              relatedTag.load(word, function(err, result) {
                if (conf.debugMode) { console.log('SearchContentView._updateRelatedTag', err, result); }
                if (err) {
                  if (conf.debugMode) { console.log('load suggest fail', err, result); }
                } else {
                  relatedTagView.update(result.values);
                }
              });
            }
          };

          proto.detach_org = proto.detach;
          proto.detach = function() {
            this.detach_org();
            newSearchOptionView.detach();
            relatedTagView.detach();
          };

          proto.onUpdate_org = proto.onUpdate;
          proto.onUpdate = function() {
            this.onUpdate_org();
            this._$content.find('.searchBox').after(newSearchOptionView.getView());
            this._updateRelatedTag();
            var engine = this._content.getLastSearchEngineType();
            $('.videoExplorerBody')
              .toggleClass('w_sugoiSearch',  engine === 'sugoi')
              .toggleClass('w_normalSearch', engine !== 'sugoi');
          };

          proto.onError_org = proto.onError;
          proto.onError = function() {
            this.onError_org();
            this._$header.append(newSearchOptionView.getView());
            this._updateRelatedTag();
            var engine = this._content.getLastSearchEngineType();
            $('.videoExplorerBody')
              .toggleClass('w_sugoiSearch',  engine === 'sugoi')
              .toggleClass('w_normalSearch', engine !== 'sugoi');
          };

        };

      overrideSearchSortOrder(SearchSortOrder.prototype);
      overrideSearchContentView(View.prototype, relatedTag);

    } // end initSearchContent

    function initUserVideoContent() {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.USER_VIDEO);
      var pager       = content._pager;

      pager._pageItemCount = 100;
    }

    function initUploadedVideoContent() {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.UPLOADED_VIDEO);
      var pager       = content._pager;

      pager._pageItemCount = 100;
    }

    function initDeflistContent() {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.DEFLIST_VIDEO);
      var pager       = content._pager;

      pager._pageItemCount = 100;

      content.refresh_org = content.refresh;
      content.refresh = $.proxy(function(params, callback) {
        if (conf.debugMode) console.log('deflist refresh! ', params, callback);
        if (!this.isActive()) {
          WatchController.clearDeflistCache();
        }
        this.refresh_org(params, callback);
      }, content);
    }

    var isSquareCssInitialized = false;
    function initSquareThumbnail() {
      var isSquare = !!conf.squareThumbnail;
      if (isSquare && !isSquareCssInitialized) {
        var __css__ = Util.here(function() {/*
          {* 元のCSSを打ち消すためにやや冗長 *}
          body.videoExplorer #videoExplorer.squareThumbnail .videoExplorerBody .videoExplorerContent .contentItemList .item.gold .thumbnailContainer{
            background: #e9d7b4;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .videoExplorerBody .videoExplorerContent .contentItemList .item.silver .thumbnailContainer{
            background: #cecece;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .item .thumbnailContainer {
            width: 130px; height: 100px;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .item .thumbnailContainer .link {
            width: 130px; height: 100px;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .item .thumbnailContainer img {
            max-width: 130px; top: 0; left: 0;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .item .thumbnailContainer img.playingIcon {
            top: 50%; left: 50%;
          }
          body.videoExplorer #videoExplorer.squareThumbnail .item .column4 .thumbnailHoverMenu {
            bottom: 47px;
          }
        */});

        addStyle(__css__, 'squareThumbnailCss');
        isSquareCssInitialized = true;
      }
      $('#videoExplorer').toggleClass('squareThumbnail', isSquare);
    } //

    function initPageBottom($, conf, w) {
      function updateHideVideoExplorerExpand(v) {
        $('#content, #outline').toggleClass('w_hideSearchExpand', v === true);
      }
      function updateNicommendVisibility(v) {
        var $nicommend = $('#nicommendContainer');
        if (v === 'visible') {
          $('#nicoIchiba').before($nicommend);
          $('#outline').removeClass('noNicommend');
        } else
        if (v === 'underIchiba') {
          $('#nicoIchiba').after($nicommend);
          $('#outline').removeClass('noNicommend');
        } else
        if (v === 'hidden') {
          $('#outline').addClass('noNicommend');
        }
      }
      function updateIchibaVisibility(v) {
        $('#outline').toggleClass('noIchiba', v === 'hidden');
      }
      function updateReviewVisibility(v) {
        $('#outline').toggleClass('noReview', v === 'hidden');
      }
      function updateBottomContentsVisibility(v) {
        $('#bottomContentTabContainer, #footer').toggleClass('noBottom', v === 'hidden');
      }

      EventDispatcher.addEventListener('on.config.hideVideoExplorerExpand',     updateHideVideoExplorerExpand);
      EventDispatcher.addEventListener('on.config.nicommendVisibility',         updateNicommendVisibility);
      EventDispatcher.addEventListener('on.config.ichibaVisibility',            updateIchibaVisibility);
      EventDispatcher.addEventListener('on.config.reviewVisibility',            updateReviewVisibility);
      EventDispatcher.addEventListener('on.config.bottomContentsVisibility',    updateBottomContentsVisibility);
      if (conf.hideVideoExplorerExpand === true) { updateHideVideoExplorerExpand(true); }
      if (conf.nicommendVisibility !== 'visible') { updateNicommendVisibility(conf.nicommendVisibility); }
      if (conf.ichibaVisibility    !== 'visible') { updateIchibaVisibility(conf.ichibaVisibility); }
      if (conf.reviewVisibility    !== 'visible') { updateReviewVisibility(conf.reviewVisibility); }
      if (conf.bottomContentsVisibility !== 'visible') { updateBottomContentsVisibility(conf.bottomContentsVisibility); }

      var $bottomToggle = $('<div class="toggleBottom"><div class="openBottom">▽</div><div class="closeBottom">△</div></div>');
      $bottomToggle.on('click', function() {
        var v = conf.bottomContentsVisibility;
        conf.setValue('bottomContentsVisibility', v === 'hidden' ? 'visible' : 'hidden');
        //ConfigPanel.refresh();
      }).attr('title', '市場・レビューの開閉');
      $('#footer').append($bottomToggle);
    } //



    function initShortcutKey() {
      var list = [
        {name: 'shortcutDefMylist',          exec: function(e) {
          WatchController.addDefMylist();
        }},
        {name: 'shortcutMylist',             exec: function(e) {
          $('#mylist_add_frame').find('.mylistAdd').click();
        }},
        {name: 'shortcutOpenDefMylist',      exec: function(e) {
          WatchController.showDefMylist();
          WatchController.scrollToVideoPlayer(true);
        }},
        {name: 'shortcutOpenSearch',         exec: function(e) {
          WatchController.openSearch();
          if (!$('body').hasClass('content-fix')) {
            WatchController.scrollToVideoPlayer(true);
          }
        }},
        {name: 'shortcutOpenRecommend',      exec: function(e) {
          WatchController.openRecommend();
          if (!$('body').hasClass('content-fix')) {
            WatchController.scrollToVideoPlayer(true);
          }
        }},
        {name: 'shortcutScrollToNicoPlayer', exec: function(e) {
          WatchController.scrollToVideoPlayer(true);
        }},
        {name: 'shortcutCommentVisibility',  exec: function(e) {
          WatchController.commentVisibility('toggle');
        }},
        {name: 'shortcutShowOtherVideo',     exec: function(e) {
          WatchController.openVideoOwnersVideo();
        }},
        {name: 'shortcutMute',               exec: function(e) {
          WatchController.mute('toggle');
        }},
        {name: 'shortcutDeepenedComment',    exec: function(e) {
          WatchController.deepenedComment('toggle');
        }},
        {name: 'shortcutToggleStageVideo',   exec: function(e) {
          WatchController.toggleStageVideo();
        }}
      ];
      for (var v in list) {
        var n = list[v].name;
        list[v].keyMatch = KeyMatch.create(conf[n]);
      }

      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        for (var v in list) {
          var n = list[v].name;
          if (n === name) {
            list[v].keyMatch = KeyMatch.create(newValue);
          }
        }
      });

      $('body').on('keydown.watchItLater', function(e) {
        // 一部のキーボードについているMusic Key(正式名称不明)に対応 Chromeしか拾えない？
        if (e.keyCode === 178) {  // 停止
          WatchController.togglePlay();
        } else
        if (e.keyCode === 179) { // 一時停止
          WatchController.togglePlay();
        } else
        if (e.keyCode === 177) { // 前の曲
          if (WatchController.vpos() > 2000) {
            WatchController.vpos(0);
          } else {
            WatchController.prevVideo();
          }
        } else
        if (e.keyCode === 176) { // 次の曲
          WatchController.nextVideo();
        }
        if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }
        // 全画面時はFlashにフォーカスがなくてもショートカットキーが効くようにする

        for (var v in list) {
          var n = list[v].name;
          if (list[v].keyMatch.test(e)) {
            list[v].exec(e);
          }
        }
      });
    } //

    function initNicoS($, conf, w) {
      WatchJsApi.nicos.addEventListener('nicoSJump', function(e) {
        if (conf.ignoreJumpCommand) {
          e.cancel();
          Popup.show('「@ジャンプ」コマンドをキャンセルしました');
        }
      });
      var seekCount = 0;
      WatchApp.ns.model.player.NicoSClientConnector.addEventListener('nicoSSeek', function(e) {
        seekCount++;
        if (conf.nicoSSeekCount < 0) return;
        if (seekCount > conf.nicoSSeekCount) {
          e.cancel();
        }
      });
      // 動画が切り替わったか、最後まで視聴したらカウンターリセット
      EventDispatcher.addEventListener('onVideoInitialized', function() {
        seekCount = 0;
      });
      EventDispatcher.addEventListener('onVideoEnded', function() {
        seekCount = 0;
      });
    } //

    function initMouse() {
      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        if (name === 'mouseClickWheelVolume') {
          if (oldValue === 0) {
            initWheelWatch();
          } else
          if (newValue === 0) {
            $('body')
              .unbind('mousewheel.watchItLaterWheelWatch')
              .unbind('mousedown.watchItLaterWheelWatch')
              .unbind('mouseup.watchItLaterWheelWatch');
          }
        }
      });

      function initWheelWatch() {
        var leftDown = false, rightDown = false, isVolumeChanged = false;
        var event = {
          cancel: false,
          reset: function() { this.cancel = false; return this; },
          preventDefault: function() { this.cancel = true;}
        };
        $('body').on('mousewheel.watchItLaterWheelWatch', function(e, delta) {
          var button = -1;
          // TODO: マジックナンバーを
          if (typeof e.buttons === 'number') { // firefox
            button = e.buttons;
          } else { // chrome
            if (leftDown)  { button = 1; }
            else
            if (rightDown) { button = 2; }
          }
          if (button < 1) {
            EventDispatcher._dispatch('onWheelNoButton', e, delta);
            return;
          }
          EventDispatcher.dispatch('onWheelAndButton', event.reset(), delta, button);
          if (event.cancel) {
            e.preventDefault();
            return;
          }
          if (conf.mouseClickWheelVolume !== button) {
            return;
          }

          var v = WatchController.volume(), r;
          isVolumeChanged = true;
          // 音量を下げる時は「うわ音でけぇ！」
          // 音量を上げる時は「ちょっと聞こえにくいな」…というパターンが多いので、変化の比率が異なる
          if (delta > 0) {
            v = Math.max(v, 1);
            r = (v < 5) ? 1.3 : 1.1;
            v = WatchController.volume(v * r);
          } else {
            v = WatchController.volume(Math.floor(v / 1.2));
          }
          e.preventDefault();
        }).on('mousedown.watchItLaterWheelWatch', function(e) { // chromeはホイールイベントでe.buttonsが取れないため
          if (e.which === 1) leftDown  = true;
          if (e.which === 3) rightDown = true;
        }).on('mouseup.watchItLaterWheelWatch', function(e) {
          if (e.which === 1) leftDown  = false;
          if (e.which === 3) rightDown = false;
        }).on('contextmenu.watchItLaterWheelWatch', function(e) {
          if (isVolumeChanged) {
            e.preventDefault();
          }
          isVolumeChanged = false;
        });
      }
        initWheelWatch();
    } // end initMouse

    function initTouch() {
      var touchInitialized = false;
      TouchEventDispatcher.onflick(function(e) {
        var se = e.startEvent;
        if (!conf.enableQTouch) {return; }
        if (e.direction === 'right') {
          if (se.target.id === 'playerTabWrapper') {
            $(se.target).addClass('w_active');
          }
          if (!touchInitialized) {
            $('#mylist_add_frame, #leftPanelTabContainer, .videoExplorerMenu, #playerTabWrapper').addClass('w_touch');
            $('.userProfile, .resultPagination, #searchResultContainer select, .playlistMenuPopup').addClass('w_touch');
            isTouchActive = true;
            touchInitialized = true;
          }
        } else
        if (e.direction === 'left') {
          if (se.target.tagName === 'DIV' &&
              $.contains('#playerTabWrapper', se.target)) {
            $('#playerTabWrapper').removeClass('w_active');
          }
        }
      });
    } //

    function initOtherCss() {
      var __dynamic_css_template__ = Util.here(function() {/*
       .full_with_browser.w_fullScreenMenu #nicoHeatMap {
          transform: scaleX($scale); -webkit-transform: scaleX($scale); display: block;
        }
      */});
      var exStyle = null;
      var updateDynamicCss = function() {
        var css = __dynamic_css_template__;
        var innerWidth = $('body').innerWidth();
        css = css.split('$scale').join($('body').innerWidth() / 100);
        if (exStyle) {
          exStyle.innerHTML = css;
          return exStyle;
        } else {
          return addStyle(css, 'expression');
        }
      };
      exStyle = updateDynamicCss();

      EventDispatcher.addEventListener('onWindowResize', function() {
        updateDynamicCss();
      });
    } // end initOtherCss

    function initStageVideo($, conf, w) {
      var onStageVideoAvailabilityUpdated = function(v) {
        $('#nicoplayerContainerInner').toggleClass('stageVideo', v);
      };

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        onStageVideoAvailabilityUpdated(WatchController.isStageVideoAvailable());
        if (conf.forceEnableStageVideo) {
          try {$('#external_nicoplayer')[0].setIsForceUsingStageVideo(true);  } catch (e) { console.log(e);}
        }
        if (conf.forceExpandStageVideo) {
          try {$('#external_nicoplayer')[0].setIsForceExpandStageVideo(true); } catch (e) { console.log(e);}
        }
      });

      pac.addEventListener('onStageVideoAvailabilityUpdated', onStageVideoAvailabilityUpdated);

      // console.log('StageVideo', $('#external_nicoplayer')[0].isStageVideoSupported() ? 'supported' : 'not supported');
      // console.log('ColorSpaces', $('#external_nicoplayer')[0].getStageVideoSupportedColorSpaces());

    }

    function initHeatMap($, conf, w) {
      if (!conf.enableHeatMap) return;
      //if (!w.Worker) return;
      //
      // TODO: Web Workers
      var canvasWidth = 100, canvasHeight = 12;
      var comments = [], duration = 0, canvas = null, context = null;
      var commentReady = false, videoReady = false, updated = false, palette = [];
      var __css__ = Util.here(function(){/*
        #nicoHeatMapContainer {
          position: absolute; z-index: 200;
          bottom: 0px; left: 0;
          width: 672px;
          background: #000; height: 8px;
          overflow: hidden;
        }
        .size_normal #nicoHeatMapContainer {
          width: 898px;
        }
        .oldTypeCommentInput #nicoHeatMapContainer {
          bottom: 32px;
          display: none;
        }
        #nicoHeatMap {
          position: absolute; top: 0; left: 0;
          transform-origin: 0 0 0;-webkit-transform-origin: 0 0 0;
          transform: scaleX(6.72);-webkit-transform: scaleX(6.72);
        }
        {* パズルみたいになってきた *}
        body.size_normal:not(.full_with_browser) #content:hover #nicoHeatMapContainer,
        body.size_medium:not(.full_with_browser) #content:hover #nicoHeatMapContainer,
        body.videoExplorer #content.w_adjusted:hover #nicoHeatMapContainer,
        body:not(.full_with_browser) #nicoHeatMapContainer.displayAlways {
          display: block;
        }
        #nicoHeatMapContainer.displayAlways {
          cursor: pointer;
        }
        .size_normal #nicoHeatMap {
          transform: scaleX(8.98); -webkit-transform: scaleX(8.98);
        }
        .setting_panel #nicoHeatMapContainer, .full_with_browser #nicoHeatMapContainer, .size_small #content:not(.w_adjusted) #nicoHeatMapContainer {
          display: none;
        }
        body.full_with_browser.w_fullScreenMenu.trueBrowserFull #nicoHeatMapContainer {
          bottom: 0; position: fixed;
        }
        .full_with_browser.w_fullScreenMenu #nicoHeatMapContainer {
          display: block;
        }
        .full_with_browser.w_fullScreenMenu .oldTypeCommentInput #nicoHeatMapContainer {
          bottom: 34px; height: 10px;
        }
        .full_with_browser.w_fullScreenMenu #nicoHeatMapContainer {
          width: 100%;
        }
      */});
      addStyle(__css__, 'NicoHeatMapCss');

      watch.PlayerInitializer.playerAreaConnector.addEventListener('onCommentListInitialized', function() {
        w.setTimeout(function() {
          commentReady = true;
          update();
        }, 1000);
      });
      EventDispatcher.addEventListener('onVideoInitialized', function() {
        videoReady = true;
        update();
      });
      EventDispatcher.addEventListener('onVideoChangeStatusUpdated', function() {
        clearCanvas();
        commentReady = videoReady = updated = false;
      });

      var update = function() {
        if (!commentReady || !videoReady || updated) return;
        updated = true;
        initCanvas();
        getComments();
        getDuration();
        if (comments.length < 1 || duration < 1) {
          return;
        }
        getHeatMap(function(map) {
          var scale = duration >= canvasWidth ? 1 : (canvasWidth / duration);
          var blockWidth = (canvasWidth / map.length) * scale;
          for (i = map.length - 1; i >= 0; i--) {
            context.fillStyle = palette[map[i]] || palette[0];
            context.beginPath();
            context.fillRect(i * scale, 0, blockWidth, canvasHeight);
          }
        });
      };

      var getComments = function() {
        comments = [];

        var list = watch.PlayerInitializer.commentPanelViewController.commentLists;
        for (var i = 0; i < list.length; i++) {
          //if (conf.debugMode) console.log(list[i].listName, list[i].comments.length);
          if (list[i].listName === 'commentlist:main' && list[i].comments.length > 0) {
            comments = list[i].comments;
            break;
          }
          var ct = list[i].comments;
          comments = (comments.length < ct.length) ? ct : comments;
        }
      };
      var getDuration = function() {
        var exp = document.getElementById('external_nicoplayer');//$('#external_nicoplayer')[0];
        duration = exp.ext_getTotalTime(); //
      };
      var initCanvas = function() {
        if (!canvas) {
          var $container = $('<div id="nicoHeatMapContainer" />');
          $container.on('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this).toggleClass('displayAlways');
            conf.setValue('heatMapDisplayMode', $this.hasClass('displayAlways') ? 'always' : 'hover');
          });
          canvas = document.createElement('canvas');
          canvas.id = 'nicoHeatMap';
          canvas.width  = canvasWidth;
          canvas.height = canvasHeight;
          $container.append(canvas);
          $('#nicoplayerContainerInner').append($container);
          context = canvas.getContext('2d');
          if (conf.heatMapDisplayMode === 'always') {
            $container.addClass('displayAlways');
          }

          initPalette();
        }
        clearCanvas();
      };
      var initPalette =  function() {
        for (var c = 0; c < 256; c++) {
          var
            r = Math.floor((c > 127) ? (c / 2 + 128) : 0),
            g = Math.floor((c > 127) ? (255 - (c - 128) * 2) : (c * 2)),
            b = Math.floor((c > 127) ? 0 : (255  - c * 2));
          palette.push('rgb(' + r + ', ' + g + ', ' + b + ')');
        }
      };
      var clearCanvas = function() {
        context.fillStyle = palette[0];
        context.beginPath();
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      };

      var getHeatMap = function(callback) {
        var map = new Array(100), i = map.length; while(i > 0) map[--i] = 0;
        var exp = $('#external_nicoplayer')[0];
        var ratio = duration > map.length ? (map.length / duration) : 1;

        for (i = comments.length - 1; i >= 0; i--) {
          var pos = comments[i].vpos , mpos = Math.min(Math.floor(pos * ratio / 1000), map.length -1);
          map[mpos]++;
        }

        var max = 0;
        for (i = map.length - 4; i >= 0; i--) max = Math.max(map[i], max); // 末尾は固まってる事があるので参考にしない
        if (max > 0) {
          var rate = 255 / max;
          for (i = map.length - 1; i >= 0; i--) {
            map[i] = Math.min(255, Math.floor(map[i] * rate));
          }
        }
        if (typeof callback === 'function') {
          callback(map);
        }
      }
    } // end of initHeatMap

    /**
     * 既存のポップアップの難点
     *
     * ・閉じる機能がなく、邪魔でも消えるまで待つしかない
     * ・消えるまでの時間が毎回違う？
     * ・クリックしたら消えるのかなと思ったらマイページに飛ばされる
     * ・Chrome以外では動画プレイヤーの上に表示できない (半透明の部分が欠ける)
     * ・￪によってプレイヤー上でフェードイン・アウトが出来ないため、まったく見えない状態から突然出現したようになる
     * ・タイマー処理がバグっていて、一個目の表示中に2個目を連続表示すると2個目がすぐ消える
     *
     *  … という所があんまりなので、パッチをあてて直す。
     *  ・Chrome以外は半透明をやめて画面外からのスライドにする
     *　・CSS3アニメーションを使う(jQueryより軽い)
     *  ・クリックでマイページに飛ぶのをやめて、クリックで消えるようにする
     *  ・マウスオーバーしてる間は引っ込まない
     *  ・消えるまでの時間を4秒に固定
     *
     *
     *  このパッチでも直らない問題
     *  ・自分が動画投稿やレビューをしたという情報がなぜか自分にも通知される
     *
     */
    function initPopupMarquee() {
      if (!conf.replacePopupMarquee) { return; }
      var
        marquee  = watch.PopupMarqueeInitializer.popupMarqueeViewController,
        itemList = marquee.itemList,
        $popup   = $('#popupMarquee'),
        $inner   = $popup.find('.popupMarqueeContent'),
        closeTimer = null,
        popupDuration = 4000;

      var
        resetCloseTimer = function() {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
        },
        setCloseTimer  = function() {
          resetCloseTimer();
          closeTimer = setTimeout(function() {
            disappear();
            closeTimer = null;
          }, popupDuration);
        },
        onData         = function(data) {
          $inner.html(data);

          $popup.removeClass('hide').removeClass('show');
          setTimeout(function() {
            $popup.removeClass('hide').addClass('show');
          }, 100)
          setCloseTimer();
        },
        disappear      = function() {
          $popup.removeClass('show');
          resetCloseTimer();
          setTimeout(function() {
            if (!$popup.hasClass('show')) $popup.addClass('hide');

            setTimeout(function() {
              itemList.next();
            }, Math.random() * 5000 + 5000);

          }, 500);
        },
        __css__ = Util.here(function() {/*
          #popupMarquee      {
            -webkit-filter: opacity(  0%); {* chrome以外はflashの上に半透明要素を置けない *}
            background: #000 !important;
            transition: -webkit-filter 0.25s ease-in,  top 0.5s ease-in,  bottom 0.5s ease-in;  display: block;
          }
          #popupMarquee.show {
            -webkit-filter: opacity(100%);
            transition: -webkit-filter 1.00s ease-out, top 0.5s ease-out, bottom 0.5s ease-out; display: block;
          }

          #popupMarquee.hide {
            opacity: 0; z-index: -1;
          }

          #popupMarquee.popupMarqueeTopRight:not(.show),    #popupMarquee.popupMarqueeTopLeft:not(.show)    { top:    -600px; }
          #popupMarquee.popupMarqueeBottomRight:not(.show), #popupMarquee.popupMarqueeBottomLeft:not(.show) { bottom: -600px; }
        */});

      addStyle(__css__, 'popupMarqueeFix');

      itemList.eventTypeListenerMap.popup = []; //itemList.removeEventListener('popup', marquee.onData);
      $popup
        .css({opacity: ''})
        .off('click').off('mouseover').off('mouseleave').off('mousemove')
        .on('mouseover', resetCloseTimer)
        .on('mouseout',    setCloseTimer)
        .on('click', disappear);

      marquee.onData    = $.proxy(onData,    marquee);
      marquee.disappear = $.proxy(disappear, marquee);
      itemList.addEventListener('popup', $.proxy(onData, marquee));
    } //

    function initOther() {
      if (conf.headerViewCounter) $('#siteHeaderInner').width($('#siteHeaderInner').width() + 200);

      initAdditionalButtons();
      initSquareThumbnail();

      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        if (name === 'squareThumbnail') {
          initSquareThumbnail();
        } else
        if (name === 'enableAutoTagContainerHeight') {
          if (newValue) { watch.TagInitializer.tagViewController.tagViewPinStatus.changeStatus(true); }
        } else
        if (name === 'enableMylistDeleteButton') {
          $('.videoExplorerBody').toggleClass('enableMylistDeleteButton', newValue);
        } else
        if (name === 'enableYukkuriPlayButton') {
          newValue ? Yukkuri.show() : Yukkuri.hide();
        } else
        if (name === 'noNicoru') {
          $('body').toggleClass('w_noNicoru', newValue);
        } else
        if (name === 'flatDesignMode') {
          $('#content').toggleClass('w_flat', newValue);
        } else
        if (name === 'compactVideoInfo') {
          $('#content, #outline').toggleClass('w_compact', newValue);
        }
      });

      if (conf.enableMylistDeleteButton) $('.videoExplorerBody').addClass('enableMylistDeleteButton');

      if (conf.noNicoru) $('body').addClass('w_noNicoru');

      if (conf.flatDesignMode) $('#content').addClass('w_flat');

      if (conf.compactVideoInfo) $('#content, #outline').addClass('w_compact');
      onWatchInfoReset(watchInfoModel);

      if (conf.enableYukkuriPlayButton) { Yukkuri.show(); }

      $('#videoHeaderMenu .searchText input').attr({'accesskey': '@', 'placeholder': '検索ワードを入力'}).on('focus', function() {
        WatchController.scrollTop(0, 400);
      });

      if (conf.debugMode) {
        watch.PopupMarqueeInitializer.popupMarqueeViewController.itemList.addEventListener('popup', function(body) {
          console.log('%c popup: ' + body, 'background: #0ff');
        });
        console.log(JSON.parse($('#watchAPIDataContainer').text()));
      }
    }

    function hideAds() {
      $('#content').removeClass('panel_ads_shown');
      $('playerBottomAd').hide();
    }

    function initTest(test) {
      var expect = test.expect;
      WatchApp.mixin(WatchItLater.test.spec, {
        testChannelVideo: function() {
          ChannelVideoList.load(function(result) {
            console.log('ChannelVideoList.load', result);
            expect(result.name).toEqual('ニコニコアプリちゃんねるの動画', 'チャンネル名');
          }, {id: '55', ownerName: 'ニコニコアプリちゃんねる'});
        },
        testNewNicoSearch: function() {
          var size = 15;
          var search = new NewNicoSearch({});
          search.load({query: 'vocaloid', size: size}, function(err, result) {
            console.log('testNewNicoSearch.load', err, result);
            expect(err).toBeNull('err === null');
            expect(result[0].dqnid)                 .toBeTruthy('先頭にdqnidが含まれる(なんの略？)');
            expect(typeof result[0].values[0].total).toEqual('number', 'ヒット件数');
            expect(result[0].values[0].service)     .toEqual('video',  '検索の種類');

            expect(result[1].type).toEqual('stats',  'type === stats'); // データの開始？

            expect(result[2].type           ).toEqual   ('hits',   'type === hits');
            expect(result[2].values         ).toBeTruthy('ヒットした内容');
            expect(result[2].values.length  ).toEqual   (size, 'sizeで指定した件数が返る');
            expect(result[2].values[0].cmsid).toBeTruthy('ヒットした内容にデータが含まれる');

            expect(result[3].type).toEqual('hits',  'type === stats'); // データの終了？
          });
        },
        testNewNicoSearchWrapperQuery: function() {
          var wrapper = new NewNicoSearchWrapper({search: {}});
          var params = {
            searchWord: 'VOCALOID',
            searchType: 'tag',
            u: '1m',
            l: 'short',
            sort: 'l',
            order: 'a',
            page: 3
          };
          var query = wrapper._buildSearchQuery(params);

          console.log(params, query);
          expect(query.query).toEqual(params.searchWord,        '検索ワードのセット');
          expect(query.from).toEqual(params.page * 32 - 32,    'ページ番号 -> fromの変換');
          expect(query.sort_by).toEqual('length_seconds', 'l -> length_seconds');
          expect(query.order).toEqual('asc',              'a -> asc');

          // TODO:
          expect(JSON.stringify(query.search).indexOf('["tags"]') >= 0).toBeTrue('タグ検索');
          var filters = JSON.stringify(query.filters);
          //console.log(filters);
          expect(query.filters.length >= 2).toBeTrue('filters.lengthが2以上');
          expect(filters.indexOf('"field":"start_time"') >= 0).toBeTrue('filtersにstart_timeが含まれる');
          expect(filters.indexOf('"field":"length_seconds"') >= 0).toBeTrue('filtersにlength_secondsが含まれる');

        },
        testNewNicoSearchWrapper: function() {
          console.log('testNewNicoSearchWrapper');
          var search = new NewNicoSearch({});
          var wrapper = new NewNicoSearchWrapper({search: search});
          wrapper.load({searchWord: 'ぬこぬこ動画', size: 100}, function(err, result) {
            console.log('testNewNicoSearchWrapper.load', err, result);
            expect(err).toBeNull('err === null');
            expect(typeof result.count).toEqual('number', '件数がnumber');
            expect(result.count > 0).toBeTrue('件数が入っている');
            expect(result.list.length).toBeTruthy('データが入っている');
            expect(result.list.length).toEqual(100, 'sizeで指定した件数が入っている');
            expect(result.list[0].type).toEqual(0, 'type === 0');
            expect(/^\d+:\d+/.test(result.list[0].length)).toBeTrue('動画長がmm:dd形式で入ってる');
          });
        },
        testNicoSearchRelatedTag: function() {
          var related = new NicoSearchRelatedTag({});
          related.load('voiceroid', function(err, result) {
            console.log('testNicoSearchRelatedTag.load', err, result);
            console.log(expect(err));
            expect(err).toBeNull('err === null');
            expect(result.type).toEqual('tags', 'type === "tags"');
            expect(result.values).toBeTruthy('データが入っている');
            expect(typeof result.values[0]._rowid).toEqual('number', 'データに_rowidが入っている');
            expect(typeof result.values[0].tag)   .toEqual('string', 'データにtagが入っている');
          });
        },
        testSearchSuggest: function() {
          var suggest = new NicoSearchSuggest({});
          suggest.load('MMD', function(err, result) {
            console.log('testSearchSuggest.load', err, result);
            console.log(expect(err));
            expect(err).toBeNull('err === null');
            expect(result.candidates).toBeTruthy('suggestの中身がある')
            expect(result.candidates.length).toBeTruthy('suggestのlengthがある')
          });
        }
      });
    }

    LocationHashParser.initialize();
    initIframe($, conf, w);
    initNews();
    initShortcutKey();
    initMouse();
    initTouch();
    initEvents();
    initSearchContent();
    initUserVideoContent();
    initUploadedVideoContent();
    initDeflistContent();
    initRightPanel($rightPanel);
    initLeftPanel($leftPanel);
    initVideoReview($, conf, w);
    initHidariue();
    initVideoCounter();
    initScreenMode();
    initPlaylist($, conf, w);
    initPageBottom($, conf, w);
    initVideoExplorer($, conf, w);
    initPageHeader($, conf, w);
    initVideoTagContainer();
    initMylist($);
    initNicoS($, conf, w);
    initOtherCss();
    initStageVideo($, conf, w);
    initHeatMap($, conf, w);
    initPopupMarquee();
    initOther();

    onWindowResize();

    if (conf.debugMode) {
      initTest(WatchItLater.test);
    }
  })(w);


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
    iframe.id = "mylist_add_frame";
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
    }, false);
    w.document.body.addEventListener('click', function(e) {
      var tagName = e.target.tagName, className = e.target.className;
      //console.log(tagName, className);
      if (tagName !== 'BUTTON' && tagName !== 'SELECT' && tagName !== 'OPTION' && className !== 'popupTagItem' && className.indexOf('mylistPopupPanel') < 0) {
        AnchorHoverPopup.hidePopup();
      }

    }, false);
    var touchInitialized = false;
    TouchEventDispatcher.onflick(function(e) {
      if (e.direction === 'right') {
        if (!touchInitialized) {
          document.getElementById('videoTagPopupContainer').className += ' w_touch';
          touchInitialized = true;
        }
      }
    }, false);
//    w.document.body.addEventListener('dblclick', function(e) {var tagName = e.target.tagName, className = e.target.className;console.log(tagName, className);});

  })(w);

  //===================================================
  //===================================================
  //===================================================


  }); // end of monkey();


  // Chromeに対応させるための処理
  // いったん<script>として追加してから実行する
  try {
    if (location.host.indexOf('localhost.') === 0 || location.host.indexOf('www.') === 0 || !this.GM_getValue || this.GM_getValue.toString().indexOf("not supported")>-1) {
      isNativeGM = false;
      var inject = document.createElement("script");
      inject.id = "monkey";
      inject.setAttribute("type", "text/javascript");
      inject.setAttribute("charset", "UTF-8");

      inject.appendChild(document.createTextNode("(" + monkey + ")(false)"));
//      inject.appendChild(document.createTextNode("try {(" + monkey + ")(false) } catch(e) { console.log(e); }"));

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

