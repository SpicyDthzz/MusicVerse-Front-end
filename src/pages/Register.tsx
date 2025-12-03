import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Disc3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { registrarUsuario,getMetodosPago } from "@/service/UsuarioService"

interface Usuario {
  nombre: string
  rut: string
  contrasenia: String
  correo: string
  direccion: string
  telefono: string
  fechaNacimiento: string
  genero: string
  metodoPago: number
}

export default function RegisterPage() {
  const [rut, setRut] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [direccion, setDireccion] = useState("")
  const [telefono, setTelefono] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [genero, setGenero] = useState("Masculino")
  const [metodoPagos, setMetodosPagos] = useState<{ id_metodopago: number; tipo: string, nombre: string }[]>([]);
  const [metodoPago, setMetodoPago] = useState(1)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const loadMetodosPagos = async () => {
      try {
        const response = await getMetodosPago();
        console.log(response)
        setMetodosPagos(response); // Asume que el API devuelve la lista de géneros correctamente
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "No se pudo cargar la lista de géneros.", 
          variant: "destructive" 
        });
      }
    };
    loadMetodosPagos();
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    const [year, month, day] = fechaNacimiento.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    const usuario: Usuario = {
      nombre: name,
      rut: rut,
      contrasenia: password,
      correo: email,
      direccion: direccion,
      telefono: telefono,
      fechaNacimiento: formattedDate,
      genero: genero,
      metodoPago: metodoPago,
    };

    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const data = await registrarUsuario(usuario);
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      })
      await register(email, password)
      navigate("/preferences")
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Disc3 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Únete a MusicVerse y descubre música increíble</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" placeholder="12.345.678-9" value={rut} onChange={(e) => setRut(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                type="telefono"
                placeholder="999999999"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" placeholder="Calle, 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input id="fechaNacimiento" type="date" value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <select
                id="genero"
                className="border rounded-md p-2 w-full"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metodoPago">Método de Pago</Label>
              <select
                id="metodoPago"
                className="border rounded-md p-2 w-full"
                value={metodoPago}
                onChange={(e) => setMetodoPago(Number(e.target.value))}
              >
                {metodoPagos?.map((mtd) => (
                  <option key={mtd.id_metodopago} value={mtd.id_metodopago}>
                    {mtd.tipo+' | '+mtd.nombre}
                  </option>
                ))}
              </select>
            </div>
            <br></br>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}