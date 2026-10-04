// Mensaje de estado de una sección (cargando, error, sin resultados, info, éxito).
//   tipo:    'cargando' | 'error' | 'vacio' | 'info' | 'exito' | null
//   accion:  opcional, { texto, alClick }
//
// El contenedor se renderiza siempre, incluso vacío: los lectores de pantalla
// solo anuncian cambios en una región aria-live que ya existía.
function Estado({ tipo, mensaje, accion }) {
  return (
    <div className={tipo ? `estado estado-${tipo}` : 'estado'} aria-live="polite">
      {tipo === 'cargando' && (
        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
      )}
      {tipo && <span>{mensaje}</span>}
      {tipo && accion && (
        <button type="button" className="btn btn-secundario" onClick={accion.alClick}>
          {accion.texto}
        </button>
      )}
    </div>
  )
}

export default Estado
