// competiciones.js
const apiCompeticiones = "http://localhost:8105/api/competiciones";
let competicionEditandoId = null;

function cargarVistaCompeticiones() {
  const contenedor = document.getElementById("competiciones-content");

  contenedor.innerHTML = `
    <div class="professional-form-container">
      <h3 class="section-title">
        <i class="fas fa-trophy"></i>
        <span id="form-title">Nueva Competición</span>
      </h3>
      
      <form id="form-competicion" class="professional-form">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-medal"></i>
              Nombre de la Competición
            </label>
            <input type="text" id="competicion-nombre" class="form-input" placeholder="Ej: Liga de Campeones, Copa del Rey..." required>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-dollar-sign"></i>
              Premio (USD)
            </label>
            <input type="number" id="competicion-premio" class="form-input" placeholder="0.00" min="0" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-calendar-alt"></i>
              Fecha de Inicio
            </label>
            <input type="date" id="competicion-inicio" class="form-input" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-calendar-check"></i>
              Fecha de Finalización
            </label>
            <input type="date" id="competicion-fin" class="form-input" required>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary" id="btn-guardar-competicion">
            <i class="fas fa-save"></i>
            Guardar Competición
          </button>
          <button type="button" class="btn-secondary" id="btn-cancelar" onclick="cancelarEdicionCompeticion()" style="display: none;">
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
          Lista de Competiciones
        </h3>
        <div class="table-stats">
          <span class="stats-badge" id="total-competiciones">0 registros</span>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="professional-table" id="tabla-competiciones">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i> ID</th>
              <th><i class="fas fa-trophy"></i> Nombre</th>
              <th><i class="fas fa-dollar-sign"></i> Premio</th>
              <th><i class="fas fa-calendar-alt"></i> Inicio</th>
              <th><i class="fas fa-calendar-check"></i> Fin</th>
              <th><i class="fas fa-hourglass-half"></i> Estado</th>
              <th><i class="fas fa-cogs"></i> Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr class="loading-row">
              <td colspan="7">
                <div class="loading-content">
                  <i class="fas fa-spinner fa-spin"></i>
                  Cargando competiciones...
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
        color: #f59e0b;
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
        color: #f59e0b;
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
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        background: rgba(30, 41, 59, 0.9);
      }

      .form-input::placeholder {
        color: #94a3b8;
        font-style: italic;
      }

      /* Input de fecha personalizado */
      .form-input[type="date"] {
        position: relative;
        color-scheme: dark;
      }

      .form-input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }

      /* Input de número personalizado */
      .form-input[type="number"] {
        -moz-appearance: textfield;
      }

      .form-input[type="number"]::-webkit-outer-spin-button,
      .form-input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
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
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #d97706, #b45309);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
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
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
        border: 1px solid rgba(245, 158, 11, 0.3);
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
        border-bottom: 2px solid rgba(245, 158, 11, 0.3);
        font-size: 0.9rem;
        white-space: nowrap;
      }

      .professional-table th i {
        color: #f59e0b;
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

      /* Estados de competición */
      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-active {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.3);
      }

      .status-upcoming {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      .status-finished {
        background: rgba(107, 114, 128, 0.2);
        color: #9ca3af;
        border: 1px solid rgba(107, 114, 128, 0.3);
      }

      /* Formateo de premio */
      .prize-amount {
        font-weight: 600;
        color: #10b981;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .prize-amount::before {
        content: "$";
        font-size: 0.8rem;
        opacity: 0.7;
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
        color: #f59e0b;
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

  listarCompeticiones();

  document.getElementById("form-competicion").addEventListener("submit", (e) => {
    e.preventDefault();
    if (competicionEditandoId) {
      actualizarCompeticion();
    } else {
      guardarCompeticion();
    }
  });
}

function listarCompeticiones() {
  fetch(apiCompeticiones)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#tabla-competiciones tbody");
      const totalElement = document.getElementById("total-competiciones");
      
      if (data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="empty-state">
              <i class="fas fa-trophy"></i>
              <div>No hay competiciones registradas</div>
              <small>Agrega la primera competición usando el formulario superior</small>
            </td>
          </tr>
        `;
        totalElement.textContent = "0 registros";
      } else {
        tbody.innerHTML = "";
        data.forEach(comp => {
          const estadoCompeticion = obtenerEstadoCompeticion(comp.fechaInicio, comp.fechaFin);
          const fechaInicioFormatted = formatearFecha(comp.fechaInicio);
          const fechaFinFormatted = formatearFecha(comp.fechaFin);
          const premioFormatted = formatearPremio(comp.montoPremio);
          
          tbody.innerHTML += `
            <tr>
              <td><strong>#${comp.id}</strong></td>
              <td>${comp.nombre}</td>
              <td><span class="prize-amount">${premioFormatted}</span></td>
              <td>${fechaInicioFormatted}</td>
              <td>${fechaFinFormatted}</td>
              <td><span class="status-badge ${estadoCompeticion.clase}">${estadoCompeticion.texto}</span></td>
              <td>
                <button class="btn-action btn-edit" onclick="cargarCompeticionParaEditar(${comp.id})">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="eliminarCompeticion(${comp.id})">
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
      console.error('Error al cargar competiciones:', error);
      const tbody = document.querySelector("#tabla-competiciones tbody");
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
            <div>Error al cargar las competiciones</div>
            <small>Verifica la conexión con el servidor</small>
          </td>
        </tr>
      `;
      mostrarNotificacion('Error al cargar las competiciones', 'error');
    });
}

