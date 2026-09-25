import { precioFinal } from './precios.js'

// Funciones puras sobre el carrito: devuelven un arreglo nuevo, nunca mutan el
// recibido. Cada línea es { id, cantidad }; nombre y precio se resuelven contra
// el catálogo al momento de mostrar o calcular.

export function agregarProducto(carrito, id) {
  const existe = carrito.some((linea) => linea.id === id)
  if (existe) {
    return carrito.map((linea) =>
      linea.id === id ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
    )
  }
  return [...carrito, { id, cantidad: 1 }]
}

// Elimina la línea si la cantidad llega a 0.
export function cambiarCantidad(carrito, id, diferencia) {
  return carrito
    .map((linea) =>
      linea.id === id ? { ...linea, cantidad: linea.cantidad + diferencia } : linea,
    )
    .filter((linea) => linea.cantidad > 0)
}

export function quitarProducto(carrito, id) {
  return carrito.filter((linea) => linea.id !== id)
}

export function buscarProducto(productos, id) {
  return productos.find((producto) => producto.id === id)
}

// Ignora las líneas sin producto en el catálogo. El total usa el precio de oferta si aplica.
export function calcularResumen(carrito, productos) {
  return carrito.reduce(
    (resumen, linea) => {
      const producto = buscarProducto(productos, linea.id)
      if (!producto) return resumen

      return {
        articulos: resumen.articulos + linea.cantidad,
        total: resumen.total + precioFinal(producto) * linea.cantidad,
      }
    },
    { articulos: 0, total: 0 },
  )
}

export function textoArticulos(cantidad) {
  return `${cantidad} ${cantidad === 1 ? 'artículo' : 'artículos'}`
}


/* ---------- Persistencia en localStorage ---------- */

// Con prefijo: en GitHub Pages todos los repos del usuario comparten origen
// (usuario.github.io) y, por lo tanto, el mismo localStorage.
export const CLAVE_CARRITO = '16bit:carrito'

// El contenido de localStorage puede estar corrupto o editado a mano: se
// conservan solo las líneas con id y cantidad enteros positivos.
export function interpretarCarritoGuardado(texto) {
  try {
    const datos = JSON.parse(texto)
    if (!Array.isArray(datos)) return []
    return datos
      .filter((linea) => Number.isInteger(linea?.id) && linea.id > 0
        && Number.isInteger(linea?.cantidad) && linea.cantidad > 0)
      .map((linea) => ({ id: linea.id, cantidad: linea.cantidad }))
  } catch {
    return []
  }
}

// localStorage puede lanzar excepciones (almacenamiento bloqueado o lleno).
// En ese caso el carrito funciona igual, solo que sin persistir.
export function leerCarritoGuardado() {
  try {
    return interpretarCarritoGuardado(localStorage.getItem(CLAVE_CARRITO))
  } catch {
    return []
  }
}

export function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  } catch {
    // Sin persistencia disponible; no afecta el funcionamiento.
  }
}

export function descartarProductosInexistentes(carrito, productos) {
  return carrito.filter((linea) => buscarProducto(productos, linea.id))
}
