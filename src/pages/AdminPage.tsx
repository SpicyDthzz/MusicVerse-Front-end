import { useProducts } from "@/lib/products-context";
import { useUsers } from "@/lib/user-context";
import { useState, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";   
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function AdminPage() {
  const { addProduct } = useProducts();
  const { users, removeUser } = useUsers();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);


  if (!user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const [newProduct, setNewProduct] = useState({
    title: "",
    artist: "",
    price: 0,
    image: "",
    format: "CD", 
    genre: "Rock" 
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crea una URL temporal para ver la imagen de inmediato
    const url = URL.createObjectURL(file); 
    setNewProduct({ ...newProduct, image: url });
  };

  const handlePublish = () => {

    if (!newProduct.title || newProduct.price <= 0 || !newProduct.image) {
      toast({ title: "Error", description: "Completa todos los campos e incluye una imagen.", variant: "destructive" });
      return;
    }

    // Guardamos el producto en el contexto global
    addProduct({
      id: Date.now(),
      title: newProduct.title,
      artist: newProduct.artist || "Artista Desconocido",
      price: newProduct.price,
      image: newProduct.image,
      format: newProduct.format,
      genre: newProduct.genre,
      condition: "Nuevo",
      badge: "Nuevo",
    });

    toast({ title: "Éxito", description: "Álbum publicado en el catálogo." });

    // Limpiamos el formulario
    setNewProduct({ title: "", artist: "", price: 0, image: "", format: "CD", genre: "Rock" });
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
              <div className="space-y-2">
                <Label>Título del Álbum</Label>
                <Input 
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="Ej: The Dark Side of the Moon" 
                />
              </div>

              <div className="space-y-2">
                <Label>Artista</Label>
                <Input 
                  value={newProduct.artist}
                  onChange={(e) => setNewProduct({ ...newProduct, artist: e.target.value })}
                  placeholder="Ej: Pink Floyd" 
                />
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

              <div className="space-y-2">
                <Label>Imagen de Portada</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
            
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

          <Card>
            <CardHeader>
              <CardTitle>Usuarios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay usuarios registrados aún.</p>
              ) : (
                <div className="space-y-4">
                  {users.map((u) => (
                    <div key={u.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeUser(u.id)}
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