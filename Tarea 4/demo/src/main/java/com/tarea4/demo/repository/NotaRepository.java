package com.tarea4.demo.repository;

import com.tarea4.demo.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    List<Nota> findByActividadId(Integer actividadId);
}
