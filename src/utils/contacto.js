// Validación del formulario de contacto. Funciones puras: reciben los valores
// y devuelven los errores, sin tocar la interfaz.

export const CAMPOS_VACIOS = { nombre: '', email: '', mensaje: '' }

export const LARGO_MAXIMO_MENSAJE = 500
const LARGO_MINIMO_MENSAJE = 10

// Comprueba la forma, no que la dirección exista: solo descarta emails claramente mal escritos.
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Devuelve { campo: mensaje } solo con los campos que tienen problemas.
// El orden de las claves sigue el del formulario.
export function validarContacto({ nombre, email, mensaje }) {
  const errores = {}

  const nombreLimpio = nombre.trim()
  if (nombreLimpio === '') {
    errores.nombre = 'Ingresa tu nombre.'
  } else if (nombreLimpio.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.'
  }

  const emailLimpio = email.trim()
  if (emailLimpio === '') {
    errores.email = 'Ingresa tu email para que podamos responderte.'
  } else if (!PATRON_EMAIL.test(emailLimpio)) {
    errores.email = 'El email no tiene un formato válido (ej. nombre@correo.cl).'
  }

  const largoMensaje = mensaje.trim().length
  if (largoMensaje === 0) {
    errores.mensaje = 'Escribe tu mensaje.'
  } else if (largoMensaje < LARGO_MINIMO_MENSAJE) {
    errores.mensaje = `El mensaje debe tener al menos ${LARGO_MINIMO_MENSAJE} caracteres (llevas ${largoMensaje}).`
  }

  return errores
}