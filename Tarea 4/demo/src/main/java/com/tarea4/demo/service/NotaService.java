package com.tarea4.demo.service;

import com.tarea4.demo.dto.NotaResumen;
import com.tarea4.demo.model.Nota;
import com.tarea4.demo.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class NotaService {

    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    public NotaResumen guardar(Integer actividadId, Integer valor) {
        Nota nota = new Nota();
        nota.setActividadId(actividadId);
        nota.setNota(valor);
        notaRepository.save(nota);

        return calcularResumen(actividadId);
    }

    private NotaResumen calcularResumen(Integer actividadId) {
        List<Nota> notas = notaRepository.findByActividadId(actividadId);
        int cantidad = notas.size();

        if (cantidad == 0) {
            return new NotaResumen("-", 0);
        }
        int suma = 0;
        for (Nota n : notas) {
            suma += n.getNota();
        }
        double promedio = (double) suma / cantidad;
        String promedioTexto = String.format(Locale.US, "%.1f", promedio);
        return new NotaResumen(promedioTexto, cantidad);
    }
}
