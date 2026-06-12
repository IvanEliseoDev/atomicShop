import { Request, Response } from "express";
import { customerModel } from "../../models/customer";
import { modelCarts } from "../../models/cart";
import { modelProducts } from "../../models/product";
import { modelCommercialInvoice } from "../../models/comercialInvoice";
import { modelTaxCreditInvoice } from "../../models/taxCreditInvoice";
import mongoose from "mongoose";


export const saleController = {
    getAllSales: async(req: Request, res: Response):Promise<void> => {
        const saleswithComercialInvoice = await modelCommercialInvoice.find()
        if(!saleswithComercialInvoice) res.status(404).json({status:404, message:"No hay ventas con facturas comerciales", data: null})
        res.status(200).json({status:200, message: "compras de facturas comerciales obtenidas exitosamente", data: saleswithComercialInvoice})
    },

     getAllSalesUnified: async (req: Request, res: Response): Promise<void> => {
        try {
            const [commercialInvoices, taxCreditInvoices] = await Promise.all([
                modelCommercialInvoice.find().lean(),
                modelTaxCreditInvoice.find().lean()
            ]);

            // Mapeamos para que el frontend identifique de qué tipo es cada venta
            const commercialWithFormat = commercialInvoices.map(invoice => ({ ...invoice, invoice_type: "comercial" }));
            const taxCreditWithFormat = taxCreditInvoices.map(invoice => ({ ...invoice, invoice_type: "credito_fiscal" }));

            const allSales = [...commercialWithFormat, ...taxCreditWithFormat];

            // Ordenar por fecha de emisión descendente (las más recientes primero)
            allSales.sort((a, b) => new Date(b.emision_date).getTime() - new Date(a.emision_date).getTime());

            res.status(200).json({
                status: 200,
                message: "Todas las ventas obtenidas exitosamente.",
                data: allSales
            });
        } catch (error) {
            console.error("Error al obtener todas las ventas:", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor", data: null });
        }
    },

    // 2. GET POR ID Y TIPO: Busca dinámicamente en la colección correcta
    getSaleByIdAndType: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { type } = req.query; // Espera ?type=comercial o ?type=credito_fiscal

            if (!id) {
                res.status(400).json({ status: 400, message: "ID de venta inválido o no provisto", data: null });
                return;
            }

            if (type !== "comercial" && type !== "credito_fiscal") {
                res.status(400).json({ status: 400, message: "El tipo de factura debe ser 'comercial' o 'credito_fiscal'", data: null });
                return;
            }

            let sale = null;
            if (type === "comercial") {
                sale = await modelCommercialInvoice.findById(id).populate("customer_id", "name email");
            } else {
                sale = await modelTaxCreditInvoice.findById(id).populate("customer_id", "name email");
            }

            if (!sale) {
                res.status(404).json({ status: 404, message: `No se encontró la factura en la categoría: ${type}`, data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Factura encontrada con éxito", data: sale });
        } catch (error) {
            console.error("Error al obtener la factura por ID:", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor", data: null });
        }
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
    },

    updateInvoice: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { type } = req.query; // ?type=comercial o ?type=credito_fiscal
            const updateData = req.body;

            if (!id) {
                res.status(400).json({ status: 400, message: "ID inválido", data: null });
                return;
            }

            let updatedInvoice = null;

            if (type === "comercial") {
                updatedInvoice = await modelCommercialInvoice.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            } else if (type === "credito_fiscal") {
                updatedInvoice = await modelTaxCreditInvoice.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            } else {
                res.status(400).json({ status: 400, message: "Tipo de factura inválido en la query string", data: null });
                return;
            }

            if (!updatedInvoice) {
                res.status(404).json({ status: 404, message: "No se encontró el registro para actualizar", data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Factura actualizada correctamente", data: updatedInvoice });
        } catch (error) {
            console.error("Error al actualizar la factura:", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor", data: null });
        }
    },

     deleteInvoice: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { type } = req.query; 

            if (!id) {
                res.status(400).json({ status: 400, message: "ID inválido", data: null });
                return;
            }

            let deletedInvoice = null;

            if (type === "comercial") {
                deletedInvoice = await modelCommercialInvoice.findByIdAndDelete(id);
            } else if (type === "credito_fiscal") {
                deletedInvoice = await modelTaxCreditInvoice.findByIdAndDelete(id);
            } else {
                res.status(400).json({ status: 400, message: "Tipo de factura inválido", data: null });
                return;
            }

            if (!deletedInvoice) {
                res.status(404).json({ status: 404, message: "No se encontró la factura a eliminar", data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Factura eliminada del sistema correctamente", data: null });
        } catch (error) {
            console.error("Error al eliminar la factura:", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor", data: null });
        }
    }

};