package com.tarea4.demo.controller;

import com.tarea4.demo.dto.ActividadDTO;
import com.tarea4.demo.dto.NotaInput;
import com.tarea4.demo.dto.NotaResumen;
import com.tarea4.demo.service.ActividadService;
import com.tarea4.demo.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ApiController {

    private final ActividadService actividadService;
    private final NotaService notaService;

    public ApiController(ActividadService actividadService, NotaService notaService) {
        this.actividadService = actividadService;
        this.notaService = notaService;
    }
// estable la linea de control de la aplicacion
    // sirve la página HTML
    @GetMapping("/")
    public String inicio() {
        return "index";   // busca templates/index.html
    }

    //  busqueda async para devolver JSON
    @GetMapping("/api/buscar")
    @ResponseBody
    public List<ActividadDTO> buscar(@RequestParam("q") String q) {
        return actividadService.buscar(q);
    }

    // guarda la nota 
    @PostMapping("/api/actividad/{id}/nota")
    @ResponseBody
    public NotaResumen evaluar(@PathVariable("id") Integer id,
                               @Valid @RequestBody NotaInput entrada) {
        return notaService.guardar(id, entrada.nota());
    }
}
