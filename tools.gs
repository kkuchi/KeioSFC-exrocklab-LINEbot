function check_in(user_id,user_name, checkIn, user_message){

  //メール型Twitterクライアントyabminへメール送信する。
  /* 各データを準備 */
  user_message = user_message.replace(/チェックイン/g , "" ).replace(/ /g , "" ).replace(/　/g , "" ).replace(/\r?\n/g,"");
  user_message = user_message.replace(/チェックアウト/g , "" ).replace(/ /g , "" ).replace(/　/g , "" ).replace(/\r?\n/g,""); 
  /* メール本文を準備 */
  if(checkIn==true){
    reply_message = "部室へのチェックインありがとう！！ツイートしとくね！";
    var mailTweet = user_name　+　"さんが部室に来てくれたよ！！\n\n"　+ user_name　+　"「"　+　user_message　+　"」\n\n" + getTwitterId(user_id);
  }else{
    reply_message = "ありがとうね！ばいばい！！";
    var mailTweet = user_name　+　"さんが帰っていったよー！...\n\n"　+ user_name　+　"「"　+　user_message　+　"」\n\n"  + getTwitterId(user_id);
  }
  //メールを送信
  GmailApp.sendEmail(mailTo,"",mailTweet,{from: mailFrom,});
  //チェックインは別でログを残す
  sheets[4].appendRow([user_name,user_id,user_message,new Date()]);
  //ログ用のメッセージ
  log_func_name += "　check_in()";
}
function omikuji(user_message,user_name){
  var n = Math.floor(Math.random()*5);
  reply_message = user_name+"さんの今日のおみくじの結果は.....\n\n(画像をタップ！)"
  img_content = true;
  preimg_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/omikuji_review.jpg"

  switch (n) {
    case 0://大吉
      img_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/daikichi.jpg";
      break;
    case 1://吉
      img_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/kichi.jpg";
      break;
    case 2://小吉でえ
      img_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/shokichi.jpg";
      break;
    case 3://凶
      img_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/kyo.jpg";
      break;
    case 4://大凶
      img_url="https://web.sfc.keio.ac.jp/~t16366ak/linebot_img/daikyo.jpg";
      break;
  }
  //ログ用のメッセージ
  log_func_name += "　omikuji()";
}
function help(){
  reply_message = "★★★簡単な使い方！！★★★\n↓以下の単語を入れて使用\n\n【部員のなまえ】\n部員に対してメッセージを送信。ここにデータベースがあるよ！(Googleスプレッドシート)https://goo.gl/P5WpDG\n\n【語句登録】\n「語句登録 反応する語句-返答する語句」という風におくると、なんと任意の新しい語句への反応を追加できます！'語句登録'の後は★半角スペース、語句と語句の間は★半角ハイフンでつなげて下さい。\n\n【カレンダー】\n部室のカレンダーのリンクを表示\n\n【おみくじ】\nおみくじを引く\n\n【チェックイン】\n部室に入室したときに教えてください！\n\n【チェックアウト】\n部室から帰るときに教えてください！\n\n【鍵】\n部室の鍵が空いているかどうかを教えます。\n\n【解錠】\n鍵を開けたときに教えてください！\n\n【施錠】\n鍵を閉めた時に教えてください！\n\n【バス】\n次の2本のバスが何時に出るか教えるよ！(湘南台行のみ)\n\n【ヘルプ】\nこのヘルプ表示\n\n【予約】\n『予約 バンド名 YYYY/MM/DD n限』の形で送るとすぐ部室が予約できます。それぞれの間は★半角スペースにしてください。数字とスラッシュも半角にしてください。\n\n【確認】\n『確認 YYYY/MM/DD』の形で送ると指定日の部室の予約状況がすぐ確認できます。それぞれの間は半角スペースにしてください。数字とスラッシュも半角にしてください。\n\n【削除】\n『削除 YYYY/MM/DD n限』の形で送ると指定した練習予約が取り消せます。この時、予約した時と★同じLINE名にして下さい。(※誤って他人の予約を取り消すのを防ぐためにLINEの名前が同じでないと削除できません)それぞれの間は半角スペースにしてください。数字とスラッシュも半角にしてください。\n(YYYY/MM/DDの例は2017/5/24。チェックイン/アウトと解錠/施錠は自動でツイートします！！)\n\n【twitterアカウント連携】\n「twitter連携 id」と送ると自分のアカウントを登録できます。チャックインやチェックアウトのツイートの際にリプライにしてくれます。\n\n【ツイート命令】\n「と呟け」と文末につけるとツイートします。つぶやかせ過ぎに注意。\n\n最終更新2017/10/12";
  reply_message2 = "部室ちゃんTwitter:https://twitter.com/rocken_bushitsu\n";
  //ログ用のメッセージ
  log_func_name += "　help()";
}
function makeStickerReply(){
  //IDは１〜６３２まで。。
  var array = sheets[5].getDataRange().getValues(); 
  sticker_id = 1 + Math.floor(Math.random()*632);
  package_id = array[Number(findRow(array,String(sticker_id),1))-1][1];
  log_func_name += "　makeStickerReply()";
  return 0;
}
//Logger.log()がつかえねえので、スプレッドシートにログを残す。
function Log(user_name,log_msg){
  var log = [user_name,log_func_name,log_msg,new Date()];
  sheets[2].appendRow(log);//ログ用のスプレッドシートに書き出し
  sheets[2].getRange("A2:D").sort([{column: 4, ascending: false}]);
}
//列を指定し、データ検索して行番号を取得。
function findRow(data_array,val,col){
  log_func_name += "　findRow()";//ログ用のメッセージ
  for(var i=0;i<data_array.length;i++){
    if(data_array[i][col-1] == val){
      return i+1;
    }
  }
  return false;
}
function strCut(str){
  log_func_name += "　stringCut()";//ログ用のメッセージ
  str.replace(/ /g , "" ).replace(/　/g , "" ).replace(/\r?\n/g,"");
  return ;
t