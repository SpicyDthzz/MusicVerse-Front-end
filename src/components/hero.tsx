import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import megaImg from "@/assets/mega.jpg"
import meteImg from "@/assets/mete.jpg"
import slipImg from "@/assets/slip.jpg"
import stratoImg from "@/assets/strato.jpg"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Nuevos lanzamientos cada semana
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              Descubre la magia de la música <span className="text-primary">física</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Sumérgete en nuestra colección de CDs: donde cada álbum narra una historia inolvidable. Reencuéntrate con la música. Miles de CDs, miles de historias por descubrir.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link to="/catalog">
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Discos en stock</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">100+</div>
                <div className="text-sm text-muted-foreground">Artistas</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={meteImg}
                  alt="Meteora"
                  className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                <img
                  src={slipImg}
                  alt="Slipknot"
                  className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-4 pt-12">
                <img
                  src={megaImg}
                  alt="Megadeth"
                  className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                <img
                  src={stratoImg}
                  alt="Stratovarius"
                  className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
