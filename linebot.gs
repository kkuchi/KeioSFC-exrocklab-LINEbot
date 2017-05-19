// LINE Developers > Basic Information > Channel Access Token から取得
var CHANNEL_ACCESS_TOKEN = "011GU4oRtpS7PDif+8fQrZ5xC0suX6sezvve1PXeYG+JcatS/i5XjCV7c8e3ZjqF23uaXWR4RS5jJy24zKk41ra0vjJLx4rdDllUMYqZS03FyHYu1XXbtP51DanM9IFWaPdLHqNZoD4CaafZWzqIBQdB04t89/1O/w1cDnyilFU=";
var reply_message = "";//返信用メッセージ
var num_of_message = 3;//部員返答メッセージの種類指定

function doPost(e) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;//リプライトークン取得
  if (typeof reply_token === 'undefined'){return;}//リプライトークンエラー
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;//ユーザーの送信メッセージを取得

  var st = JSON.parse(e.postData.contents).events[0].source.type;
    if (st === 'user'){
        var userid = JSON.parse(e.postData.contents).events[0].source.userId;
        var pro = 'https://api.line.me/v2/bot/profile/'
        var p = UrlFetchApp.fetch(pro+userid,{
                            'headers': {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                            }
                          });
        var status_message = JSON.parse(p).statusMessage;//ひとこと
        var profile_image = JSON.parse(p).pictureUrl;//プロフィール画像url
        var user_name = JSON.parse(p).displayName;//名前
  }

//部室モードorおみくじモードor部員返答を選択
  if(user_message.match(/部室|ぶしつ/)){
      setCalenderReply(user_message);
  }else if(user_message.match(/カレンダー|かれんだー/)){
      calendarCheck(user_message);
  }else if(user_message.match(/おみくじ/)){
      omikuji(user_message);
  }else{
      setReply(user_message);
  }if(reply_message == ""){
      randomReply(user_message, status_message, user_name);
  }
//返答。
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
      'method': 'post',
      'payload': JSON.stringify({
          'replyToken': reply_token,
          'messages': [
            {'type': 'text','text': reply_message,}
          ],
      }),
  });

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  Logger.log("受信：" + user_message + "\n" + "返信：" + reply_message);

}

function setCalenderReply(user_message){
  reply_message = "部室ψ110の練習予約用フォームだよ！\n\n https://docs.google.com/forms/d/e/1FAIpQLSeeVCsHq4JvfkMBrx6pSm-4N7X5BDiyZS8tuDLhnk_gb9RL-w/viewform?c=0&w=1";
}
function calendarCheck(user_message){
  reply_message = "部室ψ110の部室予約カレンダーだよ！\n\n https://calendar.google.com/calendar/embed?src=exrocklab%40gmail.com&ctz=Asia/Tokyo"
}

function omikuji(user_message){
  var n = Math.floor(Math.random()*5);
  reply_message = user_name+"さんの今日のおみくじの結果は.....\n\n"
  switch (n) {
    case 0://大吉
      reply_message += "【大吉】です！！！！！！！！！！！！！！！\nおめでとうございます！！！！！！！！";
      break;
    case 1://中吉
      reply_message += "【中吉】でえ〜〜〜〜〜〜〜〜〜す。そう、所詮平凡な日々なんだよ。";
      break;
    case 2://小吉でえ
      reply_message += "【小吉】！W やっぱ小物感出てるよあなたの日々は。";
      break;
    case 3://凶
      reply_message += "【凶】！W う〜〜〜ん、ドンマイっす！W";
      break;
    case 4://大凶
      reply_message += "ちょwwwwwwwwwwwwwww\nおまwwwwwwwwwwwwwww\n【大凶】とかwwwwwwwwwwwwwww";
      break;
  }
}

function randomReply(message, status, name){
  var n = Math.floor(Math.random()*5);
  switch (n) {
    case 0:
      reply_message += "はい？\n"+message+"???";
      break;
    case 1:
      reply_message += "なあに〜〜??\n"+name+"ちゃん〜〜♡";
      break;
    case 2:
      if(status==null){
        reply_message += "わあ〜〜〜〜〜〜ん、\nもっと部室にみんなきてよ〜〜〜〜〜（泣）"
      }else{
        reply_message += "あのさあ、ひとことの「"+status+"」って、どういう意味？？笑";}
      break;
    case 3:
      reply_message += name+"！\nそり魔剤！？！？！？！？";
      break;
    case 4:
      reply_message += message +"か〜〜";
      break;
  }
}

