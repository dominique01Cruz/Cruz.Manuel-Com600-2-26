# Crear
mutation {
  crearTrabajador(input: {
    nombre: "Juan", apellido: "Pérez",
    cedula: "12345678", cargo: "Dev",
    departamento: "TI", fechaIngreso: "2024-01-15"
  }) { id nombre }
}

# Consultar todos
query { obtenerTrabajadores { id nombre cedula cargo } }

# Actualizar
mutation {
  actualizarTrabajador(id: "ID", input: { cargo: "Senior" }) { id cargo }
}

# Eliminar
mutation { eliminarTrabajador(id: "ID") }