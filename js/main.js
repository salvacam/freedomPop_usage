document.addEventListener('DOMContentLoaded', function () {
  app.init();
});

let app = {
  //URL_PROXY: 'https://featherbrained-exec.000webhostapp.com/freedomPop_usage/proxy.php',
  URL_PROXY: 'http://salvacam.rf.gd/freedomPop_usage/proxy.php',

  spinnerDiv: document.getElementById('spinnerDiv'),
  dataDiv: document.getElementById('dataDiv'),
  formDiv: document.getElementById('formDiv'),

  logoutButton: document.getElementById('logout'),
  loginButton: document.getElementById('login'),
  userForm: document.getElementById('user'),
  passwordForm: document.getElementById('password'),

  planLimitUsed: document.getElementById('planLimitUsed'),
  totalLimit: document.getElementById('totalLimit'),
  percentUsed: document.getElementById('percentUsed'),
  startTime: document.getElementById('startTime'),
  endTime: document.getElementById('endTime'),

  user: '',
  password: '',

  init: function() {
    app.loginButton.addEventListener('click', app.login);
    app.logoutButton.addEventListener('click', app.logout);

    if(localStorage.getItem('_freedompop_usage')) {
      let tempDataUser = JSON.parse(localStorage.getItem('_freedompop_usage'));
      app.user = tempDataUser.user;
      app.password = atob(tempDataUser.password);
      app.getData();
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
    if (app.user === '' || app.password === '') {
      console.log('falta user o password');
      return;
    }

    app.getData();
  },

  getData: function() {
    var url = app.URL_PROXY + '?user=' + app.user + '&password=' + app.password;
    var xhr = new XMLHttpRequest();
    xhr.open ("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 && xhr.responseText !== "") {
          var data = JSON.parse(xhr.responseText);
          spinnerDiv.classList.toggle('hide');
          dataDiv.classList.toggle('hide');

          let tempDataUser = {'user': app.user, 'password': btoa(app.password) };
          localStorage.setItem('_freedompop_usage', JSON.stringify(tempDataUser));

          planLimitUsed.innerHTML = data.planLimitUsed;
          totalLimit.innerHTML = data.totalLimit;
          percentUsed.innerHTML = data.percentUsed;
          startTime.innerHTML = data.startTime;
          endTime.innerHTML = data.endTime;
        } else {
          app.fn_errorXHR();
        }
      }
    };

    try {
      formDiv.classList.toggle('hide');
      spinnerDiv.classList.toggle('hide');
      xhr.send(null);
    } catch (err) {
      app.fn_errorXHR();
    }
  },

  logout: function() {
    localStorage.removeItem('_freedompop_usage');

    app.userForm.value = "";
    app.passwordForm.value = "";
    dataDiv.classList.toggle('hide');
    formDiv.classList.toggle('hide');
  },

  fn_errorXHR: function() {
    formDiv.classList.toggle('hide');
    spinnerDiv.classList.toggle('hide');
    localStorage.removeItem('_freedompop_usage');

    alert("Error conexión, comprobar usuario y password");
  }
}
