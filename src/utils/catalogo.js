import { obtenerJSON, ErrorCarga } from './red.js'

// Relativa al documento, para que funcione tanto en desarrollo como bajo /<repo>/ en GitHub Pages.
const URL_PRODUCTOS = 'assets/data/productos.json'

export const CATEGORIAS = { consolas: 'Consolas', juegos: 'Juegos', accesorios: 'Accesorios' }


/* ---------- Validación ---------- */

function esTextoVacio(valor) {
  return typeof valor !== 'string' || valor.trim() === ''
}

function esPrecioValido(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0
}

// Devuelve el motivo por el que el producto es inválido, o '' si es válido.
function detectarProblemaProducto(item, idsVistos) {
  if (item === null || typeof item !== 'object') return 'no es un objeto'
  if (!Number.isInteger(item.id) || item.id <= 0) return 'id inválido'
  if (idsVistos.has(item.id)) return `id duplicado (${item.id})`
  if (esTextoVacio(item.nombre)) return 'sin nombre'
  if (!esPrecioValido(item.precio)) return 'precio inválido'
  if (!Object.hasOwn(CATEGORIAS, item.categoria)) return 'categoría desconocida'
  if (esTextoVacio(item.imagen)) return 'sin imagen'
  if (item.descripcion !== undefined && typeof item.descripcion !== 'string') return 'descripción inválida'
  return ''
}

// Los productos inválidos se omiten (con aviso en consola) en lugar de
// invalidar el catálogo completo.
function validarProductos(datos) {
  if (!Array.isArray(datos)) {
    throw new ErrorCarga('datos', 'Se esperaba una lista de productos')
  }

  const idsVistos = new Set()
  const validos = []

  datos.forEach((item, posicion) => {
    const problema = detectarProblemaProducto(item, idsVistos)
    if (problema) {
      console.warn(`[catálogo] Producto en la posición ${posicion} omitido: ${problema}`)
      return
    }
    idsVistos.add(item.id)
    validos.push({
      id: item.id,
      nombre: item.nombre.trim(),
      descripcion: typeof item.descripcion === 'string' ? item.descripcion.trim() : '',
      precio: item.precio,
      // Opcional: un precio de oferta inválido solo quita la oferta, no el producto.
      precioOferta: esPrecioValido(item.precioOferta) ? item.precioOferta : undefined,
      categoria: item.categoria,
      imagen: item.imagen.trim(),
      alt: esTextoVacio(item.alt) ? item.nombre.trim() : item.alt.trim(),
    })
  })

  return validos
}

export async function cargarProductos(opciones) {
  const datos = await obtenerJSON(URL_PRODUCTOS, opciones)
  const productos = validarProductos(datos)
  if (productos.length === 0) {
    throw new ErrorCarga('datos', 'El JSON no contiene productos válidos')
  }
  return productos
}


/* ---------- Filtros ---------- */

// Sin distinguir mayúsculas ni tildes.
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function filtrarProductos(productos, categoria, termino) {
  const buscado = normalizarTexto(termino.trim())

  return productos.filter((producto) => {
    const coincideCategoria = categoria === 'todas' || producto.categoria === categoria
    const coincideTexto = buscado === '' || normalizarTexto(producto.nombre).includes(buscado)
    return coincideCategoria && coincideTexto
  })
}

export function describirFiltros(cantidad, categoria, termino) {
  let texto = `${cantidad} ${cantidad === 1 ? 'producto encontrado' : 'productos encontrados'}`
  if (categoria !== 'todas') texto += ` en ${CATEGORIAS[categoria]}`
  if (termino.trim() !== '') texto += ` para "${termino.trim()}"`
  return `${texto}.`
}
