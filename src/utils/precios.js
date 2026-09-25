const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export function formatearPrecio(valor) {
  return formatoCLP.format(valor)
}

// Una "oferta" mayor o igual al precio normal se ignora, en vez de mostrarse
// como descuento.
export function tieneOferta(producto) {
  return typeof producto.precioOferta === 'number' && producto.precioOferta < producto.precio
}

export function precioFinal(producto) {
  return tieneOferta(producto) ? producto.precioOferta : producto.precio
}

export function porcentajeDescuento(producto) {
  return Math.round((1 - producto.precioOferta / producto.precio) * 100)
}
