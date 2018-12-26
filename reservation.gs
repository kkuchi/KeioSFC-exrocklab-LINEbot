// 予約するための関数
function reservation(text, username, userId){
  // まずは「予約：」を除去
  var textdata = text.replace("予約", "").replace(":", "").replace("：", "");
  // 最初のカンマまでを切り出し。ここが日付
  var dateString = textdata.match(/.*?,/)[0].replace(",", "");
  var date;
  if(dateString == "今日"){
    date = new Date();
  }else if(dateString.match(/.*?\/.*?\/.*?/)){
    date = new Date(dateString);
  }else{
    var d = new Date();
    date = new Date(d.getFullYear() + "/" + dateString);
  }
  var events = cal.getEventsForDay(date);
  // カンマに挟まれた要素取得
  var num = text.match(/,.*?,/)[0];
  // カンマ、スペース（全角半角）を除去
  num = num.replace(/,/g,"").replace(" ", "").replace("　", "");
  var event = events[num];
  // 予約したいコマが予約されていない場合は予約を実行する
  if(event.getTitle() == num+"限"){
    // bNameはtextDataからdateString, num, スペース（全角半角）, カンマを除去
    var bName =
    textdata.replace(dateString, "")
    .replace(num, "")
    .replace(/ /g, "")
    .replace(/　/g, "")
    .replace(/,/g, "");
    // コロンは全角なので注意
    event.setTitle(event.getTitle()+ "：" +bName);
    // IDの後ろのセミコロンはキャンセル時にIDをmatchで抽出するために付ける
    event.setDescription("予約者："+ username + "\nID:"+ userId + ";");
    replyMessage = Utilities.formatDate(date, "JST", "MM月dd日")+ "(" + youbi[date.getDay()] + ") " + num + "限の予約が完了したよ！";
    // logSheetに予約入力の日時と予約した日付時限、タイトル、予約者を記録。setValuesは1行でも２次元配列なので注意
    logSheet.getRange(logSheet.getLastRow()+1, 1, 1,5).setValues([[new Date(), date, num, event.getTitle(), username]]);
  }else{
    replyMessage = "既に他のバンドが予約しているみたい・・・";
  }
}

// 予約キャンセルのための関数
function cancel(text, userId){
  // ↓textから「キャンセル」「取り消し」とコロン（全角半角）を除去
  var textData = text.replace("取り消し", "").replace("キャンセル", "").replace(":", "").replace("：", "");
  //  ↓カンマまでを抽出
  var dateString = textData.match(/.*?,/)[0];
  var date;
  if(dateString.replace(",", "") == "今日"){
    date = new Date();
  }else if(dateString.match(/.*?\/.*?\/.*?/)){
    // ↓dateStringが「2018/01/01」のように年が入っている場合はそのままDate作成、年がない場合は実行日の年を代入
    date = new Date(dateString);
  }else{
    var d = new Date();
    date = new Date(d.getFullYear() + "/" + dateString);
  }
  // ↓時限はtextDataからdateStringとスペース（全角半角）を除去
  var num = textData.replace(dateString, "").replace(" ", "").replace("　", "");
  var event = cal.getEventsForDay(date)[num];
  if(event.getTitle() != num + "限"){
    // ↓DescriptionにIDがあるかを確認、取り消し実行者と予約者のIDが一致した場合のみ取り消しする
    if(/ID:.*?;/.test(event.getDescription()) && event.getDescription().match(/ID:.*?;/)[0].replace("ID:", "").replace(";", "") == userId){
      event.setTitle(num+"限");
      event.setDescription("");
      replyMessage = Utilities.formatDate(date, "JST", "MM月dd日") + "(" + youbi[date.getDay()] + ") " + num + "限の予約を取り消したよ！";
      // キャンセルした予約の背景はグレーに
      grayCell(date, num);
      // logSheetにキャンセル日時、予約した日付時限、"キャンセル"を記録。setValuesは２次元配列
      logSheet.getRange(logSheet.getLastRow()+1,1, 1,4).setValues([[new Date(), date, num, "キャンセル"]]);
    }else{
      replyMessage = "指定したコマの予約は違う人がしたみたい...\n予約の取り消しは予約した人にお願いしてね！";
    }
  }else{
    replyMessage = "指定したコマには予約がないみたいです...\n取り消したい予約を確認してね！";
  }
}

// キャンセルした予約が記録されているセルの背景色をグレーにする関数
function grayCell(date, num){
  // 現在の最終行
  var lRow = logSheet.getLastRow();
  //logSheetのBC列（予約した日付と時限）取得
  var logs = logSheet.getRange(2,2, lRow-1,2).getValues().reverse();
  for(var i=0; i<logs.length; i++){
    // 日付の一致は年月日を取得して合わせないといけないのでめんどい。Moment.js入れた方が良いかも
    if(logs[i][0].getFullYear() == date.getFullYear() && logs[i][0].getMonth() == date.getMonth() && logs[i][0].getDate() == date.getDate() && logs[i][1] == num){
      // logsで配列をreverseしたので行数は一番下から遡っていく
      logSheet.getRange(lRow-i,1,1,5).setBackground("#aaaaaa");
      // 該当行をグレーにしたらループを抜ける
      break;
    }
  }
}

// 指定日付の予約を表示するための関数
function targetDayReservation(d, e){
//  ↓年を指定していない場合は実行時の年を入れる、年末年始の使用には注意
  if(!d.match(/.*?\/.*?\/.*?/)){
    var yDate = new Date();
    var year = yDate.getFullYear();
    d = year + "/" + d;
  }
  var date = new Date(d);
  var events = cal.getEventsForDay(date);
  var contents = [];
  for(var i=0; i<events.length; i++){
    var ele;
    if(!events[i].getDescription() == ""){
//      「予約者」の後のコロンは全角コロンなので注意。改行を除去
      // 予約済みの場合
      if(/予約者：.*?\n/.test(events[i].getDescription())){
        ele = gCalendarObjectFilled(events[i].getTitle(), events[i].getDescription().match(/予約者：.*?\n/)[0].replace("\n", ""));
      }else{
        //　予約が入っていない場合
        ele = gCalendarObjectFilled(events[i].getTitle(), events[i].getDescription());
      }
    }else{
      ele = gCalendarObjectUnfilled(events[i].getTitle());
    }
    contents.push(ele);
  }
  var day = youbi[date.getDay()];
  date = Utilities.formatDate(date, "JST", "MM月dd日");
  var data = flexCalendar(date+"("+day+")", contents);
  replyFlex(e, date+"("+ day +")の予約状況", data);
}

// 今日の予約を表示するための関数
function todaysReservation(e){
  var date = new Date();
  var events = cal.getEventsForDay(date);
  var contents = [];
  for(var i=0; i<events.length; i++){
    var ele;
    if(!events[i].getDescription() == ""){
//      上と同様「予約者」の後のコロンは全角なので注意。改行を除去
      if(/予約者：.*?\n/.test(events[i].getDescription())){
        ele = gCalendarObjectFilled(events[i].getTitle(), events[i].getDescription().match(/予約者：.*?\n/)[0].replace("\n", ""));
      }else{
        ele = gCalendarObjectFilled(events[i].getTitle(), events[i].getDescription());
      }
    }else{
      ele = gCalendarObjectUnfilled(events[i].getTitle());
    }
    contents.push(ele);
  }

  var day = youbi[date.getDay()];
  date = Utilities.formatDate(date, "JST", "MM月dd日");
  replyFlex(e, "今日の予約状況", flexCalendar(date+"("+day+")", contents));
}
