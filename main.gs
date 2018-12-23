var CHANNEL_ACCESS_TOKEN = "XXXXXXXXXXXXXXXXX";
var cal = CalendarApp.getCalendarById("ここにカレンダーIDを入力してね"); // カレンダーを指定。カレンダーにはあらかじめ0〜7限のイベントを入れておく。
var sheets = SpreadsheetApp.openById("ここにスプレッドシートIDを入力してね");// bot用にスプレッドシートファイルを作成しておく
var sheet = sheets.getSheetByName("エラー報告");// エラー報告用のシート「エラー報告」を取得
var logSheet = sheets.getSheetByName("予約履歴");// 予約の履歴を残すためのシート「予約履歴」を取得
var replyMessage; // 返信用メッセージ
var lastRow = sheet.getLastRow();
var youbi = ["日","月", "火", "水", "木", "金", "土"]; // Dateの曜日は英語表記なので日本語にするために用意する

function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;

  if (typeof replyToken === 'undefined') {
    return; // エラー処理
  }
  var userId = event.source.userId;
  var nickname = getUserProfile(userId);

  if(event.type == 'follow') {
//    botがユーザーにフォローされた時の処理
    replyMessage = "友達追加ありがとう！\n「使い方」と送ってくれれば使い方を説明するよ！";
  }

  if(event.type == 'join'){
  }

  if(event.type == 'message') {
    var userMessage = event.message.text;
//    デフォルトはオウム返し。
    replyMessage = userMessage;

//    ユーザーからのメッセージによって処理
    if(/エラー報告:.*?/.test(userMessage) || /エラー報告：.*?/.test(userMessage)){
      errorReport(userMessage, nickname);
    }else if(userMessage == "今日の予約"){
      todaysReservation(event);
    }else if(userMessage.match(/.*?の予約/)){
      var date = userMessage.replace("の予約", "");
      targetDayReservation(date, event);
    }else if(userMessage.match(/予約:.*?/) || userMessage.match(/予約：.*?/)){
      reservation(userMessage, nickname, userId);
    }else if(userMessage.match(/キャンセル:.*?/) || userMessage.match(/キャンセル：.*?/) || userMessage.match(/取り消し：.*?/) || userMessage.match(/取り消し:.*?/)){
      cancel(userMessage, userId);
    }else if(userMessage == "使い方" || userMessage == "使いかた" || userMessage == "つかいかた"){
//      replyMessage = tutorial;
      replyFlex(event, "部室ちゃんⅡ世の使い方", fTutorial);
    }else if(userMessage == "予約履歴"){
      replyMessage = "予約履歴のシートのURLだよ！\nここに予約履歴シートの共有URLを入力してね";
    }else if(userMessage == "カレンダー"){
      replyMessage = "カレンダーのURLだよ！\nここにカレンダーの公開URLを入力してね";
    }else if(/バス:.*?/.test(userMessage) || /バス：.*?/.test(userMessage)){
      var location = userMessage.replace("バス", "").replace(":", "").replace("：", "");
      var lFlag;
      var go = true;
      if(/駅/.test(location) || location == "湘南台"){
        lFlag = "station";
      }else if(location == "sfc" || location == "SFC" || location == "キャンパス"){
        lFlag = "sfc";
      }else{
        go = false;
        replyMessage = "想定外のテキストが入力されたよ！確認してね！";
      }
      if(go){
        replyBusTime(location, lFlag);
      }
    }
    replyText(event);
  }
}

// エラー報告のための関数
function errorReport(text, nickname){
  var tContent = text.replace("エラー報告", "").replace(":", "").replace("：", "");
  var date = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd (E) HH:mm:ss");
  var contents = [date, tContent, nickname];
  sheet.getRange(lastRow+1,1, 1,3).setValues([contents]);
  replyMessage = "エラー報告を記録しました。";
}

// profileを取得してくる関数
function getUserProfile(userId){
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var userProfile = UrlFetchApp.fetch(url,{
    'headers': {
      'Authorization' :  'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(userProfile).displayName;
}
