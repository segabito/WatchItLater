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
// @version        1.130406
// ==/UserScript==

// TODO:
// マイリスト外すUIととりまい外すUIが統一されてないのをどうにかする
// 最後まで再生したら自動でとりマイから外す機能with連続再生
// お気に入りユーザーの時は「@ジャンプ」許可
// 軽量化

// * ver 1.130406
// - 小さいモニターむけの調整

// * ver 1.130404
// - 省スペースモードの微調整

// * ver 1.130403
// - 「省スペース化の設定」項目を追加。 原宿ぐらいの密度になります。
// - 設定ボタン・プレイリスト開閉ボタンの位置変更
// -

// * ver 1.130330
// - その他 ＞ グラデーションや角の丸みをなくす設定
// - プレイリスト保存リンクの調整
// - 細かい調整

// * ver 1.130328
// - 本家側の更新でプレイヤーの位置計算が変わったのに対応
//　 内部的に色々変わってるので、動かなくなってる機能があるかもしれません

// * ver 1.130325
// - 左パネルを非表示にする設定
// - プレイヤー下の項目(市場・ニコメンド・レビュー)の表示設定

// * ver 1.130324
// - 細かい不具合修正
// - 本家側の更新でゆっくり再生ボタンが効かなくなったのを修正

// * ver 1.130319
// - 「プレイリストが消えないモード」追加(sessionStorage版)

// * ver 1.130318
// - プレイリストが消えないモード追加(実験用)
// - プレイリストメニューに、「プレイリスト保存用リンク」を追加
// - 検索画面のニコレポに投稿者アイコンを表示
// - その他細かい修正

// * ver 1.130314
// - ニコニコニュースを消す設定を追加

// * ver 1.130312
// - 真全画面モードのダブルクリック切り替えに問題があったので一旦保留
// - ブラウザ全画面再生中でも、右下にカーソルを持っていくとタイトルと再生数を確認できるようにした (Chrome限定)
// - コメントパネル上にNG共有レベル設定を追加できるようにした

// * ver 1.130311
// - 真全画面モード調整。フルHDモニターで上端10ピクセルの枠が残っていたのを修正

// * ver 1.130309
// - 【地味に便利】全画面モード時に自動で操作パネルとコメント入力欄を隠す設定
// - 【地味に便利】黒枠のない、真のブラウザ全画面モード追加。 Chromeは画面ダブルクリックでいつでも切り替え可能
// - 【地味に便利】ユーザーの動画一覧を開いた時、公開マイリスト一つだけだった場合は自動でそのマイリストを開く

// * ver 1.130308
// - コメント入力欄が常識的な太さになったのに対応
// - タグの高さ自動調整が効かなくなったのを修正
// - タグ検索結果にニコニ広告が出るようになったのに対応
// - プレイリストに件数表示
// - その他3/7の本家側更新に対応

// * ver 1.130307
// - https://～がリンクできてなかったのを修正
// - 検索メニューに検索ワード入力欄追加
// - お気に入りちゃんねるにも「★」を表示
// - 若干の安定化

// * ver 1.130306
// - 横が狭い時の検索画面の表示を修正
// - プレイヤーサイズの計算を微妙に間違っていたのを修正

// * ver 1.130305
// - 「再生開始時にコメント表示をOFF」または「前回の状態」にする設定を追加
// - Chrome v26対策

// * ver 1.130303b
// - 説明文中の静画リンクも展開表示するようにした
// - タッチ操作の調整

// * ver 1.130303
// - 検索画面の「閉じる」ボタンが消えるようになったのを修正
// - お気に入り登録済みユーザーは名前の横に★を表示

// * ver 1.130302
// - 次のバージョンのChromeでQwatchがぶっ壊れる問題の暫定対処
//  - http://blog.nicovideo.jp/niconews/ni038155.html ここの変更点を、ほぼ解決
//  - 問題点: 検索画面のスクロールがちょっとガクガクする。 コメントパネルが隠れる。 広告が消える

// * ver 1.130227
// - 動画説明文中のURLがリンクされるようにした
// - マウスがリンクをかすっただけでメニューが出るのを修正
// - 一部CSS修正

// * ver 1.130226
// - 右ボタン＋ホイールで音量調整した時にメニューが出ないように修正

// * ver 1.130217
// - 画面モードまわりで、なんとなく不便だと思っていた仕様を変更
// 　再生終了後に全画面をオフにする設定でも、連続再生中は解除しない
// 　自動で検索画面にする設定でも、全画面にしていたら移行しない
// 　全画面 ← →検索画面切り替え時の挙動など
// 　(検索画面から設定を開くと画面がバグる問題は実害がないので放置しています)
// - CSSを少し軽量化

// * ver 1.130216
// - 説明文の動画やマイリストリンクの下に、タイトルとサムネを表示
//　 (※ニコメンド領域から情報を拾ってるだけなので、出せない場合もあります)
// - ショートカットキー「ミュート」追加
// - 細かい修正

// * ver 1.130215
// - タッチパネルへの対応テスト。(Chromeでしかうまく動かない)
//   マウスがなくても、動画リンクを右フリックでマイリストメニューが出るように。
//   画面を右フリックすると一部のボタンやリンクが大きくなるモード
// - ショートカットキーの追加「動画投稿者の関連動画を表示」「右下で選択中のマイリストに登録」
// - CSSを少し軽量化
// - 細かい修正

// * ver 1.130209
// - 【地味に便利】マウスの左か右ボタン＋ホイールでどこでも音量調整。とっさに音量を変えたい時に便利 (デフォルトは無効)
// - マイリスト登録ボタンをShift+クリックするとマイリストコメントが入力できる隠しコマンド
//　 Firefoxだとプレイヤー上では効きません
// - 各種ショートカットキーの設定を追加 (デフォルトは無効・キーは変更可能)
//　 ※Chromeだとコメント入力中も反応してしまいます。 逆にFirefoxでは、プレイヤーにフォーカスがあると反応しません。いい解決法がないか調査中
//　 「一発とりマイ登録」「とりマイを開く」「検索を開く」「コメント表示ON/OFF」「プレイヤーの位置にスクロール」等
//　 徐々に追加していく予定
// - タッチパネルで検索メニューを触った時に行間を広くする隠し機能 (指で選択しやすくするため)

// * ver 1.130204
// - 一部のキーボードについている[一時停止/再生]・[次の曲]・[前の曲]ボタンに対応させてみた。 Chromeしか使えないぽい
// - AdBlockが有効な状態でもある程度動くようにしてみた

// * ver 1.130202
// - ニコるを見えなくする設定を追加。(※見えなくなってるだけで、根本的な消滅はまだできていません)

// * ver 1.130201
// - 検索結果にマイリストコメントが見えないのは不便ですよねーってことで追加 (一列の時だけ)

// * ver 1.130128
// - 検索結果が1列表示の時「再生リストに追加しました」が上の動画に被るのを防ぐ
// - 【地味に便利】左下にゆっくり再生(スロー再生)ボタンをつけてみた。スペース連打より少し融通が利く

// * ver 1.130127
// - 【地味に便利】プレイリスト拡張メニュー追加 (シャッフル・消去・リストに追加)
// - ニコレポ検索を少し見やすく修正

// * ver 1.130126
// - 【地味に便利】検索結果が1列表示の時は、投稿時間表示を "XXXX年XX月XX日" → "XXXX年XX月XX日 XX:XX:XX" にする
// - 【地味に便利】市場やニコメンドに中身があるかどうか、いちいち開かなくてもタブの色だけでわかるように

// * ver 1.130124
// - ユーザーの投稿動画一覧のソート順おかしい問題が直ってたので、こっちで勝手にやっていた修正コードを削除
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
      wideCommentPanel: true, // コメントパネルをワイドにする
      removeLeftPanel: false, // 左パネルを消滅させる
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
      enableYukkuriPlayButton: false, // スロー再生ボタンを表示する
      noNicoru: false, // ニコるボタンをなくす
      enoubleTouchPanel: false, // タッチパネルへの対応を有効にする
      mouseClickWheelVolume: 0, // マウスボタン+ホイールで音量調整を有効にする 1 = 左ボタン 2 = 右ボタン
      enableAutoPlaybackContinue: false, // 一定時間操作しなかくても自動再生を続行
      enableQTouch: false, // タッチパネルモード有効
      commentVisibility: 'visible', // 'visible', 'hidden', 'lastState'
      lastCommentVisibility: 'visible',
      controllerVisibilityInFull: '', // 全画面時に操作パネルとコメント入力欄を出す設定
      enableTrueBrowserFull: false, // フチなし全画面モードにする (Chromeは画面ダブルクリックで切り替え可能)
      enableSharedNgSetting: false, //
      hideNicoNews: false, // ニコニコニュースを消す
      hashPlaylistMode: 0,    // location.hashにプレイリストを保持 0 =無効 1=連続再生時 2=常時
      storagePlaylistMode: '', // localStorageにプレイリストを保持
      compactVideoInfo: false, //

      hideVideoExplorerExpand: false, // 「動画をもっと見る」ボタンを小さくする
      nicommendVisibility: 'visible', // ニコメンドの表示 'visible', 'underIchiba', 'hidden'
      ichibaVisibility:    'visible', // 市場の表示 '',   'visible', 'hidden'
      reviewVisibility:    'visible', // レビューの表示   'visible', 'hidden'

      flatDesignMode: '',  // 'on' グラデーションや角丸をなくす

      shortcutDefMylist:          {char: 'M', shift: true,  ctrl: false, alt: false, enable: false}, // とりマイ登録のショートカット
      shortcutMylist:             {char: 'M', shift: false, ctrl: true , alt: false, enable: false}, // マイリスト登録のショートカット
      shortcutOpenSearch:         {char: 'S', shift: true,  ctrl: false, alt: false, enable: false}, // 検索オープンのショートカット
      shortcutOpenDefMylist:      {char: 'D', shift: true,  ctrl: false, alt: false, enable: false}, // とりマイオープンのショートカット
      shortcutCommentVisibility:  {char: 'V', shift: true,  ctrl: false, alt: false, enable: false}, // コメント表示ON/OFFのショートカット
      shortcutScrollToNicoPlayer: {char: 'P', shift: true,  ctrl: false, alt: false, enable: false}, // プレイヤーまでスクロールのショートカット
      shortcutShowOtherVideo:     {char: 'U', shift: true,  ctrl: false, alt: false, enable: false}, // 投稿者の関連動画表示のショートカット
      shortcutMute:               {char: 'T', shift: true,  ctrl: false, alt: false, enable: false}, // 音量ミュートのショートカット


      watchCounter: 0, // お前は今までに見た動画の数を覚えているのか？をカウントする
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

  (function() {
    var style = [
    '\
    /* 動画タグとプレイリストのポップアップ */\
      #videoTagPopupContainer {\
      }\
      #videoTagPopupContainer.w_touch {\
        line-height: 200%; font-size: 130%;\
      }\
      #videoTagPopupContainer.w_touch .nicodic{\
        margin: 4px 14px;\
      }\
      .tagItemsPopup {\
        background: #eef; \
      }\
      .playlistMenuPopup {\
        background: #666; color: white; padding: 4px 8px;\
      }\
      .playlistMenuPopup.w_touch {\
        line-height: 250%;\
      }\
      #playlistSaveDialog {\
        display: none;\
      }\
      #playlistSaveDialog.show {\
        display: block;\
      }\
      #playlistSaveDialog.show .shadow{\
        position: fixed;\
        top: 0; left: 0; width: 100%; height: 100%;\
        background: #000; opacity: 0.5;\
        z-index: 30000;\
      }\
      #playlistSaveDialog.show .formWindow{\
        position: fixed;\
        margin: 0 auto;\
        text-align: center;\
        width: 100%;\
        top: 45%;\
        z-index: 30001;\
      }\
      #playlistSaveDialog      .formWindow .formWindowInner{\
        -webkit-transition: opacity 1s ease-out;\
        transition: opacity 1s ease-out;\
        opacity: 0;\
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner{\
        text-align: left;\
        opacity: 1;\
        margin: 0 auto;\
        background: #f4f4f4;\
        width: 500px;\
        padding: 8px;\
        border: 1px solid;\
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner a{\
        font-weight: bolder;\
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner a:hover{\
        text-decoration: underline; background: white;\
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner label{\
        margin: 8px;\
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner input{\
        \
      }\
      #playlistSaveDialog.show .formWindow .formWindowInner .desc{\
        font-size: 80%;\
      }\
      .tagItemsPopup, .playlistMenuPopup {\
        position: absolute; \
        min-width: 150px; \
        font-Size: 10pt; \
        z-index: 2000000; \
        box-shadow: 2px 2px 2px #888;\
      }\
      .tagItemsPopup ul,.tagItemsPopup ul li, .playlistMenuPopup ul, .playlistMenuPopup ul li  {\
        position: relative; \
        list-style-type: none; \
        margin: 0; padding: 0; \
      }\
      .playlistMenuPopup ul li {\
        cursor: pointer;\
      }\
      .playlistMenuPopup ul li.savelist {\
        color: #aaa;\
      }\
      .playlistMenuPopup ul li:hover {\
        text-decoration: underline; background: #888;\
      }\
      .tagItemsPopup li a{\
      }\
      .tagItemsPopup .nicodic {\
        margin-right: 4px; \
      }\
      .tagItemsPopup .icon{\
        width: 17px; \
        height: 15px; \
        \
      }\
    /* マイリスト登録パネル */\
      .mylistPopupPanel {\
        height: 24px; \
        z-index: 10000; \
        /*border: 1px solid silver;\
        border-radius: 3px; */\
        padding: 0;\
        margin: 0;\
        overflow: hidden; \
        display: inline-block; \
        background: #eee; \
      }\
      .mylistPopupPanel.w_touch {\
        height: 40px;\
      }\
    /* マウスホバーで出るほうのマイリスト登録パネル */\
      .mylistPopupPanel.popup {\
        position: absolute; \
        z-index: 1000000;\
        box-shadow: 2px 2px 2px #888;\
      }\
    /* マイリスト登録パネルの中の各要素 */\
      .mylistPopupPanel .mylistSelect {\
        width: 64px; \
        margin: 0;\
        padding: 0;\
        font-size: 80%; \
        white-space: nowrap; \
        background: #eee; \
        border: 1px solid silver;\
      }\
    /* 誤操作を減らすため、とりマイの時だけスタイルを変える用 */\
      .mylistPopupPanel.w_touch button {\
        padding: 8px 18px;\
      }\
      .mylistPopupPanel.w_touch .mylistSelect {\
        font-size: 170%; width: 130px;\
      }\
      .mylistPopupPanel.deflistSelected button {\
      }\
      .mylistPopupPanel.mylistSelected  button {\
        color: #ccf; \
      }\
      .mylistPopupPanel button {\
        margin: 0; \
        font-weight: bolder; \
        cursor: pointer;  \
      }\
      .mylistPopupPanel button:active, #outline .playlistToggle:active, #outline .openVideoExplorer:active, #content .openConfButton:active {\
        border:1px inset !important\
      }\
      .mylistPopupPanel button:hover, #outline .playlistToggle:hover, #outline .openVideoExplorer:hover, #outline .openConfButton:hover, #yukkuriPanel .yukkuriButton:hover {\
        border:1px outset\
      }\
      #yukkuriPanel .yukkuriButton.active {\
        border:1px inset\
      }\
\
      .mylistPopupPanel .mylistAdd, .mylistPopupPanel .tagGet, #yukkuriPanel .yukkuriButton {\
        border:1px solid #777; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #eee; background-color: #888; margin: 0;\
      }\
      .mylistPopupPanel.deflistSelected {\
        color: #ff9;\
      }\
      .mylistPopupPanel .deflistRemove, #yukkuriPanel .yukkuriButton.active{\
        border:1px solid #ebb7b7; font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3);font-weight:bold; text-align: center; color: #FFFFFF; background-color: #f7e3e3;\
      }\
      #content .openConfButton {\
        border:1px solid #bbb; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 4px; text-shadow: 1px 1px 0 rgba(0,0,0,0.3); text-align: center; color: #444; background-color: #ccc; margin: 0;\
      }\
      #outline .playlistToggle, #outline .openVideoExplorer, #outline .openConfButton {\
        border:1px solid #444; cursor: pointer; font-family:arial, helvetica, sans-serif; padding: 0px 4px 0px 4px; box-shadow: 1px 1px 0 rgba(0,0,0,0.3); text-align: center; color: #444; background-color: #ccc; margin: 0;\
        height: 24px; border-radius: 0 0 8px 8px;\
      }\
      #outline .openConfButton { padding: 0 8px; letter-spacing: 4px; width: 60px; }\
        .mylistPopupPanel.deflistSelected {\
          color: #ff9;\
        }\
        .mylistPopupPanel .deflistRemove, #yukkuriPanel .yukkuriButton.active{\
          border:1px solid #ebb7b7; font-family:arial, helvetica, sans-serif; padding: 0px 6px 0px 6px; text-shadow: -1px -1px 0 rgba(0,0,0,0.3); text-align: center; color: #FFFFFF; background-color: #f7e3e3;\
        }\
        .mylistPopupPanel.mylistSelected .deflistRemove {\
          display: none; \
        }\
        .mylistPopupPanel .closeButton{\
          color: #339; \
          padding: 0;\
          margin: 0;\
          font-size: 80%;\
          text-decoration: none;\
        }\
        .mylistPopupPanel .newTabLink{\
          padding: 0 2px; text-decoration: underline; text-shadow: -1px -1px 0px #442B2B;\
        }\
        .mylistPopupPanel.fixed .newTabLink, .mylistPopupPanel.fixed .closeButton {\
          display: none;\
        }\
\
\
\
\
      /* 全画面時にタグとプレイリストを表示しない時*/\
      body.full_and_mini.full_with_browser #playerContainerSlideArea{\
        margin-bottom: 0 !important;\
      }\
      body.full_and_mini.full_with_browser #playlist{\
        z-index: auto;\
      }\
      body.full_and_mini.full_with_browser .generationMessage{\
        display: inline-block;\
      }\
      /* 全画面時にタグとプレイリストを表示する時 */\
      body.full_with_browser #playlist{\
        z-index: 100;\
      }\
      body.full_with_browser .generationMessage{\
        display: none;\
      }\
      body.full_with_browser .browserFullOption{\
        padding-right: 200px;\
      }\
      /* 全画面時にニュースを隠す時 */\
      body.full_with_browser.hideNewsInFull #playerContainerSlideArea{\
        margin-bottom: -37px;\
      }\
      /* 少しでも縦スクロールを減らすため、動画情報を近づける。人によっては窮屈に感じるかも */\
      #outline {\
        margin-top: -16px;\
      }\
      #outline #feedbackLink{\
        \
      }\
      #outline .videoEditMenuExpand{\
        position: absolute;right: 0;top: 26px; z-index: 1;\
      }\
      /* ヘッダに表示する再生数 */\
      #videoCounter {\
        color: #ff9; font-size: 70%;\
      }\
      /* 左に表示する動画情報 */\
      #leftPanel .leftVideoInfo, #leftPanel .leftIchibaPanel {\
        padding: 0px 0px 0 0px; width: 196px; height: 100%;\
        position:absolute; top:0; right:0;\
        display:none; \
      }\
      #content:not(.w_flat) #leftPanel .leftVideoInfo, #content:not(.w_flat) #leftPanel .leftIchibaPanel {\
        border-radius: 4px;\
      }\
      #leftPanel .leftVideoInfo {\
        background: #bbb; text-Align: left; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;\
      }\
      #leftPanel .leftIchibaPanel {\
        background: #eee; text-Align: center; overflow-x: hidden; overflow-Y: auto; box-shadow: none; font-size: 90%;\
      }\
      #leftPanel .leftVideoInfo .leftVideoInfoInner {\
        padding: 0 4px; position: relative;\
      }\
      #leftPanel .leftVideoInfo .videoTitleContainer{\
        background: #ccc; text-align: center;  color: #000; margin: 6px 0 0;\
      }\
      #content:not(.w_flat) #leftPanel .leftVideoInfo .videoTitleContainer{\
        border-radius: 4px 4px 0 0;\
      }\
      #leftPanel .leftVideoInfo .videoThumbnailContainer{\
        background: #ccc; text-align: center; color: #000; margin: 0;\
      }\
      #leftPanel .leftVideoInfo .videoThumbnailContainer img {\
        cursor: pointer;\
      }\
      #leftPanel .leftVideoInfo .videoTitle{\
        \
      }\
      #leftPanel .leftVideoInfo .videoPostedAt{\
        color: #333;\
      }\
      #leftPanel .leftVideoInfo .videoStats{\
        font-size:90%;\
      }\
      #leftPanel .leftVideoInfo .videoStats li{\
        display: inline-block; margin: 0 2px;\
      }\
      #leftPanel .leftVideoInfo .videoStats li span{\
        font-weight: bolder;\
      }\
      #leftPanel .leftVideoInfo .videoStats .ranking{\
        display: none !important;\
      }\
      #leftPanel .leftVideoInfo .videoInfo{\
        background: #ccc; text-align: center; \
      }\
      #leftPanel .leftVideoInfo .videoDescription{\
        overflow-x: hidden; text-align: left;\
      }\
      #leftPanel .leftVideoInfo .videoDescriptionInner{\
        margin: 0 4px;\
      }\
      #leftPanel .leftVideoInfo .videoDetails{\
        min-width: 130px;\
      }\
      #leftPanel .leftVideoInfo .videoDetails a{\
        margin: auto 4px;\
      }\
      #leftPanel .leftVideoInfo .userIconContainer .userName, #leftPanel .leftVideoInfo .ch_profile a{\
        display: block;\
      }\
      #leftPanel .leftVideoInfo .userIconContainer, #leftPanel .leftVideoInfo .ch_profile{\
        background: #ccc; width: 100%; text-align: center; float: none;\
      }\
      #content:not(.w_flat) #leftPanel .leftVideoInfo .userIconContainer, #content:not(.w_flat) #leftPanel .leftVideoInfo .ch_profile{\
        border-radius: 0 0 4px 4px;\
      }\
      #leftPanel .leftVideoInfo .userIconContainer .usericon, #leftPanel .leftVideoInfo .ch_profile img{\
        max-width: 130px; width: auto; height: auto; border: 0;\
      }\
      #leftPanel .leftVideoInfo .descriptionThumbnail {\
        text-align: left; font-size: 90%; padding: 4px; background: #ccc;/*box-shadow: 2px 2px 2px #666;*/\
        min-height: 60px; margin-bottom: 4px; font-weight: normal; color: black;\
      }\
      #content:not(.w_flat) #leftPanel .leftVideoInfo .descriptionThumbnail {\
        border-radius: 4px;\
      }\
      #leftPanel .leftVideoInfo .descriptionThumbnail.video img{\
        height: 50px; cursor: pointer; float: left;\
      }\
      #leftPanel .leftVideoInfo .descriptionThumbnail.mylist img{\
        height: 40px; cursor: pointer;\
      }\
      #leftPanel .leftVideoInfo .descriptionThumbnail.illust img{\
        height: 60px; cursor: pointer; float: left;\
      }\
      #leftPanel .leftVideoInfo a.otherSite {\
        font-weight: bolder; text-decoration: underline; \
      }\
      body:not(.videoSelection) #leftPanel.removed {\
        display: none; left: 0px;\
      }\
      body:not(.videoSelection) #leftPanel.removed .leftVideoInfo{\
        display: none; width: 0px !important; border: none; margin: 0; padding: 0; right: auto;\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem {\
        width: 180px; display:inline-block; vertical-align: top;\
        margin: 4px 3px; border 1px solid silver;\
      }\
      body.videoSelection #content.w_adjusted:not(.w_flat) #leftIchibaPanel .ichiba_mainitem {\
        border-radius: 8px\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .thumbnail span {\
        font-size: 60px;\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem>div>dt {\
        height: 50px;position: relative;\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonUe {\
        position: absolute;width: 100%;\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonUe {\
        position: absolute;\
      }\
      body.videoSelection #content.w_adjusted #leftIchibaPanel .ichiba_mainitem .balloonShita {\
        position: absolute;\
      }\
\
      #leftPanel.videoInfo, #leftPanel.ichiba{\
        background: none;\
      }\
\
      #leftPanel.videoInfo  #leftVideoInfo.isFavorite .userName:after, #leftPanel.videoInfo  #leftVideoInfo.isFavorite.isChannel .videoOwnerInfoContainer:after{\
        content: \'★\'; color: gold; text-shadow: 1px 1px 1px black; \
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
        display:none; background: #666; position: absolute; right: 4px; top: -27px; list-style-type: none; padding: 4px 6px 3px 60px; height: 20px;\
      }\
      #content:not(.w_flat) #leftPanelTabContainer {\
        border-radius: 4px 4px 0px 0px;\
      }\
      #leftPanelTabContainer.w_touch {\
        top: -40px; height: 33px;\
      }\
      #leftPanel:hover #leftPanelTabContainer{\
        display:block;\
      }\
      #leftPanelTabContainer .tab {\
        display: inline-block; cursor: pointer; background: #999; padding: 2px 4px 0px; border-width: 1px 1px 0px; \
      }\
        #leftPanelTabContainer.w_touch .tab {\
          padding: 8px 12px 8px;\
        }\
        #content:not(.w_flat) #leftPanelTabContainer .tab {\
          border-radius: 4px 4px 0px 0px;\
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
      #leftPanel.ichibaEmpty #leftPanelTabContainer .ichiba, #leftPanel.nicommendEmpty #leftPanelTabContainer .nicommend {\
        color: #ccc;\
      }\
