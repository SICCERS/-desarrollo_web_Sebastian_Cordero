package com.tarea4.demo.service;

import com.tarea4.demo.dto.ActividadDTO;
import com.tarea4.demo.model.Actividad;
import com.tarea4.demo.model.Nota;
import com.tarea4.demo.repository.ActividadRepository;
import com.tarea4.demo.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;
    private final NotaRepository notaRepository;

    public ActividadService(ActividadRepository actividadRepository,
                            NotaRepository notaRepository) {
        this.actividadRepository = actividadRepository;
        this.notaRepository = notaRepository;
    }

    public List<ActividadDTO> buscar(String texto) {
        List<Actividad> actividades = actividadRepository.buscar(texto);
        List<ActividadDTO> resultado = new ArrayList<>();

        for (Actividad a : actividades) {
            List<Nota> notas = notaRepository.findByActividadId(a.getId());
            String promedio = calcularPromedio(notas);
            int cantidad = notas.size();

            String nombreMiembro = a.getMiembro().getNombre();
            String nombreComuna = a.getMiembro().getComuna().getNombre();

            ActividadDTO dto = new ActividadDTO(
                a.getId(),
                a.getNombre(),
                a.getDescripcion(),
                a.getDia(),
                a.getTipo(),
                nombreMiembro,
                nombreComuna,
                promedio,
                cantidad
            );
            resultado.add(dto);
        }
        return resultado;
    }

    private String calcularPromedio(List<Nota> notas) {
        if (notas.isEmpty()) {
            return "-";
        }
        int suma = 0;
        for (Nota n : notas) {
            suma += n.getNota();
        }
        double promedio = (double) suma / notas.size();
        return String.format(Locale.US, "%.1f", promedio);
    }
}
