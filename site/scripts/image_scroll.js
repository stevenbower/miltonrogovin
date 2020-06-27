
scroll_images = null;
scroll_current = 0;

function init_image_scroll_from_series( seriesid, cobj, sobj, capobj, iobj, tobj ){
  //set_status( "se_s_status", "Loading...", STS_ACTIVE );

  var args = { "seriesid"   : seriesid };
  var args2 = { "seriesid"  : seriesid,
                "sobj"      : sobj,
                "cobj"      : cobj,
                "capobj"    : capobj,
                "iobj"      : iobj,
                "tobj"      : tobj };

  api_call( "get_series_image_data", args, init_image_scroll_from_series_cb, args2 );

  return false;
}

function init_image_scroll_from_series_cb( request, uri, obj_data ){
  try {
    if( request.readyState == 4 ){
      if( request.status != 200 ){
        alert( "HTTP request failed [code="+request.status+"]" );
        return;
      }
    } else {
      return;
    }
  } catch( e ) {
    cleanup_request( request );
    return;
  }
  cleanup_request( request );

  var doc = request.responseText
  var doc_chunks = doc.split("\n");
  var code = strip( doc_chunks[0] );

  if( code == "OK" ){
    eval( "var data = "+doc_chunks[2] );
    //set_status( "se_s_status", "Loaded Successfully", STS_OK );
  } else {
    alert( "call to retrieve series content failed:\n"+doc );
    // XXX make everything null or try again
    return;
  }

  var cobj = getElement( obj_data["cobj"] );
  var sobj = getElement( obj_data["sobj"] );
  var capobj = getElement( obj_data["capobj"] );
  var iobj = getElement( obj_data["iobj"] );
  var tobj = getElement( obj_data["tobj"] );

  scroll_images = data["series_images"];
  scroll_current = 0;
  scroll_parent = cobj;

  init_image_scroll( cobj, sobj, capobj, iobj, tobj );
}


function show_text( tid, iid, cid ){
  tobj = getElement( tid );
  iobj = getElement( iid );
  cobj = getElement( cid );
  return show_text_obj( tobj, iobj, cobj );
}

function show_text_obj( tobj, iobj, cobj ){
  iobj.style.display = "none";
  tobj.style.display = "block";
  cobj.style.display = "none";
}

function show_big_image( img ){

  var bi = img._big_img;
  var bic = img._big_img.parentNode;
  var ce = getElement( "contentarea" );

  if( img._big ){
    return;
  } else {
    for( var i=0; i < img._all_cells.length; i++ ){
      img._all_cells[i].firstChild._big = false;
    }

    if( img._caption ){
      img._caption.style.display = "none";
    }

    bi.src = img._img["src"];

    // hide the text
    img._tobj.style.display = "none";

    bic.style.display = "block";
    bic.style.width = img._img["image_width"] + "px";
    bic.style.height = img._img["image_height"] + "px";

    // fix the height of the table
    ce.style.height = (bic.offsetHeight + bic.offsetTop + 60 ) + "px";

    //bi._last_img = img;
    img._big = true;

/*
    for( var i=0; i < img._all_cells.length; i++ ){
      setOpacity( img._all_cells[i].firstChild, 10 );
    }
*/
  }
}

sel_border_color = "#F99";
sel_sel_color = "#FEE";
sel_back_color = "#FFF";
icon_row_count = 6;

function icon_row_next( obj, oid, sid ){
  return change_icon_row( obj, oid, sid, true );
}
function icon_row_prev( obj, oid, sid ){
  return change_icon_row( obj, oid, sid, false );
}

