import { Link } from "react-router-dom"
import { Disc3, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Disc3 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">MusicVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty">Tu tienda de confianza...</p>
            <div className="flex gap-3">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tienda</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">Vinilos</Link></li>
              <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">CDs</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 MusicVerse. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}