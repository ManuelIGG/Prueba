// clubes.js
const apiClubes = "http://localhost:8105/api/clubes";
let clubEditandoId = null;

function cargarVistaClubes() {
  const contenedor = document.getElementById("clubes-content");

  contenedor.innerHTML = `
    <div class="professional-form-container">
      <h3 class="section-title">
        <i class="fas fa-plus-circle"></i>
        <span id="form-title">Nuevo Club</span>
      </h3>
      
      <form id="form-club" class="professional-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-shield-alt"></i>
              Nombre del Club
            </label>
            <input type="text" id="club-nombre" class="form-input" placeholder="Ej: Real Madrid, Barcelona, Chelsea..." required>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user-tie"></i>
              Entrenador
            </label>
            <select id="club-entrenador" class="form-input" required>
              <option value="">Seleccione un entrenador</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-globe"></i>
              Asociación
            </label>
            <select id="club-asociacion" class="form-input" required>
              <option value="">Seleccione una asociación</option>
            </select>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary" id="btn-guardar-club">
            <i class="fas fa-save"></i>
            Guardar Club
          </button>
          <button type="button" class="btn-secondary" id="btn-cancelar" onclick="cancelarEdicionClub()" style="display: none;">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="professional-table-container">
      <div class="table-header">
        <h3 class="section-title">
          <i class="fas fa-list"></i>
          Lista de Clubes
        </h3>
        <div class="table-stats">
          <span class="stats-badge" id="total-clubes">0 registros</span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="professional-table" id="tabla-clubes">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i> ID</th>
              <th><i class="fas fa-shield-alt"></i> Nombre</th>
              <th><i class="fas fa-user-tie"></i> Entrenador</th>
              <th><i class="fas fa-globe"></i> Asociación</th>
              <th><i class="fas fa-cogs"></i> Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="loading-row">
              <td colspan="5">
                <div class="loading-content">
                  <i class="fas fa-spinner fa-spin"></i>
                  Cargando clubes...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <style>
      /* Contenedor del formulario */
      .professional-form-container {
        background: rgba(55, 65, 81, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(148, 163, 184, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .section-title {
        color: #f1f5f9;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .section-title i {
        color: #06b6d4;
        font-size: 1.1rem;
      }

      /* Grid del formulario */
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-label {
        color: #e2e8f0;
        font-weight: 500;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
      }

      .form-label i {
        color: #06b6d4;
        width: 16px;
      }

      .form-input {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        color: #f1f5f9;
        font-size: 0.95rem;
        transition: all 0.3s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #06b6d4;
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        background: rgba(30, 41, 59, 0.9);
      }

      .form-input::placeholder {
        color: #94a3b8;
        font-style: italic;
      }

      /* Selects especiales */
      .form-input option {
        background: #1e293b;
        color: #f1f5f9;
        padding: 0.5rem;
      }

      /* Botones */
      .form-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, #06b6d4, #0891b2);
        color: white;
        box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #0891b2, #0e7490);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(6, 182, 212, 0.4);
      }

      .btn-secondary {
        background: rgba(75, 85, 99, 0.8);
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.2);
      }

      .btn-secondary:hover {
        background: rgba(75, 85, 99, 1);
        transform: translateY(-1px);
      }

      /* Contenedor de tabla */
      .professional-table-container {
        background: rgba(55, 65, 81, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .table-header {
        padding: 2rem 2rem 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .stats-badge {
        background: rgba(6, 182, 212, 0.2);
        color: #06b6d4;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        border: 1px solid rgba(6, 182, 212, 0.3);
      }

      /* Tabla profesional */
      .table-wrapper {
        overflow-x: auto;
      }

      .professional-table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
      }

      .professional-table th {
        background: rgba(30, 41, 59, 0.8);
        color: #e2e8f0;
        font-weight: 600;
        padding: 1rem;
        text-align: left;
        border-bottom: 2px solid rgba(6, 182, 212, 0.3);
        font-size: 0.9rem;
        white-space: nowrap;
      }

      .professional-table th i {
        color: #06b6d4;
        margin-right: 0.5rem;
        width: 14px;
      }

      .professional-table td {
        padding: 1rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        color: #f1f5f9;
        font-size: 0.9rem;
      }

      .professional-table tbody tr {
        transition: all 0.3s ease;
      }

      .professional-table tbody tr:hover {
        background: rgba(30, 41, 59, 0.5);
        transform: scale(1.01);
      }

      /* Botones de acción */
      .btn-action {
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .btn-edit {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      .btn-edit:hover {
        background: rgba(59, 130, 246, 0.3);
        transform: translateY(-1px);
      }

      .btn-delete {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      .btn-delete:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: translateY(-1px);
      }

      /* Loading state */
      .loading-content {
        text-align: center;
        color: #94a3b8;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }

      .loading-content i {
        color: #06b6d4;
      }

      /* Estado vacío */
      .empty-state {
        text-align: center;
        color: #94a3b8;
        padding: 3rem 2rem;
      }

      .empty-state i {
        font-size: 3rem;
        color: #374151;
        margin-bottom: 1rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .professional-form-container,
        .table-header {
          padding: 1.5rem;
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .form-actions {
          justify-content: stretch;
        }

        .btn-primary,
        .btn-secondary {
          flex: 1;
          justify-content: center;
        }

        .table-header {
          flex-direction: column;
          align-items: stretch;
        }

        .professional-table th,
        .professional-table td {
          padding: 0.75rem 0.5rem;
          font-size: 0.85rem;
        }

        .btn-action {
          padding: 0.4rem 0.6rem;
          font-size: 0.75rem;
        }
      }
    </style>
  `;

  listarClubes();
  cargarEntrenadoresParaClub();
  cargarAsociacionesParaClub();

  document.getElementById("form-club").addEventListener("submit", (e) => {
    e.preventDefault();
    if (clubEditandoId) {
      actualizarClub();
    } else {
      guardarClub();
    }
  });
}

