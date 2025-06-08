package com.vdg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vdg.entidades.Videojuego;

@Repository
public interface VideojuegoRepository extends JpaRepository<Videojuego, Integer> {
    
}