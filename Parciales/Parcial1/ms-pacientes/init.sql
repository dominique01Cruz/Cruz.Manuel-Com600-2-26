CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ci VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(20),
  seguro VARCHAR(100)
);
INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES
('12345678', 'Juan', 'Perez', '1980-05-10', '591-1234', 'Seguro A'),
('87654321', 'Maria', 'Gomez', '1990-08-20', '591-5678', 'Seguro B'),
('11111111', 'Carlos', 'Lopez', '1975-12-01', '591-9012', 'Seguro C'),
('22222222', 'Ana', 'Martinez', '2000-03-15', '591-3456', 'Seguro A'),
('33333333', 'Luis', 'Rodriguez', '1985-07-25', '591-7890', 'Seguro B');
