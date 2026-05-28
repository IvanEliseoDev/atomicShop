import axios from "axios"

const AtomicShop_API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
})

export{AtomicShop_API}