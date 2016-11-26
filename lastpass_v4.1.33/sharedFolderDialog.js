var SharedFolderDialog=function(j){Dialog.call(this,j,{additionalHeaderClasses:["icon"],closeButtonEnabled:!0,maximizeButtonEnabled:!0,buttonAlign:this.RIGHT_ALIGN});this.folder=this.existingUsers=null};SharedFolderDialog.prototype=Object.create(Dialog.prototype);SharedFolderDialog.prototype.constructor=SharedFolderDialog;
(function(j){SharedFolderDialog.prototype.initialize=function(b){Dialog.prototype.initialize.apply(this,arguments);var d=this,e=document.getElementById("sharedFolderDialogUserTypeahead");LPProxy.isEnterpriseUser()?(e=new BloodhoundDropdown(e,{identify:function(c){return"group"===c.type?c.cgid:c.uid},remote:{url:LPProxy.getBaseURL()+"typeahead_remote.php?grp=1&q=%QUERY",wildcard:"%QUERY"}},{optionLabel:function(c){var a=c.name;"companyuser"===c.type?""===a?a=c.email:""!==c.email&&(a+=" ("+c.email+
")"):a+=" ("+Strings.Vault.USER_GROUP+")";return a},ignore:function(c,a){return d.existingUsers[c]||void 0===a.type&&!LPFeatures.allowShareOutsideEnterprise()}}),e.onChange(function(c,a){c=$.extend({},c);var b=SharedFolderUser;"group"===c.type&&(c.uid=c.cgid,delete c.cgid,b=SharedFolderUserGroup);c.username=c.email;delete c.email;b=new b(c,d.folder);b._pending=!0;d.addNewUser(b);d.existingUsers[a]=!0}),d.inputFields.friends=e):d.inputFields.friends=e=new TypeaheadDropdown(e);e.autocomplete=function(c){var a=
c.target.value;if(null===this.hint&&a){for(var a=d.parseFriendsInput(a),b=0,e=a.length;b<e;++b)d.addNewUser(a[b]);c.preventDefault()}TypeaheadDropdown.prototype.autocomplete.apply(this,arguments)};Topics.get(Topics.REMOVED_SHARED_FOLDER_USER).subscribe(function(b){delete d.existingUsers[b.getID()];d.showHideInviteInput()});$("#sharedFolderDialogInviteButton").bind("click",function(){d.submit()})};SharedFolderDialog.prototype.parseFriendsInput=function(b){var d=[];b=b.split(",");for(var e=0,c=b.length;e<
c;++e){var a=b[e].trim(),f;-1<a.indexOf("@")?(a=a.match(Constants.EmailAddressRegularExpression))&&1===a.length&&(f=new SharedFolderUser({username:a[0]},this.folder)):a&&(f=new SharedFolderUserGroup({name:a},this.folder));f&&(f._pending=!0,f.setEditable(!0),d.push(f))}return d};SharedFolderDialog.prototype.validate=function(b){var d=Dialog.prototype.validate.apply(this,arguments);b.friends&&0===this.parseFriendsInput(b.friends).length&&(this.addError("friends","You must enter a valid email or group name."),
d=!1);return d};SharedFolderDialog.prototype.defaultFields=function(b){b.defaultData=$.extend({readonly:!0,hidePasswords:!0},b.defaultData);Dialog.prototype.defaultFields.call(this,b)};SharedFolderDialog.prototype.addNewUser=function(b){this.containers.newMembers||(this.containers.newMembers=new Container([],{additionalItemClasses:"dialogItem"}),this.containers.newMembers.initialize(document.getElementById("sharedFolderDialogNewUsersContainer")));this.containers.newMembers.addChild(b);this.inputFields.friends.clear();
this.inputFields.friends.focus()};SharedFolderDialog.prototype.setup=function(b,d){Dialog.prototype.setup.apply(this,arguments);this.containers.existingMembers&&(this.containers.existingMembers.initialize(j.getElementById("folderMembers")),this.showHideInviteInput())};SharedFolderDialog.prototype.showHideInviteInput=function(){LPProxy.isEnterpriseUser()||(5<this.containers.existingMembers.getItemChildren().length?($("#sharedFolderMaxMembers").show(),$("#sharedFolderDialogInvites").hide()):($("#sharedFolderMaxMembers").hide(),
$("#sharedFolderDialogInvites").show()))};SharedFolderDialog.prototype.open=function(b){this.folder=b;var d=this;LPRequest.makeDataRequest(LPProxy.getSharedFolderMembers,{params:{shareid:b.getID()},success:function(e){for(var c=[],a=0,f=e.users.length;a<f;++a)c.push(new SharedFolderUser(e.users[a],b));a=0;for(f=e.groups.length;a<f;++a)c.push(new SharedFolderUserGroup(e.groups[a],b));d.containers.existingMembers=new Container(c);d.existingUsers={};a=0;for(f=c.length;a<f;++a)d.existingUsers[c[a].getID()]=
!0;Dialog.prototype.open.call(d,{title:Strings.translateString("Manage Shared Folder")+": "+d.folder.getShareGroupName()})},error:function(){Topics.get(Topics.DIALOG_LOADED).publish()}})};SharedFolderDialog.prototype.getInvitedMembers=function(){var b=this.containers.newMembers?this.containers.newMembers.getItems():[];return b=b.concat(this.parseFriendsInput(this.inputFields.friends.getValue()))};SharedFolderDialog.prototype.getData=function(){var b=Dialog.prototype.getData.apply(this,arguments);
b.newMembers={};b.updatedPermissions=[];var d=this.getInvitedMembers();if(0<d.length)for(var e=0,c=d.length;e<c;++e){var a=d[e];b.newMembers[a.getUsername()]={uid:a.getID(),type:a.getType()}}else{d=this.containers.existingMembers.getItemChildren();e=0;for(c=d.length;e<c;++e)a=d[e],a.isModified()&&b.updatedPermissions.push({uid:a.getID(!0),give:a.getCheckboxValue("give"),readonly:a.getCheckboxValue("readonly"),canadminister:LPProxy.isEnterpriseUser()?a.getCheckboxValue("can_administer"):"0"})}return b};
SharedFolderDialog.prototype.handleSubmit=function(b){var d=$.extend(b,{sharedFolder:this.folder._data,shareInfo:this.folder._shareInfo});LPTools.hasProperties(b.newMembers)?LPRequest.makeRequest(LPProxy.addSharedFolderMembers,{params:d,requestSuccessOptions:{closeDialog:!1},success:this.createDynamicHandler(function(d){for(var c=[],a=this.getInvitedMembers(),f=0,h=a.length;f<h;++f){var g=a[f];d[g.getUsername()]&&(g._pending=!1,g._data.readonly=b.readonly?"1":"0",g._data.give=!b.hidePasswords?"1":
"0",g._data.can_administer=b.can_administer?"1":"0",g.rebuild(),c.push(g));g._parent&&g._parent.removeChild(g)}this.containers.existingMembers.addChild(c);this.showHideInviteInput();this.inputFields.friends.clear()})}):0<b.updatedPermissions.length?LPRequest.makeRequest(LPProxy.updateSharedFolderMemberPermissions,{params:d,success:this.createHandler(function(){for(var d=this.containers.existingMembers.getItemChildren(),c={},a=0,f=d.length;a<f;++a){var h=d[a];c[h.getID(!0)]=h}a=0;for(f=b.updatedPermissions.length;a<
f;++a)d=b.updatedPermissions[a],c[d.uid].updatePermissions(d)})}):this.close()}})(document);
