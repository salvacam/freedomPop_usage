<h3>Freedompop Usage</h3>
<hr/>

Aplicación para la consulta de los datos de uso de una tarjeta SIM de la compañia Freedompop

<a href="https://salvacam.github.io/freedomPop_usage" target="_blank">Web</a>

Primero se realiza el login para obtener los datos, entre ellos el token de conexión, que se guardara en LocalStorage

Nos devuelve los datos de consumo y conexion
    {
    "baseBandwidth": 209715200,
    "viralBoost": 524288000,
    "totalLimit": 734003200,
    "percentUsed": 0.0580994210924421,
    "overageUsed": 0,
    "planLimitUsed": 42645161,
    "balanceRemaining": 691358039,
    "upgradable": true,
    "offerBonusEarned": 0,
    "startTime": 1499126400000,
    "endTime": 1501804800000

    
    'startTime' => date('d/m/Y', $usage["startTime"]/1000),
    'endTime' => date('d/m/Y', $usage["endTime"]/1000),
    'planLimitUsed' => round(($usage["planLimitUsed"]/$inMB), 2),
    'percentUsed' => round(($usage["percentUsed"]*100), 2),
    'totalLimit' => round(($usage["totalLimit"]/$inMB), 2),
    'accessToken' => $accessToken,
    'expires_in' => $refresh_token,
    'refresh_token' => $refresh_token,
}


Nos devuelve unos datos de conexión
    {
    "email": "email@doamin.com",
    "access_token": "5c78f9cd7cb3caa2504291451e3c9d1",
    "expires_in": 604800,
    "refresh_token": "852012968f75abe54c3c6a89f13e1b66"
}



  $apiUsername = "3726328870";
  $apiPassword = "pNp6TIgVm4viVadoyoUdxbsrfmiBwudN";
  $inMB = 1024 * 1024;

Primero se realiza el login para obtener el token de conexión, que se guardara en LocalStorage

	se realiza en la url, mediante POST, al que se le añade la cabecera, se obtiene de 		base64_encode($apiUsername.':'.$apiPassword) [TODO usar funcion de la web http://locutus.io/php/url/base64_encode/]
		Authorization Basic MzcyNjMyODg3MDpwTnA2VElnVm00dmlWYWRveW9VZHhic3JmbWlCd3VkTg
		https://api.freedompop.com/auth/token?username=correo@mail.es&password=clave&grant_type=password

Nos devuelve unos datos de conexión
	{
    "email": "email@doamin.com",
    "access_token": "5c78f9cd7cb3caa2504291451e3c9d1",
    "token_type": "server",
    "expires_in": 604800,
    "refresh_token": "852012968f75abe54c3c6a89f13e1b66"
}

Se consulta los datos de conexión, que se guardara en LocalStorage

	se realiza en la url, mediante GET, 
	https://api.freedompop.com/user/usage?accessToken=access_token

Nos devuelve unos datos de consumo
	{
    "baseBandwidth": 209715200,
    "viralBoost": 524288000,
    "totalLimit": 734003200,
    "percentUsed": 0.0580994210924421,
    "overageUsed": 0,
    "planLimitUsed": 42645161,
    "balanceRemaining": 691358039,
    "upgradable": true,
    "offerBonusEarned": 0,
    "startTime": 1499126400000,
    "endTime": 1501804800000
}

Si da error se puede refrescar el token si no ha pasado el tiempo definido en los datos de conexión, es el parametro 'expires_in', [TODO comprobar si esta en segundos(10,08 minutos) o milisegundos (7 días)]

	se realiza en la url, mediante POST, al que se le añade la cabecera, se obtiene de 		base64_encode($apiUsername.':'.$apiPassword) [TODO usar funcion de la web http://locutus.io/php/url/base64_encode/]
		https://api.freedompop.com/auth/token?refresh_token=refresh_token&grant_type=refresh_token

Nos devuelve unos datos de conexión, que sobrescribimos los existentes, si no funciona hay que volver a llamar al servicio de login

Referencia:

https://github.com/dodysw/fpopclient/

https://github.com/tonywagner/fpopclient-alerts/