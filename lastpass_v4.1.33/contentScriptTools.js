LPContentScriptTools=function(){var k;k=function(a,c){var d=document.createElement("img");d.src=a;d.addEventListener("load",function(){var a;a="";try{var b=document.createElement("canvas");b.height=d.clientHeight;b.width=d.clientWidth;b.getContext("2d").drawImage(d,0,0);a=b.toDataURL()}catch(e){}document.body.removeChild(d);c(a)});d.addEventListener("error",function(){c("");document.body.removeChild(d)});document.body.appendChild(d)};var h,l=function(a,c,d){for(var g=null;a;){if(3===a.nodeType){var b;
a:{b=c;for(var e=d,j=a.textContent.trim(),f=0;f<b.length;++f)if(e.exactMatch){if(j===b[f]){b=b[f];break a}}else if(-1<j.indexOf(b[f])){b=b[f];break a}b=null}if(b)return{parent:a.parentElement,match:b,matchingText:a.textContent.trim()}}else if(g=l(a.firstChild,c,d))break;a=a.nextSibling}return g};h=function(a){return a.searches?l(document.body,[].concat(a.searches),a):null};var m=!1;window.addEventListener("beforeunload",function(a){!1!==a.isTrusted&&(m=!0)},!0);return{getFavicon:function(a){for(var c=
[],d=document.getElementsByTagName("link"),g=0,b=d.length;g<b;++g){var e=d[g],j=e.getAttribute("rel");j&&-1<j.indexOf("icon")&&(e=e.getAttribute("href"),"svg"!==e.substring(e.length-3)&&c.push(e))}c.push(document.location.origin+"/favicon.ico");var f=0,h=function(b){b?a(b):f>c.length-1?bg.LPPlatform.getFavicon({url:document.location.href,callback:a}):k(c[f++],h)};h()},findText:function(a){var c=h(a),c=c?c.match:null;a.callback&&a.callback(c);return c},isUnloading:function(){return m},findTextParent:h}}();
