package com.grupo1.api_empleados.controller;

import com.grupo1.api_empleados.model.Empleado;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@Controller
public class EmpleadoGraphQLController {

    private final List<Empleado> empleados = new ArrayList<>();
    private Long contadorId = 3L;

    public EmpleadoGraphQLController() {
        empleados.add(new Empleado(1L, "Manuel Cruz", "Backend Dev", 5000.0));
        empleados.add(new Empleado(2L, "Richard Chavez", "Frontend Dev", 4500.0));
    }

    @QueryMapping
    public List<Empleado> empleados() {
        return empleados;
    }

    @QueryMapping
    public Empleado empleado(@Argument Long id) {
        return empleados.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @MutationMapping
    public Empleado crearEmpleado(@Argument String nombre,
                                  @Argument String puesto,
                                  @Argument Float salario) {
        Empleado nuevo = new Empleado(contadorId++, nombre, puesto, salario.doubleValue());
        empleados.add(nuevo);
        return nuevo;
    }
}