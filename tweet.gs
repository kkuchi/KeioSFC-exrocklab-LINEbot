var twitter = TwitterWebService.getInstance(
  getConsumerKey(),       // 作成したアプリケーションのConsumer Key
  getConsumerSecret()  // 作成したアプリケーションのConsumer Secret
);

/*---
Twitter DevelopersのAppのcallbackURLに
https://script.google.com/macros/d/~~~~~~~~~~/usercallback
を入力　(~~~~~の部分はGASのスクリプトID)
---*/

// 以下二つはTwitterの認証のためのもの
function authorize(){
  twitter.authorize();
}

function authCallback(request) {
  return twitter.authCallback(request);
}

// ツイート投稿
function postUpdateStatus(text){
  var service = twitter.getService();
  var response = service.fetch(
    'https://api.twitter.com/1.1/statuses/update.json',
    {
      method: 'post',
      payload: { status: text }
    }
  );
}