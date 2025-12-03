const BACKEND_URL = "http://localhost:8080"
const url = `${BACKEND_URL}`

/**
 * @returns Get Generos musicales
 */
export const getGenerosLista = async() => {
    const response = await fetch(url+'/generos',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const generosList = await response.json();

    return generosList
}


interface GeneroPost {
    generosIds: number[]
}
/**
 * @returns Post Generos musicales
 */
export const registrarGeneros = async(rut: string, generoPost: GeneroPost) => {
    const response = await fetch(url+'/usuario/generos/'+rut,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(generoPost)
        }
    )
    const data = await response.text();
    if (response.ok) {
        if (data === 'Lista Actualizada') {
            console.log("Existo!")
            return { success: true, message: "Gustos actualizados correctamente" };
        } else {
            console.log("Respuesta del servidor:", data);
            return { success: true, message: data };
        }
    } else {
        console.error("Error:", data);
        throw new Error(`Error: ${data}`);
    }
}
/**
 * @returns Get Generos musicales usuario
 */
export const getGenerosUsuario = async(rut: string) => {
    const response = await fetch(url+'/usuario/'+rut+'/generos',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const generosList = await response.json();
    
    return generosList
}
