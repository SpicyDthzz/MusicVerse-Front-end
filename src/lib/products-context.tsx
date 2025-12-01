import { createContext, useContext, useState, type ReactNode } from "react";
import { allProducts } from "./products-data";

export interface Product {
  id: number;
  title: string;
  artist: string;
  format: string;
  price: number;
  condition: string;
  image: string;
  badge: string | null;
  genre: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (p: Product) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(allProducts as unknown as Product[]);

  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de ProductProvider");
  }
  return context;
}