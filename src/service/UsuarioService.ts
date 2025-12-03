const BACKEND_URL = "http://localhost:8080"

// Luego, puedes usar esta constante para construir la URL completa
const url = `${BACKEND_URL}`

interface Usuario {
  nombre: string
  rut: string
  contrasenia: String
  correo: string
  direccion: string
  fechaNacimiento: string
  telefono: string
  genero: string
  metodoPago: number
}

interface Login {
  contrasenia: String
  correo: string
}

/**
 * @returns Post Usuario
 */
export const registrarUsuario = async(usuario: Usuario) => {
    const response = await fetch(url+'/registro',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario)
        }
    )
    const data = await response.text();
    if (response.ok) {
        if (data.toLowerCase() === 'ok') {
        console.log("Registro exitoso");
        return { success: true, message: "Cuenta registrada con éxito" };
        } else {
        console.log("Respuesta del servidor:", data);
        return { success: true, message: data };
        }
    } else {
        console.error("Error al registrar usuario:", data);
        throw new Error(`Error al registrar usuario: ${data}`);
    }
}

/**
 * @returns Post Login
 */
export const loginUsuario = async(login: Login) => {
    const response = await fetch(url+'/auth/login',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login)
        }
    )
    if(!response.ok){
        const message = await response.text()
        throw new Error(message)
    }
    return await response.json();
}

/**
 * @returns get Login
 */
export const getlogin = async() => {
    const response = await fetch(url+'/auth/usuario-logueado', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const res = await response.json();
    console.log(res); // Aquí verás la respuesta
    return res;
}

/**
 * @returns lista de usuarios para admin
 */
export const getUsuariosLista = async() => {
    const response = await fetch(url+'/admin/lista-usuarios',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const usuariosLista = await response.json();

    return usuariosLista
}

/**
 * @returns borrar usuario
 */
export const borrarUsuario = async(rut: string) => {
    const response = await fetch(url+'/admin/usuario/borrar/'+rut,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    if(!response.ok){
        const message = await response.json()
        throw new Error(message)
    }
    return await response.json();
}

/**
 * @returns obtener metodos de pago
 */
export const getMetodosPago = async() => {
    const response = await fetch(url+'/metodopago',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const metodosList = await response.json();
    
    return metodosList
}
