import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { loginUsuario } from "@/service/UsuarioService";

const ADMIN_ROLE = "Admin";

interface User {
  id: string
  correo: string
  rut: string
  nombre: string
  direccion: string
  fechaNacimiento: string
  genero: string
  metodoPago: number
  hasSelectedPreferences: boolean
  isAdmin?: boolean
}

interface Login {
  contrasenia: String
  correo: string
}

interface UserGet {
  rut: string;
  usuario: string;
  rol: string;
  direccion: string;
  telefono: string;
  fecha: string;
  metodoPago: number;
  genero: string;
}

interface StoredUser extends User {
  contrasenia?: string
}

interface AuthContextType {
  user: User | null
  login: (userGet: UserGet, email: string, password: string) => Promise<void>
  register: (correo: string, contrasenia: string) => Promise<void>
  logout: () => void
  updateUserPreferences: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const activeSession = localStorage.getItem("activeSession")
    if (activeSession) {
      setUser(JSON.parse(activeSession))
    }
  }, [])

  const login = async (userGet: UserGet, correo: string, contrasenia: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar Admin
    if (userGet.rol === ADMIN_ROLE) {
      const adminUser: User = {
        id: "admin-id",
        correo: correo,
        nombre: userGet.usuario,
        hasSelectedPreferences: true,
        isAdmin: true,
        rut: userGet.rut,
        direccion: userGet.direccion,
        fechaNacimiento: userGet.fecha,
        genero: userGet.genero,
        metodoPago: userGet.metodoPago
      };
      setUser(adminUser);
      localStorage.setItem("activeSession", JSON.stringify(adminUser));
      return;
    }
    const user: User = {
      id: "user-id",
      correo: correo,
      nombre: userGet.usuario,
      hasSelectedPreferences: true,
      isAdmin: false,
      rut: userGet.rut,
      direccion: userGet.direccion,
      fechaNacimiento: userGet.fecha,
      genero: userGet.genero,
      metodoPago: userGet.metodoPago
    };
    setUser(user);
    localStorage.setItem("activeSession", JSON.stringify(user));
    return;
  }

  const register = async (correo: string, contrasenia: string) => {
    const loginPost: Login = {
      contrasenia: contrasenia,
      correo: correo
    }
    const data = await loginUsuario(loginPost)
    await login(data,correo,contrasenia)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("activeSession")
  }

  const updateUserPreferences = () => {
    if (user) {
      const updatedUser = { ...user, hasSelectedPreferences: true }
      setUser(updatedUser)
      localStorage.setItem("activeSession", JSON.stringify(updatedUser))
      
      // Actualizar también en la lista de usuarios registrados
      const storedUsersStr = localStorage.getItem("registeredUsers");
      if (storedUsersStr) {
        const storedUsers: StoredUser[] = JSON.parse(storedUsersStr);
        const index = storedUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          storedUsers[index].hasSelectedPreferences = true;
          localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));
        }
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}