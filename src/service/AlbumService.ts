const BACKEND_URL = "http://localhost:8080"
const url = `${BACKEND_URL}`

// Crea una interfaz de tipo Album si no la tienes aún
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

export const subirAlbum = async (albumData: Album, image: File) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(albumData));
    formData.append("imagen", image);
    const response = await fetch(url + "/album/registrar", {
        method: "POST",
        body: formData,
    });
    const data = await response.text();
    if (response.ok) {
        if (data.toLowerCase() === 'ok') {
        console.log("Album registrado");
        return { success: true, message: "Album registrado con éxito" };
        } else {
        console.log("Respuesta del servidor:", data);
        return { success: true, message: data };
        }
    } else {
        console.error("Error al registrar album:", data);
        throw new Error(`Error al registrar album: ${data}`);
    }
};

/**
 * @returns lista albunes
 */
export const obtenerAlbumsAllmini = async() => {
    const response = await fetch(url+'/album/mini',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const albumList = await response.json();

    return albumList
}

/**
 * @returns lista albunes query
 */
export const obtenerAlbumsquery = async(query: string) => {
    const response = await fetch(url+'/album/buscador/mini?query='+query,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const albumList = await response.json();

    return albumList
}

/**
 * @returns lista albunes query
 */
export const obtenerAlbumsId = async(id: number) => {
    const response = await fetch(url+'/album/mini/'+id,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const albumList = await response.json();

    return albumList
}