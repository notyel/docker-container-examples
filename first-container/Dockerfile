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