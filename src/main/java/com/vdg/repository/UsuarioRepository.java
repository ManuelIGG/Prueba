package com.vdg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vdg.entidades.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
}