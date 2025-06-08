// ---------------------- SISTEMA DE AUTENTICACIÓN Y USUARIOS ----------------------

const apiUsuarios = "http://localhost:8113/api/usuarios";
let usuarioEditandoId = null;
let usuarioActual = null;

// ---------------------- AUTENTICACIÓN / LOGIN ----------------------

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si ya hay una sesión activa
  const usuarioGuardado = sessionStorage.getItem('usuarioActual');
  if (usuarioGuardado) {
    usuarioActual = JSON.parse(usuarioGuardado);
    redirigirSegunRol(usuarioActual.rol);
  } else {
    mostrarFormularioLogin();
  }
});

function mostrarFormularioLogin() {
  const contenedor = document.getElementById("main-content");
  
  contenedor.innerHTML = `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header text-center">
              <h3>Iniciar Sesión</h3>
            </div>
            <div class="card-body">
              <form id="form-login">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" id="login-email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="password" id="login-password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Ingresar</button>
              </form>
              <div id="mensaje-error" class="alert alert-danger mt-3" style="display: none;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    procesarLogin();
  });
}

function procesarLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  
  mostrarCargando(true);
  
  // Obtener todos los usuarios para validar credenciales
  fetch(apiUsuarios)
    .then(res => {
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      return res.json();
    })
    .then(usuarios => {
      // Buscar usuario con email y password coincidentes
      const usuario = usuarios.find(u => u.email === email && u.password === password);
      
      if (usuario) {
        if (usuario.estado !== 'activo') {
          mostrarError('Su cuenta está inactiva. Contacte al administrador.');
          return;
        }
        
        // Login exitoso
        usuarioActual = usuario;
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
        redirigirSegunRol(usuario.rol);
      } else {
        mostrarError('Email o contraseña incorrectos.');
      }
    })
    .catch(error => {
      console.error('Error en login:', error);
      mostrarError('Error de conexión. Intente nuevamente.');
    })
    .finally(() => {
      mostrarCargando(false);
    });
}

function redirigirSegunRol(rol) {
  if (rol === 'admin') {
    window.location.href = 'ViewAdm.html';
  } else if (rol === 'usuario') {
    window.location.href = 'ViewUser.html';
  } else {
    mostrarError('Rol de usuario no válido.');
  }
}

function cerrarSesion() {
  usuarioActual = null;
  sessionStorage.removeItem('usuarioActual');
  window.location.href = 'index.html';
}

// ---------------------- GESTIÓN ADMINISTRATIVA DE USUARIOS ----------------------

function cargarVistaUsuarios() {
  // Solo disponible para administradores
  if (!usuarioActual || usuarioActual.rol !== 'admin') {
    mostrarError('Acceso denegado. Solo administradores.');
    return;
  }

  const contenedor = document.getElementById("usuarios-content");

  contenedor.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Gestión de Usuarios</h3>
      <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
    </div>
    
    <h4>Formulario - Nuevo Usuario</h4>
    <form id="form-usuario" class="mb-4">
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label">Email</label>
          <input type="email" id="usuario-email" class="form-control" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Contraseña</label>
          <input type="password" id="usuario-password" class="form-control" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Rol</label>
          <select id="usuario-rol" class="form-control" required>
            <option value="">Seleccionar...</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Estado</label>
          <select id="usuario-estado" class="form-control" required>
            <option value="">Seleccionar...</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn btn-success mt-3" id="btn-guardar-usuario">Guardar Usuario</button>
      <button type="button" class="btn btn-secondary mt-3" onclick="cancelarEdicion()">Cancelar</button>
    </form>

    <h4>Lista de Usuarios</h4>
    <table class="table table-striped" id="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    
    <div id="mensaje-operacion" class="alert" style="display: none;"></div>
  `;

  listarUsuarios();

  document.getElementById("form-usuario").addEventListener("submit", (e) => {
    e.preventDefault();
    guardarUsuario();
  });
}

function listarUsuarios() {
  fetch(apiUsuarios)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const tbody = document.querySelector("#tabla-usuarios tbody");
      tbody.innerHTML = "";
      
      data.forEach(usuario => {
        const estadoClass = usuario.estado === 'activo' ? 'text-success' : 'text-danger';
        const rolBadge = usuario.rol === 'admin' ? 'badge bg-primary' : 'badge bg-secondary';
        
        tbody.innerHTML += `
          <tr>
            <td>${usuario.id_usuario}</td>
            <td>${usuario.email}</td>
            <td><span class="${rolBadge}">${usuario.rol}</span></td>
            <td><span class="${estadoClass}">${usuario.estado}</span></td>
            <td>
              <button class="btn btn-warning btn-sm me-1" onclick="cargarUsuarioParaEditar(${usuario.id_usuario})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
              ${usuario.estado === 'activo' ? 
                `<button class="btn btn-secondary btn-sm" onclick="cambiarEstadoUsuario(${usuario.id_usuario}, 'inactivo')">Desactivar</button>` :
                `<button class="btn btn-success btn-sm" onclick="cambiarEstadoUsuario(${usuario.id_usuario}, 'activo')">Activar</button>`
              }
            </td>
          </tr>
        `;
      });
    })
    .catch(error => {
      console.error('Error al listar usuarios:', error);
      mostrarMensaje('Error al cargar la lista de usuarios', 'danger');
    });
}

