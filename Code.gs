/***************************************************
* BOT JSON RESPONSE *
* Put it on Code.gs Apps Script *
* Make sure you add commands to the bot:
****************************************************
start - Command test
poll000 - Poll anonymous regular single answer
poll001 - Poll anonymous regular multiple answer
poll010 - Poll anonymous quiz single answer
poll011 - Poll anonymous quiz multiple answer
poll100 - Poll non anonymous regular single answer
poll101 - Poll non anonymous regular multiple answer
poll110 - Poll non anonymous quiz single answer
poll111 - Poll non anonymous quiz multiple answer
****************************************************/
const telegramAPIToken = "REPLACE_WITH_TELEGRAM_API_TOKEN";
const telegramAPIURL = "https://api.telegram.org/bot" + telegramAPIToken;
const telegramAdminID = "REPLACE_WITH_TELEGRAM_USER_ID";
const googleWebAppsURL = "REPLACE_WITH_GOOGLE_WEB_APPS_URL";


/***************************************************************
* getMe() for requesting about bot *
* setWebHook() for generating a real time push system with bot *
****************************************************************/
function getMe() {
  var url = telegramAPIURL + "/getMe";
  var response = UrlFetchApp.fetch( url ) ;
  Logger.log( response.getContentText() );
}
function setWebhook() {
  var url = telegramAPIURL + "/setWebhook?url=" + googleWebAppsURL;
  var response = UrlFetchApp.fetch( url );
  Logger.log( response.getContentText() );
}


/********************
* SENDING A MESSAGE *
*********************/
function sendMessage( targetID, message ) {
  var dataMessage = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String( targetID ),
      text: String( message )
    }
  };
  UrlFetchApp.fetch( telegramAPIURL + "/", dataMessage );   
}


