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
// @version        1.130906b
// ==/UserScript==

/**
 * 7/25のバージョンアップに対応できていない所
 *
 * ・まだ細かい動作が不安定な感じ  なんかしっくりこない
 *
 * やりたい事・アイデア
 * ・検索画面にコミュニティ動画一覧を表示 (チャンネルより難しい。力技でなんとかする)
 * ・シークバーのサムネイルを並べて表示するやつ   (単体スクリプトのほうがよさそう)
 * ・キーワード検索/タグ検索履歴の改修
 * ・ユーザーの投稿動画一覧に「xxさんのニコレポ」という架空のマイリストフォルダを出す
 * ・動画ランキングを「ニコニコ動画さん」という架空ユーザーの公開マイリストにする
 * ・「ニコニコチャンネルさん」という架空ユーザーを作って各ジャンルの新着を架空マイリストにする
 * ・横スクロールを賢くする
 * ・お気に入りユーザーの時は「@ジャンプ」許可
 * ・軽量化
 * ・綺麗なコード
 */

// * ver 1.130906
// - 動画説明文中の動画IDに「次に再生」ボタンを追加

// * ver 1.130905
// - 本家側の仕様変更によりマイリスト外すボタンが出なくなったのを修正

// * ver 1.130903
// - 全画面モードの仕様変更に暫定対応
// - トップページのホラーっぽいのが表示されなくなっていた不具合を修正

// * ver 1.130828
// - 4列表示の改善
// - songriumも大・大画面に合わせる
// - チャンネル動画を60件まで表示するように

// * ver 1.130821
// - マイリストパネルを自動で目立たない色に
// - 不要になったコードの整理

// * ver 1.130816
// - プレイヤーの設定 →  「大画面をもっと大画面にする」追加。 大画面がモニターに合わせてもっと大きくなります。(WQHDモニターだと1080p)

// * ver 1.130813
// - 隠し機能 にシークコマンドをつけた
// - ショートカットキー「停止/再生」

// * ver 1.130812
// - マイリストの絞り込み条件に「チャンネル・コミュニティ・マイメモリーのみ」を追加
// - 隠し機能 ChromeはALT+C FirefoxはALT+SHIFT+Cでいつでもコメント入力欄
// - 検索モードの1ページに表示する件数の設定を追加

// * ver 1.130810
// - 細かな処理タイミングの調整
// - 検索モードで画面を大きくする設定の変更がリロード不要になった

// * ver 1.130809
// - マイリストの動画一覧をタイトル/説明文で絞り込み検索出来るようにした。(ランキングやとりマイでも使用可能)
// - 見ている動画が今開いているマイリストにあるかどうかをわかりやすく
// - 検索モードのコメントパネルの出し方を変更。 ホバーをやめてボタンでトグルにした
// - とりマイとマイリストのUIを統一

// * ver 1.130807
// - ニコレポの表示を修正。同じ動画はなるべくまとめる (マイリストコメント付やレビューはまとめない)
// - プレイリストの仕様変更で動かなくなった機能を対応

// * ver 1.130805b
// - コメントパネルを広くするとフルスクリーンが崩れる不具合の修正

