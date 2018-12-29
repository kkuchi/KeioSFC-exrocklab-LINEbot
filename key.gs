var keySheet = sheets.getSheetByName("施錠");
var keyStatus = keySheet.getRange("F1");
var is_open = false;
if(keyStatus.getValue() == "開") is_open = true;
if(keyStatus.getValue() == "閉") is_open = false;

function isOpen(){
  if(is_open){
    replyMessage = "部室は今開いているよ！遊びに来てね！";
  }else{
    replyMessage = "部室は閉まっているよ。開けてー！";
  }
}

function open(nickname){
  if(is_open){
    replyMessage = "部室の鍵は既に開いているよ！";
  }else{
    // 現在時刻
    var now = new Date();
    // 7時より前、21時半以降はis_openとシートの変更ができないように
    if(now.getHours() < 7 || now.getHours() > 21 || (now.getHours() == 21 && now.getMinutes() > 30)){
      replyMessage = "今は部室を開ける事が出来ない時間だよ...また昼間に来てね。";
    }else{
      // それ以外ではis_openをtrueにしてsetValue("開")
      is_open = true;
      keyStatus.setValue("開");
      keySheet.getRange(keySheet.getLastRow()+1,1, 1,3).setValues([[now, "解錠", nickname]]);
      postUpdateStatus(nickname + "さんが鍵を開けてくれたよ！");
      replyMessage = "解錠を記録・ツイートしたよ！ありがとう！";
    }
  }
}

function close(nickname){
  if(!is_open){
    replyMessage = "部室の鍵は既に閉まっているよ！";
  }else{
    var now = new Date();
    is_open = false;
    keyStatus.setValue("閉");
    keySheet.getRange(keySheet.getLastRow()+1,1, 1,3).setValues([[now, "施錠", nickname]]);
    postUpdateStatus(nickname + "さんが部室を閉めてくれたよ！");
    replyMessage = "施錠を記録・ツイートしたよ！ありがとう！";
  }
}

function autoClose(){
  var now = new Date();
  if(is_open){
    is_open = false;
    keyStatus.setValue("閉");
    keySheet.getRange(keySheet.getLastRow()+1,1, 1,3).setValues([[now, "施錠（自動）", "部室ちゃん"]]);
  }
}