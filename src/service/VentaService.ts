const BACKEND_URL = "http://localhost:8080"
const url = `${BACKEND_URL}`

interface ProductoCompra {
  idAlbum: number,
  cantidad: number,
  desc: number
}
interface VentaInter{
  rutUsuario: string,
  idMetodoPago: number
  productos: ProductoCompra[]
}

/**
 * @returns Post venta Albunes
 */
export const registrarVenta = async(ventaPost: VentaInter) => {
    const response = await fetch(url+'/venta/comprar',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ventaPost)
        }
    )
    const generosList = await response.text();
    return generosList
}