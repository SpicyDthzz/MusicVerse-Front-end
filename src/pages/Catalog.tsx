import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom" 
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context" 
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/lib/products-context" 
import { formatPrice } from "@/lib/format-price"
import { getGenerosLista } from "@/service/GenerosService"
import { getGenerosUsuario } from "@/service/GenerosService"

interface MusicGenre {
  idGenero: number;
  nombre: string;
}

interface UsuarioGenero {
  id: number;
  nombre: string;
}

export default function CatalogPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedId, setSelectedId] = useState<number>(-1)
  const [musicGenres, setMusicGenres] = useState<MusicGenre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const { addToCart } = useCart()
  const { user } = useAuth() 
  const { products } = useProducts() 
  const { toast } = useToast()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  // Filtramos los productos (ahora viene de products, que incluye los nuevos del admin)
  const filteredProducts = products.filter((product) => {
    const formatMatch = selectedFormat === "all" || product.format.toLowerCase().includes(selectedFormat.toLowerCase())
    const genreMatch = selectedGenre === "all" || product.genre === selectedGenre
    const searchMatch = searchQuery === "" || 
      product.title.toLowerCase().includes(searchQuery) || 
      product.artist.toLowerCase().includes(searchQuery)

    return formatMatch && genreMatch && searchMatch
  })

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const generosList = await getGenerosLista();
        setMusicGenres(generosList);
        const usuarioGeneros: UsuarioGenero[] = await getGenerosUsuario(user?.rut ?? "");
        const selectedGenreIds = usuarioGeneros.map((genre) => genre.id);
        setSelectedGenres(selectedGenreIds);
      } catch (error) {
        toast({
          title: "Error al cargar los géneros",
          description: "Hubo un problema al obtener la lista de géneros. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    };

    fetchGeneros();
  }, [user, toast, navigate]);


  const handleAddToCart = (product: any) => {
    
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes estar registrado para agregar productos al carrito.",
        variant: "destructive",
        action: <Button variant="outline" size="sm" onClick={() => navigate("/login")}>Entrar</Button>
      })
      return
    }

    addToCart({
      id: product.id,
      title: product.title,
      artist: product.artist,
      format: product.format,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Agregado al carrito",
      description: `${product.title} se ha agregado al carrito`,
    })
  }

  const formats = ["all"] 
  const genres = ["all", "Rock", "Pop", "Rap", "Jazz", "Soul", "Metal", "Punk", "Grunge","Reggaetón","Trap","Emo","Blues","Funk","Ska","Reggae"]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Catálogo Completo</h1>
            <p className="text-muted-foreground text-lg">
              {searchQuery 
                ? `Resultados para "${searchQuery}" (${filteredProducts.length} encontrados)`
                : `Explora nuestra colección de ${products.length} discos`
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Formato:</span>
              {formats.map((format) => (
                <Button
                  key={format}
                  variant={selectedFormat === format ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFormat(format)}
                >
                  {format === "all" ? "Todos" : format}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Género:</span>
              {musicGenres.map((genre) => (
                <Button
                  key={genre.idGenero}
                  variant={selectedGenre === genre.nombre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre.nombre)}
                >
                  {genre.nombre === "all" ? "Todos" : genre.nombre}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Género:</span>
              {musicGenres.map((genre) => (
                <Button
                  key={genre.idGenero}
                  variant={selectedId === genre.idGenero ? "default" : "outline"}  // Comparar con `idGenero` en lugar de `nombre`
                  size="sm"
                  onClick={() => setSelectedId(genre.idGenero)}  // Establecer el `idGenero` como el valor seleccionado
                >
                  {genre.nombre === "all" ? "Todos" : genre.nombre}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.title} by ${product.artist}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{product.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{product.artist}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {product.format}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-2xl font-bold text-foreground">${formatPrice(product.price)}</span>
                        <p className="text-xs text-muted-foreground">{product.condition}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" size="lg" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No se encontraron productos {searchQuery ? `para "${searchQuery}"` : "con los filtros seleccionados"}
              </p>
              {searchQuery && (
                <Button variant="link" onClick={() => window.location.href = '/catalog'} className="mt-2">
                  Ver todos los productos
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}