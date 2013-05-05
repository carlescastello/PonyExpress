# PonyExpress

En mejorandola tenemos un Backend de Django y Nodejs(Express + Socket.io) y queremos empezar a tener un stack de librerías similares en el FrontEnd. Pony Express será esta  colección de librerías y módulos con las que desarrollaremos el Front-End en mejorando.la. 

El interés del proyecto es tener un archivo o un folder que pongamos en nuestros proyecto y podamos empezar a desarrollar apliaciones con mucho javascript del lado del cliente de manera fácil y sencilla.

Por el momento no llevamos mucho, pero estamos seguros de un par de cosas.
* jQuery: Queremos tener jQuery para manipular el DOM y hacer eventos.
* Backbone: El tipo de información que manejamos en mejorando tiende a entrar perfectamente en Colecciones y Modelos al estilo de Backbone, por lo cual no hay que reinventar la rueda.
* Neon: Es una librería que nos permite generar Clases y Modulos que reusaremos por nuestra aplicación.
* CustomEventSuport: Es un módulo de Neon que nos permite hacer que todas nuestras clases tengan soporte para programar orientodos a eventos.
* Plug/BackbonePlug: Es el primer módulo que desarrollamos para Pony Express y es un adaptador entre socket.io y una Clase de neon/Colleccion de backbone, con lo cual podemos hacer que nuestra aplicación tenga intereacciones tiempo real entre todos nuestros usuarios.

Vendrán mas Módulos y librerías a integrarse a este proyecto.

### Intrucciones de uso
 
Lo primero que tenemos que hacer es inicializar PonyExpress

    window.ponyExpress = new PonyExpress({
		    io : "http://localhost:3000"
    });
    
PonyEspress necesitará como parámetro donde está tu servidor de Socket.IO e iniciará una conexión.

Con lo cual tu en cualquier momento prodrás ligar una Collection de backbone con información llegando de tu server de la siguiente manera. Todas las colleciones que tengas de Backbone que quieras pegar a PonyExpress requieren tener un nombre.

    window.messagePlug  = new PonyExpress.BackbonePlug({
        collection : window.messageCollection
    });
    
En tu servidor podrás mandar los siguientes tipos de mensajes "nombreDeTuCollection::create", "nombreDeTuCollection::update"  "nombreDeTuCollection::remove".

Para checar un ejemplo de como usar PonyExpress para hacer un chat entra al folder de ejemplos instala las dependencias de Node y corre el server.

    npm install
    node server
    
Ve a http://localhost:3000 para un ejemplo sencillo sin usar Backbone y ve a http://localhost:3000/backbone para un ejemplo que incluye colecciones de backbone.



