package com.vdg.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vdg.entidades.Videojuego;
import com.vdg.repository.VideojuegoRepository;

@RestController
@RequestMapping("/api/videojuegos")
@CrossOrigin(origins = "*")

public class VideojuegoController {

    @Autowired
    private VideojuegoRepository videojuegoRepository;

    // Obtener todos los videojuegos
    @GetMapping
    public List<Videojuego> obtenerTodos() {
        return videojuegoRepository.findAll();
    }

    // Obtener videojuego por ID
    @GetMapping("/{id}")
    public ResponseEntity<Videojuego> obtenerPorId(@PathVariable Integer id) {
        Optional<Videojuego> optional = videojuegoRepository.findById(id);
        return optional.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo videojuego
    @PostMapping
    public Videojuego crear(@RequestBody Videojuego videojuego) {
        return videojuegoRepository.save(videojuego);
    }

    // Actualizar videojuego existente
    @PutMapping("/{id}")
    public ResponseEntity<Videojuego> actualizar(@PathVariable Integer id, @RequestBody Videojuego videojuegoActualizado) {
        return videojuegoRepository.findById(id)
                .map(videojuego -> {
                    videojuego.setTitulo(videojuegoActualizado.getTitulo());
                    videojuego.setFechaLanzamiento(videojuegoActualizado.getFechaLanzamiento());
                    videojuego.setImagen(videojuegoActualizado.getImagen());
                    videojuego.setEnlaced(videojuegoActualizado.getEnlaced());
                    videojuego.setGenero(videojuegoActualizado.getGenero());
                    videojuego.setEstado(videojuegoActualizado.getEstado());
                    return ResponseEntity.ok(videojuegoRepository.save(videojuego));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Eliminar videojuego
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminar(@PathVariable Integer id) {
        return videojuegoRepository.findById(id)
                .map(videojuego -> {
                    videojuegoRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}