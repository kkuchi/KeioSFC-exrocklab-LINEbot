# ex.rocken LINE bot
LINE-bot using Messaging API for member of Keio Univ.SFC Ex.Rock Lab.
慶應義塾大学元ロック研究会の人々のために， 様々な昨日を詰め込んだLINE botを作成しました． 
サーバーを借りるのが面倒だったので， Google Apps Scriptを用いてでWebアプリとして動いています． データベース代わりにGoogleスプレッドシートを用いています．

### 主な機能
LINE botとの会話を通して， 以下のことが可能です．

- 会話
- 部室練習の予約 Googleカレンダーの編集
- 部室練習予約状況の確認 Googleカレンダーの確認
- 部員の名前に対しての反応
- 部室ちゃんアカウントへのツイート
- 部室へのチェックイン
- 部室からのチェックアウト
- 湘南台⇔慶応大学バスの確認
- おみくじ
- 自分のtwitter垢の連携

### スクリプトファイル

- main.gs
- tweet.gs
- member_serach.gs
- calendar.gs
- message_register.gs
- random_reply.gs
- tools.gs
- bus.gs
- twitter_account.gs
