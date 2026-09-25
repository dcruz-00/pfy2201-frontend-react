import { useRef } from 'react'
import ItemCarrito from './ItemCarrito.jsx'
import ResumenCarrito from './ResumenCarrito.jsx'
import { buscarProducto } from '../utils/carrito.js'

function Carrito({ carrito, productos, resumen, anuncio, onCambiarCantidad, onQuitar, onVaciar, puedeDeshacer, onDeshacerVaciado }) {
  // Destino del foco cuando desaparece el botón que lo tenía (quitar una línea,
  // vaciar o deshacer), para que la navegación con teclado no vuelva al inicio.
  const tituloRef = useRef(null)

  function enfocarTitulo() {
    tituloRef.current.focus()
  }

  // Las líneas cuyo producto no está en el catálogo (aún cargando o eliminado) no se muestran.
  const lineas = carrito
    .map((linea) => ({ ...linea, producto: buscarProducto(productos, linea.id) }))
    .filter((linea) => linea.producto)

  let mensajeSinLineas
  if (puedeDeshacer) {
    mensajeSinLineas = (
      <p className="carrito-vacio">
        Vaciaste el carrito.{' '}
        <button type="button" className="btn btn-secundario"
          onClick={() => {
            enfocarTitulo()
            onDeshacerVaciado()
          }}>
          Deshacer
        </button>
      </p>
    )
  } else if (carrito.length > 0) {
    // Carrito restaurado desde localStorage mientras el catálogo aún no está disponible.
    mensajeSinLineas = <p className="carrito-vacio">Tus productos guardados aparecerán cuando cargue el catálogo.</p>
  } else {
    mensajeSinLineas = <p className="carrito-vacio">Aún no agregas productos. Elige alguno del catálogo.</p>
  }

  return (
    <section className="box" id="carrito">
      <div className="container">
        <h2 ref={tituloRef} tabIndex={-1}>Tu carrito</h2>

        {lineas.length === 0 ? (
          mensajeSinLineas
        ) : (
          <>
            <ul className="lista-carrito">
              {lineas.map((linea) => (
                <ItemCarrito
                  key={linea.id}
                  producto={linea.producto}
                  cantidad={linea.cantidad}
                  onSumar={() => onCambiarCantidad(linea.id, 1)}
                  onRestar={() => {
                    if (linea.cantidad === 1) enfocarTitulo()
                    onCambiarCantidad(linea.id, -1)
                  }}
                  onQuitar={() => {
                    enfocarTitulo()
                    onQuitar(linea.id)
                  }}
                />
              ))}
            </ul>

            <ResumenCarrito
              resumen={resumen}
              onVaciar={() => {
                enfocarTitulo()
                onVaciar()
              }}
            />
          </>
        )}

        {/* Anuncia a lectores de pantalla los cambios que ocurren fuera de su vista. */}
        <p className="visually-hidden" role="status">{anuncio}</p>
      </div>
    </section>
  )
}

export default Carrito
