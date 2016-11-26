var oneMinuteSignup = oneMinuteSignup || {};
oneMinuteSignup.AppService = {
    clearApplicationCookies: function (url, callback) {
        var location = _getLocation(url);
        var cookieUrl = location.protocol + '//' + location.host;
        oneMinuteSignup.ExtensionProxyService.removeCookies(cookieUrl, callback);

        function _getLocation(href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        }
    },
    getTriggerScript: function (scriptType, data) {

        function escape(textToQuote){
            // https://gist.github.com/getify/3667624
            return textToQuote.replace(/\\([\s\S])|(")/g,"\\$1$2");
        }

        if (scriptType === oneMinuteSignup.ScriptType.request) {
            return 'var context = new LastPass.Web.Automation.Context(LastPass.Extension.ExtensionHostEnvironment); context.run(function(){requestPasswordReset(context, "' + escape(data) + '");})';
        }
        if (scriptType === oneMinuteSignup.ScriptType.change) {
            return 'var context = new LastPass.Web.Automation.Context(LastPass.Extension.ExtensionHostEnvironment); context.run(function(){passwordReset(context, "' + escape(data) + '");})';
        }
        if (scriptType === oneMinuteSignup.ScriptType.logout) {
            return 'var context = new LastPass.Web.Automation.Context(LastPass.Extension.ExtensionHostEnvironment); context.run(function(){logout(context);})';
        }
    },
    generatePassword: function (policy) {
        // Set up defaults
        var passwordLength = 12;
        var charsets = [{
            characterSet: "abcdefghijklnopqrstuvwxyz", 
            minimumRequiredCount: 2}, {
            characterSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            minimumRequiredCount: 2}, {
            characterSet: "0123456789", 
            minimumRequiredCount: 2}];
        var retVal = "";

        // Ovveride defaults if policy is specified
        if (policy && policy.minimumRequiredLength) {
            passwordLength = policy.minimumRequiredLength;
        }
        if (policy && policy.characterSets) {
            charsets = policy.characterSets;
        }

        function randomNumber(min, max) { 
            var byteArray = new Uint8Array(1);
            window.crypto.getRandomValues(byteArray);

            var range = max - min + 1;
            var max_range = 256;
            if (byteArray[0] >= Math.floor(max_range / range) * range)
                return randomNumber(min, max);
            return min + (byteArray[0] % range);
        }

        function shuffle(string) {
            var a = string.split("");
            var n = a.length;

            for(var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        }

        // The algorithm

        // get crypto random chars from charsets
        var joinedCharsets = "";
        for (var i = 0; i < charsets.length; i++) {
            for (var j = 0; j < charsets[i].minimumRequiredCount; j++) {
                retVal += charsets[i].characterSet.charAt(randomNumber(0, charsets[i].characterSet.length - 1));
                passwordLength--;
            }
            joinedCharsets = joinedCharsets.concat(charsets[i].characterSet);
        }

        // fill remaining seats from all charsets
        while (passwordLength > 0) {
            retVal += joinedCharsets.charAt(randomNumber(0, joinedCharsets.length - 1));
            passwordLength--;
        }

        // Everyday I'm shufflin'
        return shuffle(retVal);
    }
};