\
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
      }\
      #leftIchibaPanel .ichiba_mainitem a:hover{\
        background: #eef;\
      }\
      #leftIchibaPanel .ichiba_mainitem>div {\
        max-width: 266px; margin: auto; text-align: center;\
      }\
      #leftIchibaPanel .ichiba_mainitem .blomagaArticleNP {\
        background: url("http://ichiba.dev.nicovideo.jp/embed/zero/img/bgMainBlomagaArticleNP.png") no-repeat scroll 0 0 transparent;\
        height: 170px;\
        margin: 0 auto;\
        width: 180px;\
      }\
      #leftIchibaPanel .ichiba_mainitem .blomagaLogo {\
        color: #FFFFFF;font-size: 9px;font-weight: bold;padding-left: 10px;padding-top: 8px;\
      }\
      #leftIchibaPanel .ichiba_mainitem .blomagaLogo span{\
        background: none repeat scroll 0 0 #AAAAAA;padding: 0 3px;\
      }\
      #leftIchibaPanel .ichiba_mainitem .blomagaText {\
        color: #666666;font-family: \'HGS明朝E\',\'ＭＳ 明朝\';font-size: 16px;height: 100px;padding: 7px 25px 0 15px;text-align: center;white-space: normal;word-break: break-all;word-wrap: break-word;\
      }\
      #leftIchibaPanel .ichiba_mainitem .blomagaAuthor {\
        color: #666666; font-size: 11px;padding: 0 20px 0 10px;text-align: right;\
      }\
      #leftIchibaPanel .ichiba_mainitem .balloonUe{\
        bottom: 12px; display: block; max-width: 266px; \
      }\
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
      }\
      #leftIchibaPanel .ichiba_mainitem .balloonShita{\
        height: 12px; bottom: 0; left: 0;\
      }\
      #leftIchibaPanel .ichiba_mainitem .balloonShita img{\
        vertical-align: top !important; \
      }\
      #leftIchibaPanel .ichiba_mainitem .ichibaMarquee {\
        display: none;\
      }\
      #leftIchibaPanel .ichiba_mainitem .thumbnail span {\
        font-size: 22px; color: #0066CC;\
        font-family: \'ヒラギノ明朝 Pro W3\',\'Hiragino Mincho Pro\',\'ＭＳ Ｐ明朝\',\'MS PMincho\',serif;\
      }\
      #leftIchibaPanel .ichiba_mainitem .action {\
        font-size: 85%;\
      }\
      #leftIchibaPanel .ichiba_mainitem .action .buy {\
        font-weight: bolder; color: #f60;\
      }\
      #leftIchibaPanel .ichiba_mainitem .itemname {\
        font-weight: bolder;\
      }\
      #leftIchibaPanel .ichiba_mainitem .maker {\
        font-size: 77%; margin-bottom: 2px;\
      }\
      #leftIchibaPanel .ichiba_mainitem .price {\
      }\
      #leftIchibaPanel .ichiba_mainitem .action .click {\
        font-weight: bolder;\
      }\
      #leftIchibaPanel .ichiba_mainitem .goIchiba {\
        font-size: 77%; margin: 5px 0;\
      }\
      #leftIchibaPanel .addIchiba, #leftIchibaPanel .reloadIchiba {\
        cursor: pointer;\
      }\
      #leftIchibaPanel .noitem {\
        cursor: pointer;\
      }\
\
      #outline .bottomAccessContainer {\
        position: absolute; top: 12px;\
      }\
      #outline .bottomConfButtonContainer {\
        position: absolute; top: 12px; right: 0px;\
      }\
      body.videoSelection .bottomAccessContainer{\
        display: none;\
      }\
      #outline.under940 .bottomAccessContainer{\
        right: 60px;\
      }\
      #outline .sidebar {\
        -webkit-transition: margin-top 0.3s ease-out;\
        transition:         margin-top 0.3s ease-out;\
      }\
      #outline.under940 .sidebar {\
        margin-top: 24px;\
      }\
      #videoHeader.menuClosed .watchItLaterMenu, #videoHeader.menuClosed .hidariue { display: none; }\
      #videoHeader .watchItLaterMenu {\
        position: absolute; width: 100px; left: -55px; top: 32px;\
      }\
      /* プレイリスト出したり隠したり */\
      body:not(.full_with_browser) #playlist{\
        -webkit-transition: max-height 0.3s ease-out; transition: max-height 0.3s ease-out;\
      }\
      body:not(.full_with_browser):not(.videoSelection) #playlist:not(.w_show){\
        /*max-height: 0px;*/position: absolute; top: -9999px;\
      }\
      #playlist.w_show{\
        /*max-height: 180px;*/\
      }\
      .playlistToggle:after {\
        content: "▼";\
      }\
      .playlistToggle.w_show:after {\
        content: "▲";\
      }\
      #content #playlist .playlistInformation  .generationMessage{\
        /* 「連続再生ボタンとリスト名は左右逆のほうが安定するんじゃね？ 名前の長さによってボタンの位置がコロコロ変わらなくなるし」という対応。*/ \
        position: absolute; margin-left: 90px;\
      }\
      body.videoSelection #content #playlist .playlistInformation  .generationMessage{\
        max-width: 380px;\
      }\
      #playlistContainerInner .thumbContainer, #playlistContainerInner .balloon{\
        cursor: move;\
      }\
\
\
      /* ページャーの字が小さくてクリックしにくいよね */\
      #resultPagination {\
        padding: 5px; font-weight: bolder; border: 1px dotted silter; font-size: 130%;\
      }\
\
      #playlistContainer #playlistContainerInner .playlistItem .balloon {\
        bottom: auto; top: -2px; padding: auto;\
      }\
\
      body.w_channel #leftPanel .userIconContainer{\
        display: none;\
      }\
      /* QWatch設定パネル */\
      #watchItLaterConfigPanel {\
        position: fixed; bottom:0; right:0; z-index: 10001; display: none;\
        width: 400px; padding: 4px;\
        background: #eff; border: 1px outset; color: black;\
        \
      }\
      #watchItLaterConfigPanel .inner{\
        margin: 0 12px; padding: 4px;\
        max-height: 500px; overflow-y: auto;\
        border: 1px inset\
      }\
      #watchItLaterConfigPanel li{\
        margin: 4px auto;\
      }\
      #watchItLaterConfigPanel li:hover{\
        background: #dff;\
      }\
      #watchItLaterConfigPanel li.buggy{\
        color: #888;\
      }\
      #watchItLaterConfigPanel label{\
        margin: 0 5px;\
      }\
      #watchItLaterConfigPanel label:hober{\
      }\
      #watchItLaterConfigPanel .bottom {\
        text-align: right;padding: 0 12px; \
      }\
      #watchItLaterConfigPanel .closeButton{\
        cursor: pointer; border: 1px solid;\
      }\
      #watchItLaterConfigPanel.autoBrowserFull_false .disableAutoBrowserFullIfNicowari {\
        color: #ccc;\
      }\
      #watchItLaterConfigPanel.autoBrowserFull_true .autoScrollToPlayer,\
      #watchItLaterConfigPanel.autoBrowserFull_true .autoOpenSearch,\
      #watchItLaterConfigPanel.removeLeftPanel_true .leftPanelJack  {\
        color: #ccc;\
      }\
      #watchItLaterConfigPanel .reload .title:after  {\
        content: \' (※)\'; font-size: 80%; color: #900;\
      }\
      #watchItLaterConfigPanel .debugOnly {\
        display: none;\
      }\
      #watchItLaterConfigPanel.debugMode .debugOnly {\
        display: block; background: #ccc;\
      }\
      #watchItLaterConfigPanel .section {\
        font-size: 120%; font-weight: bolder; margin: 16px 0;\
      }\
      #watchItLaterConfigPanel .section .description{\
        display: block; font-size: 80%; margin: 4px;\
      }\
      #watchItLaterConfigPanel .shortcutSetting:not(.enable) span :not(.enable){\
        color: silver;\
      }\
      #watchItLaterConfigPanel .shortcutSetting .enable {\
        cursor: pointer; margin: auto 10px;\
      }\
      #watchItLaterConfigPanel .shortcutSetting        .enable:before {\
        content: \'○ \';\
      }\
      #watchItLaterConfigPanel .shortcutSetting.enable .enable:before {\
        content: \'㋹ \'; color: blue;\
      }\
      #watchItLaterConfigPanel .shortcutSetting      .ctrl, #watchItLaterConfigPanel .shortcutSetting     .alt, #watchItLaterConfigPanel .shortcutSetting       .shift {\
        cursor: pointer; border: 2px outset; margin: 4px 4px; padding: 2px 4px; width: 180px; border-radius: 4px;background: #eee;\
      }\
      #watchItLaterConfigPanel .shortcutSetting.ctrl .ctrl, #watchItLaterConfigPanel .shortcutSetting.alt .alt, #watchItLaterConfigPanel .shortcutSetting.shift .shift {\
        border: 2px inset; color: blue;\
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
      }\
      #searchResultNavigation #favoriteTagsMenu.open a:after,  #searchResultNavigation #favoriteMylistsMenu.open a:after,\
      #searchResultNavigation #mylistListMenu.open   a:after,  #searchResultNavigation #videoRankingMenu.open a:after{\
        content: "▲";\
      }\
      #searchResultNavigation .slideMenu ul{\
      }\
      #searchResultNavigation .slideMenu ul li{\
        background: #fdfdfd; padding: 0; border: 0;font-size: 90%; height: auto !important;\
      }\
      #searchResultNavigation .slideMenu ul li a{\
        line-height: 165%; background: none;\
      }\
      #searchResultNavigation.w_touch .slideMenu ul li a{\
        line-height: 300%; font-size: 120%;\
      }\
        #searchResultNavigation .slideMenu ul li a:before{\
          background: url("http://uni.res.nimg.jp/img/zero_my/icon_folder_default.png") no-repeat scroll 0 0 transparent;\
          display: inline-block; height: 14px; margin: -4px 4px 0 0; vertical-align: middle; width: 18px; content: ""\
        }\
        #searchResultNavigation .slideMenu ul li          a.defMylist:before{ background-position: 0 -253px;}\
        #searchResultNavigation .slideMenu ul li.folder0  a:before{ background-position: 0 0;}\
        #searchResultNavigation .slideMenu ul li.folder1  a:before{ background-position: 0 -23px;}\
        #searchResultNavigation .slideMenu ul li.folder2  a:before{ background-position: 0 -46px;}\
        #searchResultNavigation .slideMenu ul li.folder3  a:before{ background-position: 0 -69px;}\
        #searchResultNavigation .slideMenu ul li.folder4  a:before{ background-position: 0 -92px;}\
        #searchResultNavigation .slideMenu ul li.folder5  a:before{ background-position: 0 -115px;}\
        #searchResultNavigation .slideMenu ul li.folder6  a:before{ background-position: 0 -138px;}\
        #searchResultNavigation .slideMenu ul li.folder7  a:before{ background-position: 0 -161px;}\
        #searchResultNavigation .slideMenu ul li.folder8  a:before{ background-position: 0 -184px;}\
        #searchResultNavigation .slideMenu ul li.folder9  a:before{ background-position: 0 -207px;}\
