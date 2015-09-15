// ==UserScript==
// @name        Separate_Offiical_Video
// @namespace   https://github.com/segabito/
// @description ランキングにある公式動画を左に分離するやつ
// @include     http://www.nicovideo.jp/ranking*
// @version     0.0.1
// @grant       none
// ==/UserScript==

(function($) {
  var monkey = function() {

    var __css__ = (function() {/*
      @media screen and (max-width: 1049px) {
        .officialVideoContainer  {
          display: none !important;
        }
      }

      @media screen and (min-width: 1049px) {

        .container .inner {
          width: 1348px;
        }
        .container .columns {
          width: auto;
        }
        .container .column .contentBody .item.official {
          display: none;
        }

        .officialVideoContainer  {
          display: block;
          width: 300px;
          padding-left: 12px;
          padding-right: 12px;
          background: rgba(0, 0, 0, 0) url("http://res.nimg.jp/images/modules/transmission/sub_bg.png") repeat-y scroll 0 0
        }

        .officialVideoContainer  .contentHeader {
          margin-bottom: 8px;
        }

        .officialVideoContainer .item {
          list-style: none;
          margin-top: 12px;
        }

        .officialVideoContainer .rankingNumWrap {
          float: left;
          white-space: nowrap;
          margin-right: 12px;
        }
        .officialVideoContainer .rankingNum {
          color: #666;
          float: left;
          font-family: impact;
          font-size: 154%;
          text-align: center;
          width: 20px;
        }
        .officialVideoContainer .rankingPt {
          display: none;
        }

        .officialVideoContainer .itemContent .itemTitle a:link {
          color: #006699;
        }

        .officialVideoContainer .itemContent .itemTitle a:visited {
          color: #666666;
        }

        .officialVideoContainer .itemThumbBox {
          float: left;
          margin-right: 8px;
          margin-bottom: 4px;
          position: relative;
        }
        .officialVideoContainer .itemThumb {
          display: table;
          height: 54px;
          overflow: hidden;
          position: relative;
          table-layout: fixed;
          text-align: center;
          vertical-align: middle;
          width: 96px;
        }
        .officialVideoContainer .itemThumb .itemThumbWrap {
          display: table-cell;
          height: 54px;
          text-align: center;
          vertical-align: middle;
          width: 96px;
        }
        .officialVideoContainer .noImage {
          width: 96px;
          height: 54px;
        }
        .officialVideoContainer .thumb {
          width: 96px !important;
          height: 72px !important;
          margin-top: -9px !important;
          margin-bottom: -9px !important;
        }

        .officialVideoContainer .videoLength {
          background-color: rgba(0, 0, 0, 0.8);
          bottom: 0;
          color: #fff;
          font-size: 77%;
          padding: 0;
          position: absolute;
          right: 0;
        }

        .officialVideoContainer .adComment {
          display: none;
        }

        .officialVideoContainer .itemDescription {
          display: none;
        }

        .officialVideoContainer .itemComment {
          width: 300px;
          box-sizing: border-box;
          overflow: hidden;
          clear: both;
          border: 1px solid #ccc;
          background: #fff;
          border-radius: 4px;
          padding: 4px;
          margin:4px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .officialVideoContainer .itemData {
        }
        .officialVideoContainer .itemData .count {
          color: #999;
          font-size: 85%;
          margin-bottom: 4px;
        }
        .officialVideoContainer .itemData .count .value {
          color: #333;
          padding: 0 4px 0 2px;
        }

        .sideFollowAds {
          position: static !important;
        }
      }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var addStyle = function(styles, id) {
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
    };

    // コミュニティ動画やマイメモリーもtrueになってしまうが、それらがランキング入りすることはそうそうないから考えない
    var isOfficialVideoMaybe = function(videoId) {
      return !videoId.match(/^(sm|nm)\d+/);
    };

    var init = function() {
      addStyle(__css__);
      var $items = $('.item.videoRanking');
      var $officialVideoContainer = $('<div class="column officialVideoContainer list"><header class="contentHeader"><h1 class="title">チャンネル・公式動画ランキング</h1></header></div>');
      $items.each(function(i, item) {
        console.log(i, item);
        var $item = $(item);
        var videoId = $item.attr('data-id');
        if (isOfficialVideoMaybe(videoId)) {
          $officialVideoContainer.append($item.clone());
          $item.addClass('official');
        }
      });
      jQuery('#web_pc_sidefollow_container').parent().parent().addClass('sideFollowAds');
      $('.container .inner .column.main').before($officialVideoContainer);
    };

    init();
  };

  window.setTimeout(function() {
    try {
      monkey();
    } catch (e) {
      console.error('Exeption!', e);
    }
  }, 100);
})(window.jQuery);