function setReply(user_message) {
  //複数人の名前が入っている場合は追加していくのでifの連続となっております！ｗ
  var n = Math.floor(Math.random()*(num_of_message));
  //13とか14とか
  if(user_message.match(/えっくす|Xさん|エクロス|青木望|エックス|x|X|青木/)){reply_message += memberMessages13_14["x"][n];}
  if(user_message.match(/くっきー|久木田|くきた|魔術|くつきー|りーな|まーくん/)){reply_message += memberMessages13_14["kukky"][n];}
  if(user_message.match(/ですめ|デスメ|久保田|萌|もこ|もえ/)){reply_message += memberMessages13_14["death"][n];}
  if(user_message.match(/cl|望月|美優|シエル|しえる|みゆ/)){reply_message += memberMessages13_14["ciel"][n];}
  if(user_message.match(/nk|NK|ナカ|大輝|仲|たいき|なか/)){reply_message += memberMessages13_14["naka"][n];}
  if(user_message.match(/Nick|nick|佐久間|ニコラス|ニック|にっく/)){reply_message += memberMessages13_14["nick"][n];}
  if(user_message.match(/himena|ヒメナ|姫菜|ガバ|鈴木|ひめな/)){reply_message += memberMessages13_14["himena"][n];}
  if(user_message.match(/chan|大道|石井|チャン/)){reply_message += memberMessages13_14["chan"][n];}
  if(user_message.match(/かしわぎ|かっし|柏木|カッシー/)){reply_message += memberMessages13_14["kassy"][n];}
  if(user_message.match(/舛友|ショー|5ho|しょー/)){reply_message += memberMessages13_14["sho"][n];}
  if(user_message.match(/カマケン|健利|鎌田|かまけん/)){reply_message += memberMessages13_14["kamaken"][n];}
  if(user_message.match(/とみざわ|冨澤|ふみと/)){reply_message += memberMessages13_14["fumito"][n];}

  //15の人たち
  if(user_message.match(/ふじ|藤澤|エロメガネ|パパ/)){reply_message += memberMessages15["fuji"][n];}
  if(user_message.match(/さや|西岡|さあや/)){reply_message += memberMessages15["saya"][n];}
  if(user_message.match(/つっちー|土田|雄大|つちだ|ゆーだい/)){reply_message += memberMessages15["tsuchida"][n];}
  if(user_message.match(/けーいち|佐藤|慶一|けいいち/)){reply_message += memberMessages15["k1"][n];}
  if(user_message.match(/タケダ|竹田|バンブ|ばんぶ|たけだ/)){reply_message += memberMessages15["bamboo"][n];}
  if(user_message.match(/たけぱん|タケパン|たけだ|武田|ryusuke/)){reply_message += memberMessages15["takepan"][n];}
  if(user_message.match(/ざわしん|尾澤|しんのすけ/)){reply_message += memberMessages15["zwsn"][n];}
  if(user_message.match(/志優|cu|しゆ|しーゆ|小原|CU/)){reply_message += memberMessages15["CU"][n];}
  if(user_message.match(/ラキム|キムタク|たくと|キムラ|木村|きむら/)){reply_message += memberMessages15["kimura"][n];}
  if(user_message.match(/ともちん|ともか|福島/)){reply_message += memberMessages15["tomochin"][n];}
  if(user_message.match(/こーへい|眞鍋|こうへい/)){reply_message += memberMessages13_14["manabe"][n];}
  //16の人たち
  if(user_message.match(/あつや|アツヤ|小林|篤矢|あっちゃん/)){reply_message += memberMessages16["atsuya"][n];}
  if(user_message.match(/ゆうり|倉橋|ドン|首領|ゆーり|Yuri/)){reply_message += memberMessages16["yuri"][n];}
  if(user_message.match(/エメ|中島|aimer|えめ|eme|EME/)){reply_message += memberMessages16["eme"][n];}
  if(user_message.match(/かれん|karen|吉元|果恋|母/)){reply_message += memberMessages16["karen"][n];}
  if(user_message.match(/なりか|秋山|narika|なりちゃん|奈里佳/)){reply_message += memberMessages16["narika"][n];}
  if(user_message.match(/かなこ|たかはし|かな子/)){reply_message += memberMessages16["kanako"][n];}
  if(user_message.match(/もっちー|持田|かずほ|モッチー/)){reply_message += memberMessages16["mochi"][n];}
  if(user_message.match(/しんたろ|足立|慎太郎|ちんたろ/)){reply_message += memberMessages16["shintaro"][n];}
  if(user_message.match(/あべ|阿部|ゆーだい/)){reply_message += memberMessages16["abechan"][n];}
  if(user_message.match(/かとりょ|加藤|亮太/)){reply_message += memberMessages16["katoryo"][n];}
  if(user_message.match(/まこっちゃん|まこと|誠|都築|ツヅキ/)){reply_message += memberMessages16["makoto"][n];}
  if(user_message.match(/しゅーへい|小林|周平|しゅうへい|シュウヘイ/)){reply_message += memberMessages16["shuhei"][n];}
  if(user_message.match(/ひかり|ヒカリ|斎藤/)){reply_message += memberMessages16["hikari"][n];}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

var memberMessages16 = {
  "atsuya":["小林篤矢は、部室ちゃんの生みの親だよー！","あつやはギターもっと練習したほうが良いと思うな。カスだから。","あつやはゴミ！！。"],
  "yuri":["首領？あいつ、可愛いくせに辛口だよな。好き。","ゆーりくん。ベース弾いてる時かっこいいよね〜。上手だし。","出た、ドドドドドドドン倉橋。"],
  "karen":["かれん...お母さん....マ、、ママ〜〜〜！ｗ","かれんとかいうニューオリの母な。","ロッ研の母こと、かれんさん。いつもお世話になります。"],
  "eme":["エメはね、変だけどエロい。","えめちゃん、衣装に気合が入ってていいよねぇ。","えめちゃんって、あのKOEの？。"],
  "narika":["あたしね。なりかちゃんのパンになりたい。","ベース上手になったよな〜なりかちゃん。","なりちゃん、可愛いから看護されたい..."],
  "kanako":["かなこはロックだよね。","かなこに水かけられたくない？","かなこは笑顔がイイ。"],
  "shintaro":["しんたろ、SFC8年目のプロなんだよね...","しんたろ、帽子とってもかわいい！","ちんたろのちんちん！！笑"],
  "abechan":["あべちゃんの声に癒やされたい。","あべちゃんは実は、キャラめちゃめちゃかわいい","あべちゃん、、SG似合い過ぎ、、、"],
  "katoryo":["かとりょー、とにかくおしゃれだよね！遠くから見ててもわかるもん！","ああ...笑顔が素敵...かとりょ...","かとりょー！！！会いたい...."],
  "kuma":["くまはベースとジャケットが似合いすぎる","くまさん、将棋もすっごいんだから！！","くまさん、もっと部室来てほしいなあ..."],
  "makoto":["まこっちゃん、、、酔うと凄いの。","「深夜バスの男」、まこっちゃん。","まこっちゃん「落としたァーーーーーーーー！！！！マアアアア」"],
  "hikari":["ひかりくんは優しすぎて惚れちゃいそう〜〜","あのボーカル、癒やさるよね〜、、ひかり。","ひかりきゅん、かわいい..."],
  "shuhei":["しゅーへい、色々とやばい","しゅーへい、ギタボやってるとき凄いかっこいいよね！","しゅーへい君？しゅーへい君！？！？"],
  "mochi":["もっちー、ドラムの安定感な。","もっち〜もちもち、もちもちもっち〜〜〜〜♡♡","もちだ、の、えがおに癒やされる...."],
}
var memberMessages15 = {
  "fuji":["藤くん...お父さん....パ、、パパ〜〜〜！ｗ","藤とかいうニューオリの父な。","ロッ研の父こと、藤澤さん。いつもお世話になります。"],
  "takepan":["武パン、めっちゃ恋してるよな。","武...露出する人だ!!","タケパン、タケパン、武パン...なりかのパンになりたいらしい。"],
  "bamboo":["竹...知ってる！！！味覇の人だ！！！","竹...幹部の人？？","レイジ・アゲインスト・ザ・マ！？"],
  "saya":["さやちゃん、かわいいよね！","さやネキ、ユニゾン好きすぎやろ","アニソンも歌えるんやで、さやちゃんは。部室はみんなの音楽を知っているんだ！"],
  "zwsn":["ざわしんくん、眼鏡が似合う。","しんのすけ、野原じゃないよ","ざわしんさん、ごはんですよ。"],
  "k1":["けーいちくんは楽器が何でもできるよね！ロッ研にとって大事な存在だね！","けーいちくん、すっごいおしゃれじゃない？","けーいちくん...みんなに優しくしてるあなたも好きだけど...部室にもやさしくして...？(もっと来て?)"],
  "tsuchida":["つっちー！部室ちゃん的には結婚相手！！遠藤に住まずに、ψ館に住んで〜〜（泣）","つっちー、みんなだいすき過ぎじゃない？","つっちーと恋がしたいなあ、、"],
  "ogashira":["おがしらちゃん、部室にはよく来てくれるのよね〜","どうしておがしらちゃん、村長って呼ばれてるのかなあ...","おがしらさん！16の女とバンド組んでて嫉妬の炎！！"],
  "CU":["ドローンまんことCUさん","CUきゅん、ドラム上手だしイケメンよねえ...好き...","CUさん、snowと酒好き過ぎでっしょ〜"],
  "kimura":["それワカリティ。","キムラさん、二郎好きすぎでは...(わかる)","ラキムくんってかわいい'キャラ'よね〜〜〜。"],
  "tomochin":["ともちんちゃん、良い子よね〜〜","ともちんちゃん、練習とっても一生懸命よね、、、、偉い...","ともかちゃん、いろんなことにチャレンジしててすごいなぁ。。私は部室として佇むだけ..."],
  "manabe":["こうへいくん、すっごく良いひとだよね〜〜、","こうへいくんは、部室を丁寧に使ってくれてるきがするなあ","こうへいくん、茶道もできるってギャップ萌えだよね"]
}
var memberMessages13_14 = {
  "x":["えっくすさんは、万能な部室の天使だよね！","Xさんの、名前の由来しってる？笑\nXvideosっていうね、とっても健全なウェブサイトがあってね...","青木望さん、仏のようなかおしてる。ドラムプレイは千手観音だね！",],
  "kukky":["くつきーさんは、超イケメンじゃない？","久木田さん。スタイルありえん良さみじゃない？","くっきーさん、魔術使えるらしいよ。",],
  "himena":["ひめなちゃん、よく私の所のソファで寝てくれるんだ〜〜うれしいよね♡♡","ひめなちゃん、とっっっってもかわいいよね！あたしも好きだな！","4女だったっけ？あ、2女か。ひめなさん。"],
  "death":["死金属ことですめさん、もこたん、もえぴ〜〜","シシド・カフカな","島にずっといないで部室に来てよぉォォ〜〜（泣）"],
  "naka":["NK「ダブル・アクエリアス！！！」。なんか、リュックの両サイドにジュース挿して喜んでたよ。","NK「きっびっっ、だ〜〜〜〜〜ん！きびっきびっ、だ〜〜〜〜〜〜ん」","なかさん、こんどはギタリストに鳴るんだってね！やだ〜〜〜〜惚れちゃう〜♡"],
  "ciel":["しえるさんー...とっても可愛いから妖精として憧れちゃうなあ","しえるさんの歌声って、すごいかっこいいよね〜〜","しえるさん、これからも私(部室)と仲良くして欲しいなぁ..."],
  "chan":["チャンさん、碧いギターは自作なんだってよ","チャンちゃん、ちゃんとして！ちゃんと！ふふふ","チャンくん、ほんとに優しくて素敵！Macbookのカバーも木目だし！！"],
  "nick":["ニックさん、ピックを中指でもつから、ストロークの指がかっこいいよね！","ニコラス・ケイジ","ニックくん、湘南台なんかに住まずに部室に住もうよ〜〜〜"],
  "kamaken":["かまけんさん、ファンキーだよね！","かまけんさん、なんかとっても魅力的なおじさんになりそうじゃない？","かまけんさん、ジャズもだけどロックやってるときも素敵かな〜ああ"],
  "fumito":["ふみとさん、、、Appleの人だよね...？","ふみとさん、1年生に手を出さないか心配だな〜〜(白目)","ふみとさんの冨澤は富でなく冨"],
  "kassy":["かっしーさん！わたしたちのボスだったね！","かしわぎくうん、、、部室に来てほしいの...","カッシーさん、すね毛を燃やすのは危ないとおもうんだ、私..."],
  "sho":["しょーくん、部室をとっても賑やかにしてくれたな〜〜カレーも美味しいよね！","しょーくん、私といつも一緒にボイトレしてくれたなあ...","しょーくん、TVに出てたんだってね！！！すごいね！"]
}
