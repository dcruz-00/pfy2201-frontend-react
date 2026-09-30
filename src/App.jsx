import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Catalogo from './components/Catalogo.jsx'
import Carrito from './components/Carrito.jsx'
import Opiniones from './components/Opiniones.jsx'
import Footer from './components/Footer.jsx'
import { cargarProductos } from './utils/catalogo.js'
import { mensajeParaUsuario } from './utils/red.js'
import {
  agregarProducto,
  cambiarCantidad,
  quitarProducto,
  buscarProducto,
  calcularResumen,
  textoArticulos,
  CLAVE_CARRITO,
  interpretarCarritoGuardado,
  leerCarritoGuardado,
  guardarCarrito,
  descartarProductosInexistentes,
} from './utils/carrito.js'

const CARGA_INICIAL = { tipo: 'cargando', mensaje: 'Cargando productos...' }

function App() {
  const [productos, setProductos] = useState([])
  // { tipo: 'cargando' | 'error' | 'listo', mensaje }
  const [carga, setCarga] = useState(CARGA_INICIAL)
  // Incrementarlo vuelve a disparar el efecto de carga del catálogo.
  const [intentoCarga, setIntentoCarga] = useState(0)

  const [categoria, setCategoria] = useState('todas')
  const [termino, setTermino] = useState('')

  const [carrito, setCarrito] = useState(leerCarritoGuardado)
  const [ultimoAgregadoId, setUltimoAgregadoId] = useState(null)
  // Contenido del carrito antes de vaciarlo; null si no hay nada que deshacer.
  const [carritoVaciado, setCarritoVaciado] = useState(null)

  useEffect(() => {
    guardarCarrito(carrito)
  }, [carrito])

  // "storage" solo se dispara en las OTRAS pestañas del mismo origen.
  useEffect(() => {
    function alCambiarEnOtraPestana(event) {
      if (event.key === CLAVE_CARRITO) {
        setCarrito(interpretarCarritoGuardado(event.newValue))
        setCarritoVaciado(null)
      }
    }
    window.addEventListener('storage', alCambiarEnOtraPestana)
    return () => window.removeEventListener('storage', alCambiarEnOtraPestana)
  }, [])

  useEffect(() => {
    // Descarta respuestas de un efecto ya limpiado (reintento o doble
    // ejecución de StrictMode en desarrollo).
    let cancelado = false

    cargarProductos({
      alReintentar: (intento, total) => {
        if (!cancelado) {
          setCarga({ tipo: 'cargando', mensaje: `La conexión falló. Reintentando (${intento} de ${total})...` })
        }
      },
    })
      .then((lista) => {
        if (cancelado) return
        setProductos(lista)
        setCarga({ tipo: 'listo' })
        // El carrito guardado puede referir productos que ya no están en el catálogo.
        setCarrito((actual) => descartarProductosInexistentes(actual, lista))
      })
      .catch((error) => {
        if (cancelado) return
        console.error('[catálogo] No se pudo cargar el catálogo:', error)
        setCarga({ tipo: 'error', mensaje: mensajeParaUsuario(error) })
      })

    return () => {
      cancelado = true
    }
  }, [intentoCarga])

  function manejarReintentar() {
    setCarga(CARGA_INICIAL)
    setIntentoCarga((n) => n + 1)
  }

  function manejarLimpiarFiltros() {
    setCategoria('todas')
    setTermino('')
  }

  const resumen = calcularResumen(carrito, productos)
  const ultimoAgregado = buscarProducto(productos, ultimoAgregadoId)
  let anuncio = ''
  if (ultimoAgregado) {
    anuncio = `${ultimoAgregado.nombre} agregado al carrito. En el carrito: ${textoArticulos(resumen.articulos)}.`
  } else if (carritoVaciado) {
    anuncio = 'Vaciaste el carrito. Puedes deshacer esta acción.'
  }

  // Agregar un producto descarta la opción de deshacer el último vaciado.
  function manejarAgregar(id) {
    setCarrito((actual) => agregarProducto(actual, id))
    setUltimoAgregadoId(id)
    setCarritoVaciado(null)
  }

  function manejarCambiarCantidad(id, diferencia) {
    setCarrito((actual) => cambiarCantidad(actual, id, diferencia))
    setUltimoAgregadoId(null)
  }

  function manejarQuitar(id) {
    setCarrito((actual) => quitarProducto(actual, id))
    setUltimoAgregadoId(null)
  }

  function manejarVaciar() {
    setCarritoVaciado(carrito)
    setCarrito([])
    setUltimoAgregadoId(null)
  }

  function manejarDeshacerVaciado() {
    setCarrito(carritoVaciado)
    setCarritoVaciado(null)
  }

  return (
    <>
      <Navbar
        categoria={categoria}
        onCambiarCategoria={setCategoria}
        cantidadArticulos={resumen.articulos}
      />
      <Hero />

      <main>
        <Catalogo
          productos={productos}
          carga={carga}
          categoria={categoria}
          termino={termino}
          onCambiarTermino={setTermino}
          onLimpiarFiltros={manejarLimpiarFiltros}
          onReintentar={manejarReintentar}
          carrito={carrito}
          onAgregar={manejarAgregar}
        />

        <Carrito
          carrito={carrito}
          productos={productos}
          resumen={resumen}
          anuncio={anuncio}
          onCambiarCantidad={manejarCambiarCantidad}
          onQuitar={manejarQuitar}
          onVaciar={manejarVaciar}
          puedeDeshacer={carritoVaciado !== null}
          onDeshacerVaciado={manejarDeshacerVaciado}
        />

        <Opiniones />
      </main>

      <Footer />
    </>
  )
}

export default App
