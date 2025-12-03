import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/lib/products-context" 
import { obtenerAlbumsAllmini } from "@/service/AlbumService"

export function FeaturedProducts() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { products } = useProducts() 
  const [albums, setAlbums] = useState<{ id: number; nombre: string, artista: string, genero: string, precio: number, imagenUrl: string }[]>([]);
  const { toast } = useToast()
  const navigate = useNavigate()

  // Tomamos solo los primeros 6
  const featured = products.slice(0, 6);
  useEffect(() => {
      const loadAlbums = async () => {
        try {
          const response = await obtenerAlbumsAllmini();
          setAlbums(response); // Asume que el API devuelve la lista de géneros correctamente
        } catch (error) {
          toast({ 
            title: "Error", 
            description: "No se pudo cargar la lista de usuarios.", 
            variant: "destructive" 
          });
        }
      };
      loadAlbums();
  }, []);

const handleAddToCart = (product: any) => {
    // CAMBIO: Validación de Auth
    if (!user) {
      toast({
        title: "Acceso denegado",
        description: "Regístrate o inicia sesión para comprar.",
        variant: "destructive",
        action: <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>Login</Button>
      })
      return
    }

    addToCart({ id: product.id, title: product.nombre, artist: product.artista, format: product.genero, price: product.precio, image: product.imagenUrl })
    toast({ title: "Agregado al carrito", description: `${product.nombre} se ha agregado al carrito` })
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Destacados de la Semana</h2>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.slice(0, 6).map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.imagenUrl || "/placeholder.svg"}
                      alt={product.nombre}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{product.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{product.artista}</p>
                    <p className="text-sm text-muted-foreground">{product.genero}</p>
                    <p className="font-semibold">${product.precio}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/catalog">Ver Todo el Catálogo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}