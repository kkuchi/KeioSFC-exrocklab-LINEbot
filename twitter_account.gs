
function twitterRgst(line_id, user_message){
    
    var twitter_id = user_message.replace(/twitter|Twitter/g,'').replace(/登録|連携/g,'').replace(/ /g,'').replace(/　/g,'').replace(/@/g,'');
    var data_array = sheets[8].getDataRange().getValues();
    //Log("test", data_array.join(","));
    var row = findRow(data_array, line_id, 1);
    if(row == false){
      sheets[8].appendRow([line_id, twitter_id, new Date()]);
    }else{
      sheets[8].getRange(row,2).setValue(twitter_id);
      sheets[8].getRange(row,3).setValue(new Date());
    }
    reply_message = "twitter連携ありがとう！\n\nTwitter ID : " + twitter_id + "";
    log_func_name += " twitterRgst()";
}

function getTwitterId(line_id){
    log_func_name += " getTwitterId()";
    var data_array = sheets[8].getDataRange().getValues();
    var row = findRow(data_array, line_id, 1);
    if(row == false){
      return ""
    }else{
      return "@"+ sheets[8].getRange(row,2).getValue();
    }
}

function twitterCheck(line_id){
    var data_array = sheets[8].getDataRange().getValues();
    //Log("test", data_array.join(","));
    var row = findRow(data_array, line_id, 1);
      if(row == false){
        reply_message = "twitterアカウントは連携されていないよ！";
      }else{
        var id = sheets[8].getRange(row,2).getValue();
        reply_message = "twitter連携アカウントは\n\nTwitter ID : @" + id + " です。";
      }
}