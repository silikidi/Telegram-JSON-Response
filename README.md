# Telegram JSON Response

JSON schema for Telegram API developers. Based on Bot API 5.3. For details see the [documentation](https://core.telegram.org/bots/api).

## Generator

[Telegram Bot API](https://core.telegram.org/bots/api) and [Google Apps Script](https://developers.google.com/apps-script)

Each JSON response from the Telegram Bot API will be sent back by Google Apps Script as a message via Google web apps connected to the Telegram webhook. The results appear in the chat bot whenever a user submits certain content. You can change it to show up to Logger.log in Apps Script.

An example script that generates a response back in the form of a JSON message:

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

![Screenshot](https://blogger.googleusercontent.com/img/a/AVvXsEiC-kbpUbn77o41hH2ZPkOCGX5K6CVVpyWOnVNoF-ZXEfxWqczInNuxZmGWu9Itq0ZwGjTl-0j9bsxwOtxMPoy7TluRcVfqx-V6_omi87HbiHCF7RxiWoxx8ov4rFX3w_vde2qSyPitllZjNPboOiBS5QNOOOZ4JMsUZLY5wYBmnPH2j9ayYv89qQ3GiQ=s0)
