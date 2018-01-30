//*READ ME* '17.5.23 by Atsuya Kobayashi
//編集は ⌘(ctrl)+Shift+Rでスパーリロードしてスクリプトを最新の状態にしてから行って下さい。
//編集後は保存をしておいてください ⌘(ctrl)+S
//公開>ウェブアプリケーションとして導入>プロジェクトバージョン新規作成=>更新　でLINE botの設定が反映されます。
//ここはスプレッドシートを扱うスクリプトです(くつきーさんと開発中)

//OC = Open/Close
var sheet_for_oc = sheets[0];
var range_for_oc = sheet_for_oc.getRange("B1");//指定するセルの範囲を取得
var is_open = false;//初期値は閉まっている状態
if(range_for_oc.getValue() == "開"){is_open = true;}
if(range_for_oc.getValue() == "閉"){is_open = false;}

function isOpen() {
  if(is_open){
    reply_message = "部室は今開いているよ！";
  }else{
    reply_message = "部室は閉まっているよ。開けて！";
  }
  //ログ用のメッセージ
  log_func_name += "　isOpen()";
}
function openClose(user_message,user_name,user_id,oc) {
  var date = new Date();
  if(oc == "open!"){
     if(is_open==false){ 
        reply_message = user_name + "さん、開けてくれてありがとう！！！";
        var user_coment = user_message.replace(/解錠/g , "" ).replace(/ /g , "" );
        tweetOpen(user_coment,user_name);
        range_for_oc.setValue("開");
        sheet_for_oc.getRange("B4").setValue(user_name);
        sheet_for_oc.getRange("C4").setValue(date);
        sheet_for_oc.appendRow(["解錠",user_name,user_id,date]);
      }else{
        reply_message = "ありがとう！部室はもう開いているよ！！！！";
      }
  }
  if(oc == "closed!"){
     if(is_open){
        reply_message = user_name + "さん、閉めてくれてありがとう！！！";
        var user_coment = user_message.replace(/施錠/g , "" ).replace(/ /g , "" );
        tweetClose(user_coment,user_name);
        range_for_oc.setValue("閉");
        sheet_for_oc.getRange("B3").setValue(user_name);
        sheet_for_oc.getRange("C3").setValue(date);
        sheet_for_oc.appendRow(["施錠",user_name,user_id,date]);
     }else{
        reply_message = "ありがとう！部室は締めてあるよ！！！！";
     }  
  }
  //ログ用のメッセージ
  log_func_name += "　openClose()";
}
function autoClose(){//トリガー設定：PM10:00~PM11:00
  if(is_open){
    range_for_oc.setValue("閉");//毎晩10時に自動で締めます
    sheet_for_oc.appendRow(["自動施錠","autoClose()","autoClose()",new Date()]);
  }
}