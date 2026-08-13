// ============================================
// practica1-Cruz.js
// Parte B - Ejercicios B1 a B32
// ============================================

// --- RESET INICIAL ---
load("seed.js");

// ============================================
// B1 – B18: CONSULTAS
// ============================================

// B1. Mostrar productos de categoría 2 o 7, solo nombre y precio, sin _id
db.productos.find({ categoria: { $in: [2, 7] } }, { nombre: 1, precio: 1, _id: 0 });

// B2. Mostrar productos con precio entre 100 y 300 (incluidos)
db.productos.find({ precio: { $gte: 100, $lte: 300 } });

// B3. Mostrar productos que no están activos
db.productos.find({ activo: false });

// B4. Mostrar productos cuyo nombre empiece con A o C
db.productos.find({ nombre: { $regex: /^[AC]/ } });

// B5. Mostrar productos que tienen el campo variantes
db.productos.find({ variantes: { $exists: true } });

// B6. Mostrar productos donde stock_minimo es texto
db.productos.find({ stock_minimo: { $type: "string" } });

// B7. Mostrar los 4 productos con más stock (nombre y stock)
db.productos.find({}, { nombre: 1, stock: 1, _id: 0 }).sort({ stock: -1 }).limit(4);

// B8. Mostrar la segunda página de 4, ordenado por nombre ascendente
db.productos.find({}, { nombre: 1, _id: 0 }).sort({ nombre: 1 }).skip(4).limit(4);

// B9. Mostrar productos con etiqueta "organico" o "artesania"
db.productos.find({ etiquetas: { $in: ["organico", "artesania"] } });

// B10. Mostrar productos con array categorias de exactamente 1 elemento
db.productos.find({ categorias: { $size: 1 } });

// B11. Menos de 10 unidades en almacén La Paz (sin $elemMatch)
db.productos.find({ "inventario.almacen": "La Paz", "inventario.cantidad": { $lt: 10 } });

// B11. Menos de 10 unidades en almacén La Paz (con $elemMatch)
db.productos.find({ inventario: { $elemMatch: { almacen: "La Paz", cantidad: { $lt: 10 } } } });

// B12. Mostrar productos cuya primera categoría sea 1
db.productos.find({ "categorias.0": 1 });

// B13. Mostrar productos registrados durante el año 2025
db.productos.find({ registrado: { $gte: ISODate("2025-01-01"), $lt: ISODate("2026-01-01") } });

// B14. Contar cuántos productos están activos
db.productos.countDocuments({ activo: true });

// B15. Mostrar pedidos de Sucre con total mayor a 300
db.pedidos.find({ ciudad: "Sucre", total: { $gt: 300 } });

// B16. Mostrar pedidos que incluyan el código "ALM-005"
db.pedidos.find({ "items.codigo": "ALM-005" });

// B17. Mostrar pedidos con más de un ítem (existe posición 1 del array)
db.pedidos.find({ "items.1": { $exists: true } });

// B18. Mostrar lista de clientes distintos
db.pedidos.distinct("cliente");


// ============================================
// B19 – B22: CREACIÓN
// ============================================
// (No se resetea porque los inserts se acumulan sobre los datos actuales)

// B19. Insertar un producto con array, subdocumento y array de subdocumentos
db.productos.insertOne({
    codigo: "NUE-001",
    nombre: "Tejido de lana",
    precio: 150,
    stock: 10,
    etiquetas: ["lanar", "artesania"],
    medidas: { alto: 30, ancho: 20, unidad: "cm" },
    inventario: [ { almacen: "Sucre", cantidad: 10 } ]
});

// B20. Insertar tres productos en una sola instrucción
db.productos.insertMany([
    { codigo: "NUE-002", nombre: "Producto 2", precio: 50, stock: 5 },
    { codigo: "NUE-003", nombre: "Producto 3", precio: 80, stock: 8 },
    { codigo: "NUE-004", nombre: "Producto 4", precio: 120, stock: 12 }
]);

// B21. Insertar un pedido con _id 7, con dos ítems
db.pedidos.insertOne({
    _id: 7,
    cliente: "Pedro Choque",
    ciudad: "Tarija",
    estado: "pendiente",
    items: [
        { codigo: "BEB-004", cantidad: 2, precio: 95 },
        { codigo: "ART-010", cantidad: 1, precio: 1250 }
    ],
    total: 1440,
    fecha: new Date()
});

// B22. Insertar producto sin precio y contar cuántos no tienen precio
db.productos.insertOne({ codigo: "SIN-001", nombre: "Test sin precio", stock: 5 });
db.productos.countDocuments({ precio: { $exists: false } });


// ============================================
// B23 – B28: ACTUALIZACIÓN
// ============================================
// --- RESET ANTES DE ACTUALIZAR ---
load("seed.js");

// B23. Subir 10% el precio de categoría 4
db.productos.updateMany({ categoria: 4 }, { $mul: { precio: 1.1 } });
// Verificar el precio del poncho (TEX-012) para la explicación
db.productos.find({ codigo: "TEX-012" }, { precio: 1, _id: 0 });

// B24. Pasar pedidos "enviado" a "entregado" y registrar fecha
db.pedidos.updateMany(
    { estado: "enviado" },
    { $set: { estado: "entregado" }, $currentDate: { fecha_entrega: true } }
);

// B25. Agregar etiqueta "liquidacion" a inactivos sin duplicar
db.productos.updateMany({ activo: false }, { $addToSet: { etiquetas: "liquidacion" } });

// B26. Borrar stock_minimo solo donde es texto y verificar
db.productos.updateMany({ stock_minimo: { $type: "string" } }, { $unset: { stock_minimo: "" } });
db.productos.find({ stock_minimo: { $type: "string" } });

// B27. Agregar almacén "Camiri" con 5 unidades a ALM-011
db.productos.updateOne({ codigo: "ALM-011" }, { $push: { inventario: { almacen: "Camiri", cantidad: 5 } } });

// B28. Upsert: actualizar BEB-030 si existe, crearlo si no
db.productos.updateOne(
    { codigo: "BEB-030" },
    { $set: { nombre: "Bebida de prueba", precio: 40, stock: 25 } },
    { upsert: true }
);


// ============================================
// B29 – B32: ELIMINACIÓN
// ============================================
// --- RESET ANTES DE ELIMINAR ---
load("seed.js");

// B29. Contar pedidos cancelados y luego borrarlos
db.pedidos.countDocuments({ estado: "cancelado" });
db.pedidos.deleteMany({ estado: "cancelado" });

// B30. Eliminar un solo producto con etiqueta "textil"
db.productos.deleteOne({ etiquetas: "textil" });

// B31. Eliminar productos con stock menor a 5
db.productos.deleteMany({ stock: { $lt: 5 } });

// B32. Restaurar y verificar conteos finales
load("seed.js");
db.productos.countDocuments();
db.pedidos.countDocuments();

// ============================================
// FIN DEL ARCHIVO
// ============================================