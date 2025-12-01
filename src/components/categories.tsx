import { Card, CardContent } from "@/components/ui/card"
import { Disc3 } from "lucide-react"

const categories = [
  {
    name: "CDs",
    count: "1,800+",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

export function Categories() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Explora por Formato</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Encuentra tu formato favorito y descubre joyas musicales en cada categoría.
          </p>
        </div>

        <div className="flex justify-center">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full max-w-sm"
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={`${category.bgColor} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Disc3 className={`h-12 w-12 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
