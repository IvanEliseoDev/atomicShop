const BASE_URL = "http://localhost:4000/e-commerce";

export const ecommerceService = {
  // Pagina de inicio
  // ----------------
  getBanners: () =>
    fetch(`${BASE_URL}/banners/banner-carousel`).then((r) => r.json()),
  getHomeProducts: () =>
    fetch(`${BASE_URL}/products/home-carousel`).then((r) => r.json()),
  getHomeProviders: () =>
    fetch(`${BASE_URL}/providers/home-providers`).then((r) => r.json()),

  getCart: (clientId: string) =>
    fetch(`${BASE_URL}/carts/${clientId}`).then((r) => r.json()),

  addToCart: (clientId: string, idProduct: string, amount: number) =>
    fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, idProduct, amount }),
    }).then((r) => r.json()),

  removeFromCart: (clientId: string, idProduct: string) =>
    fetch(`${BASE_URL}/carts/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, idProduct }),
    }).then((r) => r.json()),

  // Login
  // ----------------
  // AUTH
  login: (mail: string, password: string) =>
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // necesario para que el backend guarde la cookie
      body: JSON.stringify({ mail, password }),
    }).then((r) => r.json()),

  // Registrar cuenta (cliente)
  // ----------------
  register: (data: {
    name: string;
    mail: string;
    password: string;
    telephone: string;
    direction: string;
    dui: string;
  }) =>
    fetch(`${BASE_URL}/registerCustommer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...data,
        typeCustomer: "natural",
        state: "unverified",
      }),
    }).then((r) => r.json()),

  verifyRegisterCode: (verificationCodeRequest: string) =>
    fetch(`${BASE_URL}/registerCustommer/verifyCodeEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ verificationCodeRequest }),
    }).then((r) => r.json()),

  // Recuperar contraseña
  // ----------------
  requestRecoveryCode: (mail: string) =>
    fetch(`${BASE_URL}/recoveryPasswordEcommerce/requestCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mail }),
    }).then((r) => r.json()),

  verifyRecoveryCode: (codeRequest: string) =>
    fetch(`${BASE_URL}/recoveryPasswordEcommerce/verifyCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ codeRequest }),
    }).then((r) => r.json()),

  newPassword: (newPassword: string, confirmNewPassword: string) =>
    fetch(`${BASE_URL}/recoveryPasswordEcommerce/newPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newPassword, confirmNewPassword }),
    }).then((r) => r.json()),

  // Para navbar
  // ----------------
  logout: () =>
    fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    }).then((r) => r.json()),

  getMe: () =>
    fetch(`${BASE_URL}/login/me`, {
      credentials: "include",
    }).then((r) => r.json()),

  searchProducts: (q: string) =>
  fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(q)}`).then(r => r.json()),
};
