import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { UserProvider } from "@/lib/user-context";
import { ProductProvider } from "@/lib/products-context";
import { Toaster } from "@/components/ui/toaster";

// Páginas
import HomePage from "@/pages/Home";
import CatalogPage from "@/pages/Catalog";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import PreferencesPage from "@/pages/Preferences";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <UserProvider>     
        <ProductProvider> 
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin" element={<AdminPage />} />    
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/preferences" element={<PreferencesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
