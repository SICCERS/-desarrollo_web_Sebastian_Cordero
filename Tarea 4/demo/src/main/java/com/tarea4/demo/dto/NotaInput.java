package com.tarea4.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NotaInput(
    @NotNull(message = "La nota es obligatoria")
    @Min(value = 1, message = "La nota mínima es 1")
    @Max(value = 7, message = "La nota máxima es 7")
    Integer nota
) {}
