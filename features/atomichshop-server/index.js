// En este archivo lo que haremos es configurar como el archivo de arranque de nuestra API, para que esta pueda funcionar y utilizarse
import app from "./app.js"
import "./database.js"

// Creo una funcion que me diga si todo se ejecuto bien y que haga que la API se ejecute en el puerto 4000
async function main() {
    app.listen(4000) // Se ejecutara en el puerto 4000 dentro de nuestro dispositivo
    console.log("Server on port 4000")
}

// Y ejecutamos por default la funcion que hemos creado
main()