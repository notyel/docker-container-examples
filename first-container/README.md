# Contenedor Docker para una Aplicación Express (Node.js) con MongoDB

Este documento proporciona instrucciones para configurar una aplicación Express con MongoDB dentro de un contenedor Docker y realizar pruebas en el sitio web resultante.

Se detalla el proceso de creación y ejecución del contenedor Docker, así como la instalación de dependencias y la configuración de la aplicación Express. Además, se describen las rutas disponibles en el sitio web, incluyendo la lista de animales y la creación de un perro con estado Ladrando.

Para obtener detalles completos sobre cada paso, consulta la sección correspondiente en la documentación completa.


## Pasos para Crear y Ejecutar contenedor

### 1. Crear el Contenedor Docker

Para crear el contenedor **Docker** que ejecutará nuestra aplicación **Express** con **MongoDB**, utilizamos el siguiente comando:

```bash
docker create -p 27017:27017 --name demo-mongo -e MONGO_INITDB_ROOT_USERNAME=leyton -e MONGO_INITDB_ROOT_PASSWORD=abc123456 mongo
```
Este comando crea un contenedor **Docker** llamado `demo-mongo`, exponiendo el puerto **27017** para **MongoDB**. También establece las variables de entorno para el nombre de usuario (`MONGO_INITDB_ROOT_USERNAME`) y la contraseña (`MONGO_INITDB_ROOT_PASSWORD`) de **MongoDB**.

### 2. Validar si el Contenedor se Creó Correctamente

Puedes verificar si el contenedor se creó correctamente ejecutando el siguiente comando:

```bash
docker ps -a
```

Esto mostrará una lista de todos los contenedores **Docker** en tu sistema, incluido el que acabas de crear. Verifica que el estado del contenedor `demo-mongo` sea `created`.

### 3. Arrancar el Contenedor Docker

Para arrancar el contenedor **Docker** que contiene **MongoDB**, utiliza el siguiente comando:

```bash
docker start demo-mongo
```

Esto iniciará el contenedor `demo-mongo`, lo que permitirá que tu aplicación **Express** se conecte a la base de datos **MongoDB**.

---

## Pasos para Configurar y Ejecutar la Aplicación Express

### 1. Preparación del Entorno

