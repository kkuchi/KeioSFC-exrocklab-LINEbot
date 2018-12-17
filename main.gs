var CHANNEL_ACCESS_TOKEN = "XXXXXXXXXXXXXXXXX";
var cal = CalendarApp.getCalendarById("ここにカレンダーIDを入力してね"); // カレンダーを指定。カレンダーにはあらかじめ0〜7限のイベントを入れておく。
var sheet = SpreadsheetApp.openById("ここにスプレッドシートIDを入力してね").getSheetByName("エラー報告");// エラー報告用のスプレッドシートの「エラー報告」というシートを取得
var replyMessage; // 返信用メッセージ
var tutorial = "部室を予約したいときは\n【予約:日付, 時限（数字のみ）, バンド名】と言ってね！\n項目の区切りはコロン、数字は半角、日付数字とスラッシュで「年/月/日」みたいに指定してね！\n\n今日の予約を確認したいときは【今日の予約】、 日付を指定して予約確認したいときは【'任意の日付'の予約】と言ってね！この時の日付は予約と同様スラッシュ区切りの半角数字でお願いします！";
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
    replyMessage = "友達追加ありがとう！\n" + tutorial;
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
    }else if(userMessage.match(/取り消し：.*?/) || userMessage.match(/取り消し:.*?/)){
      cancel(userMessage, userId);
    }else if(userMessage == "使い方" || userMessage == "使いかた" || userMessage == "つかいかた"){
      replyMessage = tutorial;
    }else if(userMessage == "カレンダー"){
      replyMessage = "カレンダーのURLだよ！\nここにカレンダーの公開URLを入力してね！";
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