/************
* FILE INFO *
*************/
function getFileInfo( chatID, fileID, fileTYPE, fileMIME ) {
  
  /************************************************************
  * Because JSON photo doesn't include mime-type
  * we need a custom array object to define each file extension
  *************************************************************/
  const fileAttrib = [
    { ext:"png", mime:"image/png" },
    { ext:"jpg", mime:"image/jpeg" },
    { ext:"jpeg", mime:"image/jpeg" }
  ];
  
  const regexFileExt = /\.([0-9a-z]+)(?:[\?#]|$)/i;
  const regexFileName = /([\w\d_-]*)\.?[^\\\/]*$/i;

  var getFile = {
    method: "post",
    payload: {
      method: "getFile",
      chat_id: String( chatID ),
      file_id: String( fileID )
    }
  };

  var getFileResponse = UrlFetchApp.fetch( telegramAPIURL + "/", getFile );
  var fileJSON = JSON.parse( getFileResponse );
  var fileOBJ = {};

  fileOBJ.type = fileTYPE;
  fileOBJ.path = String( fileJSON.result.file_path );
  fileOBJ.file = String( ( fileJSON.result.file_path.match( regexFileName ) || [""] )[0] );
  
  if ( fileMIME && fileMIME !== "" ) {

    fileOBJ.mime = fileMIME;

  } else {

    var fileEXT = ( fileJSON.result.file_path.match( regexFileExt ) || [""] )[0].substring(1);
    fileOBJ.mime = ( typeof fileAttrib.find( o => o.ext === fileEXT ) === "undefined" ) ? "N/A" : fileAttrib.find( o => o.ext === fileEXT ).mime;

  }
  
  return fileOBJ;

}


/*****************************************
* CAPTURING JSON POSTS FROM TELEGRAM API *
******************************************/
function doPost(e) {

  var data = JSON.parse( e.postData.contents );

  try {
    
    if ( data.message ) {
      
      var chatid = data.message.chat.id;

      if ( data.message.text && data.message.text.substring(0,5) === "/poll" && /^\d+$/.test( data.message.text.substring(5,8) ) ) {
        
        var chattext = data.message.text;
        var pollAnonymous = ["true","false"];
        var pollType = ["regular","quiz"];
        var pollMultiple = ["false","true"];
        var now = new Date();
        now.setHours( now.getHours() + 1 );

        var dataPoll = {
          method: "post",
          payload: {
            method: "sendPoll",
            chat_id: String( chatid ),
            question: "[" + chatid + "] Your favorite color",
            options: JSON.stringify(["RED","GREEN","BLUE"]),
            is_anonymous: pollAnonymous[ chattext.substring(5,6) ],
            type: pollType[ chattext.substring(6,7) ],
            allows_multiple_answers: pollMultiple[ chattext.substring(7,8) ],
            correct_option_id: "2",
            explanation: "Because <b>BLUE</b> is the color of <a href='https://telegram.org'>Telegram</a>.",
            explanation_parse_mode: "HTML",
            close_date: String( now.getTime() )
            //in case need more complicated...
            //close_date: String( Utilities.formatDate( now, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'" ) )
          }
        };

        UrlFetchApp.fetch( telegramAPIURL + "/", dataPoll );

      } else {

        /**********************
        * SEND JSON STRUCTURE *
        ***********************/
        var dataJSON = {
          method: "post",
          payload: {
            method: "sendMessage",
            chat_id: String( chatid ),
            text: JSON.stringify( data, null, 4 )
          }
        };
        
        UrlFetchApp.fetch( telegramAPIURL + "/", dataJSON );

      }


      /**********************************************
      * OBJECT WRAP TEST *
      * https://stackoverflow.com/a/41532415/12682081
      ***********************************************/

      if ( (( data || {} ).message || {}).document ){
        
        var fileINFO =  getFileInfo( chatid, data.message.document.file_id, "document", data.message.document.mime_type );

      } else if ( (( data || {} ).message || {}).video ){
        
        var fileINFO =  getFileInfo( chatid, data.message.video.file_id, "video", data.message.video.mime_type );

      } else if ( (( data || {} ).message || {}).audio ){
        
        var fileINFO =  getFileInfo( chatid, data.message.audio.file_id, "audio", data.message.audio.mime_type );

      } else if ( (( data || {} ).message || {}).voice ){
        
        var fileINFO =  getFileInfo( chatid, data.message.voice.file_id, "voice", data.message.voice.mime_type );

      } else if ( (( data || {} ).message || {}).video_note ){
        
        /*********************************************************
        * JSON video_note doesn't include "mime_type"
        * Even though the sendVideoNote documentation mentions MP4
        * Still need to involve getFileInfo() function
        * to generate a mime-type from .mp4 extension
        **********************************************************/
        var fileINFO =  getFileInfo( chatid, data.message.video_note.file_id, "video_note", "" );

      } else if ( (( data || {} ).message || {}).photo ){
        
        /************************************************
        * JSON photo doesn't include "mime_type"
        * The documentation doesn't mention any specifics
        * so need to involve getFileInfo() function
        * to generate a mime-type from a file extension
        *************************************************/
        var fileINFO =  getFileInfo( chatid, data.message.photo[0].file_id, "photo", "" );

      }
      
      /*********************************************
      * SEND ADDITIONAL INFORMATION ABOUT THE FILE *
      **********************************************/
      if ( fileINFO ) {
        
        var fileURL = fileINFO.mime !== "N/A" ? "https://api.telegram.org/file/bot" + telegramAPIToken + "/" + String(fileINFO.path) : fileINFO.path;
        
        var dataFile = {
          method: "post",
          payload: {
            method: "sendMessage",
            chat_id: String( chatid ),
            parse_mode: "HTML",
            text: 
              "FILE NAME: " + "<b>" + fileINFO.file + "</b>" + "\n"
              + "TYPE: " + "<b>" + fileINFO.type + "</b>" + "\n"
              + "MIME: " + "<b>" + fileINFO.mime + "</b>" + "\n"
              + "URL: " + fileURL
          }
        };
        UrlFetchApp.fetch( telegramAPIURL + "/", dataFile ); 
        
      }


    } else {

      /***********************************************************
      * SEND JSON STRUCTURE FOR NON-MESSAGE POSTS *
      * ESPECIALLY THOSE THAT DON'T INCLUDE THE CHAT_ID PROPERTY *
      ************************************************************/
      var destinationID = telegramAdminID ;

      if ( ( data || {} ).poll ) {
        
        var destinationID = ( data.poll.question ).match(/\[(.*)\]/).pop();

      } else if ( ( data || {} ).poll_answer ) {
        
        var destinationID = data.poll_answer.user.id;

      }

      var dataJSON = {
        method: "post",
        payload: {
          method: "sendMessage",
          chat_id: String( destinationID ),
          text: JSON.stringify( data, null, 4 )
        }
      };
      UrlFetchApp.fetch( telegramAPIURL + "/", dataJSON );

    }
  
  } catch(e) { sendMessage( telegramAdminID, e ); }

}
