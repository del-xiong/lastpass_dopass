  var G = function(id){
    return document.getElementById(id);
  }



  window.addEventListener('load',function(){
    setTimeout(function(){
      G("dopass_string") && G("dopass_string").addEventListener("keyup",function(){
        var key = G('dopass_key').value;
        G('dopass_result').value = auth_code(false,G("dopass_string").value,key);
      });
      G("dopass_result") && G("dopass_result").addEventListener("keyup",function(){
        var key = G('dopass_key').value;
        G('dopass_string').value = dopass(true,G("dopass_result").value,key);
      });
      G('dopass_encode') && G('dopass_encode').addEventListener('click',dopassAuto);
      G('dopass_decode') && G('dopass_decode').addEventListener('click',dopassAuto);
    },1000);
  });

  function dopassAuto(e){
    G('dopass_key_required').style.opacity = 0;
    var key = G('dopass_key').value;
    var isDecode = e.target.id === "dopass_decode"?true:false;
    if(key === "") {
      G('dopass_key_required').style.opacity = 1;
      return;
    }
    G('siteDialogPassword').value = dopass(isDecode,G('siteDialogPassword').value,key);
    G('siteDialogNotes').value = dopass(isDecode,G('siteDialogNotes').value,key);
  }

  function dopass(decode,str,key){
    var result = "";
    if(str == "" && !decode)
      return "";
    var r = auth_code(decode,str,key);
    if(r!="" && r!=undefined)
      result = r;
    else
      result = "";
    if(decode && result === "")
      result = str;
    return result;
  }

  function auth_code(decode,str,key) {
    var ckey_length = 12;
    var tmp;
    var SECKEY = "420da90a3e98af5b8481e659af1f8fdb8cecd974b9f3f29672376cc58cc68e3b";
    key = hex_md5(SECKEY + key);
    var md5_key = hex_md5(key);
    var keya = hex_md5(md5_key.substr(0,16));
    var keyb = hex_md5(md5_key.substr(16,16));
    var randKey = getRandKey(ckey_length);
    var keyc = decode?str.substr(0,ckey_length):randKey;

    var cryptkey = keya + hex_md5(keya + keyc);
    var key_length = cryptkey.length;

    var string = decode?Base64.decode(str.substr(ckey_length)):'0000000000'+hex_md5(str + keyb).substr(0,16) + str;
    var string_length = string.length;
    var result = "";
    var box = [];
    for(i = 0 ;i <= 255; i++){
      box[i] = i;
    }
    var rndkey = [];
    for(i = 0; i <= 255; i++) {
     rndkey[i] = ord(cryptkey[i % key_length]);
   }

   for(j = i = 0; i < 256; i++) {
     j = (j + box[i] + rndkey[i]) % 256;
     tmp = box[i];
     box[i] = box[j];
     box[j] = tmp;
   }  

   for(a = j = i = 0; i < string_length; i++) {
     a = (a + 1) % 256;
     j = (j + box[a]) % 256;
     tmp = box[a];
     box[a] = box[j];
     box[j] = tmp;
     result += chr(ord(string[i]) ^ (box[(box[a] + box[j]) % 256]));  
   }  

   var base64_str = Base64.encode(result);
   if(decode){
    var tmp = hex_md5(result.substr(26) + keyb);
    tmp = tmp.substr(0,16);
    if(result.substr(0,10) == 0 && result.substr(10,16) == tmp)
      return result.substr(26);
  }else
  return keyc + base64_str.replace(/=/, "");
}
function getRandKey(len){
  if(!len){len=16;}
  rcode='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  l=rcode.length;
  var ccode='';
  for(i=0;i<len;i++){ccode+=rcode.substr(parseInt(l*Math.random()),1);}
    return ccode;
}