var oneMinuteSignup=function(){function k(a){if(0===a.origin.indexOf(f))if("ShowTour"===a.data.type)g&&!h&&(g.show(),h=!0);else if("AddSiteToVault"===a.data.type){var d=LPProxy.getGroupByName(a.data.account.group)||new DummyGroup(a.data.account.group,null);(new Account).addFromDialog(a.data.account,d,{source:"vault"})}else if("Collapse"===a.data.type)$("body").removeClass("oneminfull"),$("body").addClass("oneminsmall");else if("Expand"===a.data.type)$("body").removeClass("oneminsmall"),$("body").addClass("oneminfull");
else if("Close"===a.data.type)$("body").removeClass("oneminsmall"),$("body").removeClass("oneminfull"),$("#oneminutesignup").empty();else if("ReminderDeleted"===a.data.type){if(d=c.filter(function(b){return b.id===a.data.reminder.id})[0])c.splice(c.indexOf(d),1),0===c.length?$("#reminderCountContainer").hide():($("#reminderCountContainer").show(),$("#reminderCount").text(c.length))}else"RemindersAdded"===a.data.type&&(bg.g_reminders=bg.g_reminders.concat(a.data.reminders),j())}function j(){c=bg.g_reminders;
0===c.length?$("#reminderCountContainer").hide():($("#reminderCountContainer").show(),$("#reminderCount").text(c.length))}var e={normal:"normal",reminder:"reminder"},c=[],g=null,h=null,f=null;return{show:function(a){"1"===localStorage.getItem("lp_one_minute_signup_enabled")&&(a=a||e.normal,$.ajax({global:!1,type:"GET",dataType:"json",url:bg.base_url+"lmiapi/clientconfig",success:function(d){var b=document.createElement("iframe");f=d["1minUiBaseUrl"];b.setAttribute("src",f+"/index.html");b.setAttribute("class",
"onemin");b.setAttribute("width","100%");b.setAttribute("height","100%");b.setAttribute("frameborder","0");b.style.position="absolute";$(b).load(function(){a===e.reminder&&b.contentWindow.postMessage({type:"DisplayMode",mode:a,reminders:c},"*");a===e.normal&&b.contentWindow.postMessage({type:"DisplayMode",mode:a},"*")});$("#oneminutesignup").empty();$("#oneminutesignup").append(b);window.addEventListener("message",k)}}))},setTour:function(a){g=a},getReminders:j,modes:e}}();