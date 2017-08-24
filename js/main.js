document.addEventListener('DOMContentLoaded', function () {
  app.init();
});

let app = {  
  URL_PROXY: 'https://calcicolous-moonlig.000webhostapp.com/freedomPop_usage/proxy.php',
  //URL_PROXY: 'http://localhost:8008/proxy.php',

  spinnerDiv: document.getElementById('spinnerDiv'),
  dataDiv: document.getElementById('dataDiv'),
  formDiv: document.getElementById('formDiv'),

  logoutButton: document.getElementById('logout'),
  loginButton: document.getElementById('login'),
  updateButton: document.getElementById('update'),
  userForm: document.getElementById('user'),
  passwordForm: document.getElementById('password'),


  userDiv: document.getElementById('userDiv'),
  planLimitUsed: document.getElementById('planLimitUsed'),
  totalLimit: document.getElementById('totalLimit'),
  percentUsed: document.getElementById('percentUsed'),
  startTime: document.getElementById('startTime'),
  endTime: document.getElementById('endTime'),

  access_token: '',
  refresh_token: '',
  expires_in: '',
  userName: '',


  init: function() {
    app.loginButton.addEventListener('click', app.login);
    app.logoutButton.addEventListener('click', app.logout);
    app.updateButton.addEventListener('click', app.getData);

    if(localStorage.getItem('_freedompop_usage')) {
      let dataConnection = JSON.parse(localStorage.getItem('_freedompop_usage'));
      app.saveDataConnection(dataConnection);
      app.getData();
    }

    //Guardar service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js')
        .then(function() {
          //console.log('Service Worker Registered');
        });
    }
  },

  login: function() {
    if (app.userForm.value) {
      app.user = app.userForm.value;
    }
    if (app.passwordForm.value) {
      app.password = app.passwordForm.value;
    }
    //TODO mejorar comprobacion
    if (!app.user || !app.password) {
      alert('Falta usuario y/o password');
      return;
    }
    app.getLogin();
  },

  saveDataConnection: function(data) {
      app.access_token = data.access_token;
      app.refresh_token = data.refresh_token;
      app.expires_in = data.expires_in;
      app.userName = decodeURIComponent(data.userName);
  },

  showDataConnection: function(data) {
      app.userDiv.innerHTML = app.userName;
      app.planLimitUsed.innerHTML = data.planLimitUsed;
      app.totalLimit.innerHTML = data.totalLimit;
      app.percentUsed.innerHTML = data.percentUsed;
      app.startTime.innerHTML = data.startTime;
      app.endTime.innerHTML = data.endTime;
  },

  showLastData: function(){
    alert("Error conexión, se muestran los últimos datos obtenidos");
    let dataConnection = JSON.parse(localStorage.getItem('_freedompop_usage'));
    app.spinnerDiv.classList.add('hide');
    app.dataDiv.classList.remove('hide');
    app.updateButton.classList.remove('hide');
    app.showDataConnection(dataConnection);
  },

  showErrorConnection: function() {
    alert("Error conexión, comprobar usuario y password");
    app.formDiv.classList.remove('hide');
    app.spinnerDiv.classList.add('hide');
  },


  getLogin: function() {
    var url = app.URL_PROXY + '?user=' + app.user + 
      '&password=' + app.password;

    app.formDiv.classList.add('hide');
    app.spinnerDiv.classList.remove('hide');

    
      fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            //console.log('Looks like there was a problem. Status Code: ' + response.status);  
            app.showErrorConnection();
            return;
          }

          response.json()
          .then(function(data) { 
              localStorage.setItem('_freedompop_usage', JSON.stringify(data));
            
              app.saveDataConnection(data);
              app.showDataConnection(data);

              app.spinnerDiv.classList.add('hide');
              app.dataDiv.classList.remove('hide');          
          })
          .catch(function(err) {
            app.showErrorConnection();
          })
        }
      )
      .catch(function(err) {
        //console.log('Fetch Error :-S', err);
        app.showErrorConnection();
      });
  },

  getData: function() {
    app.formDiv.classList.add('hide');
    app.spinnerDiv.classList.remove('hide');

    let url = app.URL_PROXY + '?user=' + app.userName + 
      "&access_token=" + app.access_token + "&refresh_token=" + app.refresh_token + 
      "&expires_in=" + app.expires_in; 

    let dataSend = new FormData();
    dataSend.append( "access_token", app.access_token );
    dataSend.append( "refresh_token", app.refresh_token );
    dataSend.append( "expires_in", app.expires_in );

//    try {
      fetch(url)
      .then(
        function(response) {
          if (response.status !== 200) {
            //console.log('Looks like there was a problem. Status Code: ' + response.status);  
            app.showLastData();
            return;
          }

          response.json()
          .then(function(data) {

            app.spinnerDiv.classList.add('hide');
            app.dataDiv.classList.remove('hide');
            app.updateButton.classList.add('hide');

            localStorage.setItem('_freedompop_usage', JSON.stringify(data));

            app.saveDataConnection(data);
            app.showDataConnection(data);
          })
          .catch(function(err){
            app.showLastData();
          })
        }
      )
      .catch(function(err) {
        app.showLastData();
      });
  //  } catch (err) {
    //  app.showLastData();
    //}
  },

  logout: function() {
    localStorage.removeItem('_freedompop_usage');

    app.userForm.value = "";
    app.passwordForm.value = "";
    dataDiv.classList.add('hide');
    formDiv.classList.remove('hide');
  }

}
