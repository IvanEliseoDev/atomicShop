
import app from "./app";
import "./database";
import { config } from "./config";

// Creo una funcion que me diga si todo se ejecuto bien y que haga que la API se ejecute en el puerto 4000
async function main() {
  app.listen(config.server.PORT); // Se ejecutara en el puerto 4000 dentro de nuestro dispositivo
  console.log("Server on port 4000");
}

// Y ejecutamos por default la funcion que hemos creado
main();
