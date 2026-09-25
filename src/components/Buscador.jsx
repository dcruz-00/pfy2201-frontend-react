// El filtrado ocurre en cada cambio del campo. campoRef permite al padre
// devolverle el foco (por ejemplo, tras "Limpiar filtros").
function Buscador({ termino, onCambiarTermino, campoRef }) {
  // El envío solo se intercepta para evitar la recarga: el filtro ya está aplicado.
  function manejarEnvio(event) {
    event.preventDefault()
  }

  return (
    <form className="buscador-productos" role="search" onSubmit={manejarEnvio}>
      <label htmlFor="buscarProducto" className="visually-hidden">Buscar producto</label>
      <input type="search" id="buscarProducto" name="buscarProducto" className="form-control"
        placeholder="Buscar por nombre (ej. Dreamcast, Mario...)" autoComplete="off"
        ref={campoRef}
        value={termino}
        onChange={(event) => onCambiarTermino(event.target.value)} />
      <button type="submit" className="btn btn-accion">Buscar</button>
    </form>
  )
}

export default Buscador
