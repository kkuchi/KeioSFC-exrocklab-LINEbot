//*READ ME* '17.5.23 by Atsuya Kobayashi
//編集は ⌘(ctrl)+Shift+Rでスパーリロードしてスクリプトを最新の状態にしてから行って下さい。
//編集後は保存をしておいてください ⌘(ctrl)+S
//公開>ウェブアプリケーションとして導入>プロジェクトバージョン新規作成=>更新　でLINE botの設定が反映されます。
//これはチェックイン機能のツイート用スクリプトです

var mailTo=“XXXXXXXX@yabm.in"; //To
var mailFrom=“XXXXXXXX@gmail.com"; //From

function tweetOpen(user_message,user_name){
  var mailTweet = user_name+"さんが部室の鍵を開けてくれたよ！\n\n"+ user_name + "「" + user_message.replace(/\r?\n/g,"") +"」";
  GmailApp.sendEmail(mailTo,"",mailTweet,{from: mailFrom,});
  log_func_name += "　tweetOpen()";//ログ用のメッセージ
}
function tweetClose(user_message,user_name){
  var mailTweet = user_name+"さんが部室の鍵を閉めてくれたよ！お疲れ様！\n\n"+ user_name + "「" + user_message.replace(/\r?\n/g,"") +"」";
  GmailApp.sendEmail(mailTo,"",mailTweet,{from: mailFrom,});
  log_func_name += "　tweetClose()";//ログ用のメッセージ
}
function testTweet(){
  var user_name = "テストマン";
  var user_message = "部室きたぜうぇーい(テスト)";
  var mailTweet = user_name　+　" さんが部室に来てくれました！！\n\n"　+ user_name　+　"「"　+　user_message.replace(/\r?\n/g,"")　+　"」";
  GmailApp.sendEmail(mailTo,"",mailTweet,{from: mailFrom,}); 
}
function tweet(user_message, user_id){
  var msg = user_message.replace(/と呟け|とつぶやけ/g,"");
  GmailApp.sendEmail(mailTo,"",msg,{from: mailFrom,});
  log_func_name += "　tweet()";
  reply_message = "了解！";
}