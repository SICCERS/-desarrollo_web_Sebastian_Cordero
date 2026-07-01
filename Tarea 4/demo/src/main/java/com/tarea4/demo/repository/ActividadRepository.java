package com.tarea4.demo.repository;

import com.tarea4.demo.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Integer> {

    @Query("SELECT a FROM Actividad a " +
           "WHERE a.nombre LIKE CONCAT('%', :texto, '%') " +
           "OR a.descripcion LIKE CONCAT('%', :texto, '%') " +
           "OR a.miembro.comuna.nombre LIKE CONCAT('%', :texto, '%')")
    List<Actividad> buscar(@Param("texto") String texto);
}
