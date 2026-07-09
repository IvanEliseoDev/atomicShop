import { Request, Response } from "express";
import { modelBrands } from "../models/brands";
import { categoryModel  } from "../models/categories";
import providerModel from "../models/providers";
import { modelProducts } from "../models/product";
import { modelBanner } from "../models/banner";

export const seedService = {
  seedExecute: async (req: Request, res: Response) => {
    try {
      // 1. Limpiar colecciones
      await Promise.all([
        modelBrands.deleteMany({}),
        categoryModel.deleteMany({}),
        providerModel.deleteMany({}),
        modelProducts.deleteMany({}),
        modelBanner.deleteMany({}),
      ]);

      // 2. Crear Marcas y Categorías
      const brands = await modelBrands.insertMany([
        { name: "Hettich", state: true },
        { name: "Motic", state: true },
        { name: "Raypa", state: true },
        { name: "DLAB Scientific", state: true },
        { name: "Jasco", state: true }
      ]);

      const categories = await categoryModel.insertMany([
        { name: "Equipamiento", state: true },
        { name: "Material de vidrio", state: true },
        { name: "Reactivos", state: true },
        { name: "Seguridad", state: true }
      ]);

      // 3. Crear Proveedores (Usando tus mocksProvider)
      const providers = await providerModel.insertMany([
        { name: "DLAB", imgProvider: ["https://www.dlabsci.com/static/assets/images/home/Logo.svg"], direction: "San Salvador", mail: "info@dlab.com", telephone: "2222-0001" },
        { name: "So-Low", imgProvider: ["https://www.scisolinc.com/wp-content/uploads/2021/07/So-Low-Logo-Transparent-PNG-300x79-1.png"], direction: "San Salvador", mail: "info@so-low.com", telephone: "2222-0002" },
        { name: "Hettich", imgProvider: ["https://www.hettichlab.com/_assets/8e3f2035b889bea3b860ea4072202867/images/logo.svg"], direction: "San Salvador", mail: "info@hettich.com", telephone: "2222-0003" },
        { name: "Kugel Medical", imgProvider: ["https://kugel-medical.de/wp-content/uploads/2025/02/logo-2.png"], direction: "San Salvador", mail: "info@kugel.com", telephone: "2222-0004" },
        { name: "Jasco", imgProvider: ["https://i0.wp.com/jasco-spain.com/wp-content/uploads/2023/07/NEW-LOGO-JASCO_-002.png.png?fit=2640%2C737&ssl=1"], direction: "San Salvador", mail: "info@jasco.com", telephone: "2222-0005" },
        { name: "Interscience", imgProvider: ["https://www.interscience.com/local/cache-vignettes/L350xH35/siteon0-e5814.png?1771927445"], direction: "San Salvador", mail: "info@interscience.com", telephone: "2222-0006" },
        { name: "Thomas Scientific", imgProvider: ["https://cdn.thomassci.com/_resources/www/thomsci/images/layout/logo.png"], direction: "San Salvador", mail: "info@thomas.com", telephone: "2222-0007" },
        { name: "Motic", imgProvider: ["https://www.motic.com/images/LOGO.jpg"], direction: "San Salvador", mail: "info@motic.com", telephone: "2222-0012" }
      ]);

      // 4. Crear Productos (Adaptando tus mockProducts)
      // Mapeamos los IDs de forma dinámica para que coincidan con la data creada arriba
      const equipId = categories.find(c => c.name === "Equipamiento")?._id;
      const dlabBrandId = brands.find(b => b.name === "DLAB Scientific")?._id;
      const dlabProvId = providers.find(p => p.name === "DLAB")?._id;

      await modelProducts.insertMany([
        {
          code: "PRD-001",
          name: "Báscula para pesar cajas petri",
          price: 80.0,
          discount: 30, // 110 - 80 = 30 de descuento
          images: ["https://analiticasal.com/wp-content/uploads/2025/07/1-1.png"],
          brandId: dlabBrandId,
          categoryId: equipId,
          providerId: dlabProvId,
          stock: 10,
          state: true,
          description: "Báscula de alta precisión para laboratorio."
        },
        {
          code: "PRD-002",
          name: "Báscula para microbios",
          price: 80.0,
          discount: 0,
          images: ["https://analiticasal.com/wp-content/uploads/2025/02/ContrAA1.jpg"],
          brandId: dlabBrandId,
          categoryId: equipId,
          providerId: dlabProvId,
          stock: 5,
          state: true,
          description: "Ideal para mediciones microscópicas."
        },
        {
          code: "PRD-003",
          name: "Báscula normal científica",
          price: 80.0,
          discount: 10.6, // 90.6 - 80 = 10.6
          images: ["https://analiticasal.com/wp-content/uploads/2025/02/ContrAA1.jpg"],
          brandId: dlabBrandId,
          categoryId: equipId,
          providerId: dlabProvId,
          stock: 12,
          state: true,
          description: "Uso general en laboratorio científico."
        },
        {
          code: "PRD-004",
          name: "Báscula para agua",
          price: 120.99,
          discount: 0,
          images: ["https://placehold.co/200x150/dbeafe/93c5fd?text=img"],
          brandId: dlabBrandId,
          categoryId: equipId,
          providerId: dlabProvId,
          stock: 7,
          state: true,
          description: "Resistente a líquidos y humedad."
        }
      ]);

      // 5. Banners (Data previa)
      await modelBanner.insertMany([
        { title: "Excelencia", subtitle: "Te ofrecemos los mejores productos de laboratorio del país", image: "https://www.shutterstock.com/image-photo/scientist-beakers-water-chemistry-science-260nw-2475262401.jpg", public_id: "banners/001", state: true },
        { title: "Calidad Garantizada", subtitle: "Instrumentos certificados por los mejores fabricantes del mundo", image: "https://www.shutterstock.com/image-photo/panorama-background-health-care-researchers-260nw-1974611666.jpg", public_id: "banners/002", state: true },
        { title: "Soporte Técnico", subtitle: "Nuestro equipo está disponible para ayudarte en todo momento", image: "https://www.shutterstock.com/image-photo/flask-test-tune-science-research-600nw-2524509389.jpg", public_id: "banners/003", state: true }
      ]);

      return res.status(201).json({ status: 201, message: "Seed completado con data de diseño" });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
};