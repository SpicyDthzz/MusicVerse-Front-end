import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = { 
  id: string; 
  name: string;
  email: string;
};

type UserContextType = {
  users: User[];
  removeUser: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Lógica segura para cargar usuarios
  const loadSafeUsers = () => {
    try {
      const stored = localStorage.getItem("registeredUsers");
      if (!stored) {
        setUsers([]);
        return;
      }
      
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setUsers(parsed);
      } else {
        
        console.warn("Datos de usuarios corruptos, reiniciando...");
        setUsers([]);
        localStorage.removeItem("registeredUsers");
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadSafeUsers();
    window.addEventListener('storage', loadSafeUsers);
    return () => window.removeEventListener('storage', loadSafeUsers);
  }, []);

  const removeUser = (id: string) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  return (
    <UserContext.Provider value={{ users, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers debe usarse dentro de UserProvider");
  return ctx;
};