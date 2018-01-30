//*READ ME* '17.5.23 by Atsuya Kobayashi
//memo.gsをみてね！！

//グロバル変数はここへ。
var CHANNEL_ACCESS_TOKEN = “XXXXXXXXXXXXXXXXXX”;
var reply_message = "";//返信用メッセージ
var reply_message2 = "";//返答用のメッセージ2
var num_of_message = 3;//部員返答メッセージの種類指定
var ai_possibility = 50;// 現在43/50の確率で外部APIによる返答。この変数が大きくなるほど、AIの返答率が上がる。
var img_content = false;//返答への画像の有無 デフォルトはテキストのみなので無し
var sticker_content = false;//返答へのスタンプの有無 デフォルトはテキストのみなので無し
var img_url=""; //画像返答時の画像url
var preimg_url="";//画像返答時のプレビュー画像url
var package_id="";//スタンプ返答時のパッケージID
var sticker_id="";//スタンプ返答時のステッカーID
var spreadsheet_url = “XXXXXXXXXXXXXX”;//データベースとして共有スプレッドシートを指定
var sheets = SpreadsheetApp.openByUrl(spreadsheet_url).getSheets();//各シートの配列を取得
var log_func_name = "";//関数名をログに出す時の文字列

function doPost(e) {
    var url = 'https://api.line.me/v2/bot/message/reply';
    var reply_token = JSON.parse(e.postData.contents).events[0].replyToken;//リプライトークン取得
    if (typeof reply_token === 'undefined'){return;}//リプライトークンエラー
    var user_message = String(JSON.parse(e.postData.contents).events[0].message.text);//ユーザーの送信メッセージを取得
    var checkIn = true;
    var st = JSON.parse(e.postData.contents).events[0].source.type;
      if (st === 'user'){
          var user_id = JSON.parse(e.postData.contents).events[0].source.userId;
          var p = UrlFetchApp.fetch('https://api.line.me/v2/bot/profile/'+user_id,{'headers': {'Content-Type': 'application/json; charset=UTF-8','Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,}});
          var status_message = JSON.parse(p).statusMessage;//ひとこと
          var profile_image = JSON.parse(p).pictureUrl;//プロフィール画像url
          var user_name = JSON.parse(p).displayName;//名前
      }
    //Log("",user_message);
    if(user_message == "undefined"){
          //var packageId = Number(JSON.parse(e.postData.contents).events[0].message.packageId);
          //Log("",packageId);
          sticker_content = true;
          makeStickerReply();
    }
    else{
      //部室モードor予約モードor確認モードorおみくじモードor部員コメント返答orチェックインorヘルプを選択
      //モードプライオリティに差をつけるためにif elseの連続
      if(user_message.match(/と呟け|とつぶやけ/)){
          tweet(user_message,user_id);
      }else if(user_message.match(/チェックイン/)){
          check_in(user_id,user_name,checkIn,user_message);
      }else if(user_message.match(/チェックアウト/)){
          checkIn = false; 
          check_in(user_id,user_name,checkIn,user_message);
      }else if(user_message.match(/ヘルプ/)){
          help();
      }else if(user_message.match(/語句登録/)){
          replyRegister(user_name,user_message);
      }else if(user_message.match(/twitter登録|Twitter登録|twitter連携|Twitter連携/)){
          twitterRgst(user_id,user_message);
      }else if(user_message.match(/twitter確認|Twitter確認|twitter確認|Twitter確認/)){
          twitterCheck(user_id);
      }else if(user_message.match(/予約/)){
          make_reservation(user_message,user_name);
      }else if(user_message.match(/鍵/)){
          isOpen();
      }else if(user_message.match(/解錠|開鍵/)){
          openClose(user_message,user_name,user_id,"open!");
      }else if(user_message.match(/施錠/)){
          openClose(user_message,user_name,user_id,"closed!");
      }else if(user_message.match(/バス/)){
          getBusTime(user_message);
      }else if(user_message.match(/確認/)){
          check_reservation(user_message);
      }else if(user_message.match(/削除/)){
          delete_reservation(user_message,user_name);
      }else if(user_message.match(/カレンダー|かれんだー/)){
          calendarCheck(user_message);
      }else if(user_message.match(/おみくじ/)){
          omikuji(user_message,user_name);
      }else{
          //Log(user_name,"実行：memberReply() "+user_message);
          memberReply(user_message,status_message,user_name,profile_image);//みんなの名前で検索
      }
    }
    //返答。
    if(img_content == true){//画像が含まれる場合
      UrlFetchApp.fetch(url, {
        'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
          'method': 'post',
          'payload': JSON.stringify({
              'replyToken': reply_token,
              'messages': [
                {'type': 'text','text': reply_message},
                {
                  "type": "image",
                  "originalContentUrl": img_url,//JPEG縦横最大1024px最大1MB
                  "previewImageUrl": preimg_url//JPEG縦横最大240px最大1MB
                }
              ],
          }),
      });
    }else if(sticker_content==true){//スタンプを返す場合
      UrlFetchApp.fetch(url, {
        'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
          'method': 'post',
          'payload': JSON.stringify({
              'replyToken': reply_token,
              'messages': [
                {
                  "type": "sticker",
                  "packageId": package_id,
                  "stickerId": sticker_id
                }
              ],
          }),
      });
      Log(user_name,"スタンプ返信:パッケージID "+package_id+"/ステッカーID "+sticker_id);
    }
    else if(reply_message2 != ""){//二つ帰す場合
      UrlFetchApp.fetch(url, {
        'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
          'method': 'post',
          'payload': JSON.stringify({
              'replyToken': reply_token,
              'messages': [
                {'type': 'text','text': reply_message},
                {'type': 'text','text': reply_message2}
              ],
          }),
      });
      Log(user_name,reply_message +" "+ reply_message2);
    }
    else{//通常の返答
      UrlFetchApp.fetch(url, {
        'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
          'method': 'post',
          'payload': JSON.stringify({
              'replyToken': reply_token,
              'messages': [
                {'type': 'text','text': reply_message}
              ],
          }),
      });
      Log(user_name,reply_message);
    }
   return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}