# Relámpago Node

Base lista para abrir en VS Code y continuar el desarrollo del sistema de gestión del aspirante.

## Pasos

1. Copia `.env.example` como `.env`
2. Coloca tu contraseña real en `DB_PASSWORD`
3. Instala dependencias:
   - `npm install`
4. Ejecuta:
   - `npm run dev`
5. Abre:
   - `http://localhost:3000`

## Base de datos

Esta base usa SQL Server y espera que ya exista la base `RelampagoDB` con las tablas que validaste.

## Roles esperados en tabla Usuario

- Aspirante
- Encargado
- Director
- Administrador

## Importante

Si las contraseñas de la tabla `Usuario` están en texto plano, el login funcionará igual.
Si luego deseas seguridad real, puedes guardar `clave` con bcrypt.
"# proyecto_relampago" 
