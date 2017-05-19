function myFunction(e){
  //初期設定

  var cal = CalendarApp.getCalendarById('exrocklab@gmail.com');
  var itemResponses = e.response.getItemResponses();
  var bName;
  var pName;
  var yName;
  var pDate;

  //入力項目の解析
  for (var i = 0; i < itemResponses.length; i++) {

    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    if(question=="バンド・個人名"){
      pName=answer;
    }
    else if(question == "練習内容"){
     if(answer == "バンド練習"){bName = pName + " バンド練";}
     else{bName = pName + " 個人練";}
    }
    else if(question=="練習日"){
     pDate=answer.replace(/-/g,'/');
    }
    else if(question=="時限"){
      var sDate;
      var eDate;

           if(answer == "1限"){sDate = pDate + " " + "9:24:00"; eDate = pDate + " " + "10:56:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() != "1限 "){Logger.log(pDate + "の1限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("1限：" + bName);}}

      else if(answer == "2限"){sDate = pDate + " " + "11:09:00"; eDate = pDate + " " + "12:41:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "2限 "){Logger.log(pDate + "の2限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("2限：" + bName);}}

      else if(answer == "3限"){sDate = pDate + " " + "12:59:00"; eDate = pDate + " " + "14:31:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "3限 "){Logger.log(pDate + "の３限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("3限：" + bName);}}

      else if(answer == "4限"){sDate = pDate + " " + "14:44:00"; eDate = pDate + " " + "16:16:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "4限 "){Logger.log(pDate + "の4限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("4限：" + bName);}}

      else if(answer == "5限"){sDate = pDate + " " + "16:29:00"; eDate = pDate + " " + "18:01:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "5限 "){Logger.log(pDate + "の5限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("5限：" + bName);}}

      else if(answer == "6限"){sDate = pDate + " " + "18:09:00"; eDate = pDate + " " + "19:41:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "6限 "){Logger.log(pDate + "の6限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("6限：" + bName);}}

      else if(answer == "7限"){sDate = pDate + " " + "19:44:00"; eDate = pDate + " " + "21:16:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "7限 "){Logger.log(pDate + "の7限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("7限：" + bName);}}

      else if(answer == "0限"){sDate = pDate + " " + "7:59:00"; eDate = pDate + " " + "9:16:00"; var events = cal.getEvents(new Date(sDate), new Date(eDate));
                             if(events[0].getTitle() !=  "0限 "){Logger.log(pDate + "の0限は既に予約されている可能性があります", Browser.Buttons.OK);}
                             else{events[0].setTitle("0限：" + bName);}}
    }
    //メッセージボックスがGoogleapp上では出せないという悲劇
    else if(question=="予約者氏名"){
      var events = cal.getEvents(new Date(sDate), new Date(eDate));
      events[0].setDescription("予約者：" + answer);

      yName = answer;
    }
    else if(question=="説明・概要"){
      var events = cal.getEvents(new Date(sDate), new Date(eDate));
      events[0].setDescription("予約者：" + yName + "\n說明：" + answer);
    }

  }
}
