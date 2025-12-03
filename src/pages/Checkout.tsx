import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import { CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/format-price"
import { registrarVenta } from "@/service/VentaService"

interface ProductoCompra {
  idAlbum: number,
  cantidad: number,
  desc: number
}
interface VentaInter{
  rutUsuario: string,
  idMetodoPago: number
  productos: ProductoCompra[]
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return
    }
    if (items.length === 0 && !showSuccess) {
      navigate("/catalog")
    }
  }, [user, items, navigate, showSuccess])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) {
      navigate("/login");
      return
    }
    const ventalista: VentaInter = {
      rutUsuario: user.rut,
      idMetodoPago: user.metodoPago,
      productos: items.map((item) => ({
        idAlbum: item.id,
        cantidad: item.quantity,
        desc: 0,
      })),
    };
    const response = await registrarVenta(ventalista);
    console.log(ventalista)
    e.preventDefault()
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    setShowSuccess(true)
    clearCart()
    setIsProcessing(false)

    setTimeout(() => {
      navigate("/")
    }, 3000)
  }

  const shippingCost = 2990
  const total = totalPrice + shippingCost

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-6 p-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-8">
                <CheckCircle2 className="h-24 w-24 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-balance">¡Gracias por su compra!</h1>
              <p className="text-muted-foreground text-lg">Su pedido ha sido procesado exitosamente</p>
            </div>
            <p className="text-sm text-muted-foreground">Redirigiendo a la página principal...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Finalizar Compra</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {user ? (<div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre Completo</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={user.nombre}
                        required
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.correo}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Rut</Label>
                      <Input
                        id="city"
                        name="city"
                        value={user.rut}
                        required
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        value={user.direccion}
                        required
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mtdPago">Metodo de pago</Label>
                    <Input
                      id="mtdPago"
                      name="mtdPago"
                      placeholder=""
                      value={user.metodoPago}
                      required
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>
            </div>):(
              <>
                <h1>Error</h1>
              </>
            )}

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.title} x{item.quantity}
                        </span>
                        <span className="font-medium">${formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span>${formatPrice(shippingCost)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${formatPrice(total)}</span>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isProcessing}>
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Completar Compra
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al completar la compra, aceptas nuestros términos y condiciones
                  </p>
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