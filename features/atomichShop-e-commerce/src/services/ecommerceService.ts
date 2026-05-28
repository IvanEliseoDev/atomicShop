const BASE_URL = "http://localhost:4000/e-commerce";

export const ecommerceService = {
  getBanners: () => fetch(`${BASE_URL}/banners/banner-carousel`).then(r => r.json()),
  getHomeProducts: () => fetch(`${BASE_URL}/products/home-carousel`).then(r => r.json()),
  getHomeProviders: () => fetch(`${BASE_URL}/providers/home-providers`).then(r => r.json()),

  getCart: (clientId: string) =>
    fetch(`${BASE_URL}/carts/${clientId}`).then(r => r.json()),

  addToCart: (clientId: string, idProduct: string, amount: number) =>
    fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, idProduct, amount }),
    }).then(r => r.json()),

  removeFromCart: (clientId: string, idProduct: string) =>
    fetch(`${BASE_URL}/carts/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, idProduct }),
    }).then(r => r.json()),
};