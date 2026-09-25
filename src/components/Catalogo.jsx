import { useRef } from 'react'
import TarjetaProducto from './TarjetaProducto.jsx'
import Buscador from './Buscador.jsx'
import Estado from './Estado.jsx'
import { filtrarProductos, describirFiltros } from '../utils/catalogo.js'

function Catalogo({ productos, carga, categoria, termino, onCambiarTermino, onLimpiarFiltros, onReintentar, onAgregar }) {
  const campoBusquedaRef = useRef(null)

  const visibles = filtrarProductos(productos, categoria, termino)
  const hayFiltros = categoria !== 'todas' || termino.trim() !== ''

  function limpiarFiltros() {
    onLimpiarFiltros()
    // El botón desaparece al limpiar; el foco pasa al buscador para no perderlo.
    campoBusquedaRef.current.focus()
  }

  // El estado de la carga tiene prioridad sobre los mensajes de filtros.
  let estado
  if (carga.tipo === 'cargando') {
    estado = carga
  } else if (carga.tipo === 'error') {
    estado = { ...carga, accion: { texto: 'Reintentar', alClick: onReintentar } }
  } else if (visibles.length === 0) {
    estado = {
      tipo: 'vacio',
      mensaje: 'No encontramos productos con esos criterios.',
      accion: { texto: 'Limpiar filtros', alClick: limpiarFiltros },
    }
  } else if (hayFiltros) {
    estado = { tipo: 'info', mensaje: describirFiltros(visibles.length, categoria, termino) }
  } else {
    estado = { tipo: null }
  }

  return (
    <section className="box" id="productos">
      <div className="container">
        <h2>Productos destacados</h2>

        <Buscador termino={termino} onCambiarTermino={onCambiarTermino} campoRef={campoBusquedaRef} />

        <Estado tipo={estado.tipo} mensaje={estado.mensaje} accion={estado.accion} />

        <ul className="grid-productos row" aria-busy={carga.tipo === 'cargando'}>
          {visibles.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} onAgregar={onAgregar} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Catalogo
