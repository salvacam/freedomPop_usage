<?php

  header('Content-Type: application/json; charset=utf-8');
  header("access-control-allow-origin: *");

/*
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
*/

  $apiUsername = "3726328870";
  $apiPassword = "pNp6TIgVm4viVadoyoUdxbsrfmiBwudN";
  $inMB = 1024 * 1024;

  $user = '';
  if (isset($_REQUEST['user'])) {
    $user = urlencode($_REQUEST['user']);
  }

  $password = '';
  if (isset($_REQUEST['password'])) {
    $password = urlencode($_REQUEST['password']);
  }
  
  $access_token = '';
  if (isset($_REQUEST['access_token'])) {
    $access_token = urlencode($_REQUEST['access_token']);
  }

  $refresh_token = '';
  if (isset($_REQUEST['refresh_token'])) {
    $refresh_token = urlencode($_REQUEST['refresh_token']);
  }

  $expires_in = '';
  if (isset($_REQUEST['expires_in'])) {
    $expires_in = $_REQUEST['expires_in'];
  }


  if ($access_token == '' && ($password == '' || $user == '')) {
    $rtn = array("error" => "Faltan algún token o parametro, user y/o password");
    http_response_code(500);
    print json_encode($rtn);
    die();
  }


  if ($access_token == '') {
    // Login
    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Authorization: Basic '.base64_encode($apiUsername.':'.$apiPassword)
        )
    );


    $context  = stream_context_create($opts);
    $result = file_get_contents('https://api.freedompop.com/auth/token?username=' . $user . '&password=' . $password . '&grant_type=password', false, $context);

    $jsonAccess = json_decode($result, true);

/*
{
    "email": "salvacams@gmail.com",
    "access_token": "5c78f9cd7cb3caa2504291451e3c9d1",
    "token_type": "server",
    "expires_in": 604800,
    "refresh_token": "852012968f75abe54c3c6a89f13e1b66"
}
*/

    if (!isset($jsonAccess['access_token'])) {
      $rtn = array("error" => "user y/o password incorrectos");
      http_response_code(500);
      print json_encode($rtn);
      die();
    }
    $userName = $jsonAccess['email'];
    $access_token = $jsonAccess['access_token'];
    $expires_in = $jsonAccess['expires_in'] + time(); // Añadir la hora actual en segundos
    $refresh_token = $jsonAccess['refresh_token'];

  }

  //Todo Comprobar que no se ha pasado el tiempo del token
  if (time() > $expires_in) {
    // Renovar token
    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Authorization: Basic '.base64_encode($apiUsername.':'.$apiPassword)
        )
    );

    $context  = stream_context_create($opts);
    $result = file_get_contents('https://api.freedompop.com/auth/token?refresh_token=' . $refresh_token . '&grant_type=refresh_token', false, $context);

    $jsonAccess = json_decode($result, true);

/*
{
    "email": "salvacams@gmail.com",
    "access_token": "5c78f9cd7cb3caa2504291451e3c9d1",
    "token_type": "server",
    "expires_in": 604800,
    "refresh_token": "852012968f75abe54c3c6a89f13e1b66"
}
*/

    if (!isset($jsonAccess['access_token'])) {
      $rtn = array("error" => "user y/o password incorrectos");
      http_response_code(500);
      print json_encode($rtn);
      die();
    }
    $userName = $jsonAccess['email'];
    $access_token = $jsonAccess['access_token'];
    $expires_in = $jsonAccess['expires_in'] + time(); // Añadir la hora actual en segundos
    $refresh_token = $jsonAccess['refresh_token'];    
  }


  $page = file_get_contents('https://api.freedompop.com/user/usage?accessToken=' . $access_token);
  $usage = json_decode($page, true);


/*
  ["baseBandwidth"]=> int(209715200) //
  ["viralBoost"] =>   int(524288000) //
  ["totalLimit"]=>   int(734003200) //
  ["percentUsed"]=>   float(0) // 
  ["overageUsed"]=>   int(0) 
  ["planLimitUsed"]=>   int(0)
  ["balanceRemaining"]=>   int(734003200)
  ["upgradable"]=>   bool(true)
  ["offerBonusEarned"]=>   int(0)
  ["startTime"]=>   int(1501804800000)
  ["endTime"]=>   int(1504483200000)
}

*/

  $lista = array(
    'userName' => $user,
    'startTime' => date('d/m/Y', $usage["startTime"]/1000),
    'endTime' => date('d/m/Y', $usage["endTime"]/1000),
    /*
    'baseBandwidth' => round(($usage["baseBandwidth"]/$inMB), 2), // Plan
    'viralBoost' => round(($usage["viralBoost"]/$inMB), 2), //Plan
    'overageUsed' => round(($usage["overageUsed"]/$inMB), 2), //Plan
    'balanceRemaining' => round(($usage["balanceRemaining"]/$inMB), 2), //Plan
*/
    'planLimitUsed' => round(($usage["planLimitUsed"]/$inMB), 2),
    'percentUsed' => round(($usage["percentUsed"]*100), 2),
    'totalLimit' => round(($usage["totalLimit"]/$inMB), 2),
    'access_token' => $access_token,
    'expires_in' => $expires_in,
    'refresh_token' => $refresh_token,
  );

  http_response_code(200);
  echo json_encode($lista);

  die();
?>
