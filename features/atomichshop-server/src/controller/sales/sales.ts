import { Request, Response } from "express";
import { customerModel } from "../../models/customer";
import { modelCarts } from "../../models/cart";
import { modelProducts } from "../../models/product";
import { modelCommercialInvoice } from "../../models/comercialInvoice";
import { modelTaxCreditInvoice } from "../../models/taxCreditInvoice";


export const saleController = {
    getAllSales: async(req: Request, res: Response):Promise<void> => {
        const saleswithComercialInvoice = await modelCommercialInvoice.find()
        if(!saleswithComercialInvoice) res.status(404).json({status:404, message:"No hay ventas con facturas comerciales", data: null})
        res.status(200).json({status:200, message: "compras de facturas comerciales obtenidas exitosamente", data: saleswithComercialInvoice})
    },
    registerInvoiceComercial: async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                DTE,
                emision_date,
                type_payment,
                customer_id,
                products,
                subtotal_sale,
                general_sale_discount,
                total_with_discount,
                payment_received,
                change,
                type_sale,
                total_pay,
                id_cart,
            } = req.body;

            // 1. VALIDACIÓN: Verificar que el cliente exista y esté activo
            const customerExists = await customerModel.findById(customer_id);
            if (!customerExists) {
                res.status(404).json({
                    status: 404,
                    message: `El cliente con ID ${customer_id} no existe en los registros.`,
                    data: null,
                });
                return;
            }

            // 2. VALIDACIÓN: Si maneja carrito, verificar su existencia
            if (id_cart) {
                const cartExists = await modelCarts.findById(id_cart);
                if (!cartExists) {
                    res.status(404).json({
                        status: 404,
                        message: `El carrito con ID ${id_cart} no fue encontrado.`,
                        data: null,
                    });
                    return;
                }
            }

            // 3. VALIDACIÓN DE INVENTARIO: Comprobar y reducir el stock de los productos
            if (products && products.length > 0) {

                // Preparamos el array de operaciones que se ejecutarán en paralelo
                const bulkOps = products.map((item: any) => ({
                    updateOne: {
                        filter: { _id: item.id_product },
                        update: { $inc: { stock: -item.amount } }
                    }
                }));

                // Se envía una única petición a MongoDB con todas las actualizaciones
                await modelProducts.bulkWrite(bulkOps);
            }

            // 4. PERSISTENCIA: Guardar el documento de la Factura Comercial
            const newInvoice = new modelCommercialInvoice({
                DTE,
                emision_date: emision_date || new Date(),
                type_payment,
                customer_id,
                products,
                subtotal_sale,
                general_sale_discount,
                total_with_discount,
                payment_received,
                change,
                type_sale,
                total_pay,
                id_cart,
            });

            const invoiceSaved = await newInvoice.save();

            // 5. POST-PROCESO: Si la venta se concretó con un carrito, opcionalmente puedes limpiarlo o borrarlo
            if (id_cart) {
                // Opción A: Eliminar el carrito para que no quede huérfano
                await modelCarts.findByIdAndDelete(id_cart);
            }

            // Respuesta exitosa
            res.status(201).json({
                status: 201,
                message: "Factura comercial (DTE) registrada con éxito y stock actualizado.",
                data: invoiceSaved,
            });

        } catch (error) {
            console.error("Error al registrar factura comercial:", error);
            res.status(500).json({
                status: 500,
                message: "Error interno del servidor - revisar los server logs",
                data: null,
            });
        }
    },
    registerTaxCreditInvoice: async(req:Request, res:Response):Promise<void> => {
        try {
            const creditInvoiceRequest = req.body
            const {customer_id, id_cart, products} = creditInvoiceRequest
            if(!customer_id) res.status(400).json({status:400, message:"El campo de customer_id es requerido - peticion incorrecta", data:null})
            const customerExist = await customerModel.findById(customer_id)
            if(!customerExist) res.status(404).json({status:404, message:"El id del cliente no existe", data:null})
            if(id_cart) {
                const cartExist = await modelCarts.findById(id_cart)
                if(!cartExist) res.status(404).json({status:404, message:"El id del carrito no existe", data:null})
            }
            if(products && products.length > 0){
             const bulkOps = products.map((product:any) => ({
                updateOne:{
                    filter: {_id: product.id_product},
                    update: {$inc:{stock: -product.amount}}
                }
             }))
            
             await modelProducts.bulkWrite(bulkOps)
            }
            const newTaxCreditInvoice = new modelTaxCreditInvoice({
                ...creditInvoiceRequest,
                emision_date: creditInvoiceRequest.emision_date || new Date()
            })
            const invoiceSaved = await newTaxCreditInvoice.save();
            if (id_cart) {
              await modelCarts.findByIdAndDelete(id_cart);
            }
            res.status(201).json({staus:201, message: "Factura de credito fiscal registrada con exito y stock actualizado"})
        } catch (error) {
            console.error("Error al registrar factura con credito fiscal:", error);
            res.status(500).json({
                status: 500,
                message: "Error interno del servidor - revisar los server logs",
                data: null,
            });
        }
    }
};