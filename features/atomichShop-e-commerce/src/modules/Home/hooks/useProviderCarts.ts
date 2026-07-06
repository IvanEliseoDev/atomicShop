import { useState, useEffect } from "react";
import { ecommerceService } from "@/services/ecommerceService";

interface Provider {
  id: string;
  name: string;
  img: string;
}

export function useProviderCarts() {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    ecommerceService.getHomeProviders().then((data) => {
      setProviders(
        data.map((p: any) => ({
          id: p._id,
          name: p.name,
          img: p.imgProvider?.[0] ?? "",
        }))
      );
    });
  }, []);

  return { providers };
}