function change_icon_row( obj, oid, sid, next ){
  var sobj = getElement( sid );
  var icon_table_body = sobj.firstChild.firstChild;
  var first_row = icon_table_body.firstChild;
  var num_rows = icon_table_body.childNodes.length;
  var row = icon_table_body.firstChild;
  var sel_idx = 0;

  while( row != null ){
    if( row._visible ){
      break;
    }
  
    row = row.nextSibling;
    sel_idx++;
  }

  var next_idx = sel_idx + icon_row_count;
  var prev_idx = sel_idx - icon_row_count;
  var last_row_idx = Math.floor(num_rows / icon_row_count)*icon_row_count;
  last_row_idx = num_rows > last_row_idx ? num_rows : last_row_idx;
  var is_last = next_idx + icon_row_count >= last_row_idx;
  var is_first = prev_idx <= 0;
  var other = getElement( oid );

  if( last_row_idx == 0 ){
      other._dis = true;
      other.src = other._disimg;
      obj._dis = true;
      obj.src = obj._disimg;
  } else if( next ){
    if( next_idx <= last_row_idx ){
      // we are at the end
      if( is_last ){
        obj._dis = true;
        obj.src = obj._disimg;
      }
      select_icon_row( icon_table_body.childNodes[next_idx] );
    } else {
      obj._dis = true;
      obj.src = obj._disimg;
    }
    if( next_idx > 0 ){
      other._dis = false;
      other.src = other._upimg;
    }
  } else {
    if( prev_idx >= 0 ){
      if( is_first ){
        obj._dis = true;
        obj.src = obj._disimg;
      }
      select_icon_row( icon_table_body.childNodes[prev_idx] );
    } else {
      obj._dis = true;
      obj.src = obj._disimg;
    }
    if( prev_idx < last_row_idx ){
      other._dis = false;
      other.src = other._upimg;
    }
    if( last_row_idx <= icon_row_count ){
      other._dis = true;
      other.src = other._disimg;
    }
  }

  return false;
}

function icon_row_prev2( obj, oid, sid ){
  var sobj = getElement( sid );
  var icon_table_body = sobj.firstChild.firstChild;
  var first_row = icon_table_body.firstChild;
  var num_rows = icon_table_body.childNodes.length;

  var row = icon_table_body.firstChild;
  var sel_idx = 0;

  while( row != null ){
    if( row._visible ){
      break;
    }
  
    row = row.nextSibling;
    sel_idx++;
  }

  var prev_idx = sel_idx - icon_row_count;

  // we are at the end
  if( prev_idx >= 0 ){
    if( prev_idx == 0 ){
      obj._dis = true;
      obj.src = obj._disimg;
    }
    select_icon_row( icon_table_body.childNodes[prev_idx] );
  }
  return false;
}

function select_icon_row( row ){

  for( var x=0; x < row.parentNode.childNodes.length; x++ ){
    row.parentNode.childNodes[x].style.display = "none";
    row.parentNode.childNodes[x]._visible = false;
  }

  row.style.display = "";
  row._visible = true;

  var row_n = row;
  //var ns = row.nextSibling;
  for( var x=0; x < icon_row_count; x++ ){
    if( row_n == null ) break;

    for( var y=0; y < row_n.childNodes.length; y++ ){
      if( row_n.childNodes[y]._icon != null ){
        row_n.childNodes[y]._icon.src = row_n.childNodes[y]._icon._src;
      }
    }

    row_n.style.display = "";
    row_n._visible = true;
    row_n = row_n.nextSibling;
  }

  // XXX do this with some delay if its on a click (and then let it cancel)
  // select the first image row
  select_image_row( row );

}

function deselect_all_icon_rows( tbody ){
  // turn off all others
  for( var x=0; x < tbody.childNodes.length; x++ ){
    deselect_image_row( tbody.childNodes[x] );
  }
}

function select_image_row( row ){

  // clear all captions that are fading
  var imtbl = row._image_row.parentNode;
  for( var x=0; x < imtbl.childNodes.length; x++ ){
    var imrow = imtbl.childNodes[x];
    for( var y=0; y < imrow.childNodes.length; y++ ){
      var cell = imrow.childNodes[y]
      if( cell._caption ){
        stopFadeOut( cell._caption.id );
        cell._caption.style.display = "none";
      }
    }
  }

  // turn off all others
  for( var x=0; x < row.parentNode.childNodes.length; x++ ){
    deselect_image_row( row.parentNode.childNodes[x] );
  }

  if( !row._capobj.style._fixed_height ){
    row._capobj._fixed_height = row._capobj.offsetHeight;
    row._capobj.style.height = row._capobj._fixed_height + "px";

    if( row._capobj.offsetHeight != row._capobj._fixed_height ){
      row._capobj._fixed_height = row._capobj._fixed_height - (row._capobj.offsetHeight - row._capobj._fixed_height);
    }
  }

  row._capobj.style.height = row._capobj._fixed_height + "px";

  if( row._caption != "" && row._caption != null ){
    if( row._capobj.childNodes.length ){
      row._capobj.removeChild( row._capobj.childNodes[0] );
    }

    // add the new caption
    row._capobj.appendChild( document.createTextNode( row._caption ) );
    row._capobj.style.display = "block";
  } else if( row._capobj._has_row_caption ){
    if( row._capobj.childNodes.length ){
      row._capobj.removeChild( row._capobj.childNodes[0] );
    }
    row._capobj.style.display = "block";
  } else {
    row._capobj.style.display = "none";
  }

  for( var i=0; i < row.childNodes.length; i++ ){
    cell = row.childNodes[i];
    cell.style.backgroundColor = sel_sel_color;
    if( i == 0 ){
      cell.style.borderLeft = "1px solid "+sel_border_color;
      cell.style.borderRight = "0px";
    } else if( i == row.childNodes.length - 1 ){
      cell.style.borderLeft = "0px";
      cell.style.borderRight = "1px solid "+sel_border_color;
    } else {
      cell.style.borderLeft = "0px";
      cell.style.borderRight = "0px";
    }
    cell.style.borderTop = "1px solid "+sel_border_color;
    cell.style.borderBottom = "1px solid "+sel_border_color;
  }

  row._tobj.style.display = "none";
  row._cobj.style.display = "block";

  for( var i=0; i < row._image_row.parentNode.childNodes.length; i++ ){
    row._image_row.parentNode.childNodes[i].style.display = "none";
  }
  for( var i=0; i < row._image_row.childNodes.length; i++ ){
    if( row._image_row.childNodes[i]._image != null ){
      row._image_row.childNodes[i]._image.src = row._image_row.childNodes[i]._image._src;
    }
  }
  row._image_row.style.display = "";

}

