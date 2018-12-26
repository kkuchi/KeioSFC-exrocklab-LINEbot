var busSheets = SpreadsheetApp.openById(getBusSheetId());
var holidays = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');// 日本の祝日のgoogleカレンダー
// 出発バス停、曜日（平日、土曜、日曜）毎の終バス
var lasts = {
  station:["21:50s", "20:10", "19:50s"],
  sfc:["22:50", "20:30", "20:13r"]
};
// 出発バス停、曜日（平日、土曜、日曜）毎の始バス
var firsts = {
  station: [["7:10", "7:17", "7:24t"],["7:15", "7:24t", "7:30"],["7:35", "7:50", "8:05"]],
  sfc:[["6:43r", "7:00tr", "7:05sr"],["7:00tr", "7:05sr", "7:15tr"],["7:18r", "7:58r", "8:10sr"]]
};

function replyBusTime(str, flag){
  var now = new Date();
  // 曜日によって参照する列を変える
  var col;
  var d = now.getDay();
  // 日曜日or祝日は日曜ダイヤ, 土曜は土曜ダイヤ、それ以外は平日ダイヤ
  if(d == 0 || holidays.getEventsForDay(now).length > 0){
    col = 4;
  }else if(d == 6){
    col = 3;
  }else{
    col = 2;
  }
  // 現在の時、分を取得
  var h = now.getHours();
  var m = now.getMinutes();
  var text = "もうすぐ"+str+"に来るバスは以下の通りだよ！\n\n";

  // flag,曜日から終バスの時分を取得
  var lastBus = lasts[flag][col-2].split(":");
  // 同様に始バスの時分を取得
  var firstBusHour = firsts.station[col-2][0].split(":")[0];
  var fin = false;
  // 終バスの時より遅いor始バスの時より早ければfinをtrue（今日のバス終了）に
  if(h>lastBus[0] || h<firstBusHour) fin = true;
  // 終バスの時と同じand終バスの分より遅ければfinをtrueに
  else if(h==lastBus[0] && m>lastBus[1]) fin = true;
  Logger.log(fin);
  // 終バスが終わっている場合
  if(fin) text = "すでに終バスが終わっているよ...\n" + str + "発の始バスは以下。\n\n";
  // 現在時刻と比較してバスの時間を取得する関数を実行。配列で帰ってくるので文字列化してカンマを改行に置き換え
  var times = busTimes(flag, h, m, d, col, fin, now).join(",").replace(/,/g,"\n");
  text += times;
  replyMessage = text;
}

function busTimes(str, h, m, d, col, bool, day){
  // 駅orキャンパスからのバス時刻表を取得
  var dataSheet = busSheets.getSheetByName("from"+str);
  // return用の配列を定義
  var content = [];
  // 終バスが終わっているとき
  if(bool){
    // バスがない時間（終バス後〜始バス前の時）のなかで、まだ日付が変わっていないとき
    if(h>lasts.station[col-2].split(":")[0]){
      // 日付、曜日に+1
      day.setDate(day.getDate() + 1);
      d++;
      // 曜日は6までなのでそれより大きくなった場合は0にする
      if(d > 6) d=0;
    }
    // 曜日によってcolを変える
    if(d == 0 || holidays.getEventsForDay(day).length > 0) col = 4;
    else if(d == 6) col = 3;
    else col = 2;

    // 曜日に合わせた始バスから3本の取得
    var first = firsts[str][col-2];
    for(var i=0; i<3; i++){
      // バスがない時間(true)のjpTimeJudge。始バスから3本のデータを整える
      content.push(jpTimeJudge(true, first[i]));
    }
  }else{
    // バスがある時間なのでバスの時間のシートを取得
    var values = dataSheet.getRange(h-3, col, dataSheet.getLastRow()-h+4).getValues();
    content = getAvailableBus(h, m, values, str, col);
  }
  return content;
}

function getAvailableBus(hour, min, values, str, col){
  // return用の配列dataを定義
  var data = [];
  // valuesから行を取り出すためにvalueを使う
  var value;
  // 出発点・曜日から終バスの時間を出しておく
  var lbTime = jpTimeJudge(true, lasts[str][col-2]);

  Logger.log(values);
  // 時をまたぐかどうかの判定
  var step = false;
  // valuesの行数分だけ繰り返し
  for(var j=0; j<values.length; j++){
    // 1行取り出してvalueに入れる
    value = values[j][0].split(",");
    Logger.log(value);
    for(var i=0; i<values[j][0].split(",").length; i++){
      // valueの数字が現在の時間より小さい場合はこのループを飛ばす
      Logger.log("min:"+min+ "\nvalue[i]:" +value[i]);
      if(!step && min > value[i].replace("r", "").replace("t", "").replace("s", "")) continue;
      // ロータリー、ツイン、笹久保経由の判定とデータの整型
      var result = jpTimeJudge(false, value[i], hour+j);
      Logger.log("result:"+result);
      data.push(result);
      // 今pushしたデータが終バスの時間と一致した場合ループを抜ける
      if(result == lbTime) break;
      // dataが3つになった時も同様
      if(data.length > 2) break;
    }
    // 最後にpushしたデータが終バスと一致したら「これが終バス！」を追加してbreak
    if(data[data.length-1] == lbTime) {
      data[data.length-1] += "（これが終バス！）";
      break;
    }
    // dataが3つの時もbreak
    if(data.length > 2) break;
    // dataが2つ以下の時はstepをtrueに
    else step = true;
  }
  return data;
}

function jpTimeJudge(bool, str, hour){
  var log = "";
  // 各種バリエーションを判定してreturnする文章を加えていく
  if(/r/.test(str)) {
    str = str.replace("r", "");
    log += "ロータリー発";
  }
  if(/t/.test(str)) {
    str = str.replace("t", "");
    log += "ツインライナー";
  }
  if(/s/.test(str)) {
    str = str.replace("s", "");
    log += "笹久保経由";
  }
  // 配列とシートではデータの表記が違うので処理を分ける
  if(bool){
    var con = str.split(":");
    log = "・" + con[0] + "時" + con[1] + "分 " + log;
  }else{
    log = "・" + hour + "時" + str + "分 " + log;
  }
  return log;
}