function listarClubes() {
  fetch(apiClubes)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#tabla-clubes tbody");
      const totalElement = document.getElementById("total-clubes");
      
      if (data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="empty-state">
              <i class="fas fa-shield-alt"></i>
              <div>No hay clubes registrados</div>
              <small>Agrega el primer club usando el formulario superior</small>
            </td>
          </tr>
        `;
        totalElement.textContent = "0 registros";
      } else {
        tbody.innerHTML = "";
        data.forEach(club => {
          tbody.innerHTML += `
            <tr>
              <td><strong>#${club.id}</strong></td>
              <td>${club.nombre}</td>
              <td>${club.entrenador?.nombre ? `${club.entrenador.nombre} ${club.entrenador.apellido || ''}` : '<span style="color: #94a3b8;">Sin asignar</span>'}</td>
              <td>${club.asociacion?.nombre || '<span style="color: #94a3b8;">Sin asignar</span>'}</td>
              <td>
                <button class="btn-action btn-edit" onclick="cargarClubParaEditar(${club.id})">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="eliminarClub(${club.id})">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          `;
        });
        totalElement.textContent = `${data.length} registro${data.length !== 1 ? 's' : ''}`;
      }
    })
    .catch(error => {
      console.error('Error al cargar clubes:', error);
      const tbody = document.querySelector("#tabla-clubes tbody");
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
            <div>Error al cargar los clubes</div>
            <small>Verifica la conexión con el servidor</small>
          </td>
        </tr>
      `;
    });
}

function guardarClub() {
  const nombre = document.getElementById("club-nombre").value;
  const entrenadorId = document.getElementById("club-entrenador").value;
  const asociacionId = document.getElementById("club-asociacion").value;

  const nuevoClub = {
    nombre: nombre,
    entrenador: entrenadorId ? { id: parseInt(entrenadorId) } : null,
    asociacion: asociacionId ? { id: parseInt(asociacionId) } : null,
    jugadores: [],
    competiciones: []
  };

  fetch(apiClubes, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoClub)
  }).then(() => {
    document.getElementById("form-club").reset();
    listarClubes();
    mostrarNotificacion('Club guardado exitosamente', 'success');
  }).catch(error => {
    console.error('Error al guardar:', error);
    mostrarNotificacion('Error al guardar el club', 'error');
  });
}

