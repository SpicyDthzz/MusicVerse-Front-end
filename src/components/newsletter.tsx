import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function Newsletter() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary-foreground/10 rounded-full mb-4">
            <Mail className="h-8 w-8" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Suscríbete a Nuestro Newsletter
          </h2>

          <p className="text-lg text-primary-foreground/90 text-pretty">
            Recibe las últimas novedades, lanzamientos exclusivos y ofertas especiales directamente en tu correo.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 bg-primary-foreground text-foreground border-0 h-12"
            />
            <Button type="submit" size="lg" variant="secondary" className="h-12 px-8">
              Suscribirse
            </Button>
          </form>

          <p className="text-sm text-primary-foreground/70">
            Únete a más de 10,000 amantes de la música. Sin spam, solo música.
          </p>
        </div>
      </div>
    </section>
  )
}
