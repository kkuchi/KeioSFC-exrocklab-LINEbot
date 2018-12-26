// replyPostでテキストを返すためのデータ整形
function replyText(e) {
  var rText = {
    'type': 'text',
    'text': replyMessage,
  };
  replyPost(e, rText);
}

// replyPostでflexMessageを返すためのデータ整形
function replyFlex(e, title, con) {
  var fContent = gFlex(title, con)
  replyPost(e, fContent);
}

// reply送信
function replyPost(e, c){
  var url = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': e.replyToken,
        'messages': [
          c
        ],
      }),
      muteHttpExceptions: true,
    });
    return ContentService.createTextOutput(
      JSON.stringify({'content': 'post ok'})
    ).setMimeType(ContentService.MimeType.JSON);
}