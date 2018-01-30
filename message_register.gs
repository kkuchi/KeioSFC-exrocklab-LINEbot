function registeredReply(user_message,status_message,user_name,profile_image){
  log_func_name += "　registeredReply()";//ログ用のメッセージ
  var data_array = sheets[3].getDataRange().getValues(); //受け取ったシートのデータを二次元配列として取得
  var row = findRow(data_array,user_message,3);//名前の列は1。ここで行番号を取得
  var col = 4;

  if(row==0){
    //Log(user_name,"実行：randomReply()");
    randomReply(user_message, status_message, user_name, profile_image);//AIを使った返答BOTのAPIへ投げる
  }else{
    reply_message = String(data_array[row-1][col-1]);//取得したメッセージの文字列を返す
    //Log("","registeredReply():結果="+reply_message);
  }
}
function replyRegister(user_name,user_message){
  log_func_name += "　replyRegister()";//ログ用のメッセージ 
  var word = user_message.replace(/語句登録/g , "" ).replace(/ /g , "" );
  var words = word.split("-");//ここで配列になるはず。
  words.unshift(new Date());
  words.unshift(user_name);
  sheets[3].appendRow(words);
  sheets[3].getRange("A2:D").sort([{column: 2, ascending: false}]);
  reply_message = "語句を登録しました！";
  //Log(user_name,"語句登録："+words.join(','));

}
