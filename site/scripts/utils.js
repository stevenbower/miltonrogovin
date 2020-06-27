
// Log level bitmask
log_levels = { 
               "FLOG_COMPLETION"   : { level : 1<<0, txt : "COMPLETION" },
               "FLOG_PROGRESS"     : { level : 1<<1, txt : "PROGRESS" },
               "FLOG_INFO"         : { level : 1<<2, txt : "INFO" },
               "FLOG_DEBUG"        : { level : 1<<3, txt : "DEBUG" },
               "FLOG_WARNING"      : { level : 1<<4, txt : "WARNING" },
               "FLOG_ERROR"        : { level : 1<<5, txt : "ERROR" },
               "FLOG_CRITICAL"     : { level : 1<<6, txt : "CRITICAL" },
               "FLOG_FATAL"        : { level : 1<<7, txt : "FATAL" },
               "FLOG_VERBOSE"      : { level : 1<<8, txt : "VERBOSE" },
               "FLOG_DEBUG1"       : { level : 1<<10, txt : "DEBUG" },
               "FLOG_DEBUG2"       : { level : 1<<11, txt : "DEBUG" },
               "FLOG_DEBUG3"       : { level : 1<<12, txt : "DEBUG" },
               "FLOG_DEBUG4"       : { level : 1<<13, txt : "DEBUG" },
               "FLOG_DEBUG5"       : { level : 1<<14, txt : "DEBUG" },
               "FLOG_VERBOSE1"     : { level : 1<<15, txt : "VERBOSE" },
               "FLOG_VERBOSE2"     : { level : 1<<16, txt : "VERBOSE" },
               "FLOG_VERBOSE3"     : { level : 1<<17, txt : "VERBOSE" },
               "FLOG_VERBOSE4"     : { level : 1<<18, txt : "VERBOSE" },
               "FLOG_VERBOSE5"     : { level : 1<<19, txt : "VERBOSE" },
               "FLOG_SECURITY"     : { level : 1<<20, txt : "SECURITY" },
               "FLOG_STATUS"       : { level : 1<<21, txt : "STATUS" },
               "FLOG_ALL"          : { level : 0xFFFFFFFF, txt : "ALL" },
               "FLOG_NONE"         : { level : 0, txt : "NONE" }
             };

log_tab = 15;

for( var k in log_levels ){
  eval( k+"='"+k+"';" );
}

current_log_level = log_levels.FLOG_ALL.level

RegExp.escape = function(text) {
  if (!arguments.callee.sRE) {
    var specials = [
      '/', '.', '*', '+', '?', '|',
      '(', ')', '[', ']', '{', '}', '\\'
    ];
    arguments.callee.sRE = new RegExp(
      '(\\' + specials.join('|\\') + ')', 'g'
    );
  }
  alert( text.replace(arguments.callee.sRE, '\\$1') );
  return text.replace(arguments.callee.sRE, '\\$1');
}

// some string functions
function lstrip( instr ){ return instr.replace( /^\s+/g, "" ); } // strip leading
function rstrip( instr ){ return instr.replace( /\s+$/g, "" ); } // strip trailing
function strip( instr ) { return rstrip( lstrip( instr ) ); } // strip both

function lstrip_ex( instr, chrs ){ // strip leading
  reg = new RegExp( "^["+RegExp.escape(chrs)+"]+", "" ); 
  return instr.replace( reg, "" ); 
}
function rstrip_ex( instr, chrs ){ // strip trailing
  reg = new RegExp( "["+RegExp.escape(chrs)+"]+$" )
  return instr.replace( reg, "" );
}

function strip_ex( instr, chrs ) { return rstrip( lstrip( instr ) ); } // strip both

function isIE(){ return document.all?1:0; }
function isNav(){ return document.all?0:1; }

function getElement( id ){ 
 return (document.getElementById)?document.getElementById( id ):document.all[id];
} 

function addEvent( obj, aEventType, aFunctionReference, aUseCapture ){
  if( obj.addEventListener ){ // Moz
    return obj.addEventListener( aEventType, aFunctionReference, aUseCapture );
  } else if( obj.attachEvent ){ // IE
    return obj.attachEvent( "on" + aEventType, aFunctionReference);
  }
}

function removeEvent( obj, aEventType, aFunctionRefernce, aUseCapture ){
  if( obj.removeEventListener ){ // Moz
    return obj.removeEventListener(aEventType, aFunctionReference, aUseCapture);
  } else if( obj.detachEvent ){ // IE
    return obj.detachEvent( "on" + aEventType, aFunctionReference);
  }
}

