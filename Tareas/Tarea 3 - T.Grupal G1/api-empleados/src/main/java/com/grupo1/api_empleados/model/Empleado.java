package com.grupo1.api_empleados.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Representa a un empleado de la empresa")
public class Empleado {

    @Schema(description = "ID único del empleado", example = "1")
    private Long id;

    @Schema(description = "Nombre completo", example = "Manuel Cruz")
    private String nombre;

    @Schema(description = "Puesto de trabajo", example = "Desarrollador Backend")
    private String puesto;

    @Schema(description = "Salario mensual", example = "5000.0")
    private Double salario;

    public Empleado() {}

    public Empleado(Long id, String nombre, String puesto, Double salario) {
        this.id = id;
        this.nombre = nombre;
        this.puesto = puesto;
        this.salario = salario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPuesto() { return puesto; }
    public void setPuesto(String puesto) { this.puesto = puesto; }

    public Double getSalario() { return salario; }
    public void setSalario(Double salario) { this.salario = salario; }
}