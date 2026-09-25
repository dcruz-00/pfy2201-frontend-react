import { obtenerJSON, ErrorCarga } from './red.js'

// API pública de prueba; se usa la calificación de sus productos como opiniones.
const URL_OPINIONES = 'https://fakestoreapi.com/products?limit=4'

function esTextoVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === ''
}

// Descarta registros incompletos y los mapea a un formato propio, para que
// los componentes no dependan de la estructura de la API.
function validarOpiniones(datos) {
  if (!Array.isArray(datos)) {
    throw new ErrorCarga('datos', 'Se esperaba una lista de opiniones')
  }

  return datos
    .filter((item) =>
      item !== null && typeof item === 'object'
      && Number.isInteger(item.id)
      && !esTextoVacio(item.title)
      && item.rating !== null && typeof item.rating === 'object'
      && Number.isFinite(item.rating.rate)
      && Number.isInteger(item.rating.count),
    )
    .map((item) => ({
      id: item.id,
      titulo: item.title.trim(),
      calificacion: item.rating.rate,
      resenas: item.rating.count,
    }))
}

export async function cargarOpiniones(opciones) {
  const datos = await obtenerJSON(URL_OPINIONES, opciones)
  const opiniones = validarOpiniones(datos)
  if (opiniones.length === 0) {
    throw new ErrorCarga('datos', 'La API no devolvió opiniones válidas')
  }
  return opiniones
}
