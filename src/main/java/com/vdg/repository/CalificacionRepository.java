package com.vdg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vdg.entidades.Calificacion;
import com.vdg.entidades.Usuario;
import com.vdg.entidades.Videojuego;

public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    List<Calificacion> findByVideojuego(Videojuego videojuego);
    List<Calificacion> findByUsuario(Usuario usuario);
}