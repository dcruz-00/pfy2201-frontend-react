import { useState } from 'react'
import Estado from './Estado.jsx'
import { CAMPOS_VACIOS, LARGO_MAXIMO_MENSAJE, validarContacto } from '../utils/contacto.js'

function FormularioContacto() {
  const [valores, setValores] = useState(CAMPOS_VACIOS)
  const [errores, setErrores] = useState({})
  // Los errores aparecen recién tras el primer intento de envío, para no marcar
  // como incorrecto lo que la persona todavía está escribiendo.
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  // Nombre de quien envió el último mensaje; null si no hay confirmación que mostrar.
  const [enviadoPor, setEnviadoPor] = useState(null)

  function manejarCambio(event) {
    const { name, value } = event.target
    const nuevos = { ...valores, [name]: value }
    setValores(nuevos)
    setEnviadoPor(null)
    // Tras un intento fallido, los errores se actualizan a medida que se corrigen.
    if (intentoEnvio) setErrores(validarContacto(nuevos))
  }

  function manejarEnvio(event) {
    event.preventDefault()
    const encontrados = validarContacto(valores)
    const camposConError = Object.keys(encontrados)

    if (camposConError.length > 0) {
      setErrores(encontrados)
      setIntentoEnvio(true)
      setEnviadoPor(null)
      event.currentTarget.elements[camposConError[0]].focus()
      return
    }

    // Sin backend: el envío se considera exitoso una vez validados los datos.
    setEnviadoPor(valores.nombre.trim())
    setValores(CAMPOS_VACIOS)
    setErrores({})
    setIntentoEnvio(false)
  }

  // Atributos comunes de los tres campos.
  function propsCampo(campo) {
    const error = errores[campo]
    return {
      id: `contacto-${campo}`,
      name: campo,
      value: valores[campo],
      onChange: manejarCambio,
      className: error ? 'form-control is-invalid' : 'form-control',
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': error ? `contacto-${campo}-error` : undefined,
    }
  }

  const cantidadErrores = Object.keys(errores).length
  let estado = { tipo: null }
  if (cantidadErrores > 0) {
    estado = {
      tipo: 'error',
      mensaje: cantidadErrores === 1
        ? 'Revisa el campo marcado para poder enviar tu mensaje.'
        : `Revisa los ${cantidadErrores} campos marcados para poder enviar tu mensaje.`,
    }
  } else if (enviadoPor) {
    estado = { tipo: 'exito', mensaje: `¡Gracias, ${enviadoPor}! Recibimos tu mensaje y te responderemos por email.` }
  }

  return (
    <section className="box" id="contacto">
      <div className="container">
        <h2>Escríbenos</h2>
        <p>¿Buscas un juego que no está en el catálogo o tienes dudas sobre un pedido? Déjanos tu mensaje.</p>

        {/* noValidate: la validación la hace validarContacto, con los mismos mensajes en todos los navegadores. */}
        <form className="formulario-contacto" noValidate onSubmit={manejarEnvio}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="contacto-nombre" className="form-label">Nombre</label>
              <input type="text" autoComplete="name" {...propsCampo('nombre')} />
              {errores.nombre && <div id="contacto-nombre-error" className="invalid-feedback">{errores.nombre}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="contacto-email" className="form-label">Email</label>
              <input type="email" autoComplete="email" {...propsCampo('email')} />
              {errores.email && <div id="contacto-email-error" className="invalid-feedback">{errores.email}</div>}
            </div>

            <div className="col-12">
              <label htmlFor="contacto-mensaje" className="form-label">Mensaje</label>
              <textarea rows={5} maxLength={LARGO_MAXIMO_MENSAJE} {...propsCampo('mensaje')}></textarea>
              <div className="form-text">{valores.mensaje.length}/{LARGO_MAXIMO_MENSAJE} caracteres</div>
              {errores.mensaje && <div id="contacto-mensaje-error" className="invalid-feedback">{errores.mensaje}</div>}
            </div>
          </div>

          <Estado tipo={estado.tipo} mensaje={estado.mensaje} />

          <button type="submit" className="btn btn-accion">Enviar mensaje</button>
        </form>
      </div>
    </section>
  )
}

export default FormularioContacto