// * ver 1.130805
// - コメントパネルを広くする機能の復活
// - 新検索β使用時、現在見ている動画の投稿者の動画だけを探す機能を追加
// - 角丸をなくす設定が無意味になったので廃止。 プレイヤーの背景色の設定を追加

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
      searchPageItemCount: 50, // 検索モードの1ページあたりの表示数
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
      replacePopupMarquee: false, //
      enableRelatedTag: true, // 関連タグを表示するかどうか
      playerTabAutoOpenNicommend: 'enable', // 終了時にニコメンドを自動で開くかどうか 'enable' 'auto' 'disable'
      autoPauseInvisibleInput: true, //
      customPlayerSize: '', //

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

      flatDesignMode: '',  // 'on' グラデーションや角丸をなくす。 7/25からQwatchがフラットデザインになったので不要になった
      playerBgStyle: '',  // ￪ の後継パラメータ 'gray' 'white' ''

      shortcutTogglePlay:         {char: 'P', shift: false, ctrl: false, alt: true,  enable: false}, // 停止/再生
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

      shortcutInvisibleInput:     {char: 'C', shift: false, ctrl: false,  alt: true, enable: true}, // 停止/再生

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
        .full_with_browser .mylistPopupPanel,   .mylistPopupPanel.black {
          background: #000; border: 0;
        }
        body.full_with_browser .mylistPopupPanel *,body .mylistPopupPanel.black.fixed * {
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
        {*background: #eee;*}
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
        position:absolute; top:0; right:0; border: 1px solid #000;
        display:none; overflow-x: visible; overflow-y: auto;
      }
      {* 右に表示する動画情報 *}
      #playerTabWrapper.sidePanel .sideVideoInfo, #playerTabWrapper.sidePanel .sideIchibaPanel, #playerTabWrapper.sidePanel .sideReviewPanel  {
        padding: 0px 0px 0 0px; width: 276px; height: 100%;
        position: absolute; top: 0; right:0;
      }
      body:not(.full_with_browser) .w_wide #playerTabWrapper .sideVideoInfo,
      body:not(.full_with_browser) .w_wide #playerTabWrapper .sideIchibaPanel,
      body:not(.full_with_browser) .w_wide #playerTabWrapper .sideReviewPanel,
      .videoExplorer #playerTabWrapper .sideVideoInfo,
      .videoExplorer #playerTabWrapper .sideIchibaPanel,
      .videoExplorer #playerTabWrapper .sideReviewPanel {
        width: 418px; z-index: 10030;
      }
      #playerTabWrapper.w_videoInfo #appliPanel, #playerTabWrapper.w_ichiba #appliPanel, #playerTabWrapper.w_review #appliPanel  {
        top: -9999px;
      }
      .sidePanel .sideVideoInfo {
        background: #f4f4f4; text-Align:   left; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%; border: 1px solid black;
      }
      .sidePanel .sideIchibaPanel, .sidePanel .sideReviewPanel  {
        background: #f4f4f4; text-Align: center; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;
      }
      .sidePanel .sideVideoInfo .sideVideoInfoInner {
        padding: 0 4px; position: relative;
      }
      .sidePanel .sideVideoInfo .videoTitleContainer {
        background: #ddd; text-align: center;  color: #000; margin: 6px 0 0;
        border: solid; border-width: 1px 1px 0; border-color: #ccc;
      }
      .sidePanel .sideVideoInfo .videoOwnerInfoContainer {
        border: solid; border-width: 0 1px 0; border-color: #ccc;
      }
      .sidePanel .sideVideoInfo .videoThumbnailContainer {
        background: #ddd; text-align: center; color: #000; margin: 0;
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
        background: #ddd; text-align: center; padding: 4px;
        border: solid; border-width: 0 1px 1px; border-color: #ccc;
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
      .sidePanel .sideVideoInfo .videoDetails a.watch{
        margin: auto 30px auto 4px;
        display:inline-block;
      }
      .sideVideoInfo .userName, .sideVideoInfo .channelName{
        display: block;
      }
      .sideVideoInfo .userIconContainer, .sideVideoInfo .channelIconContainer {
        background: #ddd; width: 100%; text-align: center; float: none;
      }
      .sidePanel .userIcon, .sidePanel .channelIcon{
        min-width: 128px; max-width: 150px; width: auto; height: auto; border: 0;
      }
      .sidePanel .sideVideoInfo .descriptionThumbnail {
        text-align: left; font-size: 90%; padding: 4px; background: #ddd; border: 1px solid #ccc;
        min-height: 60px; margin: 4px; font-weight: normal; color: black;
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
        z-index: 1000;
      }
      .full_with_browser #sidePanelTabContainer { background: #000; }
      body:not(.videoExplorer):not(.full_with_browser) #sidePanelTabContainer.left {
        background: #000 {* firefoxはこれがないと欠ける *}; right: auto; left: -375px; padding: 0; height: 27px;
                transform: rotate(-90deg);         transform-origin: 100% 0 0;
        -webkit-transform: rotate(-90deg); -webkit-transform-origin: 100% 0 0;
      }

      #leftPanelTabContainer.w_touch {
        top: -40px; height: 33px;
      }
      .sidePanel:hover #sidePanelTabContainer, .sidePanel:hover #leftPanelTabContainer {
        display: block;
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
      body:not(.videoExplorer):not(.full_with_browser) #sidePanelTabContainer.left .tab {
        display: inline-block; font-size: 13px; padding: 5px 10px 0px;
      }
      #leftPanel.videoInfo .tab.videoInfo, #leftPanel.ichiba .tab.ichiba {
        background: #f4f4f4;    border-style: outset;
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
        background: #000 !important; width: 400px; opacity: 1;
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

      .videoExplorerContent .contentItemList                 .column4 {
        text-align: center;
      }
      .videoExplorerContent .contentItemList                 .column4 .balloon {
        bottom: auto; top: 10px;
      }
      .videoExplorerContent .contentItemList                 .column4 .videoInformation>.info {
        font-size: 85%;
      }
      .videoExplorerContent .contentItemList                 .column4 .videoInformation>.info .info{
        color: #000;
      }
      .videoExplorerContent .contentItemList                 .column4 .videoInformationOuter {
        width: 100px; height: 48px; margin: auto; color: #666; text-align: left;
      }
      .videoExplorerBody .videoExplorerContent.column4 .contentItemList .item {
        height: 220px;
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
        bottom: 29px; left: 5px;
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
      #videoExplorer.w_deflist .videoExplorerBody.isMine.enableMylistDeleteButton .item:hover .deleteFromMyMylist,
      #videoExplorer.w_mylist  .videoExplorerBody.isMine.enableMylistDeleteButton .item:hover .deleteFromMyMylist
      {
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
        display: inline-block; font-size: 80%; position: absolute; top: -18px; left: 5px;
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
      #outline.noNicommend #nicommendContainer, #outline.noIchiba  #nicoIchiba, #outline.noReview  #videoReview{
        display: none;
      }
      #bottomContentTabContainer.noBottom .outer, #bottomContentTabContainer.noBottom #pageFooter {
        display: none;
      }
      #bottomContentTabContainer.noBottom #outline {
        background: #141414; padding-top: 0; padding-bottom: 35px;
      }

      #content.w_flat_gray  #playerContainerWrapper {
        background: #666;
      }
      #content.w_flat_white #playerContainerWrapper {
        background: #f4f4f4;
      }
      #content #playlist .playlistInformation {
        background: #444;
      }
      #content #videoExplorerExpand a {
        text-shadow: none;
      }
      body:not(.full_with_browser) #content.w_compact #videoHeader {
        width: 960px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact #videoHeader {
        width: 1186px;
      }
      body:not(.full_with_browser) #content.w_compact.w_wide #videoHeader {
        width: 1100px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact.w_wide #videoHeader {
        width: 1326px;
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
      #content.w_compact        #topVideoInfo .videoDescription.description {
        background: #fff; margin: 10px 0 0;padding: 4px ;width: 952px; {*font-size: 90%;*}
      }
      body:not(.full_with_browser) #content.w_compact.w_wide #topVideoInfo .videoDescription.description {
        width: 1192px;
      }
      .size_normal #content.w_compact        #videoDetailInformation .description {
        width: 1178px;
      }
      body:not(.full_with_browser) .size_normal #content.w_compact.w_wide #videoDetailInformation .description {
        width: 1318px;
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
      body:not(.full_with_browser) #content.w_compact        #videoTagContainer{
        width: 900px;
      }
      body:not(.full_with_browser) #content.w_compact.w_wide #videoTagContainer{
        width: 1040px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact        #videoTagContainer{
        width: 1123px;
      }
      body:not(.full_with_browser).size_normal #content.w_compact.w_wide #videoTagContainer{
        width: 1263px;
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


      body.full_with_browser #playerTabWrapper, body.full_with_browser:not(.videoExplorer) .w_wide #playerTabWrapper {
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
      body.full_with_browser.w_fullScreenMenu #videoTagContainer { width: 100%; display: block; }

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

      .sideVideoInfo .nextPlayButton {
        position: absolute;
        margin-top: -6px;
        margin-left: -30px;
        width: 30px;
        height: 30px;
        background: url(http://res.nimg.jp/img/watch_zero/icon_nextplay.png);
        z-index: 100;
        cursor: pointer;
        text-indent: -999em;
        overflow: hidden;
        display: inline-block;
        -webkit-transform: scale(1.0); transform: scale(1.0);
      }

      .nextPlayButton {
        -webkit-transform: scale(1.5); transform: scale(1.5);
        transition: transform 0.1s ease; -webkit-transition: -webkit-transform 0.1s ease;
      }
      .sideVideoInfo .nextPlayButton:hover {
        -webkit-transform: scale(1.5); transform: scale(1.5);
      }
      .nextPlayButton:active, .sideVideoInfo .nextPlayButton:active {
        -webkit-transform: scale(1.2); transform: scale(1.2);
      }

      .sideVideoInfo .nextPlayButton:active {
        background-position-y: 30px;
      }
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

  var ConfigPanel = (function($, conf, w) {
    var pt = function(){};
    var $panel = null, $shadow = null;
    var menus = [
      {title: '再生開始・終了時の設定', className: 'videoStart'},
      {title: '自動で全画面モードにする', varName: 'autoBrowserFull',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: '自動全画面化オンでも、ユーザーニコ割のある動画は', varName: 'disableAutoBrowserFullIfNicowari',
        values: {'全画面化しない': true, '全画面化する': false}},
      {title: '自動で検索モードにする(自動全画面化オフ時)', varName: 'autoOpenSearch',
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
      {title: 'コメントパネルを広くする', varName: 'wideCommentPanel',
        values: {'する': true, 'しない': false}},
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
      {title: 'プレイヤーの背景', varName: 'playerBgStyle',
        values: {'白': 'white', 'グレー': 'gray', '標準': ''}},
      {title: 'コメントの盛り上がりをグラフ表示', varName: 'enableHeatMap', reload: true,
        description: '動画のどのあたりが盛り上がっているのか、わかりやすくなります',
        values: {'する': true, 'しない': false}},
      {title: '大画面をもっと大画面にする', varName: 'customPlayerSize',
        description: '※有効にするとニコニコニュースが表示できなくなります。',
        values: {'フルHD': '1080p', '720p': '720p',  '自動調整(推奨)': 'auto', 'しない': ''}},
      {title: 'プレイリスト消えないモード(実験中)', varName: 'storagePlaylistMode', reload: true,
        description: '有効にすると、リロードしてもプレイリストが消えなくなります。',
        values:
          (conf.debugMode ?
            {'ウィンドウを閉じるまで': 'sessionStorage', 'ずっと保持': 'localStorage', 'しない': ''} :
            {'有効(ウィンドウを閉じるまで)': 'sessionStorage', '無効': ''})
      },

      {title: '検索モードの設定', className: 'videoExplorer'},
      {title: 'プレイヤーをできるだけ大きくする (コメントやシークも可能にする)', varName: 'videoExplorerHack',
        description: '便利ですがちょっと重いです。\n大きめのモニターだと快適ですが、小さいといまいちかも',
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りタグを表示', varName: 'enableFavTags',
        values: {'する': true, 'しない': false}},
      {title: 'お気に入りマイリストを表示', varName: 'enableFavMylists',
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
      {title: '1ページの表示件数', varName: 'searchPageItemCount',
        values: {'100件': 100, '50件': 50, '32件': 32}},

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
//      {title: '背景のグラデーションをなくす', varName: 'flatDesignMode',
//        description: '軽い表示になります',
//        values: {'なくす': 'on', 'なくさない': ''}},
      {title: '「ニコる」をなくす', varName: 'noNicoru',
        description: '画面上から見えなくなります。',
        values: {'なくす': true, 'なくさない': false}},

      {title: 'その他の設定', className: 'otherSetting'},
      {title: '動画リンクにカーソルを重ねたらメニューを表示', varName: 'enableHoverPopup', reload: true,
        description: 'マウスカーソルを重ねた時に出るのが邪魔な人はオフにしてください',
        values: {'する': true, 'しない': false}},
      {title: '動画リンクにカーソルを重ねてからメニューが出るまでの時間(秒)', varName: 'hoverMenuDelay',
       type: 'text', description: '単位は秒。 標準は0.4です'},
      {title: 'ニコレポのポップアップを置き換える',       varName: 'replacePopupMarquee', reload: true,
        description: '画面隅に出るポップアップの不可解な挙動を調整します',
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
      {title: '停止/再生',                            varName: 'shortcutTogglePlay',        type: 'keyInput'},
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

      {title: 'その他2(一発ネタ系)', description: 'いつのまにか消えるかもしれません', className: 'shortcut'},
      {title: 'てれびちゃんメニュー内にランダム画像(左上)表示', varName: 'hidariue',
        values: {'する': true, 'しない': false}},
      {title: 'ゆっくり再生(スロー再生)ボタンを表示', varName: 'enableYukkuriPlayButton',
        values: {'する': true, 'しない': false}},

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
      $('body').append($shadow).append($panel);
      setTimeout(function() {
        $shadow.addClass('open'); $panel.addClass('open');
      }, 50);
      setTimeout(function() {
        if (WatchController.isFullScreen()) {
          pt.toggleOpenSection('fullScreen', true);
        } else
        if (WatchController.isSearchMode()) {
          pt.toggleOpenSection('videoExplorer', true);
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
  })(w.jQuery, conf, w);


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
      },
      open: function() {
        ConfigPanel.open();
      }
    },
    debug: {},
    init: {},
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
        var def = (new $.Deferred()), promise = def.promise();
        var con = function(name) {
          return function() {
            var d = new $.Deferred;
            setTimeout(function() {
              console.log('%c RUN: ' + name, 'background: #8ff;');
              d.resolve();
            }, 100);
            return d.promise();
          };
        };
        var wrap = function(self, name) {
          return function() {
            var d = new $.Deferred;
            setTimeout(function() {
              try {
              $.proxy(self.spec[name], self)(d);
              } catch (e) {
                console.log(e);
                d.reject();
              }
            }, 0);
            return d.promise();
          };
        };
        var onFail = function(e) {
          console.log('%c fail : ','background: red;', e);
        };

        if (name) {
          promise = promise.pipe(con(name)).pipe(wrap(this, name), onFail);
        } else {
          for(var v in this.spec) {
            if (!v.match(/^test/)) continue;
            promise = promise.pipe(con(v)) .pipe(wrap(this,    v), onFail);
          }
        }
        promise.pipe(
          function() { console.log('%cテスト完了', 'background: #8ff'); },
          function() { console.log('%cテスト失敗', 'background: #f00'); }
        );
        def.resolve();
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
      if (conf.debugMode) console.log('%cevent:', 'background: blue; color: white;', name);//, arguments);
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
        popup.addEventListener('click', createPopupOnClick(), false);
        return popup;
      }

      function createPopupOnClick() {
        return function(e) {
          if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey || e.target.className === 'icon' || e.target.tagName === 'A') {
            return;
          }
          this.style.display = 'none';
          e.preventDefault();
          e.stopPropagation();
        };
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
          var a = $(dom).clone().css({marginRight: '8px', fontSize: '80%'}).click(Util.Closure.openNicoSearch(text));
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
        a.addEventListener('click', createItemOnClick(text, dic), false);
        li.appendChild(a);

        return li;
      }

      function createItemOnClick(text, dic) {
        return function(e) {
          if (e.button !== 0 || e.metaKey) return;
          if (w.WatchApp) {
            WatchController.nicoSearch(text);
            e.preventDefault();
            appendTagHistory(this, text, dic);
          }
          return false;
        };
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
              onInitialized[i](mylistlist.concat());
            }
          }
        }
      });
      this.reloadDefList();
    };

    pt.loadMylistList = function(callback) {
      if (initialized) {
          setTimeout(function() { callback(mylistlist.concat()); }, 0);
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
        setTimeout(function() {callback(mylistItems[groupId]); }, 0);
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


    pt.findDefMylistByWatchId = function(watchId) {
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
      var item = this.findDefMylistByWatchId(watchId);
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
            self.clearMylistCache(groupId);
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

    pt.updateMylistItem = function(watchId, groupId, callback, description) {
      var self = this;
      this.loadMylist(groupId, function() {
        var item = self.findMylistByWatchId(watchId, groupId);
        if (!item) {
          Popup.alert('マイリスト中に該当する動画がみつかりませんでした');
          return;
        }
        var
          itemId = item.item_id,
          url = 'http://' + host + '/api/mylist/update',
          data = ['item_id=', itemId,
                  '&group_id=', groupId,
                  '&item_type=', 0, // video=0 seiga=5
                  '&description=', (typeof description === 'string') ? encodeURIComponent(description) : '',
                  '&token=', token
          ].join(''),
          req = {
            method: 'POST',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: url,
            onload: function(resp) {
              var result = JSON.parse(resp.responseText);
              if (typeof callback === "function") callback(result.status, result);
              dispatchEvent('mylistUpdate', {action: 'update', groupId: groupId, watchId: watchId});
            },
            error: function() {
              Popup.alert('ネットワークエラー');
            }
          };

        GM_xmlhttpRequest(req);
      });
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
          if (self.findDefMylistByWatchId(w)) {
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
  WatchItLater.Mylist = Mylist;


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
//            e.className !== "itemEcoLink" &&
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
//            e.className !== "itemEcoLink" &&
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
    var WatchApp = w.WatchApp, _false = function() { return false; };
    if (!w.WatchApp) return {
      isZeroWatch:  _false,
      isQWatch:     _false,
      isFullScreen: _false,
      isSearchMode: _false
    };
    var
      watch          = (WatchApp && WatchApp.ns.init) || {},
      watchInfoModel = (watch.CommonModelInitializer && watch.CommonModelInitializer.watchInfoModel) || {},
      nicoPlayer     = (watch.PlayerInitializer && watch.PlayerInitializer.nicoPlayerConnector) || {},
      videoExplorerController = watch.VideoExplorerInitializer.videoExplorerController,
      videoExplorer           = videoExplorerController.getVideoExplorer(),
      videoExplorerContentType = WatchApp.ns.components.videoexplorer.model.ContentType,
      $ = w.$, WatchJsApi = w.WatchJsApi;
    //  var flashVars = pim.playerInitializeModel.flashVars;
    return {
      isZeroWatch: function() {
        return (WatchApp && WatchJsApi) ? true : false;
      },
      isQwatch: function() {
        return this.isZeroWatch();
      },
      getWatchInfoModel: function() {
        return watchInfoModel;
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
          watch.VideoExplorerInitializer.mylistVideoAPILoader._cache.deleteElement(
            'http://riapi.nicovideo.jp/api/watch/mylistvideo?id=' + id.toString()
          );
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
      isPlaying: function() {
        var status = $("#external_nicoplayer")[0].ext_getStatus();
        return status === 'playing';
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
      getWatchId: function() {// スレッドIDだったりsmXXXXだったり
        return watchInfoModel.v;
      },
      getVideoId: function() {// smXXXXXX, soXXXXX など
        return watchInfoModel.id;
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
        var isAutoPlay = playlist.isContinuous();//.isAutoPlay();
        playlist.reset(
          items,
          playlist.type,
          playlist.option
        );
        if (currentItem) { playlist.playingItem = currentItem; }
        else { playlist.playingItem = items[0]; }
        if (!isAutoPlay) { // 本家側の更新でリセット時に勝手に自動再生がONになるようになったので、リセット前の状態を復元する
          playlist.disableContinuous();
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
      insertVideoToPlaylist: function(id) {
        WatchItLater.VideoInfoLoader.load(id).pipe(function(info) {
            var item = new WatchApp.ns.model.playlist.PlaylistItem(info);
            watch.PlaylistInitializer.playlist.insertNextPlayingItem(item);
          }, function(err) {
            Popup.alert(err.message);
          });
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
      getOwnerPage: function() {
        try {
          if (this.isChannelVideo()) {
            return $('#ch_prof').find('.symbol').attr('href');
          } else {
            return '/user/' + this.getOwnerId();
          }
        } catch (e) {
          return '';
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
      isVideoPublic: function() { // 投稿動画一覧を公開しているか？ 公開マイリストがあるかどうかとは別なのでややこしい
        return this.isChannelVideo() ? true : watchInfoModel.uploaderInfo.isUserVideoPublic;
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
          page:       this.getOwnerPage(),
          isFavorite: this.isFavoriteOwner(),
          isVideoPublic: this.isVideoPublic()
        };
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
        return $('#nicommendList').find('.content').length         < 1;
      },
      isIchibaEmpty: function() {
        return $('#ichibaMain')   .find('.ichiba_mainitem').length < 1;
      },
      postComment: function(comment, command) {
        comment = $.trim(comment);
        if (comment.length <= 0) { return; }
        if (!command) { command = ''; }

        setTimeout(function() {
          try {
            var exp = w.document.getElementById('external_nicoplayer');
            if (conf.debugMode) console.log('postComment: ', [comment, command]);
            if (!exp.externalPostChat(comment, command)) {
              Popup.alert('コメント投稿に失敗しました');
            }
          } catch(e) {
            Popup.alert('コメント投稿に失敗しました');
          }
        }, 0);
      }
    };
  })(w); // end WatchController
  WatchItLater.WatchController = WatchController;

  var Util = (function(WatchItLater, WatchController) {
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
    var Browser = {
      isWebkit: function() {
        return navigator.userAgent.toLowerCase().indexOf('webkit') >= 0;
      },
      isFx: function() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
      }
    };
    var
      isMetaKey = function(e) {
        if (e.button !== 0 || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) { return true; }
        return false;
      },
      prevent = function(e) {
        e.preventDefault(); e.stopPropagation();
      };

    var Closure = {
      openVideoOwnersVideo: function() {
        return function(e) {
          if (isMetaKey(e)) { return; }
          prevent(e);
          WatchController.openVideoOwnersVideo();
        };
      },
      openVideoOwnersNicorepo: function() {
        return function(e) {
          if (isMetaKey(e)) { return; }
          prevent(e);
          WatchController.showMylist(NicorepoVideo.REPO_OWNER);
        };
      },
      openDefMylist: function() {
        return function(e) {
          if (isMetaKey(e)) { return; }
          prevent(e);
          WatchController.showDefMylist();
        };
      },
      openMylist: function(id) {
        return function(e) {
          if (isMetaKey(e)) { return; }
          prevent(e);
          WatchController.showMylist(id);
        };
      },
      openNicoSearch: function(word, type) {
        return function(e) {
          if (isMetaKey(e)) { return; }
          if (WatchController.isZeroWatch()) {
            prevent(e);
            WatchController.nicoSearch(word, type);
          }
        };
      },
      seekVideo: function(vpos) {
        return function(e) {
          if (isMetaKey(e)) { return; }
          prevent(e);
          WatchController.vpos(vpos);
        };
      },
      showLargeThumbnail: function(url) {
        return function() {
          WatchController.showLargeThumbnail(url);
        };
      }
    };
    var Deferred = {
      wait: function(msec) {
       return function() {
          var args = Array.prototype.slice.call(arguments, 0);
          var d = new $.Deferred();
          setTimeout(function() {
            d.resolve.apply(d, args);
          }, msec);
          return d.promise();
        };
      }
    };


    var self = {
      Cache: Cache,
      Closure: Closure,
      Deferred: Deferred,
      Browser: Browser,
      here: function(func) { // えせヒアドキュメント
        return func.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
      }
    };
    return self;
  })(WatchItLater, WatchController);
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
      this.mylist_comment    = info.mylist_comment || '';
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
          var data;
          try {
            var lines = result.responseText.split('\n'), head = JSON.parse(lines[0]);
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
            var item = items[i], description = item.description ? item.description.replace(/<.*?>/g, '') : '';
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
              description_short: description.substr(0, 150),
              description_full:  description,
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
        throw new Error('wordが設定されてない！');
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


  var VideoInfoLoader = function() { this.initialize.apply(this, arguments); };
  VideoInfoLoader.BASE_URL = "http://riapi.nicovideo.jp/api/search/tag";
  VideoInfoLoader.prototype = {
    initialize: function(params) {
    },
    load: function(id, callback) {
      var def = new $.Deferred;

      var cache_key = JSON.stringify({'VideoInfoLoaderCache': id}), cacheData = Util.Cache.get(cache_key);
      if (cacheData) {
        return def.resolve(cacheData);
      }

      if (id.toString().match(/^\d+$/)) { // watchId
        WatchApp.ns.init.PlaylistInitializer.videoInfoAPILoader.load(
          [id],
          function(err, resp) {
            if (err !== null) {
              return def.reject({message: '通信に失敗しました(1)', status: 'fail'});
            }
            if (resp.items && resp.items[id] && resp.items[id].id) {
              if (typeof callback === 'function') { callback(null, resp.items[id]); }
              return def.resolve(Util.Cache.set(cache_key, resp.items[id]));
            }
            var err = {message: '動画が見つかりませんでした(1): ' + id, status: 'fail'};
            if (typeof callback === 'function') { callback(err, null); }
            return def.reject(err);
          }
        );
        return def.promise();
      }

      WatchApp.ns.util.HTTPUtil.loadXDomainAPI({ // videoId
        url: VideoInfoLoader.BASE_URL,
        type: 'GET',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        data: {
          words: 'watch/' + id,
          sort: 'f',
          order: 'd',
          page: '1',
          mode: 'watch'
        },
        success: function(result) {
          if (result.suggest_video && result.suggest_video.id) {
            if (typeof callback === 'function') { callback(null, result.suggest_video); }
            def.resolve(Util.Cache.set(cache_key, result.suggest_video));
          } else {
            var err = {message: '動画が見つかりませんでした(2): ' + id, status: 'fail'};
            if (typeof callback === 'function') { callback(err, null); }
            def.reject(err);
          }
        },
        error: function(resp) {
          var err = {message: '通信に失敗しました(2)', status: 'fail'};
          if (typeof callback === 'function') { callback(err, null); }
          def.reject(err);
        }
      });
      return def.promise();
    }
  };
  WatchItLater.VideoInfoLoader = new VideoInfoLoader({});

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
    if (!WatchController.isZeroWatch()) return {};

    var CACHE_TIME = 1000 * 60 * 10;
    var WatchApp = w.WatchApp, escapeHTML = WatchApp.ns.util.StringUtil.escapeHTML;

    var getNicorepoTitle = function(type, param) {
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
    };

    var parseItemList = function($dom) {
      var $list = $dom.find('.timeline');
      return $list.find([
        '.log-user-mylist-add',
        '.log-user-uad-advertise',
        '.log-user-video-upload',
        '.log-user-video-review',
        '.log-mylist-added-video',
        '.log-community-video-upload',
        '.log-user-video-round-number-of-view-counter',
        '.log-user-video-round-number-of-mylist-counter'
      ].join(', '));
    };

    var ownerReg = /\/(community|user|channel)\/((co|ch)?\d+)\??/;
    var parseNicorepoItem = function(src) {
      var
        $item = $(src), $title = $item.find('.log-content .log-target-info a'),
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
      if (src.className === 'log-mylist-added-video') {
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
          nicorepo_className: src.className,
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
      return item;
    };

    var loadPage = function(baseUrl, result, nextLink, type) {
      var def = new $.Deferred;
      if (nextLink === null) {
        return def.resolve(baseUrl, result, null, null);
      }
      var url = baseUrl;
      if (type === 'offset') {
        url += nextLink ? ('&offset='        + nextLink) : '';
      } else {
        url += nextLink ? ('&last_timeline=' + nextLink) : '';
      }
      if (conf.debugMode) console.log('load Url=', url);

      $.ajax({
        url: url,
      }).then(
        function(resp) {
          var $dom = $(resp),
            $nextPageLink = $dom.find('.next-page-link'),
            hasNextPage = $nextPageLink.length > 0;

          parseItemList($dom).each(function() {
            result.push(parseNicorepoItem(this));
          });

          var nextLinkReg = /(last_timeline|offset)=(\d+)/;
          if (hasNextPage) {
            var href = $nextPageLink.attr('href');
            if (nextLinkReg.test(href)) {
              def.resolve(baseUrl, result, RegExp.$2, RegExp.$1);
            } else {
              def.resolve(baseUrl, result, null, null);
            }
          } else {
             def.resolve(baseUrl, result, null, null);
          }
        },
        function() {
          def.reject();
        });

      return def.promise();
    };

    var pipeRequest = function(baseUrl, result, maxPages, callback) {
      var def = new $.Deferred, p = def.promise();

      for (var i = maxPages; i >= 0; i--) {
        p = p.pipe(loadPage);
        if (i > 0) p = p.pipe(Util.Deferred.wait(300));
      }

      p.pipe(
        function() {
          var uniq = {}, uniq_items = [];
          for (var i = result.rawData.list.length - 1; i >= 0; i--) {
            var item = result.rawData.list[i], id = item.id, mc = item.mylist_comment;
            if (uniq[id + mc]) {
              uniq[id + mc]._info.nicorepo_log.push(item.first_retrieve + '　' + item._info.nicorepo_log[0].replace(/^.*?さん(の|が)動画(が|を) ?/, ''));
            } else {
              uniq[id + mc] = item;
            }
          }
          for (var v in uniq) {
            uniq_items.unshift(uniq[v]);
          }
          result.rawData.list = uniq_items;
          callback(result);
        }
      );
      def.resolve(baseUrl, result, '', '');

    };

    var request = function(param) {
      var url, nickname, userId, type, baseUrl;
      var def = new $.Deferred;
      try {
          url      = '';
          nickname = param.nickname || WatchController.getMyNick();
          userId   = param.userId   || WatchController.getMyUserId();
          type     = param.type     || 'user';
          baseUrl  = '/my/top/' + type + '?innerPage=1&mode=next_page';
          if (param.userId) {
            baseUrl = '/user/'+ param.userId +'/top?innerPage=1&mode=next_page';
          }
      } catch (e) {
        if (conf.debugMode) console.log(e);
        return def.reject({message: 'エラーが発生しました', status: 'fail'});
      }

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        return def.resolve(cacheData);
      }

      var
        result = new DummyMylist({
          id: '-10',
          sort: '1',
          default_sort: '1',
          name: getNicorepoTitle(type, param),
          user_id:       type === 'owner' ? WatchController.getOwnerId()   : userId,
          user_nickname: type === 'owner' ? WatchController.getOwnerName() : nickname
        });

      pipeRequest(baseUrl, result, 2, function(result) {
        def.resolve(Util.Cache.set(baseUrl, result, CACHE_TIME));
      });

      return def.promise();
    };

    var load = function(callback, param) {
      return request(param)
        .pipe(function(result) {
          var viewPage = (param && typeof param.page === 'number') ? param.page : 1;
          result.sortItem(param.sort || 1, true);
          result.setPage(viewPage);
          if (typeof result === 'function') { callback(result); }
          return this.resolve(result);
        }, function() {
          return this.reject({message: 'ニコレポの取得に失敗しました', status: 'fail'});
        });
    };

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
        return self.load(callback, p);
      },
      loadUser:   function(callback, p) {
        p = p || {};
        p.type = 'user';
        return self.load(callback, p);
      },
      loadChCom:  function(callback, p) {
        p = p || {};
        p.type = 'chcom';
        return self.load(callback, p);
      },
      loadMylist: function(callback, p) {
        p = p || {};
        p.type = 'mylist';
        return self.load(callback, p);
      },
      loadOwner: function(callback, p) {
        p = p || {};
        p.type = 'owner';
        p.userId = WatchController.getOwnerId();
        return self.load(callback, p);
      }
    };
    WatchItLater.NicorepoVideo = self;

    return self;
  })(w, Util);



  /**
   *  ランキングのRSSをマイリストAPIと互換のある形式に変換することで、ダミーマイリストとして表示してしまう作戦
   */
  var VideoRanking = (function(w, Util) {
    if (!WatchController.isZeroWatch()) return {};
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
    var rss2mylist = function(xml) {
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
    };

    var parseRssItem = function($item) {
      var
        desc_cdata = $item.find('description').text(),
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
    };

    var pipeRequest = function(baseUrl, result, page, maxPage) {
      var def = new $.Deferred, p = def.promise();

      var getPipe = function(result, url, page) {
        return function() {
          if (conf.debugMode) console.log('load RSS', url, page);
          return $.ajax({
              url: url,
              data: {rss: '2.0', lang: 'ja-jp', page: page},
              beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
              }
            }).pipe(function(resp) {
              var res = rss2mylist(resp);
              for (var i = 0, len = res.rawData.list.length; i < len; i++) {
                result.push(res.rawData.list[i]);
              }
            });
        };
      };

      for (var i = page; i <= maxPage; i++) {
        p = p.pipe(getPipe(result, baseUrl, i));
        if (i < maxPage) { p = p.pipe(Util.Deferred.wait(300)); }
      }

      def.resolve();

      return p;
    };

    var CACHE_TIME = 1000 * 60 * 30;
    var request = function(baseUrl, page, maxPage) {
      var def = new $.Deferred;
      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        return def.resolve(cacheData);
      }

      var result = new DummyMylist({
        name: '総合ランキング',
        id: '-100'
      });

      pipeRequest(baseUrl, result, page, maxPage).pipe(
        function() {
          def.resolve(Util.Cache.set(baseUrl, result, CACHE_TIME));
        },
        function() {
          def.reject();
        });

      return def.promise();
    };

    var parseParam = function(param) {
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
        baseUrl:
          '/ranking/'+ type +'/'+ term + '/'+ category //+'?rss=2.0&lang=' + lang
      };
    };

    var loadRanking = function(param) {
      var p = parseParam(param);
      return request(p.baseUrl, 1, p.maxRssPage)
        .pipe(function(result) {
          result.name = p.genreName;
          result.setPage(p.viewPage);

          this.resolve(result);
        });
    };

    var load = function(onload, param) {
      var p = parseParam(param);
      return request(p.baseUrl, 1, p.maxRssPage)
        .pipe(function(result) {
          result.name = p.genreName;
          result.setPage(p.viewPage);

          if (typeof onload === 'function') {
            onload(result);
          }
          return this.resolve(result);
        }, function() {
          return this.reject({message: 'ランキングの取得に失敗しました', status: 'fail'});
        });
    };

    var getTermId = function(t) {
      if (typeof t === 'string') {
        return termIdTable[t] || 0;
      } else
      if (typeof t === 'number'){
        return (t - (t % 1000)) % 10000;
      }
      return 0;
    };
    var getGenreId = function(g, term) {
      if (typeof g === 'string') {
        return (genreIdTable[g] || 0) + getTermId(term);
      } else
      if (typeof g === 'number'){
        return g % 1000;
      } else {
        return genreIdTable;
      }
    };
    var getGenreName = function(g) {
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
    };
    var getCategory = function(g) {
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
    };

    var self = {
      load: load,
      getTermId: getTermId,
      getGenreId: getGenreId,
      getGenreName: getGenreName,
      getCategory: getCategory
    };
    WatchItLater.VideoRanking = self;
    return self;
  })(w, Util);



  /**
   *  チャンネル動画一覧をマイリストAPIと互換のある形式で返すことで、ダミーマイリストとして表示してしまう作戦
   */
  var ChannelVideoList = (function(w, Util){
    if (!WatchController.isZeroWatch()) return {};
    var
      CACHE_TIME = 1000 * 60 * 1, MAX_PAGE = 3,
      getPipe = function(baseUrl, result, page) {
        return function(hasPage) {
          var def = new $.Deferred;
          if (!hasPage) return def.resolve(hasPage);
          var url = baseUrl + '?page=' + page;
          if (conf.debugMode) console.log('load page', url);

          $.ajax({url: url}).pipe(function(resp) {
            var hasNextPage = parseItems(resp, result);
            def.resolve(hasNextPage);
          }, function(err) {
            def.reject(err);
          });
          return def.promise();
        };
      },
      pipeRequest = function(baseUrl, result) {
        var def = new $.Deferred, p = def.promise();

        var maxPage = MAX_PAGE;
        for (var i = 1; i <= maxPage; i++) {
          p = p.pipe(getPipe(baseUrl, result, i));
          if (i < maxPage) { p = p.pipe(Util.Deferred.wait(300)); }
        }

        p.pipe(function() {
          this.resolve(result);
        });

        def.resolve(true);
        return p;
      },
      load = function(callback, params) {
        var myId, url, id, ownerName, def = new $.Deferred;
        try{
          id = params.id.toString().replace(/^ch/, '');
          ownerName = params.ownerName;
          url = 'http://ch.nicovideo.jp/channel/ch'+ id + '/video';
          myId = WatchController.getMyUserId();
        } catch (e) {
          if (conf.debugMode) console.log(e);
          throw { message: 'エラーが発生しました', status: 'fail'};
        }

        var CACHE_KEY = 'ch-' + id, cacheData = Util.Cache.get(CACHE_KEY);
        if (cacheData) {
          if (typeof callback === 'function') {
            setTimeout(function() { callback(cacheData); } , 0);
          }
          return def.resolve(cacheData);
        }


        var result = new DummyMylist({
          id: 'ch' + id,
          sort: '1',
          name: ownerName + 'の動画',
          user_id: myId,
          user_name: 'ニコニコ動画'
        });

        pipeRequest(url, result).pipe(function() {
          Util.Cache.set(CACHE_KEY, result, CACHE_TIME);
          if (typeof callback === 'function') callback(result);
          def.resolve(result);
        });

        return def.promise();
      },
      parseItems = function(html, result) {
        var $html = $(html), $list = $html.find('.contents_list .item');
        var hasNextPage = false;
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
        if ($html.find('.pager .next:not(.disabled)').length > 0) {
          hasNextPage = true;
        }
        return hasNextPage;
      },
      loadOwnerVideo = function(callback) {
        if (!WatchController.isChannelVideo()) {
          throw {message: 'チャンネル情報の取得に失敗しました', status: 'fail'};
        }
        var params = {
          id: WatchController.getOwnerId(),
          ownerName: WatchController.getOwnerName()
        };
        var def = new $.Deferred;
        load(callback, params).pipe(function(result) {
            if (typeof callback === 'function') callback(result);
            def.resolve(result);
          }, function() {
            def.reject({message: 'チャンネル動画の取得に失敗しました', status: 'fail'});
          });
        return def.promise();
      };

    var self = {
      load: load,
      loadOwnerVideo: loadOwnerVideo
    };
    WatchItLater.ChannelVideo = self;
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
      WatchApp = w.WatchApp, WatchJsApi = w.WatchJsApi,
      isTouchActive = false,
      watch = WatchApp.ns.init,
      tagv  = watch.TagInitializer.tagViewController,
      pim   = watch.PlayerInitializer.playerInitializeModel,
      npc   = watch.PlayerInitializer.nicoPlayerConnector,
      pac   = watch.PlayerInitializer.playerAreaConnector,
      vs    = watch.VideoExplorerInitializer.videoExplorerController.getVideoExplorer(),
      videoExplorer  = vs,
      watchInfoModel = WatchApp.ns.model.WatchInfoModel.getInstance();


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

    function onWindowResizeEnd() {
      setTimeout(function() {
        EventDispatcher.dispatch('onWindowResizeEnd');
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
    WatchController.openIchibaSearch = ichibaSearch;

    function initVideoCounter() {
      var
        playerAreaConnector = watch.PlayerInitializer.playerAreaConnector,
        counter = {mylistCount: 0, viewCount: 0, commentCount: 0},
        blinkItem = function($elm) {
          $elm.removeClass('animateBlink').addClass('blink');
          setTimeout(function() {
            $elm.addClass('animateBlink').removeClass('blink');
            $elm = null;
          }, 500);
        };
      var setVideoCounter = function(watchId, title) {
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
                .text(WatchApp.ns.util.StringUtil.unescapeHTML(title))
                .attr('href', 'http://nico.ms/' + watchId)
              )
              .html() +
            '<br/><span style="margin-left:10px; font-size: 90%;">'+ $tpl.html() + '</span>'
          );
        }
        $('#trueBrowserFullShield').html([
          '<img class="ownerIcon" src="', WatchController.getOwnerIcon(), '">',
          '<div class="title">', title, '</div>',
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
      };

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

      EventDispatcher.addEventListener('onWatchInfoReset', function(watchInfoModel){
        counter.mylistCount  = watchInfoModel.mylistCount;
        counter.viewCount    = watchInfoModel.viewCount;
        counter.commentCount = watchInfoModel.commentCount;

        setVideoCounter(watchInfoModel.v, watchInfoModel.title);
      });
      EventDispatcher.addEventListener('onVideoCountUpdated', function(c, type, diff) {
        var $target = $('.sidePanel .videoInfo, #trueBrowserFullShield, #videoCounter');
        assignVideoCountToDom($target, c);
        $target.find('.' + type + 'Diff').text(diff).toggleClass('down', diff < 0);
        blinkItem($target.find('.' + type + ', .' + type + 'Diff'));
      });

    } //

    var isFirst = true;
    function onVideoInitialized() {
      watch = WatchApp.namespace.init;
      AnchorHoverPopup.hidePopup().updateNow();
      tagv = watch.TagInitializer.tagViewController;
      pim  = watch.PlayerInitializer.playerInitializeModel;
      WatchCounter.add();

      if (isFirst) {
        if (conf.autoPlayIfWindowActive === 'yes' && w.document.hasFocus()) {
          // ウィンドウがアクティブの時だけ自動再生する。 複数タブ開いてるときは便利
          setTimeout(function() { WatchController.play(); }, 2000);
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
    } //

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
    function initLeftPanel($, conf, w) {

      var $tab = $([
          '<ul id="leftPanelTabContainer">',
          '<li class="tab ichiba"    data-selection="ichiba"   >市場</li>',
          '<li class="tab videoInfo" data-selection="videoInfo">情報</li>',
          '</ul>'].join(''));

      var
        $sidePanel   = $('<div id="leftPanel" />').addClass('sidePanel'),
        $infoPanel   = $('<div/>').attr({'id': 'leftVideoInfo',    'class': 'sideVideoInfo   sidePanelInner'}),
        $ichibaPanel = $('<div/>').attr({'id': 'leftIchibaPanel',  'class': 'sideIchibaPanel sidePanelInner'});
      $sidePanel.append($tab).append($infoPanel).append($ichibaPanel);
      $('#playerTabWrapper').after($sidePanel);

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
        lastIchibaVideoId = '',
        resetIchiba = function(force) {
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

      EventDispatcher.addEventListener('onVideoInitialized', function() {
        sidePanelRefresh($infoPanel, $ichibaPanel, $sidePanel, $sideInfoPanelTemplate.clone());
        if ($ichibaPanel.is(':visible')) {
          resetIchiba(true);
        }
      });

    } // end of initLeftPanel

    function initRightPanel($, conf, w) {
      var $rightPanel = $('#playerTabWrapper').addClass('sidePanel');
      initRightPanelVerticalTab($rightPanel);
      initRightPanelHorizontalTab($, conf, w);
      var $playerTabWrapper = $rightPanel, wideCss = null;
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
            'body.videoExplorer #content.w_adjusted #playerTabWrapper { width: ', targetWidth,'px; }\n',
            'body:not(.full_with_browser) .w_wide #playerTabWrapper { width: ', targetWidth,'px; }\n',
            //'body:not(.videoExplorer) .w_wide #playerTabWrapper.w_wide { right: -140px;}\n'
            'body:not(.videoExplorer):not(.full_with_browser) .w_wide #playerAlignmentArea             { width: 1100px; }\n', //  960 + 140
            'body:not(.videoExplorer):not(.full_with_browser) .w_wide #playerAlignmentArea.size_normal { width: 1326px; }\n\n'  // 1186 + 140
          ];
          for (var v in elms) {
            var $e = $(elms[v]), newWidth = $e.width() + px;
            css.push([
              '.w_wide #playerTabWrapper ', elms[v],
              ' , body.videoExplorer #content.w_adjusted ',
              elms[v], '\n{ width: ', newWidth,'px !important; }\n\n'
            ].join(''));
          }
          wideCss = addStyle(css.join(''), 'wideCommentPanelCss');
          console.log(css.join(''));
        },
        toggleWide = function(v) {
          $('#content').toggleClass('w_wide', v);
          EventDispatcher.dispatch('onWindowResizeEnd');
        };

      var wideCommentPanelCss = Util.here(function() {/*
        body.videoExplorer #content.w_adjusted #playerTabWrapper { width: 420px; }
        body:not(.full_with_browser) .w_wide #playerTabWrapper   { width: 420px; }

        body:not(.videoExplorer):not(.full_with_browser) .w_wide #playerAlignmentArea             { width: 1100px; }
        body:not(.videoExplorer):not(.full_with_browser) .w_wide #playerAlignmentArea.size_normal { width: 1326px; }

        body:not(.full_with_browser) .w_wide #playerTabWrapper #playerTabWrapper,
        body.videoExplorer #content.w_adjusted #playerTabWrapper
        { width: 420px !important; }

        body:not(.full_with_browser) .w_wide #playerTabWrapper #commentDefaultHeader,
        body.videoExplorer #content.w_adjusted #commentDefaultHeader
        { width: 408px !important; }

        body:not(.full_with_browser) .w_wide #playerTabWrapper #playerCommentPanel .commentTable,
        body.videoExplorer #content.w_adjusted #playerCommentPanel .commentTable
        { width: 406px !important; }

        body:not(.full_with_browser) .w_wide #playerTabWrapper #playerCommentPanel .commentTable .commentTableContainer,
        body.videoExplorer #content.w_adjusted #playerCommentPanel .commentTable .commentTableContainer
        { width: 406px !important; }
     */});
      addStyle(wideCommentPanelCss, 'wideCommentPanelCss');

      EventDispatcher.addEventListener('on.config.wideCommentPanel', toggleWide);
      toggleWide(!!conf.wideCommentPanel);

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {

        //EventDispatcher.dispatch('onWindowResizeEnd');
        //createWideCommentPanelCss(420);

        var $div = $([
            '<div id="sharedNgSettingContainer" style="display: none;">NG共有: ',
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

    function initRightPanelHorizontalTab($, conf, w) {
      var playerTab = WatchApp.ns.init.PlayerInitializer.playerTab;
      // 終了時にニコメンドが勝手に開かなくするやつ
      // 連続再生中はニコメンドパネルが開かない事を利用する
      playerTab.playlist_org = playerTab.playlist;
      playerTab.playlist = {
        isContinuous: function() {
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
            return playerTab.playlist_org.isContinuous();
          }
        }
      };
    } //

    function initRightPanelVerticalTab($sidePanel) {
      if (!conf.rightPanelJack) { return; }

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

      EventDispatcher.addEventListener('onVideoExplorerOpening', function() {
        changeTab('w_comment');
      });
      EventDispatcher.addEventListener('onVideoExplorerClosing', function() {
        changeTab(conf.lastRightTab);
      });

      var onOuterResize = function() {
        var $body = $('body'), $right = $('#playerTabWrapper');
        if (WatchController.isSearchMode() || $body.hasClass('full_with_browser')) { return; }
        var w = $('#external_nicoplayer').outerWidth(), margin = 84;
        w += $right.is(':visible') ? $right.outerWidth() : 0;
        $('#sidePanelTabContainer').toggleClass('left', (window.innerWidth - w - margin < 0));
      };
      EventDispatcher.addEventListener('onWindowResizeEnd',           onOuterResize);
      EventDispatcher.addEventListener('onPlayerAlignmentAreaResize', onOuterResize);

      EventDispatcher.addEventListener('onVideoInitialized', function() {
        sidePanelRefresh($infoPanel, $ichibaPanel, $sidePanel, $sideInfoPanelTemplate.clone());
        if ($ichibaPanel.is(':visible')) {
          resetIchiba(true);
        }
        setTimeout(function() {
          $sidePanel.toggleClass('reviewEmpty', $('#videoReview').find('.stream').length < 1);
        }, 2000);
      });
    } // end of initRightPanelVerticalTab


    function assignVideoCountToDom($tpl, count) {
      var addComma = WatchApp.ns.util.StringUtil.addComma;
      $tpl
        .find('.viewCount'   ).text(addComma(count.viewCount   )).end()
        .find('.commentCount').text(addComma(count.commentCount)).end()
        .find('.mylistCount' ).text(addComma(count.mylistCount ));
      return $tpl;
    } //

    function sidePanelRefresh($sideInfoPanel, $ichibaPanel, $sidePanel, $template) {
      var isFavorite = WatchController.isFavoriteOwner();
      var h = $sideInfoPanel.innerHeight() - 100; //, $inner = $('<div/>');


      $template.find('.videoTitle').html(watchInfoModel.title);

      //var $videoDetails = $template.find('.videoDetails');
      //$videoDetails.css({overflowY: 'hidden', minHeight: 0});

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
              '<div class="nextPlayButton" title="次に再生" onclick="WatchItLater.WatchController.insertVideoToPlaylist(\'', $this.text(),'\')">次に再生</div>',
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
        } else
        if (url.match(/\/watch\/((sm|nm|so|)\d+)$/)) {
          $this.after([
            '<div class="nextPlayButton" title="次に再生" onclick="WatchItLater.WatchController.insertVideoToPlaylist(\'', RegExp.$1, '\')">次に再生</div>',
          ''].join(''));
        }
      });

      $videoDescription.find('.descriptionThumbnail img').on(
        'click',
        function() { showLargeThumbnail(this.src); });

      var $videoOwnerInfoContainer = $template.find('.videoOwnerInfoContainer');
      var $userIconContainer       = $template.find('.userIconContainer');
      var $channelIconContainer    = $template.find('.channelIconContainer');

      var info = WatchController.getOwnerInfo();
      if (info.type === 'channel') {
        if (info.id && info.id !== '0') {
          $channelIconContainer
            .find('.channelIcon')
              .attr({'src': info.icon}).end()
            .find('.channelIconLink')
              .attr({'href': info.page})
              .on('click', Util.Closure.openVideoOwnersVideo()).end()
            .find('.channelNameInner')
              .text(info.name).end()
            .find('.showOtherVideos')
              .attr({'href': info.page})
              .on('click', Util.Closure.openVideoOwnersVideo());
         }
        $userIconContainer.remove();
      } else {
        if (info.id && info.id !== '0') { // ユーザーが退会してたりすると情報が無いのでチェックしてから
          $userIconContainer
            .find('.userIcon')
              .attr({'src': info.icon}).end()
            .find('.userIconLink')
              .attr({'href': info.page})
              .on('click', Util.Closure.openVideoOwnersNicorepo()).end()
            .find('.userNameInner')
              .text(info.name).end()
            .find('.showOtherVideos')
              .attr({'href': info.page + '/video'})
              .on('click', Util.Closure.openVideoOwnersVideo()   ).end()
            .toggleClass('isUserVideoPublic', info.isVideoPublic);
          $channelIconContainer.remove();
        } else {
          $userIconContainer.remove();
          $channelIconContainer.remove();
        }
      }

      $sideInfoPanel.find('*').unbind();

      $sidePanel
        .toggleClass('ichibaEmpty',    WatchController.isIchibaEmpty())
        .toggleClass('nicommendEmpty', WatchController.isNicommendEmpty());

      $sideInfoPanel
        .empty()
        .scrollTop(0)
        .toggleClass('isFavorite', isFavorite)
        .toggleClass('isChannel', WatchController.isChannelVideo())
        .append($template);

      setTimeout(function() {
        $sideInfoPanel.addClass('show');
        $sideInfoPanel = $ichibaPanel = $sidePanel = $template =
        $videoDescription = $videoOwnerInfoContainer = $userIconContainer =
        $channelIconContainer = null;
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
            var mylistId = elm.textContent.split('/').reverse()[0];

            $elm.addClass('mylist').attr('target', null).on(
              'click.sideInfo', Util.Closure.openMylist(mylistId));
          } else
          if (elm.className === 'seekTime') {
            var data = $elm.attr('data-seekTime').split(":"),
                vpos = (data[0] * 60 + parseInt(data[1], 10)) * 1000;

            $elm.attr('href', location.href + '?from=' + $elm.text().substr(1)).on(
              'click.leftInfo', Util.Closure.seekVideo(vpos));
          }
        }
      });
      return $description;
    } //

    function resetSideIchibaPanel($ichibaPanel, force) {

      $ichibaPanel.scrollTop(0);
      $ichibaPanel.find('*').unbind();
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
        $ichibaPanel = null;
      });
      $footer.append($reloadIchiba);

      $inner.append($footer);
      $inner.hide();
      $ichibaPanel.append($inner);
      $inner.fadeIn();
      $inner = $header = $footer = $addIchiba = $reloadIchiba = null;
    } //

    function initHidariue() {
      var hidariue = null;
      var resetHidariue = function() {
        var dt = new Date();
        if (dt.getMonth() < 1 && dt.getDate() <=1) {
          $('#videoMenuTopList').append('<li style="position:absolute;left:300px;font-size:50%">　＼　│　／<br>　　／￣＼　　 ／￣￣￣￣￣￣￣￣￣<br>─（ ﾟ ∀ ﾟ ）＜　しんねんしんねん！<br>　　＼＿／　　 ＼＿＿＿＿＿＿＿＿＿<br>　／　│　＼</li>');
        }
        if (!conf.hidariue) { return; }
        if (!hidariue) {
          $('#videoMenuTopList').append('<li class="hidariue" style="position:absolute;top:21px;left:0px;"><a href="http://userscripts.org/scripts/show/151269" target="_blank" style="color:black;"><img id="hidariue" style="border-radius: 8px; box-shadow: 1px 1px 2px #ccc;"></a><p id="nicodou" style="padding-left: 4px; display: inline-block"><a href="http://www.nicovideo.jp/video_top" target="_top"><img src="http://res.nimg.jp/img/base/head/logo/q.png" alt="ニコニコ動画:Q"></a></p></li>');
          hidariue = $('#hidariue')[0];
        }
        hidariue.src = 'http://res.nimg.jp/img/base/head/icon/nico/' +
                (1000 + Math.floor(Math.random() * 1000)).toString().substr(1) + '.gif';
      };
      EventDispatcher.addEventListener('onVideoInitialized', resetHidariue);
    } //

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
                .click(Util.Closure.openMylist(mylist.id));
              $ul.append($li.addClass(mylist.iconType).append($a));
            }
            $ul.append($reload);
            $toggle.fadeIn(500);
          });
        }
        load();

      }, 100);
    } //


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
              .click(Util.Closure.openNicoSearch(tag.name));
            $ul.append($li.append($a));
          }
          $toggle.fadeIn(500);
        });
      }, 100);
    } //


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
                .click(Util.Closure.openDefMylist())
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
                .click(Util.Closure.openMylist(item.id))
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
              .click(Util.Closure.openMylist(mylist.id));
            $ul.append($li.append($a));
          }
          $toggle.fadeIn(500);
        });
      }, 100);
    } //

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
              .click(Util.Closure.openMylist(id));
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
    } //

    var WatchingVideoView = function() { this.initialize.apply(this, arguments); };
    WatchingVideoView.prototype = {
      _params: null,
      _$view: null,
      _watchInfoModel: null,
      _type: null,
      initialize: function(params) {
        this._content           = params.content;
        this._watchInfoModel    = params.watchInfoModel;
        this._$view             = params.$view;
        this._mylistController  = params.mylistController;
        this._type              = params.type;

        this._$title  = this._$view.find('.title');
        this._$thumb  = this._$view.find('.thumbnail');
        this._$add    = this._$view.find('.add');
        this._$remove = this._$view.find('.remove');

        this._$add   .on('click', $.proxy(this._onAddClick,    this));
        this._$remove.on('click', $.proxy(this._onRemoveClick, this));

        EventDispatcher.addEventListener('onWatchInfoReset', $.proxy(this.onVideoChange, this));
      },
      getView: function() {
        return this._$view;
      },
      detach: function() {
        this._$view.detach();
      },
      update: function() {
        $('.videoExplorerBody').toggleClass('containsWatchingVideo', this._content.containsWatchId());
      },
      onVideoChange: function() {
        this._$title.html(this._watchInfoModel.title);
        this._$thumb
          .attr('src', this._watchInfoModel.thumbnail)
          .off('click').on('click', Util.Closure.showLargeThumbnail(this._watchInfoModel.thumbnail));
        if (this._content.isActive()) {
          this.update();
        }
      },
      _setIsUpdating: function() {
        this._$view.addClass('updating');
        setTimeout($.proxy(this._clearIsUpdating, this), 3000);
      },
      _clearIsUpdating: function() {
        this._$view.removeClass('updating');
      },
      _getIsUpdating: function() {
        return this._$view.hasClass('updating');
      },
      _onAddClick: function() {
        var watchId = WatchController.getWatchId();
        this._setIsUpdating();
        if (this._type === 'deflist') {
          this._mylistController.addDefListItem(watchId,              $.proxy(this._onMylistUpdate, this));
        } else {
          var mylistId = this._content.getMylistId();
          this._mylistController.addMylistItem (watchId, mylistId,    $.proxy(this._onMylistUpdate, this));
        }
      },
      _onRemoveClick: function() {
        var watchId = WatchController.getWatchId();
        this._setIsUpdating();
        if (this._type === 'deflist') {
          this._mylistController.deleteDefListItem(watchId,           $.proxy(this._onMylistUpdate, this));
        } else {
          var mylistId = this._content.getMylistId();
          this._mylistController.deleteMylistItem (watchId, mylistId, $.proxy(this._onMylistUpdate, this));
        }
      },
      _onMylistUpdate: function(status, result) {
        if (status === 'ok') {
          if (this._type === 'deflist') {
            WatchController.clearDeflistCache();
          }
        } else {
          Popup.alert('更新に失敗: ' + result.error.description);
        }
        this._content.setFilter(null);
        setTimeout(
          $.proxy(function() {
            this._content.refresh({page: 1});
            this._clearIsUpdating();
          }, this), 500);
      }
    }; // end WatchingVideoView.prototype


    var GrepOptionView = function() { this.initialize.apply(this, arguments); };
    GrepOptionView.prototype = {
      _params: null,
      _$view:  null,
      initialize: function(params) {
        this._content    = params.content;
        this._$view      = params.$view;
        this._$form      = this._$view.find('form');
        this._$input     = this._$view.find('.grepInput').attr('list', params.listName);
        this._$community = this._$view.find('.community');

        this._$view.toggleClass('debug', !!conf.debugMode);

        this._$list = $('<datalist />').attr('id', params.listName);
        $('body').append(this._$list);

        this._$form .on('submit',    $.proxy(this._onFormSubmit,          this));
        this._$community.on('click', $.proxy(this._onCommunityCheckClick, this));

        this._$input.on('click', $.proxy(function(e) {
          e.stopPropagation();
        }, this))   .on('focus', $.proxy(function(e) {
          WatchApp.ns.util.WindowUtil.scrollFitMinimum('#playlist', 600);
        }, this));

        this._$view .on('click', $.proxy(function(e) {
          this._$input.focus();
        }, this));
      },
      getView: function() {
        return this._$view;
      },
      detach: function() {
        this._$view.detach();
      },
      clear: function() {
        this._$input.val('');
        this._$community.attr('checked', false);
      },
      update: function() {
        var list = this._content.getRawList();
        var tmp = [];
        for (var i = list.length -1; i >= 0; i--) {
          tmp.push('<option>');
          tmp.push(list[i].title); // 既にエスケープされてる
          tmp.push('</option>');
        }
        this._$list.html(tmp.join(''));

        if (this._getWord().length > 0) {
          setTimeout($.proxy(function() { this._$input.focus(); }, this), 100);
        }
      },
      _getWord: function() {
        return this._$input.val();
      },
      _onCommunityCheckClick: function(e) {
        e.stopPropagation();
        this._submit();
      },
      _onFormSubmit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this._submit();
      },
      _submit: function() {
        var word = this._getWord();
        var communityFilter = !!this._$community.attr('checked');

        if (word.length > 0 || communityFilter) {
          this._content.setFilter(this._getFilter());
        } else {
          this._content.setFilter(null);
        }

        this._content.refresh({page: 1});
      },
      _getFilter: function() {
        var to_h = function(str) {
          return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
             return String.fromCharCode(s.charCodeAt(0) - 65248);
          }).toLowerCase();
        };
        var isCommunity = function(str) {
          return /^so|^\d+$/.test(str);
        };
        var word = to_h(this._getWord());
        var communityFilter = !!this._$community.attr('checked');

        return function(item) {
          if (communityFilter && word.length <= 0) {
            return isCommunity(item.id);
          }
          var title = to_h(item.title);
          var desc  = item.description_full || item.description_short || '';
          var mc    = item.mylist_comment   || '';
          var result = title.indexOf(word) >= 0 || to_h(desc).indexOf(word) >= 0 || to_h(mc).indexOf(word) >= 0;
          result = communityFilter ? (result && isCommunity(item.id)) : result;
          return result;
        };
      }
    }; // end GrepOptionView.prototype

    function initMylistContent($, conf, w) {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var ContentView = WatchApp.ns.components.videoexplorer.view.content.MylistVideoContentView;
      var vec      = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer = vec.getVideoExplorer();
      var myUserId = WatchController.getMyUserId();
      var content = explorer.getContentList().getContent(ContentType.MYLIST_VIDEO);
      var loader  = content._mylistVideoAPILoader;
      var pager   = content._pager;
      var watchingVideoView = new WatchingVideoView({
        content: content,
        watchInfoModel: watchInfoModel,
        mylistController: Mylist,
        type: 'mylist',
        $view: $([
          '<div class="watchingVideo">',
            '<img class="thumbnail">',
            '<p class="title"></p>',
            '<span class="contains"    >この動画はリストに登録されています</span>',
            '<span class="not_contains">この動画はリストにありません</span>',
            '<span class="edit">',
              '<button class="add"   >登録</button>',
              '<button class="remove">外す</button>',
            '</span>',
          '</div>',
          ''].join(''))
      });

      var grepOptionView = new GrepOptionView({
        content: content,
        listName: 'suggestMylistTitle',
        $view: $([
          '<div class="grepOption">',
            '<form>',
              '<input type="search" class="grepInput" autocomplete="on" placeholder="タイトル・説明文で絞り込む(G)" accesskey="g">',
              '<label class="communityFilter"><input type="checkbox" class="community">チャンネル・コミュニティ・マイメモリーのみ</label>',
            '</form>',
          '</div>',
        ].join(''))
      });


      pager._pageItemCount = conf.searchPageItemCount;
      EventDispatcher.addEventListener('on.config.searchPageItemCount', function(v) {
        pager._pageItemCount = v;
      });

      content._isOwnerNicorepo = false;
      content._isRanking       = false;
      content.getIsMine          = $.proxy(function() {
        // getUserId()はstringだけどwatchInfoModelから取ってるmyUserIdはnumber HAHAHA
        // ・・・と思ったら両方stringになったぽい？ 2013/09/05
        return parseInt(this.getUserId(), 10) === parseInt(myUserId, 10) && parseInt(this.getMylistId(), 10) > 0;
      }, content);
      content.getIsDummy         = $.proxy(function() {
        return parseInt(this.getMylistId(), 10) <= 0;
      }, content);
      content.getIsOwnerNicorepo = $.proxy(function() { return this._isOwnerNicorepo; }, content);
      content.getIsRanking       = $.proxy(function() { return this._isRanking;       }, content);

      // grep対応のための拡張
      content._rawList = [];
      content.getRawList    = $.proxy(function() { return this._rawList; }, content);
      content._filter = null;
      content.setFilter     = $.proxy(function(filter) {
        this._filter = filter;
      }, content);
      content.getFilter     = $.proxy(function()       { return this._filter; }, content);

      content.clear_org = content.clear;
      content.clear = $.proxy(function() {
        this.setFilter(null);
        this.clear_org();
        grepOptionView.clear();
      }, content);

      content.onLoad_org = content.onLoad;
      content.onLoad = $.proxy(function(err, result) {
        this._isOwnerNicorepo = result.isOwnerNicorepo;
        this._isRanking       = result.isRanking;

        var filter = this.getFilter();
        if (err === null && result.list && result.list.length) {
          if (!result.rawList) result.rawList = result.list.concat();
          if (filter) {
            var list = [];

            for (var i = result.rawList.length - 1; i >= 0; i--) {
              var item = result.rawList[i];
              if (item.title && filter(item)) {
                list.unshift(item);
              }
            }
            result.list    = list;
          } else {
            result.list = result.rawList.concat();
          }
        } else
        if (result.rawList) {
          result.list = result.rawList.concat();
        }

        this._rawList = result.rawList || [];
        this.onLoad_org(err, result);
      }, content);

      content.containsWatchId = $.proxy(function(watchId) {
        var list = this.getRawList();
        if (!watchId) { watchId = WatchController.getWatchId(); }

        for (var i = list.length - 1; i >= 0; i--) {
          if (list[i].id === watchId) { return true; }
        }
        return false;
      }, content);


      loader.load_org = loader.load;
      loader.load = $.proxy(function(params, callback) {
        var isOwnerNicorepo = false, isRanking = false;
        var id = params.id;

        var applyFilter = function(err, result) {
          result.isOwnerNicorepo = isOwnerNicorepo;
          result.isRanking       = isRanking;
          callback(err, result);
        };
        if (id < 0) {
          var onload  = function(result) {
            // 投稿者ニコレポが0件で、投稿動画一覧を公開していたらそっちを開くタイマーをセット
            if (result.list.length < 1 &&
              parseInt(id, 10) === NicorepoVideo.REPO_OWNER &&
              WatchController.isVideoPublic()) {
              setTimeout(function() {
                WatchController.openVideoOwnersVideo();
              }, 500);
            }
            applyFilter(null, result);
          };
          var onerror = function(result) { callback('error', result); };
           // マイリストIDに負の数字(通常ないはず)が来たら乗っ取るサイン
           // そもそもマイリストIDはstringのようなので数字にこだわる必要なかったかも

          try {
            if (typeof VideoRanking.getGenreName(id) === 'string') {
              //if (conf.debugMode)console.log('load VideoRanking: ', VideoRanking.getGenreName(id));
              isRanking = true;
              VideoRanking.load(null, {id: id}).pipe(onload, onerror);
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
                ChannelVideoList.loadOwnerVideo(null).pipe(onload, onerror);
                break;
              case NicorepoVideo.REPO_ALL:
                NicorepoVideo.loadAll()   .pipe(onload, onerror);
                break;
              case NicorepoVideo.REPO_USER:
                NicorepoVideo.loadUser()  .pipe(onload, onerror);
                break;
              case NicorepoVideo.REPO_CHCOM:
                NicorepoVideo.loadChCom() .pipe(onload, onerror);
                break;
              case NicorepoVideo.REPO_MYLIST:
                NicorepoVideo.loadMylist().pipe(onload, onerror);
                break;
              case NicorepoVideo.REPO_OWNER:
                isOwnerNicorepo = true;
                NicorepoVideo.loadOwner() .pipe(onload, onerror);
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
             console.log(e); console.trace();
             onerror({message: 'エラーが発生しました:' + id, status: 'fail'});
            }
          }
        } else {
          this.load_org(params, applyFilter);
        }
      }, loader);


      var __css__ = Util.here(function() {/*
        #videoExplorer .watchingVideo         { display: none; }
        #videoExplorer .watchingVideo .title  { display: none; }
        #videoExplorer .watchingVideo.updating * {
          cursor: wait; opacity: 0.5;
        }
        #videoExplorer .watchingVideo button {
          padding: 2px 12px; margin: 12px 24px;
        }
        #videoExplorer .isMine .watchingVideo {
          display: block; background: #f4f4f4; border: 1px solid #ccc;
          margin: auto; width: 500px; min-height: 48px; padding: 16px;
        }

        #videoExplorer .watchingVideo .thumbnail {
        float: left; width: 72px; margin-right: 24px; cursor: pointer;
        }


        #videoExplorer .watchingVideo .title {
          font-weight: bolder;
        }
        #videoExplorer .watchingVideo .title:before { content: ''; }
        #videoExplorer .watchingVideo .title:after  { content: ' '; }

        #videoExplorer                        .watchingVideo .contains     { display: none;   }
        #videoExplorer .containsWatchingVideo .watchingVideo .contains     { display: inline; }
        #videoExplorer                        .watchingVideo .not_contains { display: inline; }
        #videoExplorer .containsWatchingVideo .watchingVideo .not_contains { display: none;   }

        #videoExplorer         .watchingVideo .edit { display: none; }
        #videoExplorer .isMine .watchingVideo .edit { display: inline-block; }

        #videoExplorer                        .watchingVideo .add { display: inline-block; }
        #videoExplorer .containsWatchingVideo .watchingVideo .add { display: none; }

        #videoExplorer                        .watchingVideo .remove{ display: none; }
        #videoExplorer .containsWatchingVideo .watchingVideo .remove{ display: inline-block; }

        .isMine .editFavorite {
          display: none; {* 自分のマイリストにはお気に入り登録ボタンを出さない *}
        }
        .watchingVideo button {
          cursor: pointer;
        }

        .grepOption {
          padding: 16px;
          width: 500px;
          margin: 16px auto;
          background: #f4f4f4; border: 1px solid #ccc;
        }
        .grepOption .grepInput {
          font-size: 120%;
          width: 100%;
        }
        .grepOption .communityFilter {
          display: none;
        }
        .grepOption .communityFilter {
          display: block; margin: 8px;
        }
      */});
      addStyle(__css__, 'mylistContentCss');

      var
        overrideContentView = function(proto, watchingVideoView, grepOptionView) {
          var updateCssClass = function(content) {
            $('.videoExplorerBody')
              .toggleClass('dummyMylist',   content.getIsDummy())
              .toggleClass('isMine',        content.getIsMine())
              .toggleClass('ownerNicorepo', content.getIsOwnerNicorepo())
              .toggleClass('ranking',       content.getIsRanking())
              ;
          };

          proto.detach_org = proto.detach;
          proto.detach = function() {
            this.detach_org();
            watchingVideoView.detach();
            grepOptionView.detach();
          };

          proto.onUpdate_org = proto.onUpdate;
          proto.onUpdate = function() {
            this.onUpdate_org();
            updateCssClass(this._content);
            watchingVideoView.update();
            grepOptionView.update();
            this._$content.find('.mylistSortOrder').before(watchingVideoView.getView());
            this._$content.find('.mylistSortOrder').before(grepOptionView.getView());
          };

          proto.onError_org = proto.onError;
          proto.onError = function() {
            this.onError_org();
            updateCssClass(this._content);
            watchingVideoView.update();
            grepOptionView.update();
            this._$content.find('.mylistSortOrder').before(grepOptionView.getView());
          };

        };

      overrideContentView(ContentView.prototype, watchingVideoView, grepOptionView);
    } // end initMylistContent

    function initDeflistContent($, conf, w) {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var ContentView = WatchApp.ns.components.videoexplorer.view.content.DeflistVideoContentView;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.DEFLIST_VIDEO);
      var loader      = content._deflistVideoAPILoader;
      var pager       = content._pager;
      var watchingVideoView = new WatchingVideoView({
        content: content,
        watchInfoModel: watchInfoModel,
        mylistController: Mylist,
        type: 'deflist',
        $view: $([
          '<div class="watchingVideo">',
            '<img class="thumbnail">',
            '<p class="title"></p>',
            '<span class="contains"    >この動画はリストに登録されています</span>',
            '<span class="not_contains">この動画はリストにありません</span>',
            '<span class="edit">',
              '<button class="add"   >登録</button>',
              '<button class="remove">外す</button>',
            '</span>',
          '</div>',
          ''].join(''))
      });
      var grepOptionView = new GrepOptionView({
        content: content,
        listName: 'suggestDeflistTitle',
        $view: $([
          '<div class="grepOption">',
            '<form>',
              '<input type="search" class="grepInput" autocomplete="on" placeholder="とりマイをタイトル・説明文で絞り込む(G)" accesskey="g">',
              '<label class="communityFilter"><input type="checkbox" class="community">チャンネル・コミュニティ・マイメモリーのみ</label>',
            '</form>',
          '</div>',
        ].join(''))
      });



      pager._pageItemCount = conf.searchPageItemCount;
      EventDispatcher.addEventListener('on.config.searchPageItemCount', function(v) {
        pager._pageItemCount = v;
      });


      content.refresh_org = content.refresh;
      content.refresh = $.proxy(function(params, callback) {
        if (conf.debugMode) console.log('deflist refresh! ', params, callback);
        if (!this.isActive()) {
          WatchController.clearDeflistCache();
        }
        this.refresh_org(params, callback);
      }, content);

      content.getIsMine = function() { return true; };

      // grep対応のための拡張
      content._rawList = [];
      content.getRawList    = $.proxy(function() { return this._rawList; }, content);
      content._filter = null;
      content.setFilter     = $.proxy(function(filter) {
        this._filter = filter;
      }, content);
      content.getFilter     = $.proxy(function() { return this._filter; }, content);

      content.onLoad_org = content.onLoad;
      content.onLoad = $.proxy(function(err, result) {
        var filter = this.getFilter();
        if (err === null && result.list && result.list.length) {
          if (!result.rawList) result.rawList = result.list.concat();
          if (filter) {
            var list = [];

            for (var i = result.rawList.length - 1; i >= 0; i--) {
              var item = result.rawList[i];
              if (item.title && filter(item)) {
                list.unshift(item);
              }
            }
            result.list    = list;
          } else {
            result.list = result.rawList.concat();
          }
        } else
        if (result.rawList) {
          result.list = result.rawList.concat();
        }
        this._rawList         = result.rawList || [];

        this.onLoad_org(err, result);
      }, content);

      content.clear_org = content.clear;
      content.clear = $.proxy(function() {
        this.setFilter(null);
        this.clear_org();
        grepOptionView.clear();
      }, content);

      content.containsWatchId = $.proxy(function(watchId) {
        var list = this.getRawList();
        if (!watchId) { watchId = WatchController.getWatchId(); }

        for (var i = list.length - 1; i >= 0; i--) {
          if (list[i].id === watchId) { return true; }
        }
        return false;
      }, content);

      var
        overrideContentView = function(proto, watchingVideoView) {
          var updateCssClass = function(content) {
            $('.videoExplorerBody').toggleClass('isMine', true);
          };

          proto.detach_org = proto.detach;
          proto.detach = function() {
            this.detach_org();
            watchingVideoView.detach();
            grepOptionView.detach();
          };

          proto.onUpdate_org = proto.onUpdate;
          proto.onUpdate = function() {
            this.onUpdate_org();
            updateCssClass(this._content);
            watchingVideoView.update();
            grepOptionView.update();
            this._$content.find('.deflistSortOrder').before(watchingVideoView.getView());
            this._$content.find('.deflistSortOrder').before(grepOptionView.getView());
          };

          proto.onError_org = proto.onError;
          proto.onError = function() {
            this.onError_org();
            updateCssClass(this._content);
            watchingVideoView.update();
            grepOptionView.update();
            this._$content.find('.deflistSortOrder').before(grepOptionView.getView());
          };

        };

      overrideContentView(ContentView.prototype, watchingVideoView);
    } // end initDeflistContent




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
    WatchController.showLargeThumbnail = showLargeThumbnail;

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
        $body = $ve.find('.videoExplorerBody')
          .removeClass('isMine').removeClass('dummyMylist')
          .removeClass('isRanking').removeClass('isOwnerNicorepo'),
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
    function adjustVideoExplorerSize(force) {
      if (force !== true && (!conf.videoExplorerHack || !WatchController.isSearchMode())) { return; }
      $('#videoExplorer, #content, #bottomContentTabContainer').toggleClass('w_adjusted', conf.videoExplorerHack);
      var
        rightAreaWidth = $('.videoExplorerBody').outerWidth(), // 592
        availableWidth = Math.max($(window).innerWidth() - rightAreaWidth, 300),
        commentInputHeight = $('#playerContainer').hasClass('oldTypeCommentInput') ? 36 : 0,
        controlPanelHeight = $('#playerContainer').hasClass('controll_panel') ? 46 : 0;

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
          'margin-top: ', availableHeight, 'px !important; left: ', (xdiff - 2), 'px; ',
          'max-height: ', bottomHeight + 'px; overflow-y: auto; overflow-x: hidden; height: auto;',
        '}\n',
        'body.videoExplorer #videoExplorer.w_adjusted { margin-left: ', availableWidth,  'px !important; background: #f4f4f4;}\n',
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
          ' display: block !important; top: ', (availableHeight + otherPluginsHeight - 1), 'px; max-height: ', bottomHeight, 'px; width: ', (xdiff - 4 + 1), 'px; left: 0;',
          ' height:', bottomHeight, 'px; display: block; border-radius: 0;',
        '}',
        'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo, body.size_small.no_setting_panel.videoExplorer #content.w_adjusted #leftPanel .sideIchibaPanel {',
          'width: ', Math.max((xdiff -  4), 130), 'px; border-radius: 0;',
        '}',

        ((xdiff >= 400) ?
          [
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoTitleContainer{',
              'margin-left: 154px; border-radius: 0 0 ;background: #ddd; border: solid; border-color: #ccc; border-width: 1px 1px 0;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoThumbnailContainer{',
              'position: absolute; max-width: 150px; top: 0; ',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoInfo{',
              'background: #ddd; margin-left: 154px; border-radius: 0 0; border: solid; border-color: #ccc; border-width: 0 1px 1px;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoDetails{',
              'margin-left: 154px; height: 100%; ',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .videoOwnerInfoContainer{',
              'position: absolute; width: 150px; top: 0; border: 1px solid #ccc;',
            '}',
            'body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .userIconContainer, body.videoExplorer #content.w_adjusted #leftPanel .sideVideoInfo .ch_profile{',
              'background: #ddd; max-width: 150px; float: none; border-radius: 0;',
            '}',
            'body.videoExplorer:not(.content-fix) .w_adjusted .videoDetails, ',
            'body.videoExplorer:not(.content-fix) .w_adjusted #videoExplorerMenu {',
              // タグ領域三行分 bodyのスクロール位置をタグの場所にしてる時でもパネルは文章の末端までスクロールできるようにするための細工
              // (四行以上あるときは表示しきれないが)
              'padding-bottom: 72px; ',
            '}',
          ].join('') :
          (
            (xdiff >= 154) ?
            ['body.videoExplorer #content.w_adjusted #leftPanel #leftPanelTabContainer { padding: 4px 2px 3px 2px; }'].join('') :
            ['body.videoExplorer #content.w_adjusted #leftPanel { display: none !important;}'].join('')
          )
        ),
          'body.videoExplorer #bottomContentTabContainer.w_adjusted .videoExplorerFooterAdsContainer { width: 520px; }\n',

          'body.videoExplorer #content.w_adjusted #playerTabWrapper {',
            'height: ', (availableHeight), 'px !important;',
          '}',

          'body.videoExplorer #content.w_adjusted #playerTabWrapper .sidePanelInner {',
            'height: ', (availableHeight - 2), 'px;',
          '}',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper.w_active {',
            'right: -',(commentPanelWidth - 2), 'px !important; top: 0 !important;  background: transparent; border: 0;  margin-top: 0px;',
          '}',
          'body.videoExplorer #content.w_adjusted #playerTabWrapper.w_active             #playerCommentPanel {',
            'display: block; background: #dfdfdf; border: 1px solid;',
          '}',
      ''].join('');

      if (videoExplorerStyle) {
        videoExplorerStyle.innerHTML = dynamic_css;
      } else {
        videoExplorerStyle = addStyle(dynamic_css, 'videoExplorerStyle');
      }

    } // end adjustVideoExplorerSize

    function setupVideoExplorerStaticCss() {
      var __css__ = Util.here(function() {/*
        body.videoExplorerOpening {
          overflow-y: scroll;
        }
        body.videoExplorerOpening .videoExplorerMenu {
          display: none;
        }
        body.videoExplorerOpening #playerTabWrapper {
          visibility: hidden;
        }
        #videoExplorer {
          transition: margin-left 0.4s ease 0.4s; overflow-x: hidden;
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
        #videoExplorer.w_adjusted .videoExplorerMenu, #content .videoExplorerMenu:not(.initialized) { display: none; }
        .videoExplorerMenu {
          transition: margin-top 0.4s ease 0.4s; {*, left 0.4s ease-in-out*};
        }
        #leftPanel {
          {* transition: width 0.4s ease 0.4s, height 0.4s ease 0.4s, top 0.4s ease 0.4s, left 0.4s ease 0.4s;*}
          transition: width 0.4s ease 0.4s, height 0.4s ease 0.4s, left 0.4s ease 0.4s;
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

        body.videoExplorer #bottomContentTabContainer.w_adjusted { background: #ccc; }
        body:not(.videoExplorer)      .videoExplorerMenu { display: none; }

        body.videoExplorer #content.w_adjusted #nicoplayerContainer {
          z-index: 100;
        }
        body.videoExplorer #content.w_adjusted #playerTabWrapper {
          top: 0px !important; {*height: 50px !important;*} background: #dfdfdf; border-radius: 4px;
          z-index: 99;
          transition: right 0.3s ease-out;
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
        .videoExplorerMenu .itemList>li:first {
          position: relative;
        }

        #videoExplorer .videoExplorerMenu .closeVideoExplorer, #videoExplorer .quickSearchInput {
          display: none;
        }

        #videoExplorer .videoExplorerBody .videoExplorerContent.column1 .contentItemList .video .column1 .videoInformationOuter .title
        {
          white-space: normal;
        }

        .column1 .balloon .mylistComment {
          display: none; {* バルーンの中にマイリストコメントとか意味不明すぎる *}
        }

        .videoExplorer #playlist {
          transition: margin-left 0.4s ease 0.4s;
        }

        #playerAlignmentArea .toggleCommentPanel {
          display: none;
          position: absolute;
          right: -119px;
          bottom: 70px;
          width: 100px;
          height: 30px;
          cursor: pointer;
          outline: none;
          background: #ccc;
          border-radius: 16px 16px 0 0;
          border: solid 1px black;
          -webkit-transform: rotate(90deg); -webkit-transform-origin: 0 0 0;
                  transform: rotate(90deg);         transform-origin: 0 0 0;
                  transition: 0.4s ease-in-out;
          -webkit-transition: 0.4s ease-in-out;
        }
        #playerAlignmentArea .toggleCommentPanel::-moz-focus-inner {
          border: 0px;
        }
        body.videoExplorer .w_adjusted #playerAlignmentArea .toggleCommentPanel { display: block; }
        #playerAlignmentArea .toggleCommentPanel:before {
          content: '￪ ';
        }
        #playerAlignmentArea .toggleCommentPanel:hover {
          {*box-shadow: 2px -2px 2px #888;*}
          right: -129px;
        }
        #playerAlignmentArea .toggleCommentPanel.w_active {
          right: -418px;
          bottom: -29px;
          border-radius: 0 0 16px 16px;
          z-index: 10000;
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
                  transition: none;
          -webkit-transition: 0.4s ease-in-out;
                {*transition: 0.4s ease-in-out;*}
        }
        #playerAlignmentArea .toggleCommentPanel.w_active:hover {
          {*box-shadow: 2px 2px 2px #888;*}
          right: -418px;
        }
        #playerAlignmentArea .toggleCommentPanel.w_active:before {
          content: '← ';
        }

        .videoExplorerOpening .videoExplorerBody .videoExplorerConfig {
          display: none;
        }
        .videoExplorerBody .videoExplorerConfig {
          cursor: pointer;
          width: 80px; margin-left: -36px; white-space: nowra;
          border-radius: 0 32px 0 0; border: solid 1px #666; border-width: 1px 1px 0;
          color: #fff; background: #aaa;
        }
        #videoExplorer.w_adjusted       .videoExplorerConfig .open,
        #videoExplorer:not(.w_adjusted) .videoExplorerConfig .close {
          display: none;
        }
        .videoExplorerConfig::-moz-focus-inner { border: 0px; }

      */});
      return addStyle(__css__, 'videoExplorerStyleStatic');
    } // end setupVideoExplorerStaticCss

    function initAutoComplete($searchInput) {
      var
        $suggestList = $('<datalist id="quickSearchSuggestList"></datalist>'),
        loading = false,
        val = '',
        suggestLoader = new NicoSearchSuggest({});
        update = WatchApp.ns.event.EventDispatcher.debounce(function() {
          if (loading) {
            return;
          }
          var value = $searchInput.val();
          if (value.length >= 2 && val !== value) {
            val = $searchInput.val();
            loading = true;
            suggestLoader.load(val, onSuggestLoaded);
          } else {
            loading = false;
          }
        }, 300),
        onSuggestLoaded = function(err, result) {
          if (err) {
            return;
          }
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
            .on('focus',     update)
            .on('keydown',   update)
            .on('keyup',     update)
            .on('keypress',  update)
            .on('click',     update)
            .on('mousedown', update)
            .on('mouseup',   update)
            .attr({'autocomplete': 'on', 'list': 'quickSearchSuggestList', 'placeholder': '検索ワードを入力(Q)'});
         // try {
         //   //$elm.attr('type', 'search');
         //   //$elm[0].setAttribute('type', 'search');//.attr('type', 'search');
         // } catch (e) {
         //   console.log(e);
         // }
        };

      $('body').append($suggestList);

      bind($searchInput);
    } //

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
          .attr({'title': '検索ワードを入力', 'placeholder': '検索ワードを入力(Q)'}),
        $closeExplorer  = $('<div class="closeVideoExplorer"><a href="javascript:;">▲ 画面を戻す</a></div>'),
        $inputForm      = $('<form />').append($searchInput),
        $toggleCommentPanel = $('<button class="toggleCommentPanel">コメント</button>');

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


          $('.videoExplorerMenu')
            .find('.itemList>li:first')/*.css('position', 'relative')*/.append($inputForm)
            .end().find('.errorMessage').after($closeExplorer);
        };
      controller._refreshMenu_org = controller._refreshMenu;
      controller._refreshMenu = $.proxy(function() {
        detachMenuItems();
        this._refreshMenu_org();
        attachMenuItems();
      }, controller);

      EventDispatcher.addEventListener('on.config.enableFavTags',
        function() { if (WatchController.isSearchMode()) { controller._refreshMenu(); }});
      EventDispatcher.addEventListener('on.config.enableFavMylists',
        function() { if (WatchController.isSearchMode()) { controller._refreshMenu(); }});

      EventDispatcher.addEventListener('onVideoExplorerOpened', function(content) {
        setTimeout(function() {
          if (conf.videoExplorerHack) {
           // adjustVideoExplorerSize();
            watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
            playerConnector.updatePlayerConfig({playerViewSize: ''}); // ノーマル画面モード
          }
        }, 100);

        $('body').removeClass('videoExplorerOpening');
        $('.videoExplorerMenu').addClass('initialized');
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
        $('body').addClass('videoExplorerOpening');
        adjustVideoExplorerSize(true);
      });
      EventDispatcher.addEventListener('onVideoExplorerClosing', function(content) {
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


      EventDispatcher.addEventListener('onFirstVideoExplorerOpened', function() {
        //setTimeout(function() {
          EventDispatcher.addEventListener('onWindowResizeEnd',  adjustVideoExplorerSize);
          EventDispatcher.addEventListener('onVideoInitialized', adjustVideoExplorerSize);
        //}, 1000);
      });

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

      initVideoExplorerItemContent();

      $('#playerAlignmentArea').append($toggleCommentPanel);
      $toggleCommentPanel.on('click', function() {
        AnchorHoverPopup.hidePopup();
        $('#playerTabWrapper').toggleClass('w_active');
        $toggleCommentPanel.toggleClass('w_active', $('#playerTabWrapper').hasClass('w_active'));
        setTimeout(function() {
          watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
        }, 1000);
      }).on('mouseover', function() {
        AnchorHoverPopup.hidePopup();
      });

      var toggleVideoExplorerHack = function(v) {
        $('#videoExplorer, #content, #footer').toggleClass('w_adjusted', v);
        if (v) {
          $('#content').append($('.videoExplorerMenu'));
          if (WatchController.isSearchMode()) {
            playerConnector.updatePlayerConfig({playerViewSize: ''}); // ノーマル画面モード
            adjustVideoExplorerSize(true);
          }
        } else {
          $('.videoExplorerContentWrapper').before($('.videoExplorerMenu'));
          setTimeout(function() {
            if (WatchController.isSearchMode()) {
              playerConnector.updatePlayerConfig({playerViewSize: 'small'});
              WatchApp.ns.util.WindowUtil.shake();
            }
          }, 1000);
        }
      };
      EventDispatcher.addEventListener('on.config.videoExplorerHack', toggleVideoExplorerHack);
      toggleVideoExplorerHack(conf.videoExplorerHack);
      //adjustVideoExplorerSize(true);

      // TODO: ニコメンド編集ボタンが押されたら検索画面解除
      EventDispatcher.addEventListener('onVideoExplorerUpdated', function(req) { });
    } // end initVideoExplorer

    function initVideoExplorerItemContent() {

      // 動画情報表示のテンプレートを拡張
      var
        overrideItemTemplate = function() {
          var menu =
            '<div class="thumbnailHoverMenu">' +
            '<button class="showLargeThumbnail" onclick="WatchItLater.onShowLargeThumbnailClick(this);" title="大きいサムネイルを表示">＋</button>' +
            '<button class="deleteFromMyMylist" onclick="WatchItLater.onDeleteFromMyMylistClick(this);">マイリスト外す</button>' +
            '</div>', $menu = $(menu);

          var $template = $('<div/>').html(watch.VideoExplorerInitializer.videoExplorerView._contentListView._$view.find('.videoItemTemplate').html());
          //console.log($template.html());
            $template.find('.column1 .thumbnailContainer').append($menu);
            $template.find('.column4 .balloon').before($menu.clone());//.before($template.find('.column4 .videoInformation'));
            $template.find('.column4 .createdTime').after($template.find('.column4 .videoInformationOuter'));
            //$template.find('.column4 .balloon').before($template.find('.column4 .videoInformationOuter'));
            $template.find('.column4 .balloon').remove();
            $template.find('.column1')
              .find('.descriptionShort').after($('<p class="itemMylistComment mylistComment"/>'))
              .end().find('.createdTime').after($('<div class="nicorepoOwnerIconContainer"><a target="_blank"><img /></a></div>'));
            watch.VideoExplorerInitializer.videoExplorerView._contentListView._$view.find('.videoItemTemplate').html($template.html());
          //console.log($template.html());
            $template = $menu = null;

        },
        onDeleteFromMyMylistClick = function(elm) {
          var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
          var contentList = WatchApp.ns.init.VideoExplorerInitializer.videoExplorer.getContentList();
          var
            $videoItem = $(elm).parent().parent(),
            watchId    = $videoItem.find('.link').attr('href').split('/').reverse()[0],
            ac         = contentList.getActiveContent(),
            type       = contentList.getActiveContentType(),
            onUpdate   = function(status, result) {
              if (status !== "ok") {
                Popup.alert('削除に失敗: ' + result.error.description);
              } else {
                $videoItem.parent().animate({opacity: 0.3}, 500);
              }
            };

          if (type === ContentType.MYLIST_VIDEO) {
            if (!ac.getIsMine()) { return; }
            Mylist.deleteMylistItem(watchId, ac.getMylistId(), onUpdate, 0);
          } else
          if (type === ContentType.DEFLIST_VIDEO) {
            Mylist.deleteDefListItem(watchId, onUpdate, 0);
          }
        },
        onShowLargeThumbnailClick = function (elm) {
          var
            $videoItem = $(elm).parent().parent(),
            src        = $videoItem.find('.thumbnail').attr('src');
          if (!src) { return; }
          showLargeThumbnail(src);
        };
      overrideItemTemplate();
      WatchItLater.onDeleteFromMyMylistClick = onDeleteFromMyMylistClick;
      WatchItLater.onShowLargeThumbnailClick = onShowLargeThumbnailClick;

      // 動画情報表示の拡張
      var ItemView = WatchApp.ns.components.videoexplorer.view.content.item.AbstractVideoContentItemView;
      ItemView.prototype._setView_org = ItemView.prototype._setView;
      ItemView.prototype._setView = function($item) {
        this._setView_org($item);
        this._$createdTime     = $item.find('.column4 .createdTime span');
        this._$createdTimeFull = $item.find('.column1 .createdTime span');
      };
      ItemView.prototype._setItem_org = ItemView.prototype._setItem;
      ItemView.prototype._setItem = function(item) {
        this._setItem_org(item);
      };
      ItemView.prototype.update_org = ItemView.prototype.update;
      ItemView.prototype.update = function() {
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
            $iconContainer = $icon = $link = null;
          }
        }
        if (item._seed && typeof item._seed.description_full === 'string' && item._seed.description_full.length > 150) {
          this._$descriptionShort.attr('title', item._seed.description_full);
        }
        $item = null;

      };
      ItemView = null;

    } // end initVideoExplorerItemContent



    var lastVideoOwnerJson = '';
    function onWatchInfoReset(watchInfoModel) {
      $('body').toggleClass('w_channel', watchInfoModel.isChannelVideo());
      EventDispatcher.dispatch('onWatchInfoReset', watchInfoModel);
      var owner = WatchController.getOwnerInfo(), owner_json = JSON.stringify(owner);
      if (lastVideoOwnerJson !== owner_json) {
        lastVideoOwnerJson = owner_json;
        EventDispatcher.dispatch('onVideoOwnerChanged', owner);
      }
    }

    function onScreenModeChange(sc) {
      setTimeout(function() {
        EventDispatcher.dispatch('onScreenModeChange', sc);
      }, 500);
    }

    function initMylistPanel($, conf, w) {
      var iframe = Mylist.getPanel('');
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

      var $iframe = $(iframe), $footer = $('#footer'), $window = $(window);
      var toggleMylistPanelStyle = function() {
        if ($footer.is(':visible')) {
          $iframe.toggleClass('black', $window.scrollTop() + $window.innerHeight() - $footer.offset().top >= 0);
        } else {
          $iframe.removeClass('black');
        }
      };

      EventDispatcher.addEventListener('onVideoInitialized', function(isFirst) {
        toggleMylistPanelStyle();
        var newVideoId = watchInfoModel.id;
        var newWatchId = watchInfoModel.v;
        iframe.watchId(newVideoId, newWatchId);
        if (isFirst) iframe.show();
      });
      EventDispatcher.addEventListener('onScrollEnd',        toggleMylistPanelStyle);
      EventDispatcher.addEventListener('onWindowResizeEnd',  toggleMylistPanelStyle);
      EventDispatcher.addEventListener('onScreenModeChange', toggleMylistPanelStyle);
      EventDispatcher.addEventListener('on.config.hidePlaylist', toggleMylistPanelStyle);
      EventDispatcher.addEventListener('on.config.bottomContentsVisibility', toggleMylistPanelStyle);
    } //

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
            onWindowResizeEnd(); // TODO:;;;;
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
        $('body').toggleClass('trueBrowserFull', v).toggleClass('full_and_mini', v);
        conf.setValue('enableTrueBrowserFull', v);
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
          if (conf.enableTrueBrowserFull) toggleTrueBrowserFull(conf.enableTrueBrowserFull);
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

      playlist.isAutoPlay      = playlist.isContinuous; // 互換用
      playlist.enableAutoPlay  = playlist.enableContinuous;
      playlist.disableAutoPlay = playlist.disableContinuous;

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
            if (id === watchInfoModel.v) {
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

          var isAutoPlay = playlist.isContinuous();//isAutoPlay();
          playlist.reset(newItems, 'WatchItLater', list.t, list.o);
          if (!isAutoPlay) { // 本家側の更新でリセット時に勝手に自動再生がONになるようになったので、リセット前の状態を復元する
            playlist.disableContinuous();
          }
          if (currentIndex >= 0) { playlist.playingItem = newItems[currentIndex]; }
          if (list.a) { playlist.enableContinuous(); }
          if (list.r) {
            if (newItems[0].id === blankVideoId) {
              setTimeout(function() {WatchController.shufflePlaylist();}, 3000);
            } else {
              playlist.enableContinuous();
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
              playlist.enableContinuous();
            },
            createDom = function() {
              $popup = $('<div/>').addClass('playlistMenuPopup').toggleClass('w_touch', isTouchActive);
              var $ul = $('<ul/>');
              $popup.click(function() {
                self.hide();
              });
              var $shuffle = $('<li>シャッフル: 全体</li>').click(function(e) {
                WatchController.shufflePlaylist();
                enableContinuous();
              });
              $ul.append($shuffle);
              var $shuffleR = $('<li>シャッフル: 右</li>').click(function(e) {
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

      $('.generationMessage, .prevArrow, .nextArrow, .playbackOption').on('mouseover', function() {
        AnchorHoverPopup.hidePopup();
      });

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

      var togglePlaylistDisplay = function(v) {
        var $playlist = $('#playlist');
        if (!v) {
          $playlist.addClass('w_show').removeClass('w_closing');
        } else {
          $playlist.addClass('w_closing');
          setTimeout(function() { $playlist.removeClass('w_show');}, 500);
        }
      };
      EventDispatcher.addEventListener('on.config.hidePlaylist', togglePlaylistDisplay);
      togglePlaylistDisplay(conf.hidePlaylist);

    } // end initPlaylist


    function initPageHeader($, conf, w) {
      $('.videoDetailExpand h2').addClass('videoDetailToggleButton');
    } // end initPageHeader


    function initVideoTagContainer($, conf, w) {
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

      var onTagReset = function() {
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
      };

      EventDispatcher.addEventListener('onVideoInitialized', onTagReset);
      watch.TagInitializer.tagList.addEventListener('reset', onTagReset);

      $videoHeaderTagEditLinkArea = $toggleTagEditText = null;
    } // end initVideoTagContainer



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
        body:not(.full_with_browser) .w_wide .sidePanel.w_review #videoReview { width: 400px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review textarea.newVideoReview { width: 377px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review #videoReviewHead { width: 383px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review #videoReview .stream { width: 400px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review #videoReview .inner { width: 400px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review .commentContent { width: 378px; }
        body:not(.full_with_browser) .w_wide .sidePanel.w_review .commentContentBody { width: 332px; }
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
      var toggleNoNews = function() {
        $('#content').toggleClass('noNews', conf.hideNicoNews || conf.customPlayerSize !== '');
      };

      EventDispatcher.addEventListener('on.config.hideNicoNews',     toggleNoNews);
      EventDispatcher.addEventListener('on.config.customPlayerSize', toggleNoNews);

      toggleNoNews();

      if (conf.enableNewsHistory) { NicoNews.initialize(w); }
      if (conf.hideNewsInFull) { $('body').addClass('hideNewsInFull'); }
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
        if (!WatchController.isFullScreen()) {
          AnchorHoverPopup.hidePopup();
          if (conf.doubleClickScroll) {
            EventDispatcher.dispatch('onScrollReset');
            WatchController.scrollToVideoPlayer(true);
          }
        }
      });


      Mylist.onDefMylistUpdate(function() {
        //WatchController.clearDeflistCache();
      });
      Mylist.onMylistUpdate(function(info) {
        WatchController.clearMylistCache(info.groupId);
      });

      $(window).on('beforeunload.watchItLater', function(e) {
        conf.setValue('lastCommentVisibility', WatchController.commentVisibility() ? 'visible' : 'hidden');
      }).on('resize', WatchApp.ns.event.EventDispatcher.debounce(function() {
        AnchorHoverPopup.hidePopup();
        EventDispatcher.dispatch('onWindowResizeEnd');
      }, 1000));

      $(document).on('scroll', WatchApp.ns.event.EventDispatcher.debounce(function() {
        EventDispatcher.dispatch('onScrollEnd');
      }, 500));

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        pac.addEventListener('onVideoChangeStatusUpdated', onVideoChangeStatusUpdated);
      });

    } //

    function initAdditionalButtons() {

      var createPlaylistToggle = function() {
        var $playlistToggle = $('<button title="プレイリスト表示/非表示" class="playlistToggle">プレイリスト</button>');

        $playlistToggle.on('click', function() {
          AnchorHoverPopup.hidePopup();
          conf.setValue('hidePlaylist', !!!conf.hidePlaylist);
        });

        var togglePlaylistDisplay = function(v) {
          $playlistToggle.toggleClass('w_show', !v);
        };

        EventDispatcher.addEventListener('on.config.hidePlaylist', togglePlaylistDisplay);
        togglePlaylistDisplay(conf.hidePlaylist);

        return $playlistToggle;
      };
      var createOpenExplorer = function() {
        return $('<button class="openVideoExplorer">検索▼</button>').on('click', function() {
          WatchController.openSearch();
          if (!$('body').hasClass('content-fix')) {
            WatchController.scrollToVideoPlayer(true);
          }
        });
      };
      var $div = $('<div class="bottomAccessContainer"/>').append(createPlaylistToggle()).append(createOpenExplorer());


      $('#outline .outer').before($div);

      var $container = $('<div class="bottomConfButtonContainer" />'), $conf = $('<button title="WatchItLaterの設定">設定</button>');
      var $explorerConf = $('<button><span class="open">｀・ω・´</span><span class="close">´・ω・`</span></button>');
      var toggleConf = function(e) {
        e.stopPropagation();
        AnchorHoverPopup.hidePopup();
        ConfigPanel.toggle();
      };
      $container.append($conf);
      $conf.addClass('openConfButton');
      $conf.on('click', toggleConf);//.attr('accesskey', 'p');
      $('#outline .outer').before($container);

      $('.videoExplorerBody').append($explorerConf);
      $explorerConf
        .on('click',
          function() { WatchItLater.config.set('videoExplorerHack', !WatchItLater.config.get('videoExplorerHack')); })
        .addClass('videoExplorerConfig');

      var $body = $('body'), $window = $(window);
      EventDispatcher.addEventListener('onWindowResizeEnd', function() {
        if (WatchController.isSearchMode() || WatchController.isFullScreen()) { return; }
        var w = $div.outerWidth(), threshold = ($(window).innerWidth() - 960) / 2;
        $('#outline').toggleClass('under960', w > threshold && !$('#footer').hasClass('noBottom'));
      });
    } // end initAdditionalButtons


    function initSearchContent($, conf, w) {
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
              .on('click', Util.Closure.openNicoSearch(text)),
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
        this.updateSearchPageItemCount();
      }, content);
      content.updateSearchPageItemCount = $.proxy(function() {
        this._pager._pageItemCount = this._searchEngineType === 'sugoi' ? conf.searchPageItemCount : 32;
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

      EventDispatcher.addEventListener('on.config.searchPageItemCount', function() {
        content.updateSearchPageItemCount();
      });



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

    function initUserVideoContent($, conf, w) {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.USER_VIDEO);
      var pager       = content._pager;

      pager._pageItemCount = conf.searchPageItemCount;
      EventDispatcher.addEventListener('on.config.searchPageItemCount', function(v) {
        pager._pageItemCount = v;
      });
    }

    function initUploadedVideoContent($, conf, w) {
      var ContentType = WatchApp.ns.components.videoexplorer.model.ContentType;
      var vec         = watch.VideoExplorerInitializer.videoExplorerController;
      var explorer    = vec.getVideoExplorer();
      var content     = explorer.getContentList().getContent(ContentType.UPLOADED_VIDEO);
      var pager       = content._pager;

      pager._pageItemCount = conf.searchPageItemCount;
      EventDispatcher.addEventListener('on.config.searchPageItemCount', function(v) {
        pager._pageItemCount = v;
      });
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
            bottom: 1px;
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
        {name: 'shortcutTogglePlay',        exec: function(e) {
          WatchController.togglePlay();
        }},
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
        }},
        {name: 'shortcutInvisibleInput',   exec: function(e) {
          $('.invisibleCommentInput').focus();
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

      EventDispatcher.addEventListener('onWindowResizeEnd', function() {
        updateDynamicCss();
      });
      var __debug_css__ = Util.here(function() {/*
        .videoExplorer        #playerContainerWrapper, .videoExplorer        #external_nicoplayer,
        .videoExplorerOpening #playerContainerWrapper, .videoExplorerOpening #external_nicoplayer
        {
          transition: width 0.4s ease, height 0.4s ease;
        }
        #playerAlignmentArea .toggleCommentPanel {
        {*transition: 0.4s ease-in-out;*}
        }
        {*
        body:not(.videoExplorer):not(.full_with_browser) #playerNicoplayer,
        body:not(.videoExplorer):not(.full_with_browser) #playerAlignmentArea{
          transition: width  0.4s ease;
        }
        body:not(.videoExplorer):not(.full_with_browser) #nicoplayerContainer{
          transition: height 0.4s ease 0.4s;
        }
        *}

       */});
      if (conf.debugMode) addStyle(__debug_css__, 'watchItLater_debug_css');
    } // end initOtherCss

    function initCustomPlayerSize($, conf, w) {
      var tpl = Util.here(function() {/*
        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #playerAlignmentArea
        { width: {$alignmentAreaWidth}px; }
        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) .w_wide #playerAlignmentArea
        { width: {$alignmentAreaWideWidth}px; }

        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #nicoplayerContainer {
          height: {$playerHeight}px !important;
        }
        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #playerNicoplayer
        { width: {$playerWidth}px !important;}

        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #external_nicoplayer
        { width: {$playerWidth}px !important; height: {$playerHeight}px !important; }

        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #nicoHeatMapContainer {
          width: {$playerWidth}px !important;
        }
        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #nicoHeatMap {
          transform: scaleX({$heatMapScale}); -webkit-transform: scaleX({$heatMapScale});
        }
        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #smart_music_kiosk {
          -webkit-transform: scaleX({$songriumScale}); -webkit-transform-origin: 0 0;
        }

        body.size_normal.w_size_custom:not(.videoExplorer):not(.full_with_browser) #inspire_category {
         left: {$songriumCategoryLeft}px !important;
        }

        */});
      var PROFILE_SET = {
        'WQHD':   [2560, 1440],
        '1080p':  [1920, 1080],
        'HD+':    [1600,  900],
        'WXGA+':  [1400,  810],
        'WXGA':   [1366,  768],
        '720p':   [1280,  720],
        'WSVGA':  [1024,  576],
        'QHD':    [ 960,  540]//, // 元より小さいパターンもサポートする？
//        'WVGA':   [ 854,  480],
//        'NORMAL': [ 640,  360],
//        'SMALL':  [ 512,  288],
//        'ECO':    [ 352,  200],
      };
      var CONTROL_HEIGHT = 46, INPUT_HEIGHT = 36, PLAYER_TAB_WIDTH = 280 + 10, PLAYER_TAB_WIDTH_WIDE = 420 + 10, TAB_MARGIN = 20;
      var SONGRIUM_WIDTH = 898;
      var HORIZONTAL_MARGIN = 1.05; // 両端に 2.5% x 2 のマージンがある

      var getTargetSize = function(targetWidth, targetHeight) {
        var plWidth  = Math.round(targetWidth * HORIZONTAL_MARGIN);
        var plHeight = targetHeight + CONTROL_HEIGHT + INPUT_HEIGHT;
        var alWidth  = plWidth + PLAYER_TAB_WIDTH;
        var alWidthW = plWidth + PLAYER_TAB_WIDTH_WIDE;
        return {
          playerWidth:            plWidth,
          playerHeight:           plHeight,
          alignmentAreaWidth:     alWidth,
          alignmentAreaWideWidth: alWidthW,
          heatMapScale:           plWidth / 100,
          songriumScale:          plWidth / SONGRIUM_WIDTH,
          songriumCategoryLeft:   plWidth + 32
        };
      };
      var suggestProfile = function() {
        var iw = $(window).innerWidth(), ih = $(window).innerHeight();
        var hh = (WatchController.isFixedHeader() ? $("#siteHeader").outerHeight() : 0);
        iw -= (conf.wideCommentPanel ? PLAYER_TAB_WIDTH_WIDE : PLAYER_TAB_WIDTH);
        iw -= TAB_MARGIN;

        ih -= hh;
        for (var v in PROFILE_SET) {
          var w = PROFILE_SET[v][0], h = PROFILE_SET[v][1];
          if (w * HORIZONTAL_MARGIN <= iw && h <= ih) {
            return {w: w, h: h, name: v};
          }
        };
        return null;
      };
      var generateCss = function() {
        var profile = '';
        if (PROFILE_SET[conf.customPlayerSize]) {
          var s = PROFILE_SET[conf.customPlayerSize];
          profile = {w: s[0], h: s[1], name: conf.customPlayerSize};
        } else {
          profile = suggestProfile();
        }
        if (!profile) return {css: '', profile: ''};
        var ts = getTargetSize(profile.w, profile.h);
        var css = tpl;
        for (var v in ts) {
          css = css.split('{$' + v + '}').join(ts[v]);
        }
        return {css: css, profile: profile};
      };
      var customStyleElement = null, lastCssName = '';
      var updateStyle = function() {
        if (WatchController.isFullScreen() || WatchController.isSearchMode()) {
          return;
        }

        var result = generateCss();
        if (result.css === '') {
         // clearStyle();
         // return;
        }
        var css = result.css, profile = result.profile, name = profile.name;

        if (lastCssName === name) {
          return;
        }
        lastCssName = name;
        if (customStyleElement) {
          customStyleElement.innerHTML = css;
        } else {
          customStyleElement = addStyle(css, 'customPlayerSize');
        }
        EventDispatcher.dispatch('onPlayerAlignmentAreaResize');
      };
      var toggleCustomSize = function(v) {
        if (typeof v === 'boolean') {
          $('body').toggleClass('w_size_custom', v);
        } else {
          $('body').toggleClass('w_size_custom');
        }
      }
      var clearStyle = function() {
        if (customStyleElement) {
          customStyleElement.innerHTML = '';
          toggleCustomSize(false);
        }
        lastCssName = '';
      };
      if (conf.customPlayerSize !== '') {
        updateStyle();
        toggleCustomSize();
      }
      EventDispatcher.addEventListener('on.config.customPlayerSize', function(v) {
        if (v === '') {
          clearStyle();
        } else {
          updateStyle();
          toggleCustomSize(true);
        }
      });
      EventDispatcher.addEventListener('on.config.wideCommentPanel', function(v) {
        if (conf.customPlayerSize !== '') {
          updateStyle();
        }
      });
      EventDispatcher.addEventListener('onWindowResizeEnd', function() {
        if (conf.customPlayerSize !== '') {
          updateStyle();
        }
      });

      if (conf.debugMode) {
        WatchItLater.debug.customSize = {
          suggestProfile:   suggestProfile,
          getTargetSize:    getTargetSize,
          generateCss:      generateCss,
          updateStyle:      updateStyle,
          toggleCustomSize: toggleCustomSize
        };
      }

    } //

    function initStageVideo($, conf, w) {
      var onStageVideoAvailabilityUpdated = function(v) {
        $('#nicoplayerContainerInner').toggleClass('stageVideo', v);
      };

      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        onStageVideoAvailabilityUpdated(WatchController.isStageVideoAvailable());
        if (conf.forceEnableStageVideo) {
          try {$('#external_nicoplayer')[0].setIsForceUsingStageVideo(true);  } catch (e) { console.log(e);}
        }
      });

      pac.addEventListener('onStageVideoAvailabilityUpdated', onStageVideoAvailabilityUpdated);

      // console.log('StageVideo', $('#external_nicoplayer')[0].isStageVideoSupported() ? 'supported' : 'not supported');
      // console.log('ColorSpaces', $('#external_nicoplayer')[0].getStageVideoSupportedColorSpaces());

    } //

    /**
     * Chromeなら ALT+C
     * Firefoxなら ALT+SHIFT+C で召喚
     *
     * どこでもコメント入力開始する隠し機能
     *
     * :m[0-9a-p] xxxxx でマイリストする機能もある
     *
     **/
    function initInvisibleCommentInput($, conf, w) {
      var $view = $(Util.here(function() {/*
        <div class="invisibleInput">
        <form>
          <input type="text" value="" autocomplete="on" accesskey="c"
            list="myMylist" placeholder="コメント入力" class="invisibleCommentInput"
            maxlength="75"
            ></form>
        <label><input type="checkbox" class="autoPause" checked="checked">動画を自動で一時停止する</label>
        </div>
      */}));
      var css = Util.here(function() {/*
        .invisibleInput {
          position: fixed; z-index: 10000;
          left: 100px; bottom: -100px; width: 300px;
          padding: 16px;
          border: 1px solid black;
          background: #eee;

          transition: bottom 0.4s ease 0.1s;
        }
        .invisibleInput.active {
          bottom: 50px;
          transition: bottom 0.4s ease;
          box-shadow: 2px 2px 2px #333;
        }

        .invisibleInput .invisibleCommentInput {
          width: 100%; font-size: 140%;
        }
      */});
      var $dataList = $('<datalist id="myMylist"></datalist>');
      var $form      = $view.find('form');
      var $input     = $view.find('input');
      var $autoPause = $view.find('.autoPause').attr('checked', conf.autoPauseInvisibleInput);

      var prevent = function(e) { e.stopPropagation(); e.preventDefault(); };
      var preventEsc = function(e) { if (e.keyCode === 27) { prevent(e); } };
      var isAutoPause = function() { return !!$autoPause.attr('checked'); };

      var mylistList = [];
      var
        onMylistUpdate = function(status, result) {
         if (status === "ok") {
           Popup.show('マイリストに追加しました');
         } else {
           Popup.alert('マイリスト追加に失敗: ' + result.error.description);
         }
      }, addMylist = function(n, d) {
         var num = parseInt(n, 36);
         var description = d || '';
         if (num === 0) {
           Mylist.addDefListItem(WatchController.getWatchId(),                     onMylistUpdate, description);
         } else
         if (mylistList[num]) {
           Mylist.addMylistItem (WatchController.getWatchId(), mylistList[num].id, onMylistUpdate, description);
         }
      }, showMylist = function(n) {
         var num = parseInt(n, 36);
         if (num === 0) {
           WatchController.showDefMylist();
         } else
         if (mylistList[num]) {
           WatchController.showMylist(mylistList[num].id);
         }
      }, seekVideo = function(v) {
        var vpos = WatchController.vpos(), currentVpos = vpos;
        if (v.match(/^([\-+]\d+)/)) {
          vpos += parseInt(RegExp.$1, 10) * 1000;
        } else
        if (v.match(/^\d+$/)) {
          vpos  = parseInt(v, 10) * 1000;
        } else
        if (v.match(/^(\d+):(\d+)$/)) {
          vpos = parseInt(RegExp.$1, 10) * 60 * 1000 + parseInt(RegExp.$2, 10) * 1000;
        }

        vpos = Math.max(vpos, 0);

        if (vpos != currentVpos) {
          console.log('seek video', vpos / 1000);
          WatchController.vpos(vpos);
        }
      };

      var isPlaying = false;
      $input
        .on('focus',    function(e) {
          isPlaying = WatchController.isPlaying();
          if (isAutoPause()) {
            WatchController.pause();
          }
          $view.addClass('active');
      }).on('blur',     function(e) {
          if (isAutoPause() && isPlaying) {
            WatchController.play();
          }
          $view.removeClass('active');
      }).on('keyup', function(e) {
          if (e.keyCode === 27) { // ESC
            prevent(e);
            $input.blur();
          }
      }).on('keydown', preventEsc).on('keyup', preventEsc);

      $autoPause.on('click', function() {
        conf.setValue('autoPauseInvisibleInput', !!$autoPause.attr('checked'));
      });

      $form
        .on('submit', function(e) {
          prevent(e);
          var val = $.trim($input.val());

          if (val.match(/^:m([0-9a-p])(.*)/)) {
            addMylist(RegExp.$1, RegExp.$2);
          } else
          if (val.match(/^:o([0-9a-p])/)) {
            showMylist(RegExp.$1);
          } else
          if (val.match(/^:s[ 　\s](.+)/)) {
            WatchController.nicoSearch(RegExp.$1, 'keyword');
          } else
          if (val.match(/^:t[ 　\s](.+)/)) {
            WatchController.nicoSearch(RegExp.$1, 'tag');
          } else
          if (val.match(/^:v[ 　\s]([0-9:+\-]+)$/)) {
            seekVideo(RegExp.$1);
          } else {
            WatchController.postComment(val);
          }

          $input.val('');
          $input.blur();
      });

      Mylist.loadMylistList(function(list) {
        mylistList = list.concat();
        mylistList.unshift({description: '', id: '', name: 'とりあえずマイリスト'});
        var isFx = Util.Browser.isFx();

        var tmp = [];
        for (var i = 0, len = mylistList.length; i < len; i++) {
          var c = i.toString(36);
          // それぞれのブラウザで補完しやすい形式に
          if (isFx) { // Fx
            tmp.push('<option value=":m' + c + '">:m'+c+'\t 「' + mylistList[i].name + '」に追加</option>');
            tmp.push('<option value=":o' + c + '">:o'+c+'\t 「' + mylistList[i].name + '」を開く</option>');
          } else {    // Chrome
            tmp.push('<option value=":m' + c + '">「' + mylistList[i].name + '」に追加</option>');
            tmp.push('<option value=":o' + c + '">「' + mylistList[i].name + '」を開く</option>');
          }
        }
        tmp.sort();
        if (isFx) {
          tmp.push('<option value=":s ">:s [キーワード検索]</option>');
          tmp.push('<option value=":t ">:t [タグ検索]</option>');
          tmp.push('<option value=":v ">:v [シーク(秒)]</option>');
         } else {
          tmp.push('<option value=":s ">キーワード検索</option>');
          tmp.push('<option value=":t ">タグ検索</option>');
          tmp.push('<option value=":v ">シーク(秒)</option>');
         }
       $dataList.html(tmp.join('\n'));
      });


      addStyle(css, 'invisibleInput');
      $('body').append($view).append($dataList);
    } //

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
        commentReady = videoReady = updated = false;
        clearCanvas();
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
      };
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
        popupDuration = 6000;

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
          }, 100);
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
        if (name === 'playerBgStyle') {
          $('#content')
            .toggleClass('w_flat_gray',  newValue === 'gray')
            .toggleClass('w_flat_white', newValue === 'white');
        } else
        if (name === 'compactVideoInfo') {
          $('#content, #outline').toggleClass('w_compact', newValue);
        }
      });

      if (conf.enableMylistDeleteButton) $('.videoExplorerBody').addClass('enableMylistDeleteButton');

      if (conf.noNicoru) $('body').addClass('w_noNicoru');

      if (conf.playerBgStyle !== '') $('#content').addClass('w_flat_' + conf.playerBgStyle);

      if (conf.compactVideoInfo) $('#content, #outline').addClass('w_compact');
      onWatchInfoReset(watchInfoModel);

      if (conf.enableYukkuriPlayButton) { Yukkuri.show(); }

      $('#videoHeaderMenu .searchText input').attr({'accesskey': '@', 'placeholder': '検索ワードを入力'}).on('focus', function() {
        WatchController.scrollTop(0, 400);
      });

      watch.PlayerInitializer.commentPanelViewController.commentPanelContentModel.addEventListener('change', function(name) {
        if (name === 'log_comment') {
          $('.logDateSelect .logTime input')[0].setAttribute('type', 'time');
        }
      });

      if (!w.Ads) {
        // hostsに 0.0.0.0 ads.nicovideo.jp してるとスクリプトエラーがうるさいのでダミーを入れる
        w.Ads = {
          Advertisement: function() { return {set: function() {}}; }
        };
      }

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
        testChannelVideo: function(def) {
          ChannelVideoList.load(function(result) {
            console.log('ChannelVideoList.load', result);
            expect(result.name).toEqual('ニコニコアプリちゃんねるの動画', 'チャンネル名');
            expect(result.list.length >= 30).toBeTrue('2013/08/28時点で33件');
            def.resolve();
          }, {id: '55', ownerName: 'ニコニコアプリちゃんねる'});
        },
        testNewNicoSearch: function(def) {
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
            def.resolve();
          });
        },
        testNewNicoSearchWrapperQuery: function(def) {
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
          def.resolve();
        },
        testNewNicoSearchWrapper: function(def) {
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
            def.resolve();

          });
        },
        testNicoSearchRelatedTag: function(def) {
          var related = new NicoSearchRelatedTag({});
          related.load('voiceroid', function(err, result) {
            console.log('testNicoSearchRelatedTag.load', err, result);
            console.log(expect(err));
            expect(err).toBeNull('err === null');
            expect(result.type).toEqual('tags', 'type === "tags"');
            expect(result.values).toBeTruthy('データが入っている');
            expect(typeof result.values[0]._rowid).toEqual('number', 'データに_rowidが入っている');
            expect(typeof result.values[0].tag)   .toEqual('string', 'データにtagが入っている');
            def.resolve();
          });
        },
        testSearchSuggest: function(def) {
          var suggest = new NicoSearchSuggest({});
          suggest.load('MMD', function(err, result) {
            console.log('testSearchSuggest.load', err, result);
            console.log(expect(err));
            expect(err).toBeNull('err === null');
            expect(result.candidates).toBeTruthy('suggestの中身がある');
            expect(result.candidates.length).toBeTruthy('suggestのlengthがある');
            def.resolve();
          });
        },
        testUpdateMylistComment: function(def) {
          // 一個以上マイリストがあって先頭のマイリストになにか登録されている必要がある
          var Mylist = WatchItLater.Mylist;
          var randomMessage = 'RND: ' + Math.random();

          var d = new $.Deferred;
          d.promise()
            .pipe(function() {
              var d = new $.Deferred();
              Mylist.loadMylistList(function(mylistList) {
                expect(mylistList.length > 0).toBeTruthy('マイリスト一覧が1件以上');
                console.log('先頭のマイリスト', mylistList[0].id, mylistList[0].name);
                var groupId = mylistList[0].id;
                if (mylistList.length <= 0) {
                  d.reject();
                  return;
                }
                d.resolve(groupId);
              });
              return d.promise();
            })
            .pipe(function(groupId) {
              var d = new $.Deferred();
              Mylist.reloadMylist(groupId, function(mylist) {
                expect(mylist.length > 0).toBeTruthy('マイリストアイテムが一個以上');
                var item = mylist[0];
                var watchId = item.item_data.watch_id;
                console.log('マイリスト先頭のアイテム', watchId, item.item_data.title);
                d.resolve(watchId, groupId);
              });
              return d.promise();
            })
            .pipe(function(watchId, groupId) {
              var d = new $.Deferred();
              Mylist.updateMylistItem(watchId, groupId, function(result) {
                expect(result).toEqual('ok', 'updateMylistItem() result=ok');
                d.resolve(watchId, groupId);
              }, randomMessage);
              return d.promise();
            })
            .pipe(Util.Deferred.wait(500))
            .pipe(function(watchId, groupId) {
              var d = new $.Deferred();
              Mylist.reloadMylist(groupId, function(newlist) {
                console.log('reloadMylist', groupId, newlist);
                expect(newlist[0].description)
                  .toEqual(randomMessage, 'マイリストコメントが更新できている => ' + newlist[0].description);
                d.resolve();
              });
              return d.promise();
            }).pipe(function() {
              def.resolve();
            });
          d.resolve();
        },
        testVideoRanking: function(def) {
          VideoRanking.load(null, {id: -4000})
            .pipe(function(result) {
              console.log('VideoRanking.load result:', result);
              expect(result.name).toEqual('カテゴリ合算', 'ダミーマイリストの名前が一致');
              expect(result.list.length).toEqual(300, 'カテゴリ合算ランキングは300件');
              expect(result.list[  0].title.indexOf('第001位')).toEqual(0,'ランキング1位のタイトル');
              expect(result.list[299].title.indexOf('第300位')).toEqual(0,'ランキング300位のタイトル');
              def.resolve();
            },
            function() {
              def.reject();
            });
        },
        testNicorepoVideo: function(def) {
          NicorepoVideo.loadAll(null, null)
            .pipe(function(result) {
              console.log('NicorepoVideo.loadAll result:', result);
              expect(result.name).toEqual('【ニコレポ】すべての動画', 'ダミーマイリストの名前が一致');
              expect(result.list).toBeTruthy('ニコレポがある');
              def.resolve();
            },
            function() {
              def.reject();
            });
        },
        testVideoInfoLoader: function(def) {
          var loader = new VideoInfoLoader({});
          $.when(

            loader.load('sm9').pipe(function(result) {
              expect(result.id).toEqual('sm9', '存在する動画ID');
              expect(result.length).toEqual('5:19', 'length');
              return this.resolve();
            }, function(err) {
              return this.reject();
            }),

            loader.load('sm1').pipe(function(result) {
              return new $.Deferred().reject().promise();
            }, function(resp) {
              expect(result.status).toEqual('fail', '存在しない動画ID');
              return new $.Deferred().resolve().promise();
            })

          ).pipe(function() { def.resolve(); }, function() { def.reject(); });
        }
      }); // end WatchApp.mixin

    } // end initTest

    LocationHashParser.initialize();
    initNews();
    initShortcutKey();
    initMouse();
    initTouch();
    initEvents();

    initSearchContent($, conf, w);
    initUserVideoContent($, conf, w);
    initMylistContent($, conf, w);
    initUploadedVideoContent($, conf, w);
    initDeflistContent($, conf, w);
    initVideoExplorer($, conf, w);

    initRightPanel($, conf, w);
    initLeftPanel($, conf, w);
    initVideoReview($, conf, w);

    initHidariue();
    initVideoCounter();
    initScreenMode();
    initPlaylist($, conf, w);

    initPageBottom($, conf, w);
    initPageHeader($, conf, w);
    initVideoTagContainer($, conf, w);

    initNicoS($, conf, w);
    initInvisibleCommentInput($, conf, w);
    initOtherCss();
    initCustomPlayerSize($, conf, w);
    initStageVideo($, conf, w);
    initHeatMap($, conf, w);
    initPopupMarquee();
    initMylistPanel($, conf, w);
    initOther();

    onWindowResizeEnd();

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

