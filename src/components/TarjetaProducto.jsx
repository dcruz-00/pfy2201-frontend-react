import { useEffect, useRef, useState } from 'react'
import { formatearPrecio, tieneOferta, porcentajeDescuento } from '../utils/precios.js'
import { usarImagenFallback } from '../utils/imagenes.js'

const DURACION_CONFIRMACION_MS = 1200

function TarjetaProducto({ producto, onAgregar }) {
  const enOferta = tieneOferta(producto)
  const [agregado, setAgregado] = useState(false)
  const temporizadorRef = useRef(null)

  // Evita que el temporizador actualice el estado de una tarjeta ya desmontada
  // (por ejemplo, si un filtro la oculta durante la confirmación).
  useEffect(() => () => clearTimeout(temporizadorRef.current), [])

  function manejarAgregar() {
    onAgregar(producto.id)

    // Clics seguidos reinician la confirmación en vez de acumular temporizadores.
    setAgregado(true)
    clearTimeout(temporizadorRef.current)
    temporizadorRef.current = setTimeout(() => setAgregado(false), DURACION_CONFIRMACION_MS)
  }

  return (
    <li className="col-12 col-md-6 col-lg-4">
      <div className="card h-100">

        {enOferta && (
          <span className="etiqueta-oferta">-{porcentajeDescuento(producto)}%</span>
        )}

        <figure className="card-img-wrapper">
          <img className="card-img-producto" src={producto.imagen} alt={producto.alt}
            loading="lazy" onError={usarImagenFallback} />
        </figure>

        <div className="card-body">
          <h3 className="card-title">{producto.nombre}</h3>
          <p className="card-text">{producto.descripcion}</p>

          {enOferta ? (
            <p className="card-precio">
              {/* Los lectores de pantalla no anuncian el tachado de <del>:
                  el texto oculto indica cuál precio es cuál. */}
              <del className="precio-normal">
                <span className="visually-hidden">Precio normal: </span>
                {formatearPrecio(producto.precio)}
              </del>
              <span className="precio-oferta">
                <span className="visually-hidden">Precio oferta: </span>
                {formatearPrecio(producto.precioOferta)}
              </span>
            </p>
          ) : (
            <p className="card-precio">{formatearPrecio(producto.precio)}</p>
          )}

          {/* Todas las tarjetas tienen el mismo texto de botón; aria-label lo distingue. */}
          <button type="button" className={agregado ? 'btn btn-accion agregado' : 'btn btn-accion'}
            onClick={manejarAgregar} aria-label={`Agregar ${producto.nombre} al carrito`}>
            {agregado ? '✔ Agregado' : 'Agregar al carrito'}
          </button>
        </div>

      </div>
    </li>
  )
}

export default TarjetaProducto
