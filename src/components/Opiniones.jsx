import { useState } from 'react'
import Estado from './Estado.jsx'
import { cargarOpiniones } from '../utils/opiniones.js'
import { mensajeParaUsuario } from '../utils/red.js'

function Opiniones() {
  const [opiniones, setOpiniones] = useState([])
  // { tipo: null | 'cargando' | 'error', mensaje, accion }
  const [carga, setCarga] = useState({ tipo: null })

  const cargando = carga.tipo === 'cargando'

  async function manejarCargar() {
    setOpiniones([])
    setCarga({ tipo: 'cargando', mensaje: 'Cargando opiniones...' })

    try {
      const lista = await cargarOpiniones({
        alReintentar: (intento, total) =>
          setCarga({ tipo: 'cargando', mensaje: `La conexión falló. Reintentando (${intento} de ${total})...` }),
      })
      setOpiniones(lista)
      setCarga({ tipo: null })
    } catch (error) {
      console.error('[opiniones] No se pudieron cargar las opiniones:', error)
      setCarga({
        tipo: 'error',
        mensaje: mensajeParaUsuario(error),
        accion: { texto: 'Reintentar', alClick: manejarCargar },
      })
    }
  }

  return (
    <section className="box" id="opiniones">
      <div className="container">
        <h2>Opiniones de la comunidad</h2>
        <p>Cargamos reseñas reales de compradores en tiempo real usando la Fetch API.</p>

        {/* Deshabilitado durante la carga para evitar solicitudes duplicadas. */}
        <button type="button" className="btn btn-accion" onClick={manejarCargar} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Cargar opiniones'}
        </button>

        <Estado tipo={carga.tipo} mensaje={carga.mensaje} accion={carga.accion} />

        <ul className="lista-opiniones">
          {opiniones.map((opinion) => (
            <li key={opinion.id}>
              <strong>{opinion.titulo}: </strong>
              <span>calificación {opinion.calificacion}/5 ({opinion.resenas} reseñas)</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Opiniones
