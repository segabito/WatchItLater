// ==UserScript==
// @name         OneDrive VideoPlayer fix
// @namespace    http://github.com/segabito/
// @version      0.1.4
// @description  OneDriveの動画プレイヤーのフルスクリーン再生を復活&細かい調整
// @author       segabito
// @match        https://onedrive.live.com/prev?*
// @grant        none
// ==/UserScript==

(function() {
  var monkey = function() {
    var playerFrame = window, video;

    // https://onedrive.live.com/handlers/clientstring.mvc?mkt=ja-JP&group=Files&v=19.8.1712.2000&useRequiresJs=False
    var rrZW = top.window.live = top.window.live || {};
    var uUks = rrZW.shared = rrZW.shared || {};
    var ccEt = uUks.skydrive = uUks.skydrive || {};
    var MOFY = ccEt.shared = ccEt.shared || {};
    var jHBx = MOFY.video = MOFY.video || {};
    var videoLoadErrorMessage = jHBx["loaderror"] || "問題が発生したため、動画を再生できません。";


    var config = (function() {
      var prefix = 'OV_';
      var conf = {
        slideshow: false,
        fitMode: '',
      };
      return {
        get: function(key) {
          try {
            if (window.sessionStorage.hasOwnProperty(prefix + key)) {
              return JSON.parse(window.sessionStorage.getItem(prefix + key));
            }
            return conf[key];
          } catch (e) {
            return conf[key];
          }
        },
        set: function(key, value) {
          window.sessionStorage.setItem(prefix + key, JSON.stringify(value));
        }
      };
    })();

    var __parent_css__ = (function() {/*
   {* :fullscreen .OneUp-video, *}
      .fullscreen .OneUp-video
      {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .OneUp-detailsBar {
        min-height: inherit !important;
      }

      .fullscreen .OneUp-detailsBar,
      .fullscreen .OneUp-commandBar
      {
        display: none !important;
      }
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var __css__ = (function() {/*
        .fit16-9 .c-VideoPlayer .canvas {
          bottom: 0 !important;
        }

        .fit16-9 .c-HtmlDashVideoCanvas,
        .fit16-9 .c-HtmlDashVideoCanvas     video,
        .fit16-9 .c-HtmlDashlingVideoCanvas,
        .fit16-9 .c-HtmlDashlingVideoCanvas video,
        .fit16-9 .c-HtmlHlsVideoCanvas,
        .fit16-9 .c-HtmlHlsVideoCanvas      video,
        .fit16-9 .c-HtmlVideoCanvas,
        .fit16-9 .c-HtmlVideoCanvas         video
        {
          position: absolute;
          {*background: #666;*}
          {*top: -8.25%;*}
          top: -16.666666%;
          left: 0;
          width: 100%;
          height: 133.333333%;
        }

        #ovPanel {
          position: fixed;
          z-index: 10000;
          top:32px;
          right: 0px;
          min-width: 100px;
          {*transition: opacity 0.5s ease;*}
          background-color: #888;
          border: 1px solid #000;
          box-shadow: 4px 4px 0 black;
          opacity: 0;
        }

        #ovPanel:hover {
          opacity: 1;
        }

        #ovPanel button {
          cursor: pointer;
          opacity: 1;
        }

        .fit16-9 #ovPanel .fitMode {
          color: red;
        }

        .slideshow #ovPanel .slideshow {
          color: red;
        }

        .c-VideoPlayer.isPlaybackPanelVisible .c-PlaybackPanel {
          opacity: 0;
        }
        .c-VideoPlayer.isPlaybackPanelVisible .c-PlaybackPanel:hover {
          opacity: 1;
        }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var __panel__ = (function() {/*
      <div id="ovPanel">
        <button class="fitMode">fitMode</button>
        <button class="slideshow">slideshow</button>
      </div>

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');


    var addStyle = function(styles, targetWindow) {
      if (!targetWindow) { targetWindow = self; }
      var elm = targetWindow.document.createElement('style');
      elm.type = 'text/css';

      var text = styles.toString();
      text = targetWindow.document.createTextNode(text);
      elm.appendChild(text);
      var head = targetWindow.document.getElementsByTagName('head');
      head = head[0];
      head.appendChild(elm);
      return elm;
    };

    var FullScreen = {
      now: function() {
        if (top.document.fullScreenElement || top.document.mozFullScreen || top.document.webkitIsFullScreen) {
          return true;
        }
        return false;
      },
      request: function(target) {
        var elm = typeof target === 'string' ? top.document.getElementById(target) : target;
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
        if (!this.now()) { return; }

        if (top.document.cancelFullScreen) {
          top.document.cancelFullScreen();
        } else if (top.document.webkitCancelFullScreen) {
          top.document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          top.document.mozCancelFullScreen();
        }
      }
    };

    var toggleMonitorFull = function(v) {
      console.log('toggleMonitorFull!');
      var now = FullScreen.now();
      if (now || v === false) {
        console.log('fullscreen cancel');
        FullScreen.cancel();
      } else if (!now || v === true) {
        console.log('fullscreen request!');
        FullScreen.request(top.document.body);
      }
    };

    var isVideoFinished = function() {
      //console.log('"%s","%s"', playerFrame.$('.duration').text(), playerFrame.$('.currentTime').text());
      //console.log(playerFrame.$('.duration').text() === playerFrame.$('.currentTime').text());
      return playerFrame.$('.duration').text() === playerFrame.$('.currentTime').text();
    };

    var isVideoPlayingError = function() {
      return $('.errorMessage').text() === videoLoadErrorMessage ; // "問題が発生したため、動画を再生できません。";
    };

    var togglePlay = function() {
      $('.canvasOverlay').click();
    };

    var playNext = function() {
      try {
          var $nextButton = top.window.jQuery('.OneUp-button[data-automationid=nextButton]');
          top.$nextButton = $nextButton.click();
      } catch (e) {
        console.log('%cException: ', 'background: red;', e, $nextButton);
      }
      //window.parent.$('.OneUp-flipper--next').click();
    };

    var toggleFitMode = function(v) {
      $('body').toggleClass('fit16-9', v);
      config.set('fitMode', $('body').hasClass('fit16-9') ? 'fit16-9' : '');
    };

    var toggleSlideshow = function(v) {
      $('body').toggleClass('slideshow', v);
      config.set('slideshow', $('body').hasClass('slideshow'));
    };

    var timer = null, count = 0;
    var onTimer = function() {
      if (isVideoPlayingError()) {
        console.log('%cVideo Playing Error. count:%s', 'background: lightgreen;', count++);
        if (count < 200) {
          togglePlay();
          return;
        }
      }

      if (config.get('slideshow') && (isVideoFinished() || count >= 200)) {
        playNext();
        window.clearInterval(timer);
        return;
      }
    };

    var onFullscreenStatusChange = function() {
      var td = top.window.document;
      if (
        (td.webkitFullscreenElement && td.webkitFullscreenElement !== null) ||
        (td.mozFullscreenElement    && td.mozFullscreenElement !== null) ||
        (td.msFullscreenElement     && td.msFullscreenElement !== null) ||
        (td.fullscreenElement       && td.fullscreenElement !== null)
      ) {
        top.$('body').addClass('fullscreen');
      } else {
        top.$('body').removeClass('fullscreen');
      }
    };

    var initialize = function() {
      console.log('%cinitialize start', 'background: lightgreen;');
      // for debug
      parent.window.video = video = $('video')[0];
      parent.playerFrame = window;

      addStyle(__css__);
      if (!parent.hasCssAdded) {
        addStyle(__parent_css__, parent);
        parent.hasCssAdded = true;
      }

      var td = top.window.document;
      td.addEventListener('webkitfullscreenchange', onFullscreenStatusChange);
      td.addEventListener('mozfullscreenchange',    onFullscreenStatusChange);
      td.addEventListener('msFullscreenChange',     onFullscreenStatusChange);
      td.addEventListener('fullscreenchange',       onFullscreenStatusChange);
      window.onbeforeunload = function() {
        td.removeEventListener('webkitfullscreenchange', onFullscreenStatusChange);
        td.removeEventListener('mozfullscreenchange',    onFullscreenStatusChange);
        td.removeEventListener('msFullscreenChange',     onFullscreenStatusChange);
        td.removeEventListener('fullscreenchange',       onFullscreenStatusChange);
      };

      if (!top.ovpWatcherInitialized) {
        top.ovpWatcherInitialized = true;
        var watcher = function() {
            var config = (function() {
              var prefix = 'OV_';
              var conf = {
                slideshow: false,
                fitMode: '',
              };
              return {
                get: function(key) {
                  try {
                    if (window.sessionStorage.hasOwnProperty(prefix + key)) {
                      return JSON.parse(window.sessionStorage.getItem(prefix + key));
                    }
                    return conf[key];
                  } catch (e) {
                    return conf[key];
                  }
                },
                set: function(key, value) {
                  window.sessionStorage.setItem(prefix + key, JSON.stringify(value));
                }
              };
            })();
            var playNext = function() {
              try {
                  var $nextButton = top.window.jQuery('.OneUp-button[data-automationid=nextButton]');
                  top.$nextButton = $nextButton.click();
              } catch (e) {
                console.log('%cException: ', 'background: red;', e, $nextButton);
              }
              //window.parent.$('.OneUp-flipper--next').click();
            };
            var timer = window.setInterval(function() {
            	//console.log('timer!',
            	//	config.get('slideshow'),
            	//	$('.ThumbnailTile-image:last img').is(':visible'),
            	//	$('.od-ItemVideoPlayer-frame').length
            	//	);
                if (config.get('slideshow') && $('.ThumbnailTile-image:last img').is(':visible') && $('.od-ItemVideoPlayer-frame').length < 1) {
					//console.log('playNext!');
                    playNext();
                }
            }, 3000);
        };
        var script = document.createElement("script");
        script.id = "OneDriveVideoPlayerFixWatcher";
        script.setAttribute("type", "text/javascript");
        script.setAttribute("charset", "UTF-8");
        script.appendChild(top.document.createTextNode('(' + watcher + ')();'));
        top.document.body.appendChild(script);
     }

      parent.$imageButton = $('#ImageButton-20_0').off().on('click', function() { toggleMonitorFull(); });
      var $panel = $(__panel__);

      $panel.find('.fitMode')  .on('click', toggleFitMode);
      $panel.find('.slideshow').on('click', toggleSlideshow);

      $('body').toggleClass('fit16-9', config.get('fitMode') === 'fit16-9');
      $('body').toggleClass('slideshow', config.get('slideshow'));

      $('body').append($panel);

      timer = window.setInterval(onTimer, 1000);
      console.log('%cinitialize end', 'background: lightgreen;');
    };

    var initTimer = window.setInterval(function() {
      if (window.$) {
        window.clearInterval(initTimer);
        window.setTimeout(initialize, 5000);
      }
    }, 1000);
  };

  var script = document.createElement("script");
  script.id = "OneDriveVideoPlayerFix";
  script.setAttribute("type", "text/javascript");
  script.setAttribute("charset", "UTF-8");
  script.appendChild(document.createTextNode('(' + monkey + ')();'));
  document.body.appendChild(script);
})();

/*
 *
ただのメモ
playerFrame = ($('.ItemVideoPlayer-frame')[0] && $('.ItemVideoPlayer-frame')[0].contentWindow);

playerFrame.location.href
playerFrame.$('.errorMessage').text();



if (playerFrame.$('.errorMessage').text() === "問題が発生したため、動画を再生できません。") { playerFrame.$('.canvasOverlay').click(); }

.c-HtmlDashVideoCanvas, .c-HtmlDashVideoCanvas video, .c-HtmlDashlingVideoCanvas, .c-HtmlDashlingVideoCanvas video, .c-HtmlHlsVideoCanvas, .c-HtmlHlsVideoCanvas video, .c-HtmlVideoCanvas, .c-HtmlVideoCanvas video {
  position: absolute;
  background: #666;
  top: -8.25%;
  left: 0;
  width: 100%;
  height: 116.5%;
}
.c-VideoPlayer.isPlaybackPanelVisible .c-PlaybackPanel {
}

*/