function sprintf(){
   if (!arguments || arguments.length < 1 || !RegExp)
   {
      return;
   }
   var str = arguments[0];
   var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
   var a = b = [], numSubstitutions = 0, numMatches = 0;
   while (a = re.exec(str))
   {
      var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
      var pPrecision = a[5], pType = a[6], rightPart = a[7];

      numMatches++;
      if (pType == '%')
      {
         subst = '%';
      }
      else
      {
         numSubstitutions++;
         if (numSubstitutions >= arguments.length)
         {
            alert('Error! Not enough function arguments (' + (arguments.length - 1)
               + ', excluding the string)\n'
               + 'for the number of substitution parameters in string ('
               + numSubstitutions + ' so far).');
         }
         var param = arguments[numSubstitutions];
         var pad = '';
                if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
           else if (pPad) pad = pPad;
         var justifyRight = false;
                if (pJustify && pJustify === "-") justifyRight = true;
         var minLength = -1;
                if (pMinLength) minLength = parseInt(pMinLength);
         var precision = -1;
                if (pPrecision && pType == 'f')
                   precision = parseInt(pPrecision.substring(1));
         var subst = param;
         switch (pType)
         {
         case 'b':
            subst = parseInt(param).toString(2);
            break;
         case 'c':
            subst = String.fromCharCode(parseInt(param));
            break;
         case 'd':
            subst = parseInt(param) ? parseInt(param) : 0;
            break;
         case 'u':
            subst = Math.abs(param);
            break;
         case 'f':
            subst = (precision > -1)
             ? Math.round(parseFloat(param) * Math.pow(10, precision))
              / Math.pow(10, precision)
             : parseFloat(param);
            break;
         case 'o':
            subst = parseInt(param).toString(8);
            break;
         case 's':
            subst = param;
            break;
         case 'x':
            subst = ('' + parseInt(param).toString(16)).toLowerCase();
            break;
         case 'X':
            subst = ('' + parseInt(param).toString(16)).toUpperCase();
            break;
         }
         var padLeft = minLength - subst.toString().length;
         if (padLeft > 0)
         {
            var arrTmp = new Array(padLeft+1);
            var padding = arrTmp.join(pad?pad:" ");
         }
         else
         {
            var padding = "";
         }
      }

      if( justifyRight ){
        str = leftpart + subst + padding + rightPart;
      } else {
        str = leftpart + padding + subst + rightPart;

      }
   }
   return str;
}

function get_event_info( e ){
  if( !e ){ e = window.event }

  if( e.target ){
    target = e.target;
  } else if( e.fromElement ){
    target = e.fromElement;
  } else if( e.srcElement ){
    target = e.srcElement;
  }

  if( e.relatedTarget ){
    relatedTarget = e.relatedTarget;
  } else {
    relatedTarget = e.toElement;
  }

  return new Array( e, target, relatedTarget );
}

active_requests = new Array();

function fetchUri( uri, method, handler, obj_data ){

  var req_info = new Array( uri, obj_data, handler );

  if( window.XMLHttpRequest){ // native XMLHttpRequest object
    var req = new XMLHttpRequest();
  } else if( window.ActiveXObject ){ // IE/Windows ActiveX version
    var req = new ActiveXObject("Microsoft.XMLHTTP");
  }

  req_info.push( req );
  active_requests.push( req_info );

  req.onreadystatechange = function(){ fetchUriHandler(req) };

  if( method == "GET" ){
    req.open( "GET", uri, true );
    if( window.XMLHttpRequest){
      req.send( null );
    } else if( window.ActiveXObject ){
      req.send();
    }
  } else if( method == "POST" ){
    var parts = uri.split("?");
    var uri = parts[0];
    parts.splice( 0, 1 );
    var uri_data = parts.join("?");

    req.open( "POST", uri, true );
    req.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );

    req.send( uri_data );
  }
}

function fetchUriHandler( request ){
  var req_info = get_req_data( request );
  //alert( "["+obj_info+"] ["+request+"]" );
  //alert( active_requests );

  if( req_info == null ){
    alert( "ERROR:\nUnkown request delivered to handler" );
    return;
  }

  return req_info[2]( req_info[3], req_info[0], req_info[1] );
}

function cleanup_request( req ){
  for( var i=0; i < active_requests.length; i++ ){
    var obj_info = active_requests[i];
    if( obj_info[obj_info.length-1] == req ){
      active_requests.splice( i, 1 );
    }
  }
}

function get_req_data( req ){
  for( var i=0; i < active_requests.length; i++ ){
    var obj_info = active_requests[i];
    if( obj_info[obj_info.length-1] == req ){
      return obj_info;
    }
  }
  return null;
}

function log( loglevel, msg ){
  var level = log_levels[loglevel].level
  var txt = log_levels[loglevel].txt

  pre = getElement( "__LOGPRE__" )
  if( pre == null ){
    pre = document.createElement( "div" );
    pre.id = "__LOGPRE__";
    pre.style.margin = "2px";
    pre.style.width = "100%";
    pre.style.fontSize = "11px";
    pre.style.fontFamily = "Courier New;Courier";
    pre.style.whiteSpace = "pre";
    obj = getElement( "logObj" )
    obj.appendChild( pre );
    obj.appendChild( document.createTextNode( "\n" ) ); // add a newline
  }

  if( msg == null ){
    var msg = "(undefined)";
  }

  pre.appendChild( document.createTextNode( sprintf( "%-12s : %s", txt, msg )+"\n" ) ); // add the msg
  //document.write( "<pre style=\"margin:2px\">"+sprintf( "%-12s : %s\n", txt, msg )+"</pre>" );
}

for( var k in log_levels ){
  eval( "log."+k+"='"+k+"';" );
}

