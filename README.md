# Radio Entre-Piernas

Un gestor de contenidos creado "from scratch" para el proyecto Radio EntrePiernas.
Para ver una maqueta del sitio dirigirse a los siguientes links:

*[Vista de una maqueta de Landing-Page](https://radioentrepiernas3.imfast.io/)

*[Vista de una maqueta página de contenidos de contenidos](https://contents.imfast.io/)

*[Maquetas realizadas en Figma](https://www.figma.com/file/1vnqesP5XAjm795tbxnR1c/Radio-Ep-dark-Theme)


## Instalación

Pre-requisitos: tener instalado NodeJS, NPM, MongoDB y NginX, así como correr Debian9 como sistema operativo.

1. Descargar repositorio desde https://github.com/LautaroJayat/radio-ep.git

2. Crear un archivo "**.env**" que estará oculto y llenarlo con las variables de entorno: 
    ``` 
    SUPER_USER=tu_usuario_secreto
    SUPER_PASS=tu_contraseña_super_secreta
    ```
Ambas serán las contraseñas de emergencia (por si se extravían las contraseñas de administrador) y al mismo tiempo serán las contraseñas que permitirán la creación del primer usuario admin en la ruta de login.
Se recomienda usar tanto usuario y contraseñas complicadas, en lo posible encriptados con sha2.

3. Copiar el archivo "**radioep.service**" en la carpeta `/etc/systemd/system`, abrirlo y cambiar el usuario con el que se va a ejecutar el *service*.

4. Correr `sudo systemctl daemon-reload` para actualizar los demonios.

5. Copiar el archivo "**radioep.conf**" en la carpeta `/etc/nginx/conf.d` y quitar cualquier archivo que contenga la instrucción "default_server"

6. Ir a `/tuDirectorio/radio-ep/src`, abrir una terminal y correr `sudo npm run build` para instalar todas las dependencias necesarias.

7. Correr `sudo systemctl radioep start`

Si todo ha salido bien, tanto NxinX como mongoDB deberían correr y luego de 6 segundos debería inicializarse el servidor de NodeJS.

Para comenzar a crear usuarios se recomienda hacer login con el usuario guardado en las variables de entorno. Esto generará un primer usuario al que luego puede cambiarsele la contraseña y el nombre de usuario, éste será el único usuario con privilegios de administrador, esto es:
    * Podrá crear acceder a todo lo creado por los demas usuarios y modificarlo.

    * Podrá cambiar los datos de los demás usuarios.

    * Podrá crear emisiones, columnas y agregar id de videos para el video random de la página de contents.
    


## Objetivo del Proyecto

El objetivo de éste proyecto es la creación de un gestor de contenidos, al estilo Wordpress, basado en NodeJs, Express, Express-handlebars, y MongoDB.

Este mismo deberá actuar como motor del medio virtual Radio Entre-Piernas, proveyendo los servicios de portal de noticias y diferentes secciones al estilo de biblioteca de podcasts y segmentos elegidos de los mismos.

El servidor está programado para proveer un sistema de gestión a partir de usuarios con diferentes roles y privilegios.

## Implementaciones

### Sesiones
Las sesiones están gestionadas mediante Express-Sessions. (TO DO: Cutomizar las sessiones seteando el max-age de las cookies. Pensar la posibilidad de abrir un canal mediante web-sockets y un set-time-out para registrar un periodo prolongado de inactividad que pudiera ser dudoso y automatizar los log-out en esos casos).

### Contenido Dinámico
La mayor parte de los html se generan mediante Express-Handlebars, lo que permite la interacción de los usuarios a través de End-Points que gatillan funciones en el servidor, haciendo consultas a la base de datos y usando los resultados para crear las diferentes vistas.

Si bien esto simplifica gran parte del código, también es cierto que es una tecnología que pone gran parte del trabajo del lado del servidor, a diferencia de otras tecnologías como Angular o React, en la que la renderización del contenido se hace del lado del cliente.
Esta misma situación nos obliga a la implementación de algún tipo de estrategia de Cacheo.

### Cache
Por el tipo de funcionamiento del servidor, decidimos crear un sistema simple de cacheo en la memoria. El mismo se rellena después de la primera consula a la base de datos que se realiza cuando el primer usuario llega a la landing-page. Los objetos provenientes de la base de datos se guardan dentro de unas variables éspecíficas creadas en el archivo HOME_CACHE.js. Ante cada edición, eliminación o creación de contenido, las mismas rutas y funciones que realizan esos procesos también manejan la gestión de los elementos del caché, manteniendolo siempre listo para proveer el contenido más nuevo y ahorrar consultas a la base de datos.

### Compresión de las fotos:
El gestor de contenidos implementa el paquete ImageMinRecompress para comprir las imágenes una vez que se envian al servidor. De la misma forma también utiliza una implementación de la librería Cropper.js para su recorte y adecuación. (Citar las fuentes y sus git)

### TO DO:
* Modificar radioep.conf para que NginX sirva los archivos estáticos y evitar que nodeJS lo haga.
* Terminar la implementación de las diferentes vistas.
* Terminar el saneamiento de los formularios para prevenir XSS (del lado del usuario y del lado del servidor).
* Crear Servicio de Mailing.
* Crear un load-balancer con NginX y pensar la conveniencia de implementar PM2 o SystemD.
* Crear Contenedores Docker para instancias de Node, MongoDB y un volumen virtual donde hacer backups de la base de datos.
* Crear Scripts para automatizar backups.
* Integrar la API de Google Drive para automatizar backups remotos.
* Crear una rama específica para usar el esqueleto del gestor para otros proyectos.
* Terminar la documentación.
