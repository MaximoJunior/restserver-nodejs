const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {
      
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth :       '/api/auth',
            buscar:      '/api/buscar',
            categories : '/api/categories',
            users :      '/api/users',
            products :      '/api/products'
        }
       

        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la application
        this.routes();
    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use( this.paths.auth, require('../routers/auth') );
        this.app.use( this.paths.buscar, require('../routers/buscar') );
        this.app.use( this.paths.categories, require('../routers/categories') );
        this.app.use( this.paths.users, require('../routers/user') );
        this.app.use( this.paths.products, require('../routers/products') );
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log(`Server is running at localhost:${this.port}`);
       })
    }
}

module.exports = Server;