function urlencode( str ){
  return escape( str ).replace( /\%20/g, "+" );
}

function urldecode(str){
  return unescape( str.replace(/\+/g, " ") );  
}

function get_height(obj){
  // XXX make work for IE/NS6
}

function swap_img_on( e ){
  evt_info = get_event_info(e);
  evt_info[1].src = evt_info[1].over_img;
}

function swap_img_off( e ){
  evt_info = get_event_info(e);
  evt_info[1].src = evt_info[1].normal_img;
}

function check_uncheck( id ){
  var obj = getElement( id );
  if( obj.checked ){
    obj.checked = 0;
  } else {
    obj.checked = 1;
  }
}

function findPosX(obj){
	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function findPosY(obj){
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

STS_OK = 0;
STS_ERROR = 1;
STS_WARNING = 2;
STS_ACTIVE = 3;
STS_NONE = 99;

function clear_status( obj_id ){
  var sobj = getElement( obj_id );
  sobj.firstChild.nodeValue = "";
}

function set_status( obj_id, txt, level, timeout ){
  var sobj = getElement( obj_id );

  if( timeout != null && timeout >= 0 ){
    setTimeout( "clear_status( '"+obj_id+"' )", timeout*1000 );
  }

  if( level == STS_OK ){ // OK
    sobj.className = "stext stextok"
  } else if( level == STS_ERROR ){
    sobj.className = "stext stexterr"
  } else if( level == STS_WARNING ){
    sobj.className = "stext stextwarn"
  } else if( level == STS_ACTIVE ){
    sobj.className = "stext stextactive"
  } else {
    sobj.className = "stext"
  }

  if( !sobj.length ){
    sobj.appendChild( document.createTextNode( "" ) );
  }

  sobj.firstChild.nodeValue = txt;
}

function setOpacity( obj, opacity ){
  obj.style.filter = "alpha(opacity="+opacity+")";
  obj.style.MozOpacity = opacity/100;
  obj.style.opacity = opacity/100;
}

function fadeOut( objid, step, delay, opacity ) {
  return _fadeOut( objid, step, delay, opacity, null );
}

function stopFadeOut( objid ){
  var obj = getElement(objid);
  clearTimeout( obj._fade );
}

function _fadeOut( objid, step, delay, opacity, modified_opacity ) {
  var obj = getElement(objid);

  if( !obj ){
    //alert( objid );
    return
  }

  clearTimeout( obj._fade );

  if( modified_opacity == null ){
    modified_opacity = opacity - step;
  } else {
    modified_opacity = modified_opacity - step;
  }

  if( modified_opacity < 0 ){
    modified_opacity = 0;
  }

  setOpacity( obj, modified_opacity );

  if( modified_opacity > 0 ){
    obj._fade = setTimeout('_fadeOut("' + objid + '",' + step + ',' + delay + ',' + opacity + ',' + modified_opacity + ');',delay);
  } else {
    obj.style.display = "none";
    setOpacity( obj, opacity );
  }
}

function windowWidth(){
  if( window.innerWidth != null ){;
    return window.innerWidth;
  } else {
    return document.body.offsetWidth;
  } 
}

function windowHeight(){
  if( window.innerHeight != null ){;
    return window.innerHeight;
  } else {
    return document.body.offsetHeight;
  } 
}

function api_call( op, args, handler, data ){
  var api_args = "";
  for( arg in args ){
    api_args += "&"+arg+"="+escape( args[arg] );
  }

  var api_uri = "api.php?function="+op+api_args;

  fetchUri( api_uri, "POST", handler, data );
  return false;
}

function stoi( s ){
  return eval(s.substr(0,s.length-2));
}

function dump(arr,level) {
  var dumped_text = "";
  if(!level) level = 0;

  //The padding given at the beginning of the line.
  var level_padding = "";
  for(var j=0;j<level+1;j++) level_padding += "    ";

  if(typeof(arr) == 'object') { //Array/Hashes/Objects
    for(var item in arr) {
      var value = arr[item];
     
      if(typeof(value) == 'object') { //If it is an array,
        dumped_text += level_padding + "'" + item + "' ...\n";
        dumped_text += dump(value,level+1);
      } else {
        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
      }
    }
  } else { //Stings/Chars/Numbers etc.
    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
  }
  return dumped_text;
} 

function keys( arr ){
  var kl = Array();

  for( var k in arr ){
    kl.append( k );
  }

  return kl.join("\n");
}

function items( arr ){
  var kl = Array();

  for( var k in arr ){
    kl.append( [ k, arr[k] ] );
  }

  return kl;
}

function vasort( a, b ){
  return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
}
function vdsort( a, b ){
  return ((a[1] > b[1]) ? -1 : ((a[1] < b[1]) ? 1 : 0));
}

function kasort( a, b ){
  return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}

function kdsort( a, b ){
  return ((a[0] > b[0]) ? -1 : ((a[0] < b[0]) ? 1 : 0));
}

// Clear all child objects of obj
function clear_obj( obj ){
  while( obj.childNodes.length ){
    obj.removeChild( obj.childNodes[0] );
  }
}
