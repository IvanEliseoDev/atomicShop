// Creo un array de products
const productsController = {}

// Importo el esquema de la coleccion que voy a ocupar
import productsModel from "../models/products.js"

// ******* ENPOINTS *******

// INSERT MASIVE
productsController.insertManyProducts = async (req, res) => {
  try {
    const products = req.body

    if (!Array.isArray(products) || products.length === 0){
      return res.status(400).json({message: "Se requiere un array con al menos un elemento (dato|json)"})
    }

    const result = await productsModel.insertMany(products)
    res.status(201).json({message: `${result.length} productos creados exitosamente`, data: result}
    ) 
  }catch (error) {
     res.status(500).json({message: "Error al insertar productos", error: error.message}) 
    }
}

// // INSERT
// productsController.insertProducts = async (req, res) => {
//       // Guardamos los datos en campos          req: lo que pedimos
//     const {name, description}
// }