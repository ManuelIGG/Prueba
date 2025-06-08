// ---------------------- SISTEMA DE GESTIÓN DE VIDEOJUEGOS ----------------------

const apiVideojuegos = "http://localhost:8113/api/videojuegos";
let videojuegoEditandoId = null;

// ---------------------- INICIALIZACIÓN ----------------------

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const usuarioActual = verificarAutenticacion();
  if (!usuarioActual) {
    window.location.href = 'index.html';
    return;
  }
  
  // Verificar si es administrador
  if (usuarioActual.rol !== 'admin') {
    alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
    window.location.href = 'ViewUser.html';
    return;
  }

  // Inicializar la aplicación
  inicializarApp();
});

function inicializarApp() {
  actualizarEstadisticas();
  cargarVideojuegos();
  configurarEventListeners();
}

// ---------------------- CONFIGURACIÓN DE EVENTOS ----------------------

function configurarEventListeners() {
  // Búsqueda y filtros
  document.getElementById('searchInput').addEventListener('input', filtrarVideojuegos);
  document.getElementById('genreFilter').addEventListener('change', filtrarVideojuegos);
  document.getElementById('statusFilter').addEventListener('change', filtrarVideojuegos);
  
  // Formulario
  document.getElementById('gameForm').addEventListener('submit', manejarEnvioFormulario);

  // Modal
  document.getElementById('gameModal').addEventListener('click', function (e) {
    if (e.target === this) {
      cerrarModal();
    }
  });

  // Cerrar modal con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cerrarModal();
    }
  });
}

// ---------------------- OPERACIONES CRUD ----------------------

// GET - Obtener todos los videojuegos
function cargarVideojuegos() {
  mostrarCargando(true);
  
  fetch(apiVideojuegos)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(videojuegos => {
      renderizarVideojuegos(videojuegos);
      actualizarEstadisticas(videojuegos);
    })
    .catch(error => {
      console.error('Error al cargar videojuegos:', error);
      mostrarError('Error al cargar los videojuegos. Verifique la conexión con el servidor.');
      // Mostrar mensaje en el grid
      document.getElementById('gamesGrid').innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--rojo-alerta);">
          <h3>❌ Error de Conexión</h3>
          <p>No se pudo conectar con el servidor</p>
          <button onclick="cargarVideojuegos()" class="btn-primary" style="margin-top: 1rem;">
            🔄 Reintentar
          </button>
        </div>
      `;
    })
    .finally(() => {
      mostrarCargando(false);
    });
}

// POST - Crear nuevo videojuego
function crearVideojuego(datosVideojuego) {
  return fetch(apiVideojuegos, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosVideojuego)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al crear videojuego: ${response.status}`);
    }
    return response.json();
  });
}

// PUT - Actualizar videojuego existente
function actualizarVideojuego(id, datosVideojuego) {
  return fetch(`${apiVideojuegos}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosVideojuego)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al actualizar videojuego: ${response.status}`);
    }
    return response.json();
  });
}

// DELETE - Eliminar videojuego
function eliminarVideojuego(id) {
  return fetch(`${apiVideojuegos}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al eliminar videojuego: ${response.status}`);
    }
    return response.ok;
  });
}

// GET - Obtener videojuego específico
function obtenerVideojuego(id) {
  return fetch(`${apiVideojuegos}/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al obtener videojuego: ${response.status}`);
      }
      return response.json();
    });
}

// ---------------------- FUNCIONES DE INTERFAZ ----------------------

