import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format-price"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6 max-w-md px-4">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-full">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-balance">Tu carrito está vacío</h1>
            <p className="text-muted-foreground text-pretty">
              Explora nuestro catálogo y encuentra los discos perfectos para tu colección
            </p>
            <Button asChild size="lg">
              <Link to="/catalog">Ver Catálogo</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Carrito de Compras</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.artist}</p>
                        <p className="text-muted-foreground text-sm">{item.format}</p>
                        <p className="text-primary font-bold text-lg mt-2">${formatPrice(item.price)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Resumen</h2>
                  <div className="space-y-2 py-4 border-y">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Envío</span>
                      <span>Calculado en checkout</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${formatPrice(totalPrice)}</span>
                  </div>
                  <Button asChild size="lg" className="w-full">
                    <Link to="/checkout">Procesar Compra</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                    <Link to="/catalog">Continuar Comprando</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}