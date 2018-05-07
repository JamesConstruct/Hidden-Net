var serverDtb = "dtb.json";

function GetServers() {
    var xhttp;
    var servers;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.overrideMimeType("application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            servers = JSON.parse(this.response);
            Connect(servers);
        }
    };
    xhttp.open("GET", serverDtb, true);
    xhttp.send();
}
function Connect(servers) {
    var length = servers.length;  
    var Alive = [];
    for (var i = 0; i < length; i++) {
        server = servers[i];
        var params = "type=Hi!";
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("POST", "" + server, false);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        /*xhttp.setRequestHeader("Content-length", params.length);
        xhttp.setRequestHeader("Connection", "keep-alive");*/
        try {
            xhttp.send(params);
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                response = JSON.parse(xhttp.response);
                if (response["status"] == 200) {
                    Alive[Alive.length] = [server, xhttp];
                    document.getElementById("demo").innerHTML += server + " - Live<br>";
                }
            }
        } catch { document.getElementById("demo").innerHTML += server + " - Offline<br>";}
    }
    console.log(Alive);
    AliveServers = Alive;
}

function Search(word) {
    console.log("Searching for: " + word);
    targetServer = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose random target
    middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose middle man
    params = "type=public_key&target=" + targetServer[0];
    //middleMan[1].timeout = 4000;
    middleMan[1].open("POST", "" + middleMan[0], true);
    middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    middleMan[1].onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            response = JSON.parse(this.responseText);
            if (response["status"] == 200) {
                publicKey = window.atob(response["public_key"]);

                var crypt = new JSEncrypt();
                crypt.setKey(publicKey);

                middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose another middle man

                AES_key = "tralala";

                var message = 'search=' + word + '&target=' + middleMan[0] + '&AESkey=' + AES_key;
                var enc = crypt.encrypt(message);
                enc = window.btoa(enc);

                params = "type=conector&magic="+enc+"&target="+targetServer[0];
                middleMan[1].open("POST", "" + middleMan[0], true);
                middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                middleMan[1].onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response);
                        response = JSON.parse(this.response);
                        if (response["status"] == 200) {
                            //aes_cipher = response["cipher"];
                            content = window.atob(response["content"]);
                            headEnd = content.search("</head>");
                            var s = /href=("|')(.*\.css)("|')/.exec(content);
                            while (s != null) {
                                content = content.slice(0, headEnd - 1) + "<style>" + SyncSearch((word + s[1]).replace(word + "//", word + "/"), false) + "</style>" + content.slice(headEnd -1);
                                content = content.replace(s[0], "");
                                s = /href="(.*\.css)"/.exec(content);
                            }
                            document.getElementById("frame").srcdoc = content;
                        }
                        
                    }
                };
                middleMan[1].send(params);
            }
        }
    };
    middleMan[1].send(params);
}
function SyncSearch(word, advaced=true) {
    if (word.replace(" ", "") == "") {
        return "";
    }
    console.log("Searching for: " + word);
    targetServer = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose random target
    middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose middle man
    params = "type=public_key&target=" + targetServer[0];
    middleMan[1] = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    middleMan[1].open("POST", "" + middleMan[0], false);
    middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    middleMan[1].send(params);
    if (middleMan[1].readyState == 4 && middleMan[1].status == 200) {
        //console.log(middleMan[1].response);
        response = JSON.parse(middleMan[1].responseText);
        if (response["status"] == 200) {
            publicKey = window.atob(response["public_key"]);

            var crypt = new JSEncrypt();
            crypt.setKey(publicKey);

            middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose another middle man

            AES_key = GenerateString(32);

            var message = 'search=' + word + '&target=' + middleMan[0] + '&AESkey=' + AES_key;
            var enc = crypt.encrypt(message);
            enc = window.btoa(enc);

            params = "type=conector&magic="+enc+"&target="+targetServer[0];
            middleMan[1].open("POST", "" + middleMan[0], false);
            middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            middleMan[1].send(params);
            if (middleMan[1].readyState == 4 && middleMan[1].status == 200) {
                //console.log(middleMan[1].response);
                response = JSON.parse(middleMan[1].response);
                if (response["status"] == 200) {
                    //aes_cipher = response["cipher"];
                    var content = window.atob(response["content"]);
                    content =  GibberishAES.dec(content, AES_key);
                    if (advaced) {
                        /*headEnd = content.search("</head>");
                        content = content.slice(0, headEnd - 1) + '<meta charset="utf-8">' + content.slice(headEnd -1);*/
                        contentType = getContentTypeFromHeaders(JSON.parse(window.atob(GibberishAES.dec(window.atob(response["headers"]), AES_key))));
                        var s = /href=["']([^ ]*)["']/.exec(content);
                        var done = [];
                        while (s != null && !(done.indexOf(s[1]) > -1) && s[1] != "") {
                            headEnd = content.search("</head>");
                            s[1] = (s[1].slice(0, 2) == "./" ? s[1].slice(1,) : s[1]);
                            content = content.slice(0, headEnd - 1) + "<style>" + SyncSearch((s[1].slice(0, 4)=="http" ? "" : (base_adr(word)) + (s[1].slice(0, 1) == "/" ? s[1] : "/" + s[1])), false) + "</style>" + content.slice(headEnd -1);
                            content = content.replace(s[0], "");
                            done.push(s[1]);
                            s = /href=["']([^ ]*)["']/.exec(content);
                        }
                        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "<!--script has been removed from security reasons.-->");
                        content = content.replace(/<img.*?>/gi, "<!--image has been removed from security reasons.-->");
                    }
                    //document.getElementById("frame").srcdoc = content;
                    return content;
                }
            }
        }
    }
}
function fieldSearch() {
    word = document.getElementById("search").value;
    document.getElementById("frame").srcdoc = SyncSearch(word);
}
function base_adr(adr) {
    return /^(https?\:\/\/[^\/:?#]+)(?:[\/:?#]|$)/i.exec(adr)[1];
}
function GenerateString(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < len; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}
function getContentTypeFromHeaders(headers) {
    ctype = "";
    headers.forEach(element => {
        if (element.indexOf("Content-Type") != -1) {
            ctype = element;
        }
    });
    if (ctype != "") {
        //"Content-Type: text/html"
        ctype = ctype.slice(14, )
    }
    return ctype;
}

var sess_id = GenerateString(50);
var AliveServers = new Array();
GetServers();

    /*// Now decrypt the crypted text with the private key.
    crypt.setPrivateKey('MIICWwIBAAKBgQCXfBWVg57p33sY+8wz+TDcpoWDEsbadw61k3YZ07Goh+pDkqcI+8ZCBT6w/Cf8f7p4GrtFkMnZN+7ynHg1MFGKUbUFU8UjKLbjKn/ZIWl+oG6fW/ACFgo+pzthmsVxxUJeek43FzeJLcfGMBVKwBZknuMVgtPLkr67MgmZljwtPQIDAQABAoGAIlMpiOF0JsZO3FBh6vzyB21sH1En4eTMXnR1dFC1ltyFRp56Xty+BcOueugIH3zJweE8wfyW4DN+X1b5HgQ+1WECusFft05BGvnj1lUj8nYSy/SgkgOBSOr1h3KH2qO0zqyrJ8ZmDc2/iMccPhdohjoMIR/UigJ6r17owgpUUkECQQDa/jwIfNR1+zDKU42s+7E4N6Oz/e5Rf2hwlQ2/+zIAd7SPnkif37TeWv0090lI6PiHjKkBKu0lA0ffMCLEMM21AkEAsRVl9fm4VvIDWPzQhgIH2N4ZE2ei9DzXCWgfPXGnlwOmRWbvBoicxPjlI3BjQGGPNunVAqXoEKEcnkA6HslWaQJAce+N6liP7WYoB0wbTOGSXY5NJIs737jq7JAQHE8jv6yIC6StYkhwgLNUQ6dYwI89JsDe+RWNVhFz5kHUBMDjdQJAPlougKHhSpwEmbzLH6RvZuktIywGsMELZoCHH3d5by8VyLIpz78ilCifZg8Yo362krtbCYepYtGX5hDvZg+2oQJANL8iQMvLGnogHYwgy7JdKYpw+GDL5uzHFyF95+9x5Ne224lBQh9ppn5weur4pebdv2BWUgYHNl3q16bCKvecuQ==');
    var dec = crypt.decrypt(enc);*/