# PonyExpress

En mejorandola tenemos un Backend de Djando y Nodejs(Express + Socket.io) y queremos empezar a tener un stack de librerias similares en el FrontEnd. Pony Express sera esta  coleccion de librerias y modulos con las que desarrollaremos el Front-End en mejorando.la. 

El interes del proyecto es tener un archivo o un folder que pongamos en nuestros proyecto y podamos empezar a desarrollar apliaciones con mucho javascript del lado del cliente de manera facil y sencilla.

Por el momento no llevamos mucho, pero estamos seguros de un par de cosas.
* jQuery: Queremos tener jQuery para manipular el DOM y hacer eventos.
* Backbone: El tipo de informacion que manejamos en mejorando tiende a entrar perfectamente en Colecciones y Modelos al estilo de Backbone, por lo cual no hay que reinventar la rueda.
* Neon: Es una libreria que nos permite generar Clases y Modulos que reusaremos por nuestra aplicacion.
* CustomEventSuport: Es un modulo de Neon que nos permite hacer que todas nuestras clases tengan suporte para programar orientodos a eventos.
* Plug/BackbonePlug: Es el primer modulo que desarrollamos para Pony Express y es un adaptador entre socketio y una Clase de neon/Colleccion de backbone, con lo cual podemos hacer que nuestra aplicacion tenga intereacciones tiempo real entre todos nuestros usuarios.

Vendras mas Modulos y librerias a integrarse a este proyecto.

### Intrucciones de uso
 
Lo primero que tenemos que hacer es inicializar PonyExpress

    window.ponyExpress = new PonyExpress({
		    io : "http://localhost:3000"
    });
    
PonyEspress necesitara como parametro donde esta tu servidor de Socket.IO e iniciara una coneccion.

Con lo cual tu en cualquier momento prodras ligar una Collection de backbone con informacion llegando de tu server de la siguiente manera. Todas las colleciones que tengas de Backbone que quieras pegar a PonyExpress requieren tener un nombre.

    window.messagePlug  = new PonyExpress.BackbonePlug({
        collection : window.messageCollection
    });
    
En tu servidor podras mandar los siguientes tipos de mensajes "nombreDeTuCollection::create", "nombreDeTuCollection::update"  "nombreDeTuCollection::remove".

Para checar un ejemplo de como usar PonyExpress para hacer un chat entra al folder de ejemplos instala las dependencias de Node y corre el server.

    npm install
    node server
    
Ve a http://localhost:3000 para un ejemplo sencillo sin usar Backbone y ve a http://localhost:3000/backbone para un ejemplo que incluye colecciones de backbone.