Antes de comenzar, asegúrate de tener **Node.js** y **npm** instalados en tu sistema. Si no los tienes instalados, puedes descargarlos e instalarlos desde [nodejs.org](https://nodejs.org/).

Además, crea una carpeta en la ruta de tu preferencia para tu proyecto.

### 2. Creación del Archivo `index.js`

Dentro de la carpeta de tu proyecto, crea una carpeta llamada `src` y dentro de ella un archivo llamado `index.js`. Abre este archivo con tu editor de código preferido y copia el siguiente código en él:  

```JavaScript
import express from 'express';
import mongoose from 'mongoose';

// Conectar a la base de datos
mongoose.connect('mongodb://leyton:abc123456@localhost:27017/miapp?authSource=admin')
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir el esquema del modelo
const animalSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  estado: { type: String, required: true },
});

const Animal = mongoose.model('Animal', animalSchema);

const app = express();

// Middleware para análisis de JSON
app.use(express.json());

// Ruta para listar animales
app.get('/', async (_req, res) => {
  try {
    console.log('Listando animales...');
    const animales = await Animal.find();

    return res.json(animales);
  } catch (error) {
    console.error('Error al obtener animales:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para crear un nuevo animal
app.get('/crear', async (_req, res) => {
  try {
    const nuevoAnimal = await Animal.create({ tipo: 'Perro', estado: 'Ladrando' })
    return res.status(201).json(nuevoAnimal);
  } catch (error) {
    console.error('Error al crear animal:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

```

### 3. Instalación de Dependencias

Una vez que tengas tu carpeta de proyecto lista, junto con el archivo `index.js`, abre una terminal y navega hasta el directorio de tu proyecto. Luego, ejecuta el siguiente comando para instalar las dependencias de la aplicación:

```bash
npm install express mongoose
```
Este comando instalará las dependencias necesarias, incluyendo **Express** y **Mongoose**, en tu proyecto.


### 4. Ejecución de la Aplicación

Para ejecutar la aplicación **Express**, simplemente ejecuta el siguiente comando en la terminal desde el directorio de tu proyecto:  

```bash
node src/index.js
```

Esto iniciará tu **Servidor Express** y estará listo para procesar solicitudes en `http://localhost:3000/`.


### 5. Pruebas del Sitio en el Puerto 3000

El sitio web está configurado para ejecutarse en el puerto 3000. Aquí se describen las diferentes rutas y sus funcionalidades:

## Ruta para Listar Animales

- **URL:** [http://localhost:3000/](http://localhost:3000/)
- **Descripción:** Esta ruta muestra una lista de animales almacenados en la base de datos.
- **Método HTTP:** GET
- **Resultado Esperado:** Se espera que esta ruta muestre una lista de todos los animales almacenados en la base de datos.

## Ruta para Crear un Perro con Estado Feliz

- **URL:** [http://localhost:3000/crear](http://localhost:3000/crear)
- **Descripción:** Esta ruta crea un nuevo animal con el tipo "Perro" y el estado "Ladrando" en la base de datos.
- **Método HTTP:** GET
- **Resultado Esperado:** Se espera que esta ruta cree un nuevo animal con el tipo "Perro" y el estado "Ladrando" en la base de datos.

Para probar estas rutas, asegúrate de que el servidor esté en funcionamiento y visita las URLs proporcionadas en tu navegador web o utilizando herramientas como Postman.

**¡Y eso es todo!** Con estos pasos, tendrás tu aplicación Express ejecutándose en un contenedor **Docker** con **MongoDB** y estarás listo para desarrollar y probar tu aplicación.

---

## Contenerización de una Aplicación Express con MongoDB en Docker

Para contenerizar nuestra aplicación Express con MongoDB en Docker, seguiremos estos pasos:

1. **Creación del Dockerfile**: Vamos a crear un archivo llamado `Dockerfile` en el directorio raíz de nuestro proyecto. Este archivo contendrá las instrucciones necesarias para construir nuestra imagen de contenedor.

2. **Configuración del Dockerfile**: En el Dockerfile, especificaremos las instrucciones para crear una imagen que contenga nuestra aplicación Express con MongoDB. Utilizaremos la misma sintaxis que antes:

<p align="center">
  <img src="screenshots/Screenshot_1.png" alt="Estructura de carpetas con el archivo Dockerfile" />
</p>

```Dockerfile
# Utiliza la imagen base de Node.js versión 20
FROM node:20

# Crea un directorio llamado "app" en la ruta "/home" dentro del contenedor
RUN mkdir -p /home/app

# Copia todos los archivos del directorio actual (incluyendo index.js) al directorio "/home/app" dentro del contenedor
COPY . /home/app

# Expone el puerto 3000 del contenedor para permitir conexiones entrantes
EXPOSE 3000

# Define el comando predeterminado para ejecutar cuando se inicia el contenedor, que es ejecutar el archivo index.js usando Node.js
CMD ["node", "/home/app/src/index.js"]
```

3. **Construcción de la Imagen**: Una vez que hayamos creado el Dockerfile, utilizaremos el comando `docker build` para construir nuestra imagen de contenedor. Asegúrate de ejecutar este comando desde el directorio que contiene el Dockerfile.

```bash
docker build -t nombre_imagen .
```

4. **Creación y Ejecución del Contenedor**: Finalmente, utilizaremos el comando `docker run` para crear y ejecutar un contenedor basado en la imagen que acabamos de construir.

```bash
docker run -d -p 3000:3000 nombre_imagen
```

Este comando crea un contenedor a partir de la imagen especificada, lo ejecuta en segundo plano (`-d`), y mapea el puerto 3000 del contenedor al puerto 3000 del host (`-p 3000:3000`).

---

## Comparativa Dockerfile vs Docker Compose

Teniendo claro que es y como se construye *dockerfile*, vamos a hablar un poco acerca de `docker-compose`. *Docker compose*, es una herramienta que nos permite facilitar el uso de docker, obteniendo como resultado un **conjunto de scripts que nos facilitan la construcción de nuestros servicios**. La mayor ventaja de este es que podemos crear **diferentes contenedores y por cada contenedor diferentes servicios**. ¿Como es esto? Vamos a ver.

*Docker compose* nos provee un esquema para indicarle al *engine* realizar **determinadas tareas escritas en lenguaje** *yaml*. Para colocarlo en términos más claros, el *dockerfile* define como crear la imagen de una aplicación, en cambio el *docker compose* nos permite **vincular y configurar estos contenedores en conjunto** para construir varios servicios.

En el siguiente ejemplo veremos dos contenedores, **uno de mogo y otro con Node js** definido previamente:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo
  mongo:
    image: mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: leyton
      MONGO_INITDB_ROOT_PASSWORD: abc123456
    ports:
      - "27017:27017"
```

Para explicar:

- Definimos dos servicios: `app` para tu aplicación Node.js y `mongo` para la base de datos MongoDB.
- En el servicio `app`, especificamos `build: .` para construir la imagen utilizando el Dockerfile presente en el directorio actual.
- Mapeamos el puerto 3000 de la máquina host al puerto 3000 del contenedor `app` para permitir conexiones entrantes.
- Establecemos dependencia entre los servicios `app` y `mongo` usando `depends_on` para asegurar que MongoDB se inicie antes de que la aplicación intente conectarse.
- En el servicio `mongo`, utilizamos la imagen oficial de MongoDB.
- Establecemos las credenciales de usuario y contraseña para la base de datos MongoDB utilizando las variables de entorno `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD`.
- Mapeamos el puerto 27017 de la máquina host al puerto 27017 del contenedor `mongo` para permitir conexiones a la base de datos.

---

Para ejecutar el archivo `docker-compose.yml`, puedes utilizar los siguientes comandos:

- `docker-compose up`: Levanta todos los contenedores definidos en el archivo `docker-compose.yml`.
- `docker-compose down`: Detiene y elimina todos los contenedores definidos en el archivo `docker-compose.yml`.
- `docker-compose up -d`: Levanta todos los contenedores en segundo plano (modo detached).
- `docker-compose logs`: Muestra los logs de todos los contenedores definidos en el archivo `docker-compose.yml`.
- `docker-compose ps`: Muestra el estado de todos los servicios definidos en el archivo `docker-compose.yml`.


---


Para ejecutar este archivo `docker-compose.yml`, sigue estos pasos:

1. Abre una terminal.
2. Navega al directorio donde está ubicado tu archivo `docker-compose.yml`.
3. Ejecuta el siguiente comando para iniciar los servicios definidos en el archivo:

```bash
docker-compose up
```