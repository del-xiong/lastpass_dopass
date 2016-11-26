#dopass

lastpass_dopass最新版(v4.1.33)下载 http://git.oschina.net/splot/dopass/blob/lastpass_v4.1.33/lastpass_v4.1.33.zip

QQ交流群 362705736

Lastpass的dopass版本: [http://git.oschina.net/splot/dopass/tree/lastpass_v4.1.33/](http://git.oschina.net/splot/dopass/tree/lastpass_v4.1.33/)

支持chrome内核的浏览器都可安装(chrome、360、百度、搜狗...)

git clone后切换到lastpass 最新分支或者直接下载lastpass_dopass最新版并解压，然后chrome以开发者模式加载文件夹即可使用

在lastpass的站点账号编辑页面可以方便的对信息进行加解密，有效保护信息安全

lastpass已经对信息加解密过的，为什么还需要额外加解密？

- 个人强迫症，总担心黑客风险、lastpass自有bug等原因导致信息泄露。虽然lastpass自身确实是加密存储的，但是仍会有其他原因导致安全风险，比如用户登录web版lastpass后lastpass就获得了解密用户密码库的密钥，虽然相信lastpass不会存储密钥，但万一程序被黑或者管理问题也会出问题。lastpass之前也被黑过2次，然后发邮件提醒用户更改密码，证明lastpass也明白一次加密的安全性是有限的(弱口令、常用口令等)，而使用了dopass之后，相当于对你的信息进行了2次加密，相信这个星球是不存在能破解你的密码的设备的。( **2016年lastpass暴漏最新0day漏洞导致部分账户存在风险，而使用lastpass_dopass则可以100%防止此类风险，甚至未来即使存在未知漏洞,对lastpass_dopass的影响也几乎为0** )



- lastpass可以防别人，却防不住自己周围的人，一旦登录lastpass后，你的各种账号信息就完全呈现在电脑使用者面前。使用lastpass自有的密码加密，一是只能加密密码，而是解密太麻烦。


- 可拓展性强。如果用户打算更换到其他密码管理平台，但又担心平台bug或者管理问题等导致信息泄露，那么使用dopass就能完全免除你的担忧，因为上传到平台的信息是无法破解的加密信息，即使平台数据库被黑，也不会对你的信息造成任何影响。


Dopass的安全性高吗？

- 非常高，如果自定义内置key，则无法破解。



- 查看dopass源码可以发现内置了一个key(crypt.js:16)，如果破解者知道是使用dopass算法进行加密的，那破解难度和用户的key成正比关系。



- 但是如果破解者不知道是使用dopass加密或者 **用户自行修改了内置key**，那么将无法破解，即使把全球所有的计算资源加起来，也不可破解。



**警告，如果你自行修改了内置key，请一定要保存好，否则只能期待外星人帮你解密了**

演示：

![输入图片说明](http://photozoom-static.stor.sinaapp.com/1.jpg "dopass")
![输入图片说明](http://photozoom-static.stor.sinaapp.com/2.jpg "dopass")