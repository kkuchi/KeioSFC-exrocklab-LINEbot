///////*READ ME* '17.5.23 by Atsuya Kobayashi
///////編集は ⌘(ctrl)+Shift+Rでス-パーリロードしてスクリプトを最新の状態にしてから行って下さい。
///////編集後は保存をしておいてください ⌘(ctrl)+S
///////カレンダーのやつです(開発中)

var cal = CalendarApp.getCalendarById('exrocklab@gmail.com');
var separater = " ";//スペースで区切るように設定
/*
function setCalenderReply(user_message){
  reply_message = "部室ψ110の練習予約用フォームだよ！\n\n https://docs.google.com/forms/d/e/1FAIpQLSeeVCsHq4JvfkMBrx6pSm-4N7X5BDiyZS8tuDLhnk_gb9RL-w/viewform?c=0&w=1";
}
*/
function calendarCheck(user_message){
  reply_message = "部室ψ110の部室予約カレンダーだよ！\n https://goo.gl/r0bzvk"
  log_func_name += "　calendarCheck()";//ログ用のメッセージ
}
function make_reservation(user_message,user_name){
  var band_name; //バンド名
  var player_name; //個人名
  var reserver_name; //予約者名
  var practice_date; //練習日程
  var practice_type;
  var period; //時限
  var reserve_info; //配列格納先
  
//多分こういう形で送ってもらう 「予約 バンド名[0] YYYY/MM/DD[1] n限[2]」
  user_message = user_message.replace(/予約 /g,'');
  reserve_info = user_message.split(separater);//ここで配列になる！
  player_name = user_name;
  band_name = reserve_info[0]; //バンド名
  //practice_type = reserve_info[1];
  practice_date = reserve_info[1]; //何日
  period = Number(reserve_info[2].replace(/限/g,'')); //n限

//★0限から7限までのイベントを取得★！！！！
  var start_time = practice_date + " " + "7:59:00";
  var end_time = practice_date + " " + "21:16:00";
  var events = cal.getEvents(new Date(start_time), new Date(end_time));
  var event = events[period].getTitle();
  
  log_func_name += "　make_reservation()";//ログ用のメッセージ
  
  if(event == period+"限 "||event == period+"限"||event == period+"限　"){
     events[period].setTitle(period+"限 " + band_name);
     reply_message = "予約を承りました！確認お願いします！\n\n【"+practice_date+"の予定】\n\n"+events[0].getTitle()+"\n"+events[1].getTitle()+"\n"+events[2].getTitle()+"\n"+events[3].getTitle()+"\n"+events[4].getTitle()+"\n"+events[5].getTitle()+"\n"+events[6].getTitle()+"\n"+events[7].getTitle()+"\n\nカレンダー\nhttps://goo.gl/r0bzvk";
     events[period].setDescription("予約者：" + player_name);
  }else{
     reply_message = practice_date + "の"+period+"限は既に｢"+events[period].getTitle().replace(period+"限",'').replace("：",'').replace(" ",'').replace(/個人練|バンド練/g,"")+"｣さんによって予約されている可能性があります...確認後連絡をとって見て下さい。\n" +"登録者："+events[period].getDescription();
  }
}
function check_reservation(user_message){
  user_message = user_message.replace(/確認 /g,'');
  var check_date = user_message;
  var start_time = check_date + " " + "7:59:00";
  var end_time = check_date + " " + "21:16:00";
  var events = cal.getEvents(new Date(start_time), new Date(end_time));//配列が返ってきた！
  
  reply_message = "【"+check_date+"の予定】\n\n"+events[0].getTitle()+"\n"+events[1].getTitle()+"\n"+events[2].getTitle()+"\n"+events[3].getTitle()+"\n"+events[4].getTitle()+"\n"+events[5].getTitle()+"\n"+events[6].getTitle()+"\n"+events[7].getTitle()+"\n\nカレンダー\nhttps://goo.gl/r0bzvk";
  
  if(reply_message==""){
    reply_message = "確認の日時を正しく入力してね";
  }
  log_func_name += "　check_reservation()";//ログ用のメッセージ
}
function delete_reservation(user_message,user_name){

  var band_name; //バンド名
  var player_name; //個人名
  var reserver_name; //予約者名
  var practice_date; //練習日程
  var practice_type;
  var period;
  var reserve_info;
  
//多分こういう形で送ってもらう 「削除 YYYY/MM/DD[0] n限[1]」
  user_message = user_message.replace(/削除 /g,'');
  reserve_info = user_message.split(separater);//ここで配列になる！
  player_name = user_name;
  practice_date = reserve_info[0]; //何日
  period = Number(reserve_info[1].replace(/限/g,'')); //n限

//★0限から7限までのイベントを取得★！！！！
  var start_time = practice_date + " " + "7:59:00";
  var end_time = practice_date + " " + "21:16:00";
  var events = cal.getEvents(new Date(start_time), new Date(end_time));

  if(events[period].getTitle() == period+"限 "){
    reply_message = practice_date + "の"+period+"限はまだ予約されていません...";
  }else if(player_name != events[period].getDescription().replace(/予約者：/g, "")){
    reply_message = "予約者と削除者の名前が異なっています。(LINE)"
  }else{
    events[period].setTitle(period+"限 ");
    reply_message = "予約されていた予定を削除しました。";
  }
  log_func_name += "　delete_reservation()";//ログ用のメッセージ
}