function guardarUsuario() {
  const email = document.getElementById("usuario-email").value;
  const password = document.getElementById("usuario-password").value;
  const rol = document.getElementById("usuario-rol").value;
  const estado = document.getElementById("usuario-estado").value;

  // Validaciones básicas
  if (!validarEmail(email)) {
    mostrarMensaje('Por favor ingrese un email válido', 'warning');
    return;
  }
  
  if (password.length < 6) {
    mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'warning');
    return;
  }

  const usuario = {
    email: email,
    password: password,
    rol: rol,
    estado: estado
  };

  let url = apiUsuarios;
  let metodo = "POST";

  if (usuarioEditandoId !== null) {
    url += `/${usuarioEditandoId}`;
    metodo = "PUT";
    usuario.id_usuario = usuarioEditandoId;
  }

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  })
  .then(res => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  })
  .then(() => {
    mostrarMensaje(
      usuarioEditandoId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente', 
      'success'
    );
    limpiarFormulario();
    listarUsuarios();
  })
  .catch(error => {
    console.error('Error al guardar usuario:', error);
    mostrarMensaje('Error al guardar el usuario', 'danger');
  });
}

function cargarUsuarioParaEditar(id) {
  fetch(`${apiUsuarios}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(usuario => {
      document.getElementById("usuario-email").value = usuario.email;
      document.getElementById("usuario-password").value = usuario.password;
      document.getElementById("usuario-rol").value = usuario.rol;
      document.getElementById("usuario-estado").value = usuario.estado;

      usuarioEditandoId = usuario.id_usuario;

      const boton = document.getElementById("btn-guardar-usuario");
      boton.textContent = "Actualizar Usuario";
      boton.classList.remove("btn-success");
      boton.classList.add("btn-warning");
    })
    .catch(error => {
      console.error('Error al cargar usuario:', error);
      mostrarMensaje('Error al cargar los datos del usuario', 'danger');
    });
}

function eliminarUsuario(id) {
  // Prevenir que el admin se elimine a sí mismo
  if (usuarioActual && usuarioActual.id_usuario === id) {
    mostrarMensaje('No puede eliminar su propio usuario', 'warning');
    return;
  }

  if (confirm("¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
    fetch(`${apiUsuarios}/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      mostrarMensaje('Usuario eliminado exitosamente', 'success');
      listarUsuarios();
    })
    .catch(error => {
      console.error('Error al eliminar usuario:', error);
      mostrarMensaje('Error al eliminar el usuario', 'danger');
    });
  }
}

function cambiarEstadoUsuario(id, nuevoEstado) {
  // Prevenir que el admin se desactive a sí mismo
  if (usuarioActual && usuarioActual.id_usuario === id && nuevoEstado === 'inactivo') {
    mostrarMensaje('No puede desactivar su propio usuario', 'warning');
    return;
  }

  fetch(`${apiUsuarios}/${id}`)
    .then(res => res.json())
    .then(usuario => {
      usuario.estado = nuevoEstado;
      
      return fetch(`${apiUsuarios}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });
    })
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      mostrarMensaje(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`, 'success');
      listarUsuarios();
    })
    .catch(error => {
      console.error('Error al cambiar estado:', error);
      mostrarMensaje('Error al cambiar el estado del usuario', 'danger');
    });
}

function cancelarEdicion() {
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("form-usuario").reset();
  usuarioEditandoId = null;
  
  const boton = document.getElementById("btn-guardar-usuario");
  boton.textContent = "Guardar Usuario";
  boton.classList.remove("btn-warning");
  boton.classList.add("btn-success");
}

// ---------------------- UTILIDADES ----------------------

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function mostrarError(mensaje) {
  const errorDiv = document.getElementById("mensaje-error");
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = "block";
    
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  }
}

function mostrarMensaje(mensaje, tipo) {
  const mensajeDiv = document.getElementById("mensaje-operacion");
  if (mensajeDiv) {
    mensajeDiv.className = `alert alert-${tipo}`;
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = "block";
    
    setTimeout(() => {
      mensajeDiv.style.display = "none";
    }, 3000);
  }
}

function mostrarCargando(mostrar) {
  const botonLogin = document.querySelector('#form-login button[type="submit"]');
  if (botonLogin) {
    if (mostrar) {
      botonLogin.disabled = true;
      botonLogin.textContent = "Verificando...";
    } else {
      botonLogin.disabled = false;
      botonLogin.textContent = "Ingresar";
    }
  }
}

// Función para verificar autenticación en otras páginas
function verificarAutenticacion() {
  const usuarioGuardado = sessionStorage.getItem('usuarioActual');
  if (!usuarioGuardado) {
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(usuarioGuardado);
}

// Función para verificar si es administrador
function esAdministrador() {
  const usuario = verificarAutenticacion();
  return usuario && usuario.rol === 'admin';
}