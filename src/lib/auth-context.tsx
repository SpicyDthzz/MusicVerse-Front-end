import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASS = "1234";

interface User {
  id: string
  email: string
  name: string
  hasSelectedPreferences: boolean
  isAdmin?: boolean
}


interface StoredUser extends User {
  password?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
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

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar Admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const adminUser: User = {
        id: "admin-id",
        email: ADMIN_EMAIL,
        name: "Administrador",
        hasSelectedPreferences: true,
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem("activeSession", JSON.stringify(adminUser));
      return;
    }

    // Verificar Usuarios Registrados en localStorage
    const storedUsersStr = localStorage.getItem("registeredUsers");
    const storedUsers: StoredUser[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Quitamos el password antes de guardar en sesión
      const { password, ...safeUser } = foundUser;
      setUser(safeUser);
      localStorage.setItem("activeSession", JSON.stringify(safeUser));
    } else {
      throw new Error("Credenciales inválidas");
    }
  }

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      hasSelectedPreferences: false,
      password: password 
    }

    // Guardar en la "base de datos" local
    const storedUsersStr = localStorage.getItem("registeredUsers");
    const storedUsers: StoredUser[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    
    // Verificar si ya existe
    if (storedUsers.some(u => u.email === email)) {
       throw new Error("El usuario ya existe");
    }

    storedUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));

    // Iniciar sesión automáticamente (sin password en el estado)
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("activeSession", JSON.stringify(safeUser));
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
    <AuthContext.Provider value={{ user, login, register, logout, updateUserPreferences }}>
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