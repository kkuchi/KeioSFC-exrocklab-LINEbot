//*READ ME* '17.5.23 by Atsuya Kobayashi
//編集は ⌘(ctrl)+Shift+Rでスパーリロードしてスクリプトを最新の状態にしてから行って下さい。
//編集後は保存をしておいてください ⌘(ctrl)+S
//公開>ウェブアプリケーションとして導入>プロジェクトバージョン新規作成=>更新　でLINE botの設定が反映されます。

/*↓これをコピペで！
if(user_message.match(/ここに検知するワード/)){reply_message += memberMessagesここにどのオブジェクトかを["指定する名前"][n];}
*/

function memberReply(user_message,status_message,user_name,profile_image) {//複数人の名前が入っている場合は追加していく方針なのでifの連続となっております！ｗ
  var array = [];//誰に対してのメッセージを返信するのか、名前を追加していく。
  
  //人名パターンマッチング
  if(user_message.match(/A|Aさん|えー/)){array.push('x');}
  if(user_message.match(/B|Bさん|びー/)){array.push('x');}
  if(user_message.match(/C|Cさん|しー/)){array.push('x');}

  //Log("","memberReply():配列内="+array.join(','));
  
  //反応した人数分だけ、返信する文字列についかしていく。 
  if(array.join(',') == ""){
      registeredReply(user_message,status_message,user_name,profile_image);//みんなで登録した語を検索
    //Log("","実行：registeredReply()");
    //ログ用のメッセージ
  }else{
    for(var i = 0; i < array.length; i++){
      reply_message += getMessageByNameFromSheet(array[i]);
    }
    //Log("","結果：memberReply()="+reply_message);
    log_func_name += "　memberReply()";//log用のメッセージ
  }
}
function getMessageByNameFromSheet(name){
  var data_array = sheets[1].getDataRange().getValues(); //受け取ったシートのデータを二次元配列として取得
  var row = findRow(data_array,name,1);//名前の列は1。ここで行番号を取得
  var col = 3 + Math.floor(Math.random()*(num_of_message));//ランダムで列番号を3,4,5を指定。
  log_func_name += "　getMessageByNameFromSheet()";//log用のメッセージ
  return data_array[row-1][col-1];//取得したメッセージの文字列を返す
}