# Radio Entre-Piernas

Un gestor de contenidos creado "from scratch" para el proyecto Radio EntrePiernas.
Para ver una maqueta del sitio dirigirse a los siguientes links:
[Vista de una maqueta de Landing-Page](https://radioentrepiernas3.imfast.io/)
[Vista de una maqueta página de contenidos de contenidos](https://contents.imfast.io/)
[Maquetas realizadas en Figma](https://www.figma.com/file/1vnqesP5XAjm795tbxnR1c/Radio-Ep-dark-Theme)

## Objetivo

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
* Terminar la implementación de las diferentes vistas
* Terminar el saneamiento de los formularios para prevenir XSS (del lado del usuario y del lado del servidor).
* Crear Servicio de Mailing
* Crear un load-balancer con NginX y pensar la implementacipon de PM2
* Crear Contenedores Docker
* Crear una rama específica para usar el esqueleto del gestor para otros proyectos.
* Terminar la documentación
