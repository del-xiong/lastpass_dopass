var do_bgiconinput=!0,g_CSPCHECKER=0;
function popupfill_create_iframe(a,d,c,g,b,e,h,f,l,k){if(do_experimental_popupfill&&a){var j=a.getElementsByTagName("input");for(f=0;f<j.length&&f<MAX_INPUTS_HARD;f++){var n=j[f];"undefined"!==typeof n.maxLength&&"password"==n.type&&(g_isie||sendBG({cmd:"set_possiblemax",max:n.maxLength}))}g_isie&&init_LPfn()&&LPfn&&LPfn.resetSafeCloseIframe();g_iframeclose_starttime=null;d=parseInt(d)+"px";c=parseInt(c)+"px";if((n=a.body)&&!a.getElementById(LPMAGICIFRAME+g)){j=a.createElement("iframe");j.id=LPMAGICIFRAME+
g;j.name=LPMAGICIFRAME+g;g_iframe_docked=!0;if(g_isie)j.src="https://lastpass.com/fake/fake.php#framesrc=LPMAGIC",init_LPfn()&&LPfn&&9>LPfn.getDocumentMode(a)&&(j.setAttribute("allowTransparency",!0),j.setAttribute("frameBorder",0),j.allowTransparency=!0,j.frameBorder=0);else if("undefined"!=typeof g_isfirefoxsdk&&g_isfirefoxsdk){g_popup_iframe=j;var m=a.location.href,m=lpParseUri(m),t=Math.floor(1E8*Math.random());j.setAttribute("lpsrc",m.protocol+"://"+t+"."+m.host+"/lpblankiframe.local")}else{if(bg.get("LPContentScriptFeatures").is_infield_enabled){k.eventType=
event&&event.type?event.type:"click";csTop.LPInfieldFrame.openFrame(k);return}m=urlprefix+"popupfilltab.html";"undefined"===typeof chrome&&"undefined"!=typeof lplanguage&&(m+="?lplanguage="+lplanguage);j.src=m}0>parseInt(d)&&(d="0px");0>parseInt(c)&&(c="0px");dotrans?(g_frame_css_str="display:block !important; position:absolute !important; visibility:visible !important; z-index:"+CLICKABLE_ICON_ZINDEX+" !important; border-style:none !important; opacity: 1.0 !important; margin:0 !important; padding:0 !important;",
"undefined"!=typeof g_isie&&g_isie&&(g_frame_css_str+="background-color:transparent !important;background-image:none !important;filter:alpha(opacity=100) !important ; ")):g_frame_css_str="display:block; position:absolute !important; visibility:visible !important; opacity: 1.0 !important ; z-index:"+CLICKABLE_ICON_ZINDEX+" !important; border-style:solid !important; border-color: #4c4c4c !important; border-width:1px !important; border-radius: 4px 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px; box-shadow: 1px rgba(200, 200, 200, 0.5); -webkit-box-shadow: 1px 1px rgba(200, 200, 200, 0.5); -moz-box-shadow: 1px 1px rgba(200, 200, 200, 0.5); filter:alpha(opacity=100) !important; ";
j.style.cssText=g_frame_css_str;try{if(framesetarr=document.getElementsByTagName("frameset"),0==framesetarr.length)n.appendChild(j);else if(g_create_iframe_in_top&&!g_isie&&!g_isfirefox&&l&&1==framesetarr.length){var p=LPJSON.stringify(g_frame_css_str+" border: none;");l.body.setAttribute("data-lp-gcss",p);var q=l.getElementsByTagName("FRAMESET");if(q&&q[0]){var r=q[0].getElementsByTagName("FRAME");if(r){var s=r[0].contentWindow.document;s.body.setAttribute("data-lp-gcss",p);s.body.appendChild(j)}else l.body.appendChild(j)}}else{l=
!1;for(f=0;f<framesetarr.length;f++){for(p=0;p<framesetarr[f].children.length;p++)if("FRAME"==framesetarr[f].children[p].tagName)if(cf=framesetarr[f].children[p].contentWindow.document,null!=cf.getElementById(g)){if(l=!0,toappendTo=cf.getElementById(g),k&&k.framesrc&&k.framesrc==get_doc_location_href(cf))break}else if(null!=cf.getElementsByName(g)&&0!=cf.getElementsByName(g).length&&(l=!0,toappendTo=cf.getElementsByName(g)[0],k&&k.framesrc&&k.framesrc==get_doc_location_href(cf)))break;if(l){try{toappendTo.ownerDocument.body.setAttribute("data-lp-gcss",
LPJSON.stringify(g_frame_css_str)),toappendTo.parentNode.appendChild(j)}catch(v){framesetarr[f].children[p].contentWindow.document.body.appendChild(j)}break}}}}catch(u){verbose_log("append failed! "+u);return}g_isie&&!LP_getloggedin()&&j.parentNode.removeChild(j);j.width=parseInt(e)+"px";g_isie?(j.height="38px",j.height="173px"):j.height="26px";"undefined"!=typeof b&&0<b&&(j.height=24*b+23+"px");j.height=0<parseInt(h)?parseInt(h)+"px":parseInt(j.height)+"px";g=parseInt(j.width)+"px";b=parseInt(j.height)+
"px";j.style.cssText=g_frame_css_str+("width: "+g+" !important; height: "+b+" !important; top:"+c+" !important; left:"+d+" !important; ");setTimeout(function(){0==g_CSPCHECKER&&("undefined"===typeof chrome&&"object"===typeof safari)&&do_iframe_sad_msg(a)},5E3)}}}
function weasel(a){LPCTR("weasel");if(do_experimental_popupfill){if("undefined"==typeof a||!1==a||!0==a||5>a)a=200;g_weaseled=!0;if(g_isdebug){var d=(new Date).getTime(),c=d-g_last_weasel;c>2*a&&verbose_log("last weasel cycle took too long"+c+" ms")}popupfill_resize();g_isdebug&&(d=(new Date).getTime()-d,d>a&&verbose_log("last resize took too long "+d+" ms"),g_last_weasel=(new Date).getTime());g_weasel_id=setTimeout(function(){weasel(a)},a)}}var g_last_weasel=0;
function issaveall(a){a=a.elements;for(var d=0,c=0,g=0,b=0;b<a.length;b++){var e=a[b].type;"password"==e?c++:"text"==e||"tel"==e||"email"==e?d++:"textarea"==e&&g++}return 1==d&&1==c&&0==g?!1:!0}var POPUP_FIELD_OFFSET=-4;
function calculate_iframe_pos(a,d,c,g){if(!do_experimental_popupfill)return null;"undefined"==typeof g&&(g=!1);if(!a||null==d)return null;var b=d.style.left,e=d.style.top;if(g_double_password_hack||g_double_secret_password_hack||0>parseInt(b)||0>parseInt(e)){var h=a.getElementById(LPMAGICIFRAME+LP_pickFieldName(a,d));if(null!=h&&(h=LP_getAbsolutePos(a,h,null,g)))return e=parseInt(h.top),b=parseInt(h.left),isNaN(e)||isNaN(b)?null:{posx:b+"px",posy:e+"px"}}LP_pickFieldName(a,d);if(null!=d){h=LP_getAbsolutePos(a,
d,null,g);null!=h&&(b=parseInt(h.left)+POPUP_FIELD_OFFSET+"px",e=parseInt(h.top)+parseInt(h.height)+"px",g_do_icon_number_hint&&(e=parseInt(h.top)+parseInt(h.height)+4+"px"));if(null==c||0==c||""==c)h=LP_getElementByIdOrName(a,LPMAGICIFRAME+LP_pickFieldName(a,d)),c=null!=h?(c=LP_getAbsolutePos(a,h,null,!0))?c.width:0:0;if(!g){g=LP_getWindowWidth(window,!0);if(!g)return{posx:0,posy:0};parseInt(c)+parseInt(b)>g&&(b=g-parseInt(c)-20+"px")}}if(""==b||"auto"==b||""==e||"auto"==e)return null;b=parseInt(b);
e=parseInt(e);return"NaN"==b||"NaN"==e?null:{posx:b+"px",posy:e+"px"}}function verbose_log(a){verbose&&("undefined"!=typeof Date?console_log("["+g_docnum+"] "+((new Date).getTime()-g_tsstart)+" : "+a):console_log("["+g_docnum+"] "+a))}function is_watermark(){return!1}function checkAskGenerate(){}function sendKey(a,d){try{return keyName="DOM_VK_"+a.toUpperCase(),send_simulated_key(d,0,KeyEvent[keyName],!1)}catch(c){lpdbg("error",c)}return null}
function send_simulated_key(a,d,c,g){if(void 0===a||void 0===a.ownerDocument)return lpdbg("error","No key target!"),!1;var b=a.ownerDocument.createEvent("KeyboardEvent");"undefined"!=typeof g_isfirefoxsdk&&g_isfirefoxsdk?b.initKeyEvent("keydown",!0,!0,null,!1,!1,g,!1,c,d):b.initKeyboardEvent("keydown",!0,!0,document.defaultView,!1,!1,g,!1,c,c);var e=a.dispatchEvent(b);e&&("undefined"!=typeof g_isfirefoxsdk&&g_isfirefoxsdk)&&(b=a.ownerDocument.createEvent("KeyboardEvent"),b.initKeyEvent("keypress",
!0,!0,null,!1,!1,g,!1,c,d),e=a.dispatchEvent(b));b=a.ownerDocument.createEvent("KeyboardEvent");"undefined"!=typeof g_isfirefoxsdk&&g_isfirefoxsdk?b.initKeyEvent("keyup",!0,!0,null,!1,!1,g,!1,c,d):b.initKeyboardEvent("keyup",!0,!0,null,!1,!1,g,!1,c,c);a.dispatchEvent(b);return e}var g_formmutations=0;
function checkShouldRecheck(a){function d(a){a||(a=LP_derive_doc());return!a?!1:LP_isSinglePageApp(a)||isASPpage()?!0:g_did_muto?(g_did_muto=!1,!0):!1}var c=20,g=!1,b=document,e=window;if(!a||"object"!=typeof a)a={};var h=!1,f=!1,l=!1;"undefined"!=typeof a.fromclick&&(h=a.fromclick);"undefined"!=typeof a.frommuto&&(f=a.frommuto);"undefined"!=typeof a.skipfill&&(l=a.skipfill);g_pending_recheck=!1;debug_checkpoint("entered checkShouldRecheck, clear pending state");LP_isSinglePageApp(b)&&(c=100);if(g_formmutations>
c)return verbose_log("Abort"),!1;if(LP_should_ignore_this_doc(b,h))return!1;if(do_experimental_popupfill&&0<=g_input_cnt&&0<=g_form_cnt){var c=countInputs(document),h=countFormEquivalents(document),k=computeFingerprint(document);verbose_log("checkShouldRecheck() : # inputs was "+g_input_cnt+", now "+c+" #forms was "+g_form_cnt+" now "+h+", fingerprint was "+g_input_fingerprint+" now "+k);if(g_input_cnt!=c||g_form_cnt!=h||g_input_fingerprint!=k)g_formmutations++,formcachereset(document),fieldcachereset(document),
g_isie?setTimeout(function(){ie_recheck_page(document,g_is_specialsite)},1E3):(get_doc_location_href(b),setTimeout(function(){LPCTR("recheck");var c=LP_get_last_url_history(b);c||(LP_put_last_url_history(b),c=LP_get_last_url_history(b));var g=c.href,c=c.href_hash,h=get_doc_location_href(b);!f&&(h!==g||a.href!==h||c!==a.href_hash)?(formcachereset(b),fieldcachereset(b),g_form_cnt=g_input_cnt=0,delete b.body._lpcrdone,LP_put_last_url_history(b),c=LP_get_last_url_history(b),a.href=c.href,a.href_hash=
c.href_hash,g_pending_recheck||checkShouldRecheck(a)):g_pending_eval||evalScriptsInFrame(e,b,!0,{skipfill:l||!d(b),href:g,href_hash:c,frommuto:f})},200)),g_input_cnt=c,g_form_cnt=h,g_input_fingerprint=k,g=!0}return g}function is_watermark_password(){return!1}
function createpopuptoplevel_handler(a){if(!a)return!1;var d=LP_derive_doc();g_iscasper&&a.override_doc&&(d=a.override_doc);var c=parseInt(a.from_iframe.posx),g=parseInt(a.from_iframe.posy),b=a.from_iframe.id,e=a.from_iframe.rows,h=a.from_iframe.width,f=a.from_iframe.minheight,l=a.from_iframe.framename,k=a.from_iframe.framesrc,j=null;if(is_your_popup_showing(d))return!1;f=find_iframe_pos(d,l,k,!1);f||(f=find_iframe_pos(d,l,k,!0),null!==f&&"undefined"!=typeof f.cframedoc?j=f.cframedoc:pass);var n=
0,m=0;f?(n=parseInt(f.left)+c+"px",m=parseInt(f.top)+g+"px",g_toplevel_initial_abs_x=n,g_toplevel_initial_abs_y=m):m=n="10px";f="90px";a.from_iframe.iframe=find_iframe(d,l,k,!1);popupfill_create_iframe(d,n,m,b,e,h,f,!1,j,a.from_iframe);g_popupfill_iframe_width_save=h;return!0}var g_toplevel_initial_abs_x=null,g_toplevel_initial_abs_y=null;
function popupfillresize_handler(a){0<a.width&&(g_minwidth_override=parseInt(a.width));0<a.height&&(g_minheight_override=parseInt(a.height));g_create_iframe_in_top&&!g_isie&&!g_isfirefox&&!LP_inIframe(window)&&toplevel_iframe_state_get()&&relocate_popupfill_iframes(document)}
function find_iframe_pos(a,d,c,g){if(!a)return null;var b,e;try{var h=a.getElementsByTagName("IFRAME");g&&(h=a.getElementsByTagName("FRAME"));if(!d&&1==h.length)return LP_getAbsolutePos(a,h[0],!0,!0);var f=[];for(b=0;b<h.length&&50>b;b++)f[b]=h[b];for(b=0;b<f.length;b++)if(f[b].name&&""!=d&&f[b].name==d||f[b].src&&""!=c&&compare_puny_urls(f[b].src,c))return LP_getAbsolutePos(a,f[b],!0,!0);if(g)for(b=0;b<f.length;b++){var l=f[b].contentWindow.document,k=l.getElementsByTagName("FRAME");for(e=0;e<k.length&&
50>e;e++)if(k[e].name&&""!=d&&k[e].name==d||k[e].src&&""!=c&&k[e].src==c){var j=LP_getAbsolutePos(l,k[e],!0,!0);j.cframedoc=l;return j}}}catch(n){}return null}
function find_iframe(a,d,c,g){if(!a)return null;var b,e;try{var h=a.getElementsByTagName("IFRAME");g&&(h=a.getElementsByTagName("FRAME"));if(!d&&1==h.length)return h[0];a=[];for(b=0;b<h.length&&50>b;b++)a[b]=h[b];for(b=0;b<a.length;b++)if(a[b].name&&""!=d&&a[b].name==d||a[b].src&&""!=c&&compare_puny_urls(a[b].src,c))return a[b];if(g)for(b=0;b<a.length;b++){var f=a[b].contentWindow.document.getElementsByTagName("FRAME");for(e=0;e<f.length&&50>e;e++)if(f[e].name&&""!=d&&f[e].name==d||f[e].src&&""!=
c&&f[e].src==c)return f[e]}}catch(l){}return null};