const CONFIG_FETCH = {
  timeoutMs: 8000, // por intento
  intentos: 3,     // incluye el primero
  esperaMs: 800,   // base de la espera entre intentos; crece linealmente
}

// tipo: 'timeout' | 'red' | 'http' | 'json' | 'datos' | 'desconocido'
export class ErrorCarga extends Error {
  constructor(tipo, mensaje, estadoHttp = null) {
    super(mensaje)
    this.name = 'ErrorCarga'
    this.tipo = tipo
    this.estadoHttp = estadoHttp
  }
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms))
}

function normalizarError(error) {
  if (error instanceof ErrorCarga) return error

  // Lo produce controlador.abort(), es decir, el timeout.
  if (error?.name === 'AbortError') {
    return new ErrorCarga('timeout', 'La solicitud superó el tiempo máximo')
  }
  if (error instanceof SyntaxError) {
    return new ErrorCarga('json', 'La respuesta no es JSON válido')
  }
  // fetch rechaza con TypeError ante fallos de red y bloqueos por CORS.
  if (error instanceof TypeError) {
    return new ErrorCarga('red', 'No se pudo establecer la conexión')
  }
  return new ErrorCarga('desconocido', error?.message || 'Error inesperado')
}

// Solo se reintentan fallos potencialmente transitorios; un 404 o un JSON
// inválido darían el mismo resultado.
function esReintentable(error) {
  return error.tipo === 'timeout'
    || error.tipo === 'red'
    || (error.tipo === 'http' && (error.estadoHttp >= 500 || error.estadoHttp === 429))
}

// Devuelve el JSON o lanza un ErrorCarga.
// opciones: { timeoutMs, intentos, esperaMs, alReintentar(intentoActual, total) }
export async function obtenerJSON(url, opciones = {}) {
  const config = { ...CONFIG_FETCH, ...opciones }
  const intentos = Math.max(1, config.intentos)
  let ultimoError

  for (let intento = 1; intento <= intentos; intento++) {
    const controlador = new AbortController()
    const temporizador = setTimeout(() => controlador.abort(), config.timeoutMs)

    try {
      const respuesta = await fetch(url, { signal: controlador.signal })

      // fetch no rechaza ante respuestas 4xx/5xx.
      if (!respuesta.ok) {
        throw new ErrorCarga('http', `Respuesta HTTP ${respuesta.status}`, respuesta.status)
      }
      // El timeout también cubre la lectura del cuerpo.
      return await respuesta.json()
    } catch (error) {
      ultimoError = normalizarError(error)
      if (!esReintentable(ultimoError) || intento === intentos) break

      config.alReintentar?.(intento + 1, intentos)
      await esperar(config.esperaMs * intento)
    } finally {
      clearTimeout(temporizador)
    }
  }
  throw ultimoError
}

// Texto para la interfaz; el detalle técnico se registra en consola por separado.
export function mensajeParaUsuario(error) {
  switch (error?.tipo) {
    case 'timeout':
      return 'La carga está tardando más de lo esperado. Revisa tu conexión e inténtalo de nuevo.'
    case 'red':
      return 'No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.'
    case 'http':
      return error.estadoHttp === 404
        ? 'No encontramos los datos solicitados (error 404).'
        : `El servidor respondió con un error (código ${error.estadoHttp}). Inténtalo más tarde.`
    case 'json':
      return 'Recibimos los datos, pero tienen un formato inválido.'
    case 'datos':
      return 'No hay información válida para mostrar en este momento.'
    default:
      return 'Ocurrió un error inesperado. Inténtalo nuevamente.'
  }
}
