/*
<アルゴリズムメモ>
文字列検出"バス"
２次元配列取得 (sheet7/A1~I26)
現在日時YYYY:M:D→曜日取得 / 時刻H:M /
H=列番号 (6以下,23以上は自動的に7:28のバス表示で)
曜日によって列を決定 セル内の時間列を取得
セル内の文字列をスペースでスプリットし出発地点別で配列化
現在分Mより大きい数字を検索し抽出。無かった場合はHを繰り上げる。
各配列毎に2つずつ近いやつから取り出し、reply_messageに格納
返答

注意事項
スプレッドシート上のデータが純粋に数字でないと動きませんん！（数値の形が日付になってたりすると✗）
*/
var tablenum = 6;

function getBusTime(msg){
  log_func_name += "　getBusTime()";//ログ用のメッセージ  
  var date = new Date();//現在日時を取得
  var W = date.getDay();//日〜土を0~6で表現
  var H = date.getHours();//時を取得
  var M = date.getMinutes();//分を取得
  var row;//列番号→曜日を指定
  var time_data;
  
  msg = msg.replace(/バス/g,'').replace(/ /g,'').replace(/　/g,'');
  
  if(msg == "登校"||msg == "湘南台"||msg == "行き"){
    
    tablenum = 7;
    
    if(H < 7||H > 22){ //行きの機能
      if(W == 0){//日曜, row=8
        reply_message += "現在営業時間外みたいです。";//7:28の始発バス表示
      }else{
        reply_message += "現在営業時間外みたいです。";//7:28の始発バス表示
      }
    }
    else{
      reply_message = "次のバスはこれらだよ！\n\n";
      if(W == 0){//日曜, row=8
        reply_message += "今日は日曜日。何しに来たの？\n\n慶応大学行き 遠藤経由\n"+ nearTimeGetter(H,5,M)[0]+"\n"+nearTimeGetter(H,5,M)[1];
        reply_message += "\n\n慶応大学行き 笹久保経由\n"+ nearTimeGetter(H,6,M)[0]+"\n"+nearTimeGetter(H,6,M)[1];
      }
      else if(W == 6){//土曜, row=5~7
        reply_message += "今日は土曜日だね。補講？\n\n慶応大本館前行き 遠藤経由\n"+ nearTimeGetter(H,3,M)[0]+"\n"+nearTimeGetter(H,3,M)[1];
        reply_message += "\n\n慶応大学本館前行き 笹久保経由\n"+ nearTimeGetter(H,4,M)[0]+"\n"+nearTimeGetter(H,4,M)[1];
      }
      else{//平日, row=1~4
        reply_message += "今日は平日..だね。頑張って授業に行こう。\n\n慶応大本館前行き 遠藤経由\n"+ nearTimeGetter(H,1,M)[0]+"\n"+nearTimeGetter(H,1,M)[1];
        reply_message += "\n\n慶応大学本館前行き 笹久保経由\n"+ nearTimeGetter(H,2,M)[0]+"\n"+nearTimeGetter(H,2,M)[1];
      }
    }
  }
  else{ //普通の機能
    if(H < 7||H > 22){
      if(W == 0){//日曜, row=8
        reply_message += "現在営業時間外みたいです。";//7:28の始発バス表示
      }else{
        reply_message += "現在営業時間外みたいです。";//7:28の始発バス表示
      }
    }
    else{
      reply_message = "次のバスはこれらだよ！\n\n";
      if(W == 0){//日曜, row=8
        reply_message += "今日は日曜日。\n\n慶応大学発\n"+ nearTimeGetter(H,7,M)[0]+"\n"+nearTimeGetter(H,7,M)[1];
      }
      else if(W == 6){//土曜, row=5~7
        reply_message += "今日は土曜日だね。\n\n慶応大学発\n"+ nearTimeGetter(H,4,M)[0]+"\n"+nearTimeGetter(H,4,M)[1];
        reply_message += "\n\n慶応大学本館前発\n"+ nearTimeGetter(H,5,M)[0]+"\n"+nearTimeGetter(H,5,M)[1];
        reply_message += "\n\n(Twin Liner)\n"+ nearTimeGetter(H,6,M)[0]+"\n"+nearTimeGetter(H,6,M)[1];      
      }
      else{//平日, row=1~4
        reply_message += "今日は平日...\n\n慶応大学発\n"+ nearTimeGetter(H,1,M)[0]+"\n"+nearTimeGetter(H,1,M)[1];
        reply_message += "\n\n慶応大学本館前発\n"+ nearTimeGetter(H,2,M)[0]+"\n"+nearTimeGetter(H,2,M)[1];
        reply_message += "\n\n(Twin Liner)\n"+ nearTimeGetter(H,3,M)[0]+"\n"+nearTimeGetter(H,3,M)[1];
      }
    }
  } 
}
function nearTimeGetter(col,row,M){//直近２つの時間を取得してくれるヤーツ
  log_func_name += "　nearTimeGetter()";//ログ用のメッセージ
  var time_table =sheets[tablenum].getRange("A1:I26").getValues();
  //Log("",col+" "+row+" "+M);
  var time_array =time_table[col][row].split(" ");//一つのセルから得た情報を配列化
  //Log("",time_array.join(','));
  if(time_array.join(',')==""){
    return ["なし",""];
  }else{
    var next_buses =[];//次のバスの時間
      for(var i=0;i<time_array.length;i++){
        if(M < time_array[i]){
          next_buses.push(col +":"+time_array[i]);
        }
      }
      if(next_buses.join(',') == ""||next_buses.length == 1){//同じ時台に２つ以上無かった場合
        time_array = time_table[col+1][row].split(" ");
        if(time_array.join(',')==""){
          return ["なし",""];
        }else{
          for(var i=0;i<time_array.length;i++){
              next_buses.push(col+1 +":"+time_array[i]);
            }
        }
        //Log("",next_buses.join(','));
      }
    return (next_buses);
  }
}