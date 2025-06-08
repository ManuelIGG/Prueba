package com.vdg.controllers;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vdg.entidades.Calificacion;
import com.vdg.entidades.Usuario;
import com.vdg.entidades.Videojuego;
import com.vdg.repository.CalificacionRepository;
import com.vdg.repository.UsuarioRepository;
import com.vdg.repository.VideojuegoRepository;

@RestController
@RequestMapping("/api/calificaciones")
@CrossOrigin(origins = "*") // Puedes ajustar esto según tu front
public class CalificacionController {

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    // Obtener todas las calificaciones
    @GetMapping
    public List<Calificacion> getAll() {
        return calificacionRepository.findAll();
    }

    // Obtener calificaciones por videojuego
    @GetMapping("/videojuego/{idVideojuego}")
    public List<Calificacion> getByVideojuego(@PathVariable Integer idVideojuego) {
        Optional<Videojuego> videojuego = videojuegoRepository.findById(idVideojuego);
        return videojuego.map(calificacionRepository::findByVideojuego).orElse(null);
    }

    // Obtener calificaciones por usuario
    @GetMapping("/usuario/{idUsuario}")
    public List<Calificacion> getByUsuario(@PathVariable Integer idUsuario) {
        Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
        return usuario.map(calificacionRepository::findByUsuario).orElse(null);
    }

    // Agregar nueva calificación
    @PostMapping
    public Calificacion crearCalificacion(@RequestParam Integer idUsuario,
                                          @RequestParam Integer idVideojuego,
                                          @RequestBody Calificacion calificacion) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Videojuego videojuego = videojuegoRepository.findById(idVideojuego)
                .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));

        calificacion.setUsuario(usuario);
        calificacion.setVideojuego(videojuego);
        calificacion.setFechaDeComentario(new Date());

        return calificacionRepository.save(calificacion);
    }

    // Eliminar calificación
    @DeleteMapping("/{id}")
    public void eliminarCalificacion(@PathVariable Integer id) {
        calificacionRepository.deleteById(id);
    }
}