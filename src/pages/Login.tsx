import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Disc3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      toast({ title: "Bienvenido", description: "Has iniciado sesión correctamente" })
      

      if (email === "admin@admin.com") {
        navigate("/admin")
      } else {
        navigate("/preferences") 
      }
    } catch (error: any) {
      toast({ 
        title: "Error de acceso", 
        description: error.message || "Usuario o contraseña incorrectos", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center"><div className="p-3 bg-primary/10 rounded-2xl"><Disc3 className="h-12 w-12 text-primary" /></div></div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a MusicVerse</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Iniciando..." : "Iniciar Sesión"}</Button>
            <p className="text-sm text-muted-foreground text-center">¿No tienes cuenta? <Link to="/register" className="text-primary hover:underline font-medium">Regístrate aquí</Link></p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}