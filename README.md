# Telegram JSON Response

JSON response samples for Telegram API developers. Based on Bot API 5.3. For details see the [documentation](https://core.telegram.org/bots/api).

## Generator

[Telegram Bot API](https://core.telegram.org/bots/api) and [Google Apps Script](https://developers.google.com/apps-script)

Each JSON response from the Telegram Bot API will be sent back by Google Apps Script as a message via Google web apps connected to the Telegram webhook. The results appear in the chat bot whenever a user submits certain content. You can change it to show up to Logger.log in Apps Script.

An example script that generates a response back in the form of a JSON message, for details see [Code.gs](https://github.com/silikidi/Telegram-JSON-Response/blob/a92c9f8e034359e16fa81cf2c52d952fa561907b/Code.gs):

```
const telegramAPIToken = "TELEGRAM_API_TOKEN";
const telegramAPIURL = "https://api.telegram.org/bot" + telegramAPIToken;
const telegramAdminID = "TELEGRAM_USER_ID";
const googleWebAppsURL = "GOOGLE_WEB_APPS_URL";

function doPost(e) {
  
  var data = JSON.parse(e.postData.contents);
  var chatid = data.message.chat.id;
  
  try {
    
    var dataJSON = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String( chatid ),
        text: JSON.stringify( data, null, 4 )
      }
    };
    UrlFetchApp.fetch(telegramAPIURL + "/", dataJSON);
      
  } catch(e) {
    
    var dataError = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String( telegramAdminID ),
        text: String( e )
      }
    };
    UrlFetchApp.fetch(telegramAPIURL + "/", dataError);
    
  }
  
}

```

## Sample Bot

**Bot Respon JSON** [**@simrsjsonbot**](https://t.me/simrsjsonbot)

## Screenshot

![Screenshot](https://blogger.googleusercontent.com/img/a/AVvXsEjqR5r9uI5VdozdnIqz6HaYPRBkWQFBkpTyfXmAWQ-ptDbFliRBZF66Wt7FIz6IkfPSois7pxC7rYJSLGTEMYAwSPDwyx7TnxupHGgYw_fQV6vJTI8NLkPpw0oMu0NkCZhlQmcQh3WWORgIFxfg39kf7F0MXivGtvsdST1wl1OrfToSIiZoqhou7tZatQ=s0)
