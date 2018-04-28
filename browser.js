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
    var Alive = new Array();
    for (var i = 0; i < length; i++) {
        server = servers[i];
        document.getElementById("demo").innerHTML = server;
        var params = "type=Hi!";
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("POST", "" + server, true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        /*xhttp.setRequestHeader("Content-length", params.length);
        xhttp.setRequestHeader("Connection", "keep-alive");*/
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.response);
                if (response["status"] == 200) {
                    Alive.push([server, xhttp]);
                }
                delete server; 
                delete xhttp;
                delete response;
            }
        };
        xhttp.send(params);
    }
    console.log(Alive);
    AliveServers = Alive;
}

function Search() {
    word = document.getElementById("search").value;
    targetServer = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose random target
    middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose middle man
    params = "type=public_key&target=" + targetServer[0] + "&sess_id=" + sess_id;
    middleMan[1].open("POST", "" + middleMan[0], true);
    middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    middleMan[1].onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(this.responseText);
            if (response["status"] == 200) {
                publicKey = response["public_key"];

                var crypt = new JSEncrypt();
                crypt.setKey(publicKey);

                middleMan = AliveServers[Math.floor(Math.random()*AliveServers.length)]; // choose another middle man

                AES_key = "tralala";

                var message = 'search=' + word + '&sess_id=' + sess_id + '&target=' + middleMan[0] + '&AESkey=' + AES_key;
                var enc = crypt.encrypt(message);

                console.log(enc);

                params = "type=conector&magic="+enc+"&target="+targetServer[0]+"&sess_id="+sess_id;
                middleMan[1].open("POST", "" + middleMan[0], true);
                middleMan[1].setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                middleMan[1].onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        response = JSON.parse(this.response);
                        if (response["status"] == 200) {
                            aes_cipher = response["cipher"];
                        }
                        console.log(response);
                        
                    }
                };
                middleMan[1].send(params);
            }
            
        }
    };
    middleMan[1].send(params);
}

var sess_id = Array(53+1).join(Math.random().toString(36).substring(2)).slice(0, 53);
var AliveServers = new Array();
GetServers();

    /*// Now decrypt the crypted text with the private key.
    crypt.setPrivateKey('MIICWwIBAAKBgQCXfBWVg57p33sY+8wz+TDcpoWDEsbadw61k3YZ07Goh+pDkqcI+8ZCBT6w/Cf8f7p4GrtFkMnZN+7ynHg1MFGKUbUFU8UjKLbjKn/ZIWl+oG6fW/ACFgo+pzthmsVxxUJeek43FzeJLcfGMBVKwBZknuMVgtPLkr67MgmZljwtPQIDAQABAoGAIlMpiOF0JsZO3FBh6vzyB21sH1En4eTMXnR1dFC1ltyFRp56Xty+BcOueugIH3zJweE8wfyW4DN+X1b5HgQ+1WECusFft05BGvnj1lUj8nYSy/SgkgOBSOr1h3KH2qO0zqyrJ8ZmDc2/iMccPhdohjoMIR/UigJ6r17owgpUUkECQQDa/jwIfNR1+zDKU42s+7E4N6Oz/e5Rf2hwlQ2/+zIAd7SPnkif37TeWv0090lI6PiHjKkBKu0lA0ffMCLEMM21AkEAsRVl9fm4VvIDWPzQhgIH2N4ZE2ei9DzXCWgfPXGnlwOmRWbvBoicxPjlI3BjQGGPNunVAqXoEKEcnkA6HslWaQJAce+N6liP7WYoB0wbTOGSXY5NJIs737jq7JAQHE8jv6yIC6StYkhwgLNUQ6dYwI89JsDe+RWNVhFz5kHUBMDjdQJAPlougKHhSpwEmbzLH6RvZuktIywGsMELZoCHH3d5by8VyLIpz78ilCifZg8Yo362krtbCYepYtGX5hDvZg+2oQJANL8iQMvLGnogHYwgy7JdKYpw+GDL5uzHFyF95+9x5Ne224lBQh9ppn5weur4pebdv2BWUgYHNl3q16bCKvecuQ==');
    var dec = crypt.decrypt(enc);*/