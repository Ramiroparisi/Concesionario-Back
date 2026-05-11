# Proyecto desplegado
El proyecto Parisi Motors se encuentra desplegado en producción, a continuación adjunto los links:

Para la Aplicación web (Frontend) se ha utilizado vercel: https://concesionario-front-navy.vercel.app/
Para la Api (Backend) y la base de datos se ha utilizado Railway: https://concesionario-back-production.up.railway.app

# Para realizar el despliegue local
**Primero se debe inicializar el backend**
Documentación para el despliegue local del frontend: https://github.com/Ramiroparisi/concesionario-front/blob/main/README.md

## Backend
Link al repositorio: https://github.com/Ramiroparisi/Concesionario-Back

### Requisitos
* [Node.js](https://nodejs.org/) (v18 o superior)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Para la base de datos MySQL)
* Git

### Ejecución

#### Base de Datos (Docker)
El proyecto incluye un archivo `docker-compose.yml`.
1. Abrir una terminal en la carpeta raíz del **Backend**.
2. Ejecutar el siguiente comando para levantar el contenedor de MySQL:
   ```bash
   docker compose up -d

 #### Backend
1. Instalar las dependencias con el comando: npm install
2. Crear un archivo .env en la raiz con las siguientes variables:
NODE_ENV=development <br>
PORT=3000 <br>
FRONTEND_URL=http://localhost:3001 <br>
MYSQLHOST=127.0.0.1 <br>
MYSQLPORT=3306 <br>
MYSQLUSER=root <br>
MYSQLPASSWORD=root <br>
MYSQLDATABASE=concesionario <br>
JWT_SECRET=ingresa_clave_secreta <br>
MP_ACCESS_TOKEN=TEST-c105d0c7-bf5a-46f0-b129-9290a12c712a <br>
3. Iniciar el servidor: npm run start:dev
```
### Entorno
Una vez incializado, el entorno del backend se encuentra en [http://localhost:3000](http://localhost:3000) y se debe inicializar el frontend posteriormente.
