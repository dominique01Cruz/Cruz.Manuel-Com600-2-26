package com.grupo1.api_empleados.controller;

import com.grupo1.api_empleados.model.Empleado;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@Tag(name = "Empleados", description = "API REST para gestión de empleados")
public class EmpleadoController {

    private final List<Empleado> empleados = new ArrayList<>();

    public EmpleadoController() {
        empleados.add(new Empleado(1L, "Manuel Cruz", "Backend Dev", 5000.0));
        empleados.add(new Empleado(2L, "Richard Chavez", "Frontend Dev", 4500.0));
    }

    @GetMapping
    @Operation(summary = "Listar todos los empleados")
    public List<Empleado> listar() {
        return empleados;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un empleado por ID")
    public Empleado obtener(@PathVariable Long id) {
        return empleados.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo empleado")
    public Empleado crear(@RequestBody Empleado empleado) {
        empleados.add(empleado);
        return empleado;
    }
}