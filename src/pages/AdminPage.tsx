import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react"; 
import { subirAlbum } from "@/service/AlbumService";
import { getGenerosLista } from "@/service/GenerosService";
import { getUsuariosLista,borrarUsuario } from "@/service/UsuarioService";

interface Album {
  nombre: string;
  formato: string;
  codeUPC: number;
  fecha_lanza: string;
  precio: number;
  stock: number;
  artista: string;
  genero: string;
}

export default function AdminPage() {
  const navigate = useNavigate(); 
  const { user } = useAuth();
  const [generos, setGeneros] = useState<{ idGenero: number; nombre: string }[]>([]);
  const [usuarios, setUsuarios] = useState<{ rut: string; nombre: string, correo: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!user || !user.isAdmin) {
      
      const timer = setTimeout(() => {
        navigate("/"); 
      }, 3000);

      return () => clearTimeout(timer);
    }
    const loadGeneros = async () => {
      try {
        const response = await getGenerosLista();
        setGeneros(response); // Asume que el API devuelve la lista de géneros correctamente
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "No se pudo cargar la lista de géneros.", 
          variant: "destructive" 
        });
      }
    };
    loadGeneros();
    const loadUsuarios = async () => {
      try {
        const response = await getUsuariosLista();
        setUsuarios(response); // Asume que el API devuelve la lista de géneros correctamente
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "No se pudo cargar la lista de usuarios.", 
          variant: "destructive" 
        });
      }
    };
    loadUsuarios();
  }, [user, navigate]);

  const [newProduct, setNewProduct] = useState({
    title: "",
    artist: "",
    price: 0,
    codeUPC: 0,
    releaseDate: "",
    stock: 0,
    image: "",
    format: "CD",
    genre: "Rock"
  });

  if (!user || !user.isAdmin) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-muted/30 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">Cerrando sesión...</h2>
        <p className="text-muted-foreground">Te estamos redirigiendo a la página principal.</p>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: url });
    }
  };

  const handlePublish = () => {
    if (!newProduct.title || newProduct.price <= 0 || !newProduct.image || !imageFile) {
      toast({ 
        title: "Error", 
        description: "Completa todos los campos e incluye una imagen.", 
        variant: "destructive" 
      });
      return;
    }

    const newAlbum: Album = {
      nombre: newProduct.title,
      formato: newProduct.format,
      codeUPC: newProduct.codeUPC,
      fecha_lanza: newProduct.releaseDate,
      precio: newProduct.price,
      stock: newProduct.stock,
      artista: newProduct.artist,
      genero: newProduct.genre
    };
    // Lógica para subir el álbum
    subirAlbum(newAlbum,imageFile).then(() => {
      toast({ title: "Éxito", description: "Álbum publicado en el catálogo." });
      setNewProduct({ title: "", codeUPC: 0, artist: "", price: 0, image: "", releaseDate: "", stock: 0, format: "CD", genre: "Rock" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
    toast({ title: "Éxito", description: "Álbum publicado en el catálogo." });
    
    setNewProduct({ title: "", codeUPC: 0, artist: "", price: 0, image: "", releaseDate:"", stock:0, format: "CD", genre: "Rock" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container mx-auto p-6 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Panel de Administrador</h1>

        <div className="grid gap-8 md:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle>Publicar Nuevo Álbum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título del Álbum</Label>
                  <Input
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="Ej: The Dark Side of the Moon"
                  />
                </div>
                <div className="space-y-2">
                  <Label>UPC</Label>
                  <Input
                    type="number"
                    value={newProduct.codeUPC || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, codeUPC: Number(e.target.value) })}
                    placeholder="999999999"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Artista</Label>
                  <Input
                    value={newProduct.artist}
                    onChange={(e) => setNewProduct({ ...newProduct, artist: e.target.value })}
                    placeholder="Ej: Pink Floyd"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio (CLP)</Label>
                  <Input
                    type="number"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="29990"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Formato</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                    value={newProduct.format}
                    onChange={(e) => setNewProduct({ ...newProduct, format: e.target.value })}
                  >
                    <option value="CD">CD</option>
                    <option value="Vinilo">Vinilo</option>
                    <option value="Cassette">Cassette</option>
                  </select>
                </div>
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label>Género</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  value={newProduct.genre}
                  onChange={(e) => setNewProduct({ ...newProduct, genre: e.target.value })}
                >
                  {generos.map((genero) => (
                    <option key={genero.idGenero} value={genero.nombre}>
                      {genero.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Fecha de Lanzamiento</Label>
                <Input
                  type="date"
                  value={newProduct.releaseDate}
                  onChange={(e) => setNewProduct({ ...newProduct, releaseDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Imagen de Portada</Label>
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {newProduct.image && (
                  <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border">
                    <img src={newProduct.image} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
              <Button onClick={handlePublish} className="w-full bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Publicar en Catálogo
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta 2: Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {usuarios.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay usuarios registrados aún.</p>
              ) : (
                <div className="space-y-4">
                  {usuarios.map((u) => (
                    <div key={u.rut} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{u.nombre}</p>
                        <p className="text-xs text-muted-foreground">{u.correo}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => borrarUsuario(u.rut)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}