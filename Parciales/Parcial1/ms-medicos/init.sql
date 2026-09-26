CREATE TABLE IF NOT EXISTS medicos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  matricula VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  medico_id INT REFERENCES medicos(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  disponible BOOLEAN DEFAULT TRUE
);
INSERT INTO medicos (nombre, especialidad, matricula) VALUES
('Dr. House', 'Diagnostico', 'MAT001'),
('Dra. Grey', 'Cirugia', 'MAT002'),
('Dr. Strange', 'Neurologia', 'MAT003'),
('Dra. Quinn', 'Medicina General', 'MAT004');
INSERT INTO horarios (medico_id, fecha, hora, disponible) VALUES
(1, '2025-01-10', '09:00', TRUE),
(1, '2025-01-10', '10:00', TRUE),
(2, '2025-01-11', '11:00', TRUE),
(3, '2025-01-12', '14:00', TRUE),
(4, '2025-01-13', '08:00', TRUE);
