var tabnames="treepane ffpane identpane sharepane credmonpane entpane videopane".split(" "),g_activetab=null,g_lasttab="",g_partnername="";this.inittabs=function(){g_activetab=document.getElementById("sites");g_activetab.className+=" activetab"};
this.ontabchange=function(b){for(var a=0;a<tabnames.length;a++)document.getElementById(tabnames[a])&&(document.getElementById(tabnames[a]).style.display="none",g_activetab&&(g_activetab.className=trim(g_activetab.className.replace("activetab",""))));a=document.getElementById("q")?document.getElementById("q"):document.getElementById("lpsearchstr");""!=g_lasttab&&(a&&""!=a.value&&"undefined"!=typeof maintabs)&&(a.value="",SearchTree(g_lasttab));a=b.getAttribute("tabid");document.getElementById(tabnames[a]).style.display=
"block";g_lasttab=b.id;g_activetab=b;g_activetab.className+=" activetab";document.getElementById("expandcollapse")&&(document.getElementById("expandcollapse").style.display="0"==a?"":"none");document.getElementById("creategrouprow")&&(document.getElementById("creategrouprow").style.display="0"==a?"":"none");"sites"==g_lasttab&&"function"==typeof fix_nosites&&fix_nosites();"ff"==g_lasttab&&populateff("");"ident"==g_lasttab&&populateident("");"shares"==g_lasttab&&"function"==typeof populateshares_remote&&
populateshares_remote();"credmon"==g_lasttab&&populatealerts("");"enterprise"==g_lasttab&&loadenterprise();"video"==g_lasttab?loadvideo():hidevideo();updateActionMenu(a)};
this.updateActionMenu=function(b){if(-1==window.location.href.indexOf("showdeleted")){var a="Add Site;Add Profile;Add Identity;;Add Profile;;".split(";");document.getElementById("addsite").style.display="   none  none none none".split(" ")[b];document.getElementById("addsecurenote").style.display=" none none none none none none none".split(" ")[b];"undefined"!=typeof document.getElementById("addsitetext").innerText?document.getElementById("addsitetext").innerText="undefined"!=typeof translations[a[b]]?
translations[a[b]]:a[b]:"undefined"!=typeof document.getElementById("addsitetext").textContent&&(document.getElementById("addsitetext").textContent="undefined"!=typeof translations[a[b]]?translations[a[b]]:a[b]);document.getElementById("actions_separator")&&(document.getElementById("actions_separator").style.display="none"==document.getElementById("addsite").style.display&&"none"==document.getElementById("addsecurenote").style.display&&"none"==document.getElementById("creategrouprow").style.display?
"none":"block")}};this.geturltoload=function(b){b=("undefined"!=typeof baseurl?baseurl:"")+b;""!=g_partnername&&(b+=(0<=b.indexOf("?")?"&":"?")+"partnername="+encodeURIComponent(g_partnername));return b=b.replace("?&","?")};
this.loadenterprise=function(){var b=document.getElementById("entpane");if(!document.getElementById("entiframe")){var a=document.createElement("iframe");a.id="entiframe";a.type="content";a.className="overviewiframe";a.setAttribute("src",geturltoload("enterprise_overview2.php"));b.appendChild(a)}};
this.loadvideo=function(){var b=document.getElementById("videopane");if(!document.getElementById("videoiframe")){var a=document.createElement("iframe");a.id="videoiframe";a.type="content";a.className="overviewiframe";a.setAttribute("src",geturltoload("video_overview.php"));b.appendChild(a)}};this.hidevideo=function(){try{var b=document.getElementById("videoiframe");if(b){var a=document.getElementById("videopane");a&&b.parentNode==a&&a.removeChild(b)}}catch(e){}};
this.append_link=function(b,a,e,g,k,h,d){var c=document.createElement("a");c.setAttribute("href",a);c.setAttribute("id",e);g&&c.setAttribute("title",g);a=document.createElement("img");a.setAttribute("src",k);a.setAttribute("class","border0px");c.appendChild(a);h&&c.appendChild(document.createTextNode(h));b.appendChild(c);d&&b.appendChild(document.createTextNode(d))};
this.populateffcommon=function(b,a){var e="undefined"==typeof gLocalBaseUrl?"":gLocalBaseUrl,g=document.getElementById("ffpane");if(0==b.length&&"undefined"==typeof g_no_overview){if(!document.getElementById("ffiframe")){for(;g.children.length;)g.removeChild(g.children[0]);e=document.createElement("iframe");e.id="ffiframe";e.type="content";e.className="overviewiframe";e.setAttribute("src",geturltoload("formfill_overview.php"));e.setAttribute("frameborder","0");g.appendChild(e)}}else{for(;g.children.length;)g.removeChild(g.children[0]);
a=a.toLowerCase();var k=document.createElement("table");k.className="vault-table";for(var h={},d=0;d<b.length;d++){var c=b[d],m="string"==typeof c.decprofilename?c.decprofilename:c.profilename;if(!(""!=a&&-1==m.indexOf(a))){var l=document.createElement("tr");l.className="table-row";var j=document.createElement("td"),f=document.createElement("td");0==d?(j.className+=" firstrowleft",f.className+=" firstrowright"):d==b.length-1&&(j.className+=" lastrowleft",f.className+=" lastrowright");f.align="right";
append_link(j,"#","launchffid"+c.ffid,null,e+"images/vaultff.png",m);h["launchffid"+c.ffid]=function(){openff(this.id.substring(10));return!1};append_link(f,"#","editffid"+c.ffid,gs("Edit"),e+"images/vaultedit.png",null," | ");h["editffid"+c.ffid]=function(){openff(this.id.substring(8));return!1};"undefined"==typeof g_hideprofilecopy&&(append_link(f,"#","copyffid"+c.ffid,gs("Copy"),e+"images/vaultcopy.png",null," | "),h["copyffid"+c.ffid]=function(){copyff(this.id.substring(8));return!1});append_link(f,
"#","deleteffid"+c.ffid,gs("Delete"),e+"images/vaultdelete.png");h["deleteffid"+c.ffid]=function(){delff(this.id.substring(10));return!1};l.appendChild(j);l.appendChild(f);k.appendChild(l)}}g.appendChild(k);for(d in h)document.getElementById(d).onclick=h[d]}};
function populateidentcommon(b,a){for(var e=document.getElementById("identpane");e.children.length;)e.removeChild(e.children[0]);var g="undefined"==typeof gLocalBaseUrl?"":gLocalBaseUrl;a=a.toLowerCase();var k=document.createElement("table");k.className="vault-table";for(var h={},d=0;d<b.length;d++){var c=b[d],m="string"==typeof c.deciname?c.deciname:c.iname;if(!(""!=a&&-1==m.indexOf(a))){var l=document.createElement("tr");l.className="table-row";var j=document.createElement("td"),f=document.createElement("td");
0==d?(j.className+=" firstrowleft",f.className+=" firstrowright"):d==b.length-1&&(j.className+=" lastrowleft",f.className+=" lastrowright");f.align="right";append_link(j,"#","launchident"+c.iid,null,g+"images/vaultidentity.png",m);h["launchident"+c.iid]=function(){openident(this.id.substring(11));return!1};append_link(f,"#","editident"+c.iid,gs("Edit"),g+"images/vaultedit.png",null," | ");h["editident"+c.iid]=function(){openident(this.id.substring(9));return!1};"undefined"==typeof g_hideidentcopy&&
(append_link(f,"#","copyident"+c.iid,gs("Copy"),g+"images/vaultcopy.png",null," | "),h["copyident"+c.iid]=function(){copyident(this.id.substring(9));return!1});append_link(f,"#","deleteident"+c.iid,gs("Delete"),g+"images/vaultdelete.png");h["deleteident"+c.iid]=function(){delident(this.id.substring(11));return!1};l.appendChild(j);l.appendChild(f);k.appendChild(l)}}e.appendChild(k);for(d in h)document.getElementById(d).onclick=h[d]}
function cleariframe(b){try{if(document.getElementById(b))for(;document.getElementById(b).children.length;)document.getElementById(b).removeChild(document.getElementById(b).children[0])}catch(a){}};