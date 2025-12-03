import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getGenerosLista,registrarGeneros,getGenerosUsuario } from "@/service/GenerosService"

interface MusicGenre {
  idGenero: number;
  nombre: string;
}

interface UsuarioGenero {
  id: number;
  nombre: string;
}

interface GeneroPost {
  generosIds: number[];
}

export default function PreferencesPage() {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [musicGenres, setMusicGenres] = useState<MusicGenre[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length === 0) {
      toast({
        title: "Selecciona al menos un género",
        description: "Por favor selecciona tus géneros musicales favoritos",
        variant: "destructive",
      });
      return;
    }

    const generoPost: GeneroPost = {
      generosIds: selectedGenres,
    };
    registrarGeneros(user?.rut ?? "", generoPost);

    toast({
      title: "Preferencias guardadas",
      description: `Has seleccionado ${selectedGenres.length} géneros musicales`,
    });

    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Music className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-balance">¿Qué música te gusta?</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Selecciona tus géneros favoritos para personalizar tu experiencia en MusicVerse
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {musicGenres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.idGenero);
            return (
              <Card
                key={genre.idGenero}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => toggleGenre(genre.idGenero)}
              >
                <CardContent className="p-6 text-center relative">
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <p className="font-medium text-foreground">{genre.nombre}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={handleContinue} disabled={selectedGenres.length === 0} className="min-w-[200px]">
            Continuar ({selectedGenres.length} seleccionados)
          </Button>
        </div>
      </div>
    </div>
  );
}