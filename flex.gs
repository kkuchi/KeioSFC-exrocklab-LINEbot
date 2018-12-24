// contentにbubbleを入れ、flexを返す。これをreplyPostの第二引数に入れる事でflexを送信する
function gFlex(title,content){
  return {
    "type": "flex",
    "altText": title,
    "contents": content
  }
}

// イベントのboxが入った配列をcontentsに入れ、bubbleを返す
function flexCalendar(date, contents) {
  return {
    "type": "bubble",
    "styles": {
      "footer": {
        "separator": true
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "予約状況",
          "weight": "bold",
          "color": "#1DB446",
          "size": "sm"
        },
        {
          "type": "text",
          "text": date,
          "weight": "bold",
          "size": "xxl",
          "margin": "sm"
        },
        {
          "type": "separator",
          "margin": "md"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "sm",
          "contents": contents
        }
      ]
    }
  }
}

// 予約されていないコマの取り出し
function gCalendarObjectUnfilled(name){
  return {
    "type": "box",
    "layout": "vertical",
    "margin": "md",
    "contents": [
      {
        "type": "text",
        "text": name,
        "size": "lg",
        "margin": "lg",
        "color": "#555555",
        "flex": 0
      },{
        "type": "separator",
        "margin": "lg"
      }
    ]
  }
}

// 予約されているコマの取り出し
function gCalendarObjectFilled(name, description){
  return {
    "type": "box",
    "layout": "vertical",
    "margin": "md",
    "contents": [
      {
        "type": "text",
        "text": name,
        "size": "lg",
        "margin": "md",
        "color": "#555555",
        "flex": 0
      },{
        "type": "text",
        "text": description,
        "size": "sm",
        "margin": "lg",
        "color": "#777777",
        "align": "end"
      },{
        "type": "separator",
        "margin": "md"
      }
    ]
  }
}

var fTutorial = {
  "type": "bubble",
  "styles": {
    "footer": {
      "separator": true
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "部室ちゃんⅡ世の\n使い方",
        "wrap": true,
        "weight": "bold",
        "size": "xxl",
        "margin": "sm",
        "color": "#d22932"
      },
      {
        "type": "separator",
        "margin": "sm"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "md",
        "spacing": "md",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "予約",
                "weight": "bold",
                "size": "lg",
                "margin": "sm",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例「予約：12/25, 3, 〇〇バンド」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "部室の予約が出来ます。「予約：」の後に日付、時限、バンド名をカンマで区切って入力してください。日付部分は半角数字をスラッシュで区切って入力してください。「今日」も使えます。",
                "wrap": true,
                "size": "md",
                "margin": "md",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "予約確認",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「〇〇の予約」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "予約状況の確認が出来ます。〇〇には日付、あるいは「今日」を入力してください。日付入力時のフォーマットは予約と同様です。",
                "wrap": true,
                "size": "md",
                "margin": "md",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "予約キャンセル",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「取り消し：12/20, 3」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "例：「キャンセル：2018/12/20, 5」",
                "size": "md",
                "margin": "xs",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "部室ちゃんを使って入れた予約は、部室ちゃんの予約取り消し機能で消すことが可能です。「取り消し：~~~」か「キャンセル：~~~」で日付、時限をカンマで区切って入力してください。なお、LINEのアカウントと予約が紐付いているので予約者にしかキャンセルが出来ません。",
                "wrap": true,
                "size": "md",
                "margin": "md",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "カレンダー",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「カレンダー」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "「カレンダー」と言えばカレンダー確認用のURLを返します。",
                "wrap": true,
                "size": "md",
                "margin": "sm",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "予約履歴",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「予約履歴」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "予約や取り消しはスプレッドシートに記録が残ります。「予約履歴」と言えば履歴確認用のスプレッドシートのURLを返します。",
                "wrap": true,
                "size": "md",
                "margin": "sm",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },{
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "バス",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「バス：sfc」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "バスの時間を教えてくれます。「バス：」の後に出発地を湘南台かsfcで指定すれば、この後3本のバスの時間が分かります。",
                "wrap": true,
                "size": "md",
                "margin": "xs",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          },{
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "エラー報告",
                "weight": "bold",
                "size": "lg",
                "margin": "md",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": "例：「エラー報告：バス出ない」",
                "size": "md",
                "margin": "md",
                "color": "#333333",
                "align": "end"
              },
              {
                "type": "text",
                "text": "何か動作におかしな事があれば「エラー報告：〇〇」とエラー報告をしてくれればシートに記録されます。作った人がぼちぼち見て修正します。",
                "wrap": true,
                "size": "md",
                "margin": "xs",
                "color": "#777777"
              },
              {
                "type": "separator",
                "margin": "md"
              }
            ]
          }
        ]
      }
    ]
  }
}
