<?php

  header('Content-Type: application/json; charset=utf-8');
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

  if ( $password == '' || $user == '') {
    $rtn = array("error" => "Faltan algún parametro, user y/o password");
    http_response_code(500);
    print json_encode($rtn);
    die();
  }

  $login_curl = curl_init();
  curl_setopt($login_curl, CURLOPT_URL, 'https://api.freedompop.com/auth/token?username=' . $user . '&password=' . $password . '&grant_type=password');
  curl_setopt($login_curl, CURLOPT_POST, TRUE);
  curl_setopt($login_curl, CURLOPT_HTTPHEADER, array(
    'Authorization: Basic '. base64_encode($apiUsername.':'.$apiPassword)
  ));
  curl_setopt($login_curl, CURLOPT_RETURNTRANSFER, true);
  $login_out = curl_exec($login_curl);

  $jsonAccess = json_decode($login_out, true);
  if (!isset($jsonAccess['access_token'])) {
    $rtn = array("error" => "user y/o password incorrectos");
    http_response_code(500);
    print json_encode($rtn);
    curl_close($login_curl);
    die();
  }
  $accessToken = $jsonAccess['access_token'];
  curl_close($login_curl);


  $page = file_get_contents('https://api.freedompop.com/user/usage?accessToken=' . $accessToken);
  $usage = json_decode($page, true);

  $lista = array(
    'startTime' => date('d/m/Y', $usage["startTime"]/1000),
    'endTime' => date('d/m/Y', $usage["endTime"]/1000),
    'planLimitUsed' => round(($usage["planLimitUsed"]/$inMB), 2),
    'percentUsed' => round($usage["percentUsed"], 2),
    'totalLimit' => round(($usage["totalLimit"]/$inMB), 2)
  );

  http_response_code(200);
  echo json_encode($lista);

  die();
?>