function cargarClubParaEditar(id) {
  fetch(`${apiClubes}/${id}`)
    .then(res => res.json())
    .then(club => {
      document.getElementById("club-nombre").value = club.nombre;
      document.getElementById("club-entrenador").value = club.entrenador?.id || '';
      document.getElementById("club-asociacion").value = club.asociacion?.id || '';
      
      clubEditandoId = club.id;
      
      // Cambiar UI para modo edición
      document.getElementById("btn-guardar-club").innerHTML = '<i class="fas fa-save"></i> Actualizar Club';
      document.getElementById("form-title").textContent = "Editar Club";
      document.getElementById("btn-cancelar").style.display = "flex";
      
      // Scroll al formulario
      document.querySelector('.professional-form-container').scrollIntoView({ 
        behavior: 'smooth' 
      });
    })
    .catch(error => {
      console.error('Error al cargar club:', error);
      mostrarNotificacion('Error al cargar los datos del club', 'error');
    });
}

function actualizarClub() {
  const nombre = document.getElementById("club-nombre").value;
  const entrenadorId = document.getElementById("club-entrenador").value;
  const asociacionId = document.getElementById("club-asociacion").value;

  const clubActualizado = {
    id: clubEditandoId,
    nombre: nombre,
    entrenador: entrenadorId ? { id: parseInt(entrenadorId) } : null,
    asociacion: asociacionId ? { id: parseInt(asociacionId) } : null,
    jugadores: [],
    competiciones: []
  };

  fetch(`${apiClubes}/${clubEditandoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clubActualizado)
  }).then(() => {
    cancelarEdicionClub();
    listarClubes();
    mostrarNotificacion('Club actualizado exitosamente', 'success');
  }).catch(error => {
    console.error('Error al actualizar:', error);
    mostrarNotificacion('Error al actualizar el club', 'error');
  });
}

function eliminarClub(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este club?\n\nEsta acción no se puede deshacer.")) {
    fetch(`${apiClubes}/${id}`, {
      method: "DELETE"
    }).then(() => {
      listarClubes();
      mostrarNotificacion('Club eliminado exitosamente', 'success');
    }).catch(error => {
      console.error('Error al eliminar:', error);
      mostrarNotificacion('Error al eliminar el club', 'error');
    });
  }
}

function cancelarEdicionClub() {
  document.getElementById("form-club").reset();
  document.getElementById("btn-guardar-club").innerHTML = '<i class="fas fa-save"></i> Guardar Club';
  document.getElementById("form-title").textContent = "Nuevo Club";
  document.getElementById("btn-cancelar").style.display = "none";
  clubEditandoId = null;
}

function cargarEntrenadoresParaClub() {
  fetch("http://localhost:8105/api/entrenadores")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("club-entrenador");
      select.innerHTML = "<option value=''>Seleccione un entrenador</option>";
      data.forEach(entrenador => {
        select.innerHTML += `<option value="${entrenador.id}">${entrenador.nombre} ${entrenador.apellido || ''}</option>`;
      });
    })
    .catch(error => {
      console.error('Error al cargar entrenadores:', error);
      mostrarNotificacion('Error al cargar la lista de entrenadores', 'error');
    });
}

function cargarAsociacionesParaClub() {
  fetch("http://localhost:8105/api/asociaciones")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("club-asociacion");
      select.innerHTML = "<option value=''>Seleccione una asociación</option>";
      data.forEach(asociacion => {
        select.innerHTML += `<option value="${asociacion.id}">${asociacion.nombre}</option>`;
      });
    })
    .catch(error => {
      console.error('Error al cargar asociaciones:', error);
      mostrarNotificacion('Error al cargar la lista de asociaciones', 'error');
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `notification notification-${tipo}`;
  notificacion.innerHTML = `
    <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${mensaje}</span>
  `;

  // Agregar estilos si no existen
  if (!document.getElementById('notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .notification-success { background: linear-gradient(135deg, #059669, #047857); }
      .notification-error { background: linear-gradient(135deg, #dc2626, #b91c1c); }
      .notification-info { background: linear-gradient(135deg, #0891b2, #0e7490); }
      .notification.show { transform: translateX(0); }
    `;
    document.head.appendChild(styles);
  }

  // Mostrar notificación
  document.body.appendChild(notificacion);
  setTimeout(() => notificacion.classList.add('show'), 100);
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove('show');
    setTimeout(() => notificacion.remove(), 300);
  }, 3000);
}