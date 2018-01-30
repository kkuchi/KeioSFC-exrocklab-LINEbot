function randomReply(message, status, name, img){
  var n = Math.floor(Math.random()*ai_possibility);
   
   if(n<7){ //手作りのランダムメッセーじ
     switch (n) {
        case 0: reply_message += “XXXXXXX”;break;
        case 1: reply_message += “XXXXXXX”;break;
        case 2: if(status==null){reply_message += “XXXXXXX”}else{reply_message += status + ”XXXXXXX";}break;
        case 3: reply_message += name+”XXXXXXXX”;break;
        case 4: reply_message += message +"XXXXXXXX";img_content = true; img_url= “画像URL”;preimg_url=“サムネイルURL”;break;
        case 5: reply_message += "XXXXXXXX";break;
        case 6: reply_message += message +"XXXXXXXX"+message+message;break;
      }
    }else{
       reply_message = ULocal(name,message);
    }
    log_func_name += "　randomReply()";//ログ用のメッセージ
}
//外部の人工知能チャットボットAPIを叩す！！！！
function ULocal(name,message){
  var url = 'https://chatbot-api.userlocal.jp/api/chat?key=56ee2853ad4155cee939&message='+message+'&platform=line&user_name='+name+'&bot_name=ロッ研部室ちゃん';
  var options = 
      {
       'method': 'POST'
      };
  var response = UrlFetchApp.fetch(url, options);
  var o = JSON.parse(response.getContentText());
  response = UrlFetchApp.fetch("https://chatbot-api.userlocal.jp/api/character?message="+o.result+"&key=56ee2853ad4155cee939&character_type=cat",options);
  var oo = JSON.parse(response.getContentText());
  log_func_name += "　ULocal()";//ログ用のメッセージ
  return o.result;
}