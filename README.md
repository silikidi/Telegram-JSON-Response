# Telegram JSON Response

JSON response samples for Telegram API developers. Based on Bot API 5.3. For details see the [documentation](https://core.telegram.org/bots/api).

## Generator

[Telegram Bot API](https://core.telegram.org/bots/api) and [Google Apps Script](https://developers.google.com/apps-script)

More details of the script can be found at [Code.gs](https://github.com/silikidi/Telegram-JSON-Response/blob/a13f1dd56dd625f1656f3eb0523efee9bbb5bd3d/Code.gs)

Each JSON response from the Telegram Bot API will be sent back by Google Apps Script as a message via Google web apps connected to the Telegram webhook. The results appear in the chat bot whenever a user submits certain content. You can change it to show up to Logger.log in Apps Script.

## Poll Handling

JSON response from a Poll can only be captured when the Poll is created by the user. The JSON response from the Poll answer itself cannot be captured, but instead sent to the User who created it.

The JSON response from [Poll answer](https://core.telegram.org/bots/api#pollanswer) can only be captured if the Poll is created by the Bot with the sendPoll method. The JSON response from the Poll itself cannot be captured.

Example of the [sendPoll](https://core.telegram.org/bots/api#sendpoll) method with [options](https://core.telegram.org/bots/api#polloption) property in a Array of String of JSON-serialized list of answer 2-10 strings 1-100 characters each:

```
var now = new Date();

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
    explanation: "Because blue is the color of Telegram.",
    close_date: String( now )
  }
};

UrlFetchApp.fetch( telegramAPIURL + "/", dataPoll );
```

## Sample Bot

**JSON Response Bot** [**@simrsjsonbot**](https://t.me/simrsjsonbot)

## Screenshot

![Screenshot](https://blogger.googleusercontent.com/img/a/AVvXsEjqR5r9uI5VdozdnIqz6HaYPRBkWQFBkpTyfXmAWQ-ptDbFliRBZF66Wt7FIz6IkfPSois7pxC7rYJSLGTEMYAwSPDwyx7TnxupHGgYw_fQV6vJTI8NLkPpw0oMu0NkCZhlQmcQh3WWORgIFxfg39kf7F0MXivGtvsdST1wl1OrfToSIiZoqhou7tZatQ=s0)
