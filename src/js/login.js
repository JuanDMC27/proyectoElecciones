const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const usuarioIngresado = document.getElementById('usuario').value;
  const claveIngresada = document.getElementById('clave').value;

  fetch('https://raw.githubusercontent.com/CesarMCuellarCha/Elecciones/main/administrador.json')
    .then(response => response.json())
    .then(admin => {
      // validación simple
      if (usuarioIngresado === admin.username && claveIngresada === admin.password) {
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Inicio de sesión exitoso. Bienvenido.';
        window.location.href = 'index.html';
      } else {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Usuario o contraseña incorrectos.';
      }
    })
    .catch(error => {
      console.error('Error al cargar los datos de administrador:', error);
      loginMessage.textContent = 'Error al verificar credenciales.';
      loginMessage.style.color = 'red';
    });
});
