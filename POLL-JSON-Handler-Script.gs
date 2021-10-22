/************************************************************
* TELEGRAM POLL ANSWER JSON HANDLER WITH GOOGLE APPS SCRIPT *
*************************************************************/


/***************************
* JSON POLL ANSWER SAMPLES *
****************************/
const jsonPollUserbased = {
    "update_id": 603402545,
    "poll_answer": {
        "poll_id": "6301080145537007634",
        "user": {
            "id": 1821266651,
            "is_bot": false,
            "first_name": "RSUD CIBABAT",
            "last_name": "CIMAHI",
            "username": "rscibabat",
            "language_code": "en"
        },
        "option_ids": [0,2]
    }
};

const jsonPollAnonymous = {
    "update_id": 603402549,
    "poll": {
        "id": "6301080145537007639",
        "question": "[1821266651] Your favorite color",
        "options": [
            {
                "text": "RED",
                "voter_count": 0
            },
            {
                "text": "GREEN",
                "voter_count": 0
            },
            {
                "text": "BLUE",
                "voter_count": 1
            }
        ],
        "total_voter_count": 1,
        "is_closed": false,
        "is_anonymous": true,
        "type": "regular",
        "allows_multiple_answers": false
    }
};


/****************************************************
* JSON POLL ANSWER KEYS AND VALUES SCANNER FUNCTION *
* Modified version of getDeepKeys(obj) function:
* https://stackoverflow.com/a/42674656/12682081
*****************************************************/
function scanJSONPoll( obj ) {
  
  let data = [];
  let keys = [];
  let values = [];
  
  for ( var key in obj ) {
    
    /*********************************************
    * HANDLING NON OBJECT PROPERTIES *
    * https://stackoverflow.com/a/4775737/12682081
    **********************************************/
    if ( Object.prototype.toString.call( obj[key] ) !== "[object Object]" ) { 
      
      /****************************
      * HANDLING ARRAY PROPERTIES *
      * options and options_ids
      *****************************/
      if ( Array.isArray( obj[key] ) ) {
        
        /*******************************************
        * HANDLING NUMERIC PROPERTIES WITHIN ARRAY *
        * "options_ids": [0,1,2,...]
        ********************************************/
        if ( Object.prototype.toString.call( obj[key][0] ) === "[object Number]" ){
          
          keys.push( key );

          let userAnswer = "";
          for ( let i=0; i < obj[key].length; i++ ) {
            userAnswer += pollOptions[ obj[key][i] ];
            userAnswer += i < obj[key].length - 1 ? "-" : "";
          }
          values.push( userAnswer );


        /***********************************************************
        * HANDLING OBJECT PROPERTIES WITHIN ARRAY *
        * "options": [ {"text":"RED","voter_count": 0}, {...}, ... ]
        ************************************************************/
        } else {
          
          for ( let i=0; i < obj[key].length; i++ ) {
            keys.push( Object.values( obj[key][i] )[0] );
            values.push( String( Object.values( obj[key][i] )[1] ) );
          }

        }

      
      /***********************************************
      * HANDLING NON ARRAY AND NON OBJECT PROPERTIES *
      * "poll_id": "6301080145537007638"
      ************************************************/
      } else {
        
        keys.push( key );
        values.push( String( obj[key] ) );

      }

    
    /*************************************************
    * HANDLING OBJECT PROPERTIES *
    * "user": { "id":1821266651, "is_bot":false, ... }
    **************************************************/
    } else if ( Object.prototype.toString.call( obj[key] ) === "[object Object]" ) {
      
      for ( let property in obj[key] ) {
        keys.push( property );
        values.push( String( obj[key][property] ) );
      }

    /*****************************
    * HANDLING OTHERS PROPERTIES *
    ******************************/
    } else {
      
      let subkeys = scanJSONPoll( obj[key] );
      
      keys = keys.concat(
        subkeys.map(
          function( subkey ) {
            return subkey;
          }
        )
      );

    }

  }

  data.push( keys, values );
  return data;

}


/****************
* Let's test it *
*****************/
function testScanJSONPoll(){
  
  /***** USER-BASED POLL KEYS SET in case for sheets column names *****/
  let pollUserKeys = scanJSONPoll( jsonPollUserbased.poll_answer )[0];
  Logger.log( pollUserKeys );
  for ( let i=0; i < pollUserKeys.length; i++ ) {
    Logger.log( pollUserKeys[i] );
  }
  
  /***** USER-BASED POLL VALUES SET *****/
  let pollUserValues = scanJSONPoll( jsonPollUserbased.poll_answer )[1];
  Logger.log( pollUserValues );
  for ( let i=0; i < pollUserValues.length; i++ ) {
    Logger.log( pollUserValues[i] );
  }
  
  /***** ANONYMOUS POLL KEYS SET in case for sheets column names *****/
  let pollAnonymousKeys = scanJSONPoll( jsonPollAnonymous.poll )[0];
  Logger.log( pollAnonymousKeys );
  for ( let i=0; i < pollAnonymousKeys.length; i++ ) {
    Logger.log( pollAnonymousKeys[i] );
  }
  
  /***** ANONYMOUS POLL VALUES SET *****/
  let pollAnonymousValues = scanJSONPoll( jsonPollAnonymous.poll )[1];
  Logger.log( pollAnonymousValues );
  for ( let i=0; i < pollAnonymousValues.length; i++ ) {
    Logger.log( pollAnonymousValues[i] );
  }

}


/******************
* EXPECTED OUTPUT *
*******************
[
  [poll_id, id, is_bot, first_name, last_name, username, language_code, option_ids],
  [6301080145537007634, 1821266651, false, RSUD CIBABAT, CIMAHI, rscibabat, en, RED-BLUE]
]

[
  [id, question, RED, GREEN, BLUE, total_voter_count, is_closed, is_anonymous, type, allows_multiple_answers],
  [6301080145537007639, [1821266651] Your favorite color, 0, 0, 1, 1, false, true, regular, false]
]
*******************/