\
        #searchResultNavigation .slideMenu ul li.g_ent2 a:before     {  background-position: 0 -23px;}\
        #searchResultNavigation .slideMenu ul li.g_life2 a:before    {  background-position: 0 -46px;}\
        #searchResultNavigation .slideMenu ul li.g_politics a:before {  background-position: 0 -69px;}\
        #searchResultNavigation .slideMenu ul li.g_tech a:before     {  background-position: 0 -92px;}\
        #searchResultNavigation .slideMenu ul li.g_culture2 a:before {  background-position: 0 -115px;}\
        #searchResultNavigation .slideMenu ul li.g_other a:before    {  background-position: 0 -138px;}\
        #searchResultNavigation .slideMenu ul li.r18 a:before        {  background-position: 0 -207px;}\
        #searchResultNavigation .slideMenu ul li.all        a.all,\
        #searchResultNavigation .slideMenu ul li.g_ent2     a.g_ent2,\
        #searchResultNavigation .slideMenu ul li.g_life2    a.g_life2,\
        #searchResultNavigation .slideMenu ul li.g_politics a.g_politics,\
        #searchResultNavigation .slideMenu ul li.g_tech     a.g_tech,\
        #searchResultNavigation .slideMenu ul li.g_culture2 a.g_culture2,\
        #searchResultNavigation .slideMenu ul li.g_other    a.g_other,\
        #searchResultNavigation .slideMenu ul li.r18        a.r18 \
        { font-weight: bolder; border-top: 1px dotted #ccc; }\
\
\
      #searchResultNavigation .slideMenu ul li a:after{\
        background: none !important;\
      }\
      #searchResultNavigation .slideMenu ul li a:hover{\
        background: #f0f0ff;\
      }\
      #searchResultNavigation .slideMenu ul .reload{\
        cursor: pointer; border: 1px solid; padding: 0;\
      }\
\
      #searchResultNavigation .tagSearchHistory {\
        border-radius: 0px; margin-top: 2px; padding: 4px; background: #ccc;\
      }\
\
\
\
      /* 動画タグが1行以下の時 */\
      body:not(.full_with_browser) #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.oneLine {\
        height: 12px; padding: 6px 4px 2px;\
      }\
      body:not(.full_with_browser) #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.oneLine .toggleText{\
        display: none;\
      }\
      /* 動画タグが2行以下の時 */\
      body:not(.full_with_browser) #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit.twoLines {\
        height: 36px;\
      }\
      /* タグ領域とプレイヤーの隙間をなくす */\
      body:not(.full_with_browser) #videoTagContainer, body:not(.full_with_browser) #videoHeader .videoMenuToggle {\
        margin-bottom: -10px;\
      }\
      #videoHeaderMenu .searchContainer .searchText {\
        margin-top: -8px;\
      }\
\
      body.size_small #playerContainerWrapper {\
        padding: 0;\
      }\
\
      /* ニュース履歴 */\
      body.videoSelection #textMarquee .openNewsHistory, body.videoSelection #textMarquee .newsHistory {\
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
      body:not(.full_with_browser) #playerContainer {\
        /*top: -8px;*/\
      }\
      body:not(.full_with_browser) #playerContainerWrapper {\
        padding: 0px;\
      }\
      body.full_with_browser #playerContainer, body.size_small #playerContainer {\
        top: auto;\
      }\
      body.full_with_browser.no_setting_panel #searchResultExplorerContentWrapper {\
        display:none;\
      }\
\
\
      #searchResultExplorer.w_adjusted #resultContainer, #searchResultExplorer.w_adjusted #resultlist {\
        width: 592px; padding-left: 0; min-width: 592px; max-width: auto;\
      }\
      #searchResultExplorer.w_adjusted #resultContainer .resultContentsWrap, #searchResultExplorer.w_adjusted #resultContainer .resutContentsWrap {\
        width: 592px; padding: 16px 0px;\
      }\
      #content.w_adjusted #searchResultNavigation:not(.w_touch)>ul>li,  body.videoSelection #content.w_adjusted #searchResultExplorerExpand {\
        height: 26px;\
      }\
      #content.w_adjusted #searchResultNavigation:not(.w_touch)>ul>li>a,body.videoSelection #content.w_adjusted #searchResultExplorerExpand a{\
        line-height: 26px; font-size: 100%;\
      }\
      body:not(.videoSelection) #content.w_hideSearchExpand #searchResultExplorerExpand {\
        display: none;\
      }\
      #outline .openVideoExplorer {\
        display: none;\
      }\
      #outline.w_hideSearchExpand .openVideoExplorer {\
        display: inline-block;\
      }\
      #searchResultNavigation > ul > li a:after, #content.w_adjusted #searchResultExplorerExpand a#closeSearchResultExplorer:after {\
        top: 8px;\
      }\
      #searchResultExplorer.w_adjusted {\
        background: #333333;\
      }\
      body.videoSelection #footer.w_adjusted {\
        display: none;\
      }\
      #searchResultExplorer.w_adjusted #searchResultUadTagRelatedContainer .itemList>li {\
        width: 124px;\
      }\
\
    /* 1列表示の時、動画タイトルの横の空白部分にまでクリック判定があるのはVistaのエクスプローラみたいで嫌なので、文字部分だけにしたい */\
      #searchResultExplorer.w_adjusted #resultlist.column1 .videoInformationOuter a{\
        display: inline;\
      }\
      #searchResultExplorer.w_adjusted #resultlist.column1 .videoInformationOuter a p {\
        display: inline;\
      }\
\
      #searchResultExplorer.w_adjusted #resultlist.column1 .commentBlank {\
        width: 96%;\
      }\
      #searchResultExplorer.w_adjusted #resultlist.column4 .commentBlank {\
        width: 24%;\
      }\
      #searchResultNavigation .quickSearchInput {\
        background: none repeat scroll 0 0 #F4F4F4;\
        border: 1px inset silver;\
        left: 60px;\
        padding-left: 4px;\
        position: absolute;\
        top: 2px;\
        width: 200px;\
      }\
      #searchResultNavigation.w_touch .quickSearchInput {\
        top: 4px; font-size: 20px;\
      }\
\
      #resultlist.column4 .videoItem .balloon {\
        bottom: auto; top: 10px;\
      }\
      #resultlist .videoItem .columnVertical     .balloon {\
        top: -20px; /* 「再生リストに追加しました」が上の動画に被るのを防ぐ */\
      }\
      #resultlist                 .videoItem .columnVertical .itemMylistComment {\
        font-size: 85%; color: #666; border: 1px solid silver; border-radius: 8px; padding: 4px; margin: 0 2px; display: none;\
      }\
      #resultlist                 .videoItem .columnVertical .nicorepoOwnerIconContainer {\
        display: none;\
      }\
      #resultlist .nicorepoResult .videoItem .columnVertical .nicorepoOwnerIconContainer {\
        float: right; display: block;\
        padding: 3px; border: 1px solid silver;\
      }\
      #resultlist .videoItem .columnVertical     .nicorepoOwnerIconContainer img {\
        height: 48px;\
      }\
\
      #resultContainer.dummyMylist #searchResultContainer .favMylistEditContainer,\
      #resultContainer.dummyMylist #searchResultMylistSortOptions,\
      #resultContainer.dummyMylist #searchResultHeader {\
        display: none !important;\
      }\
\
      #resultlist .videoItem .thumbnailHoverMenu {\
        position: absolute; padding: 0; box-shadow: 1px 1px 2px black;\
        display: none;\
      }\
      #resultlist .videoItem .columnVertical     .thumbnailHoverMenu {\
        bottom:  4px; left: 4px;\
      }\
      #resultlist .videoItem .columnHorizontal   .thumbnailHoverMenu {\
        bottom: 75px; left: 5px;\
      }\
      #resultlist .videoItem .deleteFromMyMylist {\
        cursor: pointer; font-size: 70%; border: 1px solid #ccc; padding: 0;\
        display: none;\
      }\
      #resultlist .videoItem .showLargeThumbnail {\
        cursor: pointer; font-size: 70%; border: 1px solid #ccc;; \
      }\
      #resultlist .showLargeThumbnail {\
        padding: 0 4px;\
      }\
      #resultlist .videoItem:hover .thumbnailHoverMenu {\
        display: block;\
      }\
      #resultlist .log-user-video-upload {\
        background: #ffe; border-radius: 4px;\
      }\
      #resultlist .nicorepoResult .itemVideoDescription, #resultlist .nicorepoResult .videoTitle{\
      }\
      #resultContainer.enableMylistDeleteButton.mylist.isMine #resultlist .videoItem:hover .deleteFromMyMylist {\
        display: inline-block;\
      }\
      #searchResultExplorer.w_adjusted #resultContainer #searchResultContainer {\
        background: #fff;\
      }\
\
      #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap {\
        margin-right: -290px; padding: 0; transition: margin-right .2s; -webkit-transition: margin-right .2s;\
      }\
      #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap:hover {\
        margin-right: -0px; z-index: 1020;\
      }\
      body.videoSelection.content-fix #searchResultExplorer.w_adjusted #resultContainer .resultAdsWrap {\
        display: none;\
      }\
\
      #playlist .generationMessage {\
        cursor: pointer;\
      }\
      #playlist .generationMessage:hover {\
        text-decoration: underline;\
      }\
      #playlist .generationMessage:after {\
        content: "▼";\
      }\
\
      #yukkuriPanel {\
        position: fixed; z-index: 1500; bottom: 0; left: 0; display: inline-block;\
      }\
      body.w_noNicoru .nicoru-button{\
        left: -9999; display: none !important;\
      }\
      body.w_noNicoru .menuOpened #videoMenuTopList li.videoMenuListNicoru{\
        display: none;\
      }\
      body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li {\
        margin: 0 18px 4px 0;\
      }\
      body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li .tagControlContainer, body.w_noNicoru #videoTagContainer .tagInner #videoHeaderTagList li .tagControlEditContainer {\
        padding: 1px 0;\
      }\