function guardarCompeticion() {
  const nombre = document.getElementById("competicion-nombre").value;
  const premio = parseFloat(document.getElementById("competicion-premio").value);
  const fechaInicio = document.getElementById("competicion-inicio").value;
  const fechaFin = document.getElementById("competicion-fin").value;

  // Validar fechas
  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    mostrarNotificacion('La fecha de inicio debe ser anterior a la fecha de fin', 'error');
    return;
  }

  const nuevaCompeticion = {
    nombre,
    montoPremio: premio,
    fechaInicio,
    fechaFin
  };

  fetch(apiCompeticiones, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaCompeticion)
  }).then(response => {
    if (response.ok) {
      document.getElementById("form-competicion").reset();
      listarCompeticiones();
      mostrarNotificacion('Competición guardada exitosamente', 'success');
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  }).catch(error => {
    console.error('Error al guardar:', error);
    mostrarNotificacion('Error al guardar la competición', 'error');
  });
}

function cargarCompeticionParaEditar(id) {
  fetch(`${apiCompeticiones}/${id}`)
    .then(res => res.json())
    .then(comp => {
      document.getElementById("competicion-nombre").value = comp.nombre;
      document.getElementById("competicion-premio").value = comp.montoPremio;
      document.getElementById("competicion-inicio").value = comp.fechaInicio;
      document.getElementById("competicion-fin").value = comp.fechaFin;
      
      competicionEditandoId = comp.id;
      
      // Cambiar UI para modo edición
      document.getElementById("btn-guardar-competicion").innerHTML = '<i class="fas fa-save"></i> Actualizar Competición';
      document.getElementById("form-title").textContent = "Editar Competición";
      document.getElementById("btn-cancelar").style.display = "flex";
      
      // Scroll al formulario
      document.querySelector('.professional-form-container').scrollIntoView({ 
        behavior: 'smooth' 
      });
    })
    .catch(error => {
      console.error('Error al cargar competición:', error);
      mostrarNotificacion('Error al cargar los datos de la competición', 'error');
    });
}

function actualizarCompeticion() {
  const nombre = document.getElementById("competicion-nombre").value;
  const premio = parseFloat(document.getElementById("competicion-premio").value);
  const fechaInicio = document.getElementById("competicion-inicio").value;
  const fechaFin = document.getElementById("competicion-fin").value;

  // Validar fechas
  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    mostrarNotificacion('La fecha de inicio debe ser anterior a la fecha de fin', 'error');
    return;
  }

  const competicionActualizada = {
    id: competicionEditandoId,
    nombre,
    montoPremio: premio,
    fechaInicio,
    fechaFin
  };

  fetch(`${apiCompeticiones}/${competicionEditandoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(competicionActualizada)
  }).then(response => {
    if (response.ok) {
      cancelarEdicionCompeticion();
      listarCompeticiones();
      mostrarNotificacion('Competición actualizada exitosamente', 'success');
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  }).catch(error => {
    console.error('Error al actualizar:', error);
    mostrarNotificacion('Error al actualizar la competición', 'error');
  });
}

function eliminarCompeticion(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta competición?\n\nEsta acción no se puede deshacer.")) {
    fetch(`${apiCompeticiones}/${id}`, {
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        listarCompeticiones();
        mostrarNotificacion('Competición eliminada exitosamente', 'success');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    }).catch(error => {
      console.error('Error al eliminar:', error);
      mostrarNotificacion('Error al eliminar la competición', 'error');
    });
  }
}

function cancelarEdicionCompeticion() {
  document.getElementById("form-competicion").reset();
  document.getElementById("btn-guardar-competicion").innerHTML = '<i class="fas fa-save"></i> Guardar Competición';
  document.getElementById("form-title").textContent = "Nueva Competición";
  document.getElementById("btn-cancelar").style.display = "none";
  competicionEditandoId = null;
}

// Funciones auxiliares
function obtenerEstadoCompeticion(fechaInicio, fechaFin) {
  const hoy = new Date();
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  if (hoy < inicio) {
    return { texto: 'Próxima', clase: 'status-upcoming' };
  } else if (hoy >= inicio && hoy <= fin) {
    return { texto: 'En Curso', clase: 'status-active' };
  } else {
    return { texto: 'Finalizada', clase: 'status-finished' };
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatearPremio(premio) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(premio);
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
      .notification-info { background: linear-gradient(135deg, #f59e0b, #d97706); }
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