function deselect_image_row( row ){
  for( var i=0; i < row.childNodes.length; i++ ){
    cell = row.childNodes[i];

    cell.style.backgroundColor = sel_back_color;
    if( i == 0 ){
      cell.style.borderLeft = "1px solid "+sel_back_color;
      cell.style.borderRight = "0px";
    } else if( i == row.childNodes.length - 1 ){
      cell.style.borderLeft = "0px";
      cell.style.borderRight = "1px solid "+sel_back_color;
    } else {
      cell.style.borderLeft = "0px";
      cell.style.borderRight = "0px";
    }
    cell.style.borderTop = "1px solid "+sel_back_color;
    cell.style.borderBottom = "1px solid "+sel_back_color;
  }
}

function handle_row_select(e){
  var ei = get_event_info(e);
  var row = -1
  if( ei[1].nodeName == "IMG" ){
    row = ei[1].parentNode.parentNode;
  } else if( ei[1].nodeName == "TD" ){
    row = ei[1].parentNode;
  } else if( ei[1].nodeName == "TR" ){
    row = ei[1];
  }
  if( row != -1 ){ 
    select_image_row( row );
  }
  return false;
}

function create_icon_row( cobj, capobj, image_row ){
  var icon_row = document.createElement( "tr" );
  icon_row.id = "icon_"+image_row.id;
  addEvent( icon_row, "click", handle_row_select, false );
  icon_row._cobj = cobj;
  icon_row._capobj = capobj;
  icon_row._image_row = image_row;
  return icon_row;
}

function init_image_scroll( cobj, sobj, capobj, iobj, tobj ){
  var fade_delay = 45;
  var fade_step = 1;
  var fade_opacity = 100;

  var max_w = 0;
  var max_h = 0;
  var icon_max_w = 0;
  var icon_max_h = 0;
  var i_max_w = 0;
  var i_max_h = 0;
  var all_cells = new Array();
  var all_icon_cells = new Array();
  var max_cols = 0;
  var cc = 0;
  var last_caption = null;
  var row_count = 0;

  var big_image = document.createElement( "img" );
  iobj.appendChild( big_image );

  var image_table = document.createElement( "table" );
  var image_table_body = document.createElement( "tbody" );
  image_table.cellSpacing = "0px";
  image_table.cellPadding = "0px";
  cobj.appendChild( image_table );
  image_table.appendChild( image_table_body );

  // Create the icon table
  var icon_table = document.createElement( "table" );
  var icon_table_body = document.createElement( "tbody" );
  icon_table.cellSpacing = "0px";
  icon_table.cellPadding = "0px";
  sobj.appendChild( icon_table );
  icon_table.appendChild( icon_table_body );

  var image_row = document.createElement( "tr" );
  image_row.id = "ir_" + row_count;
  image_row._tobj = tobj;
  var icon_row = create_icon_row( cobj, capobj, image_row );
  icon_row._tobj = tobj;

  row_count++;
  capobj._has_row_caption = false;

  for( var i = 0; i < scroll_images.length; i++ ){

    if( scroll_images[i]["imageid"] != "0" ){
      i_max_w = parseInt( scroll_images[i]["image_width"] ) > i_max_w ? parseInt( scroll_images[i]["image_width"] ) : i_max_w
      i_max_h = parseInt( scroll_images[i]["image_height"] ) > i_max_h ? parseInt( scroll_images[i]["image_height"] ) : i_max_h
      max_w = parseInt( scroll_images[i]["thumb_width"] ) > max_w ? parseInt( scroll_images[i]["thumb_width"] ) : max_w
      max_h = parseInt( scroll_images[i]["thumb_height"] ) > max_h ? parseInt( scroll_images[i]["thumb_height"] ) : max_h
      icon_max_w = parseInt( scroll_images[i]["icon_width"] ) > icon_max_w ? parseInt( scroll_images[i]["icon_width"] ) : icon_max_w
      icon_max_h = parseInt( scroll_images[i]["icon_height"] ) > icon_max_h ? parseInt( scroll_images[i]["icon_height"] ) : icon_max_h
    }

    if( scroll_images[i]["imageid"] == "0" ){
      max_cols = cc > max_cols ? cc : max_cols;
      cc = 0;

      if( image_row.childNodes.length > 0 ){
        image_row._type = "pics";
        image_row._current = false;
        image_table_body.appendChild( image_row );

        icon_row._current = false;
        icon_row._caption = last_caption;
        icon_table_body.appendChild( icon_row );
      }

      if( scroll_images[i]["caption"] != "" ){
        last_caption = scroll_images[i]["caption"];
        capobj._has_row_caption = true;
      }

      image_row = document.createElement( "tr" );
      image_row._tobj = tobj;
      image_row.id = "ir_" + row_count;
      row_count++;
      icon_row = create_icon_row( cobj, capobj, image_row );
      icon_row._tobj = tobj;

      continue;
    }

    cc++;

    if( scroll_images[i]["caption"] == "" ){
      var has_caption = 0;
    } else {
      var has_caption = 1;
    }

    var image = document.createElement( "img" );
    image._img = scroll_images[i];
    image._tobj = tobj;
    image._src = image._img["thumbsrc"];
    image.src = null;
    image._all_cells = all_cells;
    image._big = 0;
    image.width = parseInt( scroll_images[i]["thumb_width"] ) ;
    image.height = parseInt( scroll_images[i]["thumb_height"] );
    image._big_img = big_image;

    var icon = document.createElement( "img" );
    icon._img = scroll_images[i];
    icon._src = image._img["iconsrc"];
    icon.src = null;
    icon._all_cells = all_icon_cells;
    icon.width = parseInt( scroll_images[i]["icon_width"] );
    icon.height = parseInt( scroll_images[i]["icon_height"] );

    if( has_caption ){
      addEvent( image, "mouseover", function(e){ 
                                                  var ei = get_event_info(e);
                                                  var from_obj = ei[2];

                                                  if( e.srcElement ){
                                                    var to_obj = e.srcElement;
                                                  } else {
                                                    var to_obj = ei[1];
                                                  }

                                                  if( to_obj._big_img._last_img == null ){
                                                    if( from_obj != to_obj._caption ){
                                                      to_obj._caption.style.display = "block";
                                                      to_obj._caption.style.top  = findPosY( to_obj.parentNode.parentNode.parentNode ) + ((to_obj.offsetHeight-7) - 20) -
                                                                                                       ( to_obj._caption.offsetHeight / 2 ) + "px";
                                                      to_obj._caption.style.left = findPosX( to_obj ) + ((to_obj.offsetWidth-7) / 2) - 
                                                                                                       ( to_obj._caption.offsetWidth / 2 ) + "px";
                                                    }
                                                  }
                                                 }, false );

      addEvent( image, "mouseout", function(e){ 
                                                  var ei = get_event_info(e);
                                                  var to_obj = ei[2];
                                                  var from_obj = ei[1];

                                                  if( from_obj._big_img._last_img == null ){
                                                    if( to_obj != from_obj._caption ){
                                                      fadeOut( from_obj._caption.id, fade_step, fade_delay, fade_opacity );
                                                    }
                                                  }
                                                 }, false );
    }

    var image_cell = document.createElement( "td" );
    image_cell.id = "ic_" + i;
    image_cell.className = "icell";
    image_cell._img = scroll_images[i];
    image_cell._image = image;
    image_cell.appendChild( image );
    image_cell.style.textAlign = "center";
    image_cell.style.verticalAlign = "top";
    all_cells.push( image_cell );
    image_row.appendChild( image_cell );

    var icon_cell = document.createElement( "td" );
    icon_cell.id = "icn_" + i;
    icon_cell.className = "iicell";
    icon_cell.appendChild( icon );
    icon_cell._img = scroll_images[i];
    icon_cell._icon = icon;
    icon_cell.style.textAlign = "center";
    icon_cell.style.verticalAlign = "top";
    all_icon_cells.push( icon_cell );
    icon_row.appendChild( icon_cell );

    image_cell._caption = null;

    addEvent( image, "click", function(e){ 
                                            var ei = get_event_info(e);
                                            return show_big_image( ei[1] );
                                         }, false );
    if( has_caption ){
      var image_caption = document.createElement( "div" );
      image_cell.appendChild( image_caption );
      image_cell._caption = image_caption;
      image._caption = image_caption;
      image_caption.id = "img_cap_" + i;
      image_caption._image = image;
      image_caption.className = "icap";
      image_caption._opacity = fade_opacity;
      image_caption.style.position = "absolute";
      image_caption.style.textAlign = "center";
      image_caption.style.verticalAlign = "middle";
      image_caption.style.cursor = "default";
      setOpacity( image_caption, fade_opacity );

      image_caption.appendChild( document.createTextNode( scroll_images[i]["caption"] ) );
      image_caption.style.display = "none";

      addEvent( image_caption, "click", function(e){ 
                                                      var ei = get_event_info(e);
                                                      return show_big_image( ei[1]._image );
                                                   }, false );

      addEvent( image_caption, "mouseout", function(e){ 
                                                          var ei = get_event_info(e);
                                                          var to_obj = ei[2];
                                                          var from_obj = ei[1];
                                                          if( from_obj._image._big_img._last_img == null ){
                                                            if( to_obj != from_obj._image ){
                                                              fadeOut( from_obj.id, fade_step, fade_delay, fade_opacity );
                                                            }
                                                          }
                                                      }, false );
    }


  }

  // catch the last row if we didn't end with a separator
  max_cols = cc > max_cols ? cc : max_cols;

  // there are no line breaks at all we use the first 
  // row of images count as the max num of colums
  //if( max_cols == 0 ) max_cols = cc;

  //cobj.style.height = (max_h) + "px";
  //cobj.style.width = ((max_w+20) * max_cols + 15) + "px";

  if( image_row.childNodes.length > 0 ){
    image_row._type = "pics";
    image_row._current = false;
    image_table_body.appendChild( image_row );

    icon_row._current = false;
    icon_row._caption = last_caption;
    icon_table_body.appendChild( icon_row );
  }

  var cnt = all_cells.length;
  for( var x=0; x < all_cells.length; x++ ){
    var icell = all_cells[x];
    var icon_icell = all_icon_cells[x];
    var img = icell.firstChild;
    var icon_img = icon_icell.firstChild;
    icell.style.width = max_w + "px";
    icell.style.height = max_h + "px";

    icon_icell.style.width = icon_max_w + "px";
    //icon_icell.style.height = icon_max_h + "px";

    // fill out the rest of the cells in a row
    if( icell.parentNode.childNodes.length != max_cols ){
      var diff = max_cols - icell.parentNode.childNodes.length;
      for( var i=0; i < diff; i++ ){
        var empty_cell = document.createElement( "td" );
        empty_cell.id = "ic_" + cnt;
        cnt++;
        empty_cell.className = "icell";
        empty_cell.innerText = " ";
        icell.parentNode.appendChild( empty_cell );
      }
    }

    if( icon_icell.parentNode.childNodes.length != max_cols ){
      var diff = max_cols - icon_icell.parentNode.childNodes.length;
      for( var i=0; i < diff; i++ ){
        var empty_cell = document.createElement( "td" );
        empty_cell.id = "inc_" + cnt;
        cnt++;
        empty_cell.className = "iicell";
        empty_cell.innerText = " ";
        icon_icell.parentNode.appendChild( empty_cell );

      }
    }

  }

  // select the first row
  select_icon_row( icon_table_body.childNodes[0] );
  deselect_all_icon_rows( icon_table_body );

  // bump over the caption object
  capobj.style.paddingLeft = (sobj.offsetWidth + 13) + "px";

  // set the big image tile to the max extents
  iobj.style.width = i_max_w + "px";
  iobj.style.height = i_max_h + "px";
  iobj.parentNode.style.width = i_max_w + "px";
  iobj.parentNode.style.height = i_max_h + "px";

  // XXX hackish fix me
  change_icon_row( getElement( "btn_prev" ), "btn_next", "itbl_select", false );

  getElement( "itbl_nav" ).style.width = tobj.style.width;

  show_text_obj( tobj, iobj, cobj );
}