\
      .userProfile.w_touch {\
        font-size: 150%; line-height: 120%;\
      }\
      .resultPagination.w_touch {\
        font-size: 200%;\
      }\
      .resultPagination.w_touch li{\
        padding: 4px 16px;\
      }\
      select.w_touch {\
        font-size: 200%;\
      }\
      /* 真・browserFullモード */\
      body.full_with_browser.hideCommentInput #nicoplayerContainerInner {\
        /* コメント入力欄は動画上表示にするのではなく、画面外に押し出す事によって見えなくする */\
        margin-top: -10px; margin-bottom: -36px; \
      }\
      body.full_with_browser.trueBrowserFull #nicoplayerContainerInner {\
        margin-left: -2.5%; width: 105% !important;\
      }\
      body.full_with_browser.trueBrowserFull #playerContainerWrapper {\
        margin: 0 !important;\
      }\
      body.full_with_browser.trueBrowserFull #playlist {\
        display: none;\
      }\
      body.full_with_browser.trueBrowserFull .mylistPopupPanel,body.full_with_browser.trueBrowserFull .yukkuriButton { display:none; }\
      #trueBrowserFullShield {\
        -webkit-transition: opacity 0.2s ease-out;\
        position:absolute; \
        display: none;\
      }\
      body.full_with_browser #trueBrowserFullShield {\
        background: black;\
        display: block;\
        bottom: 100px; \
        right:  100px;\
        z-index: 10000; \
        min-width: 400px;\
        cursor: nw-resize;\
        opacity: 0;\
        color: white;\
        box-shadow: 2px 2px 2px silver;\
        border-radius: 4px;\
      }\
      body.full_with_browser #trueBrowserFullShield .title {\
        color: #ffc; font-size: 120%;\
      }\
      body.full_with_browser #trueBrowserFullShield .ownerIcon {\
        float: left; height: 55px; padding: 8px;\
      }\
      body.full_with_browser #trueBrowserFullShield:hover, body.full_with_browser #trueBrowserFullShield.active { \
        opacity: 1;\
      }\
      body:not(.full_with_browser) #trueBrowserFullShield { display: none; }\
      \
      #sharedNgSettingContainer {\
        display: inline-block; font-size: 80%; position: absolute; top: 0; left: 85px;\
      }\
      #sharedNgSetting {\
        background: #ddd; border: 1px solid silver;\
      }\
      /* ニュース消す */\
      #content.noNews #textMarquee {\
        display: none !important;\
      }\
      body:not(.videoSelection):not(.setting_panel):not(.full_with_browser) #content.noNews #playerCommentPanelOuter {\
        height: auto !important; position: absolute; bottom: 18px;\
      }\
      body:not(.videoSelection):not(.setting_panel):not(.full_with_browser) #content.noNews #leftPanel {\
        height: auto !important; position: absolute; bottom: 2px;\
      }\
      body:not(.videoSelection):not(.setting_panel):not(.full_with_browser) #content.noNews #playerCommentPanel {\
        height: 100% !important;\
      }\
      body:not(.videoSelection):not(.setting_panel):not(.full_with_browser) #content.noNews #playerContainer.appli_panel #appliPanel {\
        bottom: -54px !important;\
      }\
      body:not(.videoSelection):not(.setting_panel):not(.full_with_browser) #content.noNews #playerContainer {\
        height: auto;\
      }\
      #outline.noNicommend #nicommendContainer, #outline.noIchiba  #nicoIchiba, #outline.noReview  #videoReview{\
        display: none;\
      }\
      \
      #content.w_flat #playerContainerWrapper, #content.w_flat #playlist .playlistInformation {\
        background: #444;\
      }\
      #content.w_flat #leftPanel, #content.w_flat #playerCommentPanel {\
        background: #ddd; border-radius: 0;\
      }\
      #content.w_flat #leftVideoInfo {\
        border-radius: 0;\
      }\
      #content.w_flat #searchResultNavigation > ul > li, #content.w_flat #searchResultExplorerExpand {\
        background: #f5f5f5;\
      }\
      #content.w_flat #searchResultNavigation > ul > li:hover {\
        background: #e7e7e7;\
      }\
      #content.w_flat #searchResultNavigation > ul > li.active {\
        background: #343434;\
      }\
      #content.w_flat #searchResultExplorerExpand a {\
        text-shadow: none;\
      }\
      #content.w_flat #playerCommentPanel .section .commentTable .commentTableHeaderWrapper {\
        background: gray;\
      }\
      \
      body:not(.full_with_browser) #content.w_compact #videoHeader {\
        width: 940px;\
      }\
      #content.w_compact #topVideoInfo .parentVideoInfo {\
        margin-top: -9px; margin-bottom: 9x;\
      }\
      #content.w_compact #topVideoInfo .parentVideoInfo .cct{\
        margin-bottom: 0;\
      }\
      #content.w_compact #topVideoInfo .parentVideoInfo .videoThumb{\
        margin-top: 4px;\
      }\
      #content.w_compact #topVideoInfo .ch_prof, #content.w_compact #topVideoInfo .userProfile {\
        min-width: 297px; margin-top: -1px; border: 1px solid #e7e7e7;\
      }\
      #content.w_compact #videoHeaderDetail .videoDetailExpand{\
        height: auto; padding: 0;\
      }\
      #content.w_compact #topVideoInfo .videoDescriptionHeader {\
        background: #fff; margin: -24px 0 -12px; width: 80px; text-align: center;\
      }\
      #content.w_compact #videoDetailInformation .description {\
        background: #fff; margin: 10px 0 0;padding: 4px 70px 4px 4px ;width: 866px; font-size: 90%;\
      }\
      #content.w_compact #topVideoInfo .videoMainInfoContainer{\
        padding: 0; \
      }\
      #content.w_compact #videoDetailInformation{\
        border-top: 0;\
      }\
      #content.w_compact #videoHeaderMenu .searchContainer {\
        top: -16px;\
      }\
      #content.w_compact .videoInformation{\
        margin: -4px 0 ;\
      }\
      #content.w_compact #topVideoInfo .videoStats {\
        margin-bottom: 2px;\
      }\
      body:not(.full_with_browser) #content.w_compact #videoTagContainer{\
        width: 880px;\
      }\
      body:not(.full_with_browser) #content.w_compact #videoTagContainer .tagInner #videoHeaderTagList .toggleTagEdit {\
        width: 72px;\
      }\
      body:not(.full_with_browser) #content.w_compact #videoTagContainer .tagInner #videoHeaderTagList {\
        padding-left: 85px;\
      }\
      #content.w_compact #topVideoInfo {\
        margin: 4px 0 4px;\
      }\
      #content.w_compact #topVideoInfo .videoShareLinks .socialLinks {\
        margin-top: -6px; \
      }\
      #outline.w_compact  #videoInfoHead{\
        margin: 0 ;\
      }\
      #outline.w_compact .videoInformation #videoTitle {\
        margin: -4px 0 0;\
      }\
      #outline.w_compact .videoInformation #videoStats  {\
        margin-top: -4px;\
      }\
      #outline.w_compact .videoInformation #videoStats .ranking {\
        margin: 0 0 4px;\
      }\
      #outline.w_compact #videoShareLinks {\
        margin: 0; \
      }\
      #outline.w_compact #bottomVideoDetailInformation {\
        margin: -18px 0 0;\
      }\
      #outline.w_compact .infoHeadOuter .videoEditMenuExpand {\
        position: absolute; top: 0;\
      }\
      #outline.w_compact .videoEditMenu {\
        margin: 0;\
      }\
      #outline.w_compact .videoDescription {\
        font-size: 90%; margin-top: -8px; padding: 0 0 4px 4px;\
      }\
      #outline.w_compact #videoComment {\
        margin: 0px; border: 1px solid silver; border-radius: 4px 4px 4px 4px; padding: 0 4px;\
      }\
      #outline.w_compact #videoComment h4{\
        padding-left: 4px;\
      }\
      #outline.w_compact .videoMainInfoContainer {\
        border-bottom: 0; margin-bottom: 0;\
      }\
      #outline.w_compact {\
        border-bottom: 0; margin-bottom: 0;\
      }\
      #outline.w_compact #nicommendList {\
        margin-top: 4px;\
      }\
      /* 広告とレビューの幅が違ってて気持ち悪いので合わせる */\
      #outline.w_compact #videoReview {\
        margin: 16px 0 0; width: 300px;\
      }\
      #outline.w_compact textarea.newVideoReview {\
        width: 277px;\
      }\
      #outline.w_compact #videoReviewHead {\
        width: 283px;\
      }\
      #outline.w_compact .stream, #outline.w_compact .inner {\
        width: 300px;\
      }\
      #outline.w_compact .commentConent, #outline.w_compact .resContainer {\
        width: 278px;\
      }\
      #outline.w_compact .commentContentBody {\
        width: 232px;\
      }\
      #outline.w_compact .sidebar { width: 300px; }\
      \
      #outline.w_compact .outer {\
        /* 左パネルを隠した標準サイズのプレイヤーに合わせる */\
        width: 940px;\
      }\
      #outline.w_compact #ichibaMain dl:nth-child(2n) {\
        margin: 0 34px 30px;\
      }\
      #outline.w_compact #ichibaMain dl {\
        margin: 0 0 30px;\
      }\
      \
      body:not(.videoSelection).size_normal #chorus_seekbar {\
        -webkit-transform: scaleX(1.33);\
        margin-left: 111px;\
      }\
      body:not(.videoSelection).size_normal #content #inspire_category {\
        margin-left: 219px;\
      }\
    '
    ].join(''); //
    addStyle(style, 'watchItLater');
  })();

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
    var $panel = null;
    var menus = [
      {title: '動画再生開始・終了時の設定'},
      {title: 'プレイヤーを自動で全画面化', varName: 'autoBrowserFull',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: '自動全画面化オンでも、ユーザーニコ割のある動画は', varName: 'disableAutoBrowserFullIfNicowari',
        values: {'全画面化しない': true, '全画面化する': false}},
      {title: 'プレイヤーを自動で検索画面にする(自動全画面化オフ時)', varName: 'autoOpenSearch',
        values: {'する': true, 'しない': false}},
      {title: 'プレイヤー位置に自動スクロール(自動全画面化オフ時)', varName: 'autoScrollToPlayer',
        values: {'する': true, 'しない': false}},
      {title: '動画終了時に全画面化を解除(原宿と同じにする)', varName: 'autoNotFull',
        values: {'する': true, 'しない': false},
        description: '連続再生中は解除しません'},
      {title: 'ウィンドウがアクティブの時だけ自動再生する', varName: 'autoPlayIfWindowActive',
        description: 'QWatch側の設定パネルの自動再生はオフにしてください。\n■こんな人におすすめ\n・自動再生ONにしたいけど別タブで開く時は自動再生したくない\n・複数タブ開いたままブラウザ再起動したら全部のタブで再生が始まって「うるせー！」という経験のある人',
        values: {'する': 'yes', 'しない': 'no'}},
      {title: '動画が切り替わる時、ポップアップで再生数を表示', varName: 'popupViewCounter',
        description: '全画面状態だと再生数がわからなくて不便、という時に',
        values: {'する': 'always', '全画面時のみ': 'full', 'しない': 'none'}},
      {title: 'コメント表示', varName: 'commentVisibility',
        values: {'オン': 'visible', 'オフ': 'hidden', '前回の状態': 'lastState'}},

      {title: '動画プレイヤーの設定'},
      {title: 'コメントパネルのワイド化', varName: 'wideCommentPanel',
        values: {'する': true, 'しない': false}},
      {title: 'コメントパネルにNG共有設定を表示', varName: 'enableSharedNgSetting',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: '左のパネルを消滅させる', varName: 'removeLeftPanel',
        values: {'する': true, 'しない': false}, addClass: true},
      {title: '左のパネルに動画情報・市場を表示', varName: 'leftPanelJack', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'ページのヘッダに再生数表示', varName: 'headerViewCounter', reload: true,
        values: {'する': true, 'しない': false}},
      {title: 'てれびちゃんメニュー内にニコニコ動画のロゴを復活', varName: 'hidariue', reload: true,
        values: {'させる': true, 'させない': false}},
      {title: 'ニコニコニュースの履歴を保持する', varName: 'enableNewsHistory', reload: true,
        values: {'する': true, 'しない': false}},
      {title: '画面からニコニコニュースを消す', varName: 'hideNicoNews',
        values: {'消す': true, '消さない': false}},
      {title: 'プレイリスト消えないモード(実験中)', varName: 'storagePlaylistMode', reload: true,
        description: '有効にすると、リロードしてもプレイリストが消えなくなります。',
        values:
          (conf.debugMode ?
            {'ウィンドウを閉じるまで': 'sessionStorage', 'ずっと保持': 'localStorage', 'しない': ''} :
            {'有効(ウィンドウを閉じるまで)': 'sessionStorage', '無効': ''})
      },

      {title: '動画プレイヤー下の設定'},
      {title: 'ニコメンドの表示', varName: 'nicommendVisibility',
        values: {'非表示': 'hidden', '市場の下': 'underIchiba', '市場の上(標準)': 'visible'}},
      {title: '市場の位置', varName: 'ichibaVisibility',
        values: {'非表示': 'hidden', '表示': 'visible'}},
      {title: 'レビューの位置', varName: 'reviewVisibility',
        values: {'非表示': 'hidden', '表示': 'visible'}},

      {title: '動画検索画面の設定'},
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

      {title: '全画面モードの設定'},
      {title: '全画面時に操作パネルとコメント入力欄を隠す', varName: 'controllerVisibilityInFull',
        description: '全画面の時は少しでも動画を大きくしたい場合に便利',
        values: {'隠す': 'hidden', '隠さない': ''}},
      {title: '真のブラウザ全画面モード (黒枠がなくなる)', varName: 'enableTrueBrowserFull',
        description: 'F11でブラウザを最大化した状態だと、モニター全画面表示より大きくなります。 \nただし、操作パネルが若干はみ出します。',
        values: {'有効': true, '無効': false}},

      {title: '省スペース化の設定'},
      {title: 'タグが2行以内の時に縦幅を縮める(ピン留め時のみ)', varName: 'enableAutoTagContainerHeight', reload: true,
        values: {'する': true, 'しない': false}},
      {title: '「動画をもっと見る」ボタンを小さく', varName: 'hideVideoExplorerExpand',
        values: {'する': true, 'しない': false}},
      {title: '動画情報欄の空きスペースを詰める', varName: 'compactVideoInfo',
        description: '原宿ぐらいの密度になります。ちょっと窮屈かも',
        values: {'詰める': true, '詰めない': false}},
      {title: 'グラデーションや角の丸みをなくす', varName: 'flatDesignMode',
        description: '軽い表示になります',
        values: {'なくす': 'on', 'なくさない': ''}},
      {title: '「ニコる」ボタンをなくす', varName: 'noNicoru',
        description: '画面上から見えなくなります。',
        values: {'なくす': true, 'なくさない': false}},

      {title: 'その他の設定'},
      {title: 'リンクにカーソルを重ねたらマイリストメニューを表示', varName: 'enableHoverPopup', reload: true,
        description: 'マウスカーソルを重ねた時に出るのが邪魔な人はオフにしてください',
        values: {'する': true, 'しない': false}},
      {title: 'ゆっくり再生(スロー再生)ボタンを表示する', varName: 'enableYukkuriPlayButton',
        values: {'する': true, 'しない': false}},
      {title: '検索時のデフォルトパラメータ', varName: 'defaultSearchOption', type: 'text',
       description: '常に指定したいパラメータ指定するのに便利です\n例: 「-グロ -例のアレ」とすると、その言葉が含まれる動画が除外されます'},
      {title: '「@ジャンプ」を無効化', varName: 'ignoreJumpCommand', reload: true,
        description: '勝手に他の動画に飛ばされる機能を無効化します。',
        values: {'する': true, 'しない': false}},
      {title: 'タッチパネル向けモード(画面を右フリックで開始)', varName: 'enableQTouch',
        description: '指で操作しやすいように、一部のボタンやメニューが大きくなります',
        values: {'使う': true, '使わない': false}},


      {title: 'マウスとキーボードの設定', description: '※Chromeはコメント入力中も反応してしまいます'},
      {title: '背景ダブルクリックで動画の位置にスクロール', varName: 'doubleClickScroll',
        description: 'なにもない場所をダブルクリックすると、動画の位置にスクロールします。\n 市場を見てからプレイヤーに戻りたい時などに便利',
        values: {'する': true, 'しない': false}},
      {title: 'マウスのボタン＋ホイールで音量調整機能', varName: 'mouseClickWheelVolume',
        description: 'とっさに音量を変えたい時に便利',
        values: {'左ボタン＋ホイール': 1, '右ボタン＋ホイール': 2, '使わない': 0}},
      {title: 'とりあえずマイリスト登録',       varName: 'shortcutDefMylist',          type: 'keyInput'},
      {title: 'マイリスト登録',                 varName: 'shortcutMylist',             type: 'keyInput',
        description: '右下で選択中のマイリストに登録'},
      {title: 'とりあえずマイリストを開く',     varName: 'shortcutOpenDefMylist',      type: 'keyInput'},
      {title: '動画投稿者の関連動画を開く',     varName: 'shortcutShowOtherVideo',     type: 'keyInput'},
      {title: '検索画面を開く',                 varName: 'shortcutOpenSearch',         type: 'keyInput'},
      {title: 'コメント表示ON/OFF',             varName: 'shortcutCommentVisibility',  type: 'keyInput'},
      {title: 'プレイヤーの位置までスクロール', varName: 'shortcutScrollToNicoPlayer', type: 'keyInput'},
      {title: 'ミュート',                       varName: 'shortcutMute',               type: 'keyInput'},


      {title: '実験中の設定', debugOnly: true},
      {title: 'プレイリスト消えないモード(※実験中)', varName: 'hashPlaylistMode', debugOnly: true, reload: true,
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
        $panel = w.jQuery('<div id="watchItLaterConfigPanel"><h2>WatchItLater設定</h2><div class="inner"><ul></ul></div></div>');
        var $ul = $panel.find('ul'), $item;
        for (var i = 0, len = menus.length; i < len; i++) {
          if (menus[i].varName) {
            $item = this.createMenuItem(menus[i]);
          } else {
            if (menus[i].description) {
              $item = $('<li class="section">'+ menus[i].title + '<span class="description">'+ menus[i].description + '</span></li>');
            } else {
              $item = $('<li class="section">'+ menus[i].title + '</li>');
            }
          }
          $item.toggleClass('debugOnly', menus[i].debugOnly === true).toggleClass('reload', menus[i].reload === true);
          $ul.append($item);
        }
        var $close = w.jQuery('<p class="bottom">(※)のつく項目は、リロード後に反映されます　<button class="closeButton">閉じる</button></p>'), self = this;
        $close.click(function() {
          self.close();
        });
        $panel.append($close);
        $panel.toggleClass('debugMode', conf.debugMode);
        w.jQuery('body').append($panel);
      }
    };

    pt.refresh = function() {
      var isVisible = $panel.is(':visible');
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

    pt.createKeyInputMenuItem = function(menu) {
      var title = menu.title, varName = menu.varName, values = menu.values;
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
  w.WatchItLater = {
  };


  var EventDispatcher = (function(conf, w) {
    var events = {};

    function addEventListener(name, callback) {
      name = name.toLowerCase();
      if (!events[name]) {
        events[name] = [];
      }
      events[name].push(callback);
    }

    function dispatch(name) {
      if (conf.debugMode) console.log('dispatch:', name, arguments);
      name = name.toLowerCase();
      if (!events[name]) { return; }
      var e = events[name];
      for (var i =0, len = e.length; i < len; i++) {
        try {
          e[i].apply(null, Array.prototype.slice.call(arguments, 1));
        } catch (ex) {
          console.log(name, i, e[i], ex);
        }
      }
    }
    return {
      addEventListener: addEventListener,
      dispatch: dispatch
    };
  })(conf, w);
  w.WatchItLater.event = EventDispatcher;

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
      if (conf.debugMode) console.log('watchCounter: ', v);
      return v;
    }
    var self ={
      get: get,
      add: add
    };
    return self;
  })(conf, w);
  w.WatchItLater.counter = WatchCounter;

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
        //document.body.appendChild(popup);
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
        }, false);
        return popup;
      }


      function appendTagHistory(dom, text, dic) {
        var $ = w.$;
        if (uniq === null) {
          uniq = {};
          $history = $('<div class="tagSearchHistory"><h3 class="title">タグ検索履歴</h3></div>');
          $history.css({width: $('#searchResultNavigation').width() - 8, maxHeight: '300px', overflowY: 'auto'});
          $('#searchResultNavigation').append($history);
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

        var dic = createDicIconDOM(tag, text);
        li.appendChild(dic);

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
      var self = this;
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
      var self = this;
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

      function createSubmitButton(sel) {
        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('my'));
        btn.className = 'mylistAdd';
        btn.title = 'マイリストに追加';
        btn.addEventListener('click', function(e) {
          var description = undefined;
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


      var sel = createSelector(mylistlist);
      nobr.appendChild(sel);

      var submit = createSubmitButton(sel);
      nobr.appendChild(submit);

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
        var stTraget = touchStartEvent.target, enTarget = touchEndEvent.target;
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

    return self = {
      onflick: onflick
    };
  })(w.document);



  /**
   *  リンクのマウスオーバーに仕込む処理
   *  ここの表示は再考の余地あり
   */
  var AnchorHoverPopup = (function(w) {
    var mylistPanel = Mylist.getPanel('');
    mylistPanel.className += ' popup';
    mylistPanel.style.display    = 'none';
    document.body.appendChild(mylistPanel);

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
        }, 400);

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
        w.jQuery('.lazyimage, .thumb_video.thumb_114.wide img').each(function() {
          var $e = w.jQuery(this).text(' ');
          var src = $e.attr('data-original') || $e.attr('src');
          if (typeof src === 'string' && thumbnailReg.test(src)) {
            each(this, 'so' + RegExp.$1);
          }
        });
      }
      bindTouch();
      bind();
      setInterval(bindLoop, 500);
    }
    return self;
  })(w);


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
    if (!(w.location.href.match(/\/mylist_add\//) && w.name !== "nicomylistadd")) return;

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
      watch          = (WatchApp && WatchApp.ns.init) || {},
      watchInfoModel = (watch.CommonModelInitializer && watch.CommonModelInitializer.watchInfoModel) || {},
      nicoPlayer     = (watch.PlayerInitializer && watch.PlayerInitializer.nicoPlayerConnector) || {},
      $ = w.$, WatchJsApi = w.WatchJsApi, exp = null;
    return {
      isZeroWatch: function() {
        return (WatchApp && WatchJsApi) ? true : false;
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
        watch.ComponentInitializer.videoSelection.panelOPC.open();
      },
      closeSearch: function() {
        watch.ComponentInitializer.videoSelection.panelOPC.close();
      },
      openUpNushiVideo: function() {
        $('.showOtherVideos:first').click(); // 手抜き
      },
      openUserVideo: function(userId, userNick) {
        watch.ComponentInitializer.videoSelection.showOtherUserVideos(userId, userNick);
      },
      getMyNick: function() {
        return watch.CommonModelInitializer.viewerInfoModel.nickname;
      },
      getMyUserId: function() {
        return watch.CommonModelInitializer.viewerInfoModel.userId;
      },
      shufflePlaylist: function() {
        var x = watch.PlaylistInitializer.playlist.items;
        x = x.map(function(a){return {weight:Math.random(), value:a};})
          .sort(function(a, b){return a.weight - b.weight;})
          .map(function(a){return a.value;});
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
      },
      clearPlaylist: function() {
        var x = watch.PlaylistInitializer.playlist.items, items = [];
        for (var i = 0; i < x.length; i++) {
          if (x[i]._isPlaying) {
            items.unshift(x[i]);
          }
        }
        watch.PlaylistInitializer.playlist.reset(
          items,
          watch.PlaylistInitializer.playlist.type,
          watch.PlaylistInitializer.playlist.option
        );
      },
      appendSearchResultToPlaylist: function(mode) {
        var
          items = watch.PlaylistInitializer.playlist.items, lr = watch.ComponentInitializer.videoSelection.lastLoadResponse,
          searchItems = lr.sortedRawData ? lr.sortedRawData : lr.rawData.list,
          uniq = {}, i, f = WatchApp.ns.model.playlist.PlaylistItem, playingIndex = 0, c, len;
        if (!searchItems || searchItems.length < 1) {
          return;
        }
        for (i = 0, len = items.length; i < len; i++) {
          uniq[items[i].id] = true;
          if (items[i]._isPlaying) { playingIndex = i; }
        }
        if (mode === 'next') {
          var tmp = [];
          for (i = searchItems.length - 1; i >= 0; i--) {
            c = searchItems[i];
            ("undefined" === typeof c.type || "video" === c.type) && uniq[c.id] === undefined && items.splice(playingIndex + 1, 0, new f(c));
          }
        } else {
          for (i = 0, len = searchItems.length; i < len; i++) {
            c = searchItems[i];
            ("undefined" === typeof c.type || "video" === c.type) && uniq[c.id] === undefined && items.push(new f(c));
          }
        }
        watch.PlaylistInitializer.playlist.reset(
          items,
          watch.PlaylistInitializer.playlist.type,
          watch.PlaylistInitializer.playlist.option
        );
      },
      addDefMylist: function(description) {
        var watchId = watch.CommonModelInitializer.watchInfoModel.id;
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
        return watch.PlaylistInitializer.playlist.getPlaybackMode() === 'random';
      },
      isPlaylistContinuous: function() {
        return watch.PlaylistInitializer.playlist.getPlaybackMode() === 'continuous';
      },
      getOwnerIcon: function() {
        try {
          return watchInfoModel.uploaderInfo.iconUrl || watchInfoModel.channelInfo.iconUrl;
        } catch (e) {
          return 'http://uni.res.nimg.jp/img/user/thumb/blank_s.jpg';
        }
      },
      getOwnerName: function() {
        try {
          return watchInfoModel.uploaderInfo.nickname ? watchInfoModel.uploaderInfo.nickname : watchInfoModel.channelInfo.name;
        } catch (e) {
          return '';
        }
      },
      isFavoriteOwner: function() {
        try {
          return watchInfoModel.uploaderInfo.isFavorited || !!(watchInfoModel.channelInfo && watchInfoModel.channelInfo.isFavorited);
        } catch (e) {
          return false;
        }
      }
    };
  })(w);

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
      Cache: Cache
    };
    return self;
  })();

  var NicoNews = (function() {
    var WatchApp = null, watch = null, $ = null, WatchJsApi = null, initialized = false;
    var $button = null, $history = null, $ul = null, deteru = {}, $textMarquee, $textMarqueeInner;
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
        callback(cacheData);
        return;
      }

      var result = {
        banner: '',
        id: '-1',
        sort: '1', // $('searchResultMylistSortOptions select').val()
        isDeflist: -1,
        isWatchngCountFull: false,
        isWatchngThisMylist: false,
        itemCount: 0,
        items: [],
        rawData: {
          name: myNick + 'の視聴履歴',
          user_id: myId,
          user_name: 'ニコニコ動画'
        }
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
              _info: {first_retrieve: postedAt},
              description_short: $item.find('.section .posttime span').text(),
              getType:        function() { return this.type; },
              getInfo:        function() { return this;},
              getName:        function() { return this.title;},
              getId:          function() { return this.id; },
              getDescription: function() { return ''; },

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
        callback(cacheData);
        return;
      }

      var result = {
        banner: '',
        id: '-2',
        sort: '1', // $('searchResultMylistSortOptions select').val()
        isDeflist: -1,
        isWatchngCountFull: false,
        isWatchngThisMylist: false,
        itemCount: 0,
        items: [],
        rawData: {
          name: 'あなたにオススメの動画',
          user_id: myId,
          user_name: 'ニコニコ動画'
        }
      };
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

          var getType = function() { return 'video'; };
          for (i = 0, len = data.videos.length; i < len; i++) {
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
              _info: video,
              description_short: '関連タグ: ' + video.recommend_tag,
              getType: getType,
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
      var watch, $, url, myNick, myId, type, baseUrl;
      try{
          watch = w.WatchApp.ns.init;
          $ = w.$;
          url = '/recommendations';
          myNick = WatchController.getMyNick();
          myId = WatchController.getMyUserId();
          type = param.type ? param.type : 'user';
          baseUrl = '/my/top/' + type + '?innerPage=1&mode=next_page';
      } catch (e) {
        if (conf.debugMode) console.log(e);
        throw { message: 'エラーが発生しました', status: 'fail'};
      }

      var cacheData = Util.Cache.get(baseUrl);
      if (cacheData) {
        callback(cacheData);
        return;
      }

      var
        last_timeline = false,
        result = {
          banner: '',
          id: '-10',
          sort: '1', // $('searchResultMylistSortOptions select').val()
          isDeflist: -1,
          isWatchngCountFull: false,
          isWatchngThisMylist: false,
          itemCount: 0,
          items: [],
          rawData: {
            name: getNicorepoTitle(type),
            user_id: myId,
            user_name: 'ニコニコ動画'
          }
        };
      function req(callback, param, pageCount, maxPageCount) {
        var WatchApp = w.WatchApp, watch = WatchApp.ns.init, $ = w.$, url = baseUrl, escapeHTML = WatchApp.ns.util.StringUtil.escapeHTML;
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
                description_short = $.trim($item.find('.log-body').text()).replace(/(しました|されました)。/g, ''),
                $owner = $item.find('.author-user, .author-community'),
                ownerPage  = $owner.attr('href'),
                ownerMatch = ownerReg.exec(ownerPage),
                ownerName  = $owner.text(),
                ownerId    = (ownerMatch !== null && ownerMatch.length >= 3) ? ownerMatch[2] : null,
                ownerIcon  = $item.find('.log-author img').attr('data-src'),
                hoge
              ;
              $item.removeClass('log').removeClass('passive').removeClass('first');
              if (this.className === 'log-mylist-added-video') {
                ownerName = $item.find('.log-body a:first').text();
                ownerPage = $item.find('.log-body a:last').attr('href');
              }

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
                description_short: description_short,
                getType:        function() { return this.type; },
                getInfo:        function() { return this;},
                getName:        function() { return this.title;},
                getId:          function() { return this.id; },
                getDescription: function() { return ''; },

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
      req(function (result) {
        var uniq = {}, uniq_items = [];
        for (var i = result.items.length - 1; i >= 0; i--) {
          var item = result.items[i], id = item.id;
          if (uniq[id]) {
            uniq[id]._info.nicorepo_log.push(item.first_retrieve + '　' + item._info.nicorepo_log[0].replace(/^.*?さん(の|が)動画(が|を) ?/, ''));
          } else {
            uniq[id] = item;
          }
        }
        for (var v in uniq) {
          uniq_items.unshift(uniq[v]);
        }
        result.rawData.list = result.items = uniq_items;
        result.itemCount = uniq_items.length;
        callback(result);
      }, param, 1, 3);
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
          _info: {first_retrieve: video.postedAt},
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
    }

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
      };
    }

    function loadRanking(callback, param) {
      var p = parseParam(param);

      request(p.baseUrl, 1, p.maxRssPage, function(result) {
        if (conf.debugMode) console.log(result);
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
  (function(w) { // Zero Watch
    var h, $ = w.$, $$ = w.$$;
    if (!w.WatchApp || !w.WatchJsApi) return;

    $.fx.interval = conf.fxInterval;

    var
      video_id = '', watch_id = '',
      iframe = Mylist.getPanel(''), tv_chan = $('.videoMenuToggle')[0],
      WatchApp = w.WatchApp, WatchJsApi = w.WatchJsApi,
      isFixedHeader = !$('body').hasClass('nofix'), isTouchActive = false,
      watch = WatchApp.ns.init,
      tagv = watch.TagInitializer.tagViewController, pim = watch.PlayerInitializer.playerInitializeModel, npc = watch.PlayerInitializer.nicoPlayerConnector,
      pac  = watch.PlayerInitializer.playerAreaConnector, vs = watch.ComponentInitializer.videoSelection, isSearchOpen = false,
      $leftPanel     = $('#leftPanel'),
      $leftInfoPanel = $('#leftPanelContent').clone().empty().attr({'id': 'leftVideoInfo',   'class': 'leftVideoInfo'}),
      $ichibaPanel   = $('#leftPanelContent').clone().empty().attr({'id': 'leftIchibaPanel', 'class': 'leftIchibaPanel'}),
      $rightPanel = $('#playerCommentPanelOuter');
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
        // dataCache = {};
        $('#nicommendPanelContent').find('.nicommendItemList>.item').each(function() {
          var $item = $(this), url, img;
          if ($item.hasClass('video')) {
            url = $item.find('.itemThumb>a').attr('href').split('?')[0];
            dataCache[url] = {
              type: 'video',
              title: $.trim($item.find('.itemName a').text()),
              thumbnail: [$item.find('.itemThumb img').attr('src')]
            };
          } else
          if ($item.hasClass('mylist')) {
            url = $item.find('.itemThumb>a').attr('href').split('?')[0];
            img = $item.find('.itemThumb img');

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
            dataCache[url] = {
              type: 'illust',
              title: $.trim($item.find('.itemName a').text()),
              thumbnail: [$item.find('.itemThumb img').attr('src')]
            };

          }
        });
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

    var initialExplorerWidth = null, resizeWatchTimer = null;
    function onWindowResize() {
      if (resizeWatchTimer !== null) {
        clearTimeout(resizeWatchTimer);
        resizeWatchTimer = null;
      }
      AnchorHoverPopup.hidePopup();
      resizeWatchTimer = setTimeout(function() {
        /* // 解像度が一定以下の時は隙間を狭くする対応をやりたかった
         var narrow = $(window).innerWidth() < 1350,r = - $('#playerCommentPanelOuter').outerWidth();
         $('#content').toggleClass('narrowBorder', narrow);
         if (narrow) { r += 10; }
         $('#playerCommentPanelOuter').css({'right': r + 'px'});
        */
        EventDispatcher.dispatch('onWindowResize');
      }, 1000);
    }

    function watchVideoStatus() {
      var video_length = WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.length;
      watchVideoId();
    }

    function watchVideoId() {
      var newVideoId = w.WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.id;
      var newWatchId = w.WatchApp.namespace.init.CommonModelInitializer.watchInfoModel.v;
      if (video_id !== newVideoId) {
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

    function onVideoChange(newVideoId, newWatchId) {
    }

    function initVideoCounter() {
      var watchInfoModel = watch.CommonModelInitializer.watchInfoModel;
      EventDispatcher.addEventListener('onWatchInfoReset', function(watchInfoModel){
        setVideoCounter(watchInfoModel);
      });
      function setVideoCounter(watchInfoModel) {
        var addComma = WatchApp.ns.util.StringUtil.addComma;
        var h = [
          '再生: ',          addComma(watchInfoModel.viewCount),
          ' | コメント: ',   addComma(watchInfoModel.commentCount),
          ' | マイリスト: ', addComma(watchInfoModel.mylistCount)
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
        $('#trueBrowserFullShield').html([
          '<img class="ownerIcon" src="', WatchController.getOwnerIcon(), '">',
          '<div class="title">', watchInfoModel.title, '</div>',
          '<p class="postedAt">',$('.videoPostedAt:last').text(), '</p>',
          '<p class="count">',h, '</p>',
        ''].join(''))
          .toggleClass('favorite', WatchController.isFavoriteOwner())
//          .find('.title').attr('title', $(WatchApp.ns.init.CommonModelInitializer.watchInfoModel.description.replace(/<br \/>/g, '\n')).text()).end()
          .find('img').attr('title', WatchController.getOwnerName());

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
    }

    var isFirst = true;
    function onVideoInitialized() {
      watch = WatchApp.namespace.init;
      AnchorHoverPopup.hidePopup().updateNow();
      tagv = watch.TagInitializer.tagViewController;
      pim  = watch.PlayerInitializer.playerInitializeModel;
      var newVideoId = watch.CommonModelInitializer.watchInfoModel.id;
      var newWatchId = watch.CommonModelInitializer.watchInfoModel.v;
      iframe.watchId(newVideoId, newWatchId);
      iframe.show();
      WatchCounter.add();
//      $('body').toggleClass('w_channel', watch.CommonModelInitializer.watchInfoModel.isChannelVideo());

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
        var $description = $leftInfoPanel.find('.videoDetails');
        if ($('body').hasClass('videoSelection')) {
              $leftInfoPanel.find('.leftVideoInfoInner')
                .animate({opacity: 0}, 800,
                  function() { }
                );
        } else {
          $description.css({maxHeight: $description.outerHeight(), minHeight: 0})
            .animate({maxHeight: 0}, 800, function() {
              $description.empty();
              $leftInfoPanel.find('.leftVideoInfoInner')
                .animate({opacity: 0}, 800,
                  function() { }
                );
            });
        }
      }
      if (conf.enableAutoPlaybackContinue && watch.PlayerInitializer.noUserOperationController.autoPlaybackModel._isAutoPlayback) {
        watch.PlayerInitializer.noUserOperationController.autoPlaybackModel.setCount(0);
      }
      EventDispatcher.dispatch('onVideoChangeStatusUpdated', isChanging);
    }

    // - 左パネル乗っ取る
    var leftInfoPanelInitialized = false, $leftPanelTemplate = null;
    function resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
        if (!conf.leftPanelJack) { return; }
        var maxWidth = Math.max(
          Math.min(
            266,
            $leftPanel.width(),
            $(window).innerWidth() - $('#playerCommentPanelOuter').width() - $('#nicoplayerContainer').width() - 22
          ),
          196
        );
        $leftInfoPanel.width((maxWidth - 0) + 'px');
        $ichibaPanel.width((maxWidth - 0) + 'px');
    }
    function initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
      if (!conf.leftPanelJack) { return; }
      if (leftInfoPanelInitialized) { return; }
      var $tab = $('<ul id="leftPanelTabContainer"><li class="tab nicommend" data-selection="nicommend">ニコメ</li><li class="tab ichiba" data-selection="ichiba">市場</li><li class="tab videoInfo" data-selection="videoInfo">情報</li></ul>');
      $leftPanel.append($leftInfoPanel);
      $leftPanel.append($tab).append($ichibaPanel);

      resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
      var leftPanelMap = {
        nicommend: [$leftPanel],
        videoInfo: [$leftInfoPanel],
        ichiba:    [$ichibaPanel]
      };
      function onTabSelect(e) {
        e.preventDefault();
        AnchorHoverPopup.hidePopup();
        var selection = $(e.target).attr('data-selection');
        if (typeof selection === 'string') {
          conf.setValue('lastLeftTab', selection);
          changeTab(selection);
        }
      }
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

      $tab.on('click',    onTabSelect);
      $tab.on('touchend', onTabSelect);
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

      EventDispatcher.addEventListener('onWindowResize', function() {
        resizeLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
      });
      EventDispatcher.addEventListener('onVideoInitialized', function() {
        leftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
      });

      function updateLeftPanelVisibility(v) {
        $leftPanel.toggleClass('removed',v);
        setTimeout(function() {
          watch.SidePanelInitializer.panelSlideViewController.slide(true);
        }, 0);
      }
      EventDispatcher.addEventListener('on.config.removeLeftPanel', updateLeftPanelVisibility);
      updateLeftPanelVisibility(conf.removeLeftPanel);
    }

    function leftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel) {
      if (!conf.leftPanelJack) { return; }

      initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);

      var watchInfoModel = watch.CommonModelInitializer.watchInfoModel;
      var uploaderId = watchInfoModel.uploaderInfo.id, isFavorite = WatchController.isFavoriteOwner();
      var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
      var h = $leftInfoPanel.innerHeight() - 100, $inner = $('<div/>');

      var addComma = WatchApp.ns.util.StringUtil.addComma;
      var $template = $leftPanelTemplate.clone();

      $template.css('opacity', 0);

      var $videoTitleContainer = $template.find('.videoTitleContainer');
      $videoTitleContainer.append('<h3 class="videoTitle">' + watchInfoModel.title + '</h3>');//$('#videoTitle').clone().attr('id', null));

      var $videoThumbnailContainer = $template.find('.videoThumbnailContainer');//.css({maxHeight: 0});
      $videoThumbnailContainer.append($('#videoThumbnailImage').clone(true).attr('id', null)).find('img:last').click(function() {
        showLargeThumbnail($(this).attr('src'));
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
      var videoDescriptionHtml = $('.videoDescription:first').html();

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
      $videoDescription.find('.descriptionThumbnail img').on('click', function() { showLargeThumbnail(this.src);});

      var $videoOwnerInfoContainer = $template.find('.videoOwnerInfoContainer');
      $videoOwnerInfoContainer
        .append(
          $('#userProfile').find('.userIconContainer').clone(true)
            .append(
              $('<span class="userName">' + $('#videoInfo').find('.userName').text() + '</span>'))
            .append(
              $('#userProfile').find('.showOtherVideos').clone(true).text('関連動画').attr('href', '/user/' + uploaderId + '/video')
            )
        ).append(
          $('#ch_prof').clone(true).attr('id', null)
            .addClass('ch_profile').find('a').attr('target', '_blank')
        );

      $leftInfoPanel.find('*').unbind();
      $leftInfoPanel.empty().scrollTop(0).toggleClass('isFavorite', isFavorite).toggleClass('isChannel', watchInfoModel.isChannelVideo());

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
            top: Math.max(120, $leftInfoPanel.innerHeight() - $videoOwnerInfoContainer.outerHeight() - $('#videoTagContainer').outerHeight() - 12)
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
      $leftPanel
        .toggleClass('ichibaEmpty',    $('#ichibaMain').find('.ichiba_mainitem').length < 1)
        .toggleClass('nicommendEmpty', $('#nicommendList').find('.content').length < 1);
    }
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

    var lastIchibaVideoId = 0;
    function resetLeftIchibaPanel($ichibaPanel, force) {
      if (!conf.leftPanelJack) { return; }
      var watchInfoModel = watch.CommonModelInitializer.watchInfoModel;
      var videoId = watchInfoModel.id;
      if (lastIchibaVideoId === videoId && !force) {
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
      }
      //else {$inner.append('<div class="noitem">市場に商品がありません</div>');}
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

    function initHidariue() {
      var hidariue = null;
      function resetHidariue() {
        if (!conf.hidariue) { return; }
        var dt = new Date();
        if (dt.getMonth() < 1 && dt.getDate() <=1) {
          $('#videoMenuTopList').append('<li style="position:absolute;left:300px;font-size:50%">　＼　│　／<br>　　／￣＼　　 ／￣￣￣￣￣￣￣￣￣<br>─（ ﾟ ∀ ﾟ ）＜　しんねんしんねん！<br>　　＼＿／　　 ＼＿＿＿＿＿＿＿＿＿<br>　／　│　＼</li>');
        }
        if (!hidariue) {
          $('#videoMenuTopList').append('<li class="hidariue" style="position:absolute;top:21px;left:0px;"><a href="http://userscripts.org/scripts/show/151269" target="_blank" style="color:black;"><img id="hidariue" style="border-radius: 8px; box-shadow: 1px 1px 2px #ccc;"></a><p id="nicodou" style="padding-left: 4px; display: inline-block"><a href="http://www.nicovideo.jp/video_top" target="_top"><img src="http://res.nimg.jp/img/base/head/logo/q.png" alt="ニコニコ動画:Q"></a></p><!--<a href="http://nico.ms/sm18845030" class="itemEcoLink">…</a>--></li>');
          hidariue = $('#hidariue')[0];
        }
        hidariue.src = 'http://res.nimg.jp/img/base/head/icon/nico/' +
                (1000 + Math.floor(Math.random() * 1000)).toString().substr(1) + '.gif';
      }
      EventDispatcher.addEventListener('onVideoInitialized', resetHidariue);
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
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 2000 )}, (isVisible ? 500 : 1000 ), function() {
            $toggle.toggleClass('open', !isVisible);
            $toggle.removeClass('opening');
          });
        });
        $popup.addClass('slideMenu').css('max-height', 0);
        $toggle.append($a);//.append($popup)
        $('#searchResultNavigation').find('ul:first li:first').after($popup).after($toggle);


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



    function loadFavTags() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>お気に入りタグ</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
        $toggle.attr('id', 'favoriteTagsMenu');
        $a.attr('href', '/my/fav/tag').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 2000 )}, (isVisible ? 500 : 1000 ), function() {
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



    function loadMylistList() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>マイショートカット</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
        $toggle.attr('id', 'mylistListMenu');
        $a.attr('href', '/my/mylist').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 2000 )}, (isVisible ? 500 : 1000 ), function() {
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

    function loadVideoRanking() {
      setTimeout(function() {
        var $toggle = $('<li style="display:none;"></li>'),
            $a = $('<a>動画ランキング</a>'),
            $popup = $('<li><ul></ul></li>'), $ul = $popup.find('ul');
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

        $toggle.attr('id', 'videoRankingMenu');
        $a.attr('href', '/ranking').click(function(e) {
          if (e.button !== 0 || e.metaKey) return;
          e.preventDefault();
          var isVisible = $popup.hasClass('open');
          $toggle.addClass('opening');
          $popup.toggleClass('open', !isVisible).animate({maxHeight: (isVisible ? 0 : 2000 )}, (isVisible ? 500 : 1000 ), function() {
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
      }, 100);
    }


    var isMylistHacked = false;
    function initMylist($) {
      if (isMylistHacked) { return; }
      var currentMylistId = 0;

      watch.ComponentInitializer.videoSelection._show_org =
        watch.ComponentInitializer.videoSelection._show;
      watch.ComponentInitializer.videoSelection._show = function(a, b) {
        currentMylistId = 0;
        $('#resultContainer').removeClass('dummyMylist').removeClass('mylist').removeClass('isMine');
        watch.ComponentInitializer.videoSelection._show_org(a, b);
      };

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
                  if (conf.debugMode) console.log(e);
                  onerror({message: 'エラーが発生しました', status: 'fail'});
                }
              }
            }, 0);
        }
      };
      watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.build_org =
        watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.build;
      watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.build = function(item) {
        var
          self = watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder,
          $item = self.build_org(item);
          if (!item._info) return $item;
          if (item._info.first_retrieve) {
            // 検索結果が1列表示の時は、投稿時間を秒まで表示
            $item.find('.columnVertical .created_time span').text(
              item._info.first_retrieve.toString().replace('-', '年').replace('-', '月').replace(' ', '日 ')
            );
          }
          if (item._info.nicorepo_owner) { // ニコレポ
            $item.addClass(item._info.nicorepo_className).addClass('nicorepoResult');
            var owner = item._info.nicorepo_owner;
            var $iconContainer = $item.find('.nicorepoOwnerIconContainer'), $icon = $iconContainer.find('img'), $link = $iconContainer.find('a');
            $icon.attr('src', owner.icon);
            $link.attr({'href': owner.page, 'data-ownerid': owner.id, 'title': owner.name + ' さん'});
            if (item._info.nicorepo_className.indexOf('log-user-') >= 0) {
              $link.attr(
                'onclick',
                'if (arguments[0].button > 0) return; arguments[0].preventDefault();' +
                'WatchApp.ns.init.ComponentInitializer.videoSelection.showOtherUserVideos(this.dataset.ownerid, this.title);'
              );
            }

            if (item._info.nicorepo_log.length > 1) {
              $item.find('.itemDescription').html(item._info.nicorepo_log.join('<br>'));
            }
          }
          if (item._info.mylist_comment) { // マイリストコメント
            $item.find('.itemMylistComment').text(item._info.mylist_comment).css({display: 'block'});
          }
          return $item;
      };

      var menu =
        '<div class="thumbnailHoverMenu">' +
        '<button class="showLargeThumbnail" onclick="WatchItLater.onShowLargeThumbnailClick(this);" title="大きいサムネイルを表示">＋</button>' +
        '<button class="deleteFromMyMylist" onclick="WatchItLater.onDeleteFromMyMylistClick(this);">マイリスト外す</button>' +
        '</div>';

      var $template = watch.ComponentInitializer.videoSelection.contentsAreaVC.videoContentBuilder.$videoContentTemplate;
      $template.find('.videoItem .columnVertical   .thumbContainer').append(menu);
      $template.find('.videoItem .columnHorizontal .balloon').before(menu);
      $template.find('.columnVertical')
        .find('.itemVideoDescription').after('<p class="itemMylistComment"/>')
        .end().find('.created_time').after('<div class="nicorepoOwnerIconContainer"><a target="_blank"><img /></a></div>');

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
      }

      function onShowLargeThumbnailClick(elm) {
        var
          $videoItem = $(elm).parent().parent(),
          src        = $videoItem.find('.itemThumbnail').attr('src');
        if (!src) { return; }
        showLargeThumbnail(src);
      }

      w.WatchItLater.onDeleteFromMyMylistClick = onDeleteFromMyMylistClick;
      w.WatchItLater.onShowLargeThumbnailClick = onShowLargeThumbnailClick;

      isMylistHacked = true;
    }

    function showLargeThumbnail(baseUrl) {
      var largeUrl = baseUrl, size;
      if (baseUrl.indexOf('smilevideo.jp') >= 0) {
        largeUrl = baseUrl + '.L';
        size = 'width: 360px; height: 270px;';
      } else {
        largeUrl = baseUrl.replace(/z$/, 'l');
        size = 'width: 360px;';
      }
      var
        html = [
          '<div onmousedown="if (event.button == 0) { $(\'#popupMarquee\').hide(); event.preventDefault(); }" style="background:#000;">',
          '<img src="', largeUrl, '" style="', size, ' z-index: 3; position: absolute; display: none;" onload="this.style.display = \'\';">',
          '<img src="', baseUrl, '"  style="', size, ' z-index: 2;">',
          '</div>',
        ''].join('');
      Popup.show(html);
    }


    function onVideoStopped() {
      EventDispatcher.dispatch('onVideoStopped');
    }

    function onVideoEnded() {
      EventDispatcher.dispatch('onVideoEnded');
    }

    var videoSelectOpenCount = 0;
    function onVideoSelectPanelOpened() {
      if (videoSelectOpenCount++ === 0) {
        EventDispatcher.dispatch('onFirstVideoExplorerOpened');
      }
      $('#playerCommentPanelOuter').after($leftPanel);
      EventDispatcher.dispatch('onVideoExplorerOpened');

      isSearchOpen = true;
      AnchorHoverPopup.hidePopup().updateNow();
    }

    function onVideoSelectPanelOpening() {
      isSearchOpen = true;
    }

    function onVideoSelectPanelClosed() {
      isSearchOpen = false;
      AnchorHoverPopup.hidePopup().updateNow();
      EventDispatcher.dispatch('onVideoExplorerClosed');
      setTimeout(function() {
        watch.PlaylistInitializer.playlistView.resetView();
      }, 1000);
    }

    /**
     *  検索中の動画サイズを無理矢理でっかくするよ。かなり重いし不安定かも
     *
     */
    var $smallVideoStyle = null, lastAvailableWidth = 0, lastBottomHeight = 0;
    function adjustSmallVideoSize() {
      if (!conf.videoExplorerHack || !$('body').hasClass('videoSelection')) { return; }

      $('#leftVideoInfo').find('.videoDetails').attr('style', '');
      $('#searchResultExplorer, #content, #bottomContentTabContainer').addClass('w_adjusted');
      var
        rightAreaWidth = $('#resultContainer').outerWidth(),
        availableWidth = $(window).innerWidth() - rightAreaWidth,
        commentInputHeight = $('#playerContainer').hasClass('oldTypeCommentInput') ? 36 : 0, controlPanelHeight = $('#playerContainer').hasClass('controll_panel') ? 46 : 0;
      if (availableWidth <= 0) { return; }
      //var flashVars = watch.PlayerInitializer.playerInitializeModel.flashVars, isWide = flashVars.isWide === "1"; // 4:3対応しても額縁になるだけだった
      var
        defPlayerWidth = 300, otherPluginsHeight = $('body.chrome26 #songrium_inline').outerHeight(),
        defPlayerHeight = (defPlayerWidth - 32) * 9 / 16 + 10,
        ratio = availableWidth / defPlayerWidth , availableHeight = defPlayerHeight * ratio + commentInputHeight + controlPanelHeight,
        xdiff = (availableWidth - defPlayerWidth - 20), windowHeight = $(window).innerHeight(),
        bottomHeight = windowHeight - availableHeight - (WatchController.isFixedHeader() ? $('#siteHeader').outerHeight() : 0) - otherPluginsHeight;

      if (ratio < 1) { return; }

      if (availableWidth <= 0 || bottomHeight <= 0 || (lastAvailableWidth === availableWidth && lastBottomHeight === bottomHeight)) { return; }

      var seekbarWidth = 675, scaleX = (availableWidth) / seekbarWidth;

      lastAvailableWidth = availableWidth;
      lastBottomHeight   = bottomHeight;
      if ($smallVideoStyle) {
        $smallVideoStyle.remove();
      }
      // コメントパネル召喚
      var commentPanelWidth = 420;//conf.wideCommentPanel ? 420 : $('#playerCommentPanelOuter').outerWidth();

      var css = ['<style type="text/css" id="explorerHack">',
        'body.videoSelection #content.w_adjusted #playerContainerWrapper, \n',
        'body.videoSelection #content.w_adjusted #playerContainerSlideArea, \n',
        'body.videoSelection #content.w_adjusted #playerContainer, \n',
        'body.videoSelection #content.w_adjusted #nicoplayerContainer ,\n',
        'body.videoSelection #content.w_adjusted #external_nicoplayer \n',
        '{',
          'width: ', availableWidth, 'px !important; height: ', availableHeight, 'px !important;padding: 0; margin: 0; ',
        '}\n',
        'body.videoSelection #content.w_adjusted #searchResultExplorerContentWrapper { ',
          'margin-top: ',  availableHeight, 'px !important; left: ', (xdiff - 2), 'px; ',
          'max-height: ', bottomHeight + 'px; overflow-y: auto; overflow-x: hidden; height: auto;',
        '}\n',
        'body.videoSelection #searchResultExplorer.w_adjusted #resultContainerWrapper             { margin-left: ', availableWidth,  'px !important; }\n',
        'body.videoSelection #content.w_adjusted #playlist { margin-left: ', xdiff, 'px; }\n',
        'body.videoSelection #searchResultExplorer.w_adjusted { min-height: ', (windowHeight + 200) ,'px !important; }\n',

        'body.videoSelection #content.w_adjusted #chorus_seekbar {',
          '-webkit-transform: scaleX(', scaleX, ');',
          'left: ', ((availableWidth - seekbarWidth) / 2) ,'px !important;',
        '}\n',
        'body.videoSelection #content.w_adjusted #seekpoint rect{',
//          '-webkit-transform: scaleX(', 1 / scaleX, ');',
        '}\n',
        'body.videoSelection #content.w_adjusted #inspire_category {',
          'left: ', (availableWidth + 32) ,'px !important;',
        '}\n',

        // かなり 無理矢理 左パネルを 召喚するよ 不安定に なっても 知らない
        // 破滅！
        'body.videoSelection #content.w_adjusted #leftPanel {',
          ' display: block; top: ', (availableHeight + otherPluginsHeight), 'px !important; max-height: ', bottomHeight, 'px !important; width: ', (xdiff - 4), 'px !important; left: 0;',
          ' height:', Math.min(bottomHeight, 600), 'px !important; display: block !important; border-radius: 0;',
        '}',
          'body.videoSelection #content.w_adjusted #leftPanel {',
          '}',
        'body.videoSelection #content.w_adjusted #leftPanel .panelClickHandler{',
          'display: none !important;',
        '}',
        'body.videoSelection #content.w_adjusted .leftVideoInfo, body.size_small.no_setting_panel.videoSelection #content.w_adjusted .leftIchibaPanel {',
          'width: ', Math.max((xdiff -  4), 130), 'px !important; border-radius: 0;',
        '}',
        'body.videoSelection #content.w_adjusted .nicommendContentsOuter {',
          'width: ', Math.max((xdiff - 18), 130), 'px !important;',
        '}',
        ((xdiff >= 400) ?
          [
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoTitleContainer{',
              'margin-left: 134px; border-radius: 0 0 ; background: #999;',
            '}',
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoThumbnailContainer{',
              'position: absolute; max-width: 130px; top: 0; ',
            '}',
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoInfo{',
              'background: #999; border-radius: 0 0;',
            '}',
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoDetails{',
              'border-left: 130px solid #ccc; padding-left: 4px; min-height: 250px;',
            '}',
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .videoOwnerInfoContainer{',
              'position: absolute; width: 130px; top: 120px;',
            '}',
            'body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .userIconContainer, body.videoSelection #content.w_adjusted #leftPanel .leftVideoInfo .ch_profile{',
              'background: #ccc; max-width: 130px; float: none; border-radius: 0;',
            '}',
            'body.videoSelection:not(.content-fix) #content.w_adjusted .videoDetails, ',
            'body.videoSelection:not(.content-fix) #content.w_adjusted #searchResultNavigation {',
              // タグ領域三行分 bodyのスクロール位置をタグの場所にしてる時でもパネルは文章の末端までスクロールできるようにするための細工
              // (四行以上あるときは表示しきれないが)
              'padding-bottom: 72px; ',
            '}',
            ( bottomHeight >= 250 ?
              [
                'body.videoSelection.content-fix #content.w_adjusted #leftPanel  .leftVideoInfo .videoOwnerInfoContainer {',
                  'position: fixed; top: auto !important; bottom: 2px;',
                '}'
              ].join('') :
              ''
            )
          ].join('') :
          (
            (xdiff >= 134) ?
            [
              'body.videoSelection #content.w_adjusted #leftPanel #leftPanelTabContainer { padding: 4px 2px 3px 2px; }',
              'body.videoSelection:not(.content-fix) #content.w_adjusted #searchResultNavigation, ',
              'body.videoSelection:not(.content-fix) #content.w_adjusted .videoOwnerInfoContainer {padding-bottom: 72px; }'
            ].join('') :
            ['body.videoSelection #content.w_adjusted #leftPanel { display: none !important;}'
            /*
              'body.videoSelection #content.w_adjusted #leftPanel { min-width: 130px; padding: 0; margin: 0; left: ', (xdiff - 134), 'px !important ;}',
              'body.videoSelection #content.w_adjusted #leftPanel:hover { left: 0px !important ;}',
              'body.videoSelection #content.w_adjusted #leftPanel img, body.videoSelection #content.w_adjusted #leftPanel .descriptionThumbnail { display: none; }',
              'body.videoSelection #content.w_adjusted #leftPanel #leftPanelTabContainer { display: none; }',
              'body.videoSelection #content.w_adjusted #leftPanel *   { padding: 0; margin: 0; }',
              'body.videoSelection:not(.content-fix) #content.w_adjusted #searchResultNavigation, ',
              'body.videoSelection:not(.content-fix) #content.w_adjusted .videoOwnerInfoContainer {padding-bottom: 72px; }'
            */].join('')
          )
        ),
        // かなり 無理矢理 コメントパネルを 召喚するよ 不安定に なっても 知らない
        // 破滅！
        'body.videoSelection #content.w_adjusted #nicoplayerContainer {',
          'z-index: 100;',
        '}',
        'body.videoSelection #content.w_adjusted #playerCommentPanelOuter {',
          'top: 0px !important; height: 50px !important; background: #dfdfdf; border-radius: 4px;',
          'z-index: 99;',
          'transition: right 0.3s ease-out, height 0.3s ease-out;  -webkit-transition: right 0.3s ease-out, height 0.3s ease-out; margin-top: 114px;',
        '}',
        'body.videoSelection #content.w_adjusted #playerCommentPanelOuter.w_touch:not(.w_active) {',
          'right: -60px !important;',
        '}',
        'body.videoSelection #content.w_adjusted #playerCommentPanelOuter:not(.w_touch) {',
          'right: -16px !important;',
        '}',
          'body.videoSelection #content.w_adjusted #playerCommentPanelOuter:hover:not(.w_active),',
          'body.videoSelection #content.w_adjusted #playerCommentPanelOuter.w_active {',
            'right: -',(commentPanelWidth), 'px !important; top: 0 !important; height: ', availableHeight, 'px !important; background: transparent; border: 0;  margin-top: 0px;',
          '}',
        'body.videoSelection #content.w_adjusted #playerCommentPanelOuter #playerCommentPanel {',
          'display: none;',
        '}',
          'body.videoSelection #content.w_adjusted #playerCommentPanelOuter:hover:not(.w_active) #playerCommentPanel,',
          'body.videoSelection #content.w_adjusted #playerCommentPanelOuter.w_active             #playerCommentPanel {',
            'height: ', (availableHeight - 18 /* padding+borderの10x2pxを引く */), 'px !important; ',
            'display: block; background: #dfdfdf; border: 1px solid;',
          '}',
        'body.videoSelection .panelClickHandler{',
          'display: none !important;',
        '}',
        'body.size_small.no_setting_panel.videoSelection #content #searchResultExplorerExpand {', // 「閉じる」ボタン
          'position: static; top: auto; left: auto; margin-top: 0;',
        '}\n',
      '</style>'].join('');

      $smallVideoStyle = $(css);
      $('head').append($smallVideoStyle);
      if (!$('#searchResultNavigation').hasClass('w_touch')) {
        $('#searchResultNavigation').on('touchstart.watchItLater', function() {
          $(this).addClass('w_touch').unbind('touchstart.watchItLater');
        });
      }
    }

    function initVideoExplorer() {
      loadVideoRanking();
      if (conf.enableFavTags) { loadFavTags(); }
      if (conf.enableFavMylists) { loadFavMylists(); }
      loadMylistList();

      if (!conf.videoExplorerHack) { return; }

      var refreshCommentPanelTimer = null;
      function refreshCommentPanelHeight() {
        if (!$('body').hasClass('videoSelection')) {
          return;
        }
        if (refreshCommentPanelTimer !== null) {
          clearTimeout(refreshCommentPanelTimer);
          refreshCommentPanelTimer = null;
        }
        refreshCommentPanelTimer =
          setTimeout(function() {
            watch.PlayerInitializer.commentPanelViewController.contentManager.activeContent().refresh();
          }, 1000);
      }

      $('#searchResultExplorer, #content, #footer').addClass('w_adjusted');
      $('#nicommendPanelCreateOpen').mousedown(function() {
        if (!$('body').hasClass('videoSelection')) { return; }
        WatchController.closeSearch();
        setTimeout(function() {
          WatchApp.ns.util.WindowUtil.scrollFit('#nicommendCreateStart', 200);
        }, 1000);
      });

      // 「閉じる」の位置が変わって見えなくなってしまったのを復元
      $('#searchResultExplorerErrorMessage').after($('#searchResultExplorerExpand'));
      // コメントパネルが白いままになるバグを対策
      $('#playerCommentPanelOuter').on('mouseenter.watchItLater', refreshCommentPanelHeight);

      EventDispatcher.addEventListener('onWindowResize', adjustSmallVideoSize);
      EventDispatcher.addEventListener('onVideoInitialized', adjustSmallVideoSize);
      EventDispatcher.addEventListener('onVideoExplorerOpened', function() {
        adjustSmallVideoSize();
        if (conf.videoExplorerHack) {
          setTimeout(function() {
            watch.PlayerInitializer.nicoPlayerConnector.updatePlayerConfig({playerViewSize: ''}); // ノーマル画面モード
          }, 100);
        }
      });

      var $searchInput = $('<input class="quickSearchInput" />').attr('title', '検索ワードを入力'), searchType = 'tag';
      var $inputForm = $('<form />').append($searchInput);
      $searchInput.on('keyup', function(e) {
        $('.searchText input').val(this.value);
      }).on('click', function(e) {
        e.stopPropagation();
      });
      $inputForm.on('submit', function(e) {
        e.preventDefault();
        var val = $.trim($searchInput.val());
        if (val.length > 0) {
          WatchController.nicoSearch(val, searchType);
        }
      });
      EventDispatcher.addEventListener('onSearchStart', function(word, type) {
        if (conf.debugMode) console.log(word, type, type);
        searchType = type.replace(/^.*\./, '');
        $searchInput.val(word);
      });
      $('#searchResultNavigation>ul>li:first').css('position', 'relative').append($inputForm).find('a');

      EventDispatcher.addEventListener('onVideoExplorerUpdated', function(req) {
        // ユーザーの動画一覧を開いた時、マイリスト一つだけだった場合はそれを開く
        if (req.type === 'uservideo' && req.params && req.params.page === 1) {
          setTimeout(function() {
            var videoSelection = watch.ComponentInitializer.videoSelection;
            var items = videoSelection.lastLoadResponse.items, publicItem = null, count = 0;
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item._isPublic || item.getType() === 'mylist') {
                count++;
                publicItem = item;
              }
            }
            if (count === 1 && (publicItem.getType() === 'uploadVideo' || publicItem.getType() === 'deflist' || publicItem.getType() === 'mylist')) {
              $('#resultlist .folderItem:first a:last').click();
            }
          }, 100);
        }
      });
    }



    function onWatchInfoReset(watchInfoModel) {
      $('body').toggleClass('w_channel', watchInfoModel.isChannelVideo());
      EventDispatcher.dispatch('onWatchInfoReset', watchInfoModel);
    }

    function onScreenModeChange(sc) {
      if (conf.hideNewsInFull) { $('body').addClass('hideNewsInFull'); }
      setTimeout(function() {
        EventDispatcher.dispatch('onScreenModeChange', sc);
      }, 500);
    }

    function initIframe() {
      iframe.id = "mylist_add_frame";
      iframe.className += " fixed";
      $(iframe).css({position: 'fixed', right: 0, bottom: 0});
      w.document.body.appendChild(iframe);
      iframe.hide(); // ページの初期化が終わるまでは表示しない
    }

    function initScreenMode() {
      EventDispatcher.addEventListener('onVideoInitialized', function(isFirst) {
        if (conf.autoBrowserFull) {
          setTimeout(function() {
            if ($('body').hasClass('up_marquee') && conf.disableAutoBrowserFullIfNicowari) {
              // ユーザーニコ割があるときは自動全画面にしない
              return;
            }
            if ($('body').hasClass('videoSelection')) {
              var settingSize = (localStorage["PLAYER_SETTINGS.LAST_PLAYER_SIZE"] === '"normal"') ? 'normal' : 'medium';
              WatchController.changeScreenMode(settingSize);
            }
            WatchController.changeScreenMode('browserFull');
            onWindowResize();
          }, 100);
        } else {
          if (conf.autoOpenSearch && !$('body').hasClass('videoSelection') && !$('body').hasClass('full_with_browser')) {
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
      });
      EventDispatcher.addEventListener('onVideoEnded', function() {
        // 原宿までと同じように、動画終了時にフルスクリーンを解除したい (ただし、連続再生中はやらない)
        if (conf.autoNotFull && $('body').hasClass('full_with_browser') && !WatchController.isPlaylistActive()) {
          WatchController.changeScreenMode('notFull');
        }
      });

      var lastPlayerConfig = null, lastScreenMode = '';
//      if (conf.controllerVisibilityInFull === 'hidden' || conf.controllerVisibilityInFull === 'auto') {

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
          if (mode === 'browserFull' && lastScreenMode !== mode) {
            lastPlayerConfig = watch.PlayerInitializer.nicoPlayerConnector.playerConfig.get();
            hideIfNeed();
            toggleTrueBrowserFull(conf.enableTrueBrowserFull);
          } else
          if (lastScreenMode === 'browserFull' && mode !== 'browserFull') {
            restoreVisibility();
          }
          lastScreenMode = mode;
        });

        $(window).on('beforeunload.watchItLater', function(e) {
          restoreVisibility();
        });
//      }
    }




    function initPlaylist($, conf, w) {
      var playlist = watch.PlaylistInitializer.playlist; //.getItems().length;
      var blankVideoId = 'sm20353707', blankVideoUrl = 'http://www.nicovideo.jp/watch/' + blankVideoId + '?';

      var items = {};

      function updatePos() {
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
      }

      function resetView() {
        watch.PlaylistInitializer.playlistView.resetView();
      }

      function exportPlaylist(option, type, continuous, shuffle) {
        var items = playlist.items, list = [];
        for (var i = 0, len = Math.min(300, items.length); i < len; i++) {
          var item = items[i];
          list.push([
              item.id,
              parseInt(item.mylistCounter,                10).toString(36),
              parseInt(item.viewCounter,                  10).toString(36),
              parseInt(item.numRes,                       10).toString(36),
              parseInt(item.thumbnailUrl.split('?i=')[1], 10).toString(36)
            ].join(',') + ':' + item.title
          );
        }
        return {
          a: (typeof continuous === 'boolean') ? continuous : WatchController.isPlaylistContinuous(),
          r: (typeof shuffle    === 'boolean') ? shuffle    : WatchController.isPlaylistRandom(),
          o: option    || playlist.option,
          t: type      || playlist.type,
          i: list
        };
      }

      function importPlaylist(list) {
        var PlaylistItem = WatchApp.ns.model.playlist.PlaylistItem, newItems = [], uniq = {}, currentIndex = -1;

        WatchController.clearPlaylist();
        var currentItem = playlist.items[0];
        if (!currentItem) {
          var wm = watch.CommonModelInitializer.watchInfoModel;
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

          if (uniq[id]) { continue; }
          uniq[id] = true;
          if (id == watch.CommonModelInitializer.watchInfoModel.v) {
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
        if (currentIndex === -1) {
          newItems.unshift(currentItem);
          currentIndex = 0;
        }

        playlist.reset(newItems, list.t, list.o);
        if (list.a) { playlist.setPlaybackMode('continuous'); }
        if (list.r) {
          if (newItems[0].id === blankVideoId) {
            setTimeout(function() {WatchController.shufflePlaylist();}, 3000);
          } else {
            playlist.setPlaybackMode('random');
          }
        }
      }

      var $dialog = null, $savelink = null, $continuous, $shuffle;
      function openSaveDialog() {
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
            .replace(/^.*?\n/, '').replace(/^.*「/, '').replace(/」.*?$/, '').replace(/ *- \d{4}-\d\d-\d\d \d\d:\d\d$/, '') +
          ' - ' + WatchApp.ns.util.DateFormat.strftime('%Y-%m-%d %H:%M', new Date())
        );
        $continuous.attr('checked', WatchController.isPlaylistActive());
        $shuffle   .attr('checked', WatchController.isPlaylistRandom());
        resetLink();
        $dialog.addClass('show');
      }

      var PlaylistMenu = (function($, conf, w, playlist){
        var $popup = null, $generationMessage = $('#playlist').find('.generationMessage'), self;

        function enableContinuous() {
          if (playlist.getPlaybackMode() === 'normal') {
            playlist.setPlaybackMode('continuous');
          }
        }

        function createDom() {
          $popup = $('<div/>').addClass('playlistMenuPopup').toggleClass('w_touch', isTouchActive);
          var $ul = $('<ul/>');
          $popup.click(function() {
            self.hide();
          });
          var $shuffle = $('<li>リストをシャッフル</li>').click(function() {
            WatchController.shufflePlaylist();
            enableContinuous();
          });
          $ul.append($shuffle);

          var $next = $('<li>検索結果を追加：次に再生</li>').click(function() {
            WatchController.appendSearchResultToPlaylist('next');
            enableContinuous();
          });
          $ul.append($next);

          var $insert = $('<li>検索結果を追加：末尾</li>').click(function() {
            WatchController.appendSearchResultToPlaylist();
            enableContinuous();
          });
          $ul.append($insert);

          var $clear = $('<li>リストを消去</li>').click(function() {
            WatchController.clearPlaylist();
            watch.PlaylistInitializer.playlist.setPlaybackMode('normal');
          });
          $ul.append($clear);

          var $saver = $('<li>プレイリスト保存用リンク(実験中)</li>').click(function() {
            openSaveDialog();
          });
          $ul.append($saver);

          $popup.append($ul);
          $('body').append($popup);
        }

        function show() {
          if ($popup === null) { createDom(); }
          var offset = $generationMessage.offset(), $window = $(window) , pageBottom = $window.scrollTop() + $window.innerHeight();
          $popup.css({
            left: offset.left,
            top: Math.min(offset.top + 24, pageBottom - $popup.outerHeight())
          }).show();
        }

        function hide() {
          if ($popup) { $popup.hide(); }
        }

        function toggle() {
          if ($popup === null || !$popup.is(':visible')) {
            show();
          } else {
            hide();
          }
        }

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
      watch.PlayerInitializer.watchPageController.getURLParams_org = watch.PlayerInitializer.watchPageController.getURLParams;
      watch.PlayerInitializer.watchPageController.getURLParams = $.proxy(function(url) {
        return this.getURLParams_org(url.replace(/#.*$/, ''));
      }, watch.PlayerInitializer.watchPageController);

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




    function initTags() {
      var $videoHeaderTagEditLinkArea = null, $toggleTagEditText = null, baseTagHeight = 72, currentHeight = 72;
      var tagListView = watch.TagInitializer.tagViewController.tagListView;

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
            $toggle.removeClass('oneLine').removeClass('twoLines');

            if (currentHeight < 36) { // 1行以下の時
              $toggle.addClass('oneLine');
            } else {
              if (currentHeight <= 60) { // 2行以下の時
                $toggle.addClass('twoLines');
              }
            }
            watch.TagInitializer.tagViewController.tagListView.fit();
          }
        } catch (e) {
          console.log(e);
        }
      }
      EventDispatcher.addEventListener('onVideoInitialized', onTagReset);
      watch.TagInitializer.tagList.addEventListener('reset', onTagReset);
    }

    function initCommentPanel() {
      var $playerCommentPanelOuter = $('#playerCommentPanelOuter'), wideCss = null;
      function initWideCommentPanelCss(targetWidth) {
        var px = targetWidth - $playerCommentPanelOuter.outerWidth();
        var elms = [
          '#playerCommentPanelOuter',
          '#playerCommentPanel',
          '#playerCommentPanel .commentTable',
          '#playerCommentPanel .commentTable .commentTableContainer',
          '#commentDefaultHeader'
        ];
        var css = [
          '#playerCommentPanelOuter.w_wide, body.videoSelection #content.w_adjusted #playerCommentPanelOuter { width: ', targetWidth,'px;}\n',
          'body:not(.videoSelection) #playerCommentPanelOuter.w_wide { right: -', targetWidth, 'px !important;}\n'
        ];
        for (var v in elms) {
          var $e = $(elms[v]), newWidth = $e.width() + px;
          css.push([
            '#playerCommentPanelOuter.w_wide ', elms[v],' , body.videoSelection #content.w_adjusted ', elms[v], ' { width: ', newWidth,'px !important;}\n'
          ].join(''));
        }
        wideCss = addStyle(css.join(''), 'wideCommentPanelCss');
      }
      function toggleWide(v) {
        $playerCommentPanelOuter.toggleClass('w_wide', v).css('right', '');
        EventDispatcher.dispatch('onWindowResize');
      }
      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        initWideCommentPanelCss(420);
        EventDispatcher.addEventListener('on.config.wideCommentPanel', toggleWide);
        toggleWide(conf.wideCommentPanel);
        EventDispatcher.dispatch('onWindowResize');
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
        $ngs.val(watch.PlayerInitializer.nicoPlayerConnector.playerConfig.get().ngScoringFilteringLevel);
        $ngs.on('change', function() {
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
    }

    function initNews() {
      if (conf.hideNicoNews) {
        $('#content').addClass('noNews');
      }
      EventDispatcher.addEventListener('on.config.hideNicoNews', function(value) {
        $('#content').toggleClass('noNews', value);
      });
      if (conf.enableNewsHistory) { NicoNews.initialize(w); }
    }

    function initPager() {
    }

    function initEvents() {
      pac.addEventListener("onVideoInitialized", watchVideoId);
      pac.addEventListener("onVideoInitialized", onVideoInitialized);
      pac.addEventListener("onVideoEnded", onVideoEnded);
      pac.addEventListener("onVideoStopped", onVideoStopped);
      // pac.addEventListener('onSystemMessageFatalErrorSended', onSystemMessageFatalErrorSended);
      // watch.WatchInitializer.watchModel.addEventListener('error', function() {console.log(arguments);});


      watch.CommonModelInitializer.watchInfoModel.addEventListener('reset', onWatchInfoReset);
      watch.PlayerInitializer.playerScreenMode.addEventListener('change', onScreenModeChange);

      vs.addEventListener("videoSelectPanelOpeningEvent", onVideoSelectPanelOpening);
      vs.addEventListener("videoSelectPanelClosedEvent", onVideoSelectPanelClosed);
      vs.panelOPC.addEventListener("videoSelectPanelOpenedEvent", onVideoSelectPanelOpened);
      vs.addEventListener('updatedContent', function(req) { EventDispatcher.dispatch('onVideoExplorerUpdated', req); });


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
        WatchController.clearMylistCache(info.groupId);
      });

      $(window).on('beforeunload.watchItLater', function(e) {
        conf.setValue('lastCommentVisibility', WatchController.commentVisibility() ? 'visible' : 'hidden');
      });
      EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
        pac.addEventListener('onVideoChangeStatusUpdated', onVideoChangeStatusUpdated);
      });

      EventDispatcher.addEventListener('onFirstVideoExplorerOpened', function() {
        initVideoExplorer();
      });
    }

    function initAdditionalButtons() {
      var $div = $('<div></div>');

      $div.addClass('bottomAccessContainer');
      var $playlistToggle = $('<button title="プレイリスト表示/非表示">プレイリスト</button>');
      $playlistToggle.addClass('playlistToggle');

      $('#playlist').toggleClass('w_show', !conf.hidePlaylist);
      $playlistToggle.toggleClass('w_show', $('#playlist').hasClass('w_show'));
      $playlistToggle.on('click', function() {
        $('#playlist').toggleClass('w_show');
        conf.setValue('hidePlaylist', !$('#playlist').hasClass('w_show'));
        $playlistToggle.toggleClass('w_show', $('#playlist').hasClass('w_show'));
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


      $('.searchText input:first').keydown(function(e){
        if (e.which === 38 || e.which === 40) { toggleSearchType(':first'); }
      });

      var $container = $('<div class="bottomConfButtonContainer" />'), $conf = $('<button title="WatchItLaterの設定">設定</button>');
      $container.append($conf);
      $conf.addClass('openConfButton');
      $conf.click(function(e) {
        e.stopPropagation();
        AnchorHoverPopup.hidePopup();
        ConfigPanel.toggle();
      });
      $('#outline .outer').before($container);


//      $div.append($conf.clone(true));
      var $body = $('body'), $window = $(window);
      EventDispatcher.addEventListener('onWindowResize', function() {
        if ($body.hasClass('videoSelection') || $body.hasClass('full_with_browser')) { return; }
        var w = $div.outerWidth(), threshold = ($(window).innerWidth() - 940) / 2;
        $('#outline').toggleClass('under940', w > threshold);
      });
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

    function initPageBottom($, conf, w) {
      function updateHideVideoExplorerExpand(v) { // hideVideoExplorerExpand
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
      EventDispatcher.addEventListener('on.config.hideVideoExplorerExpand', updateHideVideoExplorerExpand);
      EventDispatcher.addEventListener('on.config.nicommendVisibility', updateNicommendVisibility);
      EventDispatcher.addEventListener('on.config.ichibaVisibility',    updateIchibaVisibility);
      EventDispatcher.addEventListener('on.config.reviewVisibility',    updateReviewVisibility);
      if (conf.hideVideoExplorerExpand === true) { updateHideVideoExplorerExpand(true); }
      if (conf.nicommendVisibility !== 'visible') { updateNicommendVisibility(conf.nicommendVisibility); }
      if (conf.ichibaVisibility    !== 'visible') { updateIchibaVisibility(conf.ichibaVisibility); }
      if (conf.reviewVisibility    !== 'visible') { updateReviewVisibility(conf.reviewVisibility); }
    }

  function initPanelSlider($, conf, w) {
    if (!w.PlayerApp) {
      return;
    }
      // スライドの仕様が変わった対応
      // 旧バージョンのwatch.jsからコピーしただけでは動かなかったので半分作り直し
      watch.SidePanelInitializer.panelSlideViewController.getSlideType = $.proxy(function(pos) {
        var b = WatchApp.ns.model.player.PlayerScreenMode.getInstance();

        if (!b.isScreenNotFull() || b.isSizeSmall()) { return 0; }
        var
          q = WatchApp.ns.model.player.slider.ContentSlider,
          cs = this.contentSlider,
          c = "right" === pos ? cs.getLeftModeLayout() : "left" === pos ? cs.getRightModeLayout() : cs.getAutoModeLayout();

        var p = (function($, q) {
          var p = {};
          p[q.LAYOUT_CENTER_CENTER] = function(win, left, center, right) { // 初期状態
            return (width(left) - width(right)) * 0.5;
          };
          p[q.LAYOUT_CENTER_LEFT]   = function(win, left, center, right) { // プレイヤーの左端をウィンドウ左合わせ?
            return (width(center)  - $(win).width()) * 0.5 - 10;
          };
          p[q.LAYOUT_CENTER_RIGHT]  = function(win, left, center, right) { // プレイヤーの右端をウィンドウ右合わせ?
            return ($(win).width() - width(center))  * 0.5 + 10;
          };
          p[q.LAYOUT_LEFT_LEFT]     = function(win, left, center, right) { // 右にスライドして左パネル出す
            return (width(center) * 0.5 + width(left)) - $(win).width() * 0.5;
          };
          p[q.LAYOUT_RIGHT_RIGHT]   = function(win, left, center, right){ // 左にスライドしてコメントパネル出す
            return $(win).width() * 0.5 - (width(center) * 0.5 + width(right));
          };
          function width(elm) {
            if (0 === elm.length) { return 0; }
            var $d, left, right, offset, max = Number.MAX_VALUE, min = Number.MIN_VALUE;
            for (var i = 0, len = elm.length; i < len; i++) {
                $d = $(elm[i]);
                if (!$d.is(':visible')) { continue; }
                offset = $d.offset();
                left   = offset.left;
                right  = left + $d.width();
                min < right && (min = right);
                max > left  && (max = left);
            }
            var result = Math.max(min - max, 0);
            return result === 0 ? -10 /* パネルが無い時(width===0)はプレイヤー端のマージンも存在しないと計算して返す */ : result;
          }

          return p;
        })($, q);
        return p[c](window, this.innerLeftElements, this.$center, this.innerRightElements);
      }, watch.SidePanelInitializer.panelSlideViewController);
    EventDispatcher.addEventListener('onFirstVideoInitialized', function() {
      setTimeout(function() {
        watch.SidePanelInitializer.panelSlideViewController.slide(true);
      }, 0);
    });
    EventDispatcher.addEventListener('onWindowResize', function() {
      setTimeout(function() {
        watch.SidePanelInitializer.panelSlideViewController.slide();
      }, 0);
    });
  }



    function initShortcutKey() {
      var
        defMylist         = KeyMatch.create(conf.shortcutDefMylist),
        mylist            = KeyMatch.create(conf.shortcutMylist),
        openDefMylist     = KeyMatch.create(conf.shortcutOpenDefMylist),
        openSearch        = KeyMatch.create(conf.shortcutOpenSearch),
        scrollToPlayer    = KeyMatch.create(conf.shortcutScrollToNicoPlayer),
        commentVisibility = KeyMatch.create(conf.shortcutCommentVisibility),
        showOtherVideo    = KeyMatch.create(conf.shortcutShowOtherVideo),
        mute              = KeyMatch.create(conf.shortcutMute)
        ;

      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        if (name === 'shortcutDefMylist') {
          defMylist = KeyMatch.create(conf.shortcutDefMylist);
        } else
        if (name === 'shortcutOpenDefMylist') {
          openDefMylist = KeyMatch.create(conf.shortcutOpenDefMylist);
        } else
        if (name === 'shortcutOpenSearch') {
          openSearch = KeyMatch.create(conf.shortcutOpenSearch);
        } else
        if (name === 'shortcutScrollToNicoPlayer') {
          scrollToPlayer = KeyMatch.create(conf.shortcutScrollToNicoPlayer);
        } else
        if (name === 'shortcutCommentVisibility') {
          commentVisibility = KeyMatch.create(conf.shortcutCommentVisibility);
        } else
        if (name === 'shortcutMylist') {
          mylist = KeyMatch.create(conf.shortcutMylist);
        } else
        if (name === 'shortcutMute') {
          mute   = KeyMatch.create(conf.shortcutMute);
        } else
        if (name === 'shortcutShowOtherVideo') {
          showOtherVideo = KeyMatch.create(conf.shortcutShowOtherVideo);
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
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }
        // 全画面時はFlashにフォーカスがなくてもショートカットキーが効くようにする
/*
        if ($('body').hasClass('full_with_browser') && e.target.tagName === 'BODY') {
          if (e.keyCode === 37) {
            WatchController.prevVideo();
          } else
          if (e.keyCode === 39) {
            WatchController.nextVideo();
          }
        }
*/
        if (defMylist.test(e)) {
          WatchController.addDefMylist();
        }
        if (openDefMylist.test(e)) {
          WatchController.showDefMylist();
          WatchController.scrollToVideoPlayer(true);
        }
        if (openSearch.test(e)) {
          WatchController.openSearch();
          if (!$('body').hasClass('content-fix')) {
            WatchController.scrollToVideoPlayer(true);
          }
        }
        if (scrollToPlayer.test(e)) {
          WatchController.scrollToVideoPlayer(true);
        }
        if (commentVisibility.test(e)) {
          WatchController.commentVisibility('toggle');
        }
        if (mylist.test(e)) {
          $('#mylist_add_frame').find('.mylistAdd').click();
        }
        if (showOtherVideo.test(e)) {
          $('.showOtherVideos:first').click();
        }
        if (mute.test(e)) {
          WatchController.mute('toggle');
        }
      });
    }

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
        $('body').on('mousewheel.watchItLaterWheelWatch', function(e, delta) {
          // TODO: マジックナンバーを
          if (typeof e.buttons === 'number') { // firefox
            if (e.buttons < 1 || conf.mouseClickWheelVolume != e.buttons) { return; }
          } else { // chrome
            if (conf.mouseClickWheelVolume === 1 && !leftDown)  { return; }
            if (conf.mouseClickWheelVolume === 2 && !rightDown) { return; }
          }

          var v = WatchController.volume();
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
      if (conf.mouseClickWheelVolume > 0) {
        initWheelWatch();
      }
    }

    function initTouch() {
      var touchInitialized = false;
      TouchEventDispatcher.onflick(function(e) {
        var se = e.startEvent;
        if (!conf.enableQTouch) {return; }
        if (e.direction === 'right') {
          if (se.target.id === 'playerCommentPanelOuter') {
            $(se.target).addClass('w_active');
          }
          if (!touchInitialized) {
            $('#mylist_add_frame, #leftPanelTabContainer, #searchResultNavigation, #playerCommentPanelOuter').addClass('w_touch');
            $('.userProfile, .resultPagination, #searchResultContainer select, .playlistMenuPopup').addClass('w_touch');
            isTouchActive = true;
            touchInitialized = true;
          }
        } else
        if (e.direction === 'left') {
          if (se.target.tagName === 'DIV' &&
              $.contains('#playerCommentPanelOuter', se.target)) {
            $('#playerCommentPanelOuter').removeClass('w_active');
          }
        }
      });
    }

    function initOther() {
      if (conf.leftPanelJack) {
        var panelSVC = WatchApp.ns.init.SidePanelInitializer.panelSlideViewController;
      }

      if (conf.headerViewCounter) $('#siteHeaderInner').width($('#siteHeaderInner').width() + 200);

      initAdditionalButtons();
      initSquareThumbnail();

      $('.showVideoInfoButton').click(function() { // 「動画情報をもっと見る」クリック時
        WatchController.closeSearch();
      });

      var vs = watch.ComponentInitializer.videoSelection;
      vs._searchVideo_org = vs._searchVideo;
      vs._searchVideo = function(word, type, callback) {
        AnchorHoverPopup.hidePopup();
        var originalWord = word;
        if (conf.defaultSearchOption && conf.defaultSearchOption !== '') {
          if (word.indexOf(conf.defaultSearchOption) < 0 && !word.match(/(sm|nm|so)\d+/)) {
            word += " " + conf.defaultSearchOption;
          }
        }
        EventDispatcher.dispatch('onSearchStart', originalWord, type);
        vs._searchVideo_org(word, type, callback);
      };

      ConfigPanel.addChangeEventListener(function(name, newValue, oldValue) {
        if (name === 'squareThumbnail') {
          initSquareThumbnail();
        } else
        if (name === 'enableAutoTagContainerHeight') {
          if (newValue) { watch.TagInitializer.tagViewController.tagViewPinStatus.changeStatus(true); }
        } else
        if (name === 'enableMylistDeleteButton') {
          $('#resultContainer').toggleClass('enableMylistDeleteButton', newValue);
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

      if (conf.enableMylistDeleteButton) $('#resultContainer').addClass('enableMylistDeleteButton');

      if (conf.noNicoru) $('body').addClass('w_noNicoru');

      if (conf.flatDesignMode) $('#content').addClass('w_flat');

      if (conf.compactVideoInfo) $('#content, #outline').addClass('w_compact');


      WatchJsApi.nicos.addEventListener('nicoSJump', function(e) {
        if (conf.ignoreJumpCommand) {
          e.cancel();
          Popup.show('「@ジャンプ」コマンドをキャンセルしました');
        }
      });

      onWatchInfoReset(watch.CommonModelInitializer.watchInfoModel);

      if (conf.enableYukkuriPlayButton) { Yukkuri.show(); }

      if (conf.debugMode) {
        console.log(JSON.parse($('#watchAPIDataContainer').text()));
      }
    }

    function hideAds() {
      $('#content').removeClass('panel_ads_shown');
      $('playerBottomAd').hide();
    }

    LocationHashParser.initialize();
    initIframe();
    initCommentPanel();
    initNews();
    initShortcutKey();
    initMouse();
    initTouch();
    initEvents();
    initPager();
    initSearchOption();
    initLeftPanelJack($leftInfoPanel, $ichibaPanel, $leftPanel);
    initHidariue();
    initVideoCounter();
    initScreenMode();
    initPlaylist($, conf, w);
    initPageBottom($, conf, w);
    initPanelSlider($, conf, w);
    initTags();
    initMylist($);
    initOther();

    onWindowResize();
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
    if (location.host.indexOf('www.') === 0 || !this.GM_getValue || this.GM_getValue.toString().indexOf("not supported")>-1) {
      isNativeGM = false;
      var inject = document.createElement("script");
      inject.id = "monkey";
      inject.setAttribute("type", "text/javascript");
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
