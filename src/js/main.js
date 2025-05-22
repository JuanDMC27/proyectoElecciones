const API_CANDIDATOS_URL = 'https://raw.githubusercontent.com/CesarMCuellarCha/Elecciones/main/candidatos.json';

let votos = [];
let candidatoSeleccionado = null;
let candidatoIndex = null;
let cerrarParaLogin = false;

const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const graciasModal = document.getElementById('gracias-modal');
const graciasText = document.getElementById('gracias-text');
const graciasOkBtn = document.getElementById('gracias-ok-btn');
const cerrarBtn = document.getElementById('cerrar-btn');
const cerrarModalConfirm = document.getElementById('cerrar-modal-confirm');
const confirmarCerrarBtn = document.getElementById('confirmar-cerrar');
const cancelarCerrarBtn = document.getElementById('cancelar-cerrar');
const votosBtn = document.getElementById('votos_btn');
const votosLista = document.getElementById('votos-lista');
const votosModal = document.getElementById('votos-modal');
const cerrarModal = document.getElementById('cerrar-modal');

/**
 * Inicializa la aplicación cargando los candidatos y configurando los eventos de votación.
 */
function initApp() {
  fetch(API_CANDIDATOS_URL)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('cards');
      votos = new Array(data.length).fill(0);

      data.forEach((post, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <p>${post.curso}</p>
          <img src="${post.foto}" alt="${post.nombre}">
          <h2>Nombre: ${post.nombre} ${post.apellido}</h2>
          <p>Ficha: ${post.ficha}</p>
          <button class="votar-btn">Votar</button>
        `;

        const votarBtn = card.querySelector('.votar-btn');
        votarBtn.addEventListener('click', () => {
          candidatoSeleccionado = `${post.nombre} ${post.apellido}`;
          candidatoIndex = index;
          modalText.textContent = `¿Deseas votar por ${candidatoSeleccionado}?`;
          modal.classList.remove('hidden');
        });

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
}

/**
 * Confirma el voto y muestra el modal de agradecimiento.
 */
function confirmarVoto() {
  votos[candidatoIndex]++;
  modal.classList.add('hidden');
  graciasText.textContent = `¡Gracias por tu voto a ${candidatoSeleccionado}!`;
  graciasModal.classList.remove('hidden');
}

/**
 * Cancela el voto y muestra el modal de cancelación.
 */
function cancelarVoto() {
  modal.classList.add('hidden');
  mostrarModalCancelarVoto();
}

/**
 * Muestra el modal de cancelación de voto.
 */
function mostrarModalCancelarVoto() {
  let cancelarVotoModal = document.getElementById('cancelar-voto-modal');
  if (!cancelarVotoModal) {
    cancelarVotoModal = document.createElement('div');
    cancelarVotoModal.id = 'cancelar-voto-modal';
    cancelarVotoModal.className = 'modal';
    cancelarVotoModal.innerHTML = `
      <div class="modal-content">
        <p id="cancelar-voto-text">Has cancelado el voto.</p>
        <div class="modal-buttons">
          <button id="cancelar-voto-ok-btn">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(cancelarVotoModal);
    document.getElementById('cancelar-voto-ok-btn').addEventListener('click', () => {
      cancelarVotoModal.classList.add('hidden');
    });
  }
  cancelarVotoModal.classList.remove('hidden');
}

/**
 * Muestra el modal de resultados de votos.
 * @param {boolean} paraLogin - Si es true, redirige a login al cerrar el modal.
 */
function mostrarResultadosVotos(paraLogin) {
  cerrarParaLogin = paraLogin;
  votosLista.innerHTML = '';
  fetch(API_CANDIDATOS_URL)
    .then(response => response.json())
    .then(data => {
      data.forEach((candidato, index) => {
        const li = document.createElement('li');
        li.textContent = `${candidato.nombre} ${candidato.apellido}: ${votos[index]} votos`;
        votosLista.appendChild(li);
      });
      votosModal.classList.remove('hidden');
      cerrarModalConfirm.classList.add('hidden');
    });
}

initApp();

confirmBtn.addEventListener('click', confirmarVoto);

graciasOkBtn.addEventListener('click', () => {
  graciasModal.classList.add('hidden');
});

cancelBtn.addEventListener('click', cancelarVoto);

cerrarBtn.addEventListener('click', () => {
  cerrarModalConfirm.classList.remove('hidden');
});

confirmarCerrarBtn.addEventListener('click', () => {
  mostrarResultadosVotos(true);
});

cancelarCerrarBtn.addEventListener('click', () => {
  cerrarModalConfirm.classList.add('hidden');
});

votosBtn.addEventListener('click', () => {
  mostrarResultadosVotos(false);
});

cerrarModal.addEventListener('click', () => {
  votosModal.classList.add('hidden');
  if (cerrarParaLogin) {
    window.location.href = 'login.html';
  }
});
