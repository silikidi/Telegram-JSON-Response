# Telegram JSON Response

JSON response samples for Telegram API developers. Based on Bot API 5.3. For details see the [documentation](https://core.telegram.org/bots/api).

## Generator

[Telegram Bot API v5.3](https://core.telegram.org/bots/api) and [Google Apps Script](https://developers.google.com/apps-script)

More details of the script can be found at [Code.gs](https://github.com/silikidi/Telegram-JSON-Response/blob/a13f1dd56dd625f1656f3eb0523efee9bbb5bd3d/Code.gs)

Each JSON response from the Telegram Bot API will be sent back by Google Apps Script as a message via Google web apps connected to the Telegram webhook. The results appear in the chat bot whenever a user submits certain content. You can change it to show up to [Logger.log](https://developers.google.com/apps-script/reference/base/logger) in Apps Script.

You can even more simplify the script with [ES6 notation](https://scotch.io/bar-talk/five-things-you-can-use-in-es6-today).

## Poll Handling

JSON response from a Poll can only be captured when the Poll is created by the user. The JSON response from the Poll answer itself cannot be captured, but instead sent to the User who created it.

The JSON response from [Poll answer](https://core.telegram.org/bots/api#pollanswer) can only be captured if the Poll is created by the Bot with the sendPoll method. The JSON response from the Poll itself cannot be captured.

Example of the [sendPoll](https://core.telegram.org/bots/api#sendpoll) method with [options](https://core.telegram.org/bots/api#polloption) property in a Array of String of JSON-serialized list of answer 2-10 strings 1-100 characters each:

```
var now = new Date();
now.setHours( now.getHours() + 1 );

var dataPoll = {
  method: "post",
  payload: {
    method: "sendPoll",
    chat_id: String( chatid ),
    question: "Your favorite color",
    options: JSON.stringify( [ "RED", "GREEN", "BLUE" ] ),
    is_anonymous: "false",
    type: "regular",
    allows_multiple_answers: "false",
    correct_option_id: "2",
    explanation: "Because <b>BLUE</b> is the color of <a href='https://telegram.org'>Telegram</a>.",
    explanation_parse_mode: "HTML",
    close_date: String( now.getTime() )
    //in case need more complicated...
    //close_date: String( Utilities.formatDate( now, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'" ) )
  }
};

UrlFetchApp.fetch( telegramAPIURL + "/", dataPoll );
```

Make sure you add poll commands to the bot to generate a test poll created by Bot:

**start** - _Command test_  
**poll000** - _Poll anonymous regular single answer_  
**poll001** - _Poll anonymous regular multiple answer_  
**poll010** - _Poll anonymous quiz single answer_  
**poll011** - _Poll anonymous quiz multiple answer_  
**poll100** - _Poll non anonymous regular single answer_  
**poll101** - _Poll non anonymous regular multiple answer_  
**poll110** - _Poll non anonymous quiz single answer_  
**poll111** - _Poll non anonymous quiz multiple answer_


![Poll command](https://blogger.googleusercontent.com/img/a/AVvXsEgeT29j3y02DQOr446_iNlt3mz2v7uxINno9A_gcugluLeWfQ5lVPaDnxVNWkVrPJoVmA23RS9c8UR7Dy5uufqKN1zsywFmPf-XiTXefu4ec1iCaOD6-7Rs33uc5qLOjMSUigil2ArTExPk5gcUrgEGwelGghbIY0WqZDr5Xq1Xx6BhifrwJM5ZIDv-EQ=s0)

## Sample Bot

**JSON Response Bot** [**@simrsjsonbot**](https://t.me/simrsjsonbot)

**Powered by** [**Code.gs**](https://github.com/silikidi/Telegram-JSON-Response/blob/04b37297d268f9c1af87c6913960410f8378b52b/Code.gs)

### Screenshot

![Screenshot](https://blogger.googleusercontent.com/img/a/AVvXsEjqR5r9uI5VdozdnIqz6HaYPRBkWQFBkpTyfXmAWQ-ptDbFliRBZF66Wt7FIz6IkfPSois7pxC7rYJSLGTEMYAwSPDwyx7TnxupHGgYw_fQV6vJTI8NLkPpw0oMu0NkCZhlQmcQh3WWORgIFxfg39kf7F0MXivGtvsdST1wl1OrfToSIiZoqhou7tZatQ=s0)