function renderizarVideojuegos(videojuegos) {
  const gamesGrid = document.getElementById('gamesGrid');

  if (!videojuegos || videojuegos.length === 0) {
    gamesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gris-metalico);">
        <h3>📝 No hay videojuegos registrados</h3>
        <p>Comienza agregando un nuevo videojuego</p>
        <button onclick="abrirModalAgregar()" class="btn-primary" style="margin-top: 1rem;">
          ➕ Agregar Primer Videojuego
        </button>
      </div>
    `;
    return;
  }

  gamesGrid.innerHTML = videojuegos.map(juego => `
    <div class="game-admin-card">
      <div class="card-header">
        <div class="game-info">
          <h3 class="game-title-admin">${juego.imagen || '🎮'} ${juego.titulo}</h3>
          <div class="game-id">ID: ${juego.id_videojuego}</div>
        </div>
      </div>
      
      <div class="game-details">
        <div class="detail-item">
          <div class="detail-label">Género</div>
          <div class="detail-value">${juego.genero || 'No especificado'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Fecha Lanzamiento</div>
          <div class="detail-value">${formatearFecha(juego.fecha_lanzamiento)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Enlace</div>
          <div class="detail-value">${juego.enlaced ? 
            `<a href="${juego.enlaced}" target="_blank" style="color: var(--azul-neon);">🔗 Ver</a>` : 
            'Sin enlace'}</div>
        </div>
      </div>

      <div style="margin: 1rem 0;">
        <span class="status-badge ${juego.estado === 'activo' ? 'status-active' : 'status-inactive'}">
          ${juego.estado}
        </span>
      </div>

      <div class="card-actions">
        <button class="action-btn btn-view" onclick="verVideojuego(${juego.id_videojuego})" title="Ver Detalles">
          👁️
        </button>
        <button class="action-btn btn-edit" onclick="editarVideojuego(${juego.id_videojuego})" title="Editar">
          ✏️
        </button>
        <button class="action-btn btn-delete" onclick="confirmarEliminar(${juego.id_videojuego}, '${juego.titulo}')" title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function actualizarEstadisticas(videojuegos = null) {
  if (!videojuegos) {
    // Si no se pasan videojuegos, obtenerlos
    fetch(apiVideojuegos)
      .then(response => response.json())
      .then(data => {
        calcularEstadisticas(data);
      })
      .catch(error => {
        console.error('Error al obtener estadísticas:', error);
      });
  } else {
    calcularEstadisticas(videojuegos);
  }
}

function calcularEstadisticas(videojuegos) {
  const total = videojuegos.length;
  const activos = videojuegos.filter(juego => juego.estado === 'activo').length;
  const inactivos = videojuegos.filter(juego => juego.estado === 'inactivo').length;

  document.getElementById('totalGames').textContent = total;
  document.getElementById('activeGames').textContent = activos;
  document.getElementById('inactiveGames').textContent = inactivos;
}

// ---------------------- FUNCIONES DE MODAL ----------------------

function abrirModalAgregar() {
  videojuegoEditandoId = null;
  document.getElementById('modalTitle').textContent = 'Agregar Nuevo Videojuego';
  document.getElementById('submitBtn').textContent = 'Guardar Videojuego';
  document.getElementById('gameForm').reset();
  document.getElementById('gameModal').classList.add('active');
}

function cerrarModal() {
  document.getElementById('gameModal').classList.remove('active');
  videojuegoEditandoId = null;
}

// ---------------------- FUNCIONES DE GESTIÓN ----------------------

function editarVideojuego(id) {
  obtenerVideojuego(id)
    .then(juego => {
      videojuegoEditandoId = id;
      document.getElementById('modalTitle').textContent = 'Editar Videojuego';
      document.getElementById('submitBtn').textContent = 'Actualizar Videojuego';

      // Llenar formulario
      document.getElementById('gameTitle').value = juego.titulo || '';
      document.getElementById('gameGenre').value = juego.genero || '';
      document.getElementById('gameDate').value = juego.fecha_lanzamiento || '';
      document.getElementById('gameIcon').value = juego.imagen || '';
      document.getElementById('gameLink').value = juego.enlaced || '';
      document.getElementById('gameStatus').value = juego.estado || 'activo';

      document.getElementById('gameModal').classList.add('active');
    })
    .catch(error => {
      console.error('Error al cargar videojuego:', error);
      mostrarError('Error al cargar los datos del videojuego');
    });
}

function verVideojuego(id) {
  obtenerVideojuego(id)
    .then(juego => {
      const detalles = `
Detalles del Videojuego:

🎮 Título: ${juego.titulo}
🎯 Género: ${juego.genero || 'No especificado'}
📅 Fecha de Lanzamiento: ${formatearFecha(juego.fecha_lanzamiento)}
🖼️ Imagen/Emoji: ${juego.imagen || 'No especificado'}
🔗 Enlace: ${juego.enlaced || 'No especificado'}
📊 Estado: ${juego.estado}
🔢 ID: ${juego.id_videojuego}
      `;
      alert(detalles);
    })
    .catch(error => {
      console.error('Error al obtener videojuego:', error);
      mostrarError('Error al obtener los detalles del videojuego');
    });
}

function confirmarEliminar(id, titulo) {
  if (confirm(`¿Está seguro de eliminar el videojuego "${titulo}"?\n\nEsta acción no se puede deshacer.`)) {
    eliminarVideojuego(id)
      .then(() => {
        mostrarExito('Videojuego eliminado exitosamente');
        cargarVideojuegos(); // Recargar la lista
      })
      .catch(error => {
        console.error('Error al eliminar videojuego:', error);
        mostrarError('Error al eliminar el videojuego');
      });
  }
}

function manejarEnvioFormulario(e) {
  e.preventDefault();

  const datosVideojuego = {
    titulo: document.getElementById('gameTitle').value.trim(),
    genero: document.getElementById('gameGenre').value,
    fecha_lanzamiento: document.getElementById('gameDate').value || null,
    imagen: document.getElementById('gameIcon').value.trim() || null,
    enlaced: document.getElementById('gameLink').value.trim() || null,
    estado: document.getElementById('gameStatus').value
  };

  // Validaciones
  if (!datosVideojuego.titulo) {
    mostrarError('El título es obligatorio');
    return;
  }

  if (!datosVideojuego.genero) {
    mostrarError('El género es obligatorio');
    return;
  }

  mostrarCargando(true);

  const operacion = videojuegoEditandoId ? 
    actualizarVideojuego(videojuegoEditandoId, datosVideojuego) : 
    crearVideojuego(datosVideojuego);

  operacion
    .then(() => {
      const mensaje = videojuegoEditandoId ? 
        'Videojuego actualizado exitosamente' : 
        'Videojuego creado exitosamente';
      
      mostrarExito(mensaje);
      cerrarModal();
      cargarVideojuegos(); // Recargar la lista
    })
    .catch(error => {
      console.error('Error en operación:', error);
      mostrarError('Error al guardar el videojuego');
    })
    .finally(() => {
      mostrarCargando(false);
    });
}

// ---------------------- FUNCIONES DE FILTRADO ----------------------

function filtrarVideojuegos() {
  const terminoBusqueda = document.getElementById('searchInput').value.toLowerCase();
  const filtroGenero = document.getElementById('genreFilter').value;
  const filtroEstado = document.getElementById('statusFilter').value;

  fetch(apiVideojuegos)
    .then(response => response.json())
    .then(videojuegos => {
      const videojuegosFiltrados = videojuegos.filter(juego => {
        const coincideBusqueda = 
          juego.titulo.toLowerCase().includes(terminoBusqueda) ||
          (juego.genero && juego.genero.toLowerCase().includes(terminoBusqueda));

        const coincideGenero = !filtroGenero || juego.genero === filtroGenero;
        const coincideEstado = !filtroEstado || juego.estado === filtroEstado;

        return coincideBusqueda && coincideGenero && coincideEstado;
      });

      renderizarVideojuegos(videojuegosFiltrados);
    })
    .catch(error => {
      console.error('Error al filtrar videojuegos:', error);
    });
}

// ---------------------- FUNCIONES UTILITARIAS ----------------------

function formatearFecha(fechaString) {
  if (!fechaString) return 'No especificada';
  
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function mostrarCargando(mostrar) {
  const botonSubmit = document.getElementById('submitBtn');
  if (botonSubmit) {
    botonSubmit.disabled = mostrar;
    botonSubmit.textContent = mostrar ? 'Guardando...' : 
      (videojuegoEditandoId ? 'Actualizar Videojuego' : 'Guardar Videojuego');
  }
}

function mostrarError(mensaje) {
  console.error(mensaje);
  // Crear notificación temporal
  const notificacion = document.createElement('div');
  notificacion.className = 'notification error';
  notificacion.innerHTML = `
    <div style="background: var(--rojo-alerta); color: white; padding: 1rem; border-radius: 8px; 
                position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 300px;">
      ❌ ${mensaje}
    </div>
  `;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 5000);
}

function mostrarExito(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'notification success';
  notificacion.innerHTML = `
    <div style="background: var(--verde-exito, #28a745); color: white; padding: 1rem; border-radius: 8px; 
                position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 300px;">
      ✅ ${mensaje}
    </div>
  `;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Función para verificar autenticación (debe estar incluida desde el archivo de usuarios)
function verificarAutenticacion() {
  const usuarioGuardado = sessionStorage.getItem('usuarioActual');
  if (!usuarioGuardado) {
    return null;
  }
  return JSON.parse(usuarioGuardado);
}

// Función de cerrar sesión
function cerrarSesion() {
  if (confirm('¿Desea cerrar sesión y volver al menú principal?')) {
    sessionStorage.removeItem('usuarioActual');
    window.location.href = '../ViewUser';
  }
}

// Función para ir al menú de usuario
function irAMenuUsuario() {
  window.location.href = 'ViewUser.html';
}

// Hacer disponibles las funciones globalmente
window.abrirModalAgregar = abrirModalAgregar;
window.cerrarModal = cerrarModal;
window.editarVideojuego = editarVideojuego;
window.verVideojuego = verVideojuego;
window.confirmarEliminar = confirmarEliminar;
window.cerrarSesion = cerrarSesion;