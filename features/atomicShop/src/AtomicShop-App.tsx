import { RouterProvider } from "react-router"
import { appRouter } from "./routes/AppRoute"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

//Definimos un nuevo cliente para que pueda utilizarlo nuestro QueryProvider de tanstack
export const queryClient = new QueryClient()

export const AtomicShopApp = () => {
    return (
        <>
         <QueryClientProvider client={queryClient} > {/*Implementamos TanStack Query en todo nuesto APP atomicShop */}
             <Toaster richColors />
            <RouterProvider router={appRouter} />
         </QueryClientProvider>
           
        </>
    )
}
