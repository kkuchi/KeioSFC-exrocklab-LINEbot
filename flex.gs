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
