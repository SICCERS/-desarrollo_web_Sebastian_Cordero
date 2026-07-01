package com.tarea4.demo.dto;

public record ActividadDTO(
    Integer id,
    String nombre,
    String descripcion,
    String dia,
    String tipo,
    String miembro,
    String comuna,
    String promedio,
    Integer cantidad
) {}
