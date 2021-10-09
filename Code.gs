const telegramAPIToken = "REPLACE_WITH_TELEGRAM_API_TOKEN";
const telegramAPIURL = "https://api.telegram.org/bot" + telegramAPIToken;
const telegramAdminID = "REPLACE_WITH_TELEGRAM_USER_ID";
const googleWebAppsURL = "REPLACE_WITH_GOOGLE_WEB_APPS_URL";

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


function doPost(e) {

  var data = JSON.parse(e.postData.contents);
  var chatid = data.message.chat.id;

  try {
    
    if ( chatid ) {
      
      /**********************
      * Send JSON structure *
      ***********************/
      sendMessage( chatid, JSON.stringify( data, null, 4 ) );

      /*********************
      * Object wrap filter *
      **********************/
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
      
      if ( fileINFO ) {
        
        var fileURL = fileINFO.mime !== "N/A" ? "https://api.telegram.org/file/bot" + telegramAPIToken + "/" + String( fileINFO.path ) : fileINFO.path;
        
        /***************************
        * Send the file's attributes
        ****************************/
        sendMessage(
          chatid,
          "FILE NAME: " + "<b>" + fileINFO.file + "</b>" + "\n"
          + "TYPE: " + "<b>" + fileINFO.type + "</b>" + "\n"
          + "MIME: " + "<b>" + fileINFO.mime + "</b>" + "\n"
          + "URL: " + fileURL
        );
        
      }

    } else sendMessage( chatid, "chat_id not found in JSON post." );
  
  } catch(e) { sendMessage( telegramAdminID, e ); }

}
