<?php
    mb_internal_encoding('UTF-8');
    $mb_encoding = mb_convert_encoding($_POST['pswd'], 'UTF-16LE', 'UTF-8');
    $hash = base64_encode(md5($mb_encoding, true));
    //return $hash;
 // some action goes here under php
    echo $hash;

