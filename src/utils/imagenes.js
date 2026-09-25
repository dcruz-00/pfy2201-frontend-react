// Embebida como data URI para no depender de otro archivo que también podría fallar.
export const IMAGEN_FALLBACK = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">'
  + '<rect width="800" height="400" fill="#ebdbb2"/>'
  + '<text x="400" y="210" text-anchor="middle" font-family="monospace" font-size="32" fill="#7c6f64">'
  + 'Imagen no disponible</text></svg>'
)

// Handler para onError de <img>. La comparación evita un bucle si el respaldo también fallara.
export function usarImagenFallback(event) {
  const imagen = event.currentTarget
  if (imagen.src !== IMAGEN_FALLBACK) {
    imagen.src = IMAGEN_FALLBACK
  }
}
