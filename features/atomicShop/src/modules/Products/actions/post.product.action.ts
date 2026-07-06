import { AtomicShop_API } from "@/api/AtomicShop-API"

export const addProductAction = async ({ dataProduct }: any) => {
    try {
        const formData = new FormData();
        formData.append("name", dataProduct.name ?? "");
        formData.append("code", dataProduct.code ?? "");
        if (dataProduct.brandId) formData.append("brandId", dataProduct.brandId);
        if (dataProduct.categoryId) formData.append("categoryId", dataProduct.categoryId);
        if (dataProduct.description) formData.append("description", dataProduct.description);
        formData.append("stock", String(dataProduct.stock ?? 0));
        formData.append("price", String(dataProduct.price ?? 0));
        formData.append("discount", String(dataProduct.discount ?? 0));
        formData.append("state", String(dataProduct.state ?? true));

        if (dataProduct.images?.length > 0) {
            dataProduct.images.forEach((file: File) => {
                formData.append("images", file);
            });
        }

        const { data } = await AtomicShop_API.post("/admin/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return data;
    } catch (error) {
        console.log(error);
        throw new Error("error al insertar producto");
    }
};
