\# Práctica 4 — GraphQL y BFF



\## Servicios



\- REST (Práctica 3): http://localhost:3003

\- GraphQL (Práctica 4): http://localhost:4000



\## Cómo levantar



\### 1) REST Práctica 3

cd ../practica3/practica3-rest

docker compose up -d



\### 2) MySQL Práctica 4

docker run --name mysql-p4 -e MYSQL\_ROOT\_PASSWORD=root -e MYSQL\_DATABASE=practica4\_ventas -p 3306:3306 -d mysql:8



\### 3) GraphQL Práctica 4

npm install

node src/servidor.js



\## Estructura

\- src/esquema.js — contrato GraphQL

\- src/resolvers.js — resolvers contra MySQL y REST

\- src/cargadores.js — DataLoader para evitar N+1

\- src/db.js — pool MySQL con contador de consultas

\- db/ — script SQL de la base

\- informe/comparacion.md — comparación REST vs